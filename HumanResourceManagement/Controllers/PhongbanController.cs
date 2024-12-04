using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HumanResourceManagement.Data;
using HumanResourceManagement.Models;

namespace HumanResourceManagement.Controllers
{
    public class PhongbanController : Controller
    {

        public ActionResult Phongban()
        {
            var db = new HumanResourceManagementEntities1();
            var phongBans = db.PhongBans.ToList();

            var viewModel = new PhongBanViewModel
            {
                DanhSachPhongBan = phongBans
            };

            return View(viewModel);
        }

        [HttpPost]
        public ActionResult Phongban(PhongBanViewModel viewModel)
        {
            if (ModelState.IsValid)
            {
                using (var db = new HumanResourceManagementEntities1())
                {
                    db.PhongBans.Add(viewModel.PhongBanMoi);
                    db.SaveChanges();
                }
                return RedirectToAction("Phongban");
            }

            return View(viewModel);
        }
        public ActionResult CapNhat(string id)
        {
            using (var db = new HumanResourceManagementEntities1())
            {
                // Tìm phòng ban cần cập nhật theo ID
                var phongBan = db.PhongBans.FirstOrDefault(p => p.MaPhongBan == id);
                if (phongBan == null)
                {
                    return HttpNotFound(); // Nếu không tìm thấy, trả về lỗi 404
                }

                // Tạo ViewModel và gửi sang View
                var viewModel = new PhongBanViewModel
                {
                    PhongBanMoi = phongBan
                };
                return View(viewModel);
            }
        }

        // Action POST: Cập nhật thông tin phòng ban
        [HttpPost]
        public ActionResult CapNhat(PhongBanViewModel viewModel)
        {
            if (ModelState.IsValid)
            {
                using (var db = new HumanResourceManagementEntities1())
                {
                    // Tìm phòng ban cần cập nhật
                    var phongBan = db.PhongBans.FirstOrDefault(p => p.MaPhongBan == viewModel.PhongBanMoi.MaPhongBan);
                    if (phongBan != null)
                    {
                        // Cập nhật thông tin
                        phongBan.TenPhongBan = viewModel.PhongBanMoi.TenPhongBan;
                        phongBan.SoLuongNhanVien = viewModel.PhongBanMoi.SoLuongNhanVien;
                        phongBan.MoTa = viewModel.PhongBanMoi.MoTa;

                        // Lưu thay đổi vào CSDL
                        db.SaveChanges();
                        return RedirectToAction("Phongban");
                    }
                }
            }

            return View(viewModel);
        }
    }
}