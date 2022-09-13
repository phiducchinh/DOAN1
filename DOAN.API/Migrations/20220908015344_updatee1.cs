using Microsoft.EntityFrameworkCore.Migrations;

namespace DOAN.API.Migrations
{
    public partial class updatee1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "idChiTietNhap",
                table: "ChiTietPhieuXuat",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuXuat_idChiTietNhap",
                table: "ChiTietPhieuXuat",
                column: "idChiTietNhap");

            migrationBuilder.AddForeignKey(
                name: "FK_ChiTietPhieuXuat_ChiTietPhieuNhap_idChiTietNhap",
                table: "ChiTietPhieuXuat",
                column: "idChiTietNhap",
                principalTable: "ChiTietPhieuNhap",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChiTietPhieuXuat_ChiTietPhieuNhap_idChiTietNhap",
                table: "ChiTietPhieuXuat");

            migrationBuilder.DropIndex(
                name: "IX_ChiTietPhieuXuat_idChiTietNhap",
                table: "ChiTietPhieuXuat");

            migrationBuilder.DropColumn(
                name: "idChiTietNhap",
                table: "ChiTietPhieuXuat");
        }
    }
}
