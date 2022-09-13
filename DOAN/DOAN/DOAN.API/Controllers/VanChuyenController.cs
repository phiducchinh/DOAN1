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
    public class VanChuyenController : ControllerBase
    {
        private readonly Context _context;
        public VanChuyenController(Context context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<VanChuyen>>> GetAll()
        {
            var list = await _context.VanChuyen.Include(z => z.hopDong).ToListAsync();
            return Ok(list);
        }
        [HttpGet("getnewid")]
        public async Task<ActionResult<VanChuyen>> GetIdNgoai()
        {
            VanChuyen vanChuyen = new VanChuyen();
            vanChuyen = await _context.VanChuyen.OrderByDescending(a => a.id).FirstOrDefaultAsync(x => x.idHopDong == null);
            if (vanChuyen != null)
            {
                return (vanChuyen);
            }
            else { 
                return Ok(vanChuyen);
            }
        }
        [HttpGet("trangthai/{tt}")]
        public async Task<ActionResult<IEnumerable<VanChuyen>>> GetAllByTrangThai(int tt)
        {
            var list = await _context.VanChuyen.Include(z => z.hopDong).Where(x=>x.trangThai==tt).ToListAsync();
            return Ok(list);
        }

        [HttpGet("Checkxuat")]
        public async Task<ActionResult<IEnumerable<VanChuyen>>> GetAllBycheckXuat()
        {
            var phieuXuat = await _context.PhieuXuatVD.Where(x => x.isCheck == 1).ToListAsync();
            List<int> ids = new List<int>();
            phieuXuat.ForEach(item =>
            {
                ids.Add(item.idVanChuyen);
            });
            var list = await _context.VanChuyen.Include(z => z.hopDong).Where(x => x.trangThai == 1 || x.trangThai==2 && !ids.Contains(x.id)).ToListAsync();
            return Ok(list);
        }

        [HttpGet("phieuXuat")]
        public async Task<ActionResult<IEnumerable<VanChuyen>>> GetAllPhieuXuat()
        {
            var list = await _context.VanChuyen.Include(z => z.hopDong).Where(x=>x.trangThai==2 || x.trangThai==4).ToListAsync();
            return Ok(list);
        }

        [HttpGet("phieuNhap")]
        public async Task<ActionResult<IEnumerable<VanChuyen>>> GetAllPhieuNhap()
        {
            var list = await _context.VanChuyen.Include(z => z.hopDong).Where(x => x.trangThai == 4).ToListAsync();
            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<VanChuyen>> GetById(int id)
        {
            var list = await _context.VanChuyen.Include(z => z.hopDong).SingleOrDefaultAsync(a => a.id == id);
            return Ok(list);
        }
        [HttpGet("VanChuyen/{idHopDong}")]
        public async Task<ActionResult<VanChuyen>> GetByIdHopDong(int idHopDong)
        {
            var list = await _context.VanChuyen.Include(z => z.hopDong).SingleOrDefaultAsync(a => a.idHopDong == idHopDong);
            return Ok(list);
        }

        [HttpPost]
        public async Task<ActionResult<VanChuyen>> PostVanChuyen(VanChuyen vanChuyen)
        {
            var hp = await _context.HopDong.SingleOrDefaultAsync(x => x.id == vanChuyen.idHopDong);
            if (hp != null)
            {
                if (hp.trangThai == 2|| hp.trangThai == 1 && hp.isVanChuyen == 0)
                {
                    hp.isVanChuyen = 1;
                    hp.trangThai = 3;
                    vanChuyen.hopDong = null;
                    _context.VanChuyen.Add(vanChuyen);
                    await _context.SaveChangesAsync();
                    return Ok(vanChuyen);
                }
                return BadRequest("Không thể tạo đơn vận chuyển");
            }
            else
            {
                vanChuyen.hopDong = null;
                _context.VanChuyen.Add(vanChuyen);
                await _context.SaveChangesAsync();
                return Ok(vanChuyen);
            }
        }

        [HttpGet("updateStatus/{ids}/{status}")]
        public async Task<ActionResult<VanChuyen>> updateStatus(int ids, int status)
        {
            var vc = await _context.VanChuyen.SingleOrDefaultAsync(x => x.id == ids);
            if (status == 2)
            {
                if (vc != null && vc.trangThai==1)
                {
                    vc.trangThai = status;
                    UpDateVatDungTru(ids);
                }
            }
            else
            {
                var hd = await _context.HopDong.SingleOrDefaultAsync(x => x.id == vc.idHopDong);
                //if (sts == 3)
                //{
                //    if (vc != null)
                //    {
                //        vc.trangThai = sts;
                //        vc.soMamDaDon = soMamDon;
                //        UpDateVatDungCongTiep(ids,soMamDon,hd.soMam);
                //    }
                //}else 
                if (status == 4 && vc.trangThai == 2)
                {
                    if (vc != null)
                    {
                        vc.trangThai = status;
                        UpDateVatDungCong(ids);
                    }
                }
            }
            await _context.SaveChangesAsync();
            return Ok(vc);
        }

        private void UpDateVatDungTru(int id)
        {
            var listVD =  _context.ChiTietVanChuyen.Where(x => x.idVanChuyen == id).ToList();
            var listALLVD =  _context.VatTu.ToList();
            for(int i=0;i < listVD.Count; i++)
            {
                for(int j = 0; j < listALLVD.Count; j++)
                {
                    if (listVD[i].idVatTu== listALLVD[j].id)
                    {
                        listALLVD[j].soLuongConLai = listALLVD[j].soLuongConLai - listVD[i].soLuong;
                    }
                }  
            }
            _context.SaveChanges();

        }
        private void UpDateVatDungCongTiep(int id, int soMamDon, int tongMam)
        {
            var tiSo = soMamDon / tongMam;
            var listVD = _context.ChiTietVanChuyen.Where(x => x.idVanChuyen == id).ToList();
            var listALLVD = _context.VatTu.ToList();
            for (int i = 0; i < listVD.Count; i++)
            {
                for (int j = 0; j < listALLVD.Count; j++)
                {
                    if (listVD[i].idVatTu == listALLVD[j].id)
                    {
                        listALLVD[j].soLuongConLai = listALLVD[j].soLuongConLai + listVD[i].soLuong;
                    }
                }
            }
            _context.SaveChanges();

        }

        private void UpDateVatDungCong(int id)
        {
            var listVD = _context.ChiTietVanChuyen.Where(x => x.idVanChuyen == id).ToList();
            var listALLVD = _context.VatTu.ToList();
            for (int i = 0; i < listVD.Count; i++)
            {
                for (int j = 0; j < listALLVD.Count; j++)
                {
                    if (listVD[i].idVatTu == listALLVD[j].id)
                    {
                        listALLVD[j].soLuongConLai = listALLVD[j].soLuongConLai + listVD[i].soLuong;
                    }
                }
            }
            _context.SaveChanges();

        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Edit(int id, VanChuyen vanChuyen)
        {
            if (id != vanChuyen.id)
                return BadRequest("Không trùng id");
            var td = await _context.VanChuyen.SingleOrDefaultAsync(x => x.id == id);
            if (td == null)
                return BadRequest("Không tìm thấy món ăn trong thực đơn này");
            if (vanChuyen.idHopDong != null)
                td.idHopDong = vanChuyen.idHopDong;
            td.trangThai = vanChuyen.trangThai;
            td.ngayDon = vanChuyen.ngayDon;
            await _context.SaveChangesAsync();
            return Ok("Sửa thành công");
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var td = await _context.VanChuyen.SingleOrDefaultAsync(x => x.id == id);
            if (td == null)
                return BadRequest("Không tìm thấy món ăn");
            _context.VanChuyen.Remove(td);
            await _context.SaveChangesAsync();
            return Ok("Xóa thành công");
        }
        

        [HttpDelete("list")]
        public async Task<ActionResult> DeleteList(List<int> ids)
        {
            var listNv = await _context.VanChuyen.Where(x => ids.Contains(x.id)).ToListAsync();

            if (listNv.Count <= 0)
                return BadRequest("không tìm thấy bất kì món ăn nào");
            _context.VanChuyen.RemoveRange(listNv);
            await _context.SaveChangesAsync();
            return Ok("Xóa thành công");
        }
    }
}
