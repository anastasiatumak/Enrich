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

        public UsersController(IUserService userService)
        {
            _userService = userService;
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
    }
}
