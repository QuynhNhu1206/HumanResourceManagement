//upload ảnh
const uploadImageInput = document.getElementById('uploadImage');
const uploadedImage = document.getElementById('uploadedImage');

uploadImageInput.addEventListener('change', function (event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            uploadedImage.src = e.target.result;
        };

        reader.readAsDataURL(file);
    } else {
        uploadedImage.src = ''; 
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const dantocSelect = document.getElementById('dantoc');
    const noisinhSelect = document.getElementById('noisinh');

    if (dantocSelect && noisinhSelect) {
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
            const optionElement = document.createElement('option');
            optionElement.value = province;
            optionElement.textContent = province;
            noisinhSelect.appendChild(optionElement);
        });

     
        danTocs.forEach(function (dantoc) {
            const optionElement = document.createElement('option');
            optionElement.value = dantoc;
            optionElement.textContent = dantoc;
            dantocSelect.appendChild(optionElement);
        });
    } else {
        console.error('Các phần tử select không tìm thấy.');
    }
});
