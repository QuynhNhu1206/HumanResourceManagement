using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HumanResourceManagement.Data;
using HumanResourceManagement.Models;

namespace HumanResourceManagement.Controllers
{
    public class NhanvienController : Controller
    {
        // GET: Nhanvien
        public ActionResult NhanVien()
        {
            HumanResourceManagementEntities1 db = new HumanResourceManagementEntities1();

            // Lấy danh sách Phòng ban, Chức vụ và Trình độ
            var phongBans = db.PhongBans.ToList();
            var trinhDos = db.TrinhDoes.ToList();
            var chucVus = db.ChucVus.ToList();

            // Tạo ViewModel với danh sách nhân viên và các danh sách chọn (Phòng ban, Chức vụ, Trình độ)
            var viewModel = new NhanVienViewModel
            {
                DanhSachNhanVien = db.NhanViens.ToList(),
                PhongBanList = new SelectList(phongBans, "MaPhongBan", "TenPhongBan"),
                ChucVuList = new SelectList(chucVus, "MaChucVu", "TenChucVu"),
                TrinhDoList = new SelectList(trinhDos, "MaTrinhDo", "TenTrinhDo"),
                NhanVienMoi = new NhanVien(), // Sử dụng cho Form thêm mới
                NhanVienUpdate = null // Khởi tạo rỗng cho cập nhật
            };

            return View(viewModel);
        }
        [HttpPost]
        public ActionResult AddNhanVien(NhanVienViewModel viewModel)
        {
            using (var db = new HumanResourceManagementEntities1())
            {
                if (ModelState.IsValid)
                {
                    db.NhanViens.Add(viewModel.NhanVienMoi);
                    db.SaveChanges();

                    TempData["Message"] = "Thêm nhân viên thành công!";
                }
                else
                {
                    TempData["Error"] = "Dữ liệu không hợp lệ, vui lòng kiểm tra lại.";
                }

                return RedirectToAction("NhanVien");
            }
        }
      
        

            [HttpPost]
        public ActionResult UpdateNhanVien(NhanVienViewModel viewModel)
        {
         
            using (var db = new HumanResourceManagementEntities1())
            {
                if (ModelState.IsValid && viewModel.NhanVienUpdate != null)
                {
                    var existingNhanVien = db.NhanViens.Find(viewModel.NhanVienUpdate.MaNhanVien);
                    if (existingNhanVien != null)
                    {
                        existingNhanVien.HoTen = viewModel.NhanVienUpdate.HoTen;
                        existingNhanVien.MaPhongBan = viewModel.NhanVienUpdate.MaPhongBan;
                        existingNhanVien.MaChucVu = viewModel.NhanVienUpdate.MaChucVu;
                        existingNhanVien.MaTrinhDo = viewModel.NhanVienUpdate.MaTrinhDo;
                        existingNhanVien.CCCD = viewModel.NhanVienUpdate.CCCD;
                        existingNhanVien.NgaySinh = viewModel.NhanVienUpdate.NgaySinh;
                        existingNhanVien.GioiTinh = viewModel.NhanVienUpdate.GioiTinh;
                        existingNhanVien.DiaChi = viewModel.NhanVienUpdate.DiaChi;
                        existingNhanVien.Email = viewModel.NhanVienUpdate.Email;
                        existingNhanVien.SoDienThoai = viewModel.NhanVienUpdate.SoDienThoai;
                        existingNhanVien.NgayBatDauLam = viewModel.NhanVienUpdate.NgayBatDauLam;
                        existingNhanVien.TenTaiKhoan = viewModel.NhanVienUpdate.TenTaiKhoan;

                        db.SaveChanges();
                        TempData["Message"] = "Cập nhật nhân viên thành công!";
                    }
                    else
                    {
                        TempData["Error"] = "Không tìm thấy nhân viên để cập nhật.";
                    }
                }
                else
                {
                    TempData["Error"] = "Dữ liệu không hợp lệ, vui lòng kiểm tra lại.";
                }

                return RedirectToAction("NhanVien");
            }
        }

        [HttpPost]
        public ActionResult NhanVien(NhanVienViewModel viewModel)
        {
            using (var db = new HumanResourceManagementEntities1())
            {
                if (ModelState.IsValid)
                {
                    // Thêm nhân viên mới vào cơ sở dữ liệu
                    db.NhanViens.Add(viewModel.NhanVienMoi);
                    db.SaveChanges();
                }

                // Cập nhật lại danh sách nhân viên
                viewModel.DanhSachNhanVien = db.NhanViens.ToList();
                viewModel.NhanVienMoi = new NhanVien(); // Reset form thêm mới
                return View(viewModel);
            }
        }
    }
}
