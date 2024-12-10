using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using HumanResourceManagement.App_Data;

namespace HumanResourceManagement.Controllers
{
    public class PhongbanController : Controller
    {
        HumanResourceManagementEntities db = new HumanResourceManagementEntities();
        public ActionResult Phongban()
        {
            List<PhongBan> danhsachPB = db.PhongBans.ToList();
            return View(danhsachPB); // Truyền danh sách phòng ban đến view
        }
        public ActionResult Themmoi()
        {
            return View();
        }
        [HttpPost]
         public ActionResult Themmoi(PhongBan model)
        {
            if (ModelState.IsValid)
            {
                db.PhongBans.Add(model); // Thêm dữ liệu vào cơ sở dữ liệu
                db.SaveChanges(); // Lưu thay đổi vào cơ sở dữ liệu
                return RedirectToAction("Phongban"); // Quay lại trang danh sách phòng ban
                
            }

            return View(model); // Nếu có lỗi, hiển thị lại form và thông báo lỗi
        }
        public ActionResult Capnhat(string MaPhongBan)
        {
            //PhongBan model = db.PhongBans.SingleOrDefault(m => m.MaPhongBan == MaPhongBan); 
            PhongBan model = db.PhongBans.Find(MaPhongBan);
            return View(model);
        }
        [HttpPost]
        public ActionResult Capnhat(PhongBan model)
        {
            var updateModel = db.PhongBans.Find(model.MaPhongBan);
            updateModel.MaPhongBan = model.MaPhongBan;
            updateModel.TenPhongBan = model.TenPhongBan;
            updateModel.SoLuongNhanVien = model.SoLuongNhanVien;
            updateModel.MoTa = model.MoTa;
            db.SaveChanges();
            return RedirectToAction("Phongban");
        }
        //public ActionResult Xoa(string MaPhongBan)
        //{
        //    var updateModel = db.PhongBans.Find(MaPhongBan);
        //    db.PhongBans.Remove(updateModel);
        //    db.SaveChanges();
        //    return RedirectToAction("Phongban");

        //}
        [HttpPost]
        public JsonResult Xoa(string MaPhongBan)
        {
            if (string.IsNullOrEmpty(MaPhongBan))
            {
                return Json(new { success = false, message = "Mã phòng ban không hợp lệ." });
            }

            var phongBanToDelete = db.PhongBans.Find(MaPhongBan);
            if (phongBanToDelete == null)
            {
                return Json(new { success = false, message = "Không tìm thấy phòng ban." });
            }

            try
            {
                db.PhongBans.Remove(phongBanToDelete);
                db.SaveChanges();
                return Json(new { success = true, message = "Xóa phòng ban thành công." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
    }
}
