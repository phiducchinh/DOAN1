using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DOAN.API.Migrations
{
    public partial class first32 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChiTietPhieuNhap_HoaDonNhap_idHoaDon",
                table: "ChiTietPhieuNhap");

            migrationBuilder.DropForeignKey(
                name: "FK_PhieuXuatVD_VanChuyen_idHopDong",
                table: "PhieuXuatVD");

            migrationBuilder.DropIndex(
                name: "IX_PhieuXuatVD_idHopDong",
                table: "PhieuXuatVD");

            migrationBuilder.DropColumn(
                name: "soMamDaDon",
                table: "VanChuyen");

            migrationBuilder.DropColumn(
                name: "idHopDong",
                table: "PhieuXuatVD");

            migrationBuilder.DropColumn(
                name: "tienPhatSinh",
                table: "HopDong");

            migrationBuilder.DropColumn(
                name: "tongTien",
                table: "HopDong");

            migrationBuilder.DropColumn(
                name: "idThucDon",
                table: "HoaDonMua");

            migrationBuilder.DropColumn(
                name: "loai",
                table: "ChiTietVanChuyen");

            migrationBuilder.AddColumn<int>(
                name: "idHopDong",
                table: "HoaDonMua",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ChiTietPhieuXuat",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    idHoaDon = table.Column<int>(type: "int", nullable: false),
                    idThucPham = table.Column<int>(type: "int", nullable: false),
                    soLuong = table.Column<double>(type: "float", nullable: false),
                    hanSuDung = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ghiChu = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietPhieuXuat", x => x.id);
                    table.ForeignKey(
                        name: "FK_ChiTietPhieuXuat_HoaDonNhap_idHoaDon",
                        column: x => x.idHoaDon,
                        principalTable: "HoaDonNhap",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChiTietPhieuXuat_ThucPham_idThucPham",
                        column: x => x.idThucPham,
                        principalTable: "ThucPham",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChiTietVanChuyenXuat",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    maPhieu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    idPhieuXuat = table.Column<int>(type: "int", nullable: false),
                    idVatTu = table.Column<int>(type: "int", nullable: false),
                    soLuong = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietVanChuyenXuat", x => x.id);
                    table.ForeignKey(
                        name: "FK_ChiTietVanChuyenXuat_PhieuXuatVD_idPhieuXuat",
                        column: x => x.idPhieuXuat,
                        principalTable: "PhieuXuatVD",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChiTietVanChuyenXuat_VatTu_idVatTu",
                        column: x => x.idVatTu,
                        principalTable: "VatTu",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HoaDonXuat",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    maHoaDon = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    idHopDong = table.Column<int>(type: "int", nullable: false),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ghiChu = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HoaDonXuat", x => x.id);
                    table.ForeignKey(
                        name: "FK_HoaDonXuat_HopDong_idHopDong",
                        column: x => x.idHopDong,
                        principalTable: "HopDong",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PhieuXuatVD_idVanChuyen",
                table: "PhieuXuatVD",
                column: "idVanChuyen");

            migrationBuilder.CreateIndex(
                name: "IX_HoaDonMua_idHopDong",
                table: "HoaDonMua",
                column: "idHopDong");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuXuat_idHoaDon",
                table: "ChiTietPhieuXuat",
                column: "idHoaDon");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuXuat_idThucPham",
                table: "ChiTietPhieuXuat",
                column: "idThucPham");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietVanChuyenXuat_idPhieuXuat",
                table: "ChiTietVanChuyenXuat",
                column: "idPhieuXuat");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietVanChuyenXuat_idVatTu",
                table: "ChiTietVanChuyenXuat",
                column: "idVatTu");

            migrationBuilder.CreateIndex(
                name: "IX_HoaDonXuat_idHopDong",
                table: "HoaDonXuat",
                column: "idHopDong");

            migrationBuilder.AddForeignKey(
                name: "FK_ChiTietPhieuNhap_HoaDonXuat_idHoaDon",
                table: "ChiTietPhieuNhap",
                column: "idHoaDon",
                principalTable: "HoaDonXuat",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_HoaDonMua_HopDong_idHopDong",
                table: "HoaDonMua",
                column: "idHopDong",
                principalTable: "HopDong",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PhieuXuatVD_VanChuyen_idVanChuyen",
                table: "PhieuXuatVD",
                column: "idVanChuyen",
                principalTable: "VanChuyen",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChiTietPhieuNhap_HoaDonXuat_idHoaDon",
                table: "ChiTietPhieuNhap");

            migrationBuilder.DropForeignKey(
                name: "FK_HoaDonMua_HopDong_idHopDong",
                table: "HoaDonMua");

            migrationBuilder.DropForeignKey(
                name: "FK_PhieuXuatVD_VanChuyen_idVanChuyen",
                table: "PhieuXuatVD");

            migrationBuilder.DropTable(
                name: "ChiTietPhieuXuat");

            migrationBuilder.DropTable(
                name: "ChiTietVanChuyenXuat");

            migrationBuilder.DropTable(
                name: "HoaDonXuat");

            migrationBuilder.DropIndex(
                name: "IX_PhieuXuatVD_idVanChuyen",
                table: "PhieuXuatVD");

            migrationBuilder.DropIndex(
                name: "IX_HoaDonMua_idHopDong",
                table: "HoaDonMua");

            migrationBuilder.DropColumn(
                name: "idHopDong",
                table: "HoaDonMua");

            migrationBuilder.AddColumn<int>(
                name: "soMamDaDon",
                table: "VanChuyen",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "idHopDong",
                table: "PhieuXuatVD",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "tienPhatSinh",
                table: "HopDong",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "tongTien",
                table: "HopDong",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "idThucDon",
                table: "HoaDonMua",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "loai",
                table: "ChiTietVanChuyen",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_PhieuXuatVD_idHopDong",
                table: "PhieuXuatVD",
                column: "idHopDong");

            migrationBuilder.AddForeignKey(
                name: "FK_ChiTietPhieuNhap_HoaDonNhap_idHoaDon",
                table: "ChiTietPhieuNhap",
                column: "idHoaDon",
                principalTable: "HoaDonNhap",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PhieuXuatVD_VanChuyen_idHopDong",
                table: "PhieuXuatVD",
                column: "idHopDong",
                principalTable: "VanChuyen",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
