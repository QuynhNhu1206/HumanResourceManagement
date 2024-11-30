using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HumanResourceManagement.Controllers
{
    public class MyHomeController : Controller
    {
        // GET: MyHome
        public ActionResult MyHome()
        {
            return View();
        }
        public ActionResult Login()
        {
            return View();
        }
        [HttpPost]
        public ActionResult Login(string user, string pass)
        {
            if(user == "admin" && pass == "admin") {
                return RedirectToAction("MyHome");
            }
            return View();
        }
    }
}