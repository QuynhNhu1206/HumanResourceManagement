using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HumanResourceManagement.Models
{
    public class NhanVienModels
    {
        public string MaNhanVien { get; set; }
        public string HoTen { get; set; }
        public DateTime NgaySinh { get; set; }
        public string CCCD { get; set; }
        public string GioiTinh { get; set; }
        public string DiaChi { get; set; }
        public string Email { get; set; }
        public string SoDienThoai { get; set; }
        public DateTime NgayBatDauLam { get; set; }
        public string MaChucVu { get; set; }
        public string TenChucVu { get; set; }
        public string MaPhongBan { get; set; }
        public string TenPhongBan { get; set; }
        public string MaTrinhDo { get; set; }
        public string TenTrinhDo { get; set; }
        public string TinhTrang { get; set; }
        public string DanToc {  get; set; }
        public string HinhAnh { get; set; }

    }
    public class EmployeeFilter
    {
        public string MaNhanVien { get; set; }
        public string GenderFilter { get; set; }
        public string DepartmentFilter { get; set; }
        public string PositionFilter { get; set; }
    }
}