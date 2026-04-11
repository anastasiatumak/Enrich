namespace Enrich.DAL.Entities
{
    public class QuizAnswer
    {
        public int Id { get; set; }

        public int AttemptId { get; set; }

        public int FlashcardId { get; set; }

        public bool IsKnown { get; set; }

        public virtual QuizAttempt Attempt { get; set; } = null!;

        public virtual Flashcard Flashcard { get; set; } = null!;
    }
}
