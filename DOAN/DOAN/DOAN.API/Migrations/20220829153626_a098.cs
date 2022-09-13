using Microsoft.EntityFrameworkCore.Migrations;

namespace DOAN.API.Migrations
{
    public partial class a098 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "nguoiGoc",
                table: "PhieuNhapVD",
                newName: "nguonGoc");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "nguonGoc",
                table: "PhieuNhapVD",
                newName: "nguoiGoc");
        }
    }
}
