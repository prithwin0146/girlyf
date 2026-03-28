using System.ComponentModel.DataAnnotations;

namespace Girlyf.API.DTOs;

// Auth DTOs
public record RegisterDto(
    [Required(ErrorMessage = "Name is required")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 100 characters")]
    string Name,

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email address")]
    string Email,

    [Required(ErrorMessage = "Phone is required")]
    [RegularExpression(@"^[6-9]\d{9}$", ErrorMessage = "Invalid Indian phone number")]
    string Phone,

    [Required(ErrorMessage = "Password is required")]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
    string Password
);

public record LoginDto(
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email address")]
    string Email,

    [Required(ErrorMessage = "Password is required")]
    string Password
);

public record AuthResponseDto(string Token, string RefreshToken, string Name, string Email, string Role);

public record RefreshTokenDto(
    [Required(ErrorMessage = "Refresh token is required")]
    string RefreshToken
);

// Product DTOs
public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string SKU { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string Metal { get; set; } = "Gold";
    public string Karat { get; set; } = "22K";
    public decimal GrossWeight { get; set; }
    public decimal NetWeight { get; set; }
    public decimal MakingChargePercent { get; set; }
    public decimal WastagePercent { get; set; }
    public decimal StonePrice { get; set; }
    public decimal CalculatedPrice { get; set; }
    public string? Gender { get; set; }
    public string? Collection { get; set; }
    public bool IsBestSeller { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsNewArrival { get; set; }
    public bool IsActive { get; set; }
    public int StockQuantity { get; set; }
    public List<ProductImageDto> Images { get; set; } = new();
    public double AverageRating { get; set; }
    public int ReviewCount { get; set; }
}

public class ProductImageDto
{
    public int Id { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsPrimary { get; set; }
}

public class ProductFilterDto
{
    public int? CategoryId { get; set; }
    public string? CategorySlug { get; set; }
    public string? Karat { get; set; }
    public string? Gender { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public decimal? MinWeight { get; set; }
    public decimal? MaxWeight { get; set; }
    public bool? IsBestSeller { get; set; }
    public bool? IsNewArrival { get; set; }
    public string? SortBy { get; set; } = "newest"; // newest, price_asc, price_desc, weight_asc
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 12;
    public string? Search { get; set; }
}

public class PagedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}

// Category DTOs
public class CategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string? Description { get; set; }
    public int? ParentCategoryId { get; set; }
    public List<CategoryDto> SubCategories { get; set; } = new();
    public int ProductCount { get; set; }
}

// Cart DTOs (session-based)
public class CartItemDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Karat { get; set; } = string.Empty;
    public decimal GrossWeight { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
}

public class CartDto
{
    public List<CartItemDto> Items { get; set; } = new();
    public decimal SubTotal { get; set; }
    public decimal Tax { get; set; }
    public decimal ShippingCharge { get; set; }
    public decimal TotalAmount { get; set; }
}

public class CartSyncItemDto
{
    [Required]
    [Range(1, int.MaxValue)]
    public int ProductId { get; set; }

    [Required]
    [Range(1, 10)]
    public int Quantity { get; set; }
}

public class CartSyncDto
{
    [Required]
    public List<CartSyncItemDto> Items { get; set; } = new();
}

// Order DTOs
public class CreateOrderDto
{
    [Required(ErrorMessage = "Shipping address is required")]
    [Range(1, int.MaxValue, ErrorMessage = "Invalid shipping address")]
    public int ShippingAddressId { get; set; }

    [Required(ErrorMessage = "Payment method is required")]
    [RegularExpression(@"^(COD|Razorpay|UPI|CCAvenue|PhonePe)$", ErrorMessage = "Invalid payment method")]
    public string PaymentMethod { get; set; } = "COD";

    [StringLength(500, ErrorMessage = "Notes cannot exceed 500 characters")]
    public string? Notes { get; set; }

    [Required(ErrorMessage = "Order must have at least one item")]
    [MinLength(1, ErrorMessage = "Order must have at least one item")]
    public List<OrderItemInputDto> Items { get; set; } = new();
}

public class OrderItemInputDto
{
    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Invalid product")]
    public int ProductId { get; set; }

    [Required]
    [Range(1, 10, ErrorMessage = "Quantity must be between 1 and 10")]
    public int Quantity { get; set; }
}

public class OrderDto
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
    public AddressDto? ShippingAddress { get; set; }
}

public class OrderItemDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
}

// Address DTOs
public class AddressDto
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Full name is required")]
    [StringLength(100, MinimumLength = 2)]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Phone number is required")]
    [RegularExpression(@"^[6-9]\d{9}$", ErrorMessage = "Invalid phone number")]
    public string Phone { get; set; } = string.Empty;

    [Required(ErrorMessage = "Address line 1 is required")]
    [StringLength(200, MinimumLength = 5)]
    public string Line1 { get; set; } = string.Empty;

    [StringLength(200)]
    public string? Line2 { get; set; }

    [Required(ErrorMessage = "City is required")]
    [StringLength(100)]
    public string City { get; set; } = string.Empty;

    [Required(ErrorMessage = "State is required")]
    [StringLength(100)]
    public string State { get; set; } = string.Empty;

    [Required(ErrorMessage = "PIN code is required")]
    [RegularExpression(@"^\d{6}$", ErrorMessage = "PIN code must be 6 digits")]
    public string PinCode { get; set; } = string.Empty;

    public string Country { get; set; } = "India";
    public bool IsDefault { get; set; }
}

// Gold Rate DTO
public class GoldRateDto
{
    public string Karat { get; set; } = string.Empty;
    public decimal RatePerGram { get; set; }
    public DateTime EffectiveDate { get; set; }
    public string City { get; set; } = string.Empty;
}

// Search Suggestions DTO
public class SearchSuggestionsDto
{
    public List<SearchProductHitDto> Products { get; set; } = new();
    public List<string> Suggestions { get; set; } = new();
}

public class SearchProductHitDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public decimal Price { get; set; }
    public string CategoryName { get; set; } = string.Empty;
}
