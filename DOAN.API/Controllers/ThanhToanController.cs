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
    public class ThanhToanController : ControllerBase
    {
        private readonly Context _context;
        public ThanhToanController(Context context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ThanhToan>>> GetAll()
        {
            var listThanhToan = await _context.ThanhToan.Include(x=>x.hopDong).ToListAsync();
            return Ok(listThanhToan);
        }
        [HttpPost("notInArr")]
        public async Task<ActionResult<IEnumerable<ThanhToan>>> FillterNot(List<int> arrID)
        {
            var listThanhToan = await _context.ThanhToan.Where(x=>!arrID.Contains(x.id)).ToListAsync();
            return Ok(listThanhToan);
        }
        [HttpPost("chart")]
        public async Task<ActionResult<IEnumerable<ThanhToan>>> chart(datet date)
        {
            var listThanhToan = await _context.ThanhToan.Where(x => x.ngayTao >= date.s && x.ngayTao <= date.e).ToListAsync();
            return Ok(listThanhToan);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<ThanhToan>> GetThanhToanById(int id)
        {
            var ThanhToan = await _context.ThanhToan.Include(a=>a.hopDong).SingleOrDefaultAsync(x => x.id == id);
            if (ThanhToan == null)
                return NotFound();
            return Ok(ThanhToan);
        }
       
        [HttpPost]
        public async Task<ActionResult> PostThanhToan(ThanhToan ThanhToan)
        {
            var hd = await _context.HopDong.SingleOrDefaultAsync(x => x.id == ThanhToan.idHopDong);
            hd.trangThaiThanhToan = 1;
            hd.isHoaDon = 1;
            ThanhToan.hopDong = null;
            _context.ThanhToan.Add(ThanhToan);
            await _context.SaveChangesAsync();
            return Ok("Thêm thành công");
        }
        

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteThanhToan(int id)
        {
            var ThanhToan = await _context.ThanhToan.SingleOrDefaultAsync(x => x.id == id);
            if (ThanhToan == null)
                return BadRequest("Xóa không thành công");
            _context.ThanhToan.Remove(ThanhToan);
            await _context.SaveChangesAsync();
            return Ok("Xóa thành công");
        }

        [HttpDelete("list")]
        public async Task<ActionResult> DeleteList(List<int> ids)
        {
            var listNv = await _context.ThanhToan.Where(x => ids.Contains(x.id)).ToListAsync();

            if (listNv.Count <= 0)
                return BadRequest("không tìm thấy bất kì thực phẩm");
            _context.ThanhToan.RemoveRange(listNv);
            await _context.SaveChangesAsync();
            return Ok("Xóa thành công");
        }
    }
}
