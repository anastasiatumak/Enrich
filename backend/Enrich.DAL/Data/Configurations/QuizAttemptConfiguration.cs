using Enrich.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Enrich.DAL.Data.Configurations
{
    public class QuizAttemptConfiguration : IEntityTypeConfiguration<QuizAttempt>
    {
        public void Configure(EntityTypeBuilder<QuizAttempt> builder)
        {
            _ = builder.ToTable("quiz_attempts");

            _ = builder.HasKey(qa => qa.Id);
            _ = builder.Property(qa => qa.Id).HasColumnName("attempt_id").UseIdentityColumn();

            _ = builder.Property(qa => qa.UserId).HasColumnName("user_id");
            _ = builder.Property(qa => qa.StartedAt).HasColumnType("timestamp").HasColumnName("started_at");
            _ = builder.Property(qa => qa.FinishedAt).HasColumnType("timestamp").HasColumnName("finished_at");
            _ = builder.Property(qa => qa.ScorePercentage).HasColumnName("score_percentage");

            _ = builder.HasOne(qa => qa.User)
                .WithMany(u => u.QuizAttempts)
                .HasForeignKey(qa => qa.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
