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
    public class ChiTietPhieuMuaVatDungController : ControllerBase
    {
        private readonly Context _context;

        public ChiTietPhieuMuaVatDungController(Context context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult> add(List<ChiTietPhieuMuaVatDung> list)
        {
            var PhieuMuaVatDung = await _context.PMVatDung.SingleOrDefaultAsync(a => a.id == list[0].idPhieuMua);
            if (PhieuMuaVatDung == null)
            {
                return BadRequest("Có lỗi khi thêm đơn vận chuyển");
            }

            for (int i = 0; i < list.Count; i++)
            {
                list[i].isCheck = 0;
                list[i].vatTu = null;
                list[i].pmVatDung = null;
            }
            await _context.ChiTietPhieuMuaVatDung.AddRangeAsync(list);

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("phieuMua/{idPhieuMua}")]
        public async Task<ActionResult<IEnumerable<ChiTietPhieuMuaVatDung>>> GetListVatTu(int idPhieuMua)
        {
            var list = await _context.ChiTietPhieuMuaVatDung.Include(a => a.vatTu).Include(b => b.pmVatDung).Where(x => x.idPhieuMua == idPhieuMua).ToListAsync();
            return Ok(list);
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChiTietPhieuMuaVatDung>>> getAll(int idPhieuMua)
        {
            var list = await _context.ChiTietPhieuMuaVatDung.Include(a => a.vatTu).Include(b => b.pmVatDung).ToListAsync();
            return Ok(list);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<ChiTietPhieuMuaVatDung>> getById(int id)
        {
            var list = await _context.ChiTietPhieuMuaVatDung.Include(a => a.vatTu).Include(b => b.pmVatDung).SingleOrDefaultAsync(x => x.id == id);
            return Ok(list);
        }

    }
    
}
