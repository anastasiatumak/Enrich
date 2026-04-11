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

        [Authorize]
        [HttpGet("global")]
        public async Task<ActionResult<IEnumerable<FlashcardDTO>>> GetGlobalFlashcards()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdString == null)
            {
                return Unauthorized();
            }

            int userId = int.Parse(userIdString);
            var flashcards = await _flashcardService.GetSystemFlashcardsAsync(userId);
            return Ok(flashcards);
        }

        [Authorize]
        [HttpGet("personal")]
        public async Task<ActionResult<IEnumerable<FlashcardDTO>>> GetPersonalFlashcards()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdString == null)
            {
                return Unauthorized();
            }

            int userId = int.Parse(userIdString);
            var flashcards = await _flashcardService.GetPersonalCollectionAsync(userId);
            return Ok(flashcards);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateFlashcard([FromBody] CreateFlashcardDTO dto)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdString == null)
            {
                return Unauthorized();
            }

            int userId = int.Parse(userIdString);
            var result = await _flashcardService.CreateFlashcardAsync(userId, dto);

            if (!result.IsSuccess)
            {
                return BadRequest(result.ErrorMessage);
            }

            return Ok();
        }

        [Authorize]
        [HttpPut]
        public async Task<IActionResult> UpdateFlashcard([FromBody] UpdateFlashcardDTO dto)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdString == null)
            {
                return Unauthorized();
            }

            int userId = int.Parse(userIdString);
            var result = await _flashcardService.UpdateFlashcardAsync(userId, dto);

            if (!result.IsSuccess)
            {
                return BadRequest(result.ErrorMessage);
            }

            return Ok();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFlashcard(int id)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdString == null)
            {
                return Unauthorized();
            }

            int userId = int.Parse(userIdString);
            var result = await _flashcardService.DeleteFlashcardAsync(userId, id);

            if (!result.IsSuccess)
            {
                return BadRequest(result.ErrorMessage);
            }

            return Ok();
        }

        [Authorize]
        [HttpPost("{id}/toggle-save")]
        public async Task<IActionResult> ToggleSaveFlashcard(int id)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdString == null)
            {
                return Unauthorized();
            }

            int userId = int.Parse(userIdString);

            // Check if already saved to toggle
            var personal = await _flashcardService.GetPersonalCollectionAsync(userId);
            bool isSaved = personal.Any(f => f.Id == id);

            if (isSaved)
            {
                await _flashcardService.UnsaveFlashcardAsync(userId, id);
                return Ok(new { isSaved = false });
            }
            else
            {
                await _flashcardService.SaveFlashcardAsync(userId, id);
                return Ok(new { isSaved = true });
            }
        }
    }
}
