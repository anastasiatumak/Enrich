using Enrich.BLL.DTOs;

namespace Enrich.BLL.Interfaces
{
    public interface IQuizService
    {
        Task<IEnumerable<FlashcardDTO>> GetRandomSavedFlashcardsAsync(int userId, int count, CancellationToken cancellationToken = default);

        Task<QuizAttemptDTO> SaveQuizResultAsync(int userId, QuizResultDTO result, CancellationToken cancellationToken = default);

        Task<IEnumerable<QuizAttemptDTO>> GetUserQuizHistoryAsync(int userId, CancellationToken cancellationToken = default);
    }
}
