
const openPanelButton = document.getElementById("openPanel");
const closePanelButton = document.getElementById("closePanel");
const rightPanel = document.getElementById("rightPanel");
const mainContent = document.querySelector(".main-section");
const formPanel = document.getElementById("formPanel");
const tableBody = document.getElementById("table-body");
const filterPanel = document.getElementById("filterPanel");
const openFilterButton = document.getElementById("openFilter");
const closeFilterButton = document.getElementById("closeFilterPanel");

const schedules = [
    { id: "MLV1", employeeId: "MANHANVIEN1", workDate: "01/12/2024", workHours: 9, overtimeHours: 1, status: "Còn làm việc", note: "Tăng ca" },
    { id: "MLV2", employeeId: "MANHANVIEN2", workDate: "01/12/2024", workHours: 6, overtimeHours: 0, status: "Đã nghỉ việc", note: "Không có" },
    { id: "MLV3", employeeId: "MANHANVIEN3", workDate: "03/12/2024", workHours: 8, overtimeHours: 0, status: "Còn làm việc", note: "Không có" },
    { id: "MLV4", employeeId: "MANHANVIEN4", workDate: "03/12/2024", workHours: 7, overtimeHours: 0, status: "Còn làm việc", note: "Xin về sớm con ốm" },
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

function renderTable(data) {
    tableBody.innerHTML = "";
    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6">Không có dữ liệu</td></tr>';
    } else {
        data.forEach((schedule) => {
            const row = document.createElement("tr");
            row.classList.add("table-row");
            row.id = `table-schedules-${schedule.id}`;
            row.innerHTML = `
        <td>${schedule.id}</td>
        <td>${schedule.employeeId}</td>
        <td>${schedule.workDate}</td>
        <td>${schedule.workHours}</td>
        <td>${schedule.overtimeHours}</td>
        <td>${schedule.status}</td>
        <td>${schedule.note}</td>
        <td>
          <span class="three-dots" onclick="toggleDropdown(event)">
            <img src="/Content/img/ri_more-2-fill.png" alt="Menu" class="icon-dot">
          </span>
          <ul class="dropdown-menu" style="display: none;">
            <li><a href="#" class="edit-option" onclick="openEditPanel(event)">Sửa</a></li>
            <li><a href="#" class="delete-option" onclick="deletesSchedules('${schedule.id}')">Xóa</a></li>
          </ul>
        </td>
      `;
            tableBody.appendChild(row);
        });
    }
}

function deleteSchedules(scheduleId) {
    if (confirm(`Bạn có chắc muốn xóa lịch làm việc ${scheduleId}?`)) {
        alert(`Đã xóa lịch làm việc ${scheduleId}.`);
        const updatedscheduless = schedules.filter((schedule) => schedule.id !== scheduleId);
        renderTable(updatedscheduless);
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

document.addEventListener("click", () => {
    document.querySelectorAll(".dropdown-menu").forEach((menu) => {
        menu.style.display = "none";
    });
});

window.addEventListener("resize", updatePanelHeight);

document.addEventListener("DOMContentLoaded", () => {
    renderTable(schedules);
    updatePanelHeight();
});

document.querySelector(".btn-save").addEventListener("click", () => {
    alert("Bjan đã lưu thành công!");
});

