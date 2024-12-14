
const openPanelButton = document.getElementById("openPanel");

const closePanelButton = document.getElementById("closePanel");
const rightPanel = document.getElementById("rightPanel");
const mainContent = document.querySelector(".main-section");
const tableBody = document.getElementById('table-body');
const filterPanel = document.getElementById('filterPanel');
const openFilterButton = document.getElementById('openFilter');
const closeFilterButton = document.getElementById('closeFilterPanel');

function updatePanelHeight() {
    const mainSectionHeight = mainContent.offsetHeight;
    rightPanel.style.height = `${mainSectionHeight}px`;
    formPanel.style.height = `${mainSectionHeight}px`;
    filterPanel.style.height = `${mainSectionHeight}px`;
}

//Addpanel

openPanelButton.addEventListener("click", () => {
    const maPhongBanInput = document.getElementById('mapb');
    const soluongInput = document.getElementById('soluong');

    rightPanel.classList.add("show");
    mainContent.classList.add("panel-active");

    if (formPanel) {
        formPanel.classList.remove('show');
    }
    if (filterPanel) {
        filterPanel.classList.remove('show');
    }



    updatePanelHeight();
});

function openEditPanel(event) {

    event.preventDefault();
    // Hiển thị form panel và điều chỉnh các panel khác
    const formPanel = document.getElementById('formPanel');
    if (formPanel) formPanel.classList.add('show');
    if (mainContent) mainContent.classList.add("panel-active");

    //const rightPanel = document.getElementById('right-panel');
    if (rightPanel) rightPanel.classList.remove('show');

    //const filterPanel = document.getElementById('filter-panel');
    if (filterPanel) filterPanel.classList.remove('show');

    //const detailPanel = document.getElementById('detail-panel');
    //if (detailPanel) detailPanel.classList.remove('show');

    updatePanelHeight();

    const departmentId = event.target.closest('.table-row').getAttribute('data-mapb');
    if (!departmentId) {
        console.error('No department ID found.');
        Swal.fire({
            icon: 'error',
            title: 'Thông báo',
            text: 'Không tìm thấy mã phòng ban.',
        });
        return;
    }
    fetch(`/Phongban/Getdepartment?departmentID=${departmentId}`)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP status ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data && data.MaPhongBan) {
                document.getElementById('mapbedit').value = data.MaPhongBan || '';
                document.getElementById('tenpbedit').value = data.TenPhongBan || '';
                document.getElementById('motaedit').value = data.MoTa || '';
            } else {
                console.error('Department data not found.');
                Swal.fire({
                    icon: 'error',
                    title: 'Thông báo',
                    text: 'Không tìm thấy thông tin phòng ban.',
                });
            }
        })
        .catch(error => {
            console.error('Error fetching department data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Thông báo',
                text: 'Đã xảy ra lỗi khi tải thông tin phòng ban.',
            });
        });

    fetch(`/Phongban/GetEmployeeNumber?departmentID=${departmentId}`)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP status ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.success) {
                console.log("Department data:", data);
                document.getElementById('mapbedit').value = data.MaPhongBan || '';
                document.getElementById('tenpbedit').value = data.TenPhongBan || '';
                document.getElementById('soluong').value = data.count || 0;
                document.getElementById('motaedit').value = data.MoTa || '';
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Thông báo',
                    text: data.message,
                });
            }
        })
        .catch(error => {
            console.error('Error fetching employee count:', error);
            Swal.fire({
                icon: 'error',
                title: 'Thông báo',
                text: 'Đã xảy ra lỗi khi tải số lượng nhân viên.',
            });
        });
}

closePanelButton.addEventListener("click", () => {
    rightPanel.classList.remove("show");
    mainContent.classList.remove("panel-active");
});

// Filterpanel
openFilterButton.addEventListener("click", () => {
    filterPanel.classList.add("show");
    mainContent.classList.add("panel-active");
    //const rightPanel = document.getElementById('right-panel');
    if (rightPanel) rightPanel.classList.remove('show');
    if (formPanel) formPanel.classList.remove('show');

    //const detailPanel = document.getElementById('detail-panel');
    //if (detailPanel) detailPanel.classList.remove('show');
    updatePanelHeight();
});

closeFilterButton.addEventListener("click", () => {
    filterPanel.classList.remove("show");
    mainContent.classList.remove("panel-active");

});
function getFilterDepartment() {
    document.addEventListener('DOMContentLoaded', function () {
        // Gọi API để lấy danh sách phòng ban khi tải trang
        fetch('/Phongban/GetDepartmentNames')
            .then(response => response.json())
            .then(data => {
                const departmentFilter = document.getElementById('department-filter');

                if (data.error) {
                    console.error('Error:', data.error);
                    return;
                }

                // Thêm các option vào select
                data.forEach(department => {
                    const option = document.createElement('option');
                    option.value = department.MaPhongBan;
                    option.textContent = department.TenPhongBan;
                    departmentFilter.appendChild(option);
                });
            })
            .catch(error => console.error('Lỗi khi tải danh sách phòng ban:', error));
    });
}

//getFilterDepartment();
function updateDepartmentFilterDropdown() {
    const departmentFilter = document.getElementById('department-filter');
    // Xóa các option hiện tại
    departmentFilter.innerHTML = '';
    // Gọi API để lấy danh sách phòng ban
    fetch('/Phongban/GetDepartmentNames')
        .then(response => {
            if (!response.ok) {
                throw new Error('Không thể lấy danh sách phòng ban.');
            }
            return response.json();
        })
        .then(data => {
            // Thêm tùy chọn "Tất cả"
            const allOption = document.createElement('option');
            allOption.value = 'all';
            allOption.textContent = 'Tất cả';
            departmentFilter.appendChild(allOption);

            // Thêm các tùy chọn phòng ban
            data.forEach(department => {
                const option = document.createElement('option');
                option.value = department.MaPhongBan;
                option.textContent = department.TenPhongBan;
                departmentFilter.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Lỗi khi cập nhật dropdown lọc:', error);
        });
}

function renderTable(data) {
    tableBody.innerHTML = '';
    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">Không có dữ liệu</td></tr>';
    } else {
        data.forEach((item) => {
            const row = document.createElement('tr');
            row.classList.add('table-row');
            row.setAttribute('data-mapb', item.MaPhongBan);
            row.innerHTML = `
                <td>${item.MaPhongBan}</td>
                <td>${item.TenPhongBan}</td>
                <td>${item.SoLuongNhanVien}</td>
                <td>${item.MoTa}</td>
                <td>
                    <span class="three-dots" onclick="toggleDropdown(event)">
                        <img src="/Content/img/ri_more-2-fill.png" alt="3-dot" class="icon-dot">
                    </span>
                    <ul class="dropdown-menu" style="display: none;">
                        <li><a href="#" class="edit-option" onclick="openEditPanel(event)">Sửa</a></li>
                    </ul>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}
function loadDepartment() {
    fetch('/Phongban/GetPhongBan')
        .then(response => {
            if (!response.ok) {
                throw new Error('API không trả về thành công');
            }
            return response.json();  // Chuyển đổi response thành đối tượng JSON
        })
        .then(data => {
            console.log("Dữ liệu trả về:", data);  // Kiểm tra dữ liệu trả về trong console

            // Kiểm tra nếu data là mảng
            if (Array.isArray(data)) {
                renderTable(data);
                updateDepartmentFilterDropdown();

            }
            // Kiểm tra nếu data là đối tượng và có trường 'items' là mảng
            else if (data.items && Array.isArray(data.items)) {
                renderTable(data.items);
                updateDepartmentFilterDropdown();
            }
            // Kiểm tra nếu data là đối tượng và có các thuộc tính khác
            else if (data.error) {
                console.error("Lỗi từ API:", data.error);
            }
            else {
                console.error("Dữ liệu trả về không phải mảng hoặc không chứa 'items':", data);
            }
        })
        .catch(error => {
            console.error("Lỗi khi lấy dữ liệu:", error);
        });

}

loadDepartment();


document.getElementById("save").addEventListener("click", function (event) {
    event.preventDefault();

    const formData = {
        MaPhongBan: document.getElementById("mapb").value.trim(),
        TenPhongBan: document.getElementById("tenpb").value.trim(),
        MoTa: document.getElementById("mota").value.trim(),
    };
    console.log(formData);
    // Gửi dữ liệu lên server
    fetch("/Phongban/LuuPhongBan", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thông báo',
                    text: 'Lưu thành công!',
                });
                //if (data.items && Array.isArray(data.items)) {
                //renderTable(data.items);
                loadDepartment();
                resetForm();
                //}
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Thông báo',
                    text: 'Lưu thất bại: ' + data.message,
                });
            }
        })
        .catch((error) => {
            console.error("Lỗi khi lưu dữ liệu:", error);
            Swal.fire({
                icon: 'error',
                title: 'Thông báo',
                text: 'Có lỗi xảy ra, vui lòng thử lại.',
            });

        });
});
function resetForm() {
    document.getElementById("mapb").value = '';
    document.getElementById("tenpb").value = '';
    document.getElementById("mota").value = '';
}


// Mở Edit Panel
//function openEditPanel(event) {

//    event.preventDefault();
//    // Hiển thị form panel và điều chỉnh các panel khác
//    const formPanel = document.getElementById('formPanel');
//    if (formPanel) formPanel.classList.add('show');
//    if (mainContent) mainContent.classList.add("panel-active");

//    //const rightPanel = document.getElementById('right-panel');
//    if (rightPanel) rightPanel.classList.remove('show');

//    //const filterPanel = document.getElementById('filter-panel');
//    if (filterPanel) filterPanel.classList.remove('show');

//    //const detailPanel = document.getElementById('detail-panel');
//    //if (detailPanel) detailPanel.classList.remove('show');

//    updatePanelHeight();

//    const departmentId = event.target.closest('.table-row').getAttribute('data-mapb');
//    if (!departmentId) {
//        console.error('No department ID found.');
//        Swal.fire({
//            icon: 'error',
//            title: 'Thông báo',
//            text: 'Không tìm thấy mã phòng ban.',
//        });
//        return;
//    }
//    fetch(`/Phongban/Getdepartment?departmentID=${departmentId}`)
//        .then(response => {
//            if (!response.ok) throw new Error(`HTTP status ${response.status}`);
//            return response.json();
//        })
//        .then(data => {
//            if (data && data.MaPhongBan) {
//                document.getElementById('mapbedit').value = data.MaPhongBan || '';
//                document.getElementById('tenpbedit').value = data.TenPhongBan || '';
//                document.getElementById('motaedit').value = data.MoTa || '';
//            } else {
//                console.error('Department data not found.');
//                Swal.fire({
//                    icon: 'error',
//                    title: 'Thông báo',
//                    text: 'Không tìm thấy thông tin phòng ban.',
//                });
//            }
//        })
//        .catch(error => {
//            console.error('Error fetching department data:', error);
//            Swal.fire({
//                icon: 'error',
//                title: 'Thông báo',
//                text: 'Đã xảy ra lỗi khi tải thông tin phòng ban.',
//            });
//        });

//    fetch(`/Phongban/GetEmployeeNumber?departmentID=${departmentId}`)
//        .then(response => {
//            if (!response.ok) throw new Error(`HTTP status ${response.status}`);
//            return response.json();
//        })
//        .then(data => {
//            if (data.success) {
//                console.log("Department data:", data);
//                document.getElementById('mapbedit').value = data.MaPhongBan || '';
//                document.getElementById('tenpbedit').value = data.TenPhongBan || '';
//                document.getElementById('soluong').value = data.count || 0;
//                document.getElementById('motaedit').value = data.MoTa || '';
//            } else {
//                Swal.fire({
//                    icon: 'error',
//                    title: 'Thông báo',
//                    text: data.message,
//                });
//            }
//        })
//        .catch(error => {
//            console.error('Error fetching employee count:', error);
//            Swal.fire({
//                icon: 'error',
//                title: 'Thông báo',
//                text: 'Đã xảy ra lỗi khi tải số lượng nhân viên.',
//            });
//        });
//}
document.getElementById("closePanel1").addEventListener("click", function () {
    formPanel.classList.remove("show");
    mainContent.classList.remove("panel-active");
});

document.getElementById("saveedit").addEventListener("click", function (event) {
    event.preventDefault();

    const model = {
        MaPhongBan: document.getElementById('mapbedit').value.trim(),
        TenPhongBan: document.getElementById('tenpbedit').value.trim(),
        MoTa: document.getElementById('motaedit').value.trim(),
    };

    if (!model.MaPhongBan || !model.TenPhongBan) {
        Swal.fire({
            icon: 'warning',
            title: 'Thông báo',
            text: 'Mã phòng ban và tên phòng ban không được để trống.',
        });
        return;
    }


    fetch('/Phongban/UpdatePhongBan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(model)
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP status ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.success) {

                Swal.fire({
                    icon: 'success',
                    title: 'Thông báo',
                    text: 'Cập nhật thành công!',
                });
                loadDepartment(); // Cập nhật bảng


            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Thông báo',
                    text: `Cập nhật thất bại: ${data.message}`,
                });
            }
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Thông báo',
                text: 'Đã xảy ra lỗi trong quá trình lưu thông tin.',
            });
            console.error('Error updating department:', error);
        });
});
document.getElementById("xoaedit").addEventListener("click", function (event) {
    event.preventDefault();

    // Lấy mã phòng ban từ input "mapbedit"
    const departmentId = document.getElementById('mapbedit').value.trim();

    if (!departmentId) {
        Swal.fire({
            icon: 'warning',
            title: 'Thông báo',
            text: 'Mã phòng ban không được để trống.',
        });
        return;
    }

    // Kiểm tra số lượng nhân viên trước khi xóa
    checkEmployeeCount(departmentId)
        .then(count => {
            if (count > 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Thông báo',
                    text: 'Không thể xóa khi vẫn còn nhân viên trong phòng ban.',
                });
            } else {
                deleteDepartment(departmentId); // Gọi hàm xóa nếu số lượng nhân viên bằng 0
            }
        })
        .catch(error => {
            console.error("Lỗi khi kiểm tra số lượng nhân viên:", error);
            Swal.fire({
                icon: 'error',
                title: 'Thông báo',
                text: 'Đã xảy ra lỗi, vui lòng thử lại.',
            });
        });

});

// Hàm kiểm tra số lượng nhân viên trong phòng ban
function checkEmployeeCount(departmentId) {
    return fetch(`/Phongban/GetEmployeeNumber?departmentID=${departmentId}`)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP status ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.success && data.count >= 0) {
                return data.count; // Trả về số lượng nhân viên
            } else {
                throw new Error("Không thể lấy số lượng nhân viên.");
            }
        });
}
function resetFormEdit() {
    document.getElementById("mapbedit").value = '';
    document.getElementById("tenpbedit").value = '';
    document.getElementById("soluong").value = 0;
    document.getElementById("motaedit").value = '';
}
// Hàm xóa phòng ban
function deleteDepartment(departmentId) {
    Swal.fire({
        title: 'Xác nhận xóa',
        text: 'Bạn có chắc chắn muốn xóa phòng ban này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
    }).then((result) => {
        if (result.isConfirmed) {
            // Gửi yêu cầu xóa phòng ban
            fetch(`/Phongban/DeletePhongBan`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ departmentId: departmentId }),
            })
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP status ${response.status}`);
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Thông báo',
                            text: 'Xóa thành công!',
                        });
                        loadDepartment(); // Làm mới danh sách phòng ban
                        resetFormEdit()
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Thông báo',
                            text: 'Xoá thất bại.',
                        });
                    }
                })
                .catch(error => {
                    console.error("Lỗi khi xóa phòng ban:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Thông báo',
                        text: 'Đã xảy ra lỗi, vui lòng thử lại.',
                    });
                });
        }
    });
}


document.getElementById('SubmitFilterPanel').addEventListener('click', function () {
    const selectedDepartmentId = document.getElementById('department-filter').value;

    if (selectedDepartmentId === 'all') {
        loadDepartment();  // Tải tất cả phòng ban nếu chọn 'Tất cả'
    } else {
        console.log('Lọc phòng ban với ID:', selectedDepartmentId);
        // Gửi yêu cầu lọc phòng ban
        fetch(`/Phongban/FilterPhongBan?MaPhongBan=${selectedDepartmentId}`)
            .then(response => response.json())
            .then(data => {
                console.log('Danh sách phòng ban được lọc:', data);
                displayFilteredDepartments(data);  // Hiển thị kết quả lọc vào bảng
            })
            .catch(error => console.error('Lỗi khi lọc phòng ban:', error));
    }
});

// Hàm hiển thị danh sách phòng ban đã lọc vào bảng
function displayFilteredDepartments(departments) {
    // Gọi hàm renderTable để hiển thị dữ liệu
    renderTable(departments);
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
window.addEventListener("resize", updatePanelHeight);



