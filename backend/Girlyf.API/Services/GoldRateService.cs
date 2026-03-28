using Girlyf.API.Data;
using Girlyf.API.DTOs;
using Microsoft.EntityFrameworkCore;

namespace Girlyf.API.Services;

public interface IGoldRateService
{
    Task<List<GoldRateDto>> GetAllRatesAsync();
    Task<GoldRateDto?> GetRateByKaratAsync(string karat);
    Task<Dictionary<string, decimal>> GetLatestRatesAsync();
    Task UpdateRateAsync(string karat, decimal ratePerGram);
}

public class GoldRateService : IGoldRateService
{
    private readonly AppDbContext _db;

    public GoldRateService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<GoldRateDto>> GetAllRatesAsync()
    {
        return await _db.GoldRates
            .OrderBy(g => g.Karat)
            .Select(g => new GoldRateDto
            {
                Karat = g.Karat,
                RatePerGram = g.RatePerGram,
                EffectiveDate = g.EffectiveDate,
                City = g.City
            }).ToListAsync();
    }

    public async Task<GoldRateDto?> GetRateByKaratAsync(string karat)
    {
        var rate = await _db.GoldRates.FirstOrDefaultAsync(g => g.Karat == karat);
        return rate == null ? null : new GoldRateDto
        {
            Karat = rate.Karat,
            RatePerGram = rate.RatePerGram,
            EffectiveDate = rate.EffectiveDate,
            City = rate.City
        };
    }

    public async Task<Dictionary<string, decimal>> GetLatestRatesAsync()
    {
        return await _db.GoldRates.ToDictionaryAsync(g => g.Karat, g => g.RatePerGram);
    }

    public async Task UpdateRateAsync(string karat, decimal ratePerGram)
    {
        var rate = await _db.GoldRates.FirstOrDefaultAsync(g => g.Karat == karat);
        if (rate != null)
        {
            rate.RatePerGram = ratePerGram;
            rate.EffectiveDate = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }
    }
}
