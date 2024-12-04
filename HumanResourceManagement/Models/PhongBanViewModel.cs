using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using HumanResourceManagement.Data;

namespace HumanResourceManagement.Models
{
    public class PhongBanViewModel
    {
        public List<PhongBan> DanhSachPhongBan { get; set; }
        public PhongBan PhongBanMoi { get; set; }
    }
}