using Microsoft.EntityFrameworkCore.Migrations;

namespace DOAN.API.Migrations
{
    public partial class updatte1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChiTietPhieuNhap_HoaDonXuat_idHoaDon",
                table: "ChiTietPhieuNhap");

            migrationBuilder.DropColumn(
                name: "benBan",
                table: "HoaDonNhap");

            migrationBuilder.AddColumn<string>(
                name: "NCC",
                table: "ChiTietPhieuNhap",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ChiTietPhieuNhap_HoaDonNhap_idHoaDon",
                table: "ChiTietPhieuNhap",
                column: "idHoaDon",
                principalTable: "HoaDonNhap",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChiTietPhieuNhap_HoaDonNhap_idHoaDon",
                table: "ChiTietPhieuNhap");

            migrationBuilder.DropColumn(
                name: "NCC",
                table: "ChiTietPhieuNhap");

            migrationBuilder.AddColumn<string>(
                name: "benBan",
                table: "HoaDonNhap",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ChiTietPhieuNhap_HoaDonXuat_idHoaDon",
                table: "ChiTietPhieuNhap",
                column: "idHoaDon",
                principalTable: "HoaDonXuat",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
