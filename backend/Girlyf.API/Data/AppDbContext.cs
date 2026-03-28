using Girlyf.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Girlyf.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // ── Core Entities ──
    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();
    public DbSet<GoldRate> GoldRates => Set<GoldRate>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<Wishlist> Wishlists => Set<Wishlist>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Banner> Banners => Set<Banner>();

    // ── CMS Entities (homepage sections) ──
    public DbSet<CmsSection> CmsSections => Set<CmsSection>();
    public DbSet<CmsSectionItem> CmsSectionItems => Set<CmsSectionItem>();
    public DbSet<BlogPost> BlogPosts => Set<BlogPost>();
    public DbSet<StoreLocation> StoreLocations => Set<StoreLocation>();
    public DbSet<Testimonial> Testimonials => Set<Testimonial>();
    public DbSet<Coupon> Coupons => Set<Coupon>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ── Relationships ──
        modelBuilder.Entity<Category>()
            .HasOne(c => c.ParentCategory)
            .WithMany(c => c.SubCategories)
            .HasForeignKey(c => c.ParentCategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Product>()
            .HasOne(p => p.Category)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<CmsSectionItem>()
            .HasOne(i => i.CmsSection)
            .WithMany(s => s.Items)
            .HasForeignKey(i => i.CmsSectionId)
            .OnDelete(DeleteBehavior.Cascade);

        // ── Unique constraints ──
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<Product>().HasIndex(p => p.Slug).IsUnique();
        modelBuilder.Entity<Product>().HasIndex(p => p.SKU).IsUnique();
        modelBuilder.Entity<Category>().HasIndex(c => c.Slug).IsUnique();
        modelBuilder.Entity<Coupon>().HasIndex(c => c.Code).IsUnique();
        modelBuilder.Entity<CmsSection>().HasIndex(s => s.SectionKey).IsUnique();
        modelBuilder.Entity<BlogPost>().HasIndex(b => b.Slug).IsUnique();
        modelBuilder.Entity<Wishlist>().HasIndex(w => new { w.UserId, w.ProductId }).IsUnique();
        modelBuilder.Entity<Review>().HasIndex(r => new { r.UserId, r.ProductId }).IsUnique();

        // ── Decimal precision ──
        modelBuilder.Entity<Product>(e =>
        {
            e.Property(p => p.GrossWeight).HasPrecision(10, 3);
            e.Property(p => p.NetWeight).HasPrecision(10, 3);
            e.Property(p => p.StoneWeight).HasPrecision(10, 3);
            e.Property(p => p.BasePrice).HasPrecision(18, 2);
            e.Property(p => p.StonePrice).HasPrecision(18, 2);
            e.Property(p => p.MakingChargePercent).HasPrecision(5, 2);
            e.Property(p => p.WastagePercent).HasPrecision(5, 2);
        });

        modelBuilder.Entity<GoldRate>().Property(g => g.RatePerGram).HasPrecision(10, 2);

        modelBuilder.Entity<Order>(e =>
        {
            e.Property(o => o.TotalAmount).HasPrecision(18, 2);
            e.Property(o => o.SubTotal).HasPrecision(18, 2);
            e.Property(o => o.Tax).HasPrecision(18, 2);
            e.Property(o => o.ShippingCharge).HasPrecision(18, 2);
            e.Property(o => o.Discount).HasPrecision(18, 2);
        });

        modelBuilder.Entity<OrderItem>(e =>
        {
            e.Property(oi => oi.UnitPrice).HasPrecision(18, 2);
            e.Property(oi => oi.TotalPrice).HasPrecision(18, 2);
            e.Property(oi => oi.GoldRateAtPurchase).HasPrecision(10, 2);
        });

        modelBuilder.Entity<Coupon>(e =>
        {
            e.Property(c => c.DiscountValue).HasPrecision(18, 2);
            e.Property(c => c.MinOrderAmount).HasPrecision(18, 2);
            e.Property(c => c.MaxDiscount).HasPrecision(18, 2);
        });

        // ── Seed: Categories (Jos Alukkas exact categories) ──
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Necklace", Slug = "necklace", DisplayOrder = 1, ImageUrl = "/assets/images/categories/necklace.avif" },
            new Category { Id = 2, Name = "Earring", Slug = "earring", DisplayOrder = 2, ImageUrl = "/assets/images/categories/earring.avif" },
            new Category { Id = 3, Name = "Bangle", Slug = "bangle", DisplayOrder = 3, ImageUrl = "/assets/images/categories/bangle.avif" },
            new Category { Id = 4, Name = "Ring", Slug = "ring", DisplayOrder = 4, ImageUrl = "/assets/images/categories/ring.avif" },
            new Category { Id = 5, Name = "Bracelet", Slug = "bracelet", DisplayOrder = 5, ImageUrl = "/assets/images/categories/bracelet.avif" },
            new Category { Id = 6, Name = "Pendant", Slug = "pendant", DisplayOrder = 6, ImageUrl = "/assets/images/categories/pendant.avif" },
            new Category { Id = 7, Name = "Chain", Slug = "chain", DisplayOrder = 7, ImageUrl = "/assets/images/categories/chain.avif" },
            new Category { Id = 8, Name = "Anklet", Slug = "anklet", DisplayOrder = 8, ImageUrl = "/assets/images/categories/anklet.avif" },
            new Category { Id = 9, Name = "Mangalsutra", Slug = "mangalsutra", DisplayOrder = 9, ImageUrl = "/assets/images/categories/mangalsutra.avif" },
            new Category { Id = 10, Name = "Nose Pin", Slug = "nose-pin", DisplayOrder = 10, ImageUrl = "/assets/images/categories/nosepin.avif" }
        );

        // ── Seed: Gold Rates ──
        modelBuilder.Entity<GoldRate>().HasData(
            new GoldRate { Id = 1, Karat = "24K", RatePerGram = 7200, City = "All" },
            new GoldRate { Id = 2, Karat = "22K", RatePerGram = 6600, City = "All" },
            new GoldRate { Id = 3, Karat = "18K", RatePerGram = 5400, City = "All" }
        );

        // ── Seed: CMS Homepage Sections (mirrors Jos Alukkas section-by-section) ──
        modelBuilder.Entity<CmsSection>().HasData(
            new CmsSection { Id = 1, SectionKey = "hero_banner", Title = "Hero Banner Carousel", DisplayOrder = 1 },
            new CmsSection { Id = 2, SectionKey = "category_grid", Title = "Shop By Category", DisplayOrder = 2 },
            new CmsSection { Id = 3, SectionKey = "featured_products", Title = "Featured Collection", SubTitle = "Handpicked designs for every occasion", DisplayOrder = 3 },
            new CmsSection { Id = 4, SectionKey = "video_ad", Title = "Product Customization", DisplayOrder = 4 },
            new CmsSection { Id = 5, SectionKey = "aira_collection", Title = "AIRA Collection", SubTitle = "Lightweight everyday jewellery", DisplayOrder = 5 },
            new CmsSection { Id = 6, SectionKey = "shop_by_gender", Title = "Shop For", DisplayOrder = 6 },
            new CmsSection { Id = 7, SectionKey = "earring_styles", Title = "Earring Styles", SubTitle = "Find your perfect pair", DisplayOrder = 7 },
            new CmsSection { Id = 8, SectionKey = "bestsellers", Title = "Best Sellers", SubTitle = "Most loved by our customers", DisplayOrder = 8 },
            new CmsSection { Id = 9, SectionKey = "testimonials", Title = "Customer Stories", SubTitle = "Hear what our customers say", DisplayOrder = 9 },
            new CmsSection { Id = 10, SectionKey = "blog_preview", Title = "From Our Blog", SubTitle = "Jewellery tips, trends & more", DisplayOrder = 10 },
            new CmsSection { Id = 11, SectionKey = "store_locator", Title = "Visit Our Stores", SubTitle = "Find a store near you", DisplayOrder = 11 },
            new CmsSection { Id = 12, SectionKey = "app_download", Title = "Download Our App", SubTitle = "Shop on the go with exclusive app offers", DisplayOrder = 12 }
        );

        // ── Seed: Testimonials ──
        modelBuilder.Entity<Testimonial>().HasData(
            new Testimonial { Id = 1, CustomerName = "Priya Sharma", Location = "Bangalore", Rating = 5, Comment = "Absolutely stunning necklace! The craftsmanship is unmatched. Delivery was swift and secure.", DisplayOrder = 1 },
            new Testimonial { Id = 2, CustomerName = "Anitha Menon", Location = "Kochi", Rating = 5, Comment = "Bought bangles for my wedding. Perfect weight and finish. The hallmark guarantee gives great confidence.", DisplayOrder = 2 },
            new Testimonial { Id = 3, CustomerName = "Lakshmi Narayanan", Location = "Chennai", Rating = 5, Comment = "Best online jewellery shopping experience. Live gold rates and transparent pricing — love it!", DisplayOrder = 3 },
            new Testimonial { Id = 4, CustomerName = "Deepa Raj", Location = "Coimbatore", Rating = 4, Comment = "Ordered a pair of jhumkas. They look even better in person. Will definitely order again!", DisplayOrder = 4 }
        );

        // ── Seed: Store Locations ──
        modelBuilder.Entity<StoreLocation>().HasData(
            new StoreLocation { Id = 1, Name = "Girlyf Thrissur", City = "Thrissur", State = "Kerala", Address = "Round South, Thrissur, Kerala 680001", Phone = "+91-487-2420012", Latitude = 10.5276, Longitude = 76.2144, OpeningHours = "10:00 AM - 9:00 PM", DisplayOrder = 1 },
            new StoreLocation { Id = 2, Name = "Girlyf Kochi", City = "Kochi", State = "Kerala", Address = "MG Road, Ernakulam, Kerala 682011", Phone = "+91-484-2351234", Latitude = 9.9312, Longitude = 76.2673, OpeningHours = "10:00 AM - 9:00 PM", DisplayOrder = 2 },
            new StoreLocation { Id = 3, Name = "Girlyf Bangalore", City = "Bangalore", State = "Karnataka", Address = "Jayanagar 4th Block, Bangalore 560011", Phone = "+91-80-26545678", Latitude = 12.9279, Longitude = 77.5831, OpeningHours = "10:00 AM - 9:00 PM", DisplayOrder = 3 },
            new StoreLocation { Id = 4, Name = "Girlyf Chennai", City = "Chennai", State = "Tamil Nadu", Address = "T. Nagar, Chennai 600017", Phone = "+91-44-24345678", Latitude = 13.0418, Longitude = 80.2341, OpeningHours = "10:00 AM - 9:00 PM", DisplayOrder = 4 },
            new StoreLocation { Id = 5, Name = "Girlyf Coimbatore", City = "Coimbatore", State = "Tamil Nadu", Address = "RS Puram, Coimbatore 641002", Phone = "+91-422-2541234", Latitude = 11.0168, Longitude = 76.9558, OpeningHours = "10:00 AM - 9:00 PM", DisplayOrder = 5 }
        );
    }
}
