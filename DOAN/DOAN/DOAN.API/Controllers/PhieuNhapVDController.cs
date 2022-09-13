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
    public class PhieuNhapVDController : ControllerBase
    {
        private readonly Context _context;
        public PhieuNhapVDController(Context context)
        {
            _context = context;
        }
        [HttpGet("vanchuyen/{idvanchuyen}")]
        public async Task<ActionResult<PhieuNhapVD>> Getbyidvanchuyen(int idvanchuyen)
        {
            var px = await _context.PhieuXuatVD.SingleOrDefaultAsync(x => x.idVanChuyen == idvanchuyen);

            var list = await _context.PhieuNhapVD.Include(z => z.phieuXuat).ThenInclude(a => a.vanChuyen).ThenInclude(x => x.hopDong).SingleOrDefaultAsync(y => y.idPhieuXuat == px.id);
            return Ok(list);
        }
        [HttpGet("phieuXuat/{idpx}")]
        public async Task<ActionResult<PhieuNhapVD>> GetbyidPhieuXuat(int idpx)
        {
            var list = await _context.PhieuNhapVD.Include(z => z.phieuXuat).ThenInclude(a => a.vanChuyen).ThenInclude(x => x.hopDong).SingleOrDefaultAsync(y => y.idPhieuXuat == idpx);
            return Ok(list);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<PhieuNhapVD>> Getbyid(int id)
        {
            var list = await _context.PhieuNhapVD.Include(z => z.phieuXuat).ThenInclude(a => a.vanChuyen).ThenInclude(x => x.hopDong).SingleOrDefaultAsync(y => y.id == id);
            return Ok(list);
        }

        [HttpGet]
        public async Task<ActionResult<NhapVatDung>> GetAll()
        {
            var list = await _context.PhieuNhapVD.Include(z => z.phieuXuat).ThenInclude(a=>a.vanChuyen).ThenInclude(x => x.hopDong).ToListAsync();
            var x = await _context.PNVatDung.Include(x => x.pmVatDung).ToListAsync();
            NhapVatDung nv= new NhapVatDung();
            nv.pnVatDung = x;
            nv.phieuNhapVD = list;
            return Ok(nv);
        }

        [HttpPost]
        public async Task<ActionResult<PhieuNhapVD>> AddPhieuNhap(PhieuNhapVD PhieuNhap)
        {
            var pn = await _context.PhieuNhapVD.SingleOrDefaultAsync(x => x.idPhieuXuat == PhieuNhap.idPhieuXuat);
            if(pn == null)
            {
                PhieuNhap.phieuXuat = null;
                PhieuNhap.ngayTao = DateTime.UtcNow;
                await _context.PhieuNhapVD.AddAsync(PhieuNhap);
                await _context.SaveChangesAsync();
                return Ok(PhieuNhap);
            }
            else
            {
                return Ok(pn);
            }
            
        }


    }
}
