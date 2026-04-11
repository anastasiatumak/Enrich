namespace Enrich.DAL.Entities
{
    public class QuizAttempt
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public DateTime? StartedAt { get; set; }

        public DateTime? FinishedAt { get; set; }

        public int? ScorePercentage { get; set; }

        public virtual User User { get; set; } = null!;

        public virtual ICollection<QuizAnswer> Answers { get; set; } = new List<QuizAnswer>();
    }
}
