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

        [HttpPost("assetregister")]
        [Authorize(Roles = "Admin")]

        public async Task<IActionResult> CreateAsset([FromBody] AssetDto assetDto)
        {
            var existing = await _context.Assets.FirstOrDefaultAsync(a => a.SerialNumber == assetDto.SerialNumber);
                if (existing != null)
            {
                return Conflict("asset with the same serial number already exist");
            }
            var asset = new Asset
            {

                Name = assetDto.Name,
                Category = assetDto.Category,
                SerialNumber = assetDto.SerialNumber,
                PurchaseDate = assetDto.PurchaseDate,
                Status = "Available"

            };
            _context.Assets.Add(asset);
            await _context.SaveChangesAsync();
            return Ok(asset);

        }
    } }
