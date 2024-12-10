using AutoMapper;
using HumanResourceManagement.Models;
using HumanResourceManagement.App_Data;
using System.Web.Mvc;
using HumanResourceManagement.Profiles;
using System.Collections.Generic;
using System.Linq;
using System;

namespace HumanResourceManagement.App_Start
{
    public class AutoMapperConfig
    {
        public static void RegisterMappings()
        {
           
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<MappingProfile>();
                cfg.CreateMap<HumanResourceManagement.Models.NhanVienModels, HumanResourceManagement.App_Data.NhanVien>();
            });

            
            IMapper mapper = config.CreateMapper();
            DependencyResolver.SetResolver(new DefaultDependencyResolver(mapper)); // Đăng ký vào MVC container
        }
    }

    // Thêm lớp DefaultDependencyResolver để đăng ký IMapper vào container
    public class DefaultDependencyResolver : IDependencyResolver
    {
        private readonly IMapper _mapper;

        public DefaultDependencyResolver(IMapper mapper)
        {
            _mapper = mapper;
        }

        public object GetService(Type serviceType)
        {
            if (serviceType == typeof(IMapper))
                return _mapper;

            return null;
        }

        public IEnumerable<object> GetServices(Type serviceType)
        {
            return Enumerable.Empty<object>();
        }
    }
}
