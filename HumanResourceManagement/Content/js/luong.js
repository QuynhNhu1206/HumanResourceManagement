
const openPanelButton = document.getElementById("openPanel");
const closePanelButton = document.getElementById("closePanel");
const rightPanel = document.getElementById("rightPanel");
const mainContent = document.querySelector(".main-section");
const formPanel = document.getElementById("formPanel");
const tableBody = document.getElementById("table-body");
const filterPanel = document.getElementById("filterPanel");
const openFilterButton = document.getElementById("openFilter");
const closeFilterButton = document.getElementById("closeFilterPanel");

const salarys = [
    { id: "MLV1", employeeId: "MANHANVIEN1", basicSalary: 8000000, coefficient: 2, positionAllowance: 2000000, degreeAllowance: 700000, seniorityBonus: 1000000, salaryy: 1000000, healthInsurance: 750000, socialInsurance: 100000, netSalary: 9000000 },
    { id: "MLV2", employeeId: "MANHANVIEN2", basicSalary: 7000000, coefficient: 2, positionAllowance: 1000000, degreeAllowance: 600000, seniorityBonus: 1000000, salaryy: 1000000, healthInsurance: 6500000, socialInsurance: 990000, netSalary: 8000000 },
    { id: "MLV3", employeeId: "MANHANVIEN3", basicSalary: 7500000, coefficient: 1, positionAllowance: 1500000, degreeAllowance: 500000, seniorityBonus: 1000000, salaryy: 1000000, healthInsurance: 6500000, socialInsurance: 800000, netSalary: 75000000 },
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
        data.forEach((salary) => {
            const row = document.createElement("tr");
            row.classList.add("table-row");
            row.id = `table-salary-${salary.id}`;
            row.innerHTML = `
        <td>${salary.id}</td>
        <td>${salary.employeeId}</td>
        <td>${salary.basicSalary}</td>
        <td>${salary.coefficient}</td>
        <td>${salary.positionAllowance}</td>
        <td>${salary.degreeAllowance}</td>
        <td>${salary.seniorityBonus}</td>
        <td>${salary.salaryy}</td>
        <td>${salary.healthInsurance}</td>
        <td>${salary.socialInsurance}</td>
        <td>${salary.netSalary}</td>   
        <td>
          <span class="three-dots" onclick="toggleDropdown(event)">
            <img src="/Content/img/ri_more-2-fill.png" alt="Menu" class="icon-dot">
          </span>
          <ul class="dropdown-menu" style="display: none;">
            <li><a href="#" class="edit-option" onclick="openEditPanel(event)">Sửa</a></li>
            <li><a href="#" class="delete-option" onclick="deletesSchedules('${salary.id}')">Xóa</a></li>
          </ul>
        </td>
      `;
            tableBody.appendChild(row);
        });
    }
}

function deleteSchedules(salaryId) {
    if (confirm(`Bạn có chắc muốn xóa phiếu lương ${salaryId}?`)) {
        alert(`Đã xóa phiếu lương ${salaryId}.`);
        const updatedsalaryss = salarys.filter((salary) => salary.id !== salaryId);
        renderTable(updatedsalaryss);
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
    renderTable(salarys);
    updatePanelHeight();
});

document.querySelector(".btn-save").addEventListener("click", () => {
    alert("Bạn đã lưu thành công!");
});
function adjustFormHeight() {
    const contentHeight = formPanel.scrollHeight;
    formPanel.style.height = `${contentHeight}px`;
}

formPanel.addEventListener('input', adjustFormHeight);
formPanel.addEventListener('change', adjustFormHeight);

adjustFormHeight();


