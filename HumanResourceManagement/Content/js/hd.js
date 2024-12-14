
const openPanelButton = document.getElementById("openPanel");
const closePanelButton = document.getElementById("closePanel");
const rightPanel = document.getElementById("rightPanel");
const mainContent = document.querySelector(".main-section");
const formPanel = document.getElementById("formPanel");
const tableBody = document.getElementById("table-body");
const filterPanel = document.getElementById("filterPanel");
const openFilterButton = document.getElementById("openFilter");
const closeFilterButton = document.getElementById("closeFilterPanel");
const contractFileInput = document.getElementById('contractFile');
const fileNameDisplay = document.getElementById('fileName');
const detailPanel = document.getElementById('detailPanel');

contractFileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            // Hiển thị thông tin tệp trên giao diện
            fileNameDisplay.textContent = `Tệp đã chọn: ${file.name}`;

            // Nếu cần hiển thị nội dung hoặc xử lý thêm thông tin
            detailPanel.textContent = `Kích thước: ${file.size} bytes\nLoại tệp: ${file.type}`;
        };

        reader.readAsDataURL(file); // Đọc tệp dưới dạng Data URL
    } else {
        fileNameDisplay.textContent = 'Không có tệp nào được chọn.';
        detailPanel.textContent = '';
    }
});



function updatePanelHeight() {
    const mainSectionHeight = mainContent.offsetHeight;
    rightPanel.style.height = `${mainSectionHeight}px`;
    formPanel.style.height = `${mainSectionHeight}px`;
    filterPanel.style.height = `${mainSectionHeight}px`;
}

// Hiển thị panel chi tiết
openPanelButton.addEventListener("click", () => {
    rightPanel.classList.add("show");
    mainContent.classList.add("panel-active");
    if (formPanel) {
        formPanel.classList.remove("show");
    }
    if (filterPanel) {
        filterPanel.classList.remove("show");
    }
    updatePanelHeight();
});

// Hiển thị bộ lọc
openFilterButton.addEventListener("click", () => {
    filterPanel.classList.add("show");
    mainContent.classList.add("panel-active");
    if (formPanel) {
        formPanel.classList.remove("show");
    }
    if (rightPanel) {
        rightPanel.classList.remove("show");
    }
    updatePanelHeight();
});

// Hiển thị form chỉnh sửa
function openEditPanel(event) {
    event.preventDefault();
    const formPanel = document.getElementById('formPanel');
    formPanel.classList.add("show");
    mainContent.classList.add("panel-active");
    updatePanelHeight();
    if (rightPanel) {
        rightPanel.classList.remove("show");
    }
    if (filterPanel) {
        filterPanel.classList.remove("show");
    }

    updatePanelHeight();

    const contractId = event.target.closest('.table-row').getAttribute('data-contract');
    if (!contractId) {
        console.error('No Contract ID found.');
        Swal.fire({
            icon: 'error',
            title: 'Thông báo',
            text: 'Không tìm thấy mã hợp đồng.',
        });
        return;
    }


    fetch(`/HopDong/Getcontract?contractId=${contractId}`)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP status ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data && data.MaHopDong) {
                document.getElementById('mahdedit').value = data.MaHopDong || '';
                document.getElementById('manvedit').value = data.MaNhanVien || '';
                document.getElementById('loaihopdongedit').value = data.LoaiHopDong === "Hợp đồng dài hạn" ? "long term-contract" : "short term-contract";
                document.getElementById('ngaybatdauedit').value = data.NgayBatDauHopDong || '';
                document.getElementById('ngayketthucedit').value = data.NgayKetThucHopDong || '';
                //document.getElementById('contractfileedit').value = data.ChiTietHopDong || '';
                const fileInput = document.getElementById('contractfileedit');
                if (fileInput && data.FileName) {
                    fileInput.value = '';
                }

            } else {
                console.error('Contract data not found.');
                Swal.fire({
                    icon: 'error',
                    title: 'Thông báo',
                    text: 'Không tìm thấy thông tin hợp đồng.',
                });
            }
        })
        .catch(error => {
            console.error('Error fetching Contract data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Thông báo',
                text: 'Đã xảy ra lỗi khi tải thông tin hợp đồng.',
            });
        });
}


document.getElementById("saveedit").addEventListener("click", function (event) {
    event.preventDefault();


    const model = {
        MaHopDong: document.getElementById('mahdedit').value,
        MaNhanVien: document.getElementById('manvedit').value,
        LoaiHopDong: document.getElementById('loaihopdongedit').value === "long term-contract" ? "Hợp đồng dài hạn" : "Hợp đồng ngắn hạn",
        NgayBatDauHopDong: document.getElementById('ngaybatdauedit').value,
        NgayKetThucHopDong: document.getElementById('ngayketthucedit').value,
        ChiTietHopDong: document.getElementById('contractFileedit').value
    };

    //const FormData = new FormData();
    //for (const key in model) {
    //    formData.append(key, model[key]);
    //}

    // Lấy file từ input file
    // const fileInput = document.getElementById('contractFileedit');
    //if (fileInput && fileInput.files.length > 0) {
    ////    model.append('contractFileedit', fileInput.files[0]);
    // }

    // Gửi dữ liệu lên server (thực hiện Post request tới UpdateHD)
    fetch('/HopDong/UpdateHopDong', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(model)
        //body: JSON.stringify(model)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                loadContract();
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Có lỗi xảy ra trong quá trình lưu thông tin.");
        });
    console.log(model);
});


// Đóng form panel

// Đóng các panel
closePanelButton.addEventListener("click", () => {
    rightPanel.classList.remove("show");
    mainContent.classList.remove("panel-active");
});
closeFilterButton.addEventListener("click", () => {
    filterPanel.classList.remove("show");
    mainContent.classList.remove("panel-active");
});
document.getElementById("closePanel1").addEventListener("click", () => {
    formPanel.classList.remove("show");
    mainContent.classList.remove("panel-active");
});

//function formatDate(dateString) {
//    console.log('dateString:', dateString);
//    const date = new Date(dateString);
//    if (isNaN(date.getTime())) {
//        console.error('Không thể parse ngày:', dateString);
//        return 'N/A'; // Trả về "N/A" nếu không parse được ngày
//    }

//    // Chuyển đổi sang định dạng yyyy-MM-dd
//    const day = String(date.getDate()).padStart(2, '0');
//    const month = String(date.getMonth() + 1).padStart(2, '0');
//    const year = date.getFullYear();

//    return `${year}-${month}-${day}`;
//}

// Render bảng danh sách hợp đồng
function convertDateFromTimestamp(timestampString) {
    const match = timestampString.match(/\/Date\((\d+)\)\//); // Trích xuất timestamp
    if (match) {
        const timestamp = parseInt(match[1], 10); // Lấy giá trị số từ timestamp
        const date = new Date(timestamp); // Chuyển đổi sang đối tượng Date

        // Chuyển đổi sang định dạng yyyy-MM-dd
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${year}-${month}-${day}`;
    }
    return "N/A"; // Nếu không đúng định dạng, trả về "N/A"
}
function renderTable(data) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = "";
    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6">Không có dữ liệu</td></tr>';
    } else {
        data.forEach((contract) => {
            const row = document.createElement("tr");
            row.classList.add("table-row");
            row.setAttribute('data-contract', contract.MaHopDong);
            //const startDate = formatDate(contract.NgayBatDauHopDong);
            // const endDate = formatDate(contract.NgayKetThucHopDong);
            row.innerHTML = `
        <td>${contract.MaHopDong}</td>
        <td>${contract.MaNhanVien}</td>
        <td>${contract.LoaiHopDong}</td>
        <td>${convertDateFromTimestamp(contract.NgayBatDauHopDong)}</td>
        <td>${convertDateFromTimestamp(contract.NgayKetThucHopDong)}</td>
        <td>
          <span class="three-dots" onclick="toggleDropdown(event)">
            <img src="/Content/img/ri_more-2-fill.png" alt="Menu" class="icon-dot">
          </span>
          <ul class="dropdown-menu" style="display: none;">
            <li><a href="#" class="edit-option" onclick="openEditPanel(event)">Sửa</a></li>
            <li><a href="#" class="detail-option" onclick="viewContractDetail('${contract.MaHopDong}')">Xem chi tiết</a></li>
          </ul>
        </td>
      `;
            console.log('dat: ', contract.NgayKetThucHopDong);
            tableBody.appendChild(row);
        });
    }
}

function loadContract() {
    fetch('/HopDong/GetHopDong')
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

            }
            // Kiểm tra nếu data là đối tượng và có trường 'items' là mảng
            else if (data.items && Array.isArray(data.items)) {
                renderTable(data.items);
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
loadContract();
function toggleDropdown(event) {
    event.stopPropagation();
    const dropdownMenu = event.target.closest(".three-dots").nextElementSibling;

    document.querySelectorAll(".dropdown-menu").forEach((menu) => {
        if (menu !== dropdownMenu) menu.style.display = "none";
    });

    dropdownMenu.style.display = dropdownMenu.style.display === "none" ? "block" : "none";
}

// Đóng tất cả dropdown khi click bên ngoài
document.addEventListener("click", () => {
    document.querySelectorAll(".dropdown-menu").forEach((menu) => {
        menu.style.display = "none";
    });
});

window.addEventListener("resize", updatePanelHeight);

// Render dữ liệu khi DOM đã sẵn sàng
//document.addEventListener("DOMContentLoaded", () => {
//   renderTable(contract);
//   updatePanelHeight();
//});

// Lưu dữ liệu
document.getElementById("save").addEventListener("click", function (event) {
    event.preventDefault();

    // Kiểm tra trước khi đưa vào formData
    const maHopDong = document.getElementById("mahd").value.trim();
    const maNhanVien = document.getElementById("manv").value.trim();
    const loaiHopDong = document.getElementById("loaihd").value.trim() === "long term-contract" ? "Hợp đồng dài hạn" : "Hợp đồng ngắn hạn";
    const ngayBatDau = document.getElementById("ngaybatdau").value.trim();
    const ngayKetThuc = document.getElementById("ngayketthuc").value.trim();
    const chiTietHopDong = document.getElementById("contractFile").value.trim();

    // Kiểm tra các trường bắt buộc
    if (!maHopDong || !maNhanVien || !loaiHopDong || !ngayBatDau || !ngayKetThuc) {
        alert("Vui lòng điền đầy đủ các trường bắt buộc.");
        return;
    }
    function isValidDate(dateString) {
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    }
    if (!isValidDate(ngayBatDau) || !isValidDate(ngayKetThuc)) {
        alert("Ngày không hợp lệ.");
        return;
    }

    // Lấy dữ liệu từ form
    const formData = {
        MaHopDong: maHopDong,
        MaNhanVien: maNhanVien,
        LoaiHopDong: loaiHopDong,
        NgayBatDauHopDong: ngayBatDau,
        NgayKetThucHopDong: ngayKetThuc,
        ChiTietHopDong: chiTietHopDong
    };

    console.log(formData);

    // Gửi dữ liệu lên server
    fetch("/HopDong/LuuHopDong", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                alert("Lưu hợp đồng thành công!");
                loadContract();
                //renderTable(data); // <-- Render lại dữ liệu
                resetForm();
            } else {
                alert("Lưu hợp đồng thất bại: " + data.message);
            }
        })
        .catch((error) => {
            console.error("Lỗi khi lưu dữ liệu:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại.");
        });
});


// Sự kiện xóa form
document.getElementById("xoa").addEventListener("click", function (event) {
    event.preventDefault();
    resetForm();
});

// Hàm đặt lại form về trạng thái ban đầu
function resetForm() {
    document.getElementById("mahd").value = '';
    document.getElementById("manv").value = '';
    document.getElementById("loaihd").value = '';
    document.getElementById("ngaybatdau").value = '';
    document.getElementById("ngayketthuc").value = '';
    const contractFileInput = document.getElementById('contractFile');

    contractFileInput.value = '';
}

// Hàm cập nhật các tùy chọn (options) cho select trong hợp đồng
function updateSelectOptions(selectElement, data, valueField, textField) {
    selectElement.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.text = `Chọn ${selectElement.name}`;
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

// Hàm chuyển đổi timestamp từ dạng `/Date(timestamp)/` sang định dạng ngày đọc được
function convertDate(dateString) {
    const match = dateString.match(/\/Date\((\d+)\)\//); // Trích xuất timestamp
    if (match) {
        const timestamp = parseInt(match[1], 10); // Chuyển chuỗi thành số
        const date = new Date(dateString); // Tạo đối tượng Date từ timestamp
        return date.toLocaleDateString("vi-VN"); // Định dạng ngày kiểu Việt Nam
    }
    return timestampString; // Nếu không đúng định dạng, trả lại giá trị gốc
}

// Lấy tất cả các ô trong bảng chứa timestamp
document.querySelectorAll("td").forEach(cell => {
    if (cell.textContent.includes("/Date(")) {
        cell.textContent = convertDate(cell.textContent); // Cập nhật nội dung thành ngày
    }
});


//function viewContractDetail(contractId) {
//    const contract = contracts.find(c => c.contractId === contractId);
//    if (!contract) {
//        alert("Không tìm thấy hợp đồng.");
//        return;
//    }

//    // Hien thi thong tin chi tiet hop dong
//    document.getElementById('contractIdDetail').textContent = contract.contractId;
//    document.getElementById('employeeIdDetail').textContent = contract.employeeId;
//    document.getElementById('contractTypeDetail').textContent = contract.contractType;
//    document.getElementById('startDateDetail').textContent = contract.startDate;
//    document.getElementById('endDateDetail').textContent = contract.endDate;

//    // Neu có file hd thi hien thi link tai ve hoac ifram( neu can)
//    if (contract.file) {
//        const fileLink = document.createElement('a');
//        fileLink.href = contract.file; // dg dan toi file hd
//        fileLink.target = '_blank';
//        fileLink.textContent = 'Tải file hợp đồng';
//        document.getElementById('contractDetailPanel').appendChild(fileLink);
//    }

// hien thi panel cua chi tiet hd
//    document.getElementById('contractDetailPanel').style.display = 'block';
//}

// dong panel chi tiet
//document.getElementById('closeDetailPanel').addEventListener('click', () => {
//    const detailPanel = document.getElementById('detailPanel');
//    detailPanel.classList.remove('show');
//    mainContent.classList.remove("panel-active");
//});


// Ngừng sự kiện click trên menu options để không đóng dropdown
//row.querySelector('.three-dots').addEventListener('click', (event) => {
//   event.stopPropagation();
//    toggleDropdown(event);
//});

//row.querySelectorAll('.dropdown-menu li a').forEach(item => {
//    item.addEventListener('click', (event) => {
//        event.stopPropagation();
//    });
//});

// Khi click vào dòng hợp đồng, hiển thị chi tiết hợp đồng
//row.addEventListener('click', function () {
//    const maHopDong = this.getAttribute('data-mahopdong');
//       showContractDetailPanel(maHopDong);
//});

function fetchContracts() {
    $.ajax({
        url: '/HopDong/GetHopDong',
        method: 'GET',
        success: function (data) {
            console.log('Dữ liệu nhận được:', data);
            if (data.error) {
                console.error('Lỗi từ server:', data.error);
            } else {
                renderTable(data);
                loadContract();
            }
        },
        error: function (xhr, status, error) {
            console.error('Lỗi khi gọi API:', error);
        }
    });
}
