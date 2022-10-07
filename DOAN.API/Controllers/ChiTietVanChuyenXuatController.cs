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
    public class ChiTietVanChuyenXuatController : ControllerBase
    {
        private readonly Context _context;

        public ChiTietVanChuyenXuatController(Context context)
        {
            _context = context;
        }

        [HttpGet("vanchuyen/{idVanChuyen}")]
        public async Task<ActionResult<IEnumerable<ChiTietVanChuyenXuat>>> GetListVatTuPhieuXuat(int idVanChuyen)
        {
            var phieuXuat = await _context.PhieuXuatVD.SingleOrDefaultAsync(x => x.idVanChuyen == idVanChuyen);
            if(phieuXuat == null)
            {
                return BadRequest("Không tìm thấy");
            }
            var list = await _context.ChiTietVanChuyenXuat.Include(z=>z.vatTu).Where(x => x.idPhieuXuat == phieuXuat.id).ToListAsync();
            return Ok(list);
        }

        [HttpGet("phieuXuat/{id}")]
        public async Task<ActionResult<IEnumerable<ChiTietVanChuyenXuat>>> GetListVatTuByPhieuXuat(int id)
        {

            var list = await _context.ChiTietVanChuyenXuat
                .Include(z => z.vatTu)
                .Where(x => x.idPhieuXuat == id)
                .ToListAsync();
            
            return Ok(list);
        }

        //[HttpGet("phieuxuat/{id}")]
        //public async Task<ActionResult<IEnumerable<ChiTietVanChuyenXuat>>> GetListVatTuPhieuXuatByid(int id)
        //{
        //    var list = await _context.ChiTietVanChuyenXuat.Include(z => z.vatTu).Where(x => x.idPhieuXuat == id).ToListAsync();
        //    return Ok(list);
        //}


        [HttpPost("addlist")]
        public async Task<ActionResult<ChiTietVanChuyenXuat>> PostPhieuXuat(List<ChiTietVanChuyenXuat> list)
        {

            var lan = 1;
            var lanPN = await _context.ChiTietVanChuyenXuat.OrderByDescending(x => x.lan).FirstOrDefaultAsync(a => a.idPhieuXuat == list[0].idPhieuXuat);
            if (lanPN != null)
            {
                lan = lanPN.lan.Value + 1;
            }


            for (int i = 0; i < list.Count; i++)
            {
                VatDungHistory vd = new VatDungHistory();
                vd.idVatTu = list[i].idVatTu;
                vd.ngayTao = DateTime.UtcNow;
                vd.soLuong = list[i].soLuong;
                vd.loai = 1;
                await _context.VatDungHistory.AddAsync(vd);

                list[i].lan = lan;
                list[i].vatTu = null;
                list[i].PhieuXuatVD = null;
                list[i].ngayTao = DateTime.UtcNow;
                var vatdung = await _context.VatTu.SingleOrDefaultAsync(x => x.id == list[i].idVatTu);
                vatdung.soLuongConLai = vatdung.soLuongConLai - list[i].soLuong;
            }
            await _context.ChiTietVanChuyenXuat.AddRangeAsync(list);
            var px = await _context.PhieuXuatVD.SingleOrDefaultAsync(x => x.id == list[0].idPhieuXuat);

            await _context.SaveChangesAsync();
            await checkDone(px.idVanChuyen, px.id);
            return Ok(list[0]);

           
        }

        private async Task checkDone(int idVanChuyen, int idPhieuXuat)
        {

            var listPhieuXuat = await _context.ChiTietVanChuyenXuat.Where(x => x.idPhieuXuat == idPhieuXuat).ToListAsync();
            var listVanChuyen = await _context.ChiTietVanChuyen.Where(x => x.idVanChuyen == idVanChuyen).ToListAsync();

            var check = true;
            for (int i = 0; i < listVanChuyen.Count && check; i++)
            {
                double tongPN = 0;
                for (int j = 0; j < listPhieuXuat.Count && check; j++)
                {
                    if (listVanChuyen[i].idVatTu == listPhieuXuat[j].idVatTu)
                    {
                        tongPN += listPhieuXuat[j].soLuong;
                    }
                }
                if (listVanChuyen[i].soLuong > tongPN)
                {
                    check = false;
                }
            }
            if (check == true)
            {
                var phieuXuat = await _context.PhieuXuatVD.SingleOrDefaultAsync(x => x.id == idPhieuXuat);

                //var vc = await _context.VanChuyen.SingleOrDefaultAsync(x => x.id == phieuXuat.idVanChuyen);
                if (phieuXuat!=null)
                {
                    phieuXuat.isCheck = 1;
                }
                await _context.SaveChangesAsync();
            }

        }

    }
}
