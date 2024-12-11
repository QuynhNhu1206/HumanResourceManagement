using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HumanResourceManagement.Controllers
{
    public class AdminController : BaseController
    {
        // GET: Admin
        public ActionResult _LayoutAdmin()
        {
            return View();
        }
    }
}