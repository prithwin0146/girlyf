using System.Security.Claims;
using Girlyf.API.DTOs;
using Girlyf.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Girlyf.API.Controllers;

// ── CMS Sections (Homepage) ──
[ApiController]
[Route("api/[controller]")]
public class CmsController : ControllerBase
{
    private readonly ICmsService _cms;
    public CmsController(ICmsService cms) => _cms = cms;

    [HttpGet("homepage")]
    public async Task<IActionResult> GetHomepage() => Ok(await _cms.GetHomepageSectionsAsync());

    [HttpGet("section/{key}")]
    public async Task<IActionResult> GetSection(string key)
    {
        var section = await _cms.GetSectionByKeyAsync(key);
        return section == null ? NotFound() : Ok(section);
    }
}

// ── Blog ──
[ApiController]
[Route("api/[controller]")]
public class BlogController : ControllerBase
{
    private readonly IBlogService _blog;
    public BlogController(IBlogService blog) => _blog = blog;

    [HttpGet]
    public async Task<IActionResult> GetLatest([FromQuery] int count = 4) => Ok(await _blog.GetLatestPostsAsync(count));

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var post = await _blog.GetPostBySlugAsync(slug);
        return post == null ? NotFound() : Ok(post);
    }
}

// ── Store Locator ──
[ApiController]
[Route("api/[controller]")]
public class StoresController : ControllerBase
{
    private readonly IStoreLocationService _stores;
    public StoresController(IStoreLocationService stores) => _stores = stores;

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _stores.GetAllStoresAsync());

    [HttpGet("city/{city}")]
    public async Task<IActionResult> GetByCity(string city) => Ok(await _stores.GetStoresByCityAsync(city));
}

// ── Testimonials ──
[ApiController]
[Route("api/[controller]")]
public class TestimonialsController : ControllerBase
{
    private readonly ITestimonialService _testimonials;
    public TestimonialsController(ITestimonialService t) => _testimonials = t;

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] int count = 6) => Ok(await _testimonials.GetActiveTestimonialsAsync(count));
}

// ── Coupons ──
[ApiController]
[Route("api/[controller]")]
public class CouponsController : ControllerBase
{
    private readonly ICouponService _coupons;
    public CouponsController(ICouponService c) => _coupons = c;

    [HttpGet("validate")]
    public async Task<IActionResult> Validate([FromQuery] string code, [FromQuery] decimal orderAmount)
        => Ok(await _coupons.ValidateCouponAsync(code, orderAmount));
}

// ── Reviews ──
[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviews;
    public ReviewsController(IReviewService r) => _reviews = r;

    [HttpGet("product/{productId}")]
    public async Task<IActionResult> GetForProduct(int productId) => Ok(await _reviews.GetProductReviewsAsync(productId));

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateReviewDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var review = await _reviews.AddReviewAsync(userId, dto);
        return review == null ? Conflict(new { message = "You already reviewed this product." }) : Ok(review);
    }
}
