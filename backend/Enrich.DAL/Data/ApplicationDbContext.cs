using System.Reflection;
using Enrich.DAL.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Enrich.DAL.Data
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : IdentityDbContext<User, IdentityRole<int>, int>(options)
    {
        public DbSet<UserSettings> UserSettings { get; set; }

        public DbSet<Flashcard> Flashcards { get; set; }

        public DbSet<SavedFlashcard> SavedFlashcards { get; set; }

        public DbSet<QuizAttempt> QuizAttempts { get; set; }

        public DbSet<QuizAnswer> QuizAnswers { get; set; }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker
                .Entries()
                .Where(e => e.Entity is Flashcard && e.State == EntityState.Added);

            foreach (var entityEntry in entries)
            {
                var flashcard = (Flashcard)entityEntry.Entity;
                flashcard.CreatedAt = DateTime.UtcNow;
            }

            return base.SaveChangesAsync(cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            _ = modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

            // Re-apply Identity table names mapping to keep simpler if needed, though UserConfiguration sets "users"
            // If they want entirely simpler schema, identity creates extra tables like AspNetUserRoles.
            // We'll leave the defaults for those.
        }
    }
}