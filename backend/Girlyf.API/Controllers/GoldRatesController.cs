using Girlyf.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Girlyf.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GoldRatesController : ControllerBase
{
    private readonly IGoldRateService _goldRate;
    public GoldRatesController(IGoldRateService goldRate) => _goldRate = goldRate;

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _goldRate.GetAllRatesAsync());

    [HttpGet("{karat}")]
    public async Task<IActionResult> GetByKarat(string karat)
    {
        var rate = await _goldRate.GetRateByKaratAsync(karat);
        return rate == null ? NotFound() : Ok(rate);
    }
}

[ApiController]
[Route("api/[controller]")]
public class BannersController : ControllerBase
{
    private readonly Girlyf.API.Data.AppDbContext _db;
    public BannersController(Girlyf.API.Data.AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? position = null)
    {
        var query = _db.Banners.Where(b => b.IsActive).AsQueryable();
        if (!string.IsNullOrEmpty(position))
            query = query.Where(b => b.Position == position);
        var banners = await Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync(query.OrderBy(b => b.DisplayOrder));
        return Ok(banners);
    }
}
