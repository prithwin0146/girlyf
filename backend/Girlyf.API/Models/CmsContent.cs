namespace Girlyf.API.Models;

/// <summary>
/// CMS-managed homepage section content — maps 1:1 with the Jos Alukkas homepage sections
/// </summary>
public class CmsSection
{
    public int Id { get; set; }
    public string SectionKey { get; set; } = string.Empty;   // hero_banner, category_grid, featured_products, video_ad, shop_by_gender, earring_styles, testimonials, blog_preview, store_locator, app_download
    public string Title { get; set; } = string.Empty;
    public string? SubTitle { get; set; }
    public string? Description { get; set; }
    public string? LinkUrl { get; set; }
    public string? LinkText { get; set; }
    public bool IsActive { get; set; } = true;
    public int DisplayOrder { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<CmsSectionItem> Items { get; set; } = new List<CmsSectionItem>();
}

public class CmsSectionItem
{
    public int Id { get; set; }
    public int CmsSectionId { get; set; }
    public CmsSection CmsSection { get; set; } = null!;
    public string Title { get; set; } = string.Empty;
    public string? SubTitle { get; set; }
    public string? ImageUrl { get; set; }
    public string? MobileImageUrl { get; set; }
    public string? VideoUrl { get; set; }
    public string? LinkUrl { get; set; }
    public string? ExtraData { get; set; }  // JSON blob for flexible data
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

public class BlogPost
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Excerpt { get; set; }
    public string? Content { get; set; }
    public string? FeaturedImageUrl { get; set; }
    public string? Author { get; set; }
    public string? Tags { get; set; }
    public bool IsPublished { get; set; } = true;
    public DateTime PublishedAt { get; set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class StoreLocation
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? ImageUrl { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string? OpeningHours { get; set; }
    public bool IsActive { get; set; } = true;
    public int DisplayOrder { get; set; }
}

public class Testimonial
{
    public int Id { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string? CustomerImage { get; set; }
    public string? Location { get; set; }
    public int Rating { get; set; } = 5;
    public string Comment { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public int DisplayOrder { get; set; }
}

public class Coupon
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string DiscountType { get; set; } = "percentage"; // percentage, flat
    public decimal DiscountValue { get; set; }
    public decimal? MinOrderAmount { get; set; }
    public decimal? MaxDiscount { get; set; }
    public int UsageLimit { get; set; } = 100;
    public int UsedCount { get; set; }
    public DateTime ValidFrom { get; set; }
    public DateTime ValidTo { get; set; }
    public bool IsActive { get; set; } = true;
}
