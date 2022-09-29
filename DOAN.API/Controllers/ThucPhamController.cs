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
    public class ThucPhamController : ControllerBase
    {
        private readonly Context _context;
        public ThucPhamController(Context context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ThucPham>>> GetAll()
        {
            var listThucPham = await _context.ThucPham.ToListAsync();
            return Ok(listThucPham);
        }

        [HttpGet("getall")]
        public async Task<ActionResult<IEnumerable<AllThucPham>>> GetAllTP()
        {
            var listThucPham = await _context.ThucPham.ToListAsync();
            List<AllThucPham> list= new List<AllThucPham>();
            listThucPham.ForEach(async item =>
            {
                var listTP = _context.ChiTietPhieuNhap.Where(x => x.idThucPham == item.id && x.isCheck==0).Include(z=>z.hoaDonhNhap).ToList();
                AllThucPham chiTiet = new AllThucPham();
                chiTiet.id = item.id;
                chiTiet.donVi = item.donVi;
                chiTiet.ghiChu = item.ghiChu;
                chiTiet.loai = item.loai;
                chiTiet.maThucPham = item.maThucPham;
                chiTiet.soLuong = item.soLuong;
                chiTiet.tenThucPham = item.tenThucPham;
                if (listTP.Any())
                {
                    chiTiet.phieuNhap = listTP;
                }
                else
                {
                    chiTiet.phieuNhap = null;
                }
                list.Add(chiTiet);
            });
            return Ok(list);
        }

        [HttpPost("filter")]
        public async Task<ActionResult<IEnumerable<AllThucPham>>> GetAllTPFilter(filter filter)
        {
            var listThucPham = await _context.ThucPham.ToListAsync();

            if (filter.title!=null)
            {
                listThucPham= listThucPham.Where(x=> x.tenThucPham.Contains(filter.title) || x.maThucPham.Contains(filter.title)).ToList();
            }
            if (filter.status != -1)
            {
                listThucPham = listThucPham.Where(x => x.loai == filter.status).ToList();
            }

            //if (filter.date != null)
            //{
            //    listThucPham = listThucPham.Where(x => x.loai == filter.status).ToList();
            //}

            List<AllThucPham> list = new List<AllThucPham>();
            listThucPham.ForEach(item =>
            {
                var listTP = _context.ChiTietPhieuNhap.Include(a=>a.hoaDonhNhap).Where(x => x.idThucPham == item.id && x.isCheck == 0).ToList();
                if(filter.date != null || filter.date!= -1)
                {
                    DateTime date = DateTime.Now;
                    DateTime nearDate = date.AddDays(3);
                    if (filter.date == 0)
                    {
                        listTP = listTP.Where(x => x.hanSuDung < date).ToList();
                    }
                    else if(filter.date == 1)
                    {
                        listTP = listTP.Where(x => x.hanSuDung >= date && x.hanSuDung <= nearDate).ToList();
                    }
                    else if(filter.date == 2)
                    {
                        listTP = listTP.Where(x => x.hanSuDung > nearDate).ToList();
                    }
                    //filter.date = filter.date.Value.AddDays(-5);
                }
                AllThucPham chiTiet = new AllThucPham();
                chiTiet.id = item.id;
                chiTiet.donVi = item.donVi;
                chiTiet.ghiChu = item.ghiChu;
                chiTiet.loai = item.loai;
                chiTiet.maThucPham = item.maThucPham;
                chiTiet.soLuong = item.soLuong;
                chiTiet.tenThucPham = item.tenThucPham;
                if (listTP.Any())
                {
                    chiTiet.phieuNhap = listTP;
                }
                else
                {
                    chiTiet.phieuNhap = null;
                }
                list.Add(chiTiet);
            });
            return Ok(list);
        }

        [HttpPost("notInArr")]
        public async Task<ActionResult<IEnumerable<ThucPham>>> FillterNot(List<int> arrID)
        {
            var listThucPham = await _context.ThucPham.Where(x=>!arrID.Contains(x.id)).ToListAsync();
            return Ok(listThucPham);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<ThucPham>> GetThucPhamById(int id)
        {
            var ThucPham = await _context.ThucPham.SingleOrDefaultAsync(x => x.id == id);
            if (ThucPham == null)
                return NotFound();
            return Ok(ThucPham);
        }
        [HttpGet("search/{tenThucPham}")]
        public async Task<ActionResult<IEnumerable<ThucPham>>> GetThucPhamByName(string tenThucPham)
        {
            var ThucPham = await _context.ThucPham.Where(x => x.tenThucPham.Contains(tenThucPham)).ToListAsync();
            if (ThucPham.Count <= 0)
                ThucPham = await _context.ThucPham.Where(x => x.maThucPham.Contains(tenThucPham)).ToListAsync();
            return Ok(ThucPham);
        }
        [HttpPost]
        public async Task<ActionResult> PostThucPham(ThucPham ThucPham)
        {
            _context.ThucPham.Add(ThucPham);
            await _context.SaveChangesAsync();
            return Ok("Thêm sinh viên thành công");
        }
        [HttpPut("{id}")]
        public async Task<ActionResult> EditThucPham(int id, ThucPham ThucPham)
        {
            if (id != ThucPham.id)
                return BadRequest("Không trùng id");
            var check = await _context.ThucPham.SingleOrDefaultAsync(x => x.id == id);
            if (check == null)
            {
                return BadRequest("Món ăn không tồn tại");
            }
            check.tenThucPham = ThucPham.tenThucPham;
            check.maThucPham = ThucPham.maThucPham;
            check.loai = ThucPham.loai;
            check.ghiChu = ThucPham.ghiChu;
            check.donVi = ThucPham.donVi;
            await _context.SaveChangesAsync();
            return Ok("Sửa thành công");
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteThucPham(int id)
        {
            var ThucPham = await _context.ThucPham.SingleOrDefaultAsync(x => x.id == id);
            if (ThucPham == null)
                return BadRequest("Xóa không thành công");
            _context.ThucPham.Remove(ThucPham);
            await _context.SaveChangesAsync();
            return Ok("Xóa thành công");
        }

        [HttpDelete("list")]
        public async Task<ActionResult> DeleteList(List<int> ids)
        {
            var listNv = await _context.ThucPham.Where(x => ids.Contains(x.id)).ToListAsync();

            if (listNv.Count <= 0)
                return BadRequest("không tìm thấy bất kì thực phẩm");
            _context.ThucPham.RemoveRange(listNv);
            await _context.SaveChangesAsync();
            return Ok("Xóa thành công");
        }
    }
}
