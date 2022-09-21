using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DOAN.API.ViewModel
{
    public class HopDong
    {
        [Key]
        public int id { get; set; }
        public string? maHopDong { get; set; } = string.Empty;
        public string? tenHopDong { get; set; }= string.Empty;
        public string tenKhachHang { get; set; }
        public string? diaChi { get; set; }= string.Empty;
        public string? soDienThoai { get; set; }= string.Empty ;
        public int soMam { get; set; }
        public int suDungBanGhe { get; set; }
        public int trangThai { get; set; }
        public int? trangThaiThanhToan { get; set; } = 0;
        public DateTime ngayBatDau { get; set; }
        public DateTime ngayKetThuc { get; set; }
        public int? soMamPhatSinh { get; set; }
        public int? tienCoc { get; set; }
        public int? idBeptruong { get; set; }
        public string? ghiChu { get; set; } = string.Empty;
        //public int? vanChuyen { get; set; }
        //public int? phieuMua { get; set; }
        public int? isThucDon { get; set; }
        public int? isVanChuyen { get; set; } = 0;
        public int? isPhieuMua { get; set; } = 0;
        public int? isPhieuXuat { get; set; } = 0;
        public int? isHoaDon { get; set; } = 0;
        [ForeignKey("idBeptruong")]
        public virtual NhanVien? bepTruong { get; set; }
    }

}
