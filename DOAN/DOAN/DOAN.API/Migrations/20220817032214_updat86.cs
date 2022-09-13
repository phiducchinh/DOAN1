using Microsoft.EntityFrameworkCore.Migrations;

namespace DOAN.API.Migrations
{
    public partial class updat86 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChiTietPhieuXuat_HoaDonNhap_idHoaDon",
                table: "ChiTietPhieuXuat");

            migrationBuilder.AddForeignKey(
                name: "FK_ChiTietPhieuXuat_HoaDonXuat_idHoaDon",
                table: "ChiTietPhieuXuat",
                column: "idHoaDon",
                principalTable: "HoaDonXuat",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChiTietPhieuXuat_HoaDonXuat_idHoaDon",
                table: "ChiTietPhieuXuat");

            migrationBuilder.AddForeignKey(
                name: "FK_ChiTietPhieuXuat_HoaDonNhap_idHoaDon",
                table: "ChiTietPhieuXuat",
                column: "idHoaDon",
                principalTable: "HoaDonNhap",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
