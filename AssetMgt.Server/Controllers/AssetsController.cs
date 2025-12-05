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
        [HttpGet("available")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> GetAvailableAssets()
        {
            var assets = await _context.Assets
                .Where(a => a.Status == "Available")
                .ToListAsync();
            return Ok(assets);
        }
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllAssets() {
            var assets = await _context.Assets.ToListAsync();
            return Ok(assets);
        }
        [HttpPost("assetregister")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateAsset([FromForm] AssetDto assetDto)
        {
            var existing = await _context.Assets.FirstOrDefaultAsync(a => a.SerialNumber == assetDto.SerialNumber);
            if (existing != null)
                return Conflict("Asset with the same serial number already exists");

            var purchaseDate = DateTime.Parse(assetDto.PurchaseDate).ToUniversalTime();


            string imageUrl = "";

            if (assetDto.Image != null)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(assetDto.Image.FileName)}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await assetDto.Image.CopyToAsync(stream);
                }

                imageUrl = $"/uploads/{fileName}";
            }

            var asset = new Asset
            {
                Name = assetDto.Name,
                Category = assetDto.Category,
                SerialNumber = assetDto.SerialNumber,
                PurchaseDate = purchaseDate,
                Status = "Available",
                ImageUrl = imageUrl
            };

            _context.Assets.Add(asset);
            await _context.SaveChangesAsync();

            return Ok(asset);
        }


        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateAsset(int id, [FromBody] AssetDto assetDto)
        {
            var asset = await _context.Assets.FindAsync(id);
            if (asset == null)
                return NotFound("Asset not found");

           
            var exists = await _context.Assets
                .AnyAsync(a => a.SerialNumber == assetDto.SerialNumber && a.Id != id);

            if (exists)
                return Conflict("Another asset with the same serial number already exists");


            var purchaseDate = DateTime.Parse(assetDto.PurchaseDate).ToUniversalTime();


            asset.Name = assetDto.Name;
            asset.Category = assetDto.Category;
            asset.SerialNumber = assetDto.SerialNumber;
            asset.PurchaseDate = purchaseDate;
          

            await _context.SaveChangesAsync();

            return Ok(asset);
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAsset(int id)
        {
            var asset = await _context.Assets.FindAsync(id);
            if (asset == null)
                return NotFound("Asset not found");

            _context.Assets.Remove(asset);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Asset deleted successfully" });
        }


        [HttpPost("upload")]
        public async Task<IActionResult> UploadAssetImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var imageUrl = $"/uploads/{fileName}";
            return Ok(new { imageUrl });
        }

    }



}

