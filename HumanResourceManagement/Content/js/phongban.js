
const openPanelButton = document.getElementById("openPanel");

const closePanelButton = document.getElementById("closePanel");
const rightPanel = document.getElementById("rightPanel");
const mainContent = document.querySelector(".main-section");
const tableBody = document.getElementById('table-body');
const filterPanel = document.getElementById('filterPanel');
const openFilterButton = document.getElementById('openFilter');
const closeFilterButton = document.getElementById('closeFilterPanel');



//const data = [
//    { id: "PB01", department: "Khoa ngoại ngữ" },
//    { id: "PB02", department: "Khoa Tin học" },
//];

function updatePanelHeight() {
    const mainSectionHeight = mainContent.offsetHeight;
    rightPanel.style.height = `${mainSectionHeight}px`;
    formPanel.style.height = `${mainSectionHeight}px`;
    filterPanel.style.height = `${mainSectionHeight}px`;
}

//Addpanel
openPanelButton.addEventListener("click", () => {
    rightPanel.classList.add("show");
    mainContent.classList.add("panel-active");
    fetch('/Phongban/GetDanhSach') // URL phải đúng với API backend
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi gọi API!');
            }
            return response.json();
        })
      
        .catch(error => console.error('Lỗi khi lấy dữ liệu:', error));

    if (formPanel) formPanel.classList.remove('show');
    if (filterPanel) filterPanel.classList.remove('show');

    updatePanelHeight();
});


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

document.getElementById("xoa").addEventListener("click", function (event) {
    event.preventDefault();
    resetForm(); // Đặt lại form
});

function resetForm() {
    document.getElementById("mapb").value = '';
    document.getElementById("tenphongban").value = '';
    document.getElementById("mota").value = '';
  
}


closePanelButton.addEventListener("click", () => {
    rightPanel.classList.remove("show");
    mainContent.classList.remove("panel-active");
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
    updatePanelHeight();
});

closeFilterButton.addEventListener("click", () => {
    filterPanel.classList.remove("show");
    mainContent.classList.remove("panel-active");
});

function renderTable(data) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // Clear previous table data
    if (data && data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">Không có dữ liệu</td></tr>';
    } else {
        data.forEach((item) => {
            const row = document.createElement('tr');
            row.classList.add('table-row');
            row.setAttribute('data-mapb', item.MaPhongBan);
            row.innerHTML = `
                <td>${item.TenPhongBan}</td> 
                <td>${item.SoLuongNhanVien}</td> 
                <td>${item.MoTa}</td>
                <td>
                    <span class="three-dots" onclick="toggleDropdown(event)">
                        <img src="/Content/img/ri_more-2-fill.png" alt="3-dot" class="icon-dot">
                    </span>
                    <ul class="dropdown-menu" style="display: none;">
                        <li><a href="#" class="edit-option" onclick="openEditPanel(event)">Sửa</a></li>
                        <li><a href="#" class="delete-option" onclick="deleteDepartment(event, '${item.MaPhongBan}')">Xóa</a></li>
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
                const mapb = this.getAttribute('data-mapb');
                showDetailPanel(manv);
            });

            tableBody.appendChild(row);
        });
    }
}

function fetchDepartment() {
    $.ajax({
        url: '/Phongban/GetPhongBan',
        method: 'GET',
        success: function (data) {
            console.log('Dữ liệu nhận được:', data);
            if (data && data.length > 0) {
                renderTable(data);  // Gọi hàm renderTable với dữ liệu API
            } else {
                alert('Không có dữ liệu phòng ban.');
            }
        },
        error: function (xhr, status, error) {
            console.error('Lỗi khi gọi API:', error);
            alert('Có lỗi xảy ra khi tải dữ liệu.');
        }
    });
}

$(document).ready(function () {
    fetchDepartment();
});

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


//document.addEventListener('DOMContentLoaded', function () {
//    fetchDepartment();  // Gọi hàm fetchDepartment để tải dữ liệu và render bảng
//});
function deleteDepartment(event, maPhongBan) {
    event.stopPropagation();

    if (!maPhongBan) {
        console.error("Mã phòng ban không hợp lệ!");
        alert("Mã phòng ban không hợp lệ!");
        return;
    }

    if (confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
        fetch(`/PhongbanController/DeletePhongBan?maPhongBan=${encodeURIComponent(maPhongBan)}`, {
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
                    alert("Phòng ban đã được xóa thành công!");
                    // Xóa dòng dữ liệu khỏi bảng
                    const row = document.getElementById(`data-mapb-${maPhongBan}`);
                    if (row) {
                        row.remove();
                    }
                } else {
                    alert(`Không thể xóa: ${data.message}`);
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Có lỗi xảy ra trong quá trình xóa phòng ban.");
            });
        console.log(`/PhongbanController/DeletePhongBan?maPhongBan=${encodeURIComponent(maPhongBan)}`);

    }
}
document.addEventListener('click', (event) => {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        if (!menu.contains(event.target) && !event.target.closest('.three-dots') && !event.target.closest('.btn-menu')) {
            menu.style.display = 'none';
        }
    });
});


    function openEditPanel(event) {
        event.preventDefault();
        formPanel.classList.add('show');
        mainContent.classList.add("panel-active");
        updatePanelHeight();
        if (rightPanel) {
            rightPanel.classList.remove('show');
        }
        if (filterPanel) {
            filterPanel.classList.remove('show');
        }
        updatePanelHeight();
        const departmentId = event.target.closest('.table-row').id.replace('data-mapb-', '');
        fetch('/Phongban/GetDanhSach')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Lỗi khi gọi API danh sách!');
                }
                return response.json();
            })
            .then(data => {
                
                // Lấy thông tin nhân viên từ API
                return fetch(`Phongban/GetDepartment?departmentId=${departmentId}`);
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Lỗi khi gọi API lấy thông tin phòng ban!');
                }
                return response.json();
            })
            .then(data => {
                // Kiểm tra dữ liệu trả về
                if (data.MaNhanVien) {
                    // Điền các thông tin vào các form
                    document.getElementById('mapbedit').value = data.MaPhongBan || '';
                    document.getElementById('tenpbedit').value = data.TenPhongBan || '';
                    document.getElementById('motanedit').value = data.MoTa || '';
                   

                    // Hiển thị form

                } else {
                    console.error('Không tìm thấy dữ liệu phòng ban.');
                    alert('Không tìm thấy thông tin phòng ban.');
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
        MaPhongBan: document.getElementById('mapbedit').value,
        TenPhongBan: document.getElementById('tenpbedit').value,
        MoTa: document.getElementById('motaedit').value,
           };

    // Gửi dữ liệu lên server (thực hiện Post request tới UpdateNhanVien)
    fetch('/Phongban/UpdatePhongban', {
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


//function renderTable(data) {
//    tableBody.innerHTML = '';
//    if (data.length === 0) {
//        tableBody.innerHTML = '<tr><td colspan="3">Không có dữ liệu</td></tr>';
//    } else {
//        data.forEach((item) => {
//            const row = document.createElement('tr');
//            row.classList.add('table-row');
//            row.id = `data-mapb-${item.mapb}`;
//            row.innerHTML = `
//                <td>${item.id}</td>
//                <td>${item.department}</td>
//                <td>
//                    <span class="three-dots" onclick="toggleDropdown(event)">
//                        <img src="/Content/img/ri_more-2-fill.png" alt="3-dot" class="icon-dot">
//                    </span>
//                    <ul class="dropdown-menu" style="display: none;">
//                        <li><a href="#" class="edit-option" onclick="openEditPanel(event)">Sửa</a></li>
//                        <li><a href="#" class="delete-option">Xóa</a></li>
//                    </ul>
//                </td>
//            `;

//            tableBody.appendChild(row);
//        });
//    }
//}


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



window.addEventListener("resize", updatePanelHeight);




document.querySelector('.btn-save').addEventListener('click', () => {
    alert('Lưu thành công!');
});

document.querySelector('.btn-delete').addEventListener('click', () => {
    alert('Đã xóa!');
});

function selectFilter(element, value) {
    const parent = element.parentNode;
    const options = parent.querySelectorAll('.filter-option');

    options.forEach(option => option.classList.remove('active'));


    element.classList.add('active');

    console.log(`Filter selected: ${value}`);
}

$(document).ready(function () {
    // Gửi yêu cầu để lấy danh sách phòng ban
    $.ajax({
        url: '/Phongban/GetAllDepartments', // Đảm bảo đường dẫn này đúng với controller và action
        type: 'GET',
        success: function (response) {
            // Xử lý thành công
            if (response.error) {
                console.error("Lỗi: " + response.error);
            } else {
                // Xóa các option cũ
                $('#department-filter').empty();

                // Thêm option "Tất cả"
                $('#department-filter').append('<option value="all">Tất cả</option>');

                // Thêm các phòng ban vào dropdown
                $.each(response, function (index, department) {
                    $('#department-filter').append('<option value="' + department.MaPhongBan + '">' + department.TenPhongBan + '</option>');
                });
            }
        },
        error: function (xhr, status, error) {
            console.error("Lỗi khi lấy dữ liệu: " + error);
        }
    });

    // Xử lý sự kiện khi nhấn "Xác nhận" (nếu cần)
    $('#SubmitFilterPanel').click(function () {
        var selectedDepartment = $('#department-filter').val();
        console.log('Phòng ban đã chọn: ' + selectedDepartment);
        // Xử lý tiếp theo (như lọc dữ liệu)
    });
});

