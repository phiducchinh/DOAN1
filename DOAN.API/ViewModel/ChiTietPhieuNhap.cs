using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DOAN.API.ViewModel
{
    public class ChiTietPhieuNhap
    {
        [Key]
        public int id { get; set; }
        public int idHoaDon { get; set; }
        public int idThucPham { get; set; }
        public double soLuong { get; set; }
        public double? soLuongConLai { get; set; }
        public DateTime? hanSuDung { get; set; }
        public int? giaTien { get; set; }
        public int? lan { get; set; }
        public int isCheck { get; set; }
        public string? NCC { get; set; }
        [ForeignKey("idHoaDon")]
        public virtual HoaDonNhap? hoaDonhNhap { get; set; }
        [ForeignKey("idThucPham")]
        public virtual ThucPham? thucPham { get; set; }
    }
}
