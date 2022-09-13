using Microsoft.EntityFrameworkCore.Migrations;

namespace DOAN.API.Migrations
{
    public partial class pu : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "soLuongDaSuDung",
                table: "ChiTietPhieuNhap",
                newName: "soLuongConLai");

            migrationBuilder.AddColumn<int>(
                name: "isCheck",
                table: "ChiTietPhieuNhap",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "isCheck",
                table: "ChiTietPhieuNhap");

            migrationBuilder.RenameColumn(
                name: "soLuongConLai",
                table: "ChiTietPhieuNhap",
                newName: "soLuongDaSuDung");
        }
    }
}
