using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Girlyf.API.Data;
using Girlyf.API.DTOs;
using Girlyf.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Girlyf.API.Services;

public interface IAuthService
{
    Task<AuthResponseDto?> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto?> LoginAsync(LoginDto dto);
    Task<AuthResponseDto?> RefreshTokenAsync(string refreshToken);
    Task<bool> RevokeTokenAsync(string refreshToken);
}

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public AuthService(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    public async Task<AuthResponseDto?> RegisterAsync(RegisterDto dto)
    {
        if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
            return null;

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            Phone = dto.Phone,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();
        return await GenerateAuthResponse(user);
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return null;

        return await GenerateAuthResponse(user);
    }

    public async Task<AuthResponseDto?> RefreshTokenAsync(string refreshToken)
    {
        var stored = await _db.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == refreshToken && !rt.IsRevoked);

        if (stored == null || stored.ExpiresAt < DateTime.UtcNow)
            return null;

        // Rotate: revoke old, issue new
        stored.IsRevoked = true;
        var user = stored.User;
        return await GenerateAuthResponse(user);
    }

    public async Task<bool> RevokeTokenAsync(string refreshToken)
    {
        var stored = await _db.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == refreshToken && !rt.IsRevoked);

        if (stored == null) return false;
        stored.IsRevoked = true;
        await _db.SaveChangesAsync();
        return true;
    }

    private async Task<AuthResponseDto> GenerateAuthResponse(User user)
    {
        var jwt = GenerateJwtToken(user);
        var refresh = await CreateRefreshTokenAsync(user.Id);
        return new AuthResponseDto(jwt, refresh.Token, user.Name, user.Email, user.Role);
    }

    private string GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(30), // short-lived access token
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private async Task<RefreshToken> CreateRefreshTokenAsync(int userId)
    {
        var token = new RefreshToken
        {
            UserId = userId,
            Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
            ExpiresAt = DateTime.UtcNow.AddDays(30)
        };

        _db.RefreshTokens.Add(token);

        // Cleanup: remove expired/revoked tokens for this user
        var staleTokens = await _db.RefreshTokens
            .Where(rt => rt.UserId == userId && (rt.IsRevoked || rt.ExpiresAt < DateTime.UtcNow))
            .ToListAsync();
        _db.RefreshTokens.RemoveRange(staleTokens);

        await _db.SaveChangesAsync();
        return token;
    }
}
