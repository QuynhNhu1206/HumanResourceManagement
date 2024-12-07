using AutoMapper;
using HumanResourceManagement.Models;
using HumanResourceManagement.App_Data;

namespace HumanResourceManagement.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<HumanResourceManagement.Models.NhanVienModels, HumanResourceManagement.App_Data.NhanVien>()
                .ForMember(dest => dest.MaNhanVien, opt => opt.MapFrom(src => src.MaNhanVien))
                .ForMember(dest => dest.HoTen, opt => opt.MapFrom(src => src.HoTen))
                .ForMember(dest => dest.NgaySinh, opt => opt.MapFrom(src => src.NgaySinh))
                .ForMember(dest => dest.CCCD, opt => opt.MapFrom(src => src.CCCD))
                .ForMember(dest => dest.GioiTinh, opt => opt.MapFrom(src => src.GioiTinh))
                .ForMember(dest => dest.DiaChi, opt => opt.MapFrom(src => src.DiaChi))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.SoDienThoai, opt => opt.MapFrom(src => src.SoDienThoai))
                .ForMember(dest => dest.NgayBatDauLam, opt => opt.MapFrom(src => src.NgayBatDauLam))
                .ForMember(dest => dest.MaChucVu, opt => opt.MapFrom(src => src.MaChucVu))
                .ForMember(dest => dest.MaPhongBan, opt => opt.MapFrom(src => src.MaPhongBan))
                .ForMember(dest => dest.MaTrinhDo, opt => opt.MapFrom(src => src.MaTrinhDo))
                .ForMember(dest => dest.TinhTrang, opt => opt.MapFrom(src => src.TinhTrang));
        }
    }
}
