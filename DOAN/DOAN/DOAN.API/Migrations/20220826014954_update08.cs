using Microsoft.EntityFrameworkCore.Migrations;

namespace DOAN.API.Migrations
{
    public partial class update08 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ghiChu",
                table: "PhieuNhapVD",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "trangThaiThanhToan",
                table: "HopDong",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "lan",
                table: "ChiTietVanChuyenNhap",
                type: "int",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ghiChu",
                table: "PhieuNhapVD");

            migrationBuilder.DropColumn(
                name: "lan",
                table: "ChiTietVanChuyenNhap");

            migrationBuilder.AlterColumn<int>(
                name: "trangThaiThanhToan",
                table: "HopDong",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }
    }
}
