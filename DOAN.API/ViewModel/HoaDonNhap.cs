using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DOAN.API.ViewModel
{
    public class HoaDonNhap
    {
        [Key]
        public int id { get; set; }
        public string maHoaDon { get; set; }
        public int idPhieuMua { get; set; }
        public DateTime? ngayTao { get; set; }
        public int? giaTien { get; set; }
        public string ghiChu { get; set; }
        [ForeignKey("idPhieuMua")]
        public virtual HoaDonMua? hoaDonMua { get; set; }
    }
}
