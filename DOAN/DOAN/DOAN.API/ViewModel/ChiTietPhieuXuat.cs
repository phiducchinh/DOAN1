using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DOAN.API.ViewModel
{
    public class ChiTietPhieuXuat
    {
        [Key]
        public int id { get; set; }
        public int idHoaDon { get; set; }
        public int idThucPham { get; set; }
        public double soLuong { get; set; }
        [ForeignKey("idHoaDon")]
        public virtual HoaDonXuat? hoaDonXuat { get; set; }
        [ForeignKey("idThucPham")]
        public virtual ThucPham? thucPham { get; set; }
    }
}
