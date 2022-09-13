namespace DOAN.API.ViewModel
{
    public class MappingVatDungLayVe
    {
        public int idVatDung { get; set; }
        public int soLuong { get; set; }
        public int soLuongMat { get; set; }
        public virtual VatTu? vatTu { get; set; }
    }
}
