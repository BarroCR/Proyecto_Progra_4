//Script para cambiar de tema en la página web
document.addEventListener('DOMContentLoaded', function () {
    const themeButtons = document.querySelectorAll('.dropdown-item[data-theme]');
    const themeLink = document.getElementById('theme-link');
    themeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const theme = this.getAttribute('data-theme');
            if (theme === 'light') {
                themeLink.href = 'https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/lux/bootstrap.min.css';
                document.body.removeAttribute('data-bs-theme');
            } else if (theme === 'dark') {
                themeLink.href = 'https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/lux/bootstrap.min.css';
                document.body.setAttribute('data-bs-theme', 'dark');;
            }
        });
    });
});