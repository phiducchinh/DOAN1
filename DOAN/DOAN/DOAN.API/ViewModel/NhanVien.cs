using System.ComponentModel.DataAnnotations;

namespace DOAN.API.ViewModel
{
    public class NhanVien
    {
        [Key]
        public int id { get; set; }
        public string tenNhanVien { get; set; }
        public int? chucVu { get; set; }
        public string soDienThoai { get; set; }
        public string? queQuan { get; set; } = string.Empty;
        public int? luongCB { get; set; }
        public int trangThai { get; set; }
    }
}
