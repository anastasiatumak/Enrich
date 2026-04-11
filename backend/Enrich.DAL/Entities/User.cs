using Microsoft.AspNetCore.Identity;

namespace Enrich.DAL.Entities
{
    public class User : IdentityUser<int>
    {
        public string Role { get; set; } = null!;

        public DateTime CreatedAt { get; set; }

        public virtual UserSettings? Settings { get; set; }

        public virtual ICollection<Flashcard> CreatedFlashcards { get; set; } = new List<Flashcard>();

        public virtual ICollection<SavedFlashcard> SavedFlashcards { get; set; } = new List<SavedFlashcard>();

        public virtual ICollection<QuizAttempt> QuizAttempts { get; set; } = new List<QuizAttempt>();
    }
}
