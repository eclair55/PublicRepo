using System;
using System.ComponentModel.DataAnnotations;

public class DocumentView
{
    [Key]
    public int Id { get; set; }

    public int DocumentId { get; set; }
    public Document Document { get; set; }

    public DateTime ViewedAt { get; set; } = DateTime.UtcNow;
}