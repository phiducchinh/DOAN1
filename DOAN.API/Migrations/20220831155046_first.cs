using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DOAN.API.Migrations
{
    public partial class first : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                name: "PMVatDung",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    maPhieu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ghiChu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isCheck = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PMVatDung", x => x.id);
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
                    soLuong = table.Column<double>(type: "float", nullable: false),
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
                    soLuongConLai = table.Column<int>(type: "int", nullable: false),
                    soLuongChuaSD = table.Column<int>(type: "int", nullable: true),
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
                    trangThaiThanhToan = table.Column<int>(type: "int", nullable: true),
                    ngayBatDau = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ngayKetThuc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    soMamPhatSinh = table.Column<int>(type: "int", nullable: true),
                    tienCoc = table.Column<int>(type: "int", nullable: true),
                    idBeptruong = table.Column<int>(type: "int", nullable: false),
                    ghiChu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isThucDon = table.Column<int>(type: "int", nullable: true),
                    isVanChuyen = table.Column<int>(type: "int", nullable: true),
                    isPhieuMua = table.Column<int>(type: "int", nullable: true),
                    isPhieuXuat = table.Column<int>(type: "int", nullable: true),
                    isHoaDon = table.Column<int>(type: "int", nullable: true)
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
                name: "PNVatDung",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    maPhieu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    idPhieuMua = table.Column<int>(type: "int", nullable: false),
                    ghiChu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    nguonGoc = table.Column<int>(type: "int", nullable: true),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PNVatDung", x => x.id);
                    table.ForeignKey(
                        name: "FK_PNVatDung_PMVatDung_idPhieuMua",
                        column: x => x.idPhieuMua,
                        principalTable: "PMVatDung",
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
                    soLuong = table.Column<double>(type: "float", nullable: false),
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
                name: "ChiTietPhieuMuaVatDung",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    idVatTu = table.Column<int>(type: "int", nullable: false),
                    soLuong = table.Column<int>(type: "int", nullable: false),
                    nhaCungCap = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    idPhieuMua = table.Column<int>(type: "int", nullable: false),
                    isCheck = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietPhieuMuaVatDung", x => x.id);
                    table.ForeignKey(
                        name: "FK_ChiTietPhieuMuaVatDung_PMVatDung_idPhieuMua",
                        column: x => x.idPhieuMua,
                        principalTable: "PMVatDung",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChiTietPhieuMuaVatDung_VatTu_idVatTu",
                        column: x => x.idVatTu,
                        principalTable: "VatTu",
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
                    idHopDong = table.Column<int>(type: "int", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ghiChu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isCheck = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HoaDonMua", x => x.id);
                    table.ForeignKey(
                        name: "FK_HoaDonMua_HopDong_idHopDong",
                        column: x => x.idHopDong,
                        principalTable: "HopDong",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "HoaDonXuat",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    maHoaDon = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    idHopDong = table.Column<int>(type: "int", nullable: true),
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
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ThanhToan",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    maHoaDon = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: true),
                    idHopDong = table.Column<int>(type: "int", nullable: false),
                    tienPhatSinh = table.Column<int>(type: "int", nullable: false),
                    tongTien = table.Column<int>(type: "int", nullable: false),
                    ghiChu = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThanhToan", x => x.id);
                    table.ForeignKey(
                        name: "FK_ThanhToan_HopDong_idHopDong",
                        column: x => x.idHopDong,
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
                    idHopDong = table.Column<int>(type: "int", nullable: true),
                    trangThai = table.Column<int>(type: "int", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ngayDi = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ngayDon = table.Column<DateTime>(type: "datetime2", nullable: true),
                    maPhieu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    diaChi = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    soDienThoai = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VanChuyen", x => x.id);
                    table.ForeignKey(
                        name: "FK_VanChuyen_HopDong_idHopDong",
                        column: x => x.idHopDong,
                        principalTable: "HopDong",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ChiTietPhieuNhapVatDung",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    lan = table.Column<int>(type: "int", nullable: true),
                    idVatTu = table.Column<int>(type: "int", nullable: false),
                    soLuong = table.Column<int>(type: "int", nullable: false),
                    giaNhap = table.Column<int>(type: "int", nullable: true),
                    idPhieuNhap = table.Column<int>(type: "int", nullable: false),
                    ngayNhap = table.Column<DateTime>(type: "datetime2", nullable: true),
                    nhaCungCap = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietPhieuNhapVatDung", x => x.id);
                    table.ForeignKey(
                        name: "FK_ChiTietPhieuNhapVatDung_PNVatDung_idPhieuNhap",
                        column: x => x.idPhieuNhap,
                        principalTable: "PNVatDung",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChiTietPhieuNhapVatDung_VatTu_idVatTu",
                        column: x => x.idVatTu,
                        principalTable: "VatTu",
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

            migrationBuilder.CreateTable(
                name: "HoaDonNhap",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    maHoaDon = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    idPhieuMua = table.Column<int>(type: "int", nullable: false),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: true),
                    giaTien = table.Column<int>(type: "int", nullable: true),
                    ghiChu = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HoaDonNhap", x => x.id);
                    table.ForeignKey(
                        name: "FK_HoaDonNhap_HoaDonMua_idPhieuMua",
                        column: x => x.idPhieuMua,
                        principalTable: "HoaDonMua",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChiTietPhieuXuat",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    idHoaDon = table.Column<int>(type: "int", nullable: false),
                    idThucPham = table.Column<int>(type: "int", nullable: false),
                    soLuong = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietPhieuXuat", x => x.id);
                    table.ForeignKey(
                        name: "FK_ChiTietPhieuXuat_HoaDonXuat_idHoaDon",
                        column: x => x.idHoaDon,
                        principalTable: "HoaDonXuat",
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
                name: "ChiTietVanChuyen",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    maPhieu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    lan = table.Column<int>(type: "int", nullable: true),
                    idVanChuyen = table.Column<int>(type: "int", nullable: false),
                    idVatTu = table.Column<int>(type: "int", nullable: false),
                    soLuong = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietVanChuyen", x => x.id);
                    table.ForeignKey(
                        name: "FK_ChiTietVanChuyen_VanChuyen_idVanChuyen",
                        column: x => x.idVanChuyen,
                        principalTable: "VanChuyen",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChiTietVanChuyen_VatTu_idVatTu",
                        column: x => x.idVatTu,
                        principalTable: "VatTu",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PhieuXuatVD",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    maPhieu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    idVanChuyen = table.Column<int>(type: "int", nullable: false),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: true),
                    isCheck = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuXuatVD", x => x.id);
                    table.ForeignKey(
                        name: "FK_PhieuXuatVD_VanChuyen_idVanChuyen",
                        column: x => x.idVanChuyen,
                        principalTable: "VanChuyen",
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
                    lan = table.Column<int>(type: "int", nullable: true),
                    NCC = table.Column<string>(type: "nvarchar(max)", nullable: true)
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
                name: "ChiTietVanChuyenXuat",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    lan = table.Column<int>(type: "int", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: true),
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
                name: "PhieuNhapVD",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    maPhieu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    idPhieuXuat = table.Column<int>(type: "int", nullable: false),
                    nguonGoc = table.Column<int>(type: "int", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ghiChu = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuNhapVD", x => x.id);
                    table.ForeignKey(
                        name: "FK_PhieuNhapVD_PhieuXuatVD_idPhieuXuat",
                        column: x => x.idPhieuXuat,
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
                    lan = table.Column<int>(type: "int", nullable: true),
                    idVatTu = table.Column<int>(type: "int", nullable: false),
                    soLuong = table.Column<int>(type: "int", nullable: true),
                    ngayNhap = table.Column<DateTime>(type: "datetime2", nullable: true)
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
                name: "IX_ChiTietPhieuMua_idHoaDon",
                table: "ChiTietPhieuMua",
                column: "idHoaDon");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuMua_idThucPham",
                table: "ChiTietPhieuMua",
                column: "idThucPham");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuMuaVatDung_idPhieuMua",
                table: "ChiTietPhieuMuaVatDung",
                column: "idPhieuMua");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuMuaVatDung_idVatTu",
                table: "ChiTietPhieuMuaVatDung",
                column: "idVatTu");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuNhap_idHoaDon",
                table: "ChiTietPhieuNhap",
                column: "idHoaDon");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuNhap_idThucPham",
                table: "ChiTietPhieuNhap",
                column: "idThucPham");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuNhapVatDung_idPhieuNhap",
                table: "ChiTietPhieuNhapVatDung",
                column: "idPhieuNhap");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuNhapVatDung_idVatTu",
                table: "ChiTietPhieuNhapVatDung",
                column: "idVatTu");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuXuat_idHoaDon",
                table: "ChiTietPhieuXuat",
                column: "idHoaDon");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuXuat_idThucPham",
                table: "ChiTietPhieuXuat",
                column: "idThucPham");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietVanChuyen_idVanChuyen",
                table: "ChiTietVanChuyen",
                column: "idVanChuyen");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietVanChuyen_idVatTu",
                table: "ChiTietVanChuyen",
                column: "idVatTu");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietVanChuyenNhap_idPhieuNhap",
                table: "ChiTietVanChuyenNhap",
                column: "idPhieuNhap");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietVanChuyenNhap_idVatTu",
                table: "ChiTietVanChuyenNhap",
                column: "idVatTu");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietVanChuyenXuat_idPhieuXuat",
                table: "ChiTietVanChuyenXuat",
                column: "idPhieuXuat");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietVanChuyenXuat_idVatTu",
                table: "ChiTietVanChuyenXuat",
                column: "idVatTu");

            migrationBuilder.CreateIndex(
                name: "IX_DungCuKemMonAn_idMonAn",
                table: "DungCuKemMonAn",
                column: "idMonAn");

            migrationBuilder.CreateIndex(
                name: "IX_DungCuKemMonAn_idVatTu",
                table: "DungCuKemMonAn",
                column: "idVatTu");

            migrationBuilder.CreateIndex(
                name: "IX_HoaDonMua_idHopDong",
                table: "HoaDonMua",
                column: "idHopDong");

            migrationBuilder.CreateIndex(
                name: "IX_HoaDonNhap_idPhieuMua",
                table: "HoaDonNhap",
                column: "idPhieuMua");

            migrationBuilder.CreateIndex(
                name: "IX_HoaDonXuat_idHopDong",
                table: "HoaDonXuat",
                column: "idHopDong");

            migrationBuilder.CreateIndex(
                name: "IX_HopDong_idBeptruong",
                table: "HopDong",
                column: "idBeptruong");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuNhapVD_idPhieuXuat",
                table: "PhieuNhapVD",
                column: "idPhieuXuat");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuXuatVD_idVanChuyen",
                table: "PhieuXuatVD",
                column: "idVanChuyen");

            migrationBuilder.CreateIndex(
                name: "IX_PNVatDung_idPhieuMua",
                table: "PNVatDung",
                column: "idPhieuMua");

            migrationBuilder.CreateIndex(
                name: "IX_ThanhToan_idHopDong",
                table: "ThanhToan",
                column: "idHopDong");

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
                name: "ChiTietPhieuMuaVatDung");

            migrationBuilder.DropTable(
                name: "ChiTietPhieuNhap");

            migrationBuilder.DropTable(
                name: "ChiTietPhieuNhapVatDung");

            migrationBuilder.DropTable(
                name: "ChiTietPhieuXuat");

            migrationBuilder.DropTable(
                name: "ChiTietVanChuyen");

            migrationBuilder.DropTable(
                name: "ChiTietVanChuyenNhap");

            migrationBuilder.DropTable(
                name: "ChiTietVanChuyenXuat");

            migrationBuilder.DropTable(
                name: "DungCuKemMonAn");

            migrationBuilder.DropTable(
                name: "ThanhToan");

            migrationBuilder.DropTable(
                name: "ThucDon");

            migrationBuilder.DropTable(
                name: "ThucPhamKemMonAn");

            migrationBuilder.DropTable(
                name: "HoaDonNhap");

            migrationBuilder.DropTable(
                name: "PNVatDung");

            migrationBuilder.DropTable(
                name: "HoaDonXuat");

            migrationBuilder.DropTable(
                name: "PhieuNhapVD");

            migrationBuilder.DropTable(
                name: "VatTu");

            migrationBuilder.DropTable(
                name: "MonAn");

            migrationBuilder.DropTable(
                name: "ThucPham");

            migrationBuilder.DropTable(
                name: "HoaDonMua");

            migrationBuilder.DropTable(
                name: "PMVatDung");

            migrationBuilder.DropTable(
                name: "PhieuXuatVD");

            migrationBuilder.DropTable(
                name: "VanChuyen");

            migrationBuilder.DropTable(
                name: "HopDong");

            migrationBuilder.DropTable(
                name: "NhanVien");
        }
    }
}
