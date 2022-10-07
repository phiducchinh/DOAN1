using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DOAN.API.ViewModel
{
    public class ThucPhamHistory
    {
        [Key]
        public int id { get; set; }
        public int? idThucPham { get; set; }
        public int idPhieuNhap { get; set; }
        public int? loai { get; set; }
        public double? soLuong { get; set; }
        public DateTime? ngayTao { get; set; }
        public string? ghiChu { get; set; }
        [ForeignKey("idThucPham")]
        public virtual ThucPham thucPham { get; set; }
    }
}
