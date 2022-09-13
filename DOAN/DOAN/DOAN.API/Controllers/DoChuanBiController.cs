using DOAN.API.ViewModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DOAN.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoChuanBiController : ControllerBase
    {
        private readonly Context _context;
        public DoChuanBiController(Context context)
        {
            _context = context;
        }
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<DoChuanBi>>> GetAll()
        //{
        //    var list = await _context.DoChuanBi.Include(x => x.vatTu).Include(z => z.hopDong).ToListAsync();
        //    return Ok(list);
        //}
        //[HttpGet("{id}")]
        //public async Task<ActionResult<DoChuanBi>> GetDoChuanBiById(int id)
        //{
        //    var hd = await _context.DoChuanBi.Include(x => x.vatTu).Include(z => z.hopDong).SingleOrDefaultAsync(x => x.id == id);
        //    if (hd == null)
        //        return NotFound();
        //    return Ok(hd);
        //}
        //[HttpGet("MonAn/{id}")]
        //public async Task<ActionResult<DoChuanBi>> GetDoChuanBiByHopdongID(int id)
        //{
        //    var hd = await _context.DoChuanBi.Include(x => x.vatTu).Include(z => z.hopDong).SingleOrDefaultAsync(x => x.idHopDong == id);
        //    if (hd == null)
        //        return NotFound();
        //    return Ok(hd);
        //}
        //[HttpPost]
        //public async Task<ActionResult> PostDungCuById(DoChuanBi dungCuKemMonAn)
        //{
        //    dungCuKemMonAn.vatTu = null;
        //    dungCuKemMonAn.hopDong = null;
        //    _context.DoChuanBi.Add(dungCuKemMonAn);
        //    await _context.SaveChangesAsync();
        //    return Ok("Thêm thành công");
        //}
        //[HttpPut("{id}")]
        //public async Task<ActionResult> EditDungCuById(int id, DoChuanBi dungCuKemMonAn)
        //{
        //    if (id != dungCuKemMonAn.id)
        //        return BadRequest("Không trùng id");
        //    var dc = await _context.DoChuanBi.SingleOrDefaultAsync(x => x.id == id);
        //    if (dc == null)
        //        return BadRequest("Không tìm thấy lựa chọn");
        //    dc.idHopDong = dungCuKemMonAn.idHopDong;
        //    dc.idVatTu = dungCuKemMonAn.idVatTu;
        //    dc.soLuong = dungCuKemMonAn.soLuong;
        //    dc.ghiChu = dungCuKemMonAn.ghiChu;
        //    dc.trangThai = dungCuKemMonAn.trangThai;
        //    dc.soLuongLayVe = dungCuKemMonAn.soLuongLayVe;
        //    await _context.SaveChangesAsync();
        //    return Ok("Sửa thành công");
        //}

        //[HttpDelete("{id}")]
        //public async Task<ActionResult> DeleteDungCu(int id)
        //{
        //    var dc = await _context.DoChuanBi.SingleOrDefaultAsync(x => x.id == id);
        //    if (dc == null)
        //        return BadRequest("Không tìm thấy dụng cụ");
        //    _context.DoChuanBi.Remove(dc);
        //    await _context.SaveChangesAsync();
        //    return Ok("Xóa thành công");

        //}
        //[HttpDelete("list")]
        //public async Task<ActionResult> DeleteList(List<int> ids)
        //{
        //    var listNv = await _context.DoChuanBi.Where(x => ids.Contains(x.id)).ToListAsync();

        //    if (listNv.Count <= 0)
        //        return BadRequest("không tìm thấy bất kì đồ chuẩn bị nào");
        //    _context.DoChuanBi.RemoveRange(listNv);
        //    await _context.SaveChangesAsync();
        //    return Ok("Xóa thành công");
        //}
    }
}
