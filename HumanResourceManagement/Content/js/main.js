const openPanelButton = document.getElementById("openPanel");
const closePanelButton = document.getElementById("closePanel");
const rightPanel = document.getElementById("rightPanel");
const mainContent = document.querySelector(".main-section");
const formPanel = document.getElementById('formPanel');
const tableBody = document.getElementById('table-body');
const detailPanel = document.getElementById('detailPanel');

// Dữ liệu giả lập (có thể thay thế bằng dữ liệu từ cơ sở dữ liệu hoặc API)
const data = [
    { name: "Trần Lan Nhi", department: "Khoa ngoại ngữ", position: "Trưởng khoa", status: "Đang làm" },
    { name: "Nguyễn Lan", department: "Khoa Tin học", position: "Giảng viên", status: "Đang làm" },
    { name: "Nguyễn Lan", department: "Khoa Tin học", position: "Giảng viên", status: "Đang làm" },
    { name: "Nguyễn Lan", department: "Khoa Tin học", position: "Giảng viên", status: "Đang làm" }
];

// Cập nhật chiều cao của panel dựa trên nội dung chính
function updatePanelHeight() {
    const mainSectionHeight = mainContent.offsetHeight;
    rightPanel.style.height = `${mainSectionHeight}px`;
    formPanel.style.height = `${mainSectionHeight}px`;
}

// Mở và đóng panel bên phải
openPanelButton.addEventListener("click", () => {
    rightPanel.classList.add("show");
    mainContent.classList.add("panel-active");
    if (formPanel) {
        formPanel.classList.remove('show');
    }
    updatePanelHeight();
});

closePanelButton.addEventListener("click", () => {
    rightPanel.classList.remove("show");
    mainContent.classList.remove("panel-active");
});

// Hàm render bảng nội dung
function renderTable(data) {
    tableBody.innerHTML = '';  // Xóa nội dung bảng trước khi hiển thị lại
    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">Không có dữ liệu</td></tr>';
    } else {
        data.forEach((item) => {
            const row = document.createElement('tr');
            row.classList.add('table-row');
            row.id = `data-manv-${item.manv}`;
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.department}</td>
                <td>${item.position}</td>
                <td>${item.status}</td>
                <td>
                    <span class="three-dots" onclick="toggleDropdown(event)">
                        <img src="/Content/img/ri_more-2-fill.png" alt="3-dot" class="icon-dot">
                    </span>
                    <ul class="dropdown-menu" style="display: none;">
                        <li><a href="#" class="edit-option" onclick="openEditPanel(event)">Sửa</a></li>
                        <li><a href="#" class="delete-option">Xóa</a></li>
                    </ul>
                </td>
            `;
            // Khi click vào dòng, hiển thị thông tin chi tiết
            row.addEventListener('click', () => {
                showDetailPanel(item);
            });
            tableBody.appendChild(row);
        });
    }
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


document.addEventListener('click', (event) => {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        if (!menu.contains(event.target) && !event.target.closest('.three-dots') && !event.target.closest('.btn-menu')) {
            menu.style.display = 'none';
        }
    });
});
document.getElementById("employeeTable").addEventListener("click", function (event) {
    const clickedRow = event.target.closest("tr");
    if (clickedRow) {
        const manv = clickedRow.getAttribute("data-manv");
        showDetailPanel(manv);
    }
});

function showDetailPanel(manv) {
    // Gọi API để lấy thông tin chi tiết của nhân viên
    fetch(`/Nhanvien/GetEmployeeDetail?manv=${manv}`)
        .then(response => response.json())
        .then(data => {
            const detailPanel = document.getElementById('detailPanel');
            detailPanel.classList.add('show');

            // Cập nhật thông tin lên panel
            detailPanel.innerHTML = `
                <div class="panel-header">
                    <h3>Chi tiết thông tin</h3>
                    <button id="closeDetailPanel" class="btn-close">X</button>
                </div>
                <div class="panel-content">
                    <div class="profile-image">
                        <img src="~/Content/img/cute.jpg" alt="Profile Picture" class="profile-pic">
                    </div>
                    <div class="employee-info">
                        <span class="employee-id">Mã nhân viên: ${data.manv}</span>
                        <h2 class="employee-name">${data.ten}</h2>
                        <div class="employee-department">
                            <span class="department">Phòng ban: ${data.phongban}</span>
                            <span class="position">Chức vụ: ${data.chucvu}</span>
                        </div>
                    </div>
                    <div class="detail-group">
                        <div class="detail-item"><label>CCCD</label><span>${data.cccd}</span></div>
                        <div class="detail-item"><label>Ngày sinh</label><span>${data.ngaysinh}</span></div>
                        <div class="detail-item"><label>Giới tính</label><span>${data.gioitinh}</span></div>
                        <div class="detail-item"><label>Nơi sinh</label><span>${data.noisinhsinh}</span></div>
                        <div class="detail-item"><label>Số điện thoại</label><span>${data.sodienthoai}</span></div>
                        <div class="detail-item"><label>Email</label><span>${data.email}</span></div>
                        <div class="detail-item"><label>Dân tộc</label><span>${data.dantoc}</span></div>
                        <div class="detail-item"><label>Ngày vào làm</label><span>${data.ngayvaolam}</span></div>
                        <div class="detail-item"><label>Trình độ học vấn</label><span>${data.trinhdo}</span></div>
                    </div>
                </div>
            `;

            // Đóng panel khi nhấn nút đóng
            document.getElementById('closeDetailPanel').addEventListener('click', () => {
                detailPanel.classList.remove('show');
            });
        })
        .catch(error => console.error('Error fetching employee data:', error));
}

// Mở Edit Panel
function openEditPanel(event) {
    event.preventDefault();
    formPanel.classList.add('show');
    mainContent.classList.add("panel-active");
    updatePanelHeight();
    if (rightPanel) {
        rightPanel.classList.remove('show');
    }
}

// Đóng form panel
document.getElementById("closePanel1").addEventListener("click", function () {
    formPanel.classList.remove("show");
    mainContent.classList.remove("panel-active");
});

// Lắng nghe sự kiện resize để cập nhật chiều cao panel
window.addEventListener("resize", updatePanelHeight);

// Khởi tạo bảng dữ liệu
document.addEventListener('DOMContentLoaded', () => {
    renderTable(data);  
    updatePanelHeight();
});

// Xử lý các hành động Lưu và Xóa
document.querySelector('.btn-save').addEventListener('click', () => {
    alert('Lưu thành công!');
});

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
