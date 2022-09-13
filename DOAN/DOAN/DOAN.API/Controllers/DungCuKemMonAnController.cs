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
    public class DungCuKemMonAnController : ControllerBase
    {
        private readonly Context _context;
        public DungCuKemMonAnController(Context context)
        {
            _context = context;
        }


        [HttpGet]

        public async Task<ActionResult<IEnumerable<DungCuKemMonAn>>> GetAll()
        {
            var list = await _context.DungCuKemMonAn.Include(x=> x.vatTu).Include(z=>z.monAn).ToListAsync();
            return Ok(list);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<DungCuKemMonAn>> GetDungCuById(int id)
        {
            var hd = await _context.DungCuKemMonAn.Include(x => x.vatTu).Include(z => z.monAn).SingleOrDefaultAsync(x => x.id == id);
            if (hd == null)
                return NotFound();
            return Ok(hd);
        }
        [HttpGet("check/{idVatTu}/{idMonAn}")]
        public async Task<ActionResult<DungCuKemMonAn>> check(int idVatTu, int idMonAn)
        {
            var hd = await _context.DungCuKemMonAn.SingleOrDefaultAsync(x => x.idVatTu == idVatTu && x.idMonAn == idMonAn);
            
            return Ok(hd);
        }

        [HttpGet("MonAn/{id}")]
        public async Task<ActionResult<IEnumerable<DungCuKemMonAn>>> GetDungCuByMonAnID(int id)
        {
            var hd = await _context.DungCuKemMonAn.Include(x => x.vatTu).Include(z => z.monAn).Where(x => x.idMonAn == id).ToListAsync();
            if (hd == null)
                return NotFound();
            return Ok(hd);
        }
        [HttpPost]
        public async Task<ActionResult> PostDungCuById(DungCuKemMonAn dungCuKemMonAn)
        {
            dungCuKemMonAn.vatTu = null;
            dungCuKemMonAn.monAn = null;
            _context.DungCuKemMonAn.Add(dungCuKemMonAn);
            await _context.SaveChangesAsync();
            return Ok("Thêm thành công");
        }
        [HttpPut("{id}")]
        public async Task<ActionResult> EditDungCuById(int id,DungCuKemMonAn dungCuKemMonAn)
        {
            if (id != dungCuKemMonAn.id)
                return BadRequest("Không trùng id");
            var dc = await _context.DungCuKemMonAn.SingleOrDefaultAsync(x => x.id == id);
            if (dc == null)
                return BadRequest("Không tìm thấy lựa chọn");
            dc.idMonAn = dungCuKemMonAn.idMonAn;
            dc.idVatTu = dungCuKemMonAn.idVatTu;
            dc.soLuong = dungCuKemMonAn.soLuong;
            dc.ghiChu = dungCuKemMonAn.ghiChu;
            await _context.SaveChangesAsync();
            return Ok("Sửa thành công");
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteDungCu(int id)
        {
            var dc = await _context.DungCuKemMonAn.SingleOrDefaultAsync(x => x.id == id);
            if (dc == null)
                return BadRequest("Không tìm thấy dụng cụ");
            _context.DungCuKemMonAn.Remove(dc);
            await _context.SaveChangesAsync();
            return Ok("Xóa thành công");

        }
        [HttpDelete("list")]
        public async Task<ActionResult> DeleteList(List<int> ids)
        {
            var listNv = await _context.DungCuKemMonAn.Where(x => ids.Contains(x.id)).ToListAsync();

            if (listNv.Count <= 0)
                return BadRequest("không tìm thấy bất kì đồ chuẩn bị");
            _context.DungCuKemMonAn.RemoveRange(listNv);
            await _context.SaveChangesAsync();
            return Ok("Xóa thành công");
        }
    }

}
