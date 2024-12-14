using HumanResourceManagement.App_Data;
using HumanResourceManagement.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity;
using Newtonsoft.Json;

namespace HumanResourceManagement.Controllers
{
    public class HopDongController : Controller
    {
        private string connectionString = ConfigurationManager.ConnectionStrings["HumanResourceManagementEntities"].ConnectionString;
        private readonly HumanResourceManagementEntities db = new HumanResourceManagementEntities();

        public ActionResult HopDong()
        {
            return View();
        }
        public JsonResult GetHopDong()
        {
            List<HopDongModels> contracts = new List<HopDongModels>();
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();

                    string query = @"
                        SELECT hd.MaHopDong, hd.MaNhanVien, hd.LoaiHopDong, hd.NgayBatDauHopDong, hd.NgayKetThucHopDong, hd.ChiTietHopDong
                        FROM HopDong hd
                        JOIN NhanVien nv ON nv.MaNhanVien = hd.MaNhanVien;";



                    SqlCommand cmd = new SqlCommand(query, conn);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            contracts.Add(new HopDongModels
                            {
                                MaHopDong = reader["MaHopDong"].ToString(),
                                MaNhanVien = reader["MaNhanVien"].ToString(),
                                LoaiHopDong = reader["LoaiHopDong"].ToString(),
                                NgayBatDauHopDong = Convert.ToDateTime(reader["NgayBatDauHopDong"]),
                                NgayKetThucHopDong = Convert.ToDateTime(reader["NgayKetThucHopDong"]),
                                ChiTietHopDong = reader["ChiTietHopDong"].ToString()
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
            var jsonSettings = new JsonSerializerSettings
            {
                DateFormatString = "yyyy-MM-dd"
            };
            return Json(contracts, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetContract(string contractId)
        {
            var contract = new
            {
                MaHopDong = "",
                MaNhanVien = "",
                LoaiHopDong = "",
                NgayBatDauHopDong = "",
                NgayKetThucHopDong = "",
                ChiTietHopDong = ""
            };

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();

                    string query = @"
                SELECT hd.MaHopDong, hd.MaNhanVien, hd.LoaiHopDong, hd.NgayBatDauHopDong, hd.NgayKetThucHopDong, hd.ChiTietHopDong
                FROM HopDong hd
                JOIN NhanVien nv ON nv.MaNhanVien = hd.MaNhanVien
                WHERE hd.MaHopDong = @MaHopDong";

                    SqlCommand cmd = new SqlCommand(query, conn);
                    cmd.Parameters.AddWithValue("@MaHopDong", contractId);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            contract = new
                            {
                                MaHopDong = reader["MaHopDong"].ToString(),
                                MaNhanVien = reader["MaNhanVien"].ToString(),
                                LoaiHopDong = reader["LoaiHopDong"].ToString(),
                                NgayBatDauHopDong = Convert.ToDateTime(reader["NgayBatDauHopDong"]).ToString("yyyy-MM-dd"),
                                NgayKetThucHopDong = Convert.ToDateTime(reader["NgayKetThucHopDong"]).ToString("yyyy-MM-dd"),
                                ChiTietHopDong = reader["ChiTietHopDong"].ToString()
                            };
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }

            return Json(contract, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult GetContractDetail(string contractId)
        {
            var contract = new
            {
                MaHopDong = "",
                MaNhanVien = "",
                LoaiHopDong = "",
                NgayBatDauHopDong = "",
                NgayKetThucHopDong = "",
                ChiTietHopDong = ""
            };

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();

                    string query = @"
                    SELECT  hd.MaHopDong, hd.MaNhanVien, hd.LoaiHopDong, hd.NgayBatDauHopDong, 
                            hd.NgayKetThucHopDong, hd.ChiTietHopDong, 
                
                    FROM    HopDong hd
                    JOIN    NhanVien nv ON nv.MaNhanVien = hd.MaNhanVien
                    WHERE   hd.MaHopDong = @MaHopDong";

                    SqlCommand cmd = new SqlCommand(query, conn);
                    cmd.Parameters.AddWithValue("@MaHopDong", contractId);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            contract = new
                            {
                                MaHopDong = reader["MaHopDong"].ToString(),
                                MaNhanVien = reader["MaNhanVien"].ToString(),
                                LoaiHopDong = reader["LoaiHopDong"].ToString(),
                                NgayBatDauHopDong = DateTime.Parse(reader["NgayBatDauHopDong"].ToString()).ToString("yyyy-MM-dd"),
                                NgayKetThucHopDong = DateTime.Parse(reader["NgayKetThucHopDong"].ToString()).ToString("yyyy-MM-dd"),
                                ChiTietHopDong = reader["ChiTietHopDong"].ToString()
                            };
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }

            return Json(contract, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDanhSach()
        {
            var nhanVien = new List<dynamic>();

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();


                    string queryNhanVien = "SELECT MaNhanVien, HoTen FROM NhanVien";
                    SqlCommand cmdNhanVien = new SqlCommand(queryNhanVien, conn);
                    using (SqlDataReader reader = cmdNhanVien.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            nhanVien.Add(new
                            {
                                MaNhanVien = reader["MaNhanVien"].ToString(),
                                HoTen = reader["HoTen"].ToString()
                            });
                        }
                    }

                }
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }

            return Json(new { nhanVien }, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public JsonResult LuuHopDong(HopDongModels model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    DateTime ngayBatDau = model.NgayBatDauHopDong.Date;
                    DateTime ngayKetThuc = model.NgayKetThucHopDong.Date;

                    if (!IsDateValid(ngayBatDau) || !IsDateValid(ngayKetThuc))
                    {
                        return Json(new { success = false, message = "Ngày bắt đầu hoặc ngày kết thúc không hợp lệ." });
                    }

                    using (SqlConnection conn = new SqlConnection(connectionString))
                    {
                        conn.Open();

                        string checkQuery = "SELECT COUNT(*) FROM HopDong WHERE MaHopDong = @MaHopDong";
                        SqlCommand checkCmd = new SqlCommand(checkQuery, conn);
                        checkCmd.Parameters.AddWithValue("@MaHopDong", model.MaHopDong);

                        int count = (int)checkCmd.ExecuteScalar();
                        if (count > 0)
                        {
                            return Json(new { success = false, message = "Mã hợp đồng đã tồn tại." });
                        }

                        string query = @"
                            INSERT INTO HopDong 
                            (MaHopDong, MaNhanVien, LoaiHopDong, NgayBatDauHopDong, NgayKetThucHopDong, ChiTietHopDong)
                            VALUES 
                            (@MaHopDong, @MaNhanVien, @LoaiHopDong, @NgayBatDauHopDong, @NgayKetThucHopDong, @ChiTietHopDong)";

                        SqlCommand cmd = new SqlCommand(query, conn);
                        cmd.Parameters.AddWithValue("@MaHopDong", model.MaHopDong);
                        cmd.Parameters.AddWithValue("@MaNhanVien", model.MaNhanVien);
                        cmd.Parameters.AddWithValue("@LoaiHopDong", model.LoaiHopDong);
                        cmd.Parameters.AddWithValue("@NgayBatDauHopDong", ngayBatDau);
                        cmd.Parameters.AddWithValue("@NgayKetThucHopDong", ngayKetThuc);
                        cmd.Parameters.AddWithValue("@ChiTietHopDong", model.ChiTietHopDong);

                        cmd.ExecuteNonQuery();
                    }

                    return Json(new { success = true, message = "Lưu hợp đồng thành công!" });
                }

                return Json(new { success = false, message = "Dữ liệu không hợp lệ!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        private bool IsDateValid(DateTime date)
        {
            DateTime minDate = new DateTime(2000, 1, 1);
            DateTime maxDate = new DateTime(9999, 12, 31);
            return date >= minDate && date <= maxDate;
        }

        [HttpPost]
        public JsonResult UpdateHopDong(HopDongModels model)
        {
            try
            {

                if (ModelState.IsValid)
                {
                    DateTime ngayBatDau = model.NgayBatDauHopDong.Date;
                    DateTime ngayKetThuc = model.NgayKetThucHopDong.Date;

                    DateTime minDate = new DateTime(2000, 1, 1);
                    DateTime maxDate = new DateTime(9999, 12, 31);
                    if (ngayBatDau < minDate || ngayBatDau > maxDate)
                    {
                        return Json(new { success = false, message = "Ngày bắt đầu hợp đồng không hợp lệ. Phạm vi từ " + minDate + " đến " + maxDate + "." });
                    }

                    if (ngayKetThuc < minDate || ngayKetThuc > maxDate)
                    {
                        return Json(new { success = false, message = "Ngày kết thúc hợp đồng không hợp lệ" });
                    }

                    using (SqlConnection conn = new SqlConnection(connectionString))
                    {
                        conn.Open();

                        string query = @"
                UPDATE HopDong
                SET 
                    MaHopDong = @MaHopDong,
                    MaNhanVien = @MaNhanVien,
                    LoaiHopDong = @LoaiHopDong,
                    NgayBatDauHopDong = @NgayBatDauHopDong,
                    NgayKetThucHopDong = @NgayKetThucHopDong,
                    ChiTietHopDong = @ChiTietHopDong
                WHERE MaHopDong = @MaHopDong";

                        SqlCommand cmd = new SqlCommand(query, conn);
                        cmd.Parameters.AddWithValue("@MaHopDong", model.MaHopDong);
                        cmd.Parameters.AddWithValue("@MaNhanVien", model.MaNhanVien);
                        cmd.Parameters.AddWithValue("@LoaiHopDong", model.LoaiHopDong);
                        cmd.Parameters.AddWithValue("@NgayBatDauHopDong", ngayBatDau.ToString("yyyy-MM-dd"));
                        cmd.Parameters.AddWithValue("@NgayKetThucHopDong", ngayKetThuc.ToString("yyyy-MM-dd"));
                        cmd.Parameters.AddWithValue("@ChiTietHopDong", model.ChiTietHopDong);

                        cmd.ExecuteNonQuery();
                    }

                    return Json(new { success = true, message = "Cập nhật hợp đồng thành công!" });
                }

                return Json(new { success = false, message = "Dữ liệu không hợp lệ!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

    }
}