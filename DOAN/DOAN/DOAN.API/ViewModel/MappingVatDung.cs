namespace DOAN.API.ViewModel
{
    public class MappingVatDung
    {
        public int idVatDung { get; set; }
        public int soLuong { get; set; }
        public virtual VatTu? vatTu { get; set; }
    }
}
