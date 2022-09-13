using Microsoft.EntityFrameworkCore.Migrations;

namespace DOAN.API.Migrations
{
    public partial class update2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "isHoaDon",
                table: "HopDong",
                type: "int",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "isHoaDon",
                table: "HopDong");
        }
    }
}
