using System.Security.Claims;
using Enrich.BLL.DTOs;
using Enrich.BLL.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Enrich.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizController : ControllerBase
    {
        private readonly IQuizService _quizService;

        public QuizController(IQuizService quizService)
        {
            _quizService = quizService;
        }

        [Authorize]
        [HttpGet("generate")]
        public async Task<ActionResult<IEnumerable<FlashcardDTO>>> GenerateQuiz([FromQuery] int count = 10)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdString == null)
            {
                return Unauthorized();
            }

            int userId = int.Parse(userIdString);
            var quizSet = await _quizService.GetRandomSavedFlashcardsAsync(userId, count);
            return Ok(quizSet);
        }

        [Authorize]
        [HttpPost("submit")]
        public async Task<ActionResult<QuizAttemptDTO>> SubmitQuiz([FromBody] QuizResultDTO result)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdString == null)
            {
                return Unauthorized();
            }

            int userId = int.Parse(userIdString);
            var attempt = await _quizService.SaveQuizResultAsync(userId, result);
            return Ok(attempt);
        }

        [Authorize]
        [HttpGet("history")]
        public async Task<ActionResult<IEnumerable<QuizAttemptDTO>>> GetHistory()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdString == null)
            {
                return Unauthorized();
            }

            int userId = int.Parse(userIdString);
            var history = await _quizService.GetUserQuizHistoryAsync(userId);
            return Ok(history);
        }
    }
}
