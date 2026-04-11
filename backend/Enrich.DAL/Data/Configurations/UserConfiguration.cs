using Enrich.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Enrich.DAL.Data.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            _ = builder.ToTable("users");

            _ = builder.Property(u => u.Id).HasColumnName("user_id").UseIdentityColumn();

            _ = builder.Property(u => u.UserName).IsRequired().HasMaxLength(255).HasColumnName("username");
            _ = builder.Property(u => u.Email).IsRequired().HasMaxLength(255).HasColumnName("email");
            _ = builder.Property(u => u.PasswordHash).IsRequired().HasMaxLength(255).HasColumnName("password_hash");
            _ = builder.Property(u => u.Role).IsRequired().HasMaxLength(50).HasColumnName("role");
            _ = builder.Property(u => u.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("created_at");
        }
    }
}
