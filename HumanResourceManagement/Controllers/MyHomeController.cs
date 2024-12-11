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

        public ActionResult UpdateInfo()
        {

            string username = Session["User"] as string;


            if (string.IsNullOrEmpty(username))
            {
                ViewBag.Message = "Vui lòng đăng nhập trước khi cập nhật thông tin.";
                return RedirectToAction("Login");
            }


            try
            {
                NhanVienModels model = GetUserInfo(username);
                if (model != null)
                {
                    

                    return View(model);
                }
                else
                {
                    ViewBag.Message = "Không tìm thấy thông tin người dùng.";
                    return View();
                }
            }
            catch (Exception ex)
            {
                ViewBag.Message = "Lỗi khi tải thông tin người dùng: " + ex.Message;
                return View();
            }
        }

        
        [HttpGet]
        private NhanVienModels GetUserInfo(string username)
        {

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                string query = @"
            SELECT nv.MaNhanVien, nv.HoTen, nv.CCCD, nv.MaPhongBan, pb.TenPhongBan, 
                   nv.DiaChi, nv.NgaySinh, nv.GioiTinh, nv.SoDienThoai, nv.DanToc, 
                   nv.NgayBatDauLam, nv.MaChucVu, cv.TenChucVu, nv.Email, nv.HinhAnh, nv.MaTrinhDo, td.TenTrinhDo
            FROM NhanVien nv
            LEFT JOIN PhongBan pb ON nv.MaPhongBan = pb.MaPhongBan
            LEFT JOIN ChucVu cv ON nv.MaChucVu = cv.MaChucVu
            LEFT JOIN TrinhDo td ON nv.MaChucVu = td.MaTrinhDo
            WHERE nv.TenTaiKhoan = @TenTaiKhoan";

                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@TenTaiKhoan", username);

                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    NhanVienModels model = new NhanVienModels
                    {
                        MaNhanVien = reader["MaNhanVien"].ToString(),
                        HoTen = reader["HoTen"].ToString(),
                        CCCD = reader["CCCD"].ToString(),
                        MaPhongBan = reader["MaPhongBan"].ToString(),
                        TenPhongBan = reader["TenPhongBan"].ToString(),
                        DiaChi = reader["DiaChi"].ToString(),
                        NgaySinh = reader["NgaySinh"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["NgaySinh"]),
                        GioiTinh = reader["GioiTinh"].ToString(),
                        SoDienThoai = reader["SoDienThoai"].ToString(),
                        DanToc = reader["DanToc"].ToString(),
                        NgayBatDauLam = reader["NgayBatDauLam"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["NgayBatDauLam"]),
                        MaChucVu = reader["MaChucVu"].ToString(),
                        TenChucVu = reader["TenChucVu"].ToString(),
                        MaTrinhDo = reader["MaTrinhDo"].ToString(),
                        TenTrinhDo = reader["TenTrinhDo"].ToString(),
                        Email = reader["Email"].ToString(),
                        HinhAnh = reader["HinhAnh"].ToString()
                    };
                    return model;
                }
                else
                {
                    return null;
                }
            }
        }


        [HttpPost]
        public ActionResult UpdateInfo(NhanVienModels model, HttpPostedFileBase uploadedImage)
        {
            string username = Session["User"] as string;

            // Kiểm tra nếu người dùng chưa đăng nhập
            if (string.IsNullOrEmpty(username))
            {
                ViewBag.Message = "Vui lòng đăng nhập trước khi cập nhật thông tin.";
                return RedirectToAction("Login");
            }

            if (ModelState.IsValid)
            {
                try
                {

                    if (uploadedImage != null && uploadedImage.ContentLength > 0)
                    {

                        string[] allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif" };
                        string fileExtension = Path.GetExtension(uploadedImage.FileName).ToLower();

                        if (!allowedExtensions.Contains(fileExtension))
                        {
                            TempData["Message"] = "Vui lòng tải lên tệp hình ảnh hợp lệ.";
                            return View(model);
                        }


                        if (uploadedImage.ContentLength > 5 * 1024 * 1024)
                        {
                            ViewBag.Message = "Kích thước tệp hình ảnh vượt quá giới hạn cho phép (5MB).";
                            return View(model);
                        }


                        string fileName = Path.GetFileName(uploadedImage.FileName);
                        string path = Path.Combine(Server.MapPath("~/Content/img/EmployeeImages/"), fileName);


                        if (System.IO.File.Exists(path))
                        {
                            string timestamp = DateTime.Now.ToString("yyyyMMddHHmmss");
                            fileName = timestamp + "_" + fileName;
                            path = Path.Combine(Server.MapPath("~/Content/img/EmployeeImages/"), fileName);
                        }

                        
                        uploadedImage.SaveAs(path);


                        model.HinhAnh = "~/Content/img/EmployeeImages/" + fileName;
                    }
                    else
                    {

                        if (string.IsNullOrEmpty(model.HinhAnh))
                        {
                            model.HinhAnh = "~/Content/img/default-avt.jpg";
                        }
                    }



                    // Tiến hành lưu thông tin vào database
                    using (SqlConnection conn = new SqlConnection(connectionString))
                    {
                        conn.Open();
                        string query = @"
                    UPDATE NhanVien 
                    SET HoTen = @HoTen, CCCD = @CCCD, MaPhongBan = @MaPhongBan, DiaChi = @DiaChi, 
                        NgaySinh = @NgaySinh, GioiTinh = @GioiTinh, SoDienThoai = @SoDienThoai, 
                        DanToc = @DanToc, NgayBatDauLam = @NgayBatDauLam, MaChucVu = @MaChucVu, 
                        Email = @Email, HinhAnh = @HinhAnh, MaTrinhDo = @MaTrinhDo
                    WHERE MaNhanVien = @MaNhanVien";

                        SqlCommand cmd = new SqlCommand(query, conn);
                        cmd.Parameters.AddWithValue("@MaNhanVien", model.MaNhanVien);
                        cmd.Parameters.AddWithValue("@HoTen", model.HoTen ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@CCCD", model.CCCD ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@MaPhongBan", model.MaPhongBan ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@DiaChi", model.DiaChi ?? (object)DBNull.Value);

                        if (model.NgaySinh == DateTime.MinValue || model.NgaySinh < new DateTime(1753, 1, 1))
                        {
                            cmd.Parameters.AddWithValue("@NgaySinh", DBNull.Value);
                        }
                        else
                        {
                            cmd.Parameters.AddWithValue("@NgaySinh", model.NgaySinh);
                        }

                        cmd.Parameters.AddWithValue("@GioiTinh", model.GioiTinh ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@SoDienThoai", model.SoDienThoai ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@DanToc", model.DanToc ?? (object)DBNull.Value);

                        if (model.NgayBatDauLam == DateTime.MinValue || model.NgayBatDauLam < new DateTime(1753, 1, 1))
                        {
                            cmd.Parameters.AddWithValue("@NgayBatDauLam", DBNull.Value);
                        }
                        else
                        {
                            cmd.Parameters.AddWithValue("@NgayBatDauLam", model.NgayBatDauLam);
                        }

                        cmd.Parameters.AddWithValue("@MaChucVu", model.MaChucVu ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@Email", model.Email ?? (object)DBNull.Value);

                        if (!string.IsNullOrEmpty(model.HinhAnh))
                        {
                            cmd.Parameters.AddWithValue("@HinhAnh", model.HinhAnh);
                        }
                        else
                        {
                            cmd.Parameters.AddWithValue("@HinhAnh", DBNull.Value);
                        }

                        cmd.Parameters.AddWithValue("@MaTrinhDo", model.MaTrinhDo ?? (object)DBNull.Value);

                        cmd.ExecuteNonQuery();
                    }

                    TempData["Message"] = "Cập nhật thông tin thành công";
                    return RedirectToAction("UpdateInfo");
                }
                catch (Exception ex)
                {
                    TempData["Message"] = "Lỗi khi cập nhật thông tin: " + ex.Message;
                    return View(model);
                }
            }

            // Nếu model không hợp lệ, trả lại form cùng thông báo lỗi
            TempData["Message"] = "Vui lòng kiểm tra lại thông tin nhập vào.";
            return View(model);
        }




    }
}