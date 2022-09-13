using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DOAN.API.Migrations
{
    public partial class _22 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HoaDonMua_HopDong_idThucDon",
                table: "HoaDonMua");

            migrationBuilder.DropForeignKey(
                name: "FK_ThucDon_HopDong_idHopDong",
                table: "ThucDon");

            migrationBuilder.DropForeignKey(
                name: "FK_VanChuyen_HopDong_idHopDong",
                table: "VanChuyen");

            migrationBuilder.DropIndex(
                name: "IX_HoaDonMua_idThucDon",
                table: "HoaDonMua");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ngayDon",
                table: "VanChuyen",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ngayDi",
                table: "VanChuyen",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<int>(
                name: "idHopDong",
                table: "VanChuyen",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "idHopDong",
                table: "ThucDon",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "idPhieuNhap",
                table: "HoaDonNhap",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "idThucDon",
                table: "HoaDonMua",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_HoaDonNhap_idPhieuNhap",
                table: "HoaDonNhap",
                column: "idPhieuNhap");

            migrationBuilder.AddForeignKey(
                name: "FK_HoaDonNhap_HoaDonMua_idPhieuNhap",
                table: "HoaDonNhap",
                column: "idPhieuNhap",
                principalTable: "HoaDonMua",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ThucDon_HopDong_idHopDong",
                table: "ThucDon",
                column: "idHopDong",
                principalTable: "HopDong",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_VanChuyen_HopDong_idHopDong",
                table: "VanChuyen",
                column: "idHopDong",
                principalTable: "HopDong",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HoaDonNhap_HoaDonMua_idPhieuNhap",
                table: "HoaDonNhap");

            migrationBuilder.DropForeignKey(
                name: "FK_ThucDon_HopDong_idHopDong",
                table: "ThucDon");

            migrationBuilder.DropForeignKey(
                name: "FK_VanChuyen_HopDong_idHopDong",
                table: "VanChuyen");

            migrationBuilder.DropIndex(
                name: "IX_HoaDonNhap_idPhieuNhap",
                table: "HoaDonNhap");

            migrationBuilder.DropColumn(
                name: "idPhieuNhap",
                table: "HoaDonNhap");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ngayDon",
                table: "VanChuyen",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "ngayDi",
                table: "VanChuyen",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "idHopDong",
                table: "VanChuyen",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "idHopDong",
                table: "ThucDon",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "idThucDon",
                table: "HoaDonMua",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_HoaDonMua_idThucDon",
                table: "HoaDonMua",
                column: "idThucDon");

            migrationBuilder.AddForeignKey(
                name: "FK_HoaDonMua_HopDong_idThucDon",
                table: "HoaDonMua",
                column: "idThucDon",
                principalTable: "HopDong",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ThucDon_HopDong_idHopDong",
                table: "ThucDon",
                column: "idHopDong",
                principalTable: "HopDong",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_VanChuyen_HopDong_idHopDong",
                table: "VanChuyen",
                column: "idHopDong",
                principalTable: "HopDong",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
