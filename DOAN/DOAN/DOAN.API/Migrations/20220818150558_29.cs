using Microsoft.EntityFrameworkCore.Migrations;

namespace DOAN.API.Migrations
{
    public partial class _29 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ghiChu",
                table: "ChiTietPhieuNhap");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ghiChu",
                table: "ChiTietPhieuNhap",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
