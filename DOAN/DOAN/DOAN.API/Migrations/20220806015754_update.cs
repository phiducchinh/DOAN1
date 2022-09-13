using Microsoft.EntityFrameworkCore.Migrations;

namespace DOAN.API.Migrations
{
    public partial class update : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ThucDon_HopDong_idHopDong",
                table: "ThucDon");

            migrationBuilder.AlterColumn<double>(
                name: "soLuong",
                table: "ThucPhamKemMonAn",
                type: "float",
                nullable: false,
                defaultValue: 0.0,
                oldClrType: typeof(double),
                oldType: "float",
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

            migrationBuilder.AddColumn<int>(
                name: "isPhieuMua",
                table: "HopDong",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "isVanChuyen",
                table: "HopDong",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_ThucDon_HopDong_idHopDong",
                table: "ThucDon",
                column: "idHopDong",
                principalTable: "HopDong",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ThucDon_HopDong_idHopDong",
                table: "ThucDon");

            migrationBuilder.DropColumn(
                name: "isPhieuMua",
                table: "HopDong");

            migrationBuilder.DropColumn(
                name: "isVanChuyen",
                table: "HopDong");

            migrationBuilder.AlterColumn<double>(
                name: "soLuong",
                table: "ThucPhamKemMonAn",
                type: "float",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "float");

            migrationBuilder.AlterColumn<int>(
                name: "idHopDong",
                table: "ThucDon",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_ThucDon_HopDong_idHopDong",
                table: "ThucDon",
                column: "idHopDong",
                principalTable: "HopDong",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
