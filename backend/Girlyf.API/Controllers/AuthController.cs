using Girlyf.API.DTOs;
using Girlyf.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace Girlyf.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableRateLimiting("auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;
    public AuthController(IAuthService auth) => _auth = auth;

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var result = await _auth.RegisterAsync(dto);
        if (result == null) return BadRequest(new { message = "Email already exists." });
        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var result = await _auth.LoginAsync(dto);
        if (result == null) return Unauthorized(new { message = "Invalid credentials." });
        return Ok(result);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenDto dto)
    {
        var result = await _auth.RefreshTokenAsync(dto.RefreshToken);
        if (result == null) return Unauthorized(new { message = "Invalid or expired refresh token." });
        return Ok(result);
    }

    [Authorize]
    [HttpPost("revoke")]
    public async Task<IActionResult> Revoke([FromBody] RefreshTokenDto dto)
    {
        var revoked = await _auth.RevokeTokenAsync(dto.RefreshToken);
        if (!revoked) return BadRequest(new { message = "Token not found." });
        return Ok(new { message = "Token revoked." });
    }
}
