using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace HumanResourceManagement
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "login",
                url: "login",  
                defaults: new { controller = "MyHome", action = "Login" }  
            );
            routes.MapRoute(
                name: "updateinfo",
                url: "updateinfo",
                defaults: new { controller = "MyHome", action = "UpdateInfo" }
            );

            routes.MapRoute(
               name: "nhanvien",
               url: "nhanvien",  // URL /login sẽ khớp với route này
               defaults: new { controller = "Nhanvien", action = "Nhanvien" }
           );
           

        }
    }
}
