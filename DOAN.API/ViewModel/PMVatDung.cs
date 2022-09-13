using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DOAN.API.ViewModel
{
    public class PMVatDung
    {
        [Key]
        public int id { get; set; }
        public string maPhieu { get; set; }
        public DateTime? NgayTao { get; set; }
        public string? ghiChu { get; set; }
        public int? isCheck { get; set; }
    }
}
