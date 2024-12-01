document.addEventListener('DOMContentLoaded', function () {
    const observer = new MutationObserver(function () {
        const userAvatar = document.getElementById('userAvatar');
        const userProfile = document.getElementById('userProfile');
        const dropdownPanel = document.getElementById('dropdownPanel');

        if (userAvatar && userProfile && dropdownPanel) {
            observer.disconnect();

            function toggleDropdown() {
                dropdownPanel.style.display = dropdownPanel.style.display === 'block' ? 'none' : 'block';
            }

            function hideDropdown(event) {
                if (!dropdownPanel.contains(event.target) &&
                    !userAvatar.contains(event.target) &&
                    !userProfile.contains(event.target)) {
                    dropdownPanel.style.display = 'none';
                }
            }

            userAvatar.addEventListener('click', toggleDropdown);
            userProfile.addEventListener('click', toggleDropdown);
            document.addEventListener('click', hideDropdown);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
});