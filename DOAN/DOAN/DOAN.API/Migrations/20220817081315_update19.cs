using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DOAN.API.Migrations
{
    public partial class update19 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PhieuNhapVD",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    maPhieu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    idVanChuyen = table.Column<int>(type: "int", nullable: false),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuNhapVD", x => x.id);
                    table.ForeignKey(
                        name: "FK_PhieuNhapVD_PhieuXuatVD_idVanChuyen",
                        column: x => x.idVanChuyen,
                        principalTable: "PhieuXuatVD",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChiTietVanChuyenNhap",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    idPhieuNhap = table.Column<int>(type: "int", nullable: false),
                    idVatTu = table.Column<int>(type: "int", nullable: false),
                    soLuong = table.Column<int>(type: "int", nullable: true),
                    soLuongMat = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietVanChuyenNhap", x => x.id);
                    table.ForeignKey(
                        name: "FK_ChiTietVanChuyenNhap_PhieuNhapVD_idPhieuNhap",
                        column: x => x.idPhieuNhap,
                        principalTable: "PhieuNhapVD",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChiTietVanChuyenNhap_VatTu_idVatTu",
                        column: x => x.idVatTu,
                        principalTable: "VatTu",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietVanChuyenNhap_idPhieuNhap",
                table: "ChiTietVanChuyenNhap",
                column: "idPhieuNhap");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietVanChuyenNhap_idVatTu",
                table: "ChiTietVanChuyenNhap",
                column: "idVatTu");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuNhapVD_idVanChuyen",
                table: "PhieuNhapVD",
                column: "idVanChuyen");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChiTietVanChuyenNhap");

            migrationBuilder.DropTable(
                name: "PhieuNhapVD");
        }
    }
}
