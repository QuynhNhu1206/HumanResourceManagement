document.getElementById('user-profile').addEventListener('click', function (e) {
    var optionsMenu = document.getElementById('options-menu');
    optionsMenu.classList.toggle('show');

  
    e.stopPropagation();
});


document.addEventListener('click', function (e) {
    var optionsMenu = document.getElementById('options-menu');
    var userProfile = document.getElementById('user-profile');


    if (!userProfile.contains(e.target) && !optionsMenu.contains(e.target)) {
        optionsMenu.classList.remove('show');
    }
});