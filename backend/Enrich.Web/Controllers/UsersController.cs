using Enrich.BLL.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Enrich.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IAuthService _authService;

        public UsersController(IUserService userService, IAuthService authService)
        {
            _userService = userService;
            _authService = authService;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUserProfile()
        {
            var userDto = await _userService.GetCurrentUserProfileAsync(User);

            if (userDto == null)
            {
                return NotFound(new { message = "User not found." });
            }

            return Ok(userDto);
        }

        [HttpGet("me/history")]
        public async Task<IActionResult> GetUserQuizHistory()
        {
            var userId = _userService.GetCurrentUserId(User);
            if (userId == null)
            {
                return Unauthorized();
            }

            var history = await _userService.GetUserQuizHistoryAsync(userId.Value);
            return Ok(history);
        }

        [HttpPut("me/password")]
        public async Task<IActionResult> UpdatePassword([FromBody] Enrich.BLL.DTOs.UpdatePasswordDTO dto)
        {
            var userId = _userService.GetCurrentUserId(User);
            if (userId == null)
            {
                return Unauthorized();
            }

            var result = await _userService.UpdatePasswordAsync(userId.Value, dto);
            if (!result.IsSuccess)
            {
                return BadRequest(new { message = result.ErrorMessage });
            }

            await _authService.RefreshSignInAsync(userId.Value);

            return Ok(new { message = "Password updated successfully." });
        }

        [HttpGet("me/settings")]
        public async Task<IActionResult> GetUserSettings()
        {
            var userId = _userService.GetCurrentUserId(User);
            if (userId == null)
            {
                return Unauthorized();
            }

            var settings = await _userService.GetUserSettingsAsync(userId.Value);
            return Ok(settings);
        }

        [HttpPut("me/settings")]
        public async Task<IActionResult> UpdateUserSettings([FromBody] Enrich.BLL.DTOs.UserSettingsDTO dto)
        {
            var userId = _userService.GetCurrentUserId(User);
            if (userId == null)
            {
                return Unauthorized();
            }

            var result = await _userService.UpdateUserSettingsAsync(userId.Value, dto);
            if (!result.IsSuccess)
            {
                return BadRequest(new { message = result.ErrorMessage });
            }

            return Ok(new { message = "Settings updated successfully." });
        }

        [HttpPut("me/profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] Enrich.BLL.DTOs.UpdateProfileDTO dto)
        {
            var userId = _userService.GetCurrentUserId(User);
            if (userId == null)
            {
                return Unauthorized();
            }

            var result = await _userService.UpdateProfileAsync(userId.Value, dto);
            if (!result.IsSuccess)
            {
                return BadRequest(new { message = result.ErrorMessage });
            }

            await _authService.RefreshSignInAsync(userId.Value);

            return Ok(new { message = "Profile updated successfully." });
        }
    }
}
