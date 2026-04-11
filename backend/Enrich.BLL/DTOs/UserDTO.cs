namespace Enrich.BLL.DTOs
{
    public class UserDTO
    {
        public int Id { get; set; }

        public string Username { get; set; } = null!;

        public string Email { get; set; } = null!;

        public bool IsLockedOut { get; set; }
    }
}