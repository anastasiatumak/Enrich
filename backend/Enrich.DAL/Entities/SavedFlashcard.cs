namespace Enrich.DAL.Entities
{
    public class SavedFlashcard
    {
        public int UserId { get; set; }

        public int FlashcardId { get; set; }

        public virtual User User { get; set; } = null!;

        public virtual Flashcard Flashcard { get; set; } = null!;
    }
}
