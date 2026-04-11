namespace Enrich.DAL.Entities
{
    public class Flashcard
    {
        public int Id { get; set; }

        public string Word { get; set; } = null!;

        public string? DifficultyLevel { get; set; }

        public string? Translation { get; set; }

        public string? PartOfSpeech { get; set; }

        public string? Transcription { get; set; }

        public string? Meaning { get; set; }

        public string? Example { get; set; }

        public int? CreatedById { get; set; }

        public DateTime CreatedAt { get; set; }

        public virtual User? CreatedBy { get; set; }

        public virtual ICollection<SavedFlashcard> SavedByUsers { get; set; } = new List<SavedFlashcard>();

        public virtual ICollection<QuizAnswer> QuizAnswers { get; set; } = new List<QuizAnswer>();
    }
}
