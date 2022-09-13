using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DOAN.API.ViewModel
{
    public class PhieuNhapVD
    {
        [Key]
        public int id { get; set; }
        public string maPhieu { get; set; }
        public int idPhieuXuat { get; set; }
        public int? nguonGoc { get; set; }
        public DateTime? ngayTao { get; set; }
        public string? ghiChu { get; set; }
        [ForeignKey("idPhieuXuat")]
        public virtual PhieuXuatVD? phieuXuat { get; set; }
    }
}
