﻿using DOAN.API.ViewModel;
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
    public class ChiTietPhieuNhapController : ControllerBase
    {
        private readonly Context _context;

        public ChiTietPhieuNhapController(Context context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChiTietPhieuNhap>>> getall()
        {
            var list = await _context.ChiTietPhieuNhap.ToListAsync();
            return Ok(list);
        }

        [HttpGet("phieuMua/{idPhieuMua}")]
        public async Task<ActionResult<IEnumerable<ChiTietPhieuNhap>>> GetbyPM(int idPhieuMua)
        {
            IEnumerable<ChiTietPhieuNhap> list = null;
            var PN = await _context.HoaDonNhap.SingleOrDefaultAsync(x => x.idPhieuMua == idPhieuMua);
            if (PN == null)
                return Ok(list);
            else
            {
                list = await _context.ChiTietPhieuNhap.Include(x=>x.thucPham).Include(a=>a.hoaDonhNhap).Where(z=>z.idHoaDon== PN.id).ToListAsync();
                return Ok(list);
            }
        }
        [HttpGet("phieunhap/{idPhieuNhap}")]
        public async Task<ActionResult<IEnumerable<ChiTietPhieuNhap>>> GetbyPN(int idPhieuNhap)
        {
            var list = await _context.ChiTietPhieuNhap.Include(x => x.thucPham).Include(a => a.hoaDonhNhap).Where(z => z.idHoaDon == idPhieuNhap).ToListAsync();
            return Ok(list);
            
        }

        [HttpPost]
        public async Task<ActionResult> add(List<ChiTietPhieuNhap> list)
        {
            int lanx=1;
            var check = await _context.HoaDonNhap.SingleOrDefaultAsync(x => x.id == list[0].idHoaDon);
           
            if (check != null)
            {
                
                var ct = await _context.ChiTietPhieuNhap.OrderByDescending(x => x.lan).FirstOrDefaultAsync(a => a.idHoaDon == list[0].idHoaDon);
                if (ct != null)
                    lanx = ct.lan.Value + 1;
            }
            for (int i = 0; i < list.Count; i++)
            {
                var thucPham = await _context.ThucPham.SingleOrDefaultAsync(x => x.id == list[i].idThucPham);
                thucPham.soLuong += list[i].soLuong;
                list[i].lan = lanx;
                list[i].thucPham = null;
                list[i].hoaDonhNhap = null;
                await _context.ChiTietPhieuNhap.AddAsync(list[i]);
            }
            await _context.SaveChangesAsync();
            var pm = await _context.HoaDonMua.SingleOrDefaultAsync(x => x.id == check.idPhieuMua);
            await checkDone(pm.id,list[0].idHoaDon);
            return Ok();
        }


        private async Task checkDone(int idPhieuMua, int idPhieuNhap)
        {
            //var phieuNhap = await _context.HoaDonNhap.SingleOrDefaultAsync(x => x.id == idPhieuNhap);

            var listPhieuMua = await _context.ChiTietPhieuMua.Where(x => x.idHoaDon == idPhieuMua).ToListAsync();
            if (listPhieuMua.Count < 0)
                return;
            var listPhieuNhap = await _context.ChiTietPhieuNhap.Where(x => x.idHoaDon == idPhieuNhap).ToListAsync();
            if (listPhieuNhap.Count < 0)
                return;
            var check = true;
            for (int i = 0; i < listPhieuMua.Count && check; i++)
            {
                double tongPN = 0;
                for (int j = 0; j < listPhieuNhap.Count && check; j++)
                {
                    if (listPhieuMua[i].idThucPham == listPhieuNhap[j].idThucPham)
                    {
                        tongPN += listPhieuNhap[j].soLuong;
                        if (listPhieuMua[i].soLuong > tongPN)
                        {
                            check = false;
                        }
                    }
                }
            }
            if (check == true)
            {
                var phieuMua = await _context.HoaDonMua.SingleOrDefaultAsync(x => x.id == idPhieuMua);
                phieuMua.isCheck = 1;
                await _context.SaveChangesAsync();
            }
        }

    }
}
