using System.Security.Claims;
using Girlyf.API.Data;
using Girlyf.API.DTOs;
using Girlyf.API.Models;
using Girlyf.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Girlyf.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orders;

    public OrdersController(IOrderService orders) => _orders = orders;

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderDto dto)
    {
        var order = await _orders.CreateOrderAsync(GetUserId(), dto);
        return order == null ? BadRequest(new { message = "Could not create order." }) : Ok(order);
    }

    [HttpGet]
    public async Task<IActionResult> GetMyOrders()
        => Ok(await _orders.GetUserOrdersAsync(GetUserId()));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var order = await _orders.GetOrderByIdAsync(id, GetUserId());
        return order == null ? NotFound() : Ok(order);
    }
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AddressesController : ControllerBase
{
    private readonly AppDbContext _db;
    public AddressesController(AppDbContext db) => _db = db;

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var addresses = await _db.Addresses.Where(a => a.UserId == GetUserId()).ToListAsync();
        return Ok(addresses.Select(a => new AddressDto
        {
            Id = a.Id, FullName = a.FullName, Phone = a.Phone, Line1 = a.Line1,
            Line2 = a.Line2, City = a.City, State = a.State, PinCode = a.PinCode, IsDefault = a.IsDefault
        }));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] AddressDto dto)
    {
        if (dto.IsDefault)
            await _db.Addresses.Where(a => a.UserId == GetUserId()).ForEachAsync(a => a.IsDefault = false);

        var address = new Address
        {
            UserId = GetUserId(), FullName = dto.FullName, Phone = dto.Phone,
            Line1 = dto.Line1, Line2 = dto.Line2, City = dto.City, State = dto.State,
            PinCode = dto.PinCode, IsDefault = dto.IsDefault
        };
        _db.Addresses.Add(address);
        await _db.SaveChangesAsync();
        return Ok(new AddressDto { Id = address.Id, FullName = address.FullName, Phone = address.Phone, Line1 = address.Line1, Line2 = address.Line2, City = address.City, State = address.State, PinCode = address.PinCode, IsDefault = address.IsDefault });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var address = await _db.Addresses.FirstOrDefaultAsync(a => a.Id == id && a.UserId == GetUserId());
        if (address == null) return NotFound();
        _db.Addresses.Remove(address);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WishlistController : ControllerBase
{
    private readonly AppDbContext _db;
    public WishlistController(AppDbContext db) => _db = db;

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetWishlist()
    {
        var items = await _db.Wishlists
            .Include(w => w.Product).ThenInclude(p => p.Images)
            .Include(w => w.Product).ThenInclude(p => p.Category)
            .Where(w => w.UserId == GetUserId())
            .ToListAsync();

        return Ok(items.Select(w => new { w.Product.Id, w.Product.Name, w.Product.Slug, Category = w.Product.Category?.Name, Image = w.Product.Images.FirstOrDefault(i => i.IsPrimary)?.ImageUrl }));
    }

    [HttpPost("{productId}")]
    public async Task<IActionResult> Add(int productId)
    {
        if (await _db.Wishlists.AnyAsync(w => w.UserId == GetUserId() && w.ProductId == productId))
            return Conflict(new { message = "Already in wishlist" });
        _db.Wishlists.Add(new Wishlist { UserId = GetUserId(), ProductId = productId });
        await _db.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("{productId}")]
    public async Task<IActionResult> Remove(int productId)
    {
        var item = await _db.Wishlists.FirstOrDefaultAsync(w => w.UserId == GetUserId() && w.ProductId == productId);
        if (item == null) return NotFound();
        _db.Wishlists.Remove(item);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
