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

let currentPage = 1;
let rowsPerPage = 5;
let data = [];
let totalPages = 1;
function calculateTotalPages() {
    totalPages = Math.ceil(data.length / rowsPerPage);
}

function updatePageInfo() {
    const pageInfo = document.getElementById('pageInfo');
    pageInfo.textContent = `Hiển thị trang ${currentPage} trong ${totalPages} trang`;
    updatePagination();
}

function updatePagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    calculateTotalPages();
    // Thêm nút "Trước"
    const prevButton = document.createElement('li');
    prevButton.classList.add('page-item');
    if (currentPage === 1) {
        prevButton.classList.add('disabled');
    }
    prevButton.innerHTML = '<a class="page-link">Trước</a>';
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            changePage(currentPage - 1);
        }
    });
    pagination.appendChild(prevButton);

    // Thêm các nút trang
    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement('li');
        pageItem.classList.add('page-item');
        if (i === currentPage) {
            pageItem.classList.add('active');
        }
        pageItem.innerHTML = `<a class="page-link">${i}</a>`;
        pageItem.addEventListener('click', () => changePage(i));
        pagination.appendChild(pageItem);
    }

    // Thêm nút "Tiếp theo"
    const nextButton = document.createElement('li');
    nextButton.classList.add('page-item');
    if (currentPage === totalPages) {
        nextButton.classList.add('disabled');
    }
    nextButton.innerHTML = '<a class="page-link">Tiếp theo</a>';
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            changePage(currentPage + 1);
        }
    });
    pagination.appendChild(nextButton);
}
function changePage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    updatePageInfo();
    updateTable();
}
document.getElementById('rowsPerPage').addEventListener('change', function () {
    rowsPerPage = Math.min(parseInt(this.value));
    currentPage = 1;
    calculateTotalPages();
    updateTable();
    updatePagination();
    updatePageInfo();
});

function updateTable() {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';

    if (!Array.isArray(data) || data.length === 0) {
        console.error('Dữ liệu không hợp lệ hoặc rỗng');
        tableBody.innerHTML = '<tr><td colspan="5">Không có dữ liệu</td></tr>';
        return;
    }
    let startRow = (currentPage - 1) * rowsPerPage;
    const endRow = Math.min(startRow + rowsPerPage, data.length);

    let pagedData = data.slice(startRow, endRow);
    renderTable(pagedData);
}
function updatePanelHeight() {
    const mainSectionHeight = mainContent.offsetHeight;
    rightPanel.style.height = `${mainSectionHeight}px`;
    formPanel.style.height = `${mainSectionHeight}px`;
    filterPanel.style.height = `${mainSectionHeight}px`;
    detailPanel.style.height = `${mainSectionHeight}px`;
}
openPanelButton.addEventListener("click", () => {

    rightPanel.classList.add("show");
    mainContent.classList.add("panel-active");


    fetch('/Nhanvien/GetDanhSach')
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi gọi API!');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            if (data.newCode) {
                const newEmployeeCode = data.newCode;
                document.getElementById('manv').value = newEmployeeCode;
            } else {
                console.error('newCode is undefined');
            }
            updateSelectOptions(phongBanSelect, data.phongBan, 'MaPhongBan', 'TenPhongBan');
            updateSelectOptions(chucVuSelect, data.chucVu, 'MaChucVu', 'TenChucVu');
            updateSelectOptions(trinhDoSelect, data.trinhDo, 'MaTrinhDo', 'TenTrinhDo');
        })
        .catch(error => console.error('Lỗi khi lấy dữ liệu:', error));
    if (formPanel) formPanel.classList.remove('show');
    if (filterPanel) filterPanel.classList.remove('show');
    if (detailPanel) detailPanel.classList.remove('show');

    updatePanelHeight();
});

// Hàm cập nhật các tùy chọn (options) cho select
function updateSelectOptions(selectElement, data, valueField, textField) {

    selectElement.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.text = `Chọn ${selectElement.title}`;
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

function resetErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    const iconElements = document.querySelectorAll('.error-icon');

    errorElements.forEach(error => error.style.display = 'none');
    iconElements.forEach(icon => icon.style.display = 'none');
}
document.getElementById("save").addEventListener("click", function (event) {
    event.preventDefault();

    let isValid = true;


    const fieldValidations = [
        {
            id: 'manv',
            errorId: 'manv-error',
            emptyMessage: 'Mã nhân viên không được để trống.',
            validator: value => value.trim() !== ''
        },
        {
            id: 'ten',
            errorId: 'ten-error',
            emptyMessage: 'Họ và tên không được để trống.',
            validator: value => value.trim() !== ''
        },
        {
            id: 'cccd',
            errorId: 'cccd-error',
            message: 'Bạn cần nhập đúng định dạng số CCCD.',
            emptyMessage: 'CCCD không được để trống.',
            validator: value => /^[0-9]{12}$/.test(value.trim())
        },
        {
            id: 'email',
            errorId: 'email-error',
            message: 'Email không đúng định dạng.',
            emptyMessage: 'Email không được để trống.',
            validator: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
        },
        {
            id: 'ngaysinh',
            errorId: 'ngaysinh-error',
            emptyMessage: 'Ngày sinh không được để trống.',
            validator: value => value.trim() !== ''
        },
        {
            id: 'sodienthoai',
            errorId: 'sodienthoai-error',
            message: 'Số điện thoại không đúng định dạng.',
            emptyMessage: 'Số điện thoại không được để trống.',
            validator: value => /^[0-9]{10}$/.test(value.trim())
        },
    ];


    fieldValidations.forEach(field => {
        const element = document.getElementById(field.id);
        const errorElement = document.getElementById(field.errorId);
        const iconElement = errorElement.querySelector('.error-icon');

        // Hàm kiểm tra lỗi cho mỗi trường
        function checkError() {
            const value = element.value.trim();


            if (value === '' || value === field.defaultValue) {
                errorElement.innerHTML = `<i class="fas fa-exclamation-circle error-icon"></i> ${field.emptyMessage}`;
                errorElement.style.display = 'block';
                errorElement.classList.add('show-error');
                iconElement.classList.add('show-icon');
                element.classList.add('error-background');
                iconElement.style.display = 'inline-block';
                isValid = false;
            } else if (!field.validator(value)) {

                errorElement.innerHTML = `<i class="fas fa-exclamation-circle error-icon"></i> ${field.message}`;
                errorElement.style.display = 'block';
                errorElement.classList.add('show-error');
                iconElement.classList.add('show-icon');
                element.classList.add('error-background');
                iconElement.style.display = 'inline-block';
                isValid = false;
            } else {

                errorElement.classList.remove('show-error');
                //iconElement.classList.remove('show-icon');
                element.classList.remove('error-background');
                errorElement.innerHTML = '';
                // iconElement.style.display = 'none';

            }
        }
        checkError();
        element.addEventListener('input', checkError);
    });

    const dropdownValidations = [
        {
            id: 'phongban', errorId: 'phongban-error', defaultValue: 'Chọn phòng ban', message: 'Vui lòng chọn phòng ban.'
        },
        { id: 'gioitinh', errorId: 'gioitinh-error', defaultValue: 'Giới tính', message: 'Vui lòng chọn giới tính.' },
        { id: 'noisinh', errorId: 'noisinh-error', defaultValue: '', message: 'Vui lòng chọn nơi sinh.' },
        { id: 'dantoc', errorId: 'dantoc-error', defaultValue: '', message: 'Vui lòng chọn dân tộc.' },
        { id: 'trinhdo', errorId: 'trinhdo-error', defaultValue: 'Chọn trình độ', message: 'Vui lòng chọn trình độ học vấn.' },
        { id: 'chucvu', errorId: 'chucvu-error', defaultValue: 'Chọn chức vụ', message: 'Vui lòng chọn chức vụ.' },
        { id: 'tinhtrang', errorId: 'tinhtrang-error', defaultValue: 'Tình trạng', message: 'Vui lòng chọn tình trạng.' },
        { id: 'ngayvaolam', errorId: 'ngayvaolam-error', defaultValue: '', message: 'Ngày bắt đầu làm không được để trống.' }
    ];


    dropdownValidations.forEach(field => {
        const element = document.getElementById(field.id);
        const errorElement = document.getElementById(field.errorId);
        const iconElement = errorElement.querySelector('.error-icon');
        element.addEventListener('change', () => {
            if (element.value === field.defaultValue || element.value.trim() === '') {

                errorElement.innerHTML = `<i class="fas fa-exclamation-circle error-icon"></i> ${field.message}`;
                errorElement.classList.add('show-error');
                iconElement.classList.add('show-icon');
                element.classList.add('error-background');
                errorElement.style.display = 'block';
                iconElement.style.display = 'inline-block';
                isValid = false;
            } else {

                errorElement.classList.remove('show-error');
                iconElement.classList.remove('show-icon');
                element.classList.remove('error-background');
                errorElement.innerHTML = '';
                iconElement.style.display = 'none';
                isValid = false;
            }
        });
        if (element.value === field.defaultValue || element.value.trim() === '') {
            errorElement.innerHTML = `<i class="fas fa-exclamation-circle error-icon"></i> ${field.message}`;
            errorElement.classList.add('show-error');
            iconElement.classList.add('show-icon');
            element.classList.add('error-background');
            errorElement.style.display = 'block';
            iconElement.style.display = 'inline-block';
        }
    });


    if (isValid) {
        customAlert({
            title: "Thông báo",
            message: data.message || "Dữ liệu hợp lệ! Thực hiện lưu thông tin.",
            type: "success",
            duration: 3000,
        });

        // Lấy giá trị từ form
        const formData = {
            MaNhanVien: document.getElementById("manv").value.trim(),
            HoTen: document.getElementById("ten").value.trim(),
            CCCD: document.getElementById("cccd").value.trim(),
            MaPhongBan: document.getElementById("phongban").value.trim(),
            DiaChi: document.getElementById("noisinh").value.trim(),
            NgaySinh: document.getElementById("ngaysinh").value.trim(),
            GioiTinh: document.getElementById("gioitinh").options[document.getElementById("gioitinh").selectedIndex].text.trim(),
            SoDienThoai: document.getElementById("sodienthoai").value.trim(),
            DanToc: document.getElementById("dantoc").value.trim(),
            NgayBatDauLam: document.getElementById("ngayvaolam").value.trim(),
            MaTrinhDo: document.getElementById("trinhdo").value.trim(),
            MaChucVu: document.getElementById("chucvu").value.trim(),
            Email: document.getElementById("email").value.trim(),
            TinhTrang: document.getElementById("tinhtrang").options[document.getElementById("tinhtrang").selectedIndex].text.trim()
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
                    customAlert({
                        title: "Thông báo",
                        message: data.message || "Lưu thành công",
                        type: "success",
                        duration: 3000,
                    });
                    fetchEmployees();
                    resetForm();
                } else {
                    customAlert({
                        message: data.message || "Lưu thất bại",
                        type: "error",
                        duration: 3000,
                    });
                }
            })
            .catch((error) => {
                console.error("Lỗi khi lưu dữ liệu:", error);
                customAlert({
                    title: "Cảnh báo",
                    message: data.message || "Có lỗi xảy ra, vui lòng thử lại.",
                    type: "warning",
                    duration: 3000,
                });
            });
    } else {
        customAlert({
            message: data.message || "Lưu thất bại, kiểm tra lại các thông tin",
            type: "error",
            duration: 3000,
        });
    }
});

// Sự kiện xóa form
document.getElementById("xoa").addEventListener("click", function (event) {
    event.preventDefault();
    resetForm();
});
// Hàm đặt lại form về trạng thái ban đầu
function resetForm() {
    document.getElementById("manv").value = '';
    document.getElementById("ten").value = '';
    document.getElementById("cccd").value = '';
    document.getElementById("phongban").value = 'Chọn phòng ban';
    document.getElementById("ngaysinh").value = '';
    document.getElementById("noisinh").value = 'Chọn tỉnh/thành phố';
    document.getElementById("gioitinh").value = 'Giới tính';
    document.getElementById("sodienthoai").value = '';
    document.getElementById("dantoc").value = 'Chọn dân tộc';
    document.getElementById("ngayvaolam").value = '';
    document.getElementById("trinhdo").value = 'Chọn trình độ';
    document.getElementById("chucvu").value = 'Chọn chức vụ';
    document.getElementById("email").value = '';
    document.getElementById("tinhtrang").value = 'Chọn tình trạng';
    const errorElements = document.querySelectorAll('.error-message');
    const errorIcons = document.querySelectorAll('.error-icon');
    errorElements.forEach(element => {
        element.style.display = 'none';
        element.classList.remove('show-error');
    });
    errorIcons.forEach(icon => {
        icon.style.display = 'none';
        icon.classList.remove('show-icon');
    });


    const formElements = document.querySelectorAll('input, select');
    formElements.forEach(element => {
        element.classList.remove('error-background');
    });
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
    tableBody.innerHTML = '';

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
                    </ul>
                </td>
            `;

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
        success: function (responseData) {
            console.log('Dữ liệu nhận được:', responseData);
            if (responseData.error) {
                console.error('Lỗi từ server:', responseData.error);
            } else {
                data = responseData;
                calculateTotalPages();
                updateTable();
                updatePagination();
                updatePageInfo();
                renderTable(data);
            }
        },
        error: function (xhr, status, error) {
            console.error('Lỗi khi gọi API:', error);
        }
    });
}
$(document).ready(function () {
    console.log('Trang đã tải xong, gọi fetchEmployees');
    fetchEmployees();
});
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
        customAlert({
            message: "Mã nhân viên không hợp lệ! " + data.message,
            type: "error",
            duration: 3000,
        });
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
                    customAlert({
                        title: "Thông báo",
                        message: data.message || "Nhân viên đã xóa thành công!",
                        type: "success",
                        duration: 4000
                    });
                    // Xóa dòng dữ liệu khỏi bảng
                    const row = document.getElementById(`data-manv-${maNhanVien}`);
                    if (row) {
                        row.remove();
                    }
                } else {
                    customAlert({
                        title: "Thông báo",
                        message: data.message || "Xóa thất bại",
                        type: "error",
                        duration: 3000,
                    });
                }
            })
            .catch(error => {
                console.error("Error:", error);
                customAlert({
                    message: data.message || "Có lỗi xảy ra trong quá trình xóa nhân viên.",
                    type: "error",
                    duration: 4000
                });

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

    fetch(`/Nhanvien/GetEmployeeDetail?employeeId=${manv}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            if (!data || data.error) {
                console.log(data);
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
                        <img src="${data.HinhAnh || '/Content/img/default-avt.jpg'}" alt="Profile Picture" class="profile-pic">
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
    if (detailPanel) detailPanel.classList.remove('show');
    if (filterPanel) filterPanel.classList.remove('show');

    updatePanelHeight();
    const employeeId = event.target.closest('.table-row').getAttribute('data-manv');


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
                customAlert({
                    title: "Thông báo",
                    message: "Không tìm thấy thông tin nhân viên." + data.message,
                    type: "error",
                    duration: 4000
                });

            }
        })
        .catch(error => {
            console.error('Lỗi khi gọi API:', error);
            customAlert({
                title: "Cảnh báo",
                message: "Đã xảy ra lỗi. Vui lòng thử lại!" + data.message,
                type: "warning",
                duration: 4000
            });

        })
        .finally(() => {

            // document.getElementById('formPanel').classList.remove('loading);
        });
}
document.getElementById("saveedit").addEventListener("click", function (event) {
    event.preventDefault();

    let isValid = true;
    const fieldValidations = [
        {
            id: 'manvedit',
            errorId: 'manvedit-error',
            emptyMessage: 'Mã nhân viên không được để trống.',
            validator: value => value.trim() !== ''
        },
        {
            id: 'tenedit',
            errorId: 'tenedit-error',
            emptyMessage: 'Họ và tên không được để trống.',
            validator: value => value.trim() !== ''
        },
        {
            id: 'cccdedit',
            errorId: 'cccdedit-error',
            message: 'Bạn cần nhập đúng định dạng số CCCD.',
            emptyMessage: 'CCCD không được để trống.',
            validator: value => /^[0-9]{12}$/.test(value.trim())
        },
        {
            id: 'emailedit',
            errorId: 'emailedit-error',
            message: 'Email không đúng định dạng.',
            emptyMessage: 'Email không được để trống.',
            validator: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
        },
        {
            id: 'ngaysinhedit',
            errorId: 'ngaysinhedit-error',
            emptyMessage: 'Ngày sinh không được để trống.',
            validator: value => value.trim() !== ''
        },
        {
            id: 'sodienthoaiedit',
            errorId: 'sodienthoaiedit-error',
            message: 'Số điện thoại không đúng định dạng.',
            emptyMessage: 'Số điện thoại không được để trống.',
            validator: value => /^[0-9]{10}$/.test(value.trim())
        },
    ];


    fieldValidations.forEach(field => {
        const element = document.getElementById(field.id);
        const errorElement = document.getElementById(field.errorId);
        const iconElement = errorElement.querySelector('.error-icon');

        // Hàm kiểm tra lỗi cho mỗi trường
        function checkError() {
            const value = element.value.trim();


            if (value === '' || value === field.defaultValue) {
                errorElement.innerHTML = `<i class="fas fa-exclamation-circle error-icon"></i> ${field.emptyMessage}`;
                errorElement.style.display = 'block';
                errorElement.classList.add('show-error');
                iconElement.classList.add('show-icon');
                element.classList.add('error-background');
                iconElement.style.display = 'inline-block';
                isValid = false;
            } else if (!field.validator(value)) {

                errorElement.innerHTML = `<i class="fas fa-exclamation-circle error-icon"></i> ${field.message}`;
                errorElement.style.display = 'block';
                errorElement.classList.add('show-error');
                iconElement.classList.add('show-icon');
                element.classList.add('error-background');
                iconElement.style.display = 'inline-block';
                isValid = false;
            } else {

                errorElement.classList.remove('show-error');
                element.classList.remove('error-background');
                errorElement.innerHTML = '';

            }
        }
        checkError();
        element.addEventListener('input', checkError);
    });

    const dropdownValidations = [
        {
            id: 'phongbanedit', errorId: 'phongbanedit-error', defaultValue: 'Chọn phòng ban', message: 'Vui lòng chọn phòng ban.'
        },
        { id: 'gioitinhedit', errorId: 'gioitinhedit-error', defaultValue: 'Giới tính', message: 'Vui lòng chọn giới tính.' },
        { id: 'noisinhedit', errorId: 'noisinhedit-error', defaultValue: '', message: 'Vui lòng chọn nơi sinh.' },
        { id: 'dantocedit', errorId: 'dantocedit-error', defaultValue: '', message: 'Vui lòng chọn dân tộc.' },
        { id: 'trinhdoedit', errorId: 'trinhdoedit-error', defaultValue: 'Chọn trình độ', message: 'Vui lòng chọn trình độ học vấn.' },
        { id: 'chucvuedit', errorId: 'chucvuedit-error', defaultValue: 'Chọn chức vụ', message: 'Vui lòng chọn chức vụ.' },
        { id: 'tinhtrangedit', errorId: 'tinhtrangedit-error', defaultValue: 'Tình trạng', message: 'Vui lòng chọn tình trạng.' },
        { id: 'ngayvaolamedit', errorId: 'ngayvaolamedit-error', defaultValue: '', message: 'Ngày bắt đầu làm không được để trống.' }
    ];


    dropdownValidations.forEach(field => {
        const element = document.getElementById(field.id);
        const errorElement = document.getElementById(field.errorId);
        const iconElement = errorElement.querySelector('.error-icon');
        element.addEventListener('change', () => {
            if (element.value === field.defaultValue || element.value.trim() === '') {

                errorElement.innerHTML = `<i class="fas fa-exclamation-circle error-icon"></i> ${field.message}`;
                errorElement.classList.add('show-error');
                iconElement.classList.add('show-icon');
                element.classList.add('error-background');
                errorElement.style.display = 'block';
                iconElement.style.display = 'inline-block';
                isValid = false;
            } else {

                errorElement.classList.remove('show-error');
                iconElement.classList.remove('show-icon');
                element.classList.remove('error-background');
                errorElement.innerHTML = '';
                iconElement.style.display = 'none';
                isValid = false;
            }
        });
        if (element.value === field.defaultValue || element.value.trim() === '') {
            errorElement.innerHTML = `<i class="fas fa-exclamation-circle error-icon"></i> ${field.message}`;
            errorElement.classList.add('show-error');
            iconElement.classList.add('show-icon');
            element.classList.add('error-background');
            errorElement.style.display = 'block';
            iconElement.style.display = 'inline-block';
        }
    });
    if (isValid) {
        customAlert({
            message: data.message || "Dữ liệu hợp lệ! Thực hiện lưu thông tin.",
            type: "success",
            duration: 3000,
        });
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
                    customAlert({
                        title: "Thông báo",
                        message: data.message || "Cập nhật thành công!",
                        type: "success",
                        duration: 4000
                    });
                    fetchEmployees();
                } else {
                    customAlert({
                        title: "Thông báo",
                        message: "Cập nhật thất bại!" || data.message,
                        type: "error",
                        duration: 4000
                    });
                }
            })
            .catch(error => {
                console.error("Error:", error);
                customAlert({
                    title: "Cảnh báo",
                    message: "Có lỗi xảy ra trong quá trình lưu thông tin." || data.message,
                    type: "warning",
                    duration: 5000
                });
            });
    } else {
        customAlert({
            message: data.message || "Lưu thất bại, kiểm tra lại các thông tin",
            type: "error",
            duration: 3000,
        });
    }

});
// Đóng form panel
document.getElementById("closePanel1").addEventListener("click", function () {
    formPanel.classList.remove("show");
    mainContent.classList.remove("panel-active");
});

window.addEventListener("resize", updatePanelHeight);

document.querySelector('.btn-delete').addEventListener('click', () => {
    customAlert({
        message: data.message || "Reset thành công!",
        type: "success",
        duration: 4000
    });
});
document.getElementById("resetedit").addEventListener("click", function () {
    
    const form = document.querySelector('form');
    form.reset();  

   
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(error => {
        error.classList.remove('show-error');
        error.innerHTML = '';
    });

    const errorIcons = document.querySelectorAll('.error-icon');
    errorIcons.forEach(icon => {
        icon.classList.remove('show-icon');
    });

   
    const errorFields = document.querySelectorAll('.error-background');
    errorFields.forEach(field => {
        field.classList.remove('error-background');
    });
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
    const phongbanSelect = document.getElementById('department-filter');
    const chucvuSelect = document.getElementById('position-filter');
    filterPanel.classList.add("show");
    mainContent.classList.add("panel-active");
    if (formPanel) { formPanel.classList.remove("show"); }
    if (rightPanel) { rightPanel.classList.remove("show"); }
    if (detailPanel) { detailPanel.classList.remove("show"); }
    updatePanelHeight();
    fetch('/Nhanvien/GetDanhSach')
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi gọi API!');
            }
            return response.json();
        }).then(data => {
            console.log('Fetched Data:', data);
            updateSelectOptions1(phongbanSelect, data.phongBan, 'MaPhongBan', 'TenPhongBan');
            updateSelectOptions1(chucvuSelect, data.chucVu, 'MaChucVu', 'TenChucVu');
        }).catch(error => {
            console.error('Lỗi khi lấy dữ liệu:', error);
            alert('Lỗi khi lấy dữ liệu: ' + error.message);
        });
});
function updateSelectOptions1(selectElement, data, valueField, textField) {
    if (!data || !Array.isArray(data)) { console.error('Data is undefined or not an array:', data); return; }
    selectElement.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.text = `Chọn ${selectElement.title}`;
    defaultOption.selected = true;
    defaultOption.disabled = true;
    selectElement.appendChild(defaultOption);
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item[valueField];
        option.text = item[textField];
        selectElement.appendChild(option);
    });
}
closeFilterButton.addEventListener("click", () => {
    filterPanel.classList.remove("show");
    mainContent.classList.remove("panel-active");
});


//function selectFilter(element, filterType, filterValue) {
function selectFilter(element, filterType) {
    if (!element) {
        console.error(`Element not found for ${filterType}`);
        return null;
    }
    const options = document.querySelectorAll(`#${filterType}-filter .filter-option`);
    options.forEach(option => {
        option.classList.remove('selected');
        option.classList.remove('active');
    });
    element.classList.add('selected');
    element.classList.add('active');
    const selectedText = element.textContent.trim();
    console.log(`Selected ${filterType}: ${selectedText}`);
    return selectedText;
}
// Cập nhật khoảng độ tuổi
function updateAgeRange() {
    const minAge = document.getElementById('age-min').value;
    const maxAge = document.getElementById('age-max').value;
    if (parseInt(minAge) > parseInt(maxAge)) {
        document.getElementById('age-max').value = minAge;
    }
}

document.getElementById('SubmitFilterPanel').addEventListener('click', () => {
    const timeFilterElement = document.querySelector('#time-filter .selected');
    const genderFilterElement = document.querySelector('#gender-filter .selected');
    const departmentFilterElement = document.getElementById('department-filter');
    const positionFilterElement = document.getElementById('position-filter');
    const ageMinElement = document.getElementById('age-min');
    const ageMaxElement = document.getElementById('age-max');
    const statusFilterElement = document.querySelector('input[name="status"]:checked');

    const timeFilterValue = timeFilterElement ? timeFilterElement.dataset.value : null;
    const genderFilterValue = genderFilterElement ? genderFilterElement.textContent.trim() : null
    const filters = new URLSearchParams();
    if (timeFilterValue) filters.append('time', timeFilterValue);
    if (genderFilterValue) {
        console.log('Selected gender:', genderFilterValue);
        filters.append('gender', genderFilterValue);
    }
    if (departmentFilterElement && departmentFilterElement.value !== 'Chọn phòng ban') filters.append('department', departmentFilterElement.value);
    if (positionFilterElement && positionFilterElement.value !== 'Chọn chức vụ') filters.append('position', positionFilterElement.value);
    if (ageMinElement && ageMinElement.value !== '18') filters.append('ageMin', ageMinElement.value);
    if (ageMaxElement && ageMaxElement.value !== '62') filters.append('ageMax', ageMaxElement.value);
    if (statusFilterElement) {
        const statusText = statusFilterElement.closest('label').textContent.trim();
        filters.append('status', statusText);
    }

    console.log('Filters:', filters.toString());

    fetch(`/Nhanvien/GetEmployeeFilter?${filters.toString()}`)
        .then(response => response.json())
        .then(data => {
            console.log('Filtered Data:', data);
            if (Array.isArray(data)) {
                customAlert({
                    title: "Thông báo",
                    message: data.message || "Đã tìm kiếm thành công!",
                    type: "success",
                    duration: 4000
                });
                resetFilter();
                renderTable(data);
            } else {
                console.error('Fetched data is not an array:', data);
            }
        })
        .catch(error => console.error('Error fetching filtered data:', error));
});

function resetFilter() {
    document.querySelectorAll('.filter-option').forEach(option => { option.classList.remove('selected', 'active'); });
    document.getElementById('department-filter').value = 'Chọn phòng ban';
    document.getElementById('position-filter').value = 'Chọn chức vụ';
    document.getElementById('age-min').value = '18'; document.getElementById('age-max').value = '62';
    document.querySelectorAll('input[name="status"]')
        .forEach(radio => {
            radio.checked = false;
        });
}





