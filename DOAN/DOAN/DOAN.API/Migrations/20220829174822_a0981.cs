using Microsoft.EntityFrameworkCore.Migrations;

namespace DOAN.API.Migrations
{
    public partial class a0981 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PNVatDung_PMVatDung_maPhieuMua",
                table: "PNVatDung");

            migrationBuilder.DropIndex(
                name: "IX_PNVatDung_maPhieuMua",
                table: "PNVatDung");

            migrationBuilder.AddColumn<int>(
                name: "idPhieuMua",
                table: "PNVatDung",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_PNVatDung_idPhieuMua",
                table: "PNVatDung",
                column: "idPhieuMua");

            migrationBuilder.AddForeignKey(
                name: "FK_PNVatDung_PMVatDung_idPhieuMua",
                table: "PNVatDung",
                column: "idPhieuMua",
                principalTable: "PMVatDung",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PNVatDung_PMVatDung_idPhieuMua",
                table: "PNVatDung");

            migrationBuilder.DropIndex(
                name: "IX_PNVatDung_idPhieuMua",
                table: "PNVatDung");

            migrationBuilder.DropColumn(
                name: "idPhieuMua",
                table: "PNVatDung");

            migrationBuilder.CreateIndex(
                name: "IX_PNVatDung_maPhieuMua",
                table: "PNVatDung",
                column: "maPhieuMua");

            migrationBuilder.AddForeignKey(
                name: "FK_PNVatDung_PMVatDung_maPhieuMua",
                table: "PNVatDung",
                column: "maPhieuMua",
                principalTable: "PMVatDung",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
