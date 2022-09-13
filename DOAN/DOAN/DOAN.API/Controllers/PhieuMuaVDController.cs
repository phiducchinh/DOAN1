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
    public class PhieuMuaVDController : ControllerBase
    {
        private readonly Context _context;
        public PhieuMuaVDController(Context context)
        {
            _context = context;
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<PMVatDung>> Getbyid(int id)
        {
            var list = await _context.PMVatDung.SingleOrDefaultAsync(y => y.id == id);
            return Ok(list);
        }
        [HttpGet("getnewid")]
        public async Task<ActionResult<PMVatDung>> getnewId()
        {
            PMVatDung list = new PMVatDung();
            list = await _context.PMVatDung.OrderByDescending(x => x.id).FirstOrDefaultAsync();
            return Ok(list);
        }
        [HttpGet("max")]
        public async Task<ActionResult<PMVatDung>> GetIdMax()
        {
            var list = await _context.PMVatDung.OrderByDescending(x=>x.id).FirstOrDefaultAsync();
            return Ok(list);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PMVatDung>>> GetAll()
        {
            var list = await _context.PMVatDung.OrderByDescending(x=>x.id).ToListAsync();
            return Ok(list);
        }

        [HttpGet("check")]
        public async Task<ActionResult<IEnumerable<PMVatDung>>> GetAllCheck()
        {
            var list = await _context.PMVatDung.OrderByDescending(x => x.id).Where(x=>x.isCheck==0).ToListAsync();
            return Ok(list);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<PMVatDung>> Delete(int id)
        {
            var list = await _context.PMVatDung.SingleOrDefaultAsync(x=>x.id==id);
            if (list != null)
            {
                _context.PMVatDung.Remove(list);
                await _context.SaveChangesAsync();
                return Ok(list);
            }
            else
                return BadRequest("Xóa thất bại");
        }

        [HttpPost]
        public async Task<ActionResult<PMVatDung>> AddPhieuNhap(PMVatDung PhieuNhap)
        {
            var pm = await _context.PMVatDung.SingleOrDefaultAsync(x => x.maPhieu== PhieuNhap.maPhieu);
            if (pm != null)
            {
                return Ok(pm);
            }
            try
            {
                PhieuNhap.isCheck = 0;
                await _context.PMVatDung.AddAsync(PhieuNhap);
                await _context.SaveChangesAsync();
            }
            catch 
            {
                return BadRequest("Thêm lỗi");
            }
            return Ok(PhieuNhap);
            
        }


    }
}
