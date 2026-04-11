using Enrich.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Enrich.DAL.Data.Configurations
{
    public class SavedFlashcardConfiguration : IEntityTypeConfiguration<SavedFlashcard>
    {
        public void Configure(EntityTypeBuilder<SavedFlashcard> builder)
        {
            _ = builder.ToTable("saved_flashcards");

            _ = builder.HasKey(sf => new { sf.UserId, sf.FlashcardId });
            _ = builder.Property(sf => sf.UserId).HasColumnName("user_id");
            _ = builder.Property(sf => sf.FlashcardId).HasColumnName("flashcard_id");

            _ = builder.HasOne(sf => sf.User)
                .WithMany(u => u.SavedFlashcards)
                .HasForeignKey(sf => sf.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            _ = builder.HasOne(sf => sf.Flashcard)
                .WithMany(f => f.SavedByUsers)
                .HasForeignKey(sf => sf.FlashcardId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
