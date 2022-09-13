using Microsoft.EntityFrameworkCore.Migrations;

namespace DOAN.API.Migrations
{
    public partial class abtt : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HoaDonXuat_HopDong_idHopDong",
                table: "HoaDonXuat");

            migrationBuilder.AddColumn<string>(
                name: "diaChi",
                table: "VanChuyen",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "soDienThoai",
                table: "VanChuyen",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "idHopDong",
                table: "HoaDonXuat",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_HoaDonXuat_HopDong_idHopDong",
                table: "HoaDonXuat",
                column: "idHopDong",
                principalTable: "HopDong",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HoaDonXuat_HopDong_idHopDong",
                table: "HoaDonXuat");

            migrationBuilder.DropColumn(
                name: "diaChi",
                table: "VanChuyen");

            migrationBuilder.DropColumn(
                name: "soDienThoai",
                table: "VanChuyen");

            migrationBuilder.AlterColumn<int>(
                name: "idHopDong",
                table: "HoaDonXuat",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_HoaDonXuat_HopDong_idHopDong",
                table: "HoaDonXuat",
                column: "idHopDong",
                principalTable: "HopDong",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
