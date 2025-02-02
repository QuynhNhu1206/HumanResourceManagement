﻿
using HumanResourceManagement.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HumanResourceManagement.Controllers
{
    public class PhongbanController : BaseController
    {
        private string connectionString = ConfigurationManager.ConnectionStrings["HumanResourceManagementEntities"].ConnectionString;
        // GET: Phongban
        public ActionResult Phongban()
        {
            return View();
        }
        public JsonResult GetPhongBan()
        {
            List<PhongBanModels> department = new List<PhongBanModels>();
            Debug.WriteLine("GetPhongBan method is called.");
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();

                    string query = @"
                SELECT 
                    pb.MaPhongBan, 
                    pb.TenPhongBan, 
                    pb.MoTa, 
                    COUNT(nv.MaNhanVien) AS SoLuongNhanVien
                FROM 
                    PhongBan pb
                LEFT JOIN 
                    NhanVien nv ON pb.MaPhongBan = nv.MaPhongBan
                GROUP BY 
                    pb.MaPhongBan, pb.TenPhongBan, pb.MoTa";


                    SqlCommand cmd = new SqlCommand(query, conn);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var phongBan = new PhongBanModels
                            {
                                MaPhongBan = reader["MaPhongBan"].ToString(),
                                TenPhongBan = reader["TenPhongBan"].ToString(),
                                SoluongNhanVien = (int)reader["SoLuongNhanVien"],
                                MoTa = reader["MoTa"].ToString(),
                            };
                            department.Add(phongBan);
                            Debug.WriteLine($"MaPhongBan: {phongBan.MaPhongBan}, TenPhongBan: {phongBan.TenPhongBan}, SoLuongNhanVien: {phongBan.SoluongNhanVien}, MoTa: {phongBan.MoTa}");
                        }

                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }

            return Json(department, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult GetEmployeeNumber(string departmentId)
        {
            try
            {
                if (string.IsNullOrEmpty(departmentId))
                {
                    return Json(new { success = false, count = 0 });
                }

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    string query = "SELECT COUNT(*) AS SoLuong FROM NhanVien WHERE MaPhongBan = @MaPhongBan";
                    SqlCommand cmd = new SqlCommand(query, conn);
                    cmd.Parameters.AddWithValue("@MaPhongBan", departmentId);

                    int soLuong = (int)cmd.ExecuteScalar();

                    return Json(new { success = true, count = soLuong }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi khi lấy số lượng nhân viên: {ex.Message}");
                return Json(new { success = false, count = 0 });
            }
        }
        [HttpGet]
        public JsonResult Getdepartment(string departmentID)
        {
            if (string.IsNullOrEmpty(departmentID))
            {
                return Json(new { error = "Mã phòng ban không được để trống" }, JsonRequestBehavior.AllowGet);
            }

            var department = new
            {
                MaPhongBan = "",
                TenPhongBan = "",
                MoTa = "",
                SoLuongNhanVien = 0
            };

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();

                    string query = @"
            SELECT 
                pb.MaPhongBan, 
                pb.TenPhongBan, 
                pb.MoTa, 
                COUNT(nv.MaNhanVien) AS SoLuongNhanVien
            FROM 
                PhongBan pb
            LEFT JOIN 
                NhanVien nv ON pb.MaPhongBan = nv.MaPhongBan
            WHERE 
                pb.MaPhongBan = @MaPhongBan
            GROUP BY 
                pb.MaPhongBan, pb.TenPhongBan, pb.MoTa";

                    SqlCommand cmd = new SqlCommand(query, conn);
                    cmd.Parameters.AddWithValue("@MaPhongBan", departmentID);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            department = new
                            {
                                MaPhongBan = reader["MaPhongBan"].ToString(),
                                TenPhongBan = reader["TenPhongBan"].ToString(),
                                MoTa = reader["MoTa"].ToString(),
                                SoLuongNhanVien = reader["SoLuongNhanVien"] != DBNull.Value
                                              ? (int)reader["SoLuongNhanVien"]
                                              : 0
                            };
                        }
                        else
                        {
                            return Json(new { error = "Không tìm thấy phòng ban" }, JsonRequestBehavior.AllowGet);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }

            return Json(department, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult UpdatePhongBan(PhongBanModels model)
        {
            if (model == null || string.IsNullOrEmpty(model.MaPhongBan))
            {
                return Json(new { success = false, message = "Dữ liệu không hợp lệ!" });
            }

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();

                    string query = @"
            UPDATE PhongBan
            SET 
                TenPhongBan = @TenPhongBan,
                MoTa = @MoTa
            WHERE 
                MaPhongBan = @MaPhongBan";

                    SqlCommand cmd = new SqlCommand(query, conn);
                    cmd.Parameters.AddWithValue("@MaPhongBan", model.MaPhongBan);
                    cmd.Parameters.AddWithValue("@TenPhongBan", model.TenPhongBan);
                    cmd.Parameters.AddWithValue("@MoTa", model.MoTa);

                    int rowsAffected = cmd.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        return Json(new { success = true, message = "Cập nhật thành công!" });
                    }
                    else
                    {
                        return Json(new { success = false, message = "Không tìm thấy phòng ban để cập nhật." });
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult LuuPhongBan(PhongBanModels model)
        {
            try
            {
                if (ModelState.IsValid)
                {

                    using (SqlConnection conn = new SqlConnection(connectionString))
                    {
                        conn.Open();

                        string query = @"
                            INSERT INTO PhongBan 
                            (MaPhongBan, TenPhongBan, MoTa)
                            VALUES 
                            (@MaPhongBan, @TenPhongBan, @MoTa)";

                        SqlCommand cmd = new SqlCommand(query, conn);
                        cmd.Parameters.AddWithValue("@MaPhongBan", model.MaPhongBan);
                        cmd.Parameters.AddWithValue("@TenPhongBan", model.TenPhongBan);
                        cmd.Parameters.AddWithValue("@MoTa", model.MoTa);

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
        public JsonResult DeletePhongBan(string departmentId)
        {
            if (string.IsNullOrEmpty(departmentId))
            {
                return Json(new { success = false, message = "Mã phòng ban không hợp lệ!" });
            }

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();

                    string query = @"
                DELETE FROM PhongBan
                WHERE MaPhongBan = @MaPhongBan";

                    SqlCommand cmd = new SqlCommand(query, conn);
                    cmd.Parameters.AddWithValue("@MaPhongBan", departmentId);

                    int rowsAffected = cmd.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        return Json(new { success = true, message = "Xóa thành công!" });
                    }
                    else
                    {
                        return Json(new { success = false, message = "Không tìm thấy phòng ban để xóa." });
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
        [HttpGet]
        public JsonResult FilterPhongBan(string maPhongBan)
        {
            List<PhongBanModels> filteredDepartments = new List<PhongBanModels>();

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    string query = @"
                SELECT 
                    pb.MaPhongBan, 
                    pb.TenPhongBan, 
                    pb.MoTa, 
                    COUNT(nv.MaNhanVien) AS SoLuongNhanVien
                FROM 
                    PhongBan pb
                LEFT JOIN 
                    NhanVien nv ON pb.MaPhongBan = nv.MaPhongBan
                WHERE 
                    pb.MaPhongBan LIKE @MaPhongBan
                GROUP BY 
                    pb.MaPhongBan, pb.TenPhongBan, pb.MoTa";

                    SqlCommand cmd = new SqlCommand(query, conn);
                    cmd.Parameters.AddWithValue("@maPhongBan", $"%{maPhongBan}%");

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var phongBan = new PhongBanModels
                            {
                                MaPhongBan = reader["MaPhongBan"].ToString(),
                                TenPhongBan = reader["TenPhongBan"].ToString(),
                                SoluongNhanVien = reader["SoLuongNhanVien"] != DBNull.Value
                                                  ? (int)reader["SoLuongNhanVien"]
                                                  : 0,
                                MoTa = reader["MoTa"].ToString()
                            };

                            filteredDepartments.Add(phongBan);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }

            return Json(filteredDepartments, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetDepartmentNames()
        {
            List<PhongBanModels> departments = new List<PhongBanModels>();

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    string query = @"
                SELECT 
                    MaPhongBan, 
                    TenPhongBan
                FROM 
                    PhongBan";

                    SqlCommand cmd = new SqlCommand(query, conn);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            departments.Add(new PhongBanModels
                            {
                                MaPhongBan = reader["MaPhongBan"].ToString(),
                                TenPhongBan = reader["TenPhongBan"].ToString()
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }

            return Json(departments, JsonRequestBehavior.AllowGet);
        }

    }
}
