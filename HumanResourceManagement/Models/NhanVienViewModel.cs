using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HumanResourceManagement.Data;

namespace HumanResourceManagement.Models
{
    public class NhanVienViewModel
    {
        public List<NhanVien> DanhSachNhanVien { get; set; }
        public NhanVien NhanVienMoi { get; set; }
        public NhanVien NhanVienUpdate { get; set; }
        public SelectList PhongBanList { get; set; }
        public SelectList ChucVuList { get; set; }
        public SelectList TrinhDoList { get; set; }
    }

}