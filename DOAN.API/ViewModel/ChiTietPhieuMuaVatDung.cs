using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DOAN.API.ViewModel
{
    public class ChiTietPhieuMuaVatDung
    {
        [Key]
        public int id { get; set; }
        public int idVatTu { get; set; }
        public int soLuong { get; set; }
        public string? nhaCungCap { get; set; }
        public int idPhieuMua { get; set; }
        public int? isCheck { get; set; }
        [ForeignKey("idVatTu")]
        public virtual VatTu? vatTu { get; set; }
        [ForeignKey("idPhieuMua")]
        public virtual PMVatDung? pmVatDung { get; set; }
    }

}
