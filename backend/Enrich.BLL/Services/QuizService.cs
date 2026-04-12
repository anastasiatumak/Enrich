using Enrich.BLL.DTOs;
using Enrich.BLL.Interfaces;
using Enrich.DAL.Entities;
using Enrich.DAL.Interfaces;
using Microsoft.Extensions.Logging;

namespace Enrich.BLL.Services
{
    public class QuizService(
        IQuizRepository quizRepository,
        IFlashcardRepository flashcardRepository,
        ILogger<QuizService> logger) : IQuizService
    {
        public async Task<IEnumerable<FlashcardDTO>> GetRandomSavedFlashcardsAsync(int userId, int count, CancellationToken cancellationToken = default)
        {
            var personalCollection = await flashcardRepository.GetPersonalCollectionAsync(userId, cancellationToken);

            // Randomize and take 'count'
            var randomSet = personalCollection
                .OrderBy(_ => Guid.NewGuid())
                .Take(count)
                .Select(f => new FlashcardDTO
                {
                    Id = f.Id,
                    Word = f.Word,
                    Translation = f.Translation,
                    Transcription = f.Transcription,
                    Meaning = f.Meaning,
                    PartOfSpeech = f.PartOfSpeech,
                    Example = f.Example,
                    DifficultyLevel = f.DifficultyLevel,
                    CreatedAt = f.CreatedAt,
                    IsSaved = true,
                    IsPersonal = f.CreatedById == userId
                });

            return randomSet;
        }

        public async Task<QuizAttemptDTO> SaveQuizResultAsync(int userId, QuizResultDTO result, CancellationToken cancellationToken = default)
        {
            var correctCount = result.Answers.Count(a => a.IsKnown);
            var totalCount = result.Answers.Count;
            var scorePercentage = totalCount > 0 ? (int)((double)correctCount / totalCount * 100) : 0;

            var attempt = new QuizAttempt
            {
                UserId = userId,
                StartedAt = result.StartedAt,
                FinishedAt = result.FinishedAt,
                ScorePercentage = scorePercentage,
                Answers = result.Answers.Select(a => new QuizAnswer
                {
                    FlashcardId = a.FlashcardId,
                    IsKnown = a.IsKnown
                }).ToList()
            };

            var savedAttempt = await quizRepository.AddAttemptAsync(attempt, cancellationToken);

            logger.LogInformation("User {UserId} completed quiz with score {Score}%", userId, scorePercentage);

            return new QuizAttemptDTO
            {
                Id = savedAttempt.Id,
                StartedAt = savedAttempt.StartedAt,
                FinishedAt = savedAttempt.FinishedAt,
                ScorePercentage = savedAttempt.ScorePercentage
            };
        }

        public async Task<IEnumerable<QuizAttemptDTO>> GetUserQuizHistoryAsync(int userId, CancellationToken cancellationToken = default)
        {
            var history = await quizRepository.GetUserHistoryAsync(userId, cancellationToken);
            return history.Select(h => new QuizAttemptDTO
            {
                Id = h.Id,
                StartedAt = h.StartedAt,
                FinishedAt = h.FinishedAt,
                ScorePercentage = h.ScorePercentage
            });
        }
    }
}
