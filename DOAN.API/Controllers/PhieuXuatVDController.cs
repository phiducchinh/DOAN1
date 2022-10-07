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
    public class PhieuXuatVDController : ControllerBase
    {
        private readonly Context _context;
        public PhieuXuatVDController(Context context)
        {
            _context = context;
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<PhieuXuatVD>> Getbyid(int id)
        {
            var list = await _context.PhieuXuatVD.Include(z => z.vanChuyen).ThenInclude(x => x.hopDong).SingleOrDefaultAsync(y=>y.id==id);
            return Ok(list);
        }

        [HttpGet("vanChuyen/{id}")]
        public async Task<ActionResult<PhieuXuatVD>> GetbyidvanChuyen(int id)
        {
            var list = await _context.PhieuXuatVD.Include(z => z.vanChuyen).SingleOrDefaultAsync(y => y.idVanChuyen == id);
            return Ok(list);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PhieuXuatVD>>> GetAll()
        {
            var list = await _context.PhieuXuatVD.Include(z => z.vanChuyen).ThenInclude(x=>x.hopDong).ToListAsync();
            return Ok(list);
        }
        [HttpGet("check")]
        public async Task<ActionResult<IEnumerable<PhieuXuatVD>>> GetAllChuaHT()
        {
            var list = await _context.PhieuXuatVD.Include(z => z.vanChuyen).ThenInclude(x => x.hopDong).ToListAsync();
            return Ok(list);
        }

        [HttpPost]
        public async Task<ActionResult<PhieuXuatVD>> AddphieuXuat(PhieuXuatVD phieuxuat)
        {

            var px = await _context.PhieuXuatVD.SingleOrDefaultAsync(x => x.maPhieu == phieuxuat.maPhieu && x.idVanChuyen == phieuxuat.idVanChuyen);
            if (px != null)
            {
                return Ok(px);
            }

            phieuxuat.ngayTao = DateTime.UtcNow;
            phieuxuat.vanChuyen = null;
            phieuxuat.isCheck = 0;
            var vanChuyen = await _context.VanChuyen.SingleOrDefaultAsync(x => x.id == phieuxuat.idVanChuyen);
            vanChuyen.trangThai = 2;
            vanChuyen.ngayDi = DateTime.UtcNow;

            await _context.PhieuXuatVD.AddAsync(phieuxuat);
            await _context.SaveChangesAsync();
            return Ok(phieuxuat);
        }

        
    }
}
