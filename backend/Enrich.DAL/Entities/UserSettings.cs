namespace Enrich.DAL.Entities
{
    public class UserSettings
    {
        public int UserId { get; set; }

        public string? Theme { get; set; }

        public string? Language { get; set; }

        public virtual User User { get; set; } = null!;
    }
}
