using Microsoft.EntityFrameworkCore.Migrations;

namespace DOAN.API.Migrations
{
    public partial class updat3451 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "maPhieuMua",
                table: "PNVatDung");

            migrationBuilder.AddColumn<string>(
                name: "ghiChu",
                table: "PNVatDung",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "nguonGoc",
                table: "PNVatDung",
                type: "int",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ghiChu",
                table: "PNVatDung");

            migrationBuilder.DropColumn(
                name: "nguonGoc",
                table: "PNVatDung");

            migrationBuilder.AddColumn<int>(
                name: "maPhieuMua",
                table: "PNVatDung",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
