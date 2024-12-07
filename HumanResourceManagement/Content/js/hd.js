
const openPanelButton = document.getElementById("openPanel");
const closePanelButton = document.getElementById("closePanel");
const rightPanel = document.getElementById("rightPanel");
const mainContent = document.querySelector(".main-section");
const formPanel = document.getElementById("formPanel");
const tableBody = document.getElementById("table-body");
const filterPanel = document.getElementById("filterPanel");
const openFilterButton = document.getElementById("openFilter");
const closeFilterButton = document.getElementById("closeFilterPanel");

const contracts = [
    { id: "MPB1", employeeId: "MANHANVIEN1", type: "Hợp đồng dài hạn", startDate: "20/10/2024", endDate: "20/10/2029" },
    { id: "MPB2", employeeId: "MANHANVIEN2", type: "Hợp đồng ngắn hạn", startDate: "20/10/2024", endDate: "20/10/2025" },
    { id: "MPB3", employeeId: "MANHANVIEN3", type: "Hợp đồng dài hạn", startDate: "20/10/2022", endDate: "20/10/2027" },

];

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
    formPanel.classList.add("show");
    mainContent.classList.add("panel-active");
    updatePanelHeight();
    if (rightPanel) {
        rightPanel.classList.remove("show");
    }
    if (filterPanel) {
        filterPanel.classList.remove("show");
    }
}

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

// Render bảng danh sách hợp đồng
function renderTable(data) {
    tableBody.innerHTML = "";
    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6">Không có dữ liệu</td></tr>';
    } else {
        data.forEach((contract) => {
            const row = document.createElement("tr");
            row.classList.add("table-row");
            row.id = `table-contract-${contract.id}`;
            row.innerHTML = `
        <td>${contract.id}</td>
        <td>${contract.employeeId}</td>
        <td>${contract.type}</td>
        <td>${contract.startDate}</td>
        <td>${contract.endDate}</td>
        <td>
          <span class="three-dots" onclick="toggleDropdown(event)">
            <img src="/Content/img/ri_more-2-fill.png" alt="Menu" class="icon-dot">
          </span>
          <ul class="dropdown-menu" style="display: none;">
            <li><a href="#" class="edit-option" onclick="openEditPanel(event)">Sửa</a></li>
            <li><a href="#" class="delete-option" onclick="deleteContract('${contract.id}')">Xóa</a></li>
            <li><a href="#" class="detail-option" onclick="viewContractDetail('${contract.id}')">Xem chi tiết</a></li>
          </ul>
        </td>
      `;
            tableBody.appendChild(row);
        });
    }
}

function deleteContract(contractId) {
    if (confirm(`Bạn có chắc muốn xóa hợp đồng ${contractId}?`)) {
        alert(`Đã xóa hợp đồng ${contractId}.`);
        const updatedContracts = contracts.filter((contract) => contract.id !== contractId);
        renderTable(updatedContracts);
    }
}

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
document.addEventListener("DOMContentLoaded", () => {
    renderTable(contracts);
    updatePanelHeight();
});

// Lưu dữ liệu
document.querySelector(".btn-save").addEventListener("click", () => {
    alert("Lưu thành công!");
});

function viewContractDetail(contractId) {
    // Giả lập tìm hợp đồng theo ID
    const contract = data.find(c => c.contractId === contractId);
    if (!contract) {
        alert("Không tìm thấy hợp đồng.");
        return;
    }

    // Hiển thị chi tiết hợp đồng
    const detailPanel = document.getElementById('detailPanel');
    detailPanel.querySelector('.detail-content').innerHTML = `
        <h3>Chi tiết hợp đồng</h3>
        <p><strong>Mã hợp đồng:</strong> ${contract.contractId}</p>
        <p><strong>Mã nhân viên:</strong> ${contract.employeeId}</p>
        <p><strong>Loại hợp đồng:</strong> ${contract.contractType}</p>
        <p><strong>Ngày bắt đầu:</strong> ${contract.startDate}</p>
        <p><strong>Ngày kết thúc:</strong> ${contract.endDate}</p>
        <p><strong>Trạng thái:</strong> ${contract.status}</p>
        <button class="btn-download" onclick="downloadContract('${contract.contractId}')">Tải xuống file Word</button>
    `;
    detailPanel.classList.add('show');
    mainContent.classList.add("panel-active");
}

// Đóng panel chi tiết
document.getElementById('closeDetailPanel').addEventListener('click', () => {
    const detailPanel = document.getElementById('detailPanel');
    detailPanel.classList.remove('show');
    mainContent.classList.remove("panel-active");
});
function downloadContract(contractId) {
    // Giả lập tên file dựa trên mã hợp đồng
    const fileName = `HopDong_${contractId}.docx`;

    // Tải file (trong thực tế, cần kết nối với backend để tải file thực sự)
    const link = document.createElement('a');
    link.href = `/contracts/${fileName}`; // Đường dẫn file trên server
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(`Đang tải file: ${fileName}`);
}