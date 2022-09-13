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
    public class ThucPhamKemMonAnController : ControllerBase
    {
        private readonly Context _context;
        public ThucPhamKemMonAnController(Context context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ThucPhamKemMonAn>>> GetAll()
        {
            var list = await _context.ThucPhamKemMonAn.Include(x=> x.thucPham).Include(z=>z.monAn).ToListAsync();
            return Ok(list);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<ThucPhamKemMonAn>> GetThucPhamById(int id)
        {
            var hd = await _context.ThucPhamKemMonAn.Include(x => x.thucPham).Include(z => z.monAn).SingleOrDefaultAsync(x => x.id == id);
            if (hd == null)
                return NotFound();
            return Ok(hd);
        }
        [HttpGet("check/{idthucPham}/{idMonAn}")]
        public async Task<ActionResult<ThucPhamKemMonAn>> check(int idthucPham, int idMonAn)
        {
            var hd = await _context.ThucPhamKemMonAn.SingleOrDefaultAsync(x => x.idThucPham == idthucPham && x.idMonAn == idMonAn);
            
            return Ok(hd);
        }

        [HttpGet("MonAn/{id}")]
        public async Task<ActionResult<IEnumerable<ThucPhamKemMonAn>>> GetThucPhamByMonAnID(int id)
        {
            var hd = await _context.ThucPhamKemMonAn.Include(x => x.thucPham).Include(z => z.monAn).Where(x => x.idMonAn == id).ToListAsync();
            if (hd == null)
                return NotFound();
            return Ok(hd);
        }
        [HttpPost]
        public async Task<ActionResult> PostThucPhamById(ThucPhamKemMonAn ThucPhamKemMonAn)
        {
            ThucPhamKemMonAn.thucPham = null;
            ThucPhamKemMonAn.monAn = null;
            _context.ThucPhamKemMonAn.Add(ThucPhamKemMonAn);
            await _context.SaveChangesAsync();
            return Ok("Thêm thành công");
        }
        [HttpPut("{id}")]
        public async Task<ActionResult> EditThucPhamById(int id,ThucPhamKemMonAn ThucPhamKemMonAn)
        {
            if (id != ThucPhamKemMonAn.id)
                return BadRequest("Không trùng id");
            var dc = await _context.ThucPhamKemMonAn.SingleOrDefaultAsync(x => x.id == id);
            if (dc == null)
                return BadRequest("Không tìm thấy lựa chọn");
            dc.idMonAn = ThucPhamKemMonAn.idMonAn;
            dc.idThucPham = ThucPhamKemMonAn.idThucPham;
            dc.soLuong = ThucPhamKemMonAn.soLuong;
            dc.ghiChu = ThucPhamKemMonAn.ghiChu;
            await _context.SaveChangesAsync();
            return Ok("Sửa thành công");
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteThucPham(int id)
        {
            var dc = await _context.ThucPhamKemMonAn.SingleOrDefaultAsync(x => x.id == id);
            if (dc == null)
                return BadRequest("Không tìm thấy dụng cụ");
            _context.ThucPhamKemMonAn.Remove(dc);
            await _context.SaveChangesAsync();
            return Ok("Xóa thành công");

        }
        [HttpDelete("list")]
        public async Task<ActionResult> DeleteList(List<int> ids)
        {
            var listNv = await _context.ThucPhamKemMonAn.Where(x => ids.Contains(x.id)).ToListAsync();

            if (listNv.Count <= 0)
                return BadRequest("không tìm thấy bất kì đồ chuẩn bị");
            _context.ThucPhamKemMonAn.RemoveRange(listNv);
            await _context.SaveChangesAsync();
            return Ok("Xóa thành công");
        }
    }

}
