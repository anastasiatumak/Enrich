using Enrich.BLL.Common;
using Enrich.BLL.DTOs;

namespace Enrich.BLL.Interfaces
{
    public interface IFlashcardService
    {
        Task<Result> CreateFlashcardAsync(int userId, CreateFlashcardDTO dto);

        Task<Result> UpdateFlashcardAsync(int userId, UpdateFlashcardDTO dto);

        Task<Result> DeleteFlashcardAsync(int userId, int flashcardId);

        Task<IEnumerable<FlashcardDTO>> GetSystemFlashcardsAsync(int userId);

        Task<IEnumerable<FlashcardDTO>> GetPersonalCollectionAsync(int userId);

        Task<Result> SaveFlashcardAsync(int userId, int flashcardId);

        Task<Result> UnsaveFlashcardAsync(int userId, int flashcardId);
    }
}
