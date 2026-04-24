using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class CouncilorsController : ControllerBase
{
    private readonly RepoDbContext _context;

    public CouncilorsController(RepoDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Councilor>>> GetCouncilors()
    {
        return await _context.Councilors.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Councilor>> GetCouncilor(int id)
    {
        var councilor = await _context.Councilors.FindAsync(id);
        if (councilor == null) return NotFound();
        return councilor;
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<Councilor>> PostCouncilor(CouncilorDto dto)
    {
        var councilor = new Councilor { Name = dto.Name, Term = dto.Term };
        _context.Councilors.Add(councilor);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetCouncilor), new { id = councilor.Id }, councilor);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> PutCouncilor(int id, CouncilorDto dto)
    {
        var councilor = await _context.Councilors.FindAsync(id);
        if (councilor == null) return NotFound();

        councilor.Name = dto.Name;
        councilor.Term = dto.Term;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteCouncilor(int id)
    {
        var councilor = await _context.Councilors.FindAsync(id);
        if (councilor == null) return NotFound();

        _context.Councilors.Remove(councilor);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
