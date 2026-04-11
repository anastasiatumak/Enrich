namespace Enrich.BLL.DTOs
{
    public class UpdateProfileDTO
    {
        public string Username { get; set; } = null!;

        // No bio/avatar fields because they were trimmed per schema
    }
}
