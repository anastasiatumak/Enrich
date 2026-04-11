using Enrich.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Enrich.DAL.Data.Configurations
{
    public class FlashcardConfiguration : IEntityTypeConfiguration<Flashcard>
    {
        public void Configure(EntityTypeBuilder<Flashcard> builder)
        {
            _ = builder.ToTable("flashcards");

            _ = builder.HasKey(f => f.Id);
            _ = builder.Property(f => f.Id).HasColumnName("flashcard_id").UseIdentityColumn();

            _ = builder.Property(f => f.Word).IsRequired().HasMaxLength(255).HasColumnName("word");
            _ = builder.Property(f => f.DifficultyLevel).HasMaxLength(50).HasColumnName("difficulty_level");
            _ = builder.Property(f => f.Translation).HasMaxLength(255).HasColumnName("translation");
            _ = builder.Property(f => f.PartOfSpeech).HasMaxLength(100).HasColumnName("part_of_speech");
            _ = builder.Property(f => f.Transcription).HasMaxLength(255).HasColumnName("transcription");
            _ = builder.Property(f => f.Meaning).HasColumnType("text").HasColumnName("meaning");
            _ = builder.Property(f => f.Example).HasColumnType("text").HasColumnName("example");

            _ = builder.Property(f => f.CreatedById).HasColumnName("created_by");
            _ = builder.Property(f => f.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("created_at");

            _ = builder.HasOne(f => f.CreatedBy)
                .WithMany(u => u.CreatedFlashcards)
                .HasForeignKey(f => f.CreatedById)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
