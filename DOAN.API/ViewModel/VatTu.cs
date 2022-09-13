using System;
using System.ComponentModel.DataAnnotations;

namespace DOAN.API.ViewModel
{
    public class VatTu
    {
        [Key]
        public int id { get; set; }
        [Required]
        public string? maVatTu { get; set; } = string.Empty;
        public string tenVatTu { get; set; }
        public int? soLuongTong { get; set; }
        public int soLuongConLai { get; set; }
        public int? soLuongChuaSD { get; set; }
        public int? trangThai { get; set; } = 1;
        public string? ghiChu { get; set; } = string.Empty;
    }
}
