using System.Text;
using System.Threading.RateLimiting;
using Girlyf.API.Data;
using Girlyf.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// ── Database ──
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ── Services (Dependency Inversion — depend on abstractions) ──
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IGoldRateService, GoldRateService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<ICmsService, CmsService>();
builder.Services.AddScoped<IBannerService, BannerService>();
builder.Services.AddScoped<IBlogService, BlogService>();
builder.Services.AddScoped<IStoreLocationService, StoreLocationService>();
builder.Services.AddScoped<ITestimonialService, TestimonialService>();
builder.Services.AddScoped<ICouponService, CouponService>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<ICartService, CartService>();

// ── Response Caching ──
builder.Services.AddResponseCaching();
builder.Services.AddMemoryCache();

// ── Rate Limiting ──
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    // Global sliding window: 100 requests per 1 minute
    options.AddSlidingWindowLimiter("global", opt =>
    {
        opt.PermitLimit = 100;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.SegmentsPerWindow = 4;
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 10;
    });

    // Strict limiter for auth endpoints: 10 per minute
    options.AddFixedWindowLimiter("auth", opt =>
    {
        opt.PermitLimit = 10;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.QueueLimit = 2;
    });
});

// ── JWT Auth ──
var jwtKey = builder.Configuration["Jwt:Key"]!;
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.FromMinutes(1) // Tighter clock skew
        };
    });

builder.Services.AddAuthorization();

// ── CORS — stricter for production ──
builder.Services.AddCors(options =>
{
    options.AddPolicy("Angular", policy =>
        policy.WithOrigins(
            "http://localhost:4200",
            "https://girlyf.com",
            "https://www.girlyf.com"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()
        .SetPreflightMaxAge(TimeSpan.FromMinutes(10)));
});

builder.Services.AddControllers()
    .AddJsonOptions(opt => opt.JsonSerializerOptions.ReferenceHandler =
        System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles);

// ── Swagger ──
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Girlyf Jewellery API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Description = "Enter JWT token"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" } },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// ── Auto migrate on startup ──
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (app.Environment.IsDevelopment())
    {
        // In development, auto-apply pending migrations
        db.Database.Migrate();
    }
    else
    {
        // In production, only check connection — migrations should be run explicitly
        db.Database.CanConnect();
    }
}

app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Girlyf Jewellery API v1"));

app.UseCors("Angular");

// Rate limiting middleware
app.UseRateLimiter();

// Response caching
app.UseResponseCaching();

app.UseAuthentication();
app.UseAuthorization();

// Serve Angular static files in production
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers().RequireRateLimiting("global");

// Fallback for Angular SPA routing
app.MapFallbackToFile("index.html");

app.Run();
