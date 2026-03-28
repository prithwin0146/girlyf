using Girlyf.API.Data;
using Girlyf.API.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Girlyf.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _db;
    public CategoriesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _db.Categories
            .Where(c => c.IsActive && c.ParentCategoryId == null)
            .Include(c => c.SubCategories)
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync();

        var dtos = categories.Select(c => new CategoryDto
        {
            Id = c.Id,
            Name = c.Name,
            Slug = c.Slug,
            ImageUrl = c.ImageUrl,
            Description = c.Description,
            ProductCount = c.Products.Count,
            SubCategories = c.SubCategories.Select(s => new CategoryDto
            {
                Id = s.Id, Name = s.Name, Slug = s.Slug, ImageUrl = s.ImageUrl
            }).ToList()
        }).ToList();

        return Ok(dtos);
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var category = await _db.Categories.Include(c => c.SubCategories)
            .FirstOrDefaultAsync(c => c.Slug == slug && c.IsActive);
        if (category == null) return NotFound();

        return Ok(new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Slug = category.Slug,
            ImageUrl = category.ImageUrl,
            Description = category.Description
        });
    }
}
