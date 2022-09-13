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
    public class ChiTietPhieuMuaController : ControllerBase
    {
        private readonly Context _context;

        public ChiTietPhieuMuaController(Context context)
        {
            _context = context;
        }
        [HttpGet("hopDong/{idHopDong}")]
        public ActionResult<IEnumerable<MappingThucPham>> GetVatTubyHopDong(int idHopDong)
        {
            IEnumerable<MappingThucPham> list = AddListThucPhamByIdHopDong(idHopDong);
            return Ok(list);
        }
        [HttpGet("phieuMua/{idPhieuMua}")]
        public ActionResult<IEnumerable<ChiTietPhieuMua>> GetVatTubyPhieuMua(int idPhieuMua)
        {
            IEnumerable<ChiTietPhieuMua> list = _context.ChiTietPhieuMua.Include(a=>a.hoaDonMua).Include(z=>z.thucPham).Where(x=>x.idHoaDon== idPhieuMua).ToList() ;
            return Ok(list);
        }
        [HttpPost("listId")]
        public ActionResult<IEnumerable<MappingThucPham>> GetVatTu(List<int> idHopDong)
        {
            IEnumerable<MappingThucPham> list = AddListThucPham(idHopDong);
            return Ok(list);
        }

        //[HttpGet("{idPhieuNhap}")]
        //public ActionResult<IEnumerable<ChiTietPhieuNhap>> GetPM(int idPhieuNhap)
        //{
        //    var list = _context.ChiTietPhieuNhap.Include(x=>x.thucPham).Include(v=>v.hoaDonNhap).Where(x => x.idHoaDon == idPhieuNhap).ToList();
        //    return Ok(list);
        //}

        [HttpPost]
        public async Task<ActionResult> add(List<ChiTietPhieuMua> list)
        {
            for (int i = 0; i < list.Count; i++)
            {
                list[i].thucPham = null;
                list[i].hoaDonMua = null;
                await _context.ChiTietPhieuMua.AddAsync(list[i]);
            }
            await _context.SaveChangesAsync();
            return Ok("Thêm thành công");
        }

        private List<MappingThucPham> AddListThucPham(List<int> idHopDong)
        {
            List<MappingThucPham> mapping= new List<MappingThucPham>();

            //var listTD = _context.ThucDon.Where(x => idHopDong.Contains(x.idHopDong)).ToList();
            var hopDong = _context.HopDong.Where(x => idHopDong.Contains(x.id)).ToList();
            hopDong.ForEach(item =>
            {
                var listTD = _context.ThucDon.Where(x => x.idHopDong ==item.id ).ToList();
                if (listTD.Count > 0)
                {
                    listTD.ForEach(itemx =>
                    {
                        var listTPKemMA = _context.ThucPhamKemMonAn.Include(a => a.thucPham).Where(x => x.idMonAn == itemx.idMonAn).ToList();
                        listTPKemMA.ForEach(items =>
                        {
                            var map = new MappingThucPham() { idThucPham = items.idThucPham, soLuong = items.soLuong * item.soMam, thucPham = items.thucPham };
                            mapping.Add(map);
                        });
                    });
                }
            });

            return mapping;
        }

        private List<MappingThucPham> AddListThucPhamByIdHopDong(int idHopDong)
        {
            List<MappingThucPham> mapping = new List<MappingThucPham>();

            //var listTD = _context.ThucDon.Where(x => idHopDong.Contains(x.idHopDong)).ToList();
            var hopDong = _context.HopDong.SingleOrDefault(x=>x.id==idHopDong);
            if (hopDong == null)
                return null;

            var listTD = _context.ThucDon.Where(x => x.idHopDong == hopDong.id).ToList();
            
            if (listTD.Count > 0)
            {
                listTD.ForEach(itemx =>
                {
                    var listTPKemMA = _context.ThucPhamKemMonAn.Include(a => a.thucPham).Where(x => x.idMonAn == itemx.idMonAn).ToList();
                    listTPKemMA.ForEach(items =>
                    {
                        var map = new MappingThucPham() { idThucPham = items.idThucPham, soLuong = items.soLuong * hopDong.soMam, thucPham = items.thucPham };
                        mapping.Add(map);
                    });
                });
                //hopDong.isPhieuMua = 1;
                //_context.SaveChanges();
            }
            else
            {
                return null;
            }
            

            return mapping;
        }
    }
}
