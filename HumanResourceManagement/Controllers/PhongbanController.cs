using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using HumanResourceManagement.App_Data;
using HumanResourceManagement.Models;

namespace HumanResourceManagement.Controllers
{
    public class PhongbanController : Controller
    {
        private string connectionString = ConfigurationManager.ConnectionStrings["HumanResourceManagementEntities"].ConnectionString;
        private readonly HumanResourceManagementEntities db = new HumanResourceManagementEntities();


        public ActionResult Phongban()
        {
            return View(); 
        }
        public ActionResult Themmoi()
        {
            return View();
        }
        public JsonResult GetPhongBan()
        {
            List<PhongBanModels> Department = new List<PhongBanModels>();

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();

                    // Sửa truy vấn để đếm số lượng nhân viên
                    string query = @"
                SELECT 
                    pb.MaPhongBan,
                    pb.TenPhongBan,
                    pb.MoTa,
                    COUNT(nv.MaNhanVien) AS SoLuongNhanVien
                FROM PhongBan pb
                LEFT JOIN NhanVien nv ON pb.MaPhongBan = nv.MaPhongBan
                GROUP BY pb.MaPhongBan, pb.TenPhongBan, pb.MoTa";

                    SqlCommand cmd = new SqlCommand(query, conn);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Department.Add(new PhongBanModels
                            {
                                MaPhongBan = reader["MaPhongBan"].ToString(),
                                TenPhongBan = reader["TenPhongBan"].ToString(),
                                SoluongNhanVien = (int)reader["SoLuongNhanVien"],
                                MoTa = reader["MoTa"].ToString(),
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }

            return Json(Department, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
            public JsonResult GetDepartment(string departmentId)
            {
                var Department = new
                {
                    MaPhongBan = "",
                    TenPhongBan = "",
                    SoLuongNhanVien = 0,
                    MoTa = "",
               
                };

                try
                {
                    using (SqlConnection conn = new SqlConnection(connectionString))
                    {
                        conn.Open();
                    string query = @"
                        SELECT pb.MaPhongBan,pb.TenPhongBan,pb.SoLuongNhanVien,pb.MoTa
                        FROM PhongBan pb
                        WHERE pb.MaPhongBan = @MaPhongBan";

                    SqlCommand cmd = new SqlCommand(query, conn);
                        cmd.Parameters.AddWithValue("@MaNhanVien", departmentId);

                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                Department = new
                                {
                                    MaPhongBan = reader["MaPhongBan"].ToString(),
                                    TenPhongBan = reader["TenPhongBan"].ToString(),
                                    SoLuongNhanVien = int.Parse(reader["SoLuongNhanVien"].ToString()),
                                    MoTa = reader["MoTa"].ToString()
                                };
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
                }

                return Json(Department, JsonRequestBehavior.AllowGet);
            }
        //public ActionResult Capnhat(string MaPhongBan)
        //{
        //    //PhongBan model = db.PhongBans.SingleOrDefault(m => m.MaPhongBan == MaPhongBan); 
        //    PhongBan model = db.PhongBan.Find(MaPhongBan);
        //    return View(model);
        //}
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
        public JsonResult UpdatePhongBan(PhongBanModels model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    using (SqlConnection conn = new SqlConnection(connectionString))
                    {
                        conn.Open();

                        string query = @"
                    UPDATE PhongBan
                    SET  
                        TenPhongBan = @TenPhongBan,
                        MoTa = @MoTa
                    WHERE MaPhongBan = @MaPhongBan";

                        SqlCommand cmd = new SqlCommand(query, conn);
                        cmd.Parameters.AddWithValue("@MaPhongBan", model.MaPhongBan);
                        cmd.Parameters.AddWithValue("@TenPhongBan", model.TenPhongBan);
                        cmd.Parameters.AddWithValue("@MoTa", model.MoTa);

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
        public JsonResult DeletePhongBan(string maPhongBan)
        {
            try
            {
                if (string.IsNullOrEmpty(maPhongBan))
                {
                    return Json(new { success = false, message = "Mã phòng ban không hợp lệ." });
                }

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();

                    string query = "DELETE FROM PhongBan WHERE MaPhongBan = @MaPhongBan";
                    SqlCommand cmd = new SqlCommand(query, conn);
                    cmd.Parameters.AddWithValue("@MaPhongBan", maPhongBan);

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
                return Json(new { success = false, message = "Đã xảy ra lỗi trong quá trình xử lý." });
            }
        }
        public JsonResult GetAllDepartments()
        {
            try
            {
                var departments = db.PhongBan.Select(pb => new
                {
                    MaPhongBan = pb.MaPhongBan,
                    TenPhongBan = pb.TenPhongBan
                }).ToList();

                return Json(departments, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        //[HttpPost]
        //public ActionResult Capnhat(PhongBan model)
        //{
        //    var updateModel = db.PhongBans.Find(model.MaPhongBan);
        //    updateModel.MaPhongBan = model.MaPhongBan;
        //    updateModel.TenPhongBan = model.TenPhongBan;
        //    updateModel.SoLuongNhanVien = model.SoLuongNhanVien;
        //    updateModel.MoTa = model.MoTa;
        //    db.SaveChanges();
        //    return RedirectToAction("Phongban");
        //}
        ////public ActionResult Xoa(string MaPhongBan)
        ////{
        ////    var updateModel = db.PhongBans.Find(MaPhongBan);
        ////    db.PhongBans.Remove(updateModel);
        ////    db.SaveChanges();
        ////    return RedirectToAction("Phongban");

        ////}
        //[HttpPost]
        //public JsonResult Xoa(string MaPhongBan)
        //{
        //    if (string.IsNullOrEmpty(MaPhongBan))
        //    {
        //        return Json(new { success = false, message = "Mã phòng ban không hợp lệ." });
        //    }

        //    var phongBanToDelete = db.PhongBans.Find(MaPhongBan);
        //    if (phongBanToDelete == null)
        //    {
        //        return Json(new { success = false, message = "Không tìm thấy phòng ban." });
        //    }

        //    try
        //    {
        //        db.PhongBans.Remove(phongBanToDelete);
        //        db.SaveChanges();
        //        return Json(new { success = true, message = "Xóa phòng ban thành công." });
        //    }
        //    catch (Exception ex)
        //    {
        //        return Json(new { success = false, message = ex.Message });
        //    }
        //}
    }
}
