using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DOAN.API.Migrations
{
    public partial class _097a : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PMVatDung",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    maPhieu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ghiChu = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PMVatDung", x => x.id);
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
                    idPhieuMua = table.Column<int>(type: "int", nullable: false)
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
                name: "PNVatDung",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    maPhieu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    maPhieuMua = table.Column<int>(type: "int", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PNVatDung", x => x.id);
                    table.ForeignKey(
                        name: "FK_PNVatDung_PMVatDung_maPhieuMua",
                        column: x => x.maPhieuMua,
                        principalTable: "PMVatDung",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChiTietPhieuNhapVatDung",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    lan = table.Column<int>(type: "int", nullable: false),
                    idVatTu = table.Column<int>(type: "int", nullable: false),
                    soLuong = table.Column<int>(type: "int", nullable: false),
                    giaNhap = table.Column<int>(type: "int", nullable: true),
                    idPhieuNhap = table.Column<int>(type: "int", nullable: false),
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

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuMuaVatDung_idPhieuMua",
                table: "ChiTietPhieuMuaVatDung",
                column: "idPhieuMua");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuMuaVatDung_idVatTu",
                table: "ChiTietPhieuMuaVatDung",
                column: "idVatTu");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuNhapVatDung_idPhieuNhap",
                table: "ChiTietPhieuNhapVatDung",
                column: "idPhieuNhap");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuNhapVatDung_idVatTu",
                table: "ChiTietPhieuNhapVatDung",
                column: "idVatTu");

            migrationBuilder.CreateIndex(
                name: "IX_PNVatDung_maPhieuMua",
                table: "PNVatDung",
                column: "maPhieuMua");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChiTietPhieuMuaVatDung");

            migrationBuilder.DropTable(
                name: "ChiTietPhieuNhapVatDung");

            migrationBuilder.DropTable(
                name: "PNVatDung");

            migrationBuilder.DropTable(
                name: "PMVatDung");
        }
    }
}
