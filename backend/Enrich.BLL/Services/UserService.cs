using System.Security.Claims;
using Enrich.BLL.Common;
using Enrich.BLL.DTOs;
using Enrich.BLL.Interfaces;
using Enrich.DAL.Data;
using Enrich.DAL.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Enrich.BLL.Services
{
    public class UserService(
        UserManager<User> userManager,
        ApplicationDbContext dbContext,
        ILogger<UserService> logger) : IUserService
    {
        public async Task<Result> UpdateProfileAsync(int userId, UpdateProfileDTO profileDto)
        {
            var user = await userManager.FindByIdAsync(userId.ToString());
            if (user == null)
            {
                logger.LogWarning("Attempt to update non-existing user with ID: {UserId}", userId);
                return "User not found.";
            }

            if (user.UserName != profileDto.Username)
            {
                var setUsernameResult = await userManager.SetUserNameAsync(user, profileDto.Username);

                if (!setUsernameResult.Succeeded)
                {
                    logger.LogError(
                        "Failed to change Username for {UserId}: {Errors}",
                        userId,
                        string.Join(", ", setUsernameResult.Errors.Select(e => e.Description)));

                    var errors = string.Join(", ", setUsernameResult.Errors.Select(e => e.Description));
                    return errors;
                }

                await userManager.UpdateNormalizedUserNameAsync(user);
            }

            var updateResult = await userManager.UpdateAsync(user);

            if (updateResult.Succeeded)
            {
                logger.LogInformation("Profile for user {UserId} successfully updated.", userId);
                return true;
            }
            else
            {
                logger.LogError(
                    "Error on final save of user {UserId}: {Errors}",
                    userId,
                    string.Join(", ", updateResult.Errors.Select(e => e.Description)));

                var errors = string.Join(", ", updateResult.Errors.Select(e => e.Description));
                return errors;
            }
        }

        public async Task<IEnumerable<UserDTO>> GetAllUsersAsync()
        {
            var users = await userManager.Users.ToListAsync();

            return [.. users.Select(u => new UserDTO
            {
                Id = u.Id,
                Username = u.UserName ?? string.Empty,
                Email = u.Email ?? string.Empty,
                CreatedAt = u.CreatedAt,
                IsLockedOut = u.LockoutEnd.HasValue && u.LockoutEnd > DateTimeOffset.UtcNow
            })];
        }

        public async Task<Result> RestrictUserAsync(RestrictAccountDTO dto)
        {
            var user = await userManager.FindByIdAsync(dto.UserId.ToString());
            if (user == null)
            {
                logger.LogWarning("Attempt to block non-existing user with ID: {UserId}", dto.UserId);
                return "User not found.";
            }

            var lockoutEndDate = DateTimeOffset.UtcNow.AddDays(dto.LockoutDays);
            var result = await userManager.SetLockoutEndDateAsync(user, lockoutEndDate);

            if (result.Succeeded)
            {
                await userManager.UpdateSecurityStampAsync(user);

                logger.LogInformation(
                    "User {UserId} successfully blocked until {LockoutEndDate}. Reason: {Reason}",
                    dto.UserId,
                    lockoutEndDate,
                    dto.Reason);

                return true;
            }
            else
            {
                logger.LogError(
                    "Error blocking user {UserId}: {Errors}",
                    dto.UserId,
                    string.Join(", ", result.Errors.Select(e => e.Description)));

                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                return errors;
            }
        }

        public async Task<Result> RestoreUserAsync(RestoreAccountDTO dto)
        {
            var user = await userManager.FindByIdAsync(dto.UserId.ToString());
            if (user == null)
            {
                logger.LogWarning("Attempt to unblock non-existing user with ID: {UserId}", dto.UserId);
                return "User not found.";
            }

            var result = await userManager.SetLockoutEndDateAsync(user, null);

            if (result.Succeeded)
            {
                await userManager.UpdateSecurityStampAsync(user);

                logger.LogInformation("Account of user {UserId} successfully unblocked.", dto.UserId);
                return true;
            }
            else
            {
                logger.LogError(
                    "Error unblocking user {UserId}: {Errors}",
                    dto.UserId,
                    string.Join(", ", result.Errors.Select(e => e.Description)));

                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                return errors;
            }
        }

        public async Task<UserDTO?> GetCurrentUserProfileAsync(ClaimsPrincipal userPrincipal)
        {
            var user = await userManager.GetUserAsync(userPrincipal);
            if (user == null)
            {
                return null;
            }

            return new UserDTO
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                Username = user.UserName ?? string.Empty,
                CreatedAt = user.CreatedAt
            };
        }

        public int? GetCurrentUserId(ClaimsPrincipal userPrincipal)
        {
            var userIdString = userManager.GetUserId(userPrincipal);
            if (int.TryParse(userIdString, out var userId))
            {
                return userId;
            }

            return null;
        }

        public async Task<IEnumerable<QuizAttemptDTO>> GetUserQuizHistoryAsync(int userId)
        {
            var attempts = await dbContext.QuizAttempts
                .Where(qa => qa.UserId == userId)
                .OrderByDescending(qa => qa.StartedAt ?? DateTime.MinValue)
                .Select(qa => new QuizAttemptDTO
                {
                    Id = qa.Id,
                    StartedAt = qa.StartedAt,
                    FinishedAt = qa.FinishedAt,
                    ScorePercentage = qa.ScorePercentage
                })
                .ToListAsync();

            return attempts;
        }
    }
}