using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace HumanResourceManagement.Controllers
{
    public class BaseController : Controller
    {
        private string connectionString = ConfigurationManager.ConnectionStrings["HumanResourceManagementEntities"].ConnectionString;

        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            string userName = (string)filterContext.HttpContext.Session["User"];

            if (string.IsNullOrEmpty(userName))
            {

                return;
            }

            string query = "SELECT HoTen FROM NhanVien WHERE TenTaiKhoan = @TenTaiKhoan";
            string userFullName = string.Empty;

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();

                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.Add("@TenTaiKhoan", System.Data.SqlDbType.NVarChar).Value = userName;

                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            if (reader.HasRows)
                            {
                                while (reader.Read())
                                {
                                    userFullName = reader["HoTen"].ToString();
                                }
                            }
                        }
                    }
                }
            }
            catch (SqlException sqlEx)
            {
                ViewBag.ErrorMessage = "Lỗi truy vấn: " + sqlEx.Message;
                base.OnActionExecuting(filterContext);
                return;
            }
            catch (Exception ex)
            {
                ViewBag.ErrorMessage = "Lỗi hệ thống: " + ex.Message;
                base.OnActionExecuting(filterContext);
                return;
            }
            

            ViewBag.UserName = string.IsNullOrEmpty(userFullName) ? "Tên không được cung cấp" : userFullName;
            if (!string.IsNullOrEmpty(userFullName))
            {
                var nameParts = userFullName.Split(' ');
                if (nameParts.Length > 1)
                {
                    
                    ViewBag.ShortName = string.Join(" ", nameParts.Skip(1).Take(2));
                }
                else
                {
                    ViewBag.ShortName = userFullName;
                }
            }

            base.OnActionExecuting(filterContext);
        }

    }
}