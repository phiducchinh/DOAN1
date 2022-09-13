using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DOAN.API.ViewModel
{
    public class PhieuXuatVD
    {
        [Key]
        public int id { get; set; }
        public string maPhieu { get; set; }
        public int idVanChuyen { get; set; }
        public DateTime? ngayTao { get; set; }
        public int? isCheck { get; set; }
        [ForeignKey("idVanChuyen")]
        public virtual VanChuyen? vanChuyen { get; set; }
    }
}
