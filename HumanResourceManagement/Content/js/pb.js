﻿const openPanelButton = document.getElementById("openPanel");
const closePanelButton = document.getElementById("closePanel");
const rightPanel = document.getElementById("rightPanel");
const mainContent = document.querySelector(".main-section");
const formPanel = document.getElementById('formPanel');
const tableBody = document.getElementById('table-body');
const filterPanel = document.getElementById('filterPanel');
const openFilterButton = document.getElementById('openFilter');
const closeFilterButton = document.getElementById('closeFilterPanel');

const data = [
    { id: "PB01", department: "Khoa ngoại ngữ" },
    { id: "PB02", department: "Khoa Tin học" },
];

function updatePanelHeight() {
    const mainSectionHeight = mainContent.offsetHeight;
    rightPanel.style.height = `${mainSectionHeight}px`;
    formPanel.style.height = `${mainSectionHeight}px`;
    filterPanel.style.height = `${mainSectionHeight}px`;
}
openPanelButton.addEventListener("click", () => {
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
}
closePanelButton.addEventListener("click", () => {
    rightPanel.classList.remove("show");
    mainContent.classList.remove("panel-active");
});
closeFilterButton.addEventListener("click", () => {
    filterPanel.classList.remove("show");
    mainContent.classList.remove("panel-active");
});
document.getElementById("closePanel1").addEventListener("click", function () {
    formPanel.classList.remove("show");
    mainContent.classList.remove("panel-active");
});
function renderTable(data) {
    tableBody.innerHTML = '';
    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="3">Không có dữ liệu</td></tr>';
    } else {
        data.forEach((item) => {
            const row = document.createElement('tr');
            row.classList.add('table-row');
            row.id = `data-mapb-${item.mapb}`;
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.department}</td>
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
window.addEventListener("resize", updatePanelHeight);
document.addEventListener('DOMContentLoaded', () => {
    renderTable(data);
    updatePanelHeight();
});


document.querySelector('.btn-save').addEventListener('click', () => {
    alert('Lưu thành công!');
});

document.querySelector('.btn-delete').addEventListener('click', () => {
    alert('Đã xóa!');
});