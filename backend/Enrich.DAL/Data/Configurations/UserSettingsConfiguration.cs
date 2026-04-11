using Enrich.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Enrich.DAL.Data.Configurations
{
    public class UserSettingsConfiguration : IEntityTypeConfiguration<UserSettings>
    {
        public void Configure(EntityTypeBuilder<UserSettings> builder)
        {
            _ = builder.ToTable("user_settings");

            _ = builder.HasKey(us => us.UserId);
            _ = builder.Property(us => us.UserId).HasColumnName("user_id");

            _ = builder.Property(us => us.Theme).HasMaxLength(50).HasColumnName("theme");
            _ = builder.Property(us => us.Language).HasMaxLength(50).HasColumnName("language");

            _ = builder.HasOne(us => us.User)
                .WithOne(u => u.Settings)
                .HasForeignKey<UserSettings>(us => us.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
