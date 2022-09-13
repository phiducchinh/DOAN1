using Microsoft.EntityFrameworkCore.Migrations;

namespace DOAN.API.Migrations
{
    public partial class b : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ChiTietVanChuyen",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    idVanChuyen = table.Column<int>(type: "int", nullable: false),
                    idVatTu = table.Column<int>(type: "int", nullable: false),
                    soLuong = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietVanChuyen", x => x.id);
                    table.ForeignKey(
                        name: "FK_ChiTietVanChuyen_VanChuyen_idVanChuyen",
                        column: x => x.idVanChuyen,
                        principalTable: "VanChuyen",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChiTietVanChuyen_VatTu_idVatTu",
                        column: x => x.idVatTu,
                        principalTable: "VatTu",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietVanChuyen_idVanChuyen",
                table: "ChiTietVanChuyen",
                column: "idVanChuyen");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietVanChuyen_idVatTu",
                table: "ChiTietVanChuyen",
                column: "idVatTu");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChiTietVanChuyen");
        }
    }
}
