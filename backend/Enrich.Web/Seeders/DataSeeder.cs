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
                },
                new Flashcard
                {
                    Word = "Innermost",
                    Translation = "Найпотаємніший",
                    Transcription = "ˈɪnərməʊst",
                    Meaning = "Most secret and hidden.",
                    PartOfSpeech = "Adjective",
                    Example = "This was the diary in which Gina recorded her innermost thoughts and secrets.",
                    DifficultyLevel = "B2",
                    CreatedById = null,
                    CreatedAt = DateTime.UtcNow
                },
                new Flashcard
                {
                    Word = "Ubiquitous",
                    Translation = "Всюдисущий",
                    Transcription = "juːˈbɪkwɪtəs",
                    Meaning = "Present, appearing, or found everywhere.",
                    PartOfSpeech = "Adjective",
                    Example = "Mobile phones are ubiquitous in modern society.",
                    DifficultyLevel = "C1",
                    CreatedById = null,
                    CreatedAt = DateTime.UtcNow
                },
                new Flashcard
                {
                    Word = "Ephemeral",
                    Translation = "Ефемерний",
                    Transcription = "ɪˈfɛmərəl",
                    Meaning = "Lasting for a very short time.",
                    PartOfSpeech = "Adjective",
                    Example = "Fashions are ephemeral: new styles come as quickly as they go.",
                    DifficultyLevel = "C2",
                    CreatedById = null,
                    CreatedAt = DateTime.UtcNow
                },
                new Flashcard
                {
                    Word = "Ambiguous",
                    Translation = "Двозначний",
                    Transcription = "æmˈbɪɡjuəs",
                    Meaning = "Open to more than one interpretation; not having one obvious meaning.",
                    PartOfSpeech = "Adjective",
                    Example = "The ending of the movie was ambiguous, leaving many questions unanswered.",
                    DifficultyLevel = "B2",
                    CreatedById = null,
                    CreatedAt = DateTime.UtcNow
                },
                new Flashcard
                {
                    Word = "Pragmatic",
                    Translation = "Прагматичний",
                    Transcription = "præɡˈmætɪk",
                    Meaning = "Dealing with things sensibly and realistically based on practical considerations.",
                    PartOfSpeech = "Adjective",
                    Example = "We need to take a pragmatic approach to solve this problem.",
                    DifficultyLevel = "B1",
                    CreatedById = null,
                    CreatedAt = DateTime.UtcNow
                },
                new Flashcard
                {
                    Word = "Meticulous",
                    Translation = "Ретельний",
                    Transcription = "meˈtɪkjələs",
                    Meaning = "Showing great attention to detail; very careful and precise.",
                    PartOfSpeech = "Adjective",
                    Example = "He was meticulous about his work and never made a mistake.",
                    DifficultyLevel = "C1",
                    CreatedById = null,
                    CreatedAt = DateTime.UtcNow
                },
                new Flashcard
                {
                    Word = "Luminous",
                    Translation = "Світний",
                    Transcription = "ˈluːmɪnəs",
                    Meaning = "Full of or shedding light; bright or shining, especially in the dark.",
                    PartOfSpeech = "Adjective",
                    Example = "The watch has a luminous face so you can see it at night.",
                    DifficultyLevel = "B2",
                    CreatedById = null,
                    CreatedAt = DateTime.UtcNow
                },
                new Flashcard
                {
                    Word = "Benevolent",
                    Translation = "Доброзичливий",
                    Transcription = "bəˈnɛvələnt",
                    Meaning = "Well-meaning and kindly.",
                    PartOfSpeech = "Adjective",
                    Example = "A benevolent uncle paid for her college tuition.",
                    DifficultyLevel = "B2",
                    CreatedById = null,
                    CreatedAt = DateTime.UtcNow
                },
                new Flashcard
                {
                    Word = "Eloquent",
                    Translation = "Красномовний",
                    Transcription = "ˈɛləkwənt",
                    Meaning = "Fluent or persuasive in speaking or writing.",
                    PartOfSpeech = "Adjective",
                    Example = "She gave an eloquent speech about human rights.",
                    DifficultyLevel = "C1",
                    CreatedById = null,
                    CreatedAt = DateTime.UtcNow
                },
                new Flashcard
                {
                    Word = "Humble",
                    Translation = "Скромний",
                    Transcription = "ˈhʌmbəl",
                    Meaning = "Having or showing a modest or low estimate of one's importance.",
                    PartOfSpeech = "Adjective",
                    Example = "He is a humble man who never brags about his success.",
                    DifficultyLevel = "B1",
                    CreatedById = null,
                    CreatedAt = DateTime.UtcNow
                },
                new Flashcard
                {
                    Word = "Serendipity",
                    Translation = "Щасливий випадок",
                    Transcription = "ˌsɛrənˈdɪpɪti",
                    Meaning = "The occurrence and development of events by chance in a happy or beneficial way.",
                    PartOfSpeech = "Noun",
                    Example = "Finding my best friend at the airport was pure serendipity.",
                    DifficultyLevel = "C2",
                    CreatedById = null,
                    CreatedAt = DateTime.UtcNow
                },
                new Flashcard
                {
                    Word = "Scarcity",
                    Translation = "Дефіцит",
                    Transcription = "ˈskɛərsɪti",
                    Meaning = "The state of being scarce or in short supply; shortage.",
                    PartOfSpeech = "Noun",
                    Example = "The scarcity of water is a major concern in the desert.",
                    DifficultyLevel = "B2",
                    CreatedById = null,
                    CreatedAt = DateTime.UtcNow
                }
            };

            foreach (var card in globalFlashcards)
            {
                if (!await db.Flashcards.AnyAsync(f => f.Word == card.Word && f.CreatedById == null))
                {
                    db.Flashcards.Add(card);
                }
            }

            await db.SaveChangesAsync();
        }
    }
}