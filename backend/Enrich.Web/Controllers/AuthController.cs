using Enrich.BLL.DTOs;
using Enrich.BLL.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Enrich.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserSignupDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.RegisterUserAsync(dto);

            if (result.IsSuccess)
            {
                return Ok(new { message = "Registration successful." });
            }

            return BadRequest(new { message = result.ErrorMessage });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.LoginAsync(dto);

            if (result.IsSuccess)
            {
                return Ok(new { message = "Login successful." });
            }

            return Unauthorized(new { message = result.ErrorMessage });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _authService.LogoutAsync();
            return Ok(new { message = "Logout successful." });
        }
    }
}
