using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DOAN.API.ViewModel
{
    public class ChiTietVanChuyenNhap
    {
        [Key]
        public int id { get; set; }
        public int idPhieuNhap { get; set; }
        public int? lan { get; set; }
        public int idVatTu { get; set; }
        public int? soLuong { get; set; }
        //public int? soLuongMat { get; set; }
        public DateTime? ngayNhap { get; set; }
        [ForeignKey("idVatTu")]
        public virtual VatTu? vatTu { get; set; }
        [ForeignKey("idPhieuNhap")]
        public virtual PhieuNhapVD? phieuNhapVD { get; set; }
    }

}
