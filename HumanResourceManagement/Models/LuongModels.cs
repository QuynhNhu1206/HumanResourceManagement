using HumanResourceManagement.App_Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HumanResourceManagement.Models
{
    public class LuongModels
    {
            public string MaLuong { get; set; }
            public decimal? LuongCoBan { get; set; } 
            public decimal? HeSoLuongg { get; set; }
            public decimal? PhuCapChucVu { get; set; }
            public decimal? PhuCapTrinhDo { get; set; }
            public int? ThamNienCongTac { get; set; }
            public decimal? BHXH { get; set; }
            public decimal? BHYT { get; set; }
            public decimal? LuongThucNhan { get; set; }
            public string MaNhanVien { get; set; }
           public virtual NhanVien NhanVien { get; set; }
        

    }
}