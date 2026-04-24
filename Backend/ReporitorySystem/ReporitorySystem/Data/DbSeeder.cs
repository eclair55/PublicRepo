using System;
using System.Linq;

public static class DbSeeder
{
    public static void Seed(RepoDbContext context)
    {
        context.Database.EnsureCreated();

        // Seed Sectors
        if (!context.Sectors.Any())
        {
            context.Sectors.AddRange(
                new Sector { Name = "Youth" },
                new Sector { Name = "Students" },
                new Sector { Name = "Solo Parents" },
                new Sector { Name = "Employees" }
            );
        }

        // Seed Councilors
        if (!context.Councilors.Any())
        {
            context.Councilors.AddRange(
                new Councilor { Name = "Juan Dela Cruz", Term = "2022-2025" },
                new Councilor { Name = "Maria Santos", Term = "2022-2025" }
            );
        }

        // Seed Admin User
        if (!context.Users.Any())
        {
            context.Users.Add(new User
            {
                Username = "admin",
                PasswordHash = "admin123" // later: hash this
            });
        }

        context.SaveChanges();
    }
}