using DOAN.API.ViewModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DOAN.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HoaDonMuaController : ControllerBase
    {
        private readonly Context _context;
        public HoaDonMuaController(Context context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<HoaDonMua>>> GetAll()
        {
            var list = await _context.HoaDonMua.Include(x=>x.hopDong).ToListAsync();
            return Ok(list);
        }

        [HttpGet("getnewid")]
        public async Task<ActionResult<HoaDonMua>> GetIdNgoai()
        {
            HoaDonMua list = new HoaDonMua();
            list = await _context.HoaDonMua.Where(x => x.idHopDong == null).OrderByDescending(a => a.id).FirstOrDefaultAsync();
            if (list != null)
            {
                return (list);
            }
            else
            {
                return Ok(list);
            }
        }

        [HttpGet("check")]
        public async Task<ActionResult<IEnumerable<HoaDonMua>>> GetAllCeck()
        {
            var list = await _context.HoaDonMua.Include(x => x.hopDong).Where(z=>z.isCheck==0).ToListAsync();
            return Ok(list);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<HoaDonMua>> GetById(int id)
        {
            var list = await _context.HoaDonMua.Include(x=>x.hopDong).SingleOrDefaultAsync(a => a.id == id);
            return Ok(list);
        }

        [HttpPost]
        public async Task<ActionResult<HoaDonMua>> PostVanChuyen(HoaDonMua hoadonMua)
        {
            //hoadonMua.ngayTao = DateTime.UtcNow;
            _context.HoaDonMua.Add(hoadonMua);
            await _context.SaveChangesAsync();
            return Ok(hoadonMua);

        }

        [HttpDelete("{id}")]
        public ActionResult<HoaDonMua> delete(int id)
        {
            var list = _context.HoaDonMua.SingleOrDefault(x => x.id == id);
            _context.HoaDonMua.Remove(list);
            _context.SaveChanges();
            return Ok(list);
        }

    }
}
