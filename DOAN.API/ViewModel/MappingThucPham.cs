namespace DOAN.API.ViewModel
{
    public class MappingThucPham
    {
        public int idThucPham { get; set; }
        public double soLuong { get; set; }
        public virtual ThucPham? thucPham { get; set; }
    }
}
