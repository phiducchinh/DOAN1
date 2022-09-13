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
    public class ChiTietVanChuyenController : ControllerBase
    {
        private readonly Context _context;
        public ChiTietVanChuyenController(Context context)
        {
            _context = context;
        }

        //public ChiTietVanChuyenController(Context context)
        //{
        //    _context = context;
        //}
        [HttpGet("khoitao/{idHopDong}")]
        public ActionResult<IEnumerable<MappingVatDung>> GetVatTu(int idHopDong)
        {
            IEnumerable<MappingVatDung> list = AddListVanChuyen(idHopDong);
            return Ok(list);
        }

        [HttpPost]
        public async Task<ActionResult> add(List<ChiTietVanChuyen> list)
        {
            var vanChuyen = await _context.VanChuyen.SingleOrDefaultAsync(a => a.id == list[0].idVanChuyen);
            if (vanChuyen == null)
            {
                return BadRequest("Có lỗi khi thêm đơn vận chuyển");
            }

            for (int i = 0; i < list.Count; i++)
            {
                list[i].vatTu = null;
                list[i].vanChuyen = null;
            }
            await _context.ChiTietVanChuyen.AddRangeAsync(list);

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("hopDong/{idVanChuyen}")]
        public async Task<ActionResult<IEnumerable<ChiTietVanChuyen>>> GetListVatTu(int idVanChuyen)
        {
            var list = await _context.ChiTietVanChuyen.Include(a => a.vatTu).Where(x => x.idVanChuyen == idVanChuyen).ToListAsync();
            return Ok(list);
        }



        //[HttpGet("phieunhap/{idVanChuyen}")]
        //public async Task<ActionResult<IEnumerable<ChiTietVanChuyen>>> GetListVatTuPhieuNhap(int idVanChuyen)
        //{
        //    var list = await _context.ChiTietVanChuyen.Include(a => a.vatTu).Where(x => x.idVanChuyen == idVanChuyen && x.loai == 3).ToListAsync();
        //    return Ok(list);
        //}

        [HttpGet("phieuxuatadd/{idVanChuyen}")]
        public async Task<ActionResult<IEnumerable<ChiTietVanChuyen>>> GetListVatTuPhieuXuaAddt(int idVanChuyen)
        {
            var list = await _context.ChiTietVanChuyen.Include(a => a.vatTu).Where(x => x.idVanChuyen == idVanChuyen).ToListAsync();
            for (var i = 0; i < list.Count; i++)
            {
                var item = list[i];
                if (item.soLuong > item.vatTu.soLuongConLai)
                {
                    item.soLuong = item.vatTu.soLuongConLai;
                }
            }
            return Ok(list);
        }

        //[HttpGet("phieunhapadd/{idVanChuyen}")]
        //public async Task<ActionResult<IEnumerable<ChiTietVanChuyen>>> GetListVatTuPhieunhapAddt(int idVanChuyen)
        //{
        //    var list = await _context.ChiTietVanChuyen.Include(a => a.vatTu).Where(x => x.idVanChuyen == idVanChuyen && x.loai == 2).ToListAsync();
        //    return Ok(list);
        //}



        //[HttpPost("phieunhapadd")]
        //public async Task<ActionResult<IEnumerable<ChiTietVanChuyen>>> PostPhieuNhap(List<ChiTietVanChuyen> list)
        //{
        //    var vanChuyen = await _context.VanChuyen.SingleOrDefaultAsync(a => a.id == list[0].idVanChuyen);
        //    if (vanChuyen == null)
        //    {
        //        return BadRequest("Có lỗi khi thêm phiếu nhập");
        //    }
        //    vanChuyen.trangThai = 4;
        //    vanChuyen.ngayDon = DateTime.UtcNow;
        //    for (int i = 0; i < list.Count; i++)
        //    {
        //        var VatTu = await _context.VatTu.SingleOrDefaultAsync(x => x.id == list[i].idVatTu);

        //        VatTu.soLuongConLai = VatTu.soLuongConLai + list[i].soLuong;

        //        list[i].loai = 3;
        //        list[i].vatTu = null;
        //        //list[i].vanChuyen = null;
        //        await _context.ChiTietVanChuyen.AddAsync(list[i]);
        //    }

        //    await _context.SaveChangesAsync();
        //    return Ok();
        //}

        private List<MappingVatDung> AddListVanChuyen(int idHopDong)
        {
            List<ChiTietVanChuyen> listCTVanChuyen = new List<ChiTietVanChuyen>();
            List<MappingVatDung> mapping = new List<MappingVatDung>();
            var listThucDon = _context.ThucDon.Where(x => x.idHopDong == idHopDong).ToList();
            var hopDong = _context.HopDong.SingleOrDefault(a => a.id == idHopDong);
            if (hopDong.suDungBanGhe == 1)
            {
                var ban = _context.VatTu.SingleOrDefault(x => x.id == 10);
                var ghe = _context.VatTu.SingleOrDefault(x => x.id == 11);

                mapping.Add(new MappingVatDung() { idVatDung = ban.id, soLuong = hopDong.soMam, vatTu = ban });
                mapping.Add(new MappingVatDung() { idVatDung = ghe.id, soLuong = hopDong.soMam * 6, vatTu = ghe });
            }
            var bat = _context.VatTu.SingleOrDefault(x => x.id == 1);
            var dua = _context.VatTu.SingleOrDefault(x => x.id == 9);
            mapping.Add(new MappingVatDung() { idVatDung = bat.id, soLuong = hopDong.soMam * 6, vatTu = bat });
            mapping.Add(new MappingVatDung() { idVatDung = dua.id, soLuong = hopDong.soMam * 12, vatTu = dua });
            if (listThucDon.Count() > 0)
            {
                listThucDon.ForEach(item =>
                {
                    var listVDKemMA = _context.DungCuKemMonAn.Include(a => a.vatTu).Where(x => x.idMonAn == item.idMonAn).ToList();
                    listVDKemMA.ForEach(items =>
                    {
                        var mapp = new MappingVatDung() { idVatDung = items.idVatTu, soLuong = items.soLuong * hopDong.soMam, vatTu = items.vatTu };
                        mapping.Add(mapp);
                    });
                });
            }
            return mapping;
        }

    }
}
