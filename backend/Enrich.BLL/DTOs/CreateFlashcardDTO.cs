namespace Enrich.BLL.DTOs
{
    public class CreateFlashcardDTO
    {
        public string Word { get; set; } = null!;

        public string? DifficultyLevel { get; set; }

        public string? Translation { get; set; }

        public string? PartOfSpeech { get; set; }

        public string? Transcription { get; set; }

        public string? Meaning { get; set; }

        public string? Example { get; set; }
    }
}
