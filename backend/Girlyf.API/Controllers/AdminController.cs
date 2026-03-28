using System.Security.Claims;
using Girlyf.API.Data;
using Girlyf.API.DTOs;
using Girlyf.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Girlyf.API.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _db;

    public AdminController(AppDbContext db) => _db = db;

    // ──────────────── DASHBOARD STATS ────────────────

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        var now = DateTime.UtcNow;
        var monthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);

        return Ok(new
        {
            TotalProducts = await _db.Products.CountAsync(p => p.IsActive),
            TotalOrders = await _db.Orders.CountAsync(),
            TotalUsers = await _db.Users.CountAsync(),
            MonthlyRevenue = await _db.Orders
                .Where(o => o.CreatedAt >= monthStart && o.PaymentStatus == "Paid")
                .SumAsync(o => o.TotalAmount),
            PendingOrders = await _db.Orders.CountAsync(o => o.Status == "Pending"),
            RecentOrders = await _db.Orders
                .Include(o => o.Items)
                .OrderByDescending(o => o.CreatedAt)
                .Take(10)
                .Select(o => new
                {
                    o.Id,
                    o.OrderNumber,
                    o.TotalAmount,
                    o.Status,
                    o.PaymentStatus,
                    o.CreatedAt,
                    ItemCount = o.Items.Count
                }).ToListAsync(),
        });
    }

    // ──────────────── PRODUCT CRUD ────────────────

    [HttpGet("products")]
    public async Task<IActionResult> GetProducts([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null)
    {
        var query = _db.Products.Include(p => p.Category).Include(p => p.Images).AsQueryable();

        if (!string.IsNullOrEmpty(search))
            query = query.Where(p => p.Name.ToLower().Contains(search.ToLower()) || p.SKU.ToLower().Contains(search.ToLower()));

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return Ok(new { items, total, page, pageSize, totalPages = (int)Math.Ceiling((double)total / pageSize) });
    }

    [HttpPost("products")]
    public async Task<IActionResult> CreateProduct([FromBody] AdminCreateProductDto dto)
    {
        var product = new Product
        {
            Name = dto.Name,
            Slug = dto.Slug,
            Description = dto.Description,
            SKU = dto.SKU,
            CategoryId = dto.CategoryId,
            Metal = dto.Metal,
            Karat = dto.Karat,
            GrossWeight = dto.GrossWeight,
            NetWeight = dto.NetWeight,
            MakingChargePercent = dto.MakingChargePercent,
            WastagePercent = dto.WastagePercent,
            StoneWeight = dto.StoneWeight,
            StonePrice = dto.StonePrice,
            Gender = dto.Gender,
            Collection = dto.Collection,
            IsBestSeller = dto.IsBestSeller,
            IsFeatured = dto.IsFeatured,
            IsNewArrival = dto.IsNewArrival,
            IsActive = dto.IsActive,
            StockQuantity = dto.StockQuantity,
        };

        _db.Products.Add(product);
        await _db.SaveChangesAsync();

        // Add images
        if (dto.ImageUrls?.Any() == true)
        {
            for (int i = 0; i < dto.ImageUrls.Count; i++)
            {
                _db.ProductImages.Add(new ProductImage
                {
                    ProductId = product.Id,
                    ImageUrl = dto.ImageUrls[i],
                    IsPrimary = i == 0,
                    DisplayOrder = i
                });
            }
            await _db.SaveChangesAsync();
        }

        return CreatedAtAction(nameof(GetProducts), new { id = product.Id }, new { product.Id, product.Name, product.Slug });
    }

    [HttpPut("products/{id}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] AdminCreateProductDto dto)
    {
        var product = await _db.Products.FindAsync(id);
        if (product == null) return NotFound();

        product.Name = dto.Name;
        product.Slug = dto.Slug;
        product.Description = dto.Description;
        product.SKU = dto.SKU;
        product.CategoryId = dto.CategoryId;
        product.Metal = dto.Metal;
        product.Karat = dto.Karat;
        product.GrossWeight = dto.GrossWeight;
        product.NetWeight = dto.NetWeight;
        product.MakingChargePercent = dto.MakingChargePercent;
        product.WastagePercent = dto.WastagePercent;
        product.StoneWeight = dto.StoneWeight;
        product.StonePrice = dto.StonePrice;
        product.Gender = dto.Gender;
        product.Collection = dto.Collection;
        product.IsBestSeller = dto.IsBestSeller;
        product.IsFeatured = dto.IsFeatured;
        product.IsNewArrival = dto.IsNewArrival;
        product.IsActive = dto.IsActive;
        product.StockQuantity = dto.StockQuantity;

        await _db.SaveChangesAsync();
        return Ok(new { product.Id, product.Name });
    }

    [HttpDelete("products/{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product == null) return NotFound();
        product.IsActive = false; // Soft delete
        await _db.SaveChangesAsync();
        return NoContent();
    }

    // ──────────────── GOLD RATE MANAGEMENT ────────────────

    [HttpGet("gold-rates")]
    public async Task<IActionResult> GetGoldRates()
        => Ok(await _db.GoldRates.OrderBy(r => r.Karat).ToListAsync());

    [HttpPut("gold-rates/{id}")]
    public async Task<IActionResult> UpdateGoldRate(int id, [FromBody] AdminUpdateGoldRateDto dto)
    {
        var rate = await _db.GoldRates.FindAsync(id);
        if (rate == null) return NotFound();
        rate.RatePerGram = dto.RatePerGram;
        rate.EffectiveDate = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return Ok(rate);
    }

    [HttpPost("gold-rates/bulk-update")]
    public async Task<IActionResult> BulkUpdateGoldRates([FromBody] List<AdminUpdateGoldRateDto> rates)
    {
        foreach (var dto in rates)
        {
            var rate = await _db.GoldRates.FirstOrDefaultAsync(r => r.Karat == dto.Karat);
            if (rate != null)
            {
                rate.RatePerGram = dto.RatePerGram;
                rate.EffectiveDate = DateTime.UtcNow;
            }
        }
        await _db.SaveChangesAsync();
        return Ok(new { message = "Gold rates updated." });
    }

    // ──────────────── BANNER MANAGEMENT ────────────────

    [HttpGet("banners")]
    public async Task<IActionResult> GetBanners()
        => Ok(await _db.Banners.OrderBy(b => b.DisplayOrder).ToListAsync());

    [HttpPost("banners")]
    public async Task<IActionResult> CreateBanner([FromBody] Banner banner)
    {
        _db.Banners.Add(banner);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBanners), new { id = banner.Id }, banner);
    }

    [HttpPut("banners/{id}")]
    public async Task<IActionResult> UpdateBanner(int id, [FromBody] Banner dto)
    {
        var banner = await _db.Banners.FindAsync(id);
        if (banner == null) return NotFound();
        banner.Title = dto.Title;
        banner.SubTitle = dto.SubTitle;
        banner.ImageUrl = dto.ImageUrl;
        banner.MobileImageUrl = dto.MobileImageUrl;
        banner.LinkUrl = dto.LinkUrl;
        banner.Position = dto.Position;
        banner.DisplayOrder = dto.DisplayOrder;
        banner.IsActive = dto.IsActive;
        await _db.SaveChangesAsync();
        return Ok(banner);
    }

    [HttpDelete("banners/{id}")]
    public async Task<IActionResult> DeleteBanner(int id)
    {
        var banner = await _db.Banners.FindAsync(id);
        if (banner == null) return NotFound();
        _db.Banners.Remove(banner);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    // ──────────────── ORDER MANAGEMENT ────────────────

    [HttpGet("orders")]
    public async Task<IActionResult> GetOrders([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? status = null)
    {
        var query = _db.Orders.Include(o => o.Items).ThenInclude(i => i.Product)
            .Include(o => o.ShippingAddress).Include(o => o.User).AsQueryable();

        if (!string.IsNullOrEmpty(status))
            query = query.Where(o => o.Status == status);

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(o => o.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize)
            .Select(o => new
            {
                o.Id,
                o.OrderNumber,
                o.TotalAmount,
                o.Status,
                o.PaymentStatus,
                o.PaymentMethod,
                o.CreatedAt,
                CustomerName = o.User.Name,
                CustomerEmail = o.User.Email,
                ItemCount = o.Items.Count,
                ShippingCity = o.ShippingAddress.City,
            }).ToListAsync();

        return Ok(new { items, total, page, pageSize });
    }

    [HttpPut("orders/{id}/status")]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] AdminUpdateOrderStatusDto dto)
    {
        var order = await _db.Orders.FindAsync(id);
        if (order == null) return NotFound();
        order.Status = dto.Status;
        if (!string.IsNullOrEmpty(dto.PaymentStatus))
            order.PaymentStatus = dto.PaymentStatus;
        await _db.SaveChangesAsync();
        return Ok(new { order.Id, order.Status, order.PaymentStatus });
    }

    // ──────────────── USER MANAGEMENT ────────────────

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var total = await _db.Users.CountAsync();
        var users = await _db.Users
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize)
            .Select(u => new
            {
                u.Id,
                u.Name,
                u.Email,
                u.Phone,
                u.Role,
                u.CreatedAt,
                OrderCount = u.Orders.Count,
            }).ToListAsync();
        return Ok(new { items = users, total, page, pageSize });
    }
}
