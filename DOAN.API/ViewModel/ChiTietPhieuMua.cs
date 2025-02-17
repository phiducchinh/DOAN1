using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DOAN.API.ViewModel
{
    public class ChiTietPhieuMua5
    {
        [Key]
        public int id { get; set; }
        public int idHoaDon { get; set; }
        public int idThucPham { get; set; }
        public double soLuong  { get; set; }
        public string ghiChu { get; set; }
        [ForeignKey("idHoaDon")]
        public virtual HoaDonMua? hoaDonMua { get; set; }
        [ForeignKey("idThucPham")]
        public virtual ThucPham? thucPham { get; set; }
    }
}
bcd
