using System.Security.Claims;
using Enrich.BLL.DTOs;
using Enrich.BLL.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Enrich.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FlashcardsController : ControllerBase
    {
        private readonly IFlashcardService _flashcardService;

        public FlashcardsController(IFlashcardService flashcardService)
        {
            _flashcardService = flashcardService;
        }

        [HttpGet("system")]
        public async Task<ActionResult<IEnumerable<FlashcardDTO>>> GetSystemFlashcards()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int userId = int.TryParse(userIdString, out var id) ? id : 1;

            var flashcards = await _flashcardService.GetSystemFlashcardsAsync(userId);
            return Ok(flashcards);
        }
    }
}
