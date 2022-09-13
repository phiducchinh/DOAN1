using Microsoft.EntityFrameworkCore.Migrations;

namespace DOAN.API.Migrations
{
    public partial class updat653 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "maPhieu",
                table: "ChiTietVanChuyenXuat");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "maPhieu",
                table: "ChiTietVanChuyenXuat",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
