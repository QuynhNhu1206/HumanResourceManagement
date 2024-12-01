const openPanelButton = document.getElementById("openPanel");
const closePanelButton = document.getElementById("closePanel");
const rightPanel = document.getElementById("rightPanel");
const mainContent = document.querySelector(".main-section");

function updatePanelHeight() {
    const mainSectionHeight = mainSection.offsetHeight;
    rightPanel.style.height = `${mainSectionHeight}px`;
}


openPanelButton.addEventListener("click", () => {
    rightPanel.classList.add("show");
    mainContent.classList.add("panel-active");
    const formPanel = document.getElementById('formPanel');
    if (formPanel) {
        formtPanel.classList.remove('show');
    }
    updatePanelHeight();
});


closePanelButton.addEventListener("click", () => {
    rightPanel.classList.remove("show");
    mainContent.classList.remove("panel-active");

});


document.querySelector('.btn-save').addEventListener('click', () => {
    alert('Lưu thành công!');

});

document.querySelector('.btn-delete').addEventListener('click', () => {
    alert('Đã xóa!');

});


window.addEventListener("resize", updatePanelHeight);


// table

const data = [
    { name: "Trần Lan Nhi", department: "Khoa ngoại ngữ", position: "Trưởng khoa", status: "Đang làm" },
    { name: "Nguyễn Lan", department: "Khoa Tin học", position: "Giảng viên", status: "Đang làm" }

];

// Hàm để tạo bảng dữ liệu động
function renderTable(data) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';


    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">Không có dữ liệu</td></tr>';
    } else {

        for (let i = 0; i < data.length; i++) {
            const row = document.createElement('tr');

            const cell1 = document.createElement('td');
            cell1.textContent = data[i].name;
            row.appendChild(cell1);

            const cell2 = document.createElement('td');
            cell2.textContent = data[i].department;
            row.appendChild(cell2);

            const cell3 = document.createElement('td');
            cell3.textContent = data[i].position;
            row.appendChild(cell3);

            const cell4 = document.createElement('td');
            cell4.textContent = data[i].status;
            row.appendChild(cell4);

            const cell5 = document.createElement('td');
            cell5.innerHTML = `
                    <span class="three-dots" onclick="toggleDropdown(event)">
                        <img src="/Content/img/ri_more-2-fill.png" alt="3-dot" class="icon-dot">
                    </span>
                    <ul class="dropdown-menu" style="display: none;">
                        <li>
                            <a href="#" class="edit-option" onclick="openEditPanel(event)">
                                <span>Sửa</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" class="delete-option">
                                <span>Xóa</span>
                            </a>
                        </li>
                        
                    </ul>`;

            row.appendChild(cell5);

            tableBody.appendChild(row);
        }
    }
}

function toggleDropdown(event) {
    const dropdownToggle = event.target.closest('.three-dots');
    const dropdownMenu = dropdownToggle ? dropdownToggle.nextElementSibling : null;

    if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
        const allDropdowns = document.querySelectorAll('.dropdown-menu');
        allDropdowns.forEach(menu => {
            if (menu !== dropdownMenu) {
                menu.style.display = 'none'; // Close other dropdowns
            }
        });

        // Toggle the clicked dropdown
        dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
    }
}

// Hide dropdown when clicking outside
document.addEventListener('click', function (event) {
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');
    dropdownMenus.forEach(menu => {
        if (!menu.contains(event.target) && !event.target.closest('.three-dots')) {
            menu.style.display = 'none';
        }
    });
});

// Hide dropdown when selecting an option
$(document).on('click', '.edit-option, .delete-option', function () {
    $('.dropdown-menu').hide();
});

document.addEventListener('DOMContentLoaded', function () {
    renderTable(data);
});

//datetimepicker
$(document).ready(function () {
    $(".datetime-icon").on("click", function () {
        var inputField = $(this).prev('input');


        inputField.datepicker('show');
    });

    // Khởi tạo datepicker cho các ô nhập liệu
    $('#ngaysinh').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true
    });

    $('#ngayvaolam').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true
    });
});
$(document).ready(function () {

    var today = new Date();


    var day = today.getDate();
    var month = today.getMonth() + 1;
    var year = today.getFullYear();


    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;


    var formattedDate = day + '/' + month + '/' + year;


    $('#ngaysinh').val(formattedDate);
    $('#ngayvaolam').val(formattedDate);
});


//form-panel

document.addEventListener('DOMContentLoaded', function () {

    const formPanel = document.getElementById('formPanel');
    const mainContent = document.querySelector('.main-section');
    const closePanelButton = document.getElementById("closePanel1");



    function openEditPanel() {
        formPanel.classList.add('show');
        mainContent.classList.add("panel-active");
        updatePanelHeight();
        const rightPanel = document.getElementById('rightPanel');
        if (rightPanel) {
            rightPanel.classList.remove('show');
        }
    }


    function updatePanelHeight() {
        const mainSectionHeight = mainContent.offsetHeight;
        formPanel.style.height = `${mainSectionHeight}px`;
    }

    const editButton = document.querySelector('.edit-option');
    if (editButton) {
        editButton.addEventListener('click', openEditPanel);
    } else {
        console.error('Nút sửa không tìm thấy!');
    }


    closePanelButton.addEventListener("click", function () {
        console.log("Đang đóng form...");
        formPanel.classList.remove("show");
        mainContent.classList.remove("panel-active");
    });


    document.querySelector('.btn-save').addEventListener('click', () => {
        alert('Lưu thành công!');
    });


    document.querySelector('.btn-delete').addEventListener('click', () => {
        alert('Đã xóa!');
    });
});


