using Microsoft.AspNetCore.Authorization;
﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class DocumentsController : ControllerBase
{
    private readonly RepoDbContext _context;
    private readonly IWebHostEnvironment _env;

    public DocumentsController(RepoDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    // 📥 Upload Document
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Upload([FromForm] DocumentUploadDto dto)
    {
        if (dto.File == null || dto.File.Length == 0)
            return BadRequest("File is required");

        var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");

        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        var fileName = Guid.NewGuid() + Path.GetExtension(dto.File.FileName);
        var filePath = Path.Combine(uploadsFolder, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await dto.File.CopyToAsync(stream);
        }

        var document = new Document
        {
            Title = dto.Title,
            Description = dto.Description,
            FilePath = $"uploads/{fileName}",
            DocumentType = dto.DocumentType,
            SectorId = dto.SectorId,
            AuthorId = dto.AuthorId,
            EnactmentDate = dto.EnactmentDate?.ToUniversalTime(),
            UploadedById = dto.UploadedById,
            Status = "Pending"
        };

        _context.Documents.Add(document);
        await _context.SaveChangesAsync();

        return Ok(document);
    }

    // 📄 Get All with Filters
    [HttpGet]
    public async Task<IActionResult> GetAll(
        int? sectorId,
        int? authorId,
        DateTime? dateFrom,
        DateTime? dateTo,
        string? documentType,
        string? term,
        int page = 1,
        int pageSize = 10)
    {
        var query = _context.Documents
            .Include(d => d.Sector)
            .Include(d => d.Author)
            .AsQueryable();

        if (sectorId.HasValue)
            query = query.Where(d => d.SectorId == sectorId);

        if (authorId.HasValue)
            query = query.Where(d => d.AuthorId == authorId);

        if (dateFrom.HasValue)
            query = query.Where(d => d.EnactmentDate >= dateFrom.Value.ToUniversalTime());

        if (dateTo.HasValue)
            query = query.Where(d => d.EnactmentDate <= dateTo.Value.ToUniversalTime());

        if (!string.IsNullOrEmpty(documentType))
            query = query.Where(d => d.DocumentType == documentType);

        if (!string.IsNullOrEmpty(term))
            query = query.Where(d => d.Term == term);

        var totalItems = await query.CountAsync();
        var items = await query
            .OrderByDescending(d => d.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new
        {
            TotalItems = totalItems,
            Page = page,
            PageSize = pageSize,
            Items = items
        });
    }

    // 🔍 Search
    [HttpGet("search")]
    public async Task<IActionResult> Search(string query)
    {
        var result = await _context.Documents
            .Where(d => d.Title.Contains(query) || d.Description.Contains(query))
            .ToListAsync();

        return Ok(result);
    }

    // 📄 Get Single
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var doc = await _context.Documents
            .Include(d => d.Sector)
            .Include(d => d.Author)
            .FirstOrDefaultAsync(d => d.Id == id);

        if (doc == null)
            return NotFound();

        // Increment view count
        _context.DocumentViews.Add(new DocumentView { DocumentId = id });
        await _context.SaveChangesAsync();

        return Ok(doc);
    }

    [HttpPut("approve/{id}")]
    [Authorize]
    public async Task<IActionResult> Approve(int id)
    {
        var doc = await _context.Documents.FindAsync(id);
        if (doc == null) return NotFound();

        doc.Status = "Approved";
        doc.ApprovedDate = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(doc);
    }

    // 📥 Download
    [HttpGet("download/{id}")]
    public async Task<IActionResult> Download(int id)
    {
        var doc = await _context.Documents.FindAsync(id);
        if (doc == null)
            return NotFound();

        var filePath = Path.Combine(_env.WebRootPath, doc.FilePath);

        if (!System.IO.File.Exists(filePath))
            return NotFound("File not found");

        var bytes = await System.IO.File.ReadAllBytesAsync(filePath);
        return File(bytes, "application/octet-stream", Path.GetFileName(filePath));
    }
}