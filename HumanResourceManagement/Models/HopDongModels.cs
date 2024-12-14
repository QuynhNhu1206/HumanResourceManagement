using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HumanResourceManagement.Models
{
    public class HopDongModels
    {
        public string MaHopDong { get; set; }
        public string MaNhanVien { get; set; }
        public string LoaiHopDong { get; set; }

        public DateTime NgayBatDauHopDong { get; set; }
        public DateTime NgayKetThucHopDong { get; set; }

        public string ChiTietHopDong { get; set; }
    }
}