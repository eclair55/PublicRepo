using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

public class RepoDbContext : DbContext
{
    public RepoDbContext(DbContextOptions<RepoDbContext> options)
        : base(options) { }

    public DbSet<Document> Documents { get; set; }
    public DbSet<Sector> Sectors { get; set; }
    public DbSet<Councilor> Councilors { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<DocumentView> DocumentViews { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Prevent cascade delete issues
        modelBuilder.Entity<Document>()
            .HasOne(d => d.Sector)
            .WithMany(s => s.Documents)
            .HasForeignKey(d => d.SectorId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Document>()
            .HasOne(d => d.Author)
            .WithMany(a => a.Documents)
            .HasForeignKey(d => d.AuthorId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Document>()
            .HasOne(d => d.UploadedBy)
            .WithMany()
            .HasForeignKey(d => d.UploadedById)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Document>()
            .HasOne(d => d.ApprovedBy)
            .WithMany()
            .HasForeignKey(d => d.ApprovedById)
            .OnDelete(DeleteBehavior.Restrict);
    }
}