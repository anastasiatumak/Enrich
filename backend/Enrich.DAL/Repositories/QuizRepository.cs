using Enrich.DAL.Data;
using Enrich.DAL.Entities;
using Enrich.DAL.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Enrich.DAL.Repositories
{
    public class QuizRepository(ApplicationDbContext context) : IQuizRepository
    {
        public async Task<QuizAttempt> AddAttemptAsync(QuizAttempt attempt, CancellationToken cancellationToken = default)
        {
            await context.QuizAttempts.AddAsync(attempt, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            return attempt;
        }

        public async Task<IEnumerable<QuizAttempt>> GetUserHistoryAsync(int userId, CancellationToken cancellationToken = default)
        {
            return await context.QuizAttempts
                .Where(q => q.UserId == userId)
                .OrderByDescending(q => q.FinishedAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<QuizAttempt?> GetAttemptByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            return await context.QuizAttempts
                .Include(q => q.Answers)
                .FirstOrDefaultAsync(q => q.Id == id, cancellationToken);
        }
    }
}
