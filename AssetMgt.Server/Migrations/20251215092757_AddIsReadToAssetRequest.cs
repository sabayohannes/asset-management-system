using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AssetMgt.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddIsReadToAssetRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsRead",
                table: "AssetRequests",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsRead",
                table: "AssetRequests");
        }
    }
}
