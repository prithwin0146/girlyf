namespace Girlyf.API.DTOs;

// Auth DTOs
public record RegisterDto(string Name, string Email, string Phone, string Password);
public record LoginDto(string Email, string Password);
public record AuthResponseDto(string Token, string Name, string Email, string Role);

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

// Order DTOs
public class CreateOrderDto
{
    public int ShippingAddressId { get; set; }
    public string PaymentMethod { get; set; } = "COD";
    public string? Notes { get; set; }
    public List<OrderItemInputDto> Items { get; set; } = new();
}

public class OrderItemInputDto
{
    public int ProductId { get; set; }
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
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Line1 { get; set; } = string.Empty;
    public string? Line2 { get; set; }
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
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
