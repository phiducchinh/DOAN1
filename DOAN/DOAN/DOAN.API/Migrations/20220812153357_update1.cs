using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DOAN.API.Migrations
{
    public partial class update1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HoaDonNhap_HoaDonMua_idPhieuNhap",
                table: "HoaDonNhap");

            migrationBuilder.RenameColumn(
                name: "idPhieuNhap",
                table: "HoaDonNhap",
                newName: "idPhieuMua");

            migrationBuilder.RenameIndex(
                name: "IX_HoaDonNhap_idPhieuNhap",
                table: "HoaDonNhap",
                newName: "IX_HoaDonNhap_idPhieuMua");

            migrationBuilder.AlterColumn<int>(
                name: "soLuongConLai",
                table: "VatTu",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<double>(
                name: "soLuong",
                table: "ThucPham",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

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

            migrationBuilder.CreateIndex(
                name: "IX_ThanhToan_idHopDong",
                table: "ThanhToan",
                column: "idHopDong");

            migrationBuilder.AddForeignKey(
                name: "FK_HoaDonNhap_HoaDonMua_idPhieuMua",
                table: "HoaDonNhap",
                column: "idPhieuMua",
                principalTable: "HoaDonMua",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HoaDonNhap_HoaDonMua_idPhieuMua",
                table: "HoaDonNhap");

            migrationBuilder.DropTable(
                name: "ThanhToan");

            migrationBuilder.DropColumn(
                name: "soLuong",
                table: "ThucPham");

            migrationBuilder.RenameColumn(
                name: "idPhieuMua",
                table: "HoaDonNhap",
                newName: "idPhieuNhap");

            migrationBuilder.RenameIndex(
                name: "IX_HoaDonNhap_idPhieuMua",
                table: "HoaDonNhap",
                newName: "IX_HoaDonNhap_idPhieuNhap");

            migrationBuilder.AlterColumn<int>(
                name: "soLuongConLai",
                table: "VatTu",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_HoaDonNhap_HoaDonMua_idPhieuNhap",
                table: "HoaDonNhap",
                column: "idPhieuNhap",
                principalTable: "HoaDonMua",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
