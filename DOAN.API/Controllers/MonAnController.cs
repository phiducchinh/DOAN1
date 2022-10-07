using DOAN.API.ViewModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DOAN.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MonAnController : ControllerBase
    {
        private readonly Context _context;
        public MonAnController(Context context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MonAn>>> GetAll()
        {
            var listMonAn = await _context.MonAn.ToListAsync();
            return Ok(listMonAn);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MonAn>> GetMonAnById(int id)
        {
            var monAn = await _context.MonAn.SingleOrDefaultAsync(x=>x.id==id);
            if (monAn == null)
                return NotFound();
            return Ok(monAn);
        }
        [HttpGet("search/{tenMonAn}")]
        public async Task<ActionResult<IEnumerable<MonAn>>> GetMonAnByName(string tenMonAn)
        {
            var monAn = await _context.MonAn.Where(x=> x.tenMonAn.Contains(tenMonAn)).ToListAsync();
            if (monAn.Count <= 0)
                return NotFound();
            return Ok(monAn);
        }
        [HttpPost]
        public async Task<ActionResult> PostMonAn(MonAn monAn)
        {
            _context.MonAn.Add(monAn);
            await _context.SaveChangesAsync();
            return Ok("Thêm sinh viên thành công");
        }
        //[HttpPost]
        //public async Task<ActionResult> a(ThucPhamHistory monAn)
        //{
        //    //monAn.thucPham = null;
        //    _context.ThucPhamHistory.Add(monAn);
        //    await _context.SaveChangesAsync();
        //    return Ok("Thêm sinh viên thành công");
        //}
        [HttpPut("{id}")]
        public async Task<ActionResult> EditMonAn(int id, MonAn monAn)
        {
            if (id != monAn.id)
                return BadRequest("Không trùng id");
            var check = await _context.MonAn.SingleOrDefaultAsync(x => x.id == id);
            if (check == null)
            {
                return BadRequest("Món ăn không tồn tại");
            }
            check.tenMonAn = monAn.tenMonAn;
            check.loai = monAn.loai;
            check.ghiChu = monAn.ghiChu;
            check.giaTien = monAn.giaTien;
            await _context.SaveChangesAsync();
            return Ok("Sửa thành công");
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMonAn(int id)
        {
            var monAn = await _context.MonAn.SingleOrDefaultAsync(x => x.id == id);
            if (monAn == null)
                return BadRequest("Xóa không thành công");
            _context.MonAn.Remove(monAn);
            await _context.SaveChangesAsync();
            return Ok("Xóa thành công");
        }

        [HttpDelete("list")]
        public async Task<ActionResult> DeleteList(List<int> ids)
        {
            var listNv = await _context.MonAn.Where(x => ids.Contains(x.id)).ToListAsync();

            if (listNv.Count <= 0)
                return BadRequest("không tìm thấy bất kì món ăn");
            _context.MonAn.RemoveRange(listNv);
            await _context.SaveChangesAsync();
            return Ok("Xóa thành công");
        }
    }
}
