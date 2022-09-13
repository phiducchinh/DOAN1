using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DOAN.API.ViewModel
{
    public class VanChuyen
    {
        [Key]
        public int id { get; set; }
        public int? idHopDong { get; set; }
        public int? trangThai { get; set; }
        public DateTime? ngayTao { get; set; }
        public DateTime? ngayDi { get; set; }
        public DateTime? ngayDon { get; set; }
        [ForeignKey("idHopDong")]
        public virtual HopDong? hopDong { get; set; }
        public string? maPhieu { get; set; }
        public string? diaChi { get; set; }
        public string? soDienThoai { get; set; }
    }
}
