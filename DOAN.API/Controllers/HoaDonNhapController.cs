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
    public class HoaDonNhapController : ControllerBase
    {
        private readonly Context _context;
        public HoaDonNhapController(Context context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<HoaDonNhap>>> GetAll()
        {
            var list = await _context.HoaDonNhap.OrderByDescending(a=>a.id).ToListAsync();
            return Ok(list);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<HoaDonNhap>> GetById(int id)
        {
            var list = await _context.HoaDonNhap.SingleOrDefaultAsync(a => a.id == id);
            return Ok(list);
        }

        [HttpPost]
        public async Task<ActionResult<HoaDonNhap>> PostVanChuyen(HoaDonNhap hoadonNhap)
        {
            hoadonNhap.ngayTao = DateTime.UtcNow;
            var check = await _context.HoaDonNhap.SingleOrDefaultAsync(x => x.idPhieuMua == hoadonNhap.idPhieuMua);
            if (check != null)
                return Ok(check);

            await _context.HoaDonNhap.AddAsync(hoadonNhap);
            await _context.SaveChangesAsync();
            return Ok(hoadonNhap);

        }

        [HttpDelete("{id}")]
        public ActionResult<HoaDonNhap> delete(int id)
        {
            var list = _context.HoaDonNhap.SingleOrDefault(x => x.id == id);
            _context.HoaDonNhap.Remove(list);
            _context.SaveChanges();
            return Ok(list);
        }

        

    }
}
