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
            var baseUrl = $"{Request.Scheme}://{Request.Host}";

            foreach (var asset in assets)
            {
                if (!string.IsNullOrEmpty(asset.ImageUrl) && !asset.ImageUrl.StartsWith("http"))
                {
                    asset.ImageUrl = $"{baseUrl}{asset.ImageUrl}";
                }
            }
            return Ok(assets);
        }
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAssetById(int id)
        {
            var asset = await _context.Assets.FindAsync(id);
            if (asset == null)
                return NotFound("Asset not found");

            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            if (!string.IsNullOrEmpty(asset.ImageUrl) && !asset.ImageUrl.StartsWith("http"))
            {
                asset.ImageUrl = $"{baseUrl}{asset.ImageUrl}";
            }

            return Ok(asset);
        }

        [HttpPost("assetregister")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateAsset([FromForm] AssetDto assetDto)
        {
            var allowedCategories = new List<string> { "software", "hardware", "other" };

            if (!allowedCategories.Contains(assetDto.Category.ToLower()))
            {
                return BadRequest("Invalid category. Please select software, hardware, or other.");
            }
            var existing = await _context.Assets.FirstOrDefaultAsync(a => a.SerialNumber == assetDto.SerialNumber);
            if (existing != null)
                return Conflict("Asset with the same serial number already exists");

            var purchaseDate = DateTime.Parse(assetDto.PurchaseDate).ToUniversalTime();
            string imageUrl = "";

            if (assetDto.Image != null && assetDto.Image.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(assetDto.Image.FileName);
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await assetDto.Image.CopyToAsync(stream);
        }

        imageUrl = $"http://localhost:5001/uploads/{uniqueFileName}";
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
        public async Task<IActionResult> UpdateAsset(int id, [FromForm] AssetDto assetDto)
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

            // ✔ Update image if new file uploaded
            if (assetDto.Image != null && assetDto.Image.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var newFileName = Guid.NewGuid().ToString() + Path.GetExtension(assetDto.Image.FileName);
                var filePath = Path.Combine(uploadsFolder, newFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await assetDto.Image.CopyToAsync(stream);
                }

                // Save full URL, consistent with CreateAsset
                asset.ImageUrl = $"http://localhost:5001/uploads/{newFileName}";
            }

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

