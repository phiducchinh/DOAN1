using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Drawing;

namespace DOAN.API.ViewModel
{
    public class VatDungHistory
    {
        [Key]
        public int id { get; set; }
        public int idVatTu { get; set; }
        public int? loai { get; set; } = 0;
        public int soLuong { get; set; }
        public int? soLuongKiemKe { get; set; } = 0;
        public DateTime? ngayTao { get; set; }
        public string? ghiChu { get; set; }

        [ForeignKey("idVatTu")]
        public virtual VatTu? vatTu { get; set; }

    }
}
