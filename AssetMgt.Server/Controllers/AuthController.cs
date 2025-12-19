using AssetMgt.Server.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using AssetMgt.Server.Models;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;






namespace AssetMgt.Server.Controllers;



    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole<Guid>> _roleManager;


        private readonly IConfiguration _config;
        public AuthController(UserManager<ApplicationUser> userManager,
                RoleManager<IdentityRole<Guid>> roleManager, IConfiguration config)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _config = config;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest("Email is required.");

            if (string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest("Password is required.");
            if (string.IsNullOrWhiteSpace(dto.Role))
                return BadRequest("Role  is required.");
           if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest("Name is requiered");
            var existigUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existigUser != null)
            {
                return BadRequest("user already existed");
            }

            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                Name=dto.Name,
            };
            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToList();

                // Return them as JSON (or plain text joined)
                return BadRequest(new { Errors = errors });
            }
            if (!await _roleManager.RoleExistsAsync(dto.Role))
            {
                await _roleManager.CreateAsync(new IdentityRole<Guid>(dto.Role));
            }

            await _userManager.AddToRoleAsync(user, dto.Role);
            return Ok("user successfully registered");
        }
    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = User.FindFirstValue("uid");
        var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound();
        return Ok(new
        {
            user.Email,
            user.Name,
            user.Id,
            Role = (await _userManager.GetRolesAsync(user))[0]
        });
    }
    [Authorize]
    [HttpPut("edit")]
    public async Task<IActionResult> Edit([FromBody] UpdateProfiledto dto)
    {
        var userId= User.FindFirstValue("uid");
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return NotFound();
        user.Name = dto.Name;
        user.Email = dto.Email;
        user.UserName = dto.Email;
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return BadRequest();
        return Ok(new
        {
            user.Name,
            user.Email
        }
        );
    }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest("Email is required.");

            if (string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest("Password is required.");

            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
            {
                return Unauthorized("Bad email or password.");
            }

            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault() ?? "User";

            var jwtKey = _config["Jwt:Key"];
            var jwtIssuer = _config["Jwt:Issuer"];
            var jwtAudience = _config["Jwt:Audience"];

            if (string.IsNullOrWhiteSpace(jwtKey) ||
                string.IsNullOrWhiteSpace(jwtIssuer) ||
                string.IsNullOrWhiteSpace(jwtAudience))
            {
                return StatusCode(500, "JWT configuration is missing in appsettings.json.");
            }

            var claims = new List<Claim>
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.Email ?? string.Empty),
        new Claim("uid", user.Id.ToString()),
        new Claim(ClaimTypes.Role, role),
        new Claim("role", role)
    };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddHours(2);

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return Ok(new LoginResponseDto
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Role = role, // ✅ use role from GetRolesAsync
                Email = user.Email,
                UserId = user.Id,
               
                Expires = expires.ToString("o")
            });
        }

    }
