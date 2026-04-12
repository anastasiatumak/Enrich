using Enrich.BLL.Common;
using Enrich.BLL.DTOs;

namespace Enrich.BLL.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserDTO>> GetAllUsersAsync();

        Task<Result> UpdateProfileAsync(int userId, UpdateProfileDTO profileDto);

        Task<Result> UpdatePasswordAsync(int userId, UpdatePasswordDTO dto);

        Task<UserSettingsDTO> GetUserSettingsAsync(int userId);

        Task<Result> UpdateUserSettingsAsync(int userId, UserSettingsDTO dto);

        Task<Result> RestrictUserAsync(RestrictAccountDTO dto);

        Task<Result> RestoreUserAsync(RestoreAccountDTO dto);

        Task<UserDTO?> GetCurrentUserProfileAsync(System.Security.Claims.ClaimsPrincipal userPrincipal);

        int? GetCurrentUserId(System.Security.Claims.ClaimsPrincipal userPrincipal);

        Task<IEnumerable<QuizAttemptDTO>> GetUserQuizHistoryAsync(int userId);
    }
}
