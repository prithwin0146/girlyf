using Girlyf.API.Data;
using Girlyf.API.DTOs;
using Girlyf.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Girlyf.API.Services;

/// <summary>
/// Single Responsibility: manages CMS homepage sections only
/// </summary>
public class CmsService : ICmsService
{
    private readonly AppDbContext _db;

    public CmsService(AppDbContext db) => _db = db;

    public async Task<List<CmsSectionDto>> GetHomepageSectionsAsync()
    {
        var sections = await _db.CmsSections
            .Include(s => s.Items.Where(i => i.IsActive).OrderBy(i => i.DisplayOrder))
            .Where(s => s.IsActive)
            .OrderBy(s => s.DisplayOrder)
            .ToListAsync();

        return sections.Select(MapToDto).ToList();
    }

    public async Task<CmsSectionDto?> GetSectionByKeyAsync(string sectionKey)
    {
        var section = await _db.CmsSections
            .Include(s => s.Items.Where(i => i.IsActive).OrderBy(i => i.DisplayOrder))
            .FirstOrDefaultAsync(s => s.SectionKey == sectionKey && s.IsActive);

        return section == null ? null : MapToDto(section);
    }

    private static CmsSectionDto MapToDto(CmsSection s) => new()
    {
        Id = s.Id,
        SectionKey = s.SectionKey,
        Title = s.Title,
        SubTitle = s.SubTitle,
        Description = s.Description,
        LinkUrl = s.LinkUrl,
        LinkText = s.LinkText,
        DisplayOrder = s.DisplayOrder,
        Items = s.Items.Select(i => new CmsSectionItemDto
        {
            Id = i.Id,
            Title = i.Title,
            SubTitle = i.SubTitle,
            ImageUrl = i.ImageUrl,
            MobileImageUrl = i.MobileImageUrl,
            VideoUrl = i.VideoUrl,
            LinkUrl = i.LinkUrl,
            ExtraData = i.ExtraData,
            DisplayOrder = i.DisplayOrder
        }).ToList()
    };
}

/// <summary>
/// Single Responsibility: manages banner data
/// </summary>
public class BannerService : IBannerService
{
    private readonly AppDbContext _db;

    public BannerService(AppDbContext db) => _db = db;

    public async Task<List<BannerDto>> GetBannersAsync(string? position = null)
    {
        var query = _db.Banners.Where(b => b.IsActive).AsQueryable();
        if (!string.IsNullOrEmpty(position))
            query = query.Where(b => b.Position == position);

        return await query.OrderBy(b => b.DisplayOrder).Select(b => new BannerDto
        {
            Id = b.Id,
            Title = b.Title,
            SubTitle = b.SubTitle,
            ImageUrl = b.ImageUrl,
            MobileImageUrl = b.MobileImageUrl,
            LinkUrl = b.LinkUrl,
            Position = b.Position,
            DisplayOrder = b.DisplayOrder
        }).ToListAsync();
    }
}

/// <summary>
/// Single Responsibility: blog content management
/// </summary>
public class BlogService : IBlogService
{
    private readonly AppDbContext _db;

    public BlogService(AppDbContext db) => _db = db;

    public async Task<List<BlogPostDto>> GetLatestPostsAsync(int count = 4)
    {
        return await _db.BlogPosts
            .Where(b => b.IsPublished)
            .OrderByDescending(b => b.PublishedAt)
            .Take(count)
            .Select(b => new BlogPostDto
            {
                Id = b.Id, Title = b.Title, Slug = b.Slug,
                Excerpt = b.Excerpt, FeaturedImageUrl = b.FeaturedImageUrl,
                Author = b.Author, Tags = b.Tags, PublishedAt = b.PublishedAt
            }).ToListAsync();
    }

    public async Task<BlogPostDto?> GetPostBySlugAsync(string slug)
    {
        var post = await _db.BlogPosts.FirstOrDefaultAsync(b => b.Slug == slug && b.IsPublished);
        if (post == null) return null;
        return new BlogPostDto
        {
            Id = post.Id, Title = post.Title, Slug = post.Slug,
            Excerpt = post.Excerpt, Content = post.Content,
            FeaturedImageUrl = post.FeaturedImageUrl, Author = post.Author,
            Tags = post.Tags, PublishedAt = post.PublishedAt
        };
    }
}

/// <summary>
/// Single Responsibility: store locator data
/// </summary>
public class StoreLocationService : IStoreLocationService
{
    private readonly AppDbContext _db;

    public StoreLocationService(AppDbContext db) => _db = db;

    public async Task<List<StoreLocationDto>> GetAllStoresAsync()
    {
        return await _db.StoreLocations
            .Where(s => s.IsActive)
            .OrderBy(s => s.DisplayOrder)
            .Select(s => new StoreLocationDto
            {
                Id = s.Id, Name = s.Name, City = s.City, State = s.State,
                Address = s.Address, Phone = s.Phone, ImageUrl = s.ImageUrl,
                Latitude = s.Latitude, Longitude = s.Longitude, OpeningHours = s.OpeningHours
            }).ToListAsync();
    }

    public async Task<List<StoreLocationDto>> GetStoresByCityAsync(string city)
    {
        return await _db.StoreLocations
            .Where(s => s.IsActive && s.City.ToLower() == city.ToLower())
            .OrderBy(s => s.DisplayOrder)
            .Select(s => new StoreLocationDto
            {
                Id = s.Id, Name = s.Name, City = s.City, State = s.State,
                Address = s.Address, Phone = s.Phone, ImageUrl = s.ImageUrl,
                Latitude = s.Latitude, Longitude = s.Longitude, OpeningHours = s.OpeningHours
            }).ToListAsync();
    }
}

/// <summary>
/// Single Responsibility: testimonials
/// </summary>
public class TestimonialService : ITestimonialService
{
    private readonly AppDbContext _db;

    public TestimonialService(AppDbContext db) => _db = db;

    public async Task<List<TestimonialDto>> GetActiveTestimonialsAsync(int count = 6)
    {
        return await _db.Testimonials
            .Where(t => t.IsActive)
            .OrderBy(t => t.DisplayOrder)
            .Take(count)
            .Select(t => new TestimonialDto
            {
                Id = t.Id, CustomerName = t.CustomerName, CustomerImage = t.CustomerImage,
                Location = t.Location, Rating = t.Rating, Comment = t.Comment
            }).ToListAsync();
    }
}

/// <summary>
/// Single Responsibility: coupon validation
/// </summary>
public class CouponService : ICouponService
{
    private readonly AppDbContext _db;

    public CouponService(AppDbContext db) => _db = db;

    public async Task<CouponValidationResult> ValidateCouponAsync(string code, decimal orderAmount)
    {
        var coupon = await _db.Coupons.FirstOrDefaultAsync(c =>
            c.Code.ToUpper() == code.ToUpper() && c.IsActive);

        if (coupon == null)
            return new CouponValidationResult { IsValid = false, Message = "Invalid coupon code." };

        if (DateTime.UtcNow < coupon.ValidFrom || DateTime.UtcNow > coupon.ValidTo)
            return new CouponValidationResult { IsValid = false, Message = "Coupon has expired." };

        if (coupon.UsedCount >= coupon.UsageLimit)
            return new CouponValidationResult { IsValid = false, Message = "Coupon usage limit reached." };

        if (coupon.MinOrderAmount.HasValue && orderAmount < coupon.MinOrderAmount)
            return new CouponValidationResult { IsValid = false, Message = $"Minimum order ₹{coupon.MinOrderAmount} required." };

        decimal discount = coupon.DiscountType == "percentage"
            ? orderAmount * (coupon.DiscountValue / 100)
            : coupon.DiscountValue;

        if (coupon.MaxDiscount.HasValue && discount > coupon.MaxDiscount)
            discount = coupon.MaxDiscount.Value;

        return new CouponValidationResult
        {
            IsValid = true,
            DiscountAmount = Math.Round(discount, 2),
            DiscountType = coupon.DiscountType,
            Message = $"Coupon applied! You save ₹{Math.Round(discount, 2)}"
        };
    }
}

/// <summary>
/// Single Responsibility: product reviews
/// </summary>
public class ReviewService : IReviewService
{
    private readonly AppDbContext _db;

    public ReviewService(AppDbContext db) => _db = db;

    public async Task<List<ReviewDto>> GetProductReviewsAsync(int productId)
    {
        return await _db.Reviews
            .Include(r => r.User)
            .Where(r => r.ProductId == productId)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ReviewDto
            {
                Id = r.Id, ProductId = r.ProductId,
                UserName = r.User.Name, Rating = r.Rating,
                Comment = r.Comment, CreatedAt = r.CreatedAt
            }).ToListAsync();
    }

    public async Task<ReviewDto?> AddReviewAsync(int userId, CreateReviewDto dto)
    {
        var exists = await _db.Reviews.AnyAsync(r => r.UserId == userId && r.ProductId == dto.ProductId);
        if (exists) return null;

        var review = new Review
        {
            ProductId = dto.ProductId,
            UserId = userId,
            Rating = Math.Clamp(dto.Rating, 1, 5),
            Comment = dto.Comment
        };

        _db.Reviews.Add(review);
        await _db.SaveChangesAsync();

        var user = await _db.Users.FindAsync(userId);
        return new ReviewDto
        {
            Id = review.Id, ProductId = review.ProductId,
            UserName = user?.Name ?? "Anonymous", Rating = review.Rating,
            Comment = review.Comment, CreatedAt = review.CreatedAt
        };
    }
}
