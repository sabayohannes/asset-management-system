using AssetMgt.Server.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;

namespace AssetMgt.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController: ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole<Guid>> _roleManager;
  
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
            var existigUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existigUser != null) 
            {
                return BadRequest("user already existed");
                    }

            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email
            };
            var result = await _userManager.CreateAsync(user, dto.Password);
                if (!result.Succeeded) 
            {
                return BadRequest(result.Errors.ToString());
            }
                if(!await _roleManager.RoleExistsAsync(dto.Role))
            {
                await _roleManager.CreateAsync(new IdentityRole<Guid>(dto.Role));
            }

            await _userManager.AddToRoleAsync(user, dto.Role);
            return Ok("user successfully registered");
                }

        [HttpPost("login")]

        public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
        {
            var User = await _userManager.FindByEmailAsync(dto.Email);
            if (User == null || !await _userManager.CheckPasswordAsync(user, dto.password))
                {
                return Unauthorized("Bad email or Password");
                    }
            var roles = await _userManager.GetRolesAsync(User);
            var role = roles.FirstOrDefault() ?? "User";

            var claims = new List<Claim>
    {
                new Claim(JwtRegisteredClaimNames.Sub, User.Email),
                new Claim("uid", User.Id.ToString()),
                new Claim(ClaimTypes.Role, role)
    };

          
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddHours(2);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

           
            return Ok(new LoginResponseDto
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Role = role,
                Email = User.Email,
                Expires = expires
            });
        }
    }

}