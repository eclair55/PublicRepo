using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Document
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Title { get; set; }

    public string Description { get; set; }

    [Required]
    public string FilePath { get; set; }

    [Required]
    public string DocumentType { get; set; } // Ordinance, Resolution

    // FK
    public int? SectorId { get; set; }
    public Sector Sector { get; set; }

    public int? AuthorId { get; set; }
    public Councilor Author { get; set; }

    public string Term { get; set; }

    public DateTime? EnactmentDate { get; set; }
    public DateTime? ApprovedDate { get; set; }

    public int? UploadedById { get; set; }
    public User UploadedBy { get; set; }

    public int? ApprovedById { get; set; }
    public User ApprovedBy { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string Status { get; set; }
}

public enum DocumentType
{
    Ordinance,
    Resolution,
    Other
}

