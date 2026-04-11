namespace Enrich.BLL.DTOs
{
    public class QuizAttemptDTO
    {
        public int Id { get; set; }

        public DateTime? StartedAt { get; set; }

        public DateTime? FinishedAt { get; set; }

        public int? ScorePercentage { get; set; }
    }
}
