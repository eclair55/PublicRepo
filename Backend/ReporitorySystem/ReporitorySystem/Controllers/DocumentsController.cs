using Microsoft.AspNetCore.Mvc;
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
            EnactmentDate = dto.EnactmentDate,
            UploadedById = dto.UploadedById
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
        DateTime? dateTo)
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
            query = query.Where(d => d.EnactmentDate >= dateFrom);

        if (dateTo.HasValue)
            query = query.Where(d => d.EnactmentDate <= dateTo);

        var result = await query.ToListAsync();
        return Ok(result);
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