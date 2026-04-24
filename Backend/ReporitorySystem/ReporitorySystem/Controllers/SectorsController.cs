using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class SectorsController : ControllerBase
{
    private readonly RepoDbContext _context;

    public SectorsController(RepoDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Sector>>> GetSectors()
    {
        return await _context.Sectors.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Sector>> GetSector(int id)
    {
        var sector = await _context.Sectors.FindAsync(id);
        if (sector == null) return NotFound();
        return sector;
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<Sector>> PostSector(SectorDto sectorDto)
    {
        var sector = new Sector { Name = sectorDto.Name };
        _context.Sectors.Add(sector);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetSector), new { id = sector.Id }, sector);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> PutSector(int id, SectorDto sectorDto)
    {
        var sector = await _context.Sectors.FindAsync(id);
        if (sector == null) return NotFound();

        sector.Name = sectorDto.Name;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteSector(int id)
    {
        var sector = await _context.Sectors.FindAsync(id);
        if (sector == null) return NotFound();

        _context.Sectors.Remove(sector);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
