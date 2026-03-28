using Girlyf.API.DTOs;
using Girlyf.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Girlyf.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _products;
    public ProductsController(IProductService products) => _products = products;

    [HttpGet]
    public async Task<IActionResult> GetProducts([FromQuery] ProductFilterDto filter)
        => Ok(await _products.GetProductsAsync(filter));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await _products.GetByIdAsync(id);
        return product == null ? NotFound() : Ok(product);
    }

    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var product = await _products.GetBySlugAsync(slug);
        return product == null ? NotFound() : Ok(product);
    }

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeatured([FromQuery] int count = 8)
        => Ok(await _products.GetFeaturedAsync(count));

    [HttpGet("bestsellers")]
    public async Task<IActionResult> GetBestSellers([FromQuery] int count = 8)
        => Ok(await _products.GetBestSellersAsync(count));

    [HttpGet("new-arrivals")]
    public async Task<IActionResult> GetNewArrivals([FromQuery] int count = 8)
        => Ok(await _products.GetNewArrivalsAsync(count));

    [HttpGet("{id:int}/related")]
    public async Task<IActionResult> GetRelated(int id, [FromQuery] int count = 6)
        => Ok(await _products.GetRelatedAsync(id, count));
}
