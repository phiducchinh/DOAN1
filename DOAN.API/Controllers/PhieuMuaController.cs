using DOAN.API.ViewModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DOAN.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhieuMuaController : ControllerBase
    {
        private readonly Context _context;

        public PhieuMuaController(Context context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<HoaDonMua>> GetVatTu()
        {
            var list = _context.HoaDonMua.ToList();
            return Ok(list);
        }

        [HttpGet("{id}")]
        public ActionResult<HoaDonMua> GetByID(int id)
        {
            var list = _context.HoaDonMua.Include(a=>a.hopDong).SingleOrDefault(x=>x.id==id);
            return Ok(list);
        }

        [HttpDelete("{id}")]
        public ActionResult<HoaDonMua> delete(int id)
        {
            var list = _context.HoaDonMua.SingleOrDefault(x => x.id == id);
            _context.HoaDonMua.Remove(list);
            _context.SaveChanges();
            return Ok(list);
        }

        [HttpPost]
        public ActionResult<IEnumerable<HoaDonMua>> add(HoaDonMua hd)
        {
            var dc = _context.HopDong.SingleOrDefault(x => x.id == hd.idHopDong);
            if (dc != null)
            {
                dc.isPhieuMua = 1;
            }
            hd.isCheck = 0;
            _context.HoaDonMua.Add(hd);
            _context.SaveChanges();
            return Ok(hd);
        }
    }
}
