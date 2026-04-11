using Enrich.DAL.Data;
using Enrich.DAL.Entities;
using Enrich.DAL.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Enrich.DAL.Repositories
{
    public class FlashcardRepository(ApplicationDbContext context) : IFlashcardRepository
    {
        public async Task<Flashcard?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            return await context.Flashcards
                .FirstOrDefaultAsync(f => f.Id == id, cancellationToken);
        }

        public async Task<IEnumerable<Flashcard>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return await context.Flashcards.ToListAsync(cancellationToken);
        }

        public async Task<Flashcard> AddAsync(Flashcard flashcard, CancellationToken cancellationToken = default)
        {
            await context.Flashcards.AddAsync(flashcard, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            return flashcard;
        }

        public async Task UpdateAsync(Flashcard flashcard, CancellationToken cancellationToken = default)
        {
            context.Flashcards.Update(flashcard);
            await context.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            var flashcard = await context.Flashcards.FindAsync([id], cancellationToken);
            if (flashcard != null)
            {
                context.Flashcards.Remove(flashcard);
                await context.SaveChangesAsync(cancellationToken);
            }
        }

        public async Task<IEnumerable<Flashcard>> GetSystemFlashcardsAsync(CancellationToken cancellationToken = default)
        {
            return await context.Flashcards
                .Where(f => f.CreatedById == null)
                .ToListAsync(cancellationToken);
        }

        public async Task<IEnumerable<Flashcard>> GetPersonalCollectionAsync(int userId, CancellationToken cancellationToken = default)
        {
            return await context.Flashcards
                .Where(f => f.CreatedById == userId || f.SavedByUsers.Any(s => s.UserId == userId))
                .Distinct()
                .ToListAsync(cancellationToken);
        }

        public async Task SaveFlashcardAsync(int userId, int flashcardId, CancellationToken cancellationToken = default)
        {
            var exists = await context.SavedFlashcards.AnyAsync(sf => sf.UserId == userId && sf.FlashcardId == flashcardId, cancellationToken);
            if (!exists)
            {
                var savedFlashcard = new SavedFlashcard { UserId = userId, FlashcardId = flashcardId };
                await context.SavedFlashcards.AddAsync(savedFlashcard, cancellationToken);
                await context.SaveChangesAsync(cancellationToken);
            }
        }

        public async Task UnsaveFlashcardAsync(int userId, int flashcardId, CancellationToken cancellationToken = default)
        {
            var savedFlashcard = await context.SavedFlashcards.FirstOrDefaultAsync(sf => sf.UserId == userId && sf.FlashcardId == flashcardId, cancellationToken);
            if (savedFlashcard != null)
            {
                context.SavedFlashcards.Remove(savedFlashcard);
                await context.SaveChangesAsync(cancellationToken);
            }
        }

        public async Task<bool> IsFlashcardSavedByUserAsync(int userId, int flashcardId, CancellationToken cancellationToken = default)
        {
            return await context.SavedFlashcards.AnyAsync(sf => sf.UserId == userId && sf.FlashcardId == flashcardId, cancellationToken);
        }
    }
}
