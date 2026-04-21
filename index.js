document.addEventListener('DOMContentLoaded', function () {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav ul');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', function () {
            navMenu.classList.toggle('open');
        });
        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                if (window.innerWidth < 500) {
                    navMenu.classList.remove('open');
                }
            });
        });
    }

    window.addEventListener('scroll', function () {
        document.querySelector('header')?.classList.toggle('shrink', window.scrollY > 40);
    });
});

function acceptCookies() {
    const cookieBox = document.getElementById('cookie-box');
    if (cookieBox) cookieBox.style.display = 'none';
    localStorage.setItem('cookiesAccepted', 'true');
}

window.onload = function () {
    if (localStorage.getItem('cookiesAccepted')) {
        const cookieBox = document.getElementById('cookie-box');
        if (cookieBox) cookieBox.style.display = 'none';
    }
};