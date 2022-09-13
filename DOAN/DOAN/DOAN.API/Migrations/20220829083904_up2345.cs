using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DOAN.API.Migrations
{
    public partial class up2345 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "la",
                table: "ChiTietVanChuyenXuat",
                newName: "lan");

            migrationBuilder.AddColumn<DateTime>(
                name: "ngayTao",
                table: "ChiTietVanChuyenXuat",
                type: "datetime2",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ngayTao",
                table: "ChiTietVanChuyenXuat");

            migrationBuilder.RenameColumn(
                name: "lan",
                table: "ChiTietVanChuyenXuat",
                newName: "la");
        }
    }
}
