using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DOAN.API.ViewModel
{
    public class ThucPhamKemMonAn
    {
        [Key]
        public int id { get; set; }
        public int idMonAn { get; set; }
        public int idThucPham { get; set; }
        public double soLuong { get; set; }
        public string? ghiChu { get; set; }
        [ForeignKey("idThucPham")]
        public virtual ThucPham? thucPham { get; set; }
        [ForeignKey("idMonAn")]
        public virtual MonAn? monAn { get; set; }
    }
}
