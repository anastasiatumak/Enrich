namespace Enrich.BLL.DTOs
{
    public class RestrictAccountDTO
    {
        public int UserId { get; set; }

        public int LockoutDays { get; set; }

        public string Reason { get; set; } = null!;
    }
}
