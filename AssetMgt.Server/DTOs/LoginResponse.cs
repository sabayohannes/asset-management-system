namespace AssetMgt.Server.DTOs
{
    public class LoginResponseDto
    {
        public Guid UserId { get; set; }
        public string? Token { get; set; }
        public string? Role { get; set; }
        public string? Email { get; set; }
       public string? Expires { get; set; }
    }
}
