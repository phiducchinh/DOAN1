using Microsoft.EntityFrameworkCore.Migrations;

namespace DOAN.API.Migrations
{
    public partial class _23 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "phieuMua",
                table: "HopDong",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "vanChuyen",
                table: "HopDong",
                type: "int",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "phieuMua",
                table: "HopDong");

            migrationBuilder.DropColumn(
                name: "vanChuyen",
                table: "HopDong");
        }
    }
}
