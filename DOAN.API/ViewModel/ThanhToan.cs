using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DOAN.API.ViewModel
{
    public class ThanhToan
    {
        [Key]
        public int id { get; set; }
        public string maHoaDon { get; set; }
        public DateTime? ngayTao { get; set; }
        public int idHopDong { get; set; }
        public int tienPhatSinh { get; set; }
        public int tongTien { get; set; }
        public string? ghiChu { get; set; }
        [ForeignKey("idHopDong")]
        public virtual HopDong? hopDong { get; set; }
    }
    public class datet
    {
        public DateTime s { get; set; }
        public DateTime e { get; set; }
    }
}
