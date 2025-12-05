namespace AssetMgt.Server.Models
{
    public class Asset
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Category { get; set; }
        public required string SerialNumber { get; set; }
        public DateTime PurchaseDate { get; set; }
        public string Status { get; set; } = "Available";
        public  string? ImageUrl { get; set; } 
    }
}

