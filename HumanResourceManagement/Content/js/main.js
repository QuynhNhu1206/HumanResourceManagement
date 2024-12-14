const openPanelButton = document.getElementById("openPanel");
const closePanelButton = document.getElementById("closePanel");
const rightPanel = document.getElementById("rightPanel");
const mainContent = document.querySelector(".main-section");
const formPanel = document.getElementById('formPanel');
const tableBody = document.getElementById('table-body');
const detailPanel = document.getElementById('detailPanel');
const closedetailPanel = document.getElementById('closeDetailPanel');
const filterPanel = document.getElementById('filterPanel');
const openFilterButton = document.getElementById('openFilter');
const closeFilterButton = document.getElementById('closeFilterPanel');
const phongBanSelect = document.getElementById('phongban');
const chucVuSelect = document.getElementById('chucvu');
const trinhDoSelect = document.getElementById('trinhdo');



// Cập nhật chiều cao của panel dựa trên nội dung chính
function updatePanelHeight() {
    const mainSectionHeight = mainContent.offsetHeight;
    rightPanel.style.height = `${mainSectionHeight}px`;
    formPanel.style.height = `${mainSectionHeight}px`;
    filterPanel.style.height = `${mainSectionHeight}px`;
    detailPanel.style.height = `${mainSectionHeight}px`;
}

// Mở và đóng panel bên phải
openPanelButton.addEventListener("click", () => {
    // Hiển thị panel
    rightPanel.classList.add("show");
    mainContent.classList.add("panel-active");

    // Gọi API lấy danh sách phòng ban, chức vụ, trình độ
    fetch('/Nhanvien/GetDanhSach') // URL phải đúng với API backend
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi gọi API!');
            }
            return response.json();
        })
        .then(data => {
            // Đổ dữ liệu vào các dropdown
            updateSelectOptions(phongBanSelect, data.phongBan, 'MaPhongBan', 'TenPhongBan');
            updateSelectOptions(chucVuSelect, data.chucVu, 'MaChucVu', 'TenChucVu');
            updateSelectOptions(trinhDoSelect, data.trinhDo, 'MaTrinhDo', 'TenTrinhDo');
        })
        .catch(error => console.error('Lỗi khi lấy dữ liệu:', error));

    // Ẩn các panel khác nếu đang mở
    if (formPanel) formPanel.classList.remove('show');
    if (filterPanel) filterPanel.classList.remove('show');
    if (detailPanel) detailPanel.classList.remove('show');

    updatePanelHeight();
});

// Hàm cập nhật các tùy chọn (options) cho select
function updateSelectOptions(selectElement, data, valueField, textField) {
    // Xóa tất cả các option cũ
    selectElement.innerHTML = '';

    // Tạo option mặc định
    const defaultOption = document.createElement('option');
    defaultOption.text = `Chọn ${selectElement.name}`;
    defaultOption.selected = true;
    defaultOption.disabled = true;
    selectElement.appendChild(defaultOption);

    // Thêm các option từ dữ liệu API
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item[valueField];
        option.text = item[textField];
        selectElement.appendChild(option);
    });
}

// Sự kiện lưu thông tin nhân viên
document.getElementById("save").addEventListener("click", function (event) {
    event.preventDefault();

    //kiểm tra trước khi đưa vào formData

    const manv = document.getElementById("manv").value.trim();
    const ten = document.getElementById("ten").value.trim();
    const sodienthoai = document.getElementById("sodienthoai").value.trim();
    //...... Thêm các trường khác vào nữa 


    if (!manv || !ten || !sodienthoai || !email) {
        alert("Vui lòng điền đầy đủ các trường bắt buộc.");
        return;
    }

    
    function isValidDate(dateString) {
        const date = new Date(dateString);
        return !isNaN(date.getTime()); 
    }


    // Lấy giá trị từ form
    const ngaySinhInput = document.getElementById("ngaysinh").value;
    const ngayVaoLamInput = document.getElementById("ngayvaolam").value;

    // Kiểm tra các trường bắt buộc
    const formData = {
        MaNhanVien: document.getElementById("manv").value.trim(),
        HoTen: document.getElementById("ten").value.trim(),
        CCCD: document.getElementById("cccd").value.trim(),
        MaPhongBan: document.getElementById("phongban").value.trim(),
        DiaChi: document.getElementById("noisinh").value.trim(),
        NgaySinh: ngaySinhInput,
        GioiTinh: document.getElementById("gioitinh").value.trim(),
        SoDienThoai: document.getElementById("sodienthoai").value.trim(),
        DanToc: document.getElementById("dantoc").value.trim(),
        NgayBatDauLam: ngayVaoLamInput,
        MaTrinhDo: document.getElementById("trinhdo").value.trim(),
        MaChucVu: document.getElementById("chucvu").value.trim(),
        Email: document.getElementById("email").value.trim(),
        TinhTrang: document.getElementById("tinhtrang").value.trim()


    };
    console.log(formData);
    // Gửi dữ liệu lên server
    fetch("/Nhanvien/LuuNhanVien", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                alert("Lưu thành công!");
                renderTable(data);
                resetForm();
            } else {
                alert("Lưu thất bại: " + data.message);
            }
        })
        //.catch((error) => {
        //    console.error("Lỗi khi lưu dữ liệu:", error);
        //    alert("Có lỗi xảy ra, vui lòng thử lại.");
        //});
});




// Sự kiện xóa form
document.getElementById("xoa").addEventListener("click", function (event) {
    event.preventDefault();
    resetForm(); // Đặt lại form
});



// Hàm đặt lại form về trạng thái ban đầu
function resetForm() {
    document.getElementById("manv").value = '';
    document.getElementById("ten").value = '';
    document.getElementById("cccd").value = '';
    document.getElementById("phongban").value = '';
    document.getElementById("ngaysinh").value = '';
    document.getElementById("gioitinh").value = '';
    document.getElementById("sodienthoai").value = '';
    document.getElementById("dantoc").value = '';
    document.getElementById("ngayvaolam").value = '';
    document.getElementById("trinhdo").value = '';
    document.getElementById("chucvu").value = '';
    document.getElementById("email").value = '';
    document.getElementById("tinhtrang").value = '';
}

closePanelButton.addEventListener("click", () => {
    rightPanel.classList.remove("show");
    mainContent.classList.remove("panel-active");
});
closeFilterButton.addEventListener("click", () => {
    filterPanel.classList.remove("show");
    mainContent.classList.remove("panel-active");
});
// Hàm render bảng nội dung
function renderTable(data) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // Clear previous table data
    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">Không có dữ liệu</td></tr>';
    } else {
        data.forEach((item) => {
            const row = document.createElement('tr');
            row.classList.add('table-row');
            row.setAttribute('data-manv', item.MaNhanVien); 
            row.innerHTML = `
                <td>${item.HoTen}</td>
                <td>${item.TenPhongBan}</td> 
                <td>${item.TenChucVu}</td> 
                <td>${item.TinhTrang}</td>
                <td>
                    <span class="three-dots" onclick="toggleDropdown(event)">
                        <img src="/Content/img/ri_more-2-fill.png" alt="3-dot" class="icon-dot">
                    </span>
                    <ul class="dropdown-menu" style="display: none;">
                        <li><a href="#" class="edit-option" onclick="openEditPanel(event)">Sửa</a></li>
                        <li><a href="#" class="delete-option" onclick="deleteEmployee(event, '${item.MaNhanVien}')">Xóa</a></li>
                    </ul>
                </td>
            `;

            // Ngừng sự kiện click trên menu options để không đóng dropdown
            row.querySelector('.three-dots').addEventListener('click', (event) => {
                event.stopPropagation(); 
                toggleDropdown(event); 
            });

            row.querySelectorAll('.dropdown-menu li a').forEach(item => {
                item.addEventListener('click', (event) => {
                    event.stopPropagation(); 
                });
            });

            
            row.addEventListener('click', function () {
                const manv = this.getAttribute('data-manv'); 
                showDetailPanel(manv);
            });

            tableBody.appendChild(row);
        });
    }
}



function fetchEmployees() {
    $.ajax({
        url: '/Nhanvien/GetNhanVien',
        method: 'GET',
        success: function (data) {
            console.log('Dữ liệu nhận được:', data);  
            if (data.error) {
                console.error('Lỗi từ server:', data.error);  
            } else {
                renderTable(data);  
            }
        },
        error: function (xhr, status, error) {
            console.error('Lỗi khi gọi API:', error);
        }
    });
}


// Hàm toggle menu dropdown
function toggleDropdown(event) {
    event.stopPropagation();
    const isTableDropdown = event.target.closest('.three-dots');
    const isPanelDropdown = event.target.closest('.btn-menu');

    let dropdownMenu = null;

    if (isTableDropdown) {

        dropdownMenu = isTableDropdown.nextElementSibling;
    } else if (isPanelDropdown) {

        dropdownMenu = document.querySelector('.dropdown-menu.panel-detail-menu');
    }

    if (dropdownMenu) {

        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            if (menu !== dropdownMenu) {
                menu.style.display = 'none';
            }
        });

        dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
    }
}
//Xoa nhan vien
function deleteEmployee(event, maNhanVien) {
    event.stopPropagation();

    if (!maNhanVien) {
        console.error("Mã nhân viên không hợp lệ!");
        alert("Mã nhân viên không hợp lệ!");
        return;
    }

    if (confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
        fetch(`/NhanvienController/DeleteNhanVien?maNhanVien=${encodeURIComponent(maNhanVien)}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }

        })


            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert("Nhân viên đã được xóa thành công!");
                    // Xóa dòng dữ liệu khỏi bảng
                    const row = document.getElementById(`data-manv-${maNhanVien}`);
                    if (row) {
                        row.remove();
                    }
                } else {
                    alert(`Không thể xóa: ${data.message}`);
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Có lỗi xảy ra trong quá trình xóa nhân viên.");
            });
        console.log(`/NhanvienController/DeleteNhanVien?maNhanVien=${encodeURIComponent(maNhanVien)}`);

    }
}


document.addEventListener('click', (event) => {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        if (!menu.contains(event.target) && !event.target.closest('.three-dots') && !event.target.closest('.btn-menu')) {
            menu.style.display = 'none';
        }
    });
});


function showDetailPanel(manv) {
    const imageUrl = "/Content/img/EmployeeImages/" + data.HinhAnh;
    // Call the API to get the employee's detailed information
    fetch(`/Nhanvien/GetEmployeeDetail?employeeId=${manv}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);  

            if (!data || data.error) {
                console.error('Error fetching data:', data ? data.error : 'Unknown error');
                return;
            }

            const detailPanel = document.getElementById('detailPanel');
            detailPanel.classList.add('show');
            mainContent.classList.add("panel-active");
            if (rightPanel) rightPanel.classList.remove('show');
            if (formPanel) formPanel.classList.remove('show');
            if (filterPanel) filterPanel.classList.remove('show');

            
            detailPanel.innerHTML = `
                <div class="panel-header">
                    <h3>Chi tiết thông tin</h3>
                    <button id="menuButton" type="button" class="btn-menu" aria-label="Menu">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                     <button id="closeDetailPanel" type="button" class="btn-close" aria-label="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="panel-content">
                    <div class="profile-image">
                        <img src="${imageUrl || '/Content/img/default-avt.jpg'}" alt="Profile Picture" class="profile-pic">
                    </div>
                    <div class="employee-info">
                        <span class="employee-id">${data.MaNhanVien}</span>
                        <h2 class="employee-name">${data.HoTen}</h2>
                        <div class="employee-department">
                            <span class="department">${data.TenPhongBan}</span>
                            <span class="position"> - ${data.TenChucVu}</span>
                        </div>
                    </div>
                    <div class="detail-group">
                        <div class="detail-item"><label>CCCD</label><span>${data.CCCD}</span></div>
                        <div class="detail-item"><label>Ngày sinh</label><span>${data.NgaySinh}</span></div>
                        <div class="detail-item"><label>Giới tính</label><span>${data.GioiTinh}</span></div>
                        <div class="detail-item"><label>Nơi sinh</label><span>${data.DiaChi}</span></div>
                        <div class="detail-item"><label>Số điện thoại</label><span>${data.SoDienThoai}</span></div>
                        <div class="detail-item"><label>Email</label><span>${data.Email}</span></div>
                        <div class="detail-item"><label>Dân tộc</label><span>${data.DanToc}</span></div>
                        <div class="detail-item"><label>Ngày vào làm</label><span>${data.NgayBatDauLam}</span></div>
                        <div class="detail-item"><label>Trình độ học vấn</label><span>${data.TenTrinhDo}</span></div>
                    </div>
                </div>
            `;

            // Add event listener for closing the panel
            document.getElementById('closeDetailPanel').addEventListener('click', () => {
                detailPanel.classList.remove('show');
                mainContent.classList.remove("panel-active");
            });
        })
        .catch(error => console.error('Error fetching employee data:', error));
}




// Mở Edit Panel
function openEditPanel(event) {
    event.preventDefault();
    document.getElementById('formPanel').classList.add('show');
    mainContent.classList.add("panel-active");
    if (mainContent) mainContent.classList.add("panel-active");

    const rightPanel = document.getElementById('right-panel');
    if (rightPanel) rightPanel.classList.remove('show');

    const filterPanel = document.getElementById('filter-panel');
    if (filterPanel) filterPanel.classList.remove('show');
    if (detailPanel) detailPanel.classList.remove('show');


    updatePanelHeight();
    const employeeId = event.target.closest('.table-row').id.replace('data-manv-', '');

    
    fetch('/Nhanvien/GetDanhSach')
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi gọi API danh sách!');
            }
            return response.json();
        })
        .then(data => {
            // Cập nhật các select options với dữ liệu phòng ban, chức vụ, trình độ
            updateSelectOptions(document.getElementById('phongbanedit'), data.phongBan, 'MaPhongBan', 'TenPhongBan');
            updateSelectOptions(document.getElementById('chucvuedit'), data.chucVu, 'MaChucVu', 'TenChucVu');
            updateSelectOptions(document.getElementById('trinhdoedit'), data.trinhDo, 'MaTrinhDo', 'TenTrinhDo');

            // Lấy thông tin nhân viên từ API
            return fetch(`/NhanVien/GetEmployee?employeeId=${employeeId}`);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi gọi API lấy thông tin nhân viên!');
            }
            return response.json();
        })
        .then(data => {
            // Kiểm tra dữ liệu trả về
            if (data.MaNhanVien) {
                // Điền các thông tin vào các form
                document.getElementById('manvedit').value = data.MaNhanVien || '';
                document.getElementById('tenedit').value = data.HoTen || '';
                document.getElementById('cccdedit').value = data.CCCD || '';
                document.getElementById('phongbanedit').value = data.MaPhongBan || '';
                document.getElementById('ngaysinhedit').value = data.NgaySinh || '';
                document.getElementById('noisinhedit').value = data.DiaChi || '';  
                document.getElementById('sodienthoaiedit').value = data.SoDienThoai || '';
                document.getElementById('dantocedit').value = data.DanToc || '';
                document.getElementById('ngayvaolamedit').value = data.NgayBatDauLam || '';
                document.getElementById('trinhdoedit').value = data.MaTrinhDo || '';
                document.getElementById('chucvuedit').value = data.MaChucVu || '';
                document.getElementById('emailedit').value = data.Email || '';
                document.getElementById('tinhtrangedit').value = data.TinhTrang || '';

                document.getElementById('gioitinhedit').value = data.GioiTinh === "Nam" ? "1" : "2";
                document.getElementById('tinhtrangedit').value = data.TinhTrang === "Đang làm việc" ? "1" : "2";

                // Hiển thị form
               
            } else {
                console.error('Không tìm thấy dữ liệu nhân viên.');
                alert('Không tìm thấy thông tin nhân viên.');
            }
        })
        .catch(error => {
            console.error('Lỗi khi gọi API:', error);
            alert('Đã xảy ra lỗi. Vui lòng thử lại!');
        })
        .finally(() => {
          
           // document.getElementById('formPanel').classList.remove('loading);
        });
}


document.getElementById("saveedit").addEventListener("click", function (event) {
    event.preventDefault(); 

    
    const model = {
        MaNhanVien: document.getElementById('manvedit').value,
        HoTen: document.getElementById('tenedit').value,
        CCCD: document.getElementById('cccdedit').value,
        MaPhongBan: document.getElementById('phongbanedit').value,
        DiaChi: document.getElementById('noisinhedit').value,
        NgaySinh: document.getElementById('ngaysinhedit').value,
        GioiTinh: document.getElementById('gioitinhedit').value === "1" ? "Nam" : "Nữ", 
        SoDienThoai: document.getElementById('sodienthoaiedit').value,
        DanToc: document.getElementById('dantocedit').value,
        NgayBatDauLam: document.getElementById('ngayvaolamedit').value,
        MaTrinhDo: document.getElementById('trinhdoedit').value,
        MaChucVu: document.getElementById('chucvuedit').value,
        Email: document.getElementById('emailedit').value,
        TinhTrang: document.getElementById('tinhtrangedit').value === "1" ? "Đang làm việc" : "Nghỉ làm"
    };

    // Gửi dữ liệu lên server (thực hiện Post request tới UpdateNhanVien)
    fetch('/Nhanvien/UpdateNhanVien', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(model) 
    })
        .then(response => response.json())  
        .then(data => {
            if (data.success) {
                alert(data.message);  
            } else {
                alert(data.message);  
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Có lỗi xảy ra trong quá trình lưu thông tin.");
        });
});


// Đóng form panel
document.getElementById("closePanel1").addEventListener("click", function () {
    formPanel.classList.remove("show");
    mainContent.classList.remove("panel-active");
});

window.addEventListener("resize", updatePanelHeight);





document.querySelector('.btn-delete').addEventListener('click', () => {
    alert('Đã xóa!');
});


// dân tộc && Nơi sinh
document.addEventListener('DOMContentLoaded', function () {

    const dantocSelect = document.getElementById('dantoc');
    const noisinhSelect = document.getElementById('noisinh');
    const noisinheditSelect = document.getElementById('noisinhedit');
    const dantoceditSelect = document.getElementById('dantocedit');

    if (dantocSelect && noisinhSelect && dantoceditSelect && noisinheditSelect) {
        const danTocs = [
            "Kinh", "Tày", "Ê Đê", "Hoa", "Mường", "Khơ-me", "Nùng", "Thái", "H’mông", "Chăm",
            "Ba Na", "Xơ Đăng", "Co", "Sán Dìu", "Sán Chí", "Ra Glai", "Brâu", "Tà Ôi", "Stieng",
            "Giarai", "Kơ Tu", "Churu", "H're", "Cơ Ho", "K'Ho", "Rơ Măm", "M'Nông", "Bru-Vân Kiều",
            "Vân Kiều", "Dẻo", "Sáo", "Cơ Tu", "Xinh Mun", "Chứt", "Lào", "Phù Lá", "Mày", "Lô Lô"
        ];

        const provinces = [
            "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "An Giang", "Bà Rịa-Vũng Tàu", "Bắc Giang",
            "Bắc Kạn", "Bạc Liêu", "Bắc Ninh", "Bến Tre", "Bình Dương", "Bình Phước", "Bình Thuận",
            "Cà Mau", "Cao Bằng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai",
            "Hà Giang", "Hà Nam", "Hà Tĩnh", "Hải Dương", "Hải Phòng", "Hậu Giang", "Hòa Bình", "Hưng Yên",
            "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An",
            "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam",
            "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình",
            "Thái Nguyên", "Thanh Hóa", "Thừa Thiên-Huế", "Tiền Giang", "Trà Vinh", "Tuyên Quang", "Vĩnh Long",
            "Vĩnh Phúc", "Yên Bái"
        ];


        provinces.forEach(function (province) {
            const option1 = document.createElement('option');
            option1.value = province;
            option1.textContent = province;
            noisinhSelect.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = province;
            option2.textContent = province;
            noisinheditSelect.appendChild(option2);
        });


        danTocs.forEach(function (dantoc) {
            const option1 = document.createElement('option');
            option1.value = dantoc;
            option1.textContent = dantoc;
            dantocSelect.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = dantoc;
            option2.textContent = dantoc;
            dantoceditSelect.appendChild(option2);
        });
    } else {
        console.error('Các phần tử select không tìm thấy.');
    }
});
// Filterpanel
openFilterButton.addEventListener("click", () => {
    filterPanel.classList.add("show");
    mainContent.classList.add("panel-active");
    if (formPanel) {
        formPanel.classList.remove('show');
    }
    if (rightPanel) {
        rightPanel.classList.remove('show');
    }
    if (detailPanel) {
        detailPanel.classList.remove('show');
    }
    updatePanelHeight();
});

closeFilterButton.addEventListener("click", () => {
    filterPanel.classList.remove("show");
    mainContent.classList.remove("panel-active");
});

//filter-panle-content
function selectFilter(element, value) {
    const parent = element.parentNode;
    const options = parent.querySelectorAll('.filter-option');

    options.forEach(option => option.classList.remove('active'));


    element.classList.add('active');

    console.log(`Filter selected: ${value}`);
}

// Cập nhật khoảng độ tuổi
function updateAgeRange() {
    const ageMin = document.getElementById('age-min').value;
    const ageMax = document.getElementById('age-max').value;


    if (parseInt(ageMin) > parseInt(ageMax)) {
        document.getElementById('age-min').value = ageMax;
    }

    console.log(`Age range: ${ageMin} - ${ageMax}`);
}



// Nút xác nhận lọc
document.getElementById('SubmitFilterPanel').addEventListener('click', function () {
    const ageMin = document.getElementById('age-min').value;
    const ageMax = document.getElementById('age-max').value;
    const status = document.querySelector('input[name="status"]:checked').value;

    console.log(`Lọc: Độ tuổi từ ${ageMin} đến ${ageMax}, Tình trạng: ${status}`);
});
