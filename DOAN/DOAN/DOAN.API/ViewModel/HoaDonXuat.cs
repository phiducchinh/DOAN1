using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DOAN.API.ViewModel
{
    public class HoaDonXuat
    {
        [Key]
        public int id { get; set; }
        public string maHoaDon { get; set; }
        public int? idHopDong { get; set; }
        public DateTime? ngayTao { get; set; }
        public string ghiChu { get; set; }
        [ForeignKey("idHopDong")]
        public virtual HopDong? hopDong { get; set; }
    }
}
