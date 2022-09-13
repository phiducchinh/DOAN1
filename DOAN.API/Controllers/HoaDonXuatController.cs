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
    public class HoaDonXuatController : ControllerBase
    {
        private readonly Context _context;
        public HoaDonXuatController(Context context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<HoaDonXuatAll>>> GetAll()
        {
            var list = await _context.HoaDonXuat.ToListAsync();
            List<HoaDonXuatAll> result = new List<HoaDonXuatAll>();
            if (list != null)
            {
                list.ForEach(item =>
                {
                    IEnumerable<ChiTietPhieuXuat> ct = _context.ChiTietPhieuXuat.Include(a => a.thucPham).Include(v=>v.chiTietPhieuNhap).Where(x => x.idHoaDon == item.id).OrderBy(v=>v.idThucPham).ToList();
                    result.Add(new HoaDonXuatAll()
                    {
                        id = item.id,
                        chiTietPhieus = ct,
                        ghiChu = item.ghiChu,
                        idHopDong = item.idHopDong,
                        maHoaDon = item.maHoaDon,
                        ngayTao = item.ngayTao
                    });
                });
            }
            return Ok(result);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<HoaDonXuat>> GetById(int id)
        {
            var list = await _context.HoaDonXuat.Include(x=>x.hopDong).SingleOrDefaultAsync(a => a.id == id);
            return Ok(list);
        }

        [HttpPost]
        public async Task<ActionResult<HoaDonXuat>> PostVanChuyen(HoaDonXuat HoaDonXuat)
        {
            if (HoaDonXuat.idHopDong != null)
            {
                var hd = await _context.HopDong.SingleOrDefaultAsync(x => x.id == HoaDonXuat.idHopDong);
                if (hd != null)
                {
                    hd.isPhieuXuat = 1;
                }
            }
            
            //HoaDonXuat.ngayTao = DateTime.UtcNow;
            HoaDonXuat.hopDong = null;
            _context.HoaDonXuat.Add(HoaDonXuat);
            await _context.SaveChangesAsync();
            return Ok(HoaDonXuat);

        }

        [HttpGet("getnewid")]
        public async Task<ActionResult<HoaDonXuat>> GetIdNgoai()
        {
            var list = await _context.HoaDonXuat.Where(x => x.idHopDong == null).OrderByDescending(a => a.id).FirstOrDefaultAsync();
            if (list != null)
            {
                return Ok(list);
            }
            else
            {
                return Ok(list);
            }
        }

        [HttpDelete("{id}")]
        public ActionResult<HoaDonXuat> delete(int id)
        {
            var list = _context.HoaDonXuat.SingleOrDefault(x => x.id == id);
            _context.HoaDonXuat.Remove(list);
            _context.SaveChanges();
            return Ok(list);
        }

    }
}
