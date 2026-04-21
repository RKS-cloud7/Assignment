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

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/;
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            let isValid = true;
            const name = document.getElementById('cname');
            const email = document.getElementById('cemail');
            const message = document.getElementById('cmessage');

            clearErrors(contactForm);

            if (!name || name.value.trim().length < 3) {
                showError(name, 'Name too short');
                isValid = false;
            }
            if (!email || !email.value.match(emailPattern)) {
                showError(email, 'Invalid email');
                isValid = false;
            }
            if (!message || message.value.trim().length < 10) {
                showError(message, 'Message must be at least 10 characters');
                isValid = false;
            }

            if (isValid) {
                contactForm.style.display = 'none';
                const successBox = document.getElementById('contact-success');
                if (successBox) successBox.style.display = 'block';
            }
        });
    }
});

function showError(input, message) {
    if (!input) return;
    input.classList.add('input-error');
    const errorElement = input.parentElement.querySelector('.error');
    if (errorElement) errorElement.textContent = message;
}

function clearErrors(form) {
    if (!form) return;
    form.querySelectorAll('.error').forEach(el => (el.textContent = ''));
    form.querySelectorAll('input, textarea').forEach(el => el.classList.remove('input-error'));
}

function resetContact() {
    const form = document.getElementById('contact-form');
    const successBox = document.getElementById('contact-success');
    if (!form) return;
    form.reset();
    form.style.display = 'block';
    if (successBox) successBox.style.display = 'none';
}

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