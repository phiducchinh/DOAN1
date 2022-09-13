using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DOAN.API.Migrations
{
    public partial class updat85 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ghiChu",
                table: "ChiTietPhieuXuat");

            migrationBuilder.DropColumn(
                name: "hanSuDung",
                table: "ChiTietPhieuXuat");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ghiChu",
                table: "ChiTietPhieuXuat",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "hanSuDung",
                table: "ChiTietPhieuXuat",
                type: "datetime2",
                nullable: true);
        }
    }
}
