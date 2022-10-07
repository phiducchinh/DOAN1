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
    public class ChiTietPhieuNhapVatDungController : ControllerBase
    {
        private readonly Context _context;

        public ChiTietPhieuNhapVatDungController(Context context)
        {
            _context = context;
        }

        [HttpPost("addlist")]
        public async Task<ActionResult> add(List<ChiTietPhieuNhapVatDung> list)
        {
            var PhieuNhapVatDung = await _context.PNVatDung.SingleOrDefaultAsync(a => a.id == list[0].idPhieuNhap);
            if (PhieuNhapVatDung == null)
            {
                return BadRequest("Có lỗi khi thêm đơn vận chuyển");
            }
            var lan = 0;
            var ct = await _context.ChiTietPhieuNhapVatDung.OrderByDescending(x=>x.lan).FirstOrDefaultAsync(a=>a.idPhieuNhap== list[0].idPhieuNhap);
            if (ct != null)
            {
                lan= ct.lan.Value;
            }
            for (int i = 0; i < list.Count; i++)
            {
                list[i].lan = lan + 1;
                list[i].vatTu = null;
                list[i].pnVatDung = null;
            }
            await _context.ChiTietPhieuNhapVatDung.AddRangeAsync(list);

            await _context.SaveChangesAsync();
            await checkDone(PhieuNhapVatDung.idPhieuMua, PhieuNhapVatDung.id);
            return Ok();
        }
        [HttpPost("chart")]
        public async Task<ActionResult> chart(datet date)
        {
            var list = await _context.ChiTietPhieuNhapVatDung.Where(x => x.pnVatDung.NgayTao >= date.s && x.pnVatDung.NgayTao <= date.e).ToListAsync();
            return Ok(list);
        }
        private async Task<int> getLanMax(int idPhieuNhap)
        {
            var ct = await _context.ChiTietPhieuNhapVatDung.OrderByDescending(x => x.lan).FirstOrDefaultAsync(a=>a.idPhieuNhap==idPhieuNhap);
            if (ct == null)
                return 0;
            else
                return ct.lan.Value;
        }

        [HttpGet("phieuNhap/{idPhieuNhap}")]
        public async Task<ActionResult<IEnumerable<ChiTietPhieuNhapVatDung>>> GetListVatTu(int idPhieuNhap)
        {
            var list = await _context.ChiTietPhieuNhapVatDung.Include(a => a.vatTu).Include(b => b.pnVatDung).ThenInclude(c=>c.pmVatDung).Where(x => x.idPhieuNhap == idPhieuNhap).ToListAsync();
            return Ok(list);
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChiTietPhieuNhapVatDung>>> getAll(int idPhieuNhap)
        {
            var list = await _context.ChiTietPhieuNhapVatDung.Include(a => a.vatTu).Include(b => b.pnVatDung).ThenInclude(c => c.pmVatDung).ToListAsync();
            return Ok(list);
        }

        [HttpGet("phieuMua/{idPhieuMua}")]
        public async Task<ActionResult<IEnumerable<ChiTietPhieuNhapVatDung>>> getAllbyPhieuMua(int idPhieuMua)
        {
            IEnumerable<ChiTietPhieuNhapVatDung> x = null;
            var phieuNhap = await _context.PNVatDung.SingleOrDefaultAsync(x => x.idPhieuMua == idPhieuMua);
            if (phieuNhap != null)
            {
                x =await _context.ChiTietPhieuNhapVatDung.Where(x => x.idPhieuNhap == phieuNhap.id).ToListAsync();
                return Ok(x);
            }
            else
            {
                return Ok(x);
            }
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<ChiTietPhieuNhapVatDung>> getById(int id)
        {
            var list = await _context.ChiTietPhieuNhapVatDung.Include(a => a.vatTu).Include(b => b.pnVatDung).ThenInclude(c => c.pmVatDung).SingleOrDefaultAsync(x => x.id == id);
            return Ok(list);
        }
        private async Task checkDone(int idPhieuMua, int idPhieuNhap)
        {
            //var phieuNhap = await _context.HoaDonNhap.SingleOrDefaultAsync(x => x.id == idPhieuNhap);

            var listPhieuMua = await _context.ChiTietPhieuMuaVatDung.Where(x => x.idPhieuMua == idPhieuMua).ToListAsync();
            if (listPhieuMua.Count < 0)
                return;
            var listPhieuNhap = await _context.ChiTietPhieuNhapVatDung.Where(x => x.idPhieuNhap == idPhieuNhap).ToListAsync();
            if (listPhieuNhap.Count < 0)
                return;
            var check = true;
            for (int i = 0; i < listPhieuMua.Count && check; i++)
            {
                int tongPN = 0;
                for (int j = 0; j < listPhieuNhap.Count && check; j++)
                {
                    if (listPhieuMua[i].idVatTu == listPhieuNhap[j].idVatTu)
                    {
                        tongPN += listPhieuNhap[j].soLuong;
                    }
                }
                if (listPhieuMua[i].soLuong > tongPN)
                {
                    check = false;
                }
            }
            if (check == true)
            {
                var phieuMua = await _context.PMVatDung.SingleOrDefaultAsync(x => x.id == idPhieuMua);
                phieuMua.isCheck = 1;
                await _context.SaveChangesAsync();
            }
        }
    }
    
}
