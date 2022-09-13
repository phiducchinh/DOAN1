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
    public class PNVatDungController : ControllerBase
    {
        private readonly Context _context;
        public PNVatDungController(Context context)
        {
            _context = context;
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<PNVatDung>> Getbyid(int id)
        {
            var list = await _context.PNVatDung.Include(a=>a.pmVatDung).SingleOrDefaultAsync(y => y.id == id);
            return Ok(list);
        }
        [HttpGet("max")]
        public async Task<ActionResult<PNVatDung>> GetIdMax()
        {
            var list = await _context.PNVatDung.OrderByDescending(x=>x.id).FirstOrDefaultAsync();
            return Ok(list);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PNVatDung>>> GetAll()
        {
            var list = await _context.PNVatDung.Include(a => a.pmVatDung).ToListAsync();
            return Ok(list);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<PNVatDung>> Delete(int id)
        {
            var list = await _context.PNVatDung.SingleOrDefaultAsync(x=>x.id==id);
            if (list != null)
            {
                _context.PNVatDung.Remove(list);
                await _context.SaveChangesAsync();
                return Ok(list);
            }
            else
                return BadRequest("Xóa thất bại");
        }

        [HttpPost]
        public async Task<ActionResult<PNVatDung>> AddPhieuNhap(PNVatDung PhieuNhap)
        {
            var pn=  await _context.PNVatDung.SingleOrDefaultAsync(x=>x.maPhieu==PhieuNhap.maPhieu && x.idPhieuMua==PhieuNhap.idPhieuMua);
            if (pn != null)
                return Ok(pn);
            else
            {
                try
                {
                    PhieuNhap.pmVatDung = null;
                    await _context.PNVatDung.AddAsync(PhieuNhap);
                    await _context.SaveChangesAsync();
                }
                catch
                {
                    return BadRequest("Thêm lỗi");
                }
                return Ok(PhieuNhap);
            }
        }


    }
}
