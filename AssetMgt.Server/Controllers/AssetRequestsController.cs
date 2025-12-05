using AssetMgt.Server.Data;
using AssetMgt.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AssetMgt.Server.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class AssetRequestsController:ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public AssetRequestsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "User")]
        [HttpPost]
        public async Task<IActionResult> CreateRequest([FromBody] AssetRequest request)
        {

            var userId = User.FindFirstValue("uid");
            if (userId == null)
                return Unauthorized(new { messagae = "invalid or missing userId" });
                if(request.AssetId == 0)
                return BadRequest(new {message="assetId is required"});

            var existingRequest = await _context.AssetRequests
     .FirstOrDefaultAsync(r => r.AssetId == request.AssetId && r.Status == "Approved");

            if (existingRequest != null)
            {
                return BadRequest(new { message = "This asset has already been approved and cannot be requested." });
            }
            var asset = await _context.Assets.FindAsync(request.AssetId);
            if (asset == null) return NotFound("Asset not found");
            if (asset.Status == "Assigned")
            {
                return BadRequest(new { message = "This asset is already assigned and cannot be requested." });
            }

            var assetRequest = new AssetRequest
                    {
                        UserId = Guid.Parse(userId),
                        AssetId = request.AssetId,
                        Status = "Pending",
                        RequestDate = DateTime.UtcNow
                    };
            _context.AssetRequests.Add(assetRequest);
            await _context.SaveChangesAsync();

                return Ok(new { message = "request submitted successfully!" });
          
        }
        [Authorize(Roles = "User")]
        [HttpGet("available")]
        public async Task<IActionResult> GetAvailableAssets()
        {
            var assets = await _context.Assets
                .Where(a => a.Status == "Available")
                .ToListAsync();
            if (!assets.Any())
                return NotFound("no available asset found");

            return Ok(assets);
        }
        [Authorize(Roles = "User")]
            [HttpGet("myrequests")]
            public async Task<IActionResult> GetMyRequest()
        {
            var userId = User.FindFirstValue("uid");
            if(userId == null)
                return Unauthorized(new {message="invalid or missing user Id in token"});
            Guid userGuid;
            if (!Guid.TryParse(userId, out userGuid))
                return BadRequest(new { message = "invalid user id format " });
            var myRequests = await _context.AssetRequests
                .Include(r => r.Asset)
                .Where(r => r.UserId == userGuid)
                .ToListAsync();

                return Ok(myRequests);
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("requests/{requestId}/approve")]
        public async Task<IActionResult> ApproveRequest( int requestId)
        {
            var request=await _context.AssetRequests.Include(r =>r.Asset).FirstOrDefaultAsync(r => r.Id == requestId);
            if (request == null) return NotFound("Request not found");
                    request.Status = "Approved";
                    request.Asset.Status = "Assigned";
            await _context.SaveChangesAsync();
            return Ok(new { message = "Request approved" });
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("requests/{requestId}/reject")]
        public async Task<IActionResult> RejectRequest(int requestId)
        {
            var request = await _context.AssetRequests.Include(r => r.Asset).FirstOrDefaultAsync(r => r.Id == requestId);
                if (request == null) return NotFound("request not found");
            request.Status = "Rejected";
            await _context.SaveChangesAsync();
            return Ok(new { message = "request rejected" });
        }
        [Authorize(Roles ="Admin")]
        [HttpGet("all")]
        public async Task<IActionResult>GetAllRequests()
        {
            var requests = await _context.AssetRequests
                .Include(r => r.Asset)
                .OrderByDescending(r => r.RequestDate)
                .ToListAsync();
            return Ok(requests);

    }
}}
