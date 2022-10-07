using Microsoft.EntityFrameworkCore;

namespace DOAN.API.ViewModel
{
    public class Context: DbContext
    {
        public Context(DbContextOptions<Context> options) : base(options)
        {

        }
        protected override void OnConfiguring(DbContextOptionsBuilder builder)
        {
            base.OnConfiguring(builder);
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }

        public DbSet<MonAn> MonAn { get; set; }
        public DbSet<VatTu> VatTu { get; set; }
        public DbSet<HopDong> HopDong { get; set; }
        public DbSet<ThucDon> ThucDon { get; set; }
        public DbSet<DungCuKemMonAn> DungCuKemMonAn { get; set; }
        public DbSet<ThucPhamKemMonAn> ThucPhamKemMonAn { get; set; }
        public DbSet<NhanVien> NhanVien { get; set; }
        public DbSet<ThucPham> ThucPham { get; set; }
        public DbSet<HoaDonNhap> HoaDonNhap { get; set; }
        public DbSet<HoaDonMua> HoaDonMua { get; set; }
        public DbSet<HoaDonXuat> HoaDonXuat { get; set; }
        public DbSet<ChiTietPhieuMua> ChiTietPhieuMua { get; set; }
        public DbSet<ChiTietPhieuNhap> ChiTietPhieuNhap { get; set; }
        public DbSet<ChiTietPhieuXuat> ChiTietPhieuXuat { get; set; }
        public DbSet<VanChuyen> VanChuyen { get; set; }
        public DbSet<ChiTietVanChuyen> ChiTietVanChuyen { get; set; }
        public DbSet<ChiTietVanChuyenXuat> ChiTietVanChuyenXuat { get; set; }
        public DbSet<ChiTietVanChuyenNhap> ChiTietVanChuyenNhap { get; set; }
        public DbSet<ThanhToan> ThanhToan { get; set; }
        public DbSet<PhieuXuatVD> PhieuXuatVD { get; set; }
        public DbSet<PhieuNhapVD> PhieuNhapVD { get; set; }
        public DbSet<PMVatDung> PMVatDung { get; set; }
        public DbSet<PNVatDung> PNVatDung { get; set; }
        public DbSet<ChiTietPhieuMuaVatDung> ChiTietPhieuMuaVatDung { get; set; }
        public DbSet<ChiTietPhieuNhapVatDung> ChiTietPhieuNhapVatDung { get; set; }
        public DbSet<VatDungHistory> VatDungHistory { get; set; }
        
        public DbSet<ThucPhamHistory> ThucPhamHistory { get; set; }


    }
}
