using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DOAN.API.Migrations
{
    public partial class a : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "HoaDonNhap",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    maHoaDon = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: true),
                    giaTien = table.Column<int>(type: "int", nullable: true),
                    benBan = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ghiChu = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HoaDonNhap", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "MonAn",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tenMonAn = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    loai = table.Column<int>(type: "int", nullable: false),
                    giaTien = table.Column<int>(type: "int", nullable: false),
                    ghiChu = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MonAn", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "NhanVien",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tenNhanVien = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    chucVu = table.Column<int>(type: "int", nullable: true),
                    soDienThoai = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    queQuan = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    luongCB = table.Column<int>(type: "int", nullable: true),
                    trangThai = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NhanVien", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "ThucPham",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tenThucPham = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    maThucPham = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    loai = table.Column<int>(type: "int", nullable: true),
                    donVi = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ghiChu = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThucPham", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "VatTu",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    maVatTu = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    tenVatTu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    soLuongTong = table.Column<int>(type: "int", nullable: true),
                    soLuongConLai = table.Column<int>(type: "int", nullable: true),
                    trangThai = table.Column<int>(type: "int", nullable: true),
                    ghiChu = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VatTu", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "HopDong",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    maHopDong = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    tenHopDong = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    tenKhachHang = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    diaChi = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    soDienThoai = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    soMam = table.Column<int>(type: "int", nullable: false),
                    suDungBanGhe = table.Column<int>(type: "int", nullable: false),
                    trangThai = table.Column<int>(type: "int", nullable: false),
                    trangThaiThanhToan = table.Column<int>(type: "int", nullable: false),
                    ngayBatDau = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ngayKetThuc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    soMamPhatSinh = table.Column<int>(type: "int", nullable: true),
                    tienCoc = table.Column<int>(type: "int", nullable: true),
                    tongTien = table.Column<int>(type: "int", nullable: true),
                    tienPhatSinh = table.Column<int>(type: "int", nullable: true),
                    idBeptruong = table.Column<int>(type: "int", nullable: false),
                    ghiChu = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HopDong", x => x.id);
                    table.ForeignKey(
                        name: "FK_HopDong_NhanVien_idBeptruong",
                        column: x => x.idBeptruong,
                        principalTable: "NhanVien",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChiTietPhieuNhap",
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
                    table.PrimaryKey("PK_ChiTietPhieuNhap", x => x.id);
                    table.ForeignKey(
                        name: "FK_ChiTietPhieuNhap_HoaDonNhap_idHoaDon",
                        column: x => x.idHoaDon,
                        principalTable: "HoaDonNhap",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChiTietPhieuNhap_ThucPham_idThucPham",
                        column: x => x.idThucPham,
                        principalTable: "ThucPham",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ThucPhamKemMonAn",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    idMonAn = table.Column<int>(type: "int", nullable: false),
                    idThucPham = table.Column<int>(type: "int", nullable: false),
                    soLuong = table.Column<double>(type: "float", nullable: true),
                    ghiChu = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThucPhamKemMonAn", x => x.id);
                    table.ForeignKey(
                        name: "FK_ThucPhamKemMonAn_MonAn_idMonAn",
                        column: x => x.idMonAn,
                        principalTable: "MonAn",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ThucPhamKemMonAn_ThucPham_idThucPham",
                        column: x => x.idThucPham,
                        principalTable: "ThucPham",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DungCuKemMonAn",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    idMonAn = table.Column<int>(type: "int", nullable: false),
                    idVatTu = table.Column<int>(type: "int", nullable: false),
                    soLuong = table.Column<int>(type: "int", nullable: false),
                    ghiChu = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DungCuKemMonAn", x => x.id);
                    table.ForeignKey(
                        name: "FK_DungCuKemMonAn_MonAn_idMonAn",
                        column: x => x.idMonAn,
                        principalTable: "MonAn",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DungCuKemMonAn_VatTu_idVatTu",
                        column: x => x.idVatTu,
                        principalTable: "VatTu",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HoaDonMua",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    maHoaDon = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    idThucDon = table.Column<int>(type: "int", nullable: false),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ghiChu = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HoaDonMua", x => x.id);
                    table.ForeignKey(
                        name: "FK_HoaDonMua_HopDong_idThucDon",
                        column: x => x.idThucDon,
                        principalTable: "HopDong",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ThucDon",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    idHopDong = table.Column<int>(type: "int", nullable: false),
                    idMonAn = table.Column<int>(type: "int", nullable: false),
                    giaTien = table.Column<int>(type: "int", nullable: false),
                    ghiChu = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThucDon", x => x.id);
                    table.ForeignKey(
                        name: "FK_ThucDon_HopDong_idHopDong",
                        column: x => x.idHopDong,
                        principalTable: "HopDong",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ThucDon_MonAn_idMonAn",
                        column: x => x.idMonAn,
                        principalTable: "MonAn",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VanChuyen",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    idHopDong = table.Column<int>(type: "int", nullable: false),
                    trangThai = table.Column<int>(type: "int", nullable: true),
                    soMamDaDon = table.Column<int>(type: "int", nullable: false),
                    ngayDi = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ngayDon = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VanChuyen", x => x.id);
                    table.ForeignKey(
                        name: "FK_VanChuyen_HopDong_idHopDong",
                        column: x => x.idHopDong,
                        principalTable: "HopDong",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChiTietPhieuMua",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    idHoaDon = table.Column<int>(type: "int", nullable: false),
                    idThucPham = table.Column<int>(type: "int", nullable: false),
                    soLuong = table.Column<double>(type: "float", nullable: false),
                    ghiChu = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietPhieuMua", x => x.id);
                    table.ForeignKey(
                        name: "FK_ChiTietPhieuMua_HoaDonMua_idHoaDon",
                        column: x => x.idHoaDon,
                        principalTable: "HoaDonMua",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChiTietPhieuMua_ThucPham_idThucPham",
                        column: x => x.idThucPham,
                        principalTable: "ThucPham",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuMua_idHoaDon",
                table: "ChiTietPhieuMua",
                column: "idHoaDon");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuMua_idThucPham",
                table: "ChiTietPhieuMua",
                column: "idThucPham");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuNhap_idHoaDon",
                table: "ChiTietPhieuNhap",
                column: "idHoaDon");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuNhap_idThucPham",
                table: "ChiTietPhieuNhap",
                column: "idThucPham");

            migrationBuilder.CreateIndex(
                name: "IX_DungCuKemMonAn_idMonAn",
                table: "DungCuKemMonAn",
                column: "idMonAn");

            migrationBuilder.CreateIndex(
                name: "IX_DungCuKemMonAn_idVatTu",
                table: "DungCuKemMonAn",
                column: "idVatTu");

            migrationBuilder.CreateIndex(
                name: "IX_HoaDonMua_idThucDon",
                table: "HoaDonMua",
                column: "idThucDon");

            migrationBuilder.CreateIndex(
                name: "IX_HopDong_idBeptruong",
                table: "HopDong",
                column: "idBeptruong");

            migrationBuilder.CreateIndex(
                name: "IX_ThucDon_idHopDong",
                table: "ThucDon",
                column: "idHopDong");

            migrationBuilder.CreateIndex(
                name: "IX_ThucDon_idMonAn",
                table: "ThucDon",
                column: "idMonAn");

            migrationBuilder.CreateIndex(
                name: "IX_ThucPhamKemMonAn_idMonAn",
                table: "ThucPhamKemMonAn",
                column: "idMonAn");

            migrationBuilder.CreateIndex(
                name: "IX_ThucPhamKemMonAn_idThucPham",
                table: "ThucPhamKemMonAn",
                column: "idThucPham");

            migrationBuilder.CreateIndex(
                name: "IX_VanChuyen_idHopDong",
                table: "VanChuyen",
                column: "idHopDong");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChiTietPhieuMua");

            migrationBuilder.DropTable(
                name: "ChiTietPhieuNhap");

            migrationBuilder.DropTable(
                name: "DungCuKemMonAn");

            migrationBuilder.DropTable(
                name: "ThucDon");

            migrationBuilder.DropTable(
                name: "ThucPhamKemMonAn");

            migrationBuilder.DropTable(
                name: "VanChuyen");

            migrationBuilder.DropTable(
                name: "HoaDonMua");

            migrationBuilder.DropTable(
                name: "HoaDonNhap");

            migrationBuilder.DropTable(
                name: "VatTu");

            migrationBuilder.DropTable(
                name: "MonAn");

            migrationBuilder.DropTable(
                name: "ThucPham");

            migrationBuilder.DropTable(
                name: "HopDong");

            migrationBuilder.DropTable(
                name: "NhanVien");
        }
    }
}
