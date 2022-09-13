using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DOAN.API.Migrations
{
    public partial class abc : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "soLuongMat",
                table: "ChiTietVanChuyenNhap");

            migrationBuilder.AddColumn<DateTime>(
                name: "ngayNhap",
                table: "ChiTietVanChuyenNhap",
                type: "datetime2",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ngayNhap",
                table: "ChiTietVanChuyenNhap");

            migrationBuilder.AddColumn<int>(
                name: "soLuongMat",
                table: "ChiTietVanChuyenNhap",
                type: "int",
                nullable: true);
        }
    }
}
