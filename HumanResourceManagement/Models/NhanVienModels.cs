using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HumanResourceManagement.Models
{
    public class NhanVien
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
        public string MaPhongBan { get; set; }
        public string MaTrinhDo { get; set; }
        public string TinhTrang { get; set; }
    }
}