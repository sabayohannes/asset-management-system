using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Asset> Assets { get; set; }
    public DbSet<AssetRequest> AssetRequests { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var adminPassword = BCrypt.Net.BCrypt.HashPassword("Admin@123");
        var userPassword = BCrypt.Net.BCrypt.HashPassword("User@123");

        modelBuilder.Entity<User>().HasData(
            new User { Id = 1, Email = "admin@example.com", PasswordHash = adminPassword, Role = "Admin" },
            new User { Id = 2, Email = "user@example.com", PasswordHash = userPassword, Role = "User" }
        );

        base.OnModelCreating(modelBuilder);
    }
}
