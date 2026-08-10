using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class AnalyticsController : ControllerBase
{
    private readonly RepoDbContext _context;

    public AnalyticsController(RepoDbContext context)
    {
        _context = context;
    }

    [HttpGet("top-author")]
    public async Task<IActionResult> GetTopAuthor()
    {
        var topAuthor = await _context.Documents
            .Where(d => d.AuthorId != null)
            .GroupBy(d => d.Author.Name)
            .Select(g => new { Name = g.Key, Count = g.Count() })
            .OrderByDescending(g => g.Count)
            .FirstOrDefaultAsync();

        return Ok(topAuthor);
    }

    [HttpGet("sector-count")]
    public async Task<IActionResult> GetSectorCount()
    {
        var sectorCounts = await _context.Sectors
            .Select(s => new { Sector = s.Name, Count = s.Documents.Count })
            .ToListAsync();

        return Ok(sectorCounts);
    }

    [HttpGet("document-views")]
    public async Task<IActionResult> GetDocumentViews()
    {
        var views = await _context.Documents
            .Select(d => new { Title = d.Title, Views = _context.DocumentViews.Count(v => v.DocumentId == d.Id) })
            .OrderByDescending(x => x.Views)
            .Take(10)
            .ToListAsync();

        return Ok(views);
    }
}
