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
    public class ThucDonController : ControllerBase
    {
        private readonly Context _context;
        public ThucDonController(Context context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ThucDon>>> GetAll()
        {
            var list = await _context.ThucDon.Include(x=>x.monAn).Include(z=>z.hopDong).ToListAsync();
            return Ok(list);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<ThucDon>> GetById(int id)
        {
            var list = await _context.ThucDon.Include(x => x.monAn).Include(z => z.hopDong).SingleOrDefaultAsync(a => a.id == id);
            return Ok(list);
        }
        [HttpGet("HopDong/{id}")]
        public async Task<ActionResult<IEnumerable<ThucDon>>> GetByIdHopDong(int id)
        {
            var list = await _context.ThucDon.Include(x => x.monAn).Include(z => z.hopDong).Where(a=>a.idHopDong==id).ToListAsync();
            return Ok(list);
        }
        [HttpGet("TDMau")]
        public async Task<ActionResult<IEnumerable<ThucDon>>> GetthucDonmauAll()
        {
            var list = await _context.ThucDon.Where(a => a.idThucDonMau != null).ToListAsync();
            return Ok(list);
        }
        [HttpGet("TDMau/{id}")]
        public async Task<ActionResult<IEnumerable<ThucDon>>> GetthucDonmauAllbyId(int id)
        {
            var list = await _context.ThucDon.Include(x => x.monAn).Where(a => a.idThucDonMau == id).ToListAsync();
            return Ok(list);
        }
        [HttpGet("check/{idMonAn}/{idHopDong}")]
        public async Task<ActionResult<ThucDon>> Check(int idMonAn, int idHopDong)
        {
            var monAn = await _context.ThucDon.SingleOrDefaultAsync(x => x.idMonAn == idMonAn && x.idHopDong == idHopDong);
            
            return Ok(monAn);
            
        }

        [HttpPost]
        public async Task<ActionResult> PostMonAn(ThucDon thucDon)
        {
            thucDon.hopDong = null;
            thucDon.monAn = null;
            _context.ThucDon.Add(thucDon);
            await _context.SaveChangesAsync();
            return Ok("Thêm thành công");
        }

        [HttpPost("addTDMau")]
        public async Task<ActionResult> Postthucdon(List<ThucDon> thucDon)
        {
            var tdm = await _context.ThucDon.OrderByDescending(a => a.id).FirstOrDefaultAsync(x => x.idThucDonMau != null);

            thucDon.ForEach(item =>
            {
                item.hopDong = null;
                item.monAn = null;
                if (tdm != null)
                    item.idThucDonMau = tdm.idThucDonMau + 1;
                else
                    item.idThucDonMau = 1;
            });
            _context.ThucDon.AddRange(thucDon);
            await _context.SaveChangesAsync();
            return Ok("Thêm thành công");
        }

        [HttpPost("addList")]
        public async Task<ActionResult> PostMonAn(List<ThucDon> thucDon)
        {
            thucDon.ForEach(item =>
            {
                item.hopDong = null;
                item.monAn = null;
            });
            _context.ThucDon.AddRange(thucDon);
            await _context.SaveChangesAsync();
            return Ok("Thêm thành công");
        }

        [HttpPost("editList")]
        public async Task<ActionResult> EditMonAn(List<ThucDon> thucDon)
        {


            thucDon.ForEach(item =>
            {   var ma= _context.ThucDon.SingleOrDefault(x => x.idMonAn == item.idMonAn && x.idHopDong==item.idHopDong);
                if (ma != null)
                {
                    _context.ThucDon.Remove(ma);
                }
                item.hopDong = null;
                item.monAn = null;
            });
            _context.ThucDon.AddRange(thucDon);
            await _context.SaveChangesAsync();
            return Ok("Thêm thành công");
        }
        [HttpPut("{id}")]
        public async Task<ActionResult> Edit(int id,ThucDon thucDon)
        {
            if (id != thucDon.id)
                return BadRequest("Không trùng id");
            var td= await _context.ThucDon.SingleOrDefaultAsync(x=>x.id==id);
            if (td == null)
                return BadRequest("Không tìm thấy món ăn trong thực đơn này");
            if(thucDon.idHopDong!=null)
                td.idHopDong = thucDon.idHopDong;
            td.ghiChu = thucDon.ghiChu;
            td.idMonAn= thucDon.idMonAn;
            td.giaTien = thucDon.giaTien;
            await _context.SaveChangesAsync();
            return Ok("Sửa thành công");
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var td= await _context.ThucDon.SingleOrDefaultAsync(x=>x.id==id);
            if (td == null)
                return BadRequest("Không tìm thấy món ăn");
            _context.ThucDon.Remove(td);
            await _context.SaveChangesAsync();
            return Ok("Xóa thành công");
        }
        [HttpDelete("ThucDon/{id}")]
        public async Task<ActionResult> DeleteAllThucDon(int id)
        {
            var listtd = await _context.ThucDon.Where(x => x.idHopDong == id).ToListAsync();
            if (listtd.Count == 0)
                return BadRequest("Không tìm thấy Thực đơn");
            _context.ThucDon.RemoveRange(listtd);
            await _context.SaveChangesAsync();
            return Ok("Xóa thành công");
        }

        [HttpDelete("list")]
        public async Task<ActionResult> DeleteList(List<int> ids)
        {
            var listNv = await _context.ThucDon.Where(x => ids.Contains(x.id)).ToListAsync();

            if (listNv.Count <= 0)
                return BadRequest("không tìm thấy bất kì món ăn nào");
            _context.ThucDon.RemoveRange(listNv);
            await _context.SaveChangesAsync();
            return Ok("Xóa thành công");
        }

    }
}
