using Enrich.BLL.Common;
using Enrich.BLL.DTOs;
using Enrich.BLL.Interfaces;
using Enrich.DAL.Entities;
using Enrich.DAL.Interfaces;
using Microsoft.Extensions.Logging;

namespace Enrich.BLL.Services
{
    public class FlashcardService(
        IFlashcardRepository flashcardRepository,
        ILogger<FlashcardService> logger) : IFlashcardService
    {
        public async Task<Result> CreateFlashcardAsync(int userId, CreateFlashcardDTO dto)
        {
            var flashcard = new Flashcard
            {
                Word = dto.Word.Trim(),
                Translation = dto.Translation?.Trim(),
                Transcription = dto.Transcription?.Trim(),
                Meaning = dto.Meaning?.Trim(),
                PartOfSpeech = dto.PartOfSpeech?.Trim(),
                Example = dto.Example?.Trim(),
                DifficultyLevel = dto.DifficultyLevel?.Trim(),
                CreatedById = userId,
                CreatedAt = DateTime.UtcNow
            };

            var createdCard = await flashcardRepository.AddAsync(flashcard);

            // Automatically save it for the user who created it
            await flashcardRepository.SaveFlashcardAsync(userId, createdCard.Id);

            logger.LogInformation("User {UserId} created new personal flashcard '{Word}' (ID: {FlashcardId}).", userId, createdCard.Word, createdCard.Id);

            return true;
        }

        public async Task<Result> UpdateFlashcardAsync(int userId, UpdateFlashcardDTO dto)
        {
            var flashcard = await flashcardRepository.GetByIdAsync(dto.Id);

            if (flashcard == null)
            {
                return "Flashcard not found.";
            }

            if (flashcard.CreatedById != userId)
            {
                return "You do not have permission to edit this flashcard. It may be a system flashcard or belong to another user.";
            }

            flashcard.Word = dto.Word.Trim();
            flashcard.Translation = dto.Translation?.Trim();
            flashcard.Transcription = dto.Transcription?.Trim();
            flashcard.Meaning = dto.Meaning?.Trim();
            flashcard.PartOfSpeech = dto.PartOfSpeech?.Trim();
            flashcard.Example = dto.Example?.Trim();
            flashcard.DifficultyLevel = dto.DifficultyLevel?.Trim();

            await flashcardRepository.UpdateAsync(flashcard);

            logger.LogInformation("Flashcard {FlashcardId} was updated by User {UserId}.", dto.Id, userId);

            return true;
        }

        public async Task<Result> DeleteFlashcardAsync(int userId, int flashcardId)
        {
            var flashcard = await flashcardRepository.GetByIdAsync(flashcardId);

            if (flashcard == null)
            {
                return "Flashcard not found.";
            }

            if (flashcard.CreatedById != userId)
            {
                return "You do not have permission to delete this flashcard. It may be a system flashcard or belong to another user.";
            }

            await flashcardRepository.DeleteAsync(flashcardId);

            logger.LogInformation("Flashcard {FlashcardId} was deleted by User {UserId}.", flashcardId, userId);

            return true;
        }

        public async Task<IEnumerable<FlashcardDTO>> GetSystemFlashcardsAsync(int userId)
        {
            var systemFlashcards = await flashcardRepository.GetSystemFlashcardsAsync();
            var savedFlashcards = await flashcardRepository.GetPersonalCollectionAsync(userId);
            var savedIds = savedFlashcards.Select(f => f.Id).ToHashSet();

            return systemFlashcards.Select(f => new FlashcardDTO
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
                IsSaved = savedIds.Contains(f.Id)
            });
        }

        public async Task<IEnumerable<FlashcardDTO>> GetPersonalCollectionAsync(int userId)
        {
            var personalFlashcards = await flashcardRepository.GetPersonalCollectionAsync(userId);

            // Everything in the personal collection is considered "saved" or "owned"
            // So we can visually mark it as true for the user.
            return personalFlashcards.Select(f => new FlashcardDTO
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
                IsSaved = true
            });
        }

        public async Task<Result> SaveFlashcardAsync(int userId, int flashcardId)
        {
            var flashcard = await flashcardRepository.GetByIdAsync(flashcardId);
            if (flashcard == null)
            {
                return "Flashcard not found.";
            }

            await flashcardRepository.SaveFlashcardAsync(userId, flashcardId);
            return true;
        }

        public async Task<Result> UnsaveFlashcardAsync(int userId, int flashcardId)
        {
            // Optional: prevent unsaving of own cards, but let's just let them unsave them if they want
            // they will just disappear from personal collection, which is fine.
            await flashcardRepository.UnsaveFlashcardAsync(userId, flashcardId);
            return true;
        }
    }
}
