using System.Security.Claims;
using Girlyf.API.Data;
using Girlyf.API.DTOs;
using Girlyf.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Girlyf.API.Services;

public interface IOrderService
{
    Task<OrderDto?> CreateOrderAsync(int userId, CreateOrderDto dto);
    Task<List<OrderDto>> GetUserOrdersAsync(int userId);
    Task<OrderDto?> GetOrderByIdAsync(int orderId, int userId);
}

public class OrderService : IOrderService
{
    private readonly AppDbContext _db;
    private readonly IGoldRateService _goldRate;

    public OrderService(AppDbContext db, IGoldRateService goldRate)
    {
        _db = db;
        _goldRate = goldRate;
    }

    public async Task<OrderDto?> CreateOrderAsync(int userId, CreateOrderDto dto)
    {
        var rates = await _goldRate.GetLatestRatesAsync();
        var orderItems = new List<OrderItem>();
        decimal subTotal = 0;

        foreach (var item in dto.Items)
        {
            var product = await _db.Products.Include(p => p.Images).FirstOrDefaultAsync(p => p.Id == item.ProductId && p.IsActive);
            if (product == null) return null;

            var ratePerGram = rates.GetValueOrDefault(product.Karat, 6600);
            var goldValue = product.NetWeight * ratePerGram;
            var wastage = goldValue * (product.WastagePercent / 100);
            var making = (goldValue + wastage) * (product.MakingChargePercent / 100);
            var unitPrice = goldValue + wastage + making + product.StonePrice;

            orderItems.Add(new OrderItem
            {
                ProductId = product.Id,
                Quantity = item.Quantity,
                GoldRateAtPurchase = ratePerGram,
                UnitPrice = Math.Round(unitPrice, 2),
                TotalPrice = Math.Round(unitPrice * item.Quantity, 2)
            });

            subTotal += unitPrice * item.Quantity;
        }

        var gst = subTotal * 0.03m; // 3% GST on jewellery
        var shipping = subTotal > 50000 ? 0 : 150;

        var order = new Order
        {
            OrderNumber = $"JA{DateTime.UtcNow:yyyyMMddHHmmss}{userId}",
            UserId = userId,
            SubTotal = Math.Round(subTotal, 2),
            Tax = Math.Round(gst, 2),
            ShippingCharge = shipping,
            Discount = 0,
            TotalAmount = Math.Round(subTotal + gst + shipping, 2),
            Status = "Pending",
            PaymentStatus = dto.PaymentMethod == "COD" ? "Pending" : "Awaiting",
            PaymentMethod = dto.PaymentMethod,
            ShippingAddressId = dto.ShippingAddressId,
            Notes = dto.Notes,
            Items = orderItems
        };

        _db.Orders.Add(order);
        await _db.SaveChangesAsync();
        return await GetOrderByIdAsync(order.Id, userId);
    }

    public async Task<List<OrderDto>> GetUserOrdersAsync(int userId)
    {
        var orders = await _db.Orders
            .Include(o => o.Items).ThenInclude(i => i.Product).ThenInclude(p => p.Images)
            .Include(o => o.ShippingAddress)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return orders.Select(MapOrderToDto).ToList();
    }

    public async Task<OrderDto?> GetOrderByIdAsync(int orderId, int userId)
    {
        var order = await _db.Orders
            .Include(o => o.Items).ThenInclude(i => i.Product).ThenInclude(p => p.Images)
            .Include(o => o.ShippingAddress)
            .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

        return order == null ? null : MapOrderToDto(order);
    }

    private static OrderDto MapOrderToDto(Order order) => new()
    {
        Id = order.Id,
        OrderNumber = order.OrderNumber,
        TotalAmount = order.TotalAmount,
        Status = order.Status,
        PaymentStatus = order.PaymentStatus,
        PaymentMethod = order.PaymentMethod,
        CreatedAt = order.CreatedAt,
        Items = order.Items.Select(i => new OrderItemDto
        {
            ProductId = i.ProductId,
            ProductName = i.Product?.Name ?? string.Empty,
            ImageUrl = i.Product?.Images.FirstOrDefault(img => img.IsPrimary)?.ImageUrl ?? string.Empty,
            Quantity = i.Quantity,
            UnitPrice = i.UnitPrice,
            TotalPrice = i.TotalPrice
        }).ToList(),
        ShippingAddress = order.ShippingAddress == null ? null : new AddressDto
        {
            Id = order.ShippingAddress.Id,
            FullName = order.ShippingAddress.FullName,
            Phone = order.ShippingAddress.Phone,
            Line1 = order.ShippingAddress.Line1,
            Line2 = order.ShippingAddress.Line2,
            City = order.ShippingAddress.City,
            State = order.ShippingAddress.State,
            PinCode = order.ShippingAddress.PinCode
        }
    };
}
