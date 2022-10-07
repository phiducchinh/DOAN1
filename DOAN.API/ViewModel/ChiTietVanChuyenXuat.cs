using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DOAN.API.ViewModel
{
    public class ChiTietVanChuyenXuat
    {
        [Key]
        public int id { get; set; }
        public int? lan { get; set; }
        public DateTime? ngayTao { get; set; }
        //public string? maPhieu { get; set; }
        public int idPhieuXuat { get; set; }
        public int idVatTu { get; set; }
        public int soLuong { get; set; }
        [ForeignKey("idVatTu")]
        public virtual VatTu? vatTu { get; set; }
        [ForeignKey("idPhieuXuat")]
        public virtual PhieuXuatVD? PhieuXuatVD { get; set; }
    }
    public class chartModel
    {
        public chartModel()
        {
        }
        public chartModel(int idVatTu,int sl, int id)
        {
            this.idVatTu = idVatTu;
            this.sl = sl;
            this.id = id;
        }
        public int idVatTu { get; set; }
        public int sl { get; set; }
        public int id { get; set; }


    }
}
