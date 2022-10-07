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
    public class HopDongController : ControllerBase
    {
        private readonly Context _context;
        public HopDongController(Context context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<HopDong>>> GetAll()
        {
            var listhd = await _context.HopDong.Include(x => x.bepTruong).ToListAsync();
            return Ok(listhd);
        }

        [HttpGet("maxid")]
        public async Task<ActionResult<HopDong>> GetidMax()
        {
            var listhd = await _context.HopDong.OrderByDescending(x=>x.id).FirstOrDefaultAsync();
            return Ok(listhd);
        }

        [HttpGet("getByStartDate/{start}")]
        public async Task<ActionResult<IEnumerable<HopDong>>> GetAll(DateTime start)
        {
            start = start.AddHours(-7);
            var listhd = await _context.HopDong.Include(x => x.bepTruong).Where(v=>v.ngayBatDau >= start).ToListAsync();
            listhd.ForEach(item =>
            {
                item.ngayBatDau =  item.ngayBatDau.AddHours(7);
                item.ngayKetThuc = item.ngayKetThuc.AddHours(7);
            });
            return Ok(listhd);
        }


        [HttpPost("searchFilter")]
        public async Task<ActionResult<IEnumerable<HopDong>>> GetAllWithFilter(HDFilter filter)
        {
            var listhd = await _context.HopDong.Include(x => x.bepTruong).ToListAsync();
            if(filter.title != null && filter.title !="")
            {
                listhd= listhd.Where(x => x.tenHopDong.Contains(filter.title)).ToList();
            }
            if(filter.status != -1)
            {
                listhd= listhd.Where(x=>x.trangThai== filter.status).ToList();
            }
            if (filter.statusTT != -1)
            {
                listhd=listhd.Where(x => x.trangThaiThanhToan == filter.statusTT).ToList();
            }

            return Ok(listhd);
        }

        [HttpPost("bydate")]
        public async Task<ActionResult<IEnumerable<HopDong>>> bydate (date date)
        {
            date.startDate = date.startDate.AddDays(1);
            date.endDate = date.endDate.AddDays(1);
            var list = await _context.HopDong.Where(x => x.ngayKetThuc >= date.startDate && x.ngayBatDau <= date.endDate).ToListAsync(); 

            return Ok(list);
        }

        [HttpPost("updateStatusThanhToan")]
        public async Task<ActionResult> updatsytsThanhToan(UpdateStatus update)
        {
            var Listhd = await _context.HopDong.Where(x=>update.ids.Contains(x.id)).ToListAsync();
            for(var i = 0; i < Listhd.Count; i++)
            {
                Listhd[i].trangThaiThanhToan = update.status;
            }
            await _context.SaveChangesAsync();

            return Ok("update thành công");
        }

        [HttpGet("checkTD")]
        public async Task<ActionResult<IEnumerable<HopDong>>> GetAllCheck()
        {
            var listhd = await _context.HopDong.Include(x => x.bepTruong).Where(a=>a.isPhieuMua==0).ToListAsync();
            return Ok(listhd);
        }
        [HttpGet("checkVC")]
        public async Task<ActionResult<IEnumerable<HopDong>>> GetAllCheckVC()
        {
            var listhd = await _context.HopDong.OrderByDescending(x=>x.id).ToListAsync();
            return Ok(listhd);
        }

        [HttpGet("checkPhieuXuat")]
        public async Task<ActionResult<IEnumerable<HopDong>>> GetAllCheckPhieuXuat()
        {
            var listhd = await _context.HopDong.OrderByDescending(x=>x.id).ToListAsync();
            return Ok(listhd);
        }

        [HttpGet("trangthaithanhtoan/{tt}")]
        public async Task<ActionResult<IEnumerable<HopDong>>> GetAllbythanhtoan(int tt)
        {
            var listhd = await _context.HopDong.Include(x => x.bepTruong).Where(a => a.trangThaiThanhToan == tt).ToListAsync();
            return Ok(listhd);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<HopDong>> GetHopDongById(int id)
        {
            var hd = await _context.HopDong.Include(x => x.bepTruong).SingleOrDefaultAsync(x => x.id == id);
            if (hd == null)
                return NotFound();
            return Ok(hd);
        }

        [HttpGet("search/{value}")]
        public async Task<ActionResult<IEnumerable<HopDong>>> Search(string value)
        {
            var hd = await _context.HopDong.Include(x => x.bepTruong).Where(x => x.tenHopDong.Contains(value)).ToListAsync();
            if (hd.Count <= 0)
                hd = await _context.HopDong.Include(x => x.bepTruong).Where(x => x.tenKhachHang.Contains(value)).ToListAsync();
            return Ok(hd);
        }
        
        [HttpPost]
        public async Task<ActionResult<HopDong>> PostHopDong(HopDong hopDong)
        {
            hopDong.bepTruong = null;
            hopDong.isPhieuMua = 0;
            hopDong.isPhieuXuat = 0;
            hopDong.isVanChuyen = 0;
            hopDong.trangThaiThanhToan = 0;
            hopDong.ngayBatDau = hopDong.ngayBatDau.AddHours(-7);
            hopDong.ngayKetThuc = hopDong.ngayKetThuc.AddHours(-7);
            //hopDong.ngayBatDau= hopDong.ngayBatDau.Hours
            _context.HopDong.Add(hopDong);
            await _context.SaveChangesAsync();
            return Ok(hopDong);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult> EditHopDong([FromRoute]int id,[FromBody] HopDong hopDong)
        {
            if (id != hopDong.id)
                return BadRequest("Không trùng id");
            var check = await _context.HopDong.SingleOrDefaultAsync(x => x.id == id);
            if (check == null)
            {
                return BadRequest("Vật tư không tồn tại");
            }
            check.tenHopDong = hopDong.tenHopDong;
            check.maHopDong = hopDong.maHopDong;
            check.diaChi = hopDong.diaChi;
            check.ngayBatDau = hopDong.ngayBatDau;
            check.ngayKetThuc = hopDong.ngayKetThuc;
            check.soDienThoai= hopDong.soDienThoai;
            check.soMam = hopDong.soMam;
            check.tienCoc = hopDong.tienCoc;
            check.soMamPhatSinh = hopDong.soMamPhatSinh;
            check.trangThaiThanhToan = hopDong.trangThaiThanhToan;
            check.trangThai = hopDong.trangThai;
            check.suDungBanGhe = hopDong.suDungBanGhe;
            check.tenKhachHang = hopDong.tenKhachHang;
            check.idBeptruong = hopDong.idBeptruong;
            await _context.SaveChangesAsync();
            return Ok("Sửa thành công");
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteHopdong(int id)
        {
            var hd = await _context.HopDong.SingleOrDefaultAsync(x => x.id == id);
            if (hd == null)
                return BadRequest("Xóa không thành công");
            _context.HopDong.Remove(hd);
            await _context.SaveChangesAsync();
            return Ok("Xóa thành công");
        }
        [HttpDelete("list")]
        public async Task<ActionResult> DeleteList([FromBody]List<int> ids)
        {
            var listNv = await _context.HopDong.Where(x => ids.Contains(x.id)).ToListAsync();

            if (listNv.Count <= 0)
                return BadRequest("không tìm thấy bất kì nhân viên");
            _context.HopDong.RemoveRange(listNv);
            await _context.SaveChangesAsync();
            return Ok("Xóa thành công");
        }

        [HttpGet("{idHopDong}/phatSinh/{soMam}")]
        public async Task<ActionResult<HopDong>> PhatSinh(int idHopDong, int soMam)
        {
            var hd = await _context.HopDong.SingleOrDefaultAsync(a => a.id == idHopDong);
            if (hd == null)
                return BadRequest("Không tìm thấy đơn cỗ");
            hd.soMamPhatSinh += soMam;
            await _context.SaveChangesAsync();
            return Ok(hd);
        }
    }
}
