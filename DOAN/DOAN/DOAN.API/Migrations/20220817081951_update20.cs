using Microsoft.EntityFrameworkCore.Migrations;

namespace DOAN.API.Migrations
{
    public partial class update20 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PhieuNhapVD_PhieuXuatVD_idVanChuyen",
                table: "PhieuNhapVD");

            migrationBuilder.RenameColumn(
                name: "idVanChuyen",
                table: "PhieuNhapVD",
                newName: "idPhieuXuat");

            migrationBuilder.RenameIndex(
                name: "IX_PhieuNhapVD_idVanChuyen",
                table: "PhieuNhapVD",
                newName: "IX_PhieuNhapVD_idPhieuXuat");

            migrationBuilder.AddForeignKey(
                name: "FK_PhieuNhapVD_PhieuXuatVD_idPhieuXuat",
                table: "PhieuNhapVD",
                column: "idPhieuXuat",
                principalTable: "PhieuXuatVD",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PhieuNhapVD_PhieuXuatVD_idPhieuXuat",
                table: "PhieuNhapVD");

            migrationBuilder.RenameColumn(
                name: "idPhieuXuat",
                table: "PhieuNhapVD",
                newName: "idVanChuyen");

            migrationBuilder.RenameIndex(
                name: "IX_PhieuNhapVD_idPhieuXuat",
                table: "PhieuNhapVD",
                newName: "IX_PhieuNhapVD_idVanChuyen");

            migrationBuilder.AddForeignKey(
                name: "FK_PhieuNhapVD_PhieuXuatVD_idVanChuyen",
                table: "PhieuNhapVD",
                column: "idVanChuyen",
                principalTable: "PhieuXuatVD",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
