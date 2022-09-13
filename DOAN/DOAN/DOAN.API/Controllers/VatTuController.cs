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
    public class VatTuController : ControllerBase
    {
        private readonly Context _context;
        public VatTuController(Context context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<VatTu>>> GetAll()
        {
            var listVatTu = await _context.VatTu.ToListAsync();
            return Ok(listVatTu);
        }

        [HttpPost("notInArr")]
        public async Task<ActionResult<IEnumerable<VatTu>>> GetAllfilter([FromBody]List<int> mainId)
        {
            var listVatTu = await _context.VatTu.Where(x=> !mainId.Contains(x.id)).ToListAsync();
            return Ok(listVatTu);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<VatTu>> GetVatTuById(int id)
        {
            var VatTu = await _context.VatTu.SingleOrDefaultAsync(x => x.id == id);
            if (VatTu == null)
                return NotFound();
            return base.Ok((object)VatTu);
        }
        [HttpGet("searchName/{tenVatTu}")]
        public async Task<ActionResult<IEnumerable<VatTu>>> GetVatTuByName(string tenVatTu)
        {
            var VatTu = await _context.VatTu.Where(x => x.tenVatTu.Contains(tenVatTu) || x.maVatTu.Contains(tenVatTu)).ToListAsync();
            if (VatTu.Count <= 0)
                return NotFound();
            return Ok(VatTu);
        }
        [HttpGet("search/{value}")]
        public async Task<ActionResult<IEnumerable<VatTu>>> Search(string value)
        {
            var VatTu= await _context.VatTu.Where(x => x.tenVatTu.Contains(value)).ToListAsync();
            if (VatTu.Count <= 0)
                VatTu = await _context.VatTu.Where(x => x.maVatTu.Contains(value)).ToListAsync();
            return Ok(VatTu);
        }
        [HttpPost]
        public async Task<ActionResult<string>> PostVatTu([FromBody] VatTu VatTu)
        {
            _context.VatTu.Add(VatTu);
            await _context.SaveChangesAsync();
            return Ok("thêm thành công");
        }
        [HttpPut("{id}")]
        public async Task<ActionResult> EditVatTu(int id,[FromBody] VatTu VatTu)
        {
            if (id != VatTu.id)
                return BadRequest("Không trùng id");
            var check = await _context.VatTu.SingleOrDefaultAsync(x => x.id == id);
            if (check == null)
            {
                return BadRequest("Vật tư không tồn tại");
            }
            check.tenVatTu = VatTu.tenVatTu;
            check.maVatTu = VatTu.maVatTu;
            //check.soLuongConLai = VatTu.soLuongConLai;
            //check.soLuongTong= VatTu.soLuongTong;
            check.trangThai= VatTu.trangThai;
            check.ghiChu = VatTu.ghiChu;
            await _context.SaveChangesAsync();
            return Ok("Sửa thành công");
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteVatTu(int id)
        {
            var VatTu = await _context.VatTu.SingleOrDefaultAsync(x => x.id == id);
            if (VatTu == null)
                return BadRequest("Xóa không thành công");
            _context.VatTu.Remove(VatTu);
            await _context.SaveChangesAsync();
            return Ok("Xóa thành công");
        }

        [HttpDelete("list")]
        public async Task<ActionResult> DeleteList([FromBody]List<int> ids)
        {
            var listNv = await _context.VatTu.Where(x => ids.Contains((int)x.id)).ToListAsync();

            if (listNv.Count <= 0)
                return BadRequest("không tìm thấy bất kì vật dụng nào");
            _context.VatTu.RemoveRange(listNv);
            await _context.SaveChangesAsync();
            return Ok("Xóa thành công");
        }
    }
}
