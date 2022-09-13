﻿using DOAN.API.ViewModel;
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
    public class ChiTietPhieuXuatController : ControllerBase
    {
        private readonly Context _context;

        public ChiTietPhieuXuatController(Context context)
        {
            _context = context;
        }
        [HttpGet("hopDong/{idHopDong}")]
        public ActionResult<List<MappingThucPham>> GetVatTubyHopDong(int idHopDong)
        {
            List<MappingThucPham> list= new List<MappingThucPham>();
            var check = _context.HopDong.SingleOrDefault(x => x.id == idHopDong);
            if(check!= null)
            {
                if (check.isPhieuXuat == 0)
                {
                    list = AddListThucPhamByIdHopDong(idHopDong);
                }
                return Ok(list);
                
            }
            else
            {
                return BadRequest();
            }
           
        }
        [HttpGet("phieuXuat/{idPhieuXuat}")]
        public ActionResult<IEnumerable<ChiTietPhieuXuat>> GetVatTubyPhieuMua(int idPhieuXuat)
        {
            IEnumerable<ChiTietPhieuXuat> list = _context.ChiTietPhieuXuat.Include(a => a.hoaDonXuat).Include(z => z.thucPham).Where(x => x.idHoaDon == idPhieuXuat).ToList();
            return Ok(list);
        }
        
        [HttpPost("listId")]
        public ActionResult<IEnumerable<MappingThucPham>> GetVatTu(List<int> idHopDong)
        {
            IEnumerable<MappingThucPham> list = AddListThucPham(idHopDong);
            return Ok(list);
        }
        [HttpPost]
        public async Task<ActionResult> add(List<ChiTietPhieuXuat> list)
        {
            for (int i = 0; i < list.Count; i++)
            {
                list[i].thucPham = null;
                list[i].hoaDonXuat = null;
                list[i].chiTietPhieuNhap = null;
                var thucpham = await _context.ThucPham.SingleOrDefaultAsync(a => a.id == list[i].idThucPham);
                var chiTietNhap= await _context.ChiTietPhieuNhap.SingleOrDefaultAsync(a=>a.id== list[i].idChiTietNhap);
                chiTietNhap.soLuongConLai = Math.Round(chiTietNhap.soLuongConLai.Value - list[i].soLuong,2);
                thucpham.soLuong = Math.Round(thucpham.soLuong - list[i].soLuong, 2);
                await checkDone(list[i].idChiTietNhap.Value);
            }
            await _context.ChiTietPhieuXuat.AddRangeAsync(list);
            await _context.SaveChangesAsync();
            return Ok("Thêm thành công");
        }
        //[HttpGet("{idNhap}/{soLuong}")]
        //public async Task<ActionResult<ChiTietPhieuNhap>> check(int idNhap, double soLuong)
        //{
        //    var ct = await _context.ChiTietPhieuNhap.SingleOrDefaultAsync(x => x.id == idNhap);
        //    if (ct.soLuongConLai == soLuong)
        //    {
        //        ct.isCheck = 1;
        //        await _context.SaveChangesAsync();
        //    }
        //    return Ok(ct);
        //}
        private async Task checkDone (int idNhap)
        {
            var ct = await _context.ChiTietPhieuNhap.SingleOrDefaultAsync(x => x.id == idNhap);
            if(ct.soLuongConLai== 0)
            {
                ct.isCheck = 1;
                await _context.SaveChangesAsync();
            }
        }
        //[HttpGet("{idPhieuNhap}")]
        //public ActionResult<IEnumerable<ChiTietPhieuNhap>> GetPM(int idPhieuNhap)
        //{
        //    var list = _context.ChiTietPhieuNhap.Include(x=>x.thucPham).Include(v=>v.hoaDonNhap).Where(x => x.idHoaDon == idPhieuNhap).ToList();
        //    return Ok(list);
        //}

        //[HttpPost]
        //public async Task<ActionResult> add(List<ChiTietPhieuXuat> list)
        //{
        //    for (int i = 0; i < list.Count; i++)
        //    {
        //        list[i].thucPham = null;
        //        list[i].hoaDonMua = null;
        //        await _context.ChiTietPhieuXuat.AddAsync(list[i]);
        //    }
        //    await _context.SaveChangesAsync();
        //    return Ok("Thêm thành công");
        //}

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
                //hopDong.isPhieuXuat = 1;
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
