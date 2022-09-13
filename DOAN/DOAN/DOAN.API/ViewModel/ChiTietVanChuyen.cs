using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DOAN.API.ViewModel
{
    public class ChiTietVanChuyen
    {
        [Key]
        public int id { get; set; }
        public string? maPhieu { get; set; }
        public int? lan { get; set; }
        public int idVanChuyen { get; set; }
        public int idVatTu { get; set; }
        public int soLuong { get; set; }
        [ForeignKey("idVatTu")]
        public virtual VatTu? vatTu { get; set; }
        [ForeignKey("idVanChuyen")]
        public virtual VanChuyen? vanChuyen { get; set; }
    }

}
