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
    public class NhanVienController : ControllerBase
    {
        private readonly Context _context;
        public NhanVienController(Context context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NhanVien>>> GetAll()
        {
            var list = await _context.NhanVien.ToListAsync();
            return Ok(list);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<NhanVien>> GetDoChuanBiById(int id)
        {
            var hd = await _context.NhanVien.SingleOrDefaultAsync(x => x.id == id);
            if (hd == null)
                return NotFound();
            return Ok(hd);
        }
        [HttpGet("beptruong")]
        public async Task<ActionResult<IEnumerable<NhanVien>>> BepTruong()
        {
            //var hd = await _context.NhanVien.Where(x => (x.chucVu == 4 || x.chucVu == 5) && x.trangThai == 1).ToListAsync();
            var listBepTruong= await _context.NhanVien.Where(x => (x.chucVu == 4 || x.chucVu == 5) && x.trangThai == 1).ToListAsync();
            return Ok(listBepTruong);
        }
        [HttpPost("SearchByNameBepTruong")]
        public async Task<ActionResult<IEnumerable<NhanVien>>> SearchBTName([FromBody] string value)
        {
            var hd = await _context.NhanVien.Where(x => (x.chucVu == 4 || x.chucVu == 5) && x.trangThai == 1 && x.tenNhanVien.Contains(value)).ToListAsync();
           
            return Ok(hd);
        }
        [HttpPost]
        public async Task<ActionResult> PostNhanVien(NhanVien nhanVien)
        {
            if(nhanVien != null)
            {
                _context.NhanVien.Add(nhanVien);
                await _context.SaveChangesAsync();
                return Ok("Thêm thành công ");
            }
            return BadRequest("Thêm không thành công");
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteNhanVien(int id)
        {
           var nv =await _context.NhanVien.SingleOrDefaultAsync(x=>x.id == id);
            if (nv == null)
                return BadRequest("không tìm thấy nhân viên");
            _context.NhanVien.Remove(nv);
            await _context.SaveChangesAsync();
            return Ok("Xóa thành công");
        }
        [HttpDelete("list")]
        public async Task<ActionResult> DeleteList([FromBody]List<int> ids)
        {
            var listNv = await _context.NhanVien.Where(x=>ids.Contains(x.id)).ToListAsync();

            if (listNv.Count <=0)
                return BadRequest("không tìm thấy bất kì nhân viên");
            _context.NhanVien.RemoveRange(listNv);
            await _context.SaveChangesAsync();
            return Ok("Xóa thành công");
        }
        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id,NhanVien nhanVien)
        {
            if (id != nhanVien.id)
                return BadRequest("Không trùng id");
            var oldNV = await _context.NhanVien.SingleOrDefaultAsync(a => a.id == id);
            if (oldNV == null)
                return BadRequest("Không tìm thấy nhân viên");
            oldNV.chucVu = nhanVien.chucVu;
            oldNV.queQuan = nhanVien.queQuan;
            oldNV.tenNhanVien = nhanVien.tenNhanVien;
            oldNV.soDienThoai = nhanVien.soDienThoai;
            oldNV.trangThai = nhanVien.trangThai;
            await _context.SaveChangesAsync();
            return Ok("Cập nhập thành công");
        }
    }
}
