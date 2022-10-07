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
    public class VatDungHistoryController : ControllerBase
    {
        private readonly Context _context;
        private int KiemKe = 3;
        private int Xuat = 1;
        private int Nhap = 2;

        public VatDungHistoryController(Context context)
        {
            _context = context;
        }
        [HttpGet]
        public ActionResult<IEnumerable<VatDungHistory>> GetVatTu()
        {
            var list = _context.VatDungHistory.ToList();
            return Ok(list);
        }

        [HttpGet("vatdung/{idVatDung}")]
        public ActionResult<IEnumerable<VatDungHistory>> GetVatTu(int idVatDung)
        {
            var list = _context.VatDungHistory.Where(x=>x.idVatTu== idVatDung).ToList();
            return Ok(list);
        }

        [HttpGet("{id}")]
        public ActionResult<VatDungHistory> GetByID(int id)
        {
            var list = _context.HoaDonMua.Include(a => a.hopDong).SingleOrDefault(x => x.id == id);
            return Ok(list);
        }

        [HttpPost("kiemke")]
        public async Task<ActionResult> addKiemKe(VatDungHistory hd)
        {
            
            hd.idVatTu = hd.idVatTu;
            hd.ngayTao = DateTime.UtcNow;
            hd.loai = KiemKe;
            hd.vatTu = null;
            if (hd.soLuong != hd.soLuongKiemKe)
            {
                var vatTu = await _context.VatTu.SingleOrDefaultAsync(x => x.id == hd.idVatTu);
                vatTu.soLuongConLai = hd.soLuongKiemKe.Value;
                await _context.SaveChangesAsync();
            }
            _context.VatDungHistory.Add(hd);
            await _context.SaveChangesAsync();
            return Ok("thêm thành công");
        }

        [HttpPost("nhap")]
        public async Task<ActionResult<VatDungHistory>> addNhap(VatDungHistory hd)
        {
            hd.loai = Nhap;
            hd.vatTu= null;
             _context.VatDungHistory.Add(hd);
            return Ok(hd);
        }

        [HttpPost("xuat")]
        public async Task<ActionResult<VatDungHistory>> addXuat(VatDungHistory hd)
        {
            hd.loai = Xuat;
            hd.vatTu = null;
            _context.VatDungHistory.Add(hd);
            await _context.SaveChangesAsync();

            return Ok(hd);
        }

    }
}
