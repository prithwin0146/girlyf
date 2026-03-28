using Girlyf.API.Data;
using Girlyf.API.DTOs;
using Girlyf.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Girlyf.API.Services;

public interface ICartService
{
    Task<CartDto> GetCartAsync(int userId);
    Task<CartDto> SyncCartAsync(int userId, List<CartSyncItemDto> items);
    Task<CartDto> AddItemAsync(int userId, int productId, int quantity);
    Task<CartDto> UpdateQuantityAsync(int userId, int productId, int quantity);
    Task<CartDto> RemoveItemAsync(int userId, int productId);
    Task ClearCartAsync(int userId);
}

public class CartService : ICartService
{
    private readonly AppDbContext _db;

    public CartService(AppDbContext db) => _db = db;

    public async Task<CartDto> GetCartAsync(int userId)
    {
        var items = await _db.CartItems
            .Where(ci => ci.UserId == userId)
            .Include(ci => ci.Product)
                .ThenInclude(p => p.Images)
            .Include(ci => ci.Product)
                .ThenInclude(p => p.Category)
            .OrderByDescending(ci => ci.UpdatedAt)
            .ToListAsync();

        return BuildCartDto(items);
    }

    public async Task<CartDto> SyncCartAsync(int userId, List<CartSyncItemDto> items)
    {
        // Merge local cart with server cart (local wins for quantity)
        foreach (var item in items)
        {
            var existing = await _db.CartItems
                .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.ProductId == item.ProductId);

            if (existing != null)
            {
                existing.Quantity = Math.Max(existing.Quantity, item.Quantity);
                existing.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                _db.CartItems.Add(new CartItem
                {
                    UserId = userId,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity
                });
            }
        }

        await _db.SaveChangesAsync();
        return await GetCartAsync(userId);
    }

    public async Task<CartDto> AddItemAsync(int userId, int productId, int quantity)
    {
        var existing = await _db.CartItems
            .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.ProductId == productId);

        if (existing != null)
        {
            existing.Quantity += quantity;
            existing.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            _db.CartItems.Add(new CartItem
            {
                UserId = userId,
                ProductId = productId,
                Quantity = quantity
            });
        }

        await _db.SaveChangesAsync();
        return await GetCartAsync(userId);
    }

    public async Task<CartDto> UpdateQuantityAsync(int userId, int productId, int quantity)
    {
        var item = await _db.CartItems
            .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.ProductId == productId);

        if (item == null) return await GetCartAsync(userId);

        if (quantity <= 0)
        {
            _db.CartItems.Remove(item);
        }
        else
        {
            item.Quantity = quantity;
            item.UpdatedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();
        return await GetCartAsync(userId);
    }

    public async Task<CartDto> RemoveItemAsync(int userId, int productId)
    {
        var item = await _db.CartItems
            .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.ProductId == productId);

        if (item != null)
        {
            _db.CartItems.Remove(item);
            await _db.SaveChangesAsync();
        }

        return await GetCartAsync(userId);
    }

    public async Task ClearCartAsync(int userId)
    {
        var items = await _db.CartItems.Where(ci => ci.UserId == userId).ToListAsync();
        _db.CartItems.RemoveRange(items);
        await _db.SaveChangesAsync();
    }

    private CartDto BuildCartDto(List<CartItem> items)
    {
        var goldRates = _db.GoldRates.ToDictionary(g => g.Karat, g => g.RatePerGram);

        var cartItems = items.Select(ci =>
        {
            var p = ci.Product;
            var rate = goldRates.GetValueOrDefault(p.Karat, 6600m);
            var goldValue = p.NetWeight * rate;
            var making = goldValue * p.MakingChargePercent / 100;
            var wastage = goldValue * p.WastagePercent / 100;
            var unitPrice = goldValue + making + wastage + p.StonePrice;

            return new CartItemDto
            {
                ProductId = p.Id,
                ProductName = p.Name,
                ImageUrl = p.Images.FirstOrDefault(i => i.IsPrimary)?.ImageUrl
                           ?? p.Images.FirstOrDefault()?.ImageUrl ?? "",
                Karat = p.Karat,
                GrossWeight = p.GrossWeight,
                Quantity = ci.Quantity,
                UnitPrice = Math.Round(unitPrice, 2),
                TotalPrice = Math.Round(unitPrice * ci.Quantity, 2)
            };
        }).ToList();

        var subTotal = cartItems.Sum(i => i.TotalPrice);
        var tax = Math.Round(subTotal * 0.03m, 2); // 3% GST
        var shipping = subTotal >= 50000 ? 0 : 500;

        return new CartDto
        {
            Items = cartItems,
            SubTotal = subTotal,
            Tax = tax,
            ShippingCharge = shipping,
            TotalAmount = subTotal + tax + shipping
        };
    }
}
