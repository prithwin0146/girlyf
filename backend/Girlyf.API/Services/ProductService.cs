using Girlyf.API.Data;
using Girlyf.API.DTOs;
using Girlyf.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Girlyf.API.Services;

public interface IProductService
{
    Task<PagedResult<ProductDto>> GetProductsAsync(ProductFilterDto filter);
    Task<ProductDto?> GetByIdAsync(int id);
    Task<ProductDto?> GetBySlugAsync(string slug);
    Task<List<ProductDto>> GetFeaturedAsync(int count = 8);
    Task<List<ProductDto>> GetBestSellersAsync(int count = 8);
    Task<List<ProductDto>> GetNewArrivalsAsync(int count = 8);
    Task<List<ProductDto>> GetRelatedAsync(int productId, int count = 6);
}

public class ProductService : IProductService
{
    private readonly AppDbContext _db;
    private readonly IGoldRateService _goldRate;

    public ProductService(AppDbContext db, IGoldRateService goldRate)
    {
        _db = db;
        _goldRate = goldRate;
    }

    public async Task<PagedResult<ProductDto>> GetProductsAsync(ProductFilterDto filter)
    {
        var query = _db.Products
            .Include(p => p.Category)
            .Include(p => p.Images)
            .Include(p => p.Reviews)
            .Where(p => p.IsActive)
            .AsQueryable();

        if (filter.CategoryId.HasValue)
            query = query.Where(p => p.CategoryId == filter.CategoryId);

        if (!string.IsNullOrEmpty(filter.CategorySlug))
            query = query.Where(p => p.Category.Slug == filter.CategorySlug);

        if (!string.IsNullOrEmpty(filter.Karat))
            query = query.Where(p => p.Karat == filter.Karat);

        if (!string.IsNullOrEmpty(filter.Gender))
            query = query.Where(p => p.Gender == filter.Gender);

        if (!string.IsNullOrEmpty(filter.Search))
            query = query.Where(p => p.Name.ToLower().Contains(filter.Search.ToLower())
                                  || p.Description!.ToLower().Contains(filter.Search.ToLower()));

        if (filter.IsBestSeller.HasValue)
            query = query.Where(p => p.IsBestSeller == filter.IsBestSeller);

        if (filter.IsNewArrival.HasValue)
            query = query.Where(p => p.IsNewArrival == filter.IsNewArrival);

        query = filter.SortBy switch
        {
            "price_asc" => query.OrderBy(p => p.BasePrice),
            "price_desc" => query.OrderByDescending(p => p.BasePrice),
            "weight_asc" => query.OrderBy(p => p.GrossWeight),
            _ => query.OrderByDescending(p => p.CreatedAt)
        };

        var total = await query.CountAsync();
        var products = await query.Skip((filter.Page - 1) * filter.PageSize).Take(filter.PageSize).ToListAsync();
        var goldRates = await _goldRate.GetLatestRatesAsync();

        return new PagedResult<ProductDto>
        {
            Items = products.Select(p => MapToDto(p, goldRates)).ToList(),
            TotalCount = total,
            Page = filter.Page,
            PageSize = filter.PageSize
        };
    }

    public async Task<ProductDto?> GetByIdAsync(int id)
    {
        var product = await _db.Products.Include(p => p.Category).Include(p => p.Images).Include(p => p.Reviews).FirstOrDefaultAsync(p => p.Id == id && p.IsActive);
        if (product == null) return null;
        var rates = await _goldRate.GetLatestRatesAsync();
        return MapToDto(product, rates);
    }

    public async Task<ProductDto?> GetBySlugAsync(string slug)
    {
        var product = await _db.Products.Include(p => p.Category).Include(p => p.Images).Include(p => p.Reviews).FirstOrDefaultAsync(p => p.Slug == slug && p.IsActive);
        if (product == null) return null;
        var rates = await _goldRate.GetLatestRatesAsync();
        return MapToDto(product, rates);
    }

    public async Task<List<ProductDto>> GetFeaturedAsync(int count = 8)
    {
        var products = await _db.Products.Include(p => p.Category).Include(p => p.Images).Include(p => p.Reviews)
            .Where(p => p.IsActive && p.IsFeatured).OrderBy(p => p.DisplayOrder).Take(count).ToListAsync();
        var rates = await _goldRate.GetLatestRatesAsync();
        return products.Select(p => MapToDto(p, rates)).ToList();
    }

    public async Task<List<ProductDto>> GetBestSellersAsync(int count = 8)
    {
        var products = await _db.Products.Include(p => p.Category).Include(p => p.Images).Include(p => p.Reviews)
            .Where(p => p.IsActive && p.IsBestSeller).Take(count).ToListAsync();
        var rates = await _goldRate.GetLatestRatesAsync();
        return products.Select(p => MapToDto(p, rates)).ToList();
    }

    public async Task<List<ProductDto>> GetNewArrivalsAsync(int count = 8)
    {
        var products = await _db.Products.Include(p => p.Category).Include(p => p.Images).Include(p => p.Reviews)
            .Where(p => p.IsActive && p.IsNewArrival).OrderByDescending(p => p.CreatedAt).Take(count).ToListAsync();
        var rates = await _goldRate.GetLatestRatesAsync();
        return products.Select(p => MapToDto(p, rates)).ToList();
    }

    public async Task<List<ProductDto>> GetRelatedAsync(int productId, int count = 6)
    {
        var product = await _db.Products.FindAsync(productId);
        if (product == null) return new List<ProductDto>();
        var related = await _db.Products.Include(p => p.Category).Include(p => p.Images).Include(p => p.Reviews)
            .Where(p => p.IsActive && p.CategoryId == product.CategoryId && p.Id != productId).Take(count).ToListAsync();
        var rates = await _goldRate.GetLatestRatesAsync();
        return related.Select(p => MapToDto(p, rates)).ToList();
    }

    private ProductDto MapToDto(Product product, Dictionary<string, decimal> goldRates)
    {
        var ratePerGram = goldRates.GetValueOrDefault(product.Karat, 6600);
        var goldValue = product.NetWeight * ratePerGram;
        var wastage = goldValue * (product.WastagePercent / 100);
        var making = (goldValue + wastage) * (product.MakingChargePercent / 100);
        var calculatedPrice = goldValue + wastage + making + product.StonePrice;

        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Slug = product.Slug,
            Description = product.Description,
            SKU = product.SKU,
            CategoryId = product.CategoryId,
            CategoryName = product.Category?.Name ?? string.Empty,
            Metal = product.Metal,
            Karat = product.Karat,
            GrossWeight = product.GrossWeight,
            NetWeight = product.NetWeight,
            MakingChargePercent = product.MakingChargePercent,
            WastagePercent = product.WastagePercent,
            StonePrice = product.StonePrice,
            CalculatedPrice = Math.Round(calculatedPrice, 2),
            Gender = product.Gender,
            Collection = product.Collection,
            IsBestSeller = product.IsBestSeller,
            IsFeatured = product.IsFeatured,
            IsNewArrival = product.IsNewArrival,
            IsActive = product.IsActive,
            StockQuantity = product.StockQuantity,
            Images = product.Images.OrderBy(i => i.DisplayOrder).Select(i => new ProductImageDto
            {
                Id = i.Id,
                ImageUrl = i.ImageUrl,
                IsPrimary = i.IsPrimary
            }).ToList(),
            AverageRating = product.Reviews.Any() ? product.Reviews.Average(r => r.Rating) : 0,
            ReviewCount = product.Reviews.Count
        };
    }
}
