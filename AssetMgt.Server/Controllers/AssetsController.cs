using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; 
using AssetMgt.Server.Models; 
using AssetMgt.Server.DTOs;
using AssetMgt.Server.Data;


namespace AssetMgt.Server.Controllers

{
    [ApiController]
    [Route("api/[controller]")]
    public class AssetsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
       public AssetsController(ApplicationDbContext context) {
            _context = context;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllAssets() {
            var assets = await _context.Assets.ToListAsync();
            return Ok(assets);
        }

        [HttpPost("assetregister")]
        [Authorize(Roles = "Admin")]

        public async Task<IActionResult> CreateAsset([FromBody] AssetDto assetDto)
        {
            var existing = await _context.Assets.FirstOrDefaultAsync(a => a.SerialNumber == assetDto.SerialNumber);
                if (existing != null)
            {
                return Conflict("asset with the same serial number already exist");
            }
            var purchaseDate = assetDto.PurchaseDate.Kind == DateTimeKind.Utc
              ? assetDto.PurchaseDate
              : assetDto.PurchaseDate.ToUniversalTime();
            var asset = new Asset
            {

                Name = assetDto.Name,
                Category = assetDto.Category,
                SerialNumber = assetDto.SerialNumber,
                PurchaseDate = purchaseDate,
                Status = "Available"

            };
            _context.Assets.Add(asset);
            await _context.SaveChangesAsync();
            return Ok(asset);

        }
    } }
