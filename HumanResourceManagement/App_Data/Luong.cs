//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace HumanResourceManagement.App_Data
{
    using System;
    using System.Collections.Generic;
    
    public partial class Luong
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Luong()
        {
            this.PhuCaps = new HashSet<PhuCap>();
        }
    
        public string MaLuong { get; set; }
        public Nullable<decimal> LuongCoBan { get; set; }
        public Nullable<decimal> HeSoLuongg { get; set; }
        public Nullable<decimal> PhuCapChucVu { get; set; }
        public Nullable<decimal> PhuCapTrinhDo { get; set; }
        public Nullable<int> ThamNienCongTac { get; set; }
        public Nullable<decimal> BHXH { get; set; }
        public Nullable<decimal> BHYT { get; set; }
        public Nullable<decimal> LuongThucNhan { get; set; }
        public string MaNhanVien { get; set; }
    
        public virtual NhanVien NhanVien { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<PhuCap> PhuCaps { get; set; }
    }
}