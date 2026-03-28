using Girlyf.API.DTOs;

namespace Girlyf.API.Services;

// ── Interface Segregation: each service has its own focused interface ──

public interface ICmsService
{
    Task<List<CmsSectionDto>> GetHomepageSectionsAsync();
    Task<CmsSectionDto?> GetSectionByKeyAsync(string sectionKey);
}

public interface IBannerService
{
    Task<List<BannerDto>> GetBannersAsync(string? position = null);
}

public interface IBlogService
{
    Task<List<BlogPostDto>> GetLatestPostsAsync(int count = 4);
    Task<BlogPostDto?> GetPostBySlugAsync(string slug);
}

public interface IStoreLocationService
{
    Task<List<StoreLocationDto>> GetAllStoresAsync();
    Task<List<StoreLocationDto>> GetStoresByCityAsync(string city);
}

public interface ITestimonialService
{
    Task<List<TestimonialDto>> GetActiveTestimonialsAsync(int count = 6);
}

public interface ICouponService
{
    Task<CouponValidationResult> ValidateCouponAsync(string code, decimal orderAmount);
}

public interface IReviewService
{
    Task<List<ReviewDto>> GetProductReviewsAsync(int productId);
    Task<ReviewDto?> AddReviewAsync(int userId, CreateReviewDto dto);
}
