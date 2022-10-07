using Dapper;
using DOAN.API.ViewModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace DOAN.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChiTietVanChuyenNhapController : ControllerBase
    {
        private readonly Context _context;
        private readonly DapperContext _dapperContext;
        public ChiTietVanChuyenNhapController(Context context, DapperContext dapperContext)
        {
            _context = context;
            _dapperContext = dapperContext;
        }

        [HttpGet("vanchuyen/{idVanChuyen}")]
        public async Task<ActionResult<IEnumerable<ChiTietVanChuyenNhap>>> GetListVatTuPhieuXuat(int idVanChuyen)
        {

            var phieuXuat = await _context.PhieuXuatVD.SingleOrDefaultAsync(x => x.idVanChuyen == idVanChuyen);
            if (phieuXuat == null)
            {
                return BadRequest("Không tìm thấy");
            }
            var phieuNhap = await _context.PhieuNhapVD.SingleOrDefaultAsync(x => x.idPhieuXuat == phieuXuat.id);
            var list = await _context.ChiTietVanChuyenNhap.Include(z => z.vatTu).Where(x => x.idPhieuNhap == phieuNhap.id).ToListAsync();
            return Ok(list);
        }

        [HttpGet("chart")]
        public IActionResult Chart()
        {
            //var listPX = await _context.ChiTietVanChuyenXuat.Include(x=>x.PhieuXuatVD).ToListAsync();
            //var listPN = await _context.ChiTietVanChuyenNhap.Include(x=>x.phieuNhapVD).ThenInclude(y=>y.phieuXuat).ToListAsync();
            List<chartModel> arr= new List<chartModel>();

            var query = @"SELECT idVatTu, PhieuXuatVD.id,SUM(soLuong) as SL 
                        FROM [QLXC].[dbo].[ChiTietVanChuyenXuat] , dbo.PhieuXuatVD
                        where ChiTietVanChuyenXuat.idPhieuXuat=PhieuXuatVD.id 
                        group by idVatTu,PhieuXuatVD.id";
            var query1 = @"SELECT idVatTu, PhieuXuatVD.id,SUM(soLuong) as SL 
                        FROM [QLXC].[dbo].ChiTietVanChuyenNhap , dbo.PhieuXuatVD, dbo.PhieuNhapVD
                        where ChiTietVanChuyenNhap.idPhieuNhap = PhieuNhapVD.id AND PhieuNhapVD.idPhieuXuat = PhieuXuatVD.id
                        group by idVatTu,PhieuXuatVD.id";
            using (var connection = _dapperContext.CreateConnection())
            {
                var pxx = connection.Query<chartModel>(query).ToList();
                var pnn= connection.Query<chartModel>(query1).ToList();
                pxx.ForEach(px =>
                {
                    var check = true;
                    pnn.ForEach(pn =>
                    {
                        if (pn.id == px.id && pn.idVatTu== px.idVatTu)
                        {
                            var sl = px.sl - pn.sl;
                            if(sl>0)
                                arr.Add(new chartModel(pn.idVatTu, sl, pn.id));
                            check = false;
                        }
                        
                    });
                    if (check)
                    {
                        arr.Add(px);
                    }
                });

                List<int> check= new List<int>();
                List<int> check1= new List<int>();
                List<chartModel> result = new List<chartModel>();

                arr.ForEach(item =>
                {
                    //var soluong = 0;
                    if (!check.Contains(item.idVatTu))
                    {
                        int soLuong = 0;
                        check.Add(item.idVatTu);
                        chartModel a = new chartModel();
                        arr.ForEach(i =>
                        {
                            if (i.idVatTu == item.idVatTu)
                            {
                                soLuong = soLuong +  i.sl;
                            }
                            a.idVatTu = item.idVatTu;
                            a.sl = soLuong;
                            a.id = i.id;

                        });
                        result.Add(a);
                    }
                });
                return Ok(result);
            }

        }

        [HttpGet("phieunhap/{id}")]
        public async Task<ActionResult<IEnumerable<ChiTietVanChuyenNhap>>> GetListVatTuPhieuNhapByid(int id)
        {
            var list = await _context.ChiTietVanChuyenNhap.Include(z => z.vatTu).Where(x => x.idPhieuNhap == id).ToListAsync();
            return Ok(list);
        }

        [HttpGet("phieuxuat/{id}")]
        public async Task<ActionResult<IEnumerable<ChiTietVanChuyenNhap>>> GetListVatTuPhieuXuatByid(int id)
        {
            IEnumerable<ChiTietVanChuyenNhap> x = null;
            var phieuNhap = await _context.PhieuNhapVD.SingleOrDefaultAsync(x => x.idPhieuXuat == id);
            if (phieuNhap == null)
                return Ok(x);
            x = await _context.ChiTietVanChuyenNhap.Include(z => z.vatTu).Where(x => x.idPhieuNhap == phieuNhap.id).ToListAsync();
            if (x == null)
                return Ok(x);
            else
                return Ok(x);
        }


        [HttpPost("addlist")]
        public async Task<ActionResult<ChiTietVanChuyenNhap>> PostPhieuXuat(List<ChiTietVanChuyenNhap> list)
        {
            var lan = 1;
            var lanPN = await _context.ChiTietVanChuyenNhap.OrderByDescending(x => x.lan).FirstOrDefaultAsync(a => a.idPhieuNhap == list[0].idPhieuNhap);
            if (lanPN != null)
            {
                lan = lanPN.lan.Value + 1;
            }


            for (int i = 0; i < list.Count; i++)
            {
                VatDungHistory vd= new VatDungHistory();
                vd.idVatTu = list[i].idVatTu;
                vd.ngayTao = DateTime.UtcNow;
                vd.soLuong = list[i].soLuong.Value;
                vd.loai = 2;
                await _context.VatDungHistory.AddAsync(vd);

                list[i].lan = lan;
                list[i].vatTu = null;
                list[i].phieuNhapVD = null;
                list[i].ngayNhap = DateTime.UtcNow;
                var vatdung = await _context.VatTu.SingleOrDefaultAsync(x => x.id == list[i].idVatTu);
                vatdung.soLuongConLai = vatdung.soLuongConLai + list[i].soLuong.Value;
            }
            await _context.ChiTietVanChuyenNhap.AddRangeAsync(list);
            var pn = await _context.PhieuNhapVD.SingleOrDefaultAsync(x => x.id == list[0].idPhieuNhap);
            await _context.SaveChangesAsync();
            await checkDone(pn.idPhieuXuat, pn.id);
            return Ok(list[0]);
        }
        [HttpPost("addlistHT")]
        public async Task<ActionResult<ChiTietVanChuyenNhap>> PostPhieuXuatHT(List<ChiTietVanChuyenNhap> list)
        {
            var lan = 1;
            var lanPN = await _context.ChiTietVanChuyenNhap.OrderByDescending(x => x.lan).FirstOrDefaultAsync(a => a.idPhieuNhap == list[0].idPhieuNhap);
            if (lanPN != null)
            {
                lan = lanPN.lan.Value + 1;
            }
            for (int i = 0; i < list.Count; i++)
            {
                list[i].lan = lan;
                list[i].vatTu = null;
                list[i].phieuNhapVD = null;
                list[i].ngayNhap = DateTime.UtcNow;
                var vatdung = await _context.VatTu.SingleOrDefaultAsync(x => x.id == list[i].idVatTu);
                vatdung.soLuongConLai = vatdung.soLuongConLai + list[i].soLuong.Value;
            }
            await _context.ChiTietVanChuyenNhap.AddRangeAsync(list);
            var pn = await _context.PhieuNhapVD.SingleOrDefaultAsync(x => x.id == list[0].idPhieuNhap);
            var phieuXuat = await _context.PhieuXuatVD.SingleOrDefaultAsync(x => x.id == pn.idPhieuXuat);
            var vc = await _context.VanChuyen.SingleOrDefaultAsync(x => x.id == phieuXuat.idVanChuyen);
            if (vc != null)
            {
                vc.trangThai = 4;
            }
            await _context.SaveChangesAsync();
            //await checkDone(pn.idPhieuXuat, pn.id);
            return Ok(list[0]);
        }
        [HttpGet("cc")]
        public async Task<ActionResult<IEnumerable<ChiTietVanChuyenNhap>>> GetListVat()
        {
            await checkDone(4, 4); ;
            return Ok();
        }

        private async Task checkDone(int idPhieuXuat, int idPhieuNhap)
        {

            var listPhieuXuat = await _context.ChiTietVanChuyenXuat.Where(x => x.idPhieuXuat == idPhieuXuat).ToListAsync();
            var listPhieuNhap = await _context.ChiTietVanChuyenNhap.Where(x => x.idPhieuNhap == idPhieuNhap).ToListAsync();


            var check = true;
            for (int i = 0; i < listPhieuXuat.Count && check; i++)
            {
                double tongPN = 0;
                for (int j = 0; j < listPhieuNhap.Count && check; j++)
                {
                    if (listPhieuXuat[i].idVatTu == listPhieuNhap[j].idVatTu)
                    {
                        tongPN += listPhieuNhap[j].soLuong.Value;
                    }
                }
                if (listPhieuXuat[i].soLuong > tongPN)
                {
                    check = false;
                }
            }
            if (check == true)
            {
                var phieuXuat = await _context.PhieuXuatVD.SingleOrDefaultAsync(x => x.id == idPhieuXuat);

                var vc =await _context.VanChuyen.SingleOrDefaultAsync(x => x.id == phieuXuat.idVanChuyen);
                if (vc != null)
                {
                    vc.trangThai = 4;
                }
                await _context.SaveChangesAsync();
            }

        }


    }
}
