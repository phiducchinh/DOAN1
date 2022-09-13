using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DOAN.API.ViewModel
{
    public class PNVatDung
    {
        [Key]
        public int id { get; set; }
        public string maPhieu { get; set; }
        public int idPhieuMua { get; set; }
        public string ghiChu { get; set; }
        public int? nguonGoc { get; set; } = 2;
        public DateTime? NgayTao { get; set; }
        [ForeignKey("idPhieuMua")]
        public virtual PMVatDung? pmVatDung { get; set; }
        
    }
}
