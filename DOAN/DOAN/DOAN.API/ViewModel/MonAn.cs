namespace DOAN.API.ViewModel
{
    public class MonAn
    {
        public int id { get; set; }
        public string tenMonAn { get; set; }
        public int loai { get; set; }
        public int giaTien { get; set; }
        public string? ghiChu { get; set; } = string.Empty;
    }
}
