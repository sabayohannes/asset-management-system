namespace AssetMgt.Server.Models
{
    public class AssetRequest
    {
        public int Id { get; set; }
        public Guid UserId { get; set; }
        public int AssetId { get; set; }
      
        public Asset ? Asset { get; set; }
        public String Status { get; set; } = "Pending";
        public DateTime RequestDate {  get; set; }=DateTime.UtcNow;
        public bool IsRead { get; set; } = false;
    }
}
