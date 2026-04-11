using Enrich.DAL.Data;
using Enrich.DAL.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Enrich.WebAPI.Seeders
{
    public static class DataSeeder
    {
        public static async Task SeedRolesAndAdminAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var roles = new[] { "Admin", "User" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole<int>(role));
                }
            }

            var adminEmail = "admin@enrich.com";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);

            if (adminUser == null)
            {
                var newAdmin = new User
                {
                    UserName = "SuperAdmin",
                    Email = adminEmail,
                    EmailConfirmed = true,
                    Role = "Admin",
                    CreatedAt = DateTime.UtcNow
                };

                var createPowerUser = await userManager.CreateAsync(newAdmin, "AdminPassword123!");
                if (createPowerUser.Succeeded)
                {
                    await userManager.AddToRoleAsync(newAdmin, "Admin");
                }
            }

            await SeedSystemFlashcardsAsync(dbContext);
        }

        private static async Task SeedSystemFlashcardsAsync(ApplicationDbContext db)
        {
            if (await db.Flashcards.AnyAsync(f => f.CreatedById == null))
            {
                return;
            }

            var globalFlashcards = new List<Flashcard>
            {
                new Flashcard
                {
                    Word = "Resilient",
                    Translation = "Стійкий",
                    Transcription = "rɪˈzɪliənt",
                    Meaning = "Able to withstand or recover quickly from difficult conditions.",
                    PartOfSpeech = "Adjective",
                    Example = "The community was resilient in the face of the disaster.",
                    DifficultyLevel = "B2",
                    CreatedById = null,
                    CreatedAt = DateTime.UtcNow
                },
                new Flashcard
                {
                    Word = "Algorithm",
                    Translation = "Алгоритм",
                    Transcription = "ˈælɡərɪðəm",
                    Meaning = "A process or set of rules to be followed in calculations.",
                    PartOfSpeech = "Noun",
                    Example = "The social media algorithm determines what content you see.",
                    DifficultyLevel = "B1",
                    CreatedById = null,
                    CreatedAt = DateTime.UtcNow
                },
                new Flashcard
                {
                    Word = "Biodiversity",
                    Translation = "Біорізноманіття",
                    Transcription = "ˌbaɪəʊdaɪˈvɜːsəti",
                    Meaning = "The variety of plant and animal life in the world.",
                    PartOfSpeech = "Noun",
                    Example = "The rainforest is a hotspot of biodiversity.",
                    DifficultyLevel = "C1",
                    CreatedById = null,
                    CreatedAt = DateTime.UtcNow
                }
            };

            db.Flashcards.AddRange(globalFlashcards);
            await db.SaveChangesAsync();
        }
    }
}