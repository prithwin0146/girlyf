using System.Security.Claims;
using Girlyf.API.DTOs;
using Girlyf.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Girlyf.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly ICartService _cart;
    public CartController(ICartService cart) => _cart = cart;

    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetCart()
        => Ok(await _cart.GetCartAsync(UserId));

    [HttpPost("sync")]
    public async Task<IActionResult> SyncCart([FromBody] CartSyncDto dto)
        => Ok(await _cart.SyncCartAsync(UserId, dto.Items));

    [HttpPost("items/{productId}")]
    public async Task<IActionResult> AddItem(int productId, [FromQuery] int quantity = 1)
        => Ok(await _cart.AddItemAsync(UserId, productId, quantity));

    [HttpPut("items/{productId}")]
    public async Task<IActionResult> UpdateQuantity(int productId, [FromQuery] int quantity)
        => Ok(await _cart.UpdateQuantityAsync(UserId, productId, quantity));

    [HttpDelete("items/{productId}")]
    public async Task<IActionResult> RemoveItem(int productId)
        => Ok(await _cart.RemoveItemAsync(UserId, productId));

    [HttpDelete]
    public async Task<IActionResult> ClearCart()
    {
        await _cart.ClearCartAsync(UserId);
        return NoContent();
    }
}
