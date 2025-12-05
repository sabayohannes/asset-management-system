namespace AssetMgt.Server.DTOs
{
    public class AssetDto
    {
        public string Name { get; set; }
        public string Category  { get; set; }
        public string SerialNumber { get; set; }
        public string PurchaseDate { get; set; }
        public IFormFile? Image { get; set; } 


    }
}
