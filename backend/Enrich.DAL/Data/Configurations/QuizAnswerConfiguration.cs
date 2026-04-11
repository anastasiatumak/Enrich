using Enrich.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Enrich.DAL.Data.Configurations
{
    public class QuizAnswerConfiguration : IEntityTypeConfiguration<QuizAnswer>
    {
        public void Configure(EntityTypeBuilder<QuizAnswer> builder)
        {
            _ = builder.ToTable("quiz_answers");

            _ = builder.HasKey(qa => qa.Id);
            _ = builder.Property(qa => qa.Id).HasColumnName("answer_id").UseIdentityColumn();

            _ = builder.Property(qa => qa.AttemptId).HasColumnName("attempt_id");
            _ = builder.Property(qa => qa.FlashcardId).HasColumnName("flashcard_id");
            _ = builder.Property(qa => qa.IsKnown).HasColumnName("is_known");

            _ = builder.HasOne(qa => qa.Attempt)
                .WithMany(a => a.Answers)
                .HasForeignKey(qa => qa.AttemptId)
                .OnDelete(DeleteBehavior.Cascade);

            _ = builder.HasOne(qa => qa.Flashcard)
                .WithMany(f => f.QuizAnswers)
                .HasForeignKey(qa => qa.FlashcardId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
