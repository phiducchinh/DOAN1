using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DOAN.API.Migrations
{
    public partial class update4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "maPhieu",
                table: "VanChuyen",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "PhieuXuatVD",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    maPhieu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    idVanChuyen = table.Column<int>(type: "int", nullable: false),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    loai = table.Column<int>(type: "int", nullable: false),
                    idHopDong = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuXuatVD", x => x.id);
                    table.ForeignKey(
                        name: "FK_PhieuXuatVD_VanChuyen_idHopDong",
                        column: x => x.idHopDong,
                        principalTable: "VanChuyen",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PhieuXuatVD_idHopDong",
                table: "PhieuXuatVD",
                column: "idHopDong");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PhieuXuatVD");

            migrationBuilder.DropColumn(
                name: "maPhieu",
                table: "VanChuyen");
        }
    }
}
