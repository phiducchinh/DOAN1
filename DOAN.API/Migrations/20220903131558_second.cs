using Microsoft.EntityFrameworkCore.Migrations;

namespace DOAN.API.Migrations
{
    public partial class second : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HopDong_NhanVien_idBeptruong",
                table: "HopDong");

            migrationBuilder.AlterColumn<int>(
                name: "idBeptruong",
                table: "HopDong",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_HopDong_NhanVien_idBeptruong",
                table: "HopDong",
                column: "idBeptruong",
                principalTable: "NhanVien",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HopDong_NhanVien_idBeptruong",
                table: "HopDong");

            migrationBuilder.AlterColumn<int>(
                name: "idBeptruong",
                table: "HopDong",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_HopDong_NhanVien_idBeptruong",
                table: "HopDong",
                column: "idBeptruong",
                principalTable: "NhanVien",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
