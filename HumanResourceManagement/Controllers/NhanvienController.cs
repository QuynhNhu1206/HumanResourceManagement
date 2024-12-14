
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Data.Entity;
using HumanResourceManagement.App_Data;
using HumanResourceManagement.Models;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;

namespace HumanResourceManagement.Controllers
{
    public class NhanvienController : BaseController
    {
        private string connectionString = ConfigurationManager.ConnectionStrings["HumanResourceManagementEntities"].ConnectionString;

        // GET: Nhanvien
        public ActionResult NhanVien()
        {
            return View();
        }
        public JsonResult GetNhanVien()
        {
            List<NhanVienModels> employees = new List<NhanVienModels>();

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();

                    string query = @"
                        SELECT nv.MaNhanVien, nv.HoTen, pb.TenPhongBan, cv.TenChucVu, nv.TinhTrang
                        FROM NhanVien nv
                        JOIN PhongBan pb ON nv.MaPhongBan = pb.MaPhongBan
                        JOIN ChucVu cv ON nv.MaChucVu = cv.MaChucVu;";


                    SqlCommand cmd = new SqlCommand(query, conn);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            employees.Add(new NhanVienModels
                            {
                                MaNhanVien = reader["MaNhanVien"].ToString(),
                                HoTen = reader["HoTen"].ToString(),
                                TenPhongBan = reader["TenPhongBan"].ToString(),
                                TenChucVu = reader["TenChucVu"].ToString(),
                                TinhTrang = reader["TinhTrang"].ToString()
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet); // In lỗi nếu có
            }

            return Json(employees, JsonRequestBehavior.AllowGet);
        }


        [HttpGet]
        public JsonResult GetEmployee(string employeeId)
        {
            var employee = new
            {
                MaNhanVien = "",
                HoTen = "",
                CCCD = "",
                MaPhongBan = "",
                TenPhongBan = "",
                NgaySinh = "",
                GioiTinh = "",
                DiaChi = "",
                SoDienThoai = "",
                DanToc = "",
                NgayBatDauLam = "",
                MaTrinhDo = "",
                TenTrinhDo = "",
                MaChucVu = "",
                TenChucVu = "",
                Email = "",
                TinhTrang = ""
            };

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();

                    string query = @"
                    SELECT 
                        nv.MaNhanVien, nv.HoTen, nv.CCCD, nv.MaPhongBan, pb.TenPhongBan,
                        nv.NgaySinh, nv.GioiTinh, nv.DiaChi, nv.SoDienThoai, nv.DanToc,
                        nv.NgayBatDauLam, nv.MaTrinhDo, td.TenTrinhDo, nv.MaChucVu, 
                        cv.TenChucVu, nv.Email, nv.TinhTrang
                    FROM NhanVien nv
                    JOIN PhongBan pb ON nv.MaPhongBan = pb.MaPhongBan
                    JOIN ChucVu cv ON nv.MaChucVu = cv.MaChucVu
                    JOIN TrinhDo td ON nv.MaTrinhDo = td.MaTrinhDo
                    WHERE nv.MaNhanVien = @MaNhanVien";

                    SqlCommand cmd = new SqlCommand(query, conn);
                    cmd.Parameters.AddWithValue("@MaNhanVien", employeeId);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            employee = new
                            {
                                MaNhanVien = reader["MaNhanVien"].ToString(),
                                HoTen = reader["HoTen"].ToString(),
                                CCCD = reader["CCCD"].ToString(),
                                MaPhongBan = reader["MaPhongBan"].ToString(),
                                TenPhongBan = reader["TenPhongBan"].ToString(),
                                NgaySinh = DateTime.Parse(reader["NgaySinh"].ToString()).ToString("yyyy-MM-dd"),
                                GioiTinh = reader["GioiTinh"].ToString(),
                                DiaChi = reader["DiaChi"].ToString(),
                                SoDienThoai = reader["SoDienThoai"].ToString(),
                                DanToc = reader["DanToc"].ToString(),
                                NgayBatDauLam = DateTime.Parse(reader["NgayBatDauLam"].ToString()).ToString("yyyy-MM-dd"),
                                MaTrinhDo = reader["MaTrinhDo"].ToString(),
                                TenTrinhDo = reader["TenTrinhDo"].ToString(),
                                MaChucVu = reader["MaChucVu"].ToString(),
                                TenChucVu = reader["TenChucVu"].ToString(),
                                Email = reader["Email"].ToString(),
                                TinhTrang = reader["TinhTrang"].ToString()
                            };
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }

            return Json(employee, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult GetEmployeeFilter(string time = null, string gender = null, string department = null, string position = null, int? ageMin = null, int? ageMax = null, string status = null)
        {
            List<NhanVienModels> employees = new List<NhanVienModels>();

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();

                    StringBuilder query = new StringBuilder();
                    query.Append("SELECT nv.MaNhanVien, nv.HoTen, pb.TenPhongBan, nv.NgaySinh, nv.GioiTinh, nv.NgayBatDauLam, cv.TenChucVu, nv.TinhTrang ");
                    query.Append("FROM NhanVien nv ");
                    query.Append("JOIN PhongBan pb ON nv.MaPhongBan = pb.MaPhongBan ");
                    query.Append("JOIN ChucVu cv ON nv.MaChucVu = cv.MaChucVu ");
                    query.Append("JOIN TrinhDo td ON nv.MaTrinhDo = td.MaTrinhDo ");
                    query.Append("WHERE 1=1 ");

                    // Apply filters
                    if (!string.IsNullOrEmpty(time))
                    {
                        switch (time)
                        {
                            case "1-week":
                                query.Append("AND DATEDIFF(day, nv.NgayBatDauLam, GETDATE()) <= 7 ");
                                break;
                            case "1-month":
                                query.Append("AND DATEDIFF(day, nv.NgayBatDauLam, GETDATE()) <= 30 ");
                                break;
                            case "1-year":
                                query.Append("AND DATEDIFF(day, nv.NgayBatDauLam, GETDATE()) <= 365 ");
                                break;
                        }
                    }

                    if (!string.IsNullOrEmpty(gender))
                    {
                        query.Append("AND nv.GioiTinh = @gender ");
                    }
                    if (!string.IsNullOrEmpty(department))
                    {
                        query.Append("AND nv.MaPhongBan = @department ");
                    }
                    if (!string.IsNullOrEmpty(position))
                    {
                        query.Append("AND nv.MaChucVu = @position ");
                    }
                    if (ageMin.HasValue && ageMax.HasValue)
                    {
                        query.Append("AND DATEDIFF(year, nv.NgaySinh, GETDATE()) BETWEEN @ageMin AND @ageMax ");
                    }
                    else if (ageMin.HasValue)
                    {
                        query.Append("AND DATEDIFF(year, nv.NgaySinh, GETDATE()) >= @ageMin ");
                    }
                    else if (ageMax.HasValue)
                    {
                        query.Append("AND DATEDIFF(year, nv.NgaySinh, GETDATE()) <= @ageMax ");
                    }
                    if (!string.IsNullOrEmpty(status))
                    {
                        query.Append("AND nv.TinhTrang = @status ");
                    }

                    SqlCommand cmd = new SqlCommand(query.ToString(), conn);
                    if (!string.IsNullOrEmpty(gender)) cmd.Parameters.AddWithValue("@gender", gender);
                    if (!string.IsNullOrEmpty(department)) cmd.Parameters.AddWithValue("@department", department);
                    if (!string.IsNullOrEmpty(position)) cmd.Parameters.AddWithValue("@position", position);
                    if (ageMin.HasValue) cmd.Parameters.AddWithValue("@ageMin", ageMin);
                    if (ageMax.HasValue) cmd.Parameters.AddWithValue("@ageMax", ageMax);
                    if (!string.IsNullOrEmpty(status)) cmd.Parameters.AddWithValue("@status", status);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            employees.Add(new NhanVienModels
                            {
                                MaNhanVien = reader["MaNhanVien"].ToString(),
                                HoTen = reader["HoTen"].ToString(),
                                TenPhongBan = reader["TenPhongBan"].ToString(),
                                NgaySinh = DateTime.Parse(reader["NgaySinh"].ToString()),
                                GioiTinh = reader["GioiTinh"].ToString(),
                                NgayBatDauLam = DateTime.Parse(reader["NgayBatDauLam"].ToString()),
                                TenChucVu = reader["TenChucVu"].ToString(),
                                TinhTrang = reader["TinhTrang"].ToString()
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }

            return Json(employees, JsonRequestBehavior.AllowGet);
        }


        [HttpGet]
        public JsonResult GetEmployeeDetail(string employeeId)
        {
            var employee = new
            {
                MaNhanVien = "",
                HoTen = "",
                CCCD = "",
                TenPhongBan = "",
                NgaySinh = "",
                GioiTinh = "",
                DiaChi = "",
                SoDienThoai = "",
                DanToc = "",
                NgayBatDauLam = "",
                TenTrinhDo = "",
                TenChucVu = "",
                Email = "",
                TinhTrang = "",
                HinhAnh = ""
            };

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();

                    string query = @"
            SELECT 
                nv.MaNhanVien, nv.HoTen, nv.CCCD, pb.TenPhongBan, 
                nv.NgaySinh, nv.GioiTinh, nv.DiaChi, nv.SoDienThoai, nv.DanToc,
                nv.NgayBatDauLam, td.TenTrinhDo, cv.TenChucVu, nv.Email, nv.TinhTrang, nv.HinhAnh
            FROM NhanVien nv
            JOIN PhongBan pb ON nv.MaPhongBan = pb.MaPhongBan
            JOIN ChucVu cv ON nv.MaChucVu = cv.MaChucVu
            JOIN TrinhDo td ON nv.MaTrinhDo = td.MaTrinhDo
            WHERE nv.MaNhanVien = @MaNhanVien";

                    SqlCommand cmd = new SqlCommand(query, conn);
                    cmd.Parameters.AddWithValue("@MaNhanVien", employeeId);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            var hinhAnhPath = reader["HinhAnh"].ToString(); 
                            var hinhAnhUrl = string.IsNullOrEmpty(hinhAnhPath) ? "/Content/img/default-avt.jpg" : Url.Content(hinhAnhPath);
                            employee = new
                            {
                                MaNhanVien = reader["MaNhanVien"].ToString(),
                                HoTen = reader["HoTen"].ToString(),
                                CCCD = reader["CCCD"].ToString(),
                                TenPhongBan = reader["TenPhongBan"].ToString(),
                                NgaySinh = DateTime.Parse(reader["NgaySinh"].ToString()).ToString("yyyy-MM-dd"),
                                GioiTinh = reader["GioiTinh"].ToString(),
                                DiaChi = reader["DiaChi"].ToString(),
                                SoDienThoai = reader["SoDienThoai"].ToString(),
                                DanToc = reader["DanToc"].ToString(),
                                NgayBatDauLam = DateTime.Parse(reader["NgayBatDauLam"].ToString()).ToString("yyyy-MM-dd"),
                                TenTrinhDo = reader["TenTrinhDo"].ToString(),
                                TenChucVu = reader["TenChucVu"].ToString(),
                                Email = reader["Email"].ToString(),
                                TinhTrang = reader["TinhTrang"].ToString(),
                                HinhAnh = hinhAnhUrl
                            };
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }

            return Json(employee, JsonRequestBehavior.AllowGet);
        }
        private string GetNewEmployeeCode()
        {
            string newCode = "NV1";
            string query = "SELECT TOP 1 MaNhanVien " +
                "FROM NhanVien " +
                "ORDER BY CAST(SUBSTRING(MaNhanVien, 3, LEN(MaNhanVien) - 2) AS INT) " +
                "DESC";

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    var result = command.ExecuteScalar();
                    if (result != null)
                    {
                        string lastCode = result.ToString();
                        int lastNumber = int.Parse(lastCode.Replace("NV", ""));
                        newCode = "NV" + (lastNumber + 1);
                    }
                }
            }

            return newCode;
        }
       
        public JsonResult GetDanhSach()
        {
            var phongBan = new List<dynamic>();
            var chucVu = new List<dynamic>();
            var trinhDo = new List<dynamic>();
            string newCode = GetNewEmployeeCode();

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();

                    // Lấy danh sách phòng ban
                    string queryPhongBan = "SELECT MaPhongBan, TenPhongBan FROM PhongBan";
                    SqlCommand cmdPhongBan = new SqlCommand(queryPhongBan, conn);
                    using (SqlDataReader reader = cmdPhongBan.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            phongBan.Add(new
                            {
                                MaPhongBan = reader["MaPhongBan"].ToString(),
                                TenPhongBan = reader["TenPhongBan"].ToString()
                            });
                        }
                    }

                    // Lấy danh sách chức vụ
                    string queryChucVu = "SELECT MaChucVu, TenChucVu FROM ChucVu";
                    SqlCommand cmdChucVu = new SqlCommand(queryChucVu, conn);
                    using (SqlDataReader reader = cmdChucVu.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            chucVu.Add(new
                            {
                                MaChucVu = reader["MaChucVu"].ToString(),
                                TenChucVu = reader["TenChucVu"].ToString()
                            });
                        }
                    }

                    // Lấy danh sách trình độ
                    string queryTrinhDo = "SELECT MaTrinhDo, TenTrinhDo FROM TrinhDo";
                    SqlCommand cmdTrinhDo = new SqlCommand(queryTrinhDo, conn);
                    using (SqlDataReader reader = cmdTrinhDo.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            trinhDo.Add(new
                            {
                                MaTrinhDo = reader["MaTrinhDo"].ToString(),
                                TenTrinhDo = reader["TenTrinhDo"].ToString()
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }

            return Json(new { newCode, phongBan, chucVu, trinhDo }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult LuuNhanVien(NhanVienModels model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    // Loại bỏ phần giờ
                    DateTime ngaySinh = model.NgaySinh.Date;
                    DateTime ngayBatDauLam = model.NgayBatDauLam.Date;
                    Console.WriteLine(ngaySinh);
                    Console.WriteLine(new DateTime(1753, 1, 1));

                    DateTime minDate = new DateTime(1753, 1, 1);
                    DateTime maxDate = new DateTime(9999, 12, 31);

                    // Kiểm tra phạm vi ngày
                    if (ngaySinh < minDate || ngaySinh > maxDate)
                    {
                        return Json(new { success = false, message = "Ngày sinh không hợp lệ. Phạm vi từ " + minDate + " đến " + maxDate + ". " + ngaySinh + "" });
                    }

                    if (ngayBatDauLam < minDate || ngayBatDauLam > maxDate)
                    {
                        return Json(new { success = false, message = "Ngày vào làm không hợp lệ. Phạm vi từ 01/01/1753 đến 31/12/9999." });
                    }

                    using (SqlConnection conn = new SqlConnection(connectionString))
                    {
                        conn.Open();

                        string query = @"
                            INSERT INTO NhanVien 
                            (MaNhanVien, HoTen, CCCD, MaPhongBan, DiaChi, NgaySinh, GioiTinh, SoDienThoai, DanToc, NgayBatDauLam, MaTrinhDo, MaChucVu, Email, TinhTrang)
                            VALUES 
                            (@MaNhanVien, @HoTen, @CCCD, @MaPhongBan, @DiaChi, @NgaySinh, @GioiTinh, @SoDienThoai, @DanToc, @NgayBatDauLam, @MaTrinhDo, @MaChucVu, @Email, @TinhTrang)";

                        SqlCommand cmd = new SqlCommand(query, conn);
                        cmd.Parameters.AddWithValue("@MaNhanVien", model.MaNhanVien);
                        cmd.Parameters.AddWithValue("@HoTen", model.HoTen);
                        cmd.Parameters.AddWithValue("@CCCD", model.CCCD);
                        cmd.Parameters.AddWithValue("@MaPhongBan", model.MaPhongBan);
                        cmd.Parameters.AddWithValue("@DiaChi", model.DiaChi);
                        cmd.Parameters.AddWithValue("@NgaySinh", ngaySinh.ToString("yyyy-MM-dd"));  // Định dạng ngày
                        cmd.Parameters.AddWithValue("@GioiTinh", model.GioiTinh);
                        cmd.Parameters.AddWithValue("@SoDienThoai", model.SoDienThoai);
                        cmd.Parameters.AddWithValue("@DanToc", model.DanToc);
                        cmd.Parameters.AddWithValue("@NgayBatDauLam", ngayBatDauLam.ToString("yyyy-MM-dd"));  // Định dạng ngày
                        cmd.Parameters.AddWithValue("@MaTrinhDo", model.MaTrinhDo);
                        cmd.Parameters.AddWithValue("@MaChucVu", model.MaChucVu);
                        cmd.Parameters.AddWithValue("@Email", model.Email);
                        cmd.Parameters.AddWithValue("@TinhTrang", model.TinhTrang);

                        cmd.ExecuteNonQuery();
                    }

                    return Json(new { success = true, message = "Lưu thành công!" });
                }

                return Json(new { success = false, message = "Dữ liệu không hợp lệ!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
        [HttpPost]
        public JsonResult UpdateNhanVien(NhanVienModels model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    // Loại bỏ phần giờ của ngày sinh và ngày bắt đầu làm
                    DateTime ngaySinh = model.NgaySinh.Date;
                    DateTime ngayBatDauLam = model.NgayBatDauLam.Date;

                    DateTime minDate = new DateTime(1753, 1, 1);
                    DateTime maxDate = new DateTime(9999, 12, 31);

                    // Kiểm tra phạm vi ngày
                    if (ngaySinh < minDate || ngaySinh > maxDate)
                    {
                        return Json(new { success = false, message = "Ngày sinh không hợp lệ. Phạm vi từ " + minDate + " đến " + maxDate + "." });
                    }

                    if (ngayBatDauLam < minDate || ngayBatDauLam > maxDate)
                    {
                        return Json(new { success = false, message = "Ngày vào làm không hợp lệ. Phạm vi từ 01/01/1753 đến 31/12/9999." });
                    }

                    using (SqlConnection conn = new SqlConnection(connectionString))
                    {
                        conn.Open();

                        string query = @"
                    UPDATE NhanVien
                    SET 
                        HoTen = @HoTen,
                        CCCD = @CCCD,
                        MaPhongBan = @MaPhongBan,
                        NgaySinh = @NgaySinh,
                        GioiTinh = @GioiTinh,
                        DiaChi = @DiaChi,
                        SoDienThoai = @SoDienThoai,
                        DanToc = @DanToc,
                        NgayBatDauLam = @NgayBatDauLam,
                        MaTrinhDo = @MaTrinhDo,
                        MaChucVu = @MaChucVu,
                        Email = @Email,
                        TinhTrang = @TinhTrang
                    WHERE MaNhanVien = @MaNhanVien";

                        SqlCommand cmd = new SqlCommand(query, conn);
                        cmd.Parameters.AddWithValue("@MaNhanVien", model.MaNhanVien);
                        cmd.Parameters.AddWithValue("@HoTen", model.HoTen);
                        cmd.Parameters.AddWithValue("@CCCD", model.CCCD);
                        cmd.Parameters.AddWithValue("@MaPhongBan", model.MaPhongBan);
                        cmd.Parameters.AddWithValue("@NgaySinh", ngaySinh.ToString("yyyy-MM-dd"));
                        cmd.Parameters.AddWithValue("@GioiTinh", model.GioiTinh);
                        cmd.Parameters.AddWithValue("@DiaChi", model.DiaChi);
                        cmd.Parameters.AddWithValue("@SoDienThoai", model.SoDienThoai);
                        cmd.Parameters.AddWithValue("@DanToc", model.DanToc);
                        cmd.Parameters.AddWithValue("@NgayBatDauLam", ngayBatDauLam.ToString("yyyy-MM-dd"));
                        cmd.Parameters.AddWithValue("@MaTrinhDo", model.MaTrinhDo);
                        cmd.Parameters.AddWithValue("@MaChucVu", model.MaChucVu);
                        cmd.Parameters.AddWithValue("@Email", model.Email);
                        cmd.Parameters.AddWithValue("@TinhTrang", model.TinhTrang);

                        cmd.ExecuteNonQuery();
                    }

                    return Json(new { success = true, message = "Cập nhật thành công!" });
                }

                return Json(new { success = false, message = "Dữ liệu không hợp lệ!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }


        [HttpDelete]
        public JsonResult DeleteNhanVien(string maNhanVien)
        {
            try
            {
                if (string.IsNullOrEmpty(maNhanVien))
                {
                    return Json(new { success = false, message = "Mã nhân viên không hợp lệ." });
                }

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();

                    string query = "DELETE FROM NhanVien WHERE MaNhanVien = @MaNhanVien";
                    SqlCommand cmd = new SqlCommand(query, conn);
                    cmd.Parameters.AddWithValue("@MaNhanVien", maNhanVien);

                    int rowsAffected = cmd.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        return Json(new { success = true, message = "Xóa thành công!" });
                    }
                    else
                    {
                        return Json(new { success = false, message = "Không tìm thấy nhân viên để xóa." });
                    }
                }
            }
            catch (Exception ex)
            {
                // Log lỗi cho debug
                Console.WriteLine($"Lỗi khi xóa nhân viên: {ex.Message}");
                return Json(new { success = false, message = "Đã xảy ra lỗi trong quá trình xử lý." });
            }
        }
    }
}