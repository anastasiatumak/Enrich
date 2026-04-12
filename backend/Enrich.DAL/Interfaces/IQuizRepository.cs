using Enrich.DAL.Entities;

namespace Enrich.DAL.Interfaces
{
    public interface IQuizRepository
    {
        Task<QuizAttempt> AddAttemptAsync(QuizAttempt attempt, CancellationToken cancellationToken = default);

        Task<IEnumerable<QuizAttempt>> GetUserHistoryAsync(int userId, CancellationToken cancellationToken = default);

        Task<QuizAttempt?> GetAttemptByIdAsync(int id, CancellationToken cancellationToken = default);
    }
}
