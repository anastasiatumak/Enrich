using Enrich.DAL.Entities;

namespace Enrich.DAL.Interfaces
{
    public interface IFlashcardRepository
    {
        Task<Flashcard?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

        Task<IEnumerable<Flashcard>> GetAllAsync(CancellationToken cancellationToken = default);

        Task<Flashcard> AddAsync(Flashcard flashcard, CancellationToken cancellationToken = default);

        Task UpdateAsync(Flashcard flashcard, CancellationToken cancellationToken = default);

        Task DeleteAsync(int id, CancellationToken cancellationToken = default);

        Task<IEnumerable<Flashcard>> GetSystemFlashcardsAsync(CancellationToken cancellationToken = default);

        Task<IEnumerable<Flashcard>> GetPersonalCollectionAsync(int userId, CancellationToken cancellationToken = default);

        Task SaveFlashcardAsync(int userId, int flashcardId, CancellationToken cancellationToken = default);

        Task UnsaveFlashcardAsync(int userId, int flashcardId, CancellationToken cancellationToken = default);

        Task<bool> IsFlashcardSavedByUserAsync(int userId, int flashcardId, CancellationToken cancellationToken = default);
    }
}
