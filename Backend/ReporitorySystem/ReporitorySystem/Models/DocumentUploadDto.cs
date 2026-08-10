using Microsoft.AspNetCore.Http;
using System;

public class DocumentUploadDto
{
    public string Title { get; set; }
    public string Description { get; set; }
    public string DocumentType { get; set; }

    public int? SectorId { get; set; }
    public int? AuthorId { get; set; }

    public DateTime? EnactmentDate { get; set; }

    public int? UploadedById { get; set; }

    public IFormFile File { get; set; }

    public string term { get; set; }
}