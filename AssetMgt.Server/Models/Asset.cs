
using System;
using System.ComponentModel.DataAnnotations;
namespace AssetMgt.Server.Models
{
    public class Asset
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]

        public string Category { get; set; }
        [Required]

        public string SerialNumber { get; set; }

        [Required]

        public DateTime PurchaseDate { get; set; }

        [Required]
        public string Status { get; set; } = "Available";

    } }

