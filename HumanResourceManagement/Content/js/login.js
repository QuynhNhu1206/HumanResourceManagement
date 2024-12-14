
            const form = document.getElementById('loginForm');
            const username = document.getElementById('username');
            const password = document.getElementById('password');
            const usernameError = document.getElementById('usernameError');
            const passwordError = document.getElementById('passwordError');
            const generalError = document.getElementById('generalError');

            form.addEventListener('submit', function (event) {
                // Reset lỗi
                usernameError.style.display = 'none';
            passwordError.style.display = 'none';
            generalError.style.display = 'none';

            // Kiểm tra các trường
            const isUsernameEmpty = !username.value.trim();
            const isPasswordEmpty = !password.value.trim();

            if (isUsernameEmpty && isPasswordEmpty) {
                event.preventDefault(); 
            generalError.style.display = 'block';
        } else {
            if (isUsernameEmpty) {
                event.preventDefault(); 
            usernameError.style.display = 'block';
            }

            if (isPasswordEmpty) {
                event.preventDefault();
            passwordError.style.display = 'block'; 
            }
        }
    });
   
