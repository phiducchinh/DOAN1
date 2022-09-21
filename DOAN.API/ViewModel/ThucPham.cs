using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DOAN.API.ViewModel
{
    public class ThucPham
    {
        [Key]
        public int id { get; set; }
        public string tenThucPham { get; set; }
        public string? maThucPham { get; set; } = string.Empty;
        public int? loai { get; set; } = 0;
        public string? donVi { get; set; } = string.Empty;
        public double soLuong { get; set; }
        public string? ghiChu { get; set; } = string.Empty;

    }
    public class AllThucPham
    {
        public int id { get; set; }
        public string tenThucPham { get; set; }
        public string? maThucPham { get; set; } = string.Empty;
        public int? loai { get; set; } = 0;
        public string? donVi { get; set; } = string.Empty;
        public double soLuong { get; set; }
        public string? ghiChu { get; set; } = string.Empty;
        public List<ChiTietPhieuNhap> phieuNhap { get; set; }
    }
    public class filter
    {
        public string? title { get; set; }
        public int? status { get; set; }
    }
}
