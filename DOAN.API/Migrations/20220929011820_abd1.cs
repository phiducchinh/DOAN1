using Microsoft.EntityFrameworkCore.Migrations;

namespace DOAN.API.Migrations
{
    public partial class abd1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "idThucDonMau",
                table: "ThucDon",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "tenThucDon",
                table: "ThucDon",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "idThucDonMau",
                table: "ThucDon");

            migrationBuilder.DropColumn(
                name: "tenThucDon",
                table: "ThucDon");
        }
    }
}
