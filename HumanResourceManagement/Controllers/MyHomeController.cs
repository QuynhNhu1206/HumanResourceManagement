using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HumanResourceManagement.Controllers
{
    public class MyHomeController : Controller
    {
        // GET: MyHome
        private string connectionString = ConfigurationManager.ConnectionStrings["HumanResourceManagementEntities"].ConnectionString;

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
            if (string.IsNullOrEmpty(user) && string.IsNullOrEmpty(pass))
            {
                ViewBag.Message = "Vui lòng nhập Tên đăng nhập và Mật khẩu!";
                return View();
            }

            if (string.IsNullOrEmpty(user))
            {
                ViewBag.Message = "Chưa nhập Tên đăng nhập.";
                return View();
            }

            if (string.IsNullOrWhiteSpace(user))
            {
                ViewBag.Message = "Tên đăng nhập không được nhập ký tự trắng!";
                return View();
            }

            if (string.IsNullOrEmpty(pass))
            {
                ViewBag.Message = "Chưa nhập Mật khẩu.";
                return View();
            }

            string checkResult = ValidateUser(user, pass);

            if (checkResult == "WrongUsername")
            {
                ViewBag.Message = "Nhập sai Tên đăng nhập. Vui lòng nhập lại!";
                return View();
            }

            if (checkResult == "WrongPassword")
            {
                ViewBag.Message = "Nhập sai Mật khẩu. Vui lòng nhập lại!";
                return View();
            }

            if (checkResult == "Success")
            {
                return RedirectToAction("MyHome");
            }

            ViewBag.Message = "Thông tin đăng nhập không hợp lệ. Vui lòng thử lại!";
            return View();
        }

        private string ValidateUser(string username, string password)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    string query = "SELECT MatKhau FROM TaiKhoan WHERE LOWER(TenTaiKhoan) = @TenTaiKhoan";
                    using (SqlCommand command = new SqlCommand(query, conn))
                    {
                        // Truyền tham số tên đăng nhập, đảm bảo không phân biệt chữ hoa/chữ thường
                        command.Parameters.AddWithValue("@TenTaiKhoan", username.ToLower());
                        object dbPassword = command.ExecuteScalar();

                        // Nếu không tìm thấy user
                        if (dbPassword == null)
                        {
                            return "WrongUsername";
                        }

                        // So sánh mật khẩu
                        if (!string.Equals(dbPassword.ToString(), password, StringComparison.Ordinal))
                        {
                            return "WrongPassword";
                        }

                        // Đăng nhập thành công
                        return "Success";
                    }
                }
            }
            catch (SqlException sqlEx)
            {
                // Log the exception details (you can log to a file, database, etc.)
                return "DatabaseError: " + sqlEx.Message;
            }
            catch (Exception ex)
            {
                // Log the general exception details
                return "Error: " + ex.Message;
            }
        }

        public ActionResult UpdateInfo()
        {
            return View();
        }

    }
}