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
            console.log("Dữ liệu truyền vào renderTable:", data);
            tableBody.appendChild(row);
        });
    }
}

fetch('/PhongBan/GetPhongBan')
    .then(response => {
        if (!response.ok) {
            throw new Error('API không trả về thành công');
        }
        return response.json();
    })
    .then(data => {
        console.log("Phản hồi từ API:", data);
        renderTable(data);
    })
    .catch(error => {
        console.error("Lỗi khi lấy dữ liệu:", error);
    });
document.getElementById("save").addEventListener("click", function (event) {
    event.preventDefault();

    const formData = {
        MaPhongBan: document.getElementById("mapb").value.trim(),
        TenPhongBan: document.getElementById("tenpb").value.trim(),
        MoTa: document.getElementById("mota").value.trim(),
    };
    console.log(formData);
    // Gửi dữ liệu lên server
    fetch("/PhongBan/LuuPhongBan", {
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
        .catch((error) => {
            console.error("Lỗi khi lưu dữ liệu:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại.");
        });
});
function resetForm() {
    document.getElementById("mapb").value = '';
    document.getElementById("tenpb").value = '';
    document.getElementById("mota").value = '';
}


// Mở Edit Panel
function openEditPanel(event) {
    event.preventDefault();

    // Hiển thị form panel và điều chỉnh các panel khác
    const formPanel = document.getElementById('formPanel');
    if (formPanel) formPanel.classList.add('show');
    if (mainContent) mainContent.classList.add("panel-active");

    const rightPanel = document.getElementById('right-panel');
    if (rightPanel) rightPanel.classList.remove('show');

    const filterPanel = document.getElementById('filter-panel');
    if (filterPanel) filterPanel.classList.remove('show');

    const detailPanel = document.getElementById('detail-panel');
    if (detailPanel) detailPanel.classList.remove('show');

    updatePanelHeight();

   
    const departmentId = event.target.closest('.table-row').getAttribute('data-mapb');
    if (!departmentId) {
        console.error('No department ID found.');
        alert('Không tìm thấy mã phòng ban.');
        return;
    }

    
    fetch(`/PhongBan/Getdepartment?departmentID=${departmentId}`)
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
                alert('Không tìm thấy thông tin phòng ban.');
            }
        })
        .catch(error => {
            console.error('Error fetching department data:', error);
            alert('Đã xảy ra lỗi khi tải thông tin phòng ban.');
        });

    fetch(`/PhongBan/GetEmployeeNumber?maPhongBan=${maPhongBan}`)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP status ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.success) {
                console.log("Department data:", data.data);
                document.getElementById('mapbedit').value = data.data.MaPhongBan || '';
                document.getElementById('tenpbedit').value = data.data.TenPhongBan || '';
                document.getElementById('motaedit').value = data.data.MoTa || '';
                document.getElementById('soluong').textContent = `Số lượng nhân viên: ${data.data.SoLuongNhanVien}`;
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error fetching employee count:', error);
            alert('Đã xảy ra lỗi khi tải số lượng nhân viên.');
        });
}
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
        alert('Mã phòng ban và tên phòng ban không được để trống.');
        return;
    }

    
    fetch('/PhongBan/UpdatePhongBan', {
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
                alert('Cập nhật thành công!');
                
            } else {
                alert(`Cập nhật thất bại: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error updating department:', error);
            alert('Đã xảy ra lỗi trong quá trình lưu thông tin.');
        });
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


document.addEventListener('click', (event) => {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        if (!menu.contains(event.target) && !event.target.closest('.three-dots') && !event.target.closest('.btn-menu')) {
            menu.style.display = 'none';
        }
    });
});
window.addEventListener("resize", updatePanelHeight);



document.querySelector('.btn-delete').addEventListener('click', () => {
    alert('Đã xóa!');
});
