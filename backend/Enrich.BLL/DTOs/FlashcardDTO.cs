namespace Enrich.BLL.DTOs
{
    public class FlashcardDTO
    {
        public int Id { get; set; }

        public string Word { get; set; } = null!;

        public string? DifficultyLevel { get; set; }

        public string? Translation { get; set; }

        public string? PartOfSpeech { get; set; }

        public string? Transcription { get; set; }

        public string? Meaning { get; set; }

        public string? Example { get; set; }

        public DateTime CreatedAt { get; set; }

        public bool IsSaved { get; set; }
    }
}
