using Microsoft.EntityFrameworkCore.Migrations;

namespace DOAN.API.Migrations
{
    public partial class add1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "phieuMua",
                table: "HopDong");

            migrationBuilder.DropColumn(
                name: "vanChuyen",
                table: "HopDong");

            migrationBuilder.AlterColumn<int>(
                name: "isVanChuyen",
                table: "HopDong",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "isPhieuMua",
                table: "HopDong",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "loai",
                table: "ChiTietVanChuyen",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "loai",
                table: "ChiTietVanChuyen");

            migrationBuilder.AlterColumn<int>(
                name: "isVanChuyen",
                table: "HopDong",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "isPhieuMua",
                table: "HopDong",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "phieuMua",
                table: "HopDong",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "vanChuyen",
                table: "HopDong",
                type: "int",
                nullable: true);
        }
    }
}
