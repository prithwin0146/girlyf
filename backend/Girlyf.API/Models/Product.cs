namespace Girlyf.API.Models;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string SKU { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    // Gold details
    public string Metal { get; set; } = "Gold"; // Gold, Silver, Platinum, Diamond
    public string Karat { get; set; } = "22K";   // 18K, 22K, 24K
    public decimal GrossWeight { get; set; }      // grams
    public decimal NetWeight { get; set; }        // grams (after deducting stones)
    public decimal StoneWeight { get; set; }
    public string? Purity { get; set; }

    // Pricing
    public decimal MakingChargePercent { get; set; } = 12;
    public decimal WastagePercent { get; set; } = 5;
    public decimal StonePrice { get; set; }
    public decimal BasePrice { get; set; } // calculated on save

    // Attributes
    public string? Gender { get; set; }  // Men, Women, Kids, Unisex
    public string? Collection { get; set; }
    public string? Occasion { get; set; }
    public bool IsBestSeller { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsNewArrival { get; set; }
    public bool IsActive { get; set; } = true;
    public int StockQuantity { get; set; } = 1;
    public int DisplayOrder { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}
