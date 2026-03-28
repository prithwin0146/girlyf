using System.ComponentModel.DataAnnotations;

namespace Girlyf.API.DTOs;

// ── Admin-specific DTOs ──

public class AdminCreateProductDto
{
    [Required] [StringLength(200, MinimumLength = 3)]
    public string Name { get; set; } = string.Empty;

    [Required] [StringLength(200)]
    public string Slug { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Required] [StringLength(50)]
    public string SKU { get; set; } = string.Empty;

    [Required] [Range(1, int.MaxValue)]
    public int CategoryId { get; set; }

    [StringLength(20)]
    public string Metal { get; set; } = "Gold";

    [Required] [RegularExpression(@"^(24K|22K|18K|14K|Platinum|Silver)$")]
    public string Karat { get; set; } = "22K";

    [Range(0, 999.999)] public decimal GrossWeight { get; set; }
    [Range(0, 999.999)] public decimal NetWeight { get; set; }
    [Range(0, 100)] public decimal MakingChargePercent { get; set; }
    [Range(0, 100)] public decimal WastagePercent { get; set; }
    [Range(0, 999.999)] public decimal StoneWeight { get; set; }
    [Range(0, 9999999)] public decimal StonePrice { get; set; }

    public string? Gender { get; set; }
    public string? Collection { get; set; }

    public bool IsBestSeller { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsNewArrival { get; set; }
    public bool IsActive { get; set; } = true;

    [Range(0, int.MaxValue)]
    public int StockQuantity { get; set; } = 1;

    public List<string>? ImageUrls { get; set; }
}

public class AdminUpdateGoldRateDto
{
    public string? Karat { get; set; }

    [Required] [Range(0.01, 999999.99)]
    public decimal RatePerGram { get; set; }
}

public class AdminUpdateOrderStatusDto
{
    [Required]
    [RegularExpression(@"^(Pending|Confirmed|Processing|Shipped|Delivered|Cancelled|Returned)$")]
    public string Status { get; set; } = string.Empty;

    [RegularExpression(@"^(Pending|Paid|Failed|Refunded)$")]
    public string? PaymentStatus { get; set; }
}
