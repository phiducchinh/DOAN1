using System.ComponentModel.DataAnnotations.Schema;
using System.Drawing;

namespace DOAN.API.ViewModel
{
    public class ThucDon
    {
        public int id { get; set; }
        public int? idHopDong { get; set; }
        public int idMonAn { get; set; }
        public int giaTien { get; set; }
        public string? ghiChu { get; set; }=string.Empty;
        public string? tenThucDon { get; set; }
        public int? idThucDonMau { get; set; }
        [ForeignKey("idMonAn")]
        public virtual MonAn? monAn { get; set; }
        [ForeignKey("idHopDong")]
        public virtual HopDong? hopDong { get; set; }

    }
}
