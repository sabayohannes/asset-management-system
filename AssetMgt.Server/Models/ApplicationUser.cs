using Microsoft.AspNetCore.Identity;
using System;
namespace AssetMgt.Server.Models
{
    public class ApplicationUser:IdentityUser<Guid>
    {
        // public string? Role { get; set; }
        public string Name { get; set; }
    }
}
