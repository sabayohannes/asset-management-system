using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AssetMgt.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddImageUrlToAsset : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Assets",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Assets");
        }
    }
}
