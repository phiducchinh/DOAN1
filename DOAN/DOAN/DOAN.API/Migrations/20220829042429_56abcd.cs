using Microsoft.EntityFrameworkCore.Migrations;

namespace DOAN.API.Migrations
{
    public partial class _56abcd : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "nguoiGoc",
                table: "PhieuNhapVD",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "isCheck",
                table: "ChiTietPhieuMuaVatDung",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "nguoiGoc",
                table: "PhieuNhapVD");

            migrationBuilder.AlterColumn<int>(
                name: "isCheck",
                table: "ChiTietPhieuMuaVatDung",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }
    }
}
