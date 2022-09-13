using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DOAN.API.ViewModel
{
    public class DungCuKemMonAn
    {
        [Key]
        public int id { get; set; }
        public int idMonAn { get; set; }
        public int idVatTu { get; set; }
        public int soLuong { get; set; }
        public string? ghiChu { get; set; }
        [ForeignKey("idVatTu")]
        public virtual VatTu? vatTu { get; set; }
        [ForeignKey("idMonAn")]
        public virtual MonAn? monAn { get; set; }
    }
}
