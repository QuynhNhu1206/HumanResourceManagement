using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using HumanResourceManagement.App_Data;

namespace HumanResourceManagement.Controllers
{
    public class MyHomeController : Controller
    {
        // GET: MyHome
        public ActionResult MyHome()
        {
            if (Session["user"] == null)
            {
               return RedirectToAction("Login");
            } else
            {
                return View();

            }
        }
        public ActionResult Login()
        {
            return View();
        }
        [HttpPost]
        public ActionResult Login(string user, string pass)
        {
            HumanResourceManagementEntities db = new HumanResourceManagementEntities();
            var TaiKhoan = db.TaiKhoans.SingleOrDefault(m=>m.TenTaiKhoan.ToLower() == user.ToLower()&& m.MatKhau == pass);
            if(TaiKhoan != null)
            {
                Session["user"] = TaiKhoan;
               
                return RedirectToAction("MyHome");
            }
            else
            {
                TempData["error"] = "Tên tài khoản hoặc mật khẩu không chính xác";
                return View();

            }
            //if (user == "admin" && pass == "admin") {
            //    Session["user"] = "admin";
            //    return RedirectToAction("MyHome");
            //}
            //else
            //{
            //    TempData["error"] = "Tên tài khoản hoặc mật khẩu không chính xác";
            //    return View();

            //}
        }
        public ActionResult Logout()
        {
            Session.Remove("user");
            FormsAuthentication.SignOut();
            return RedirectToAction("Login");

        }
        public ActionResult UpdateInfo()
        {
            return View();
        }

    }
}