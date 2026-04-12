namespace Enrich.BLL.DTOs
{
    public class QuizResultDTO
    {
        public DateTime StartedAt { get; set; }

        public DateTime FinishedAt { get; set; }

        public List<QuizAnswerDTO> Answers { get; set; } = new();
    }

    public class QuizAnswerDTO
    {
        public int FlashcardId { get; set; }

        public bool IsKnown { get; set; }
    }
}
