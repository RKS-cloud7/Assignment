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
    const resForm = document.getElementById('reservation-form');

    if (resForm) {
        resForm.addEventListener('submit', function (e) {
            e.preventDefault();

            let isValid = true;
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const date = document.getElementById('date');
            const time = document.getElementById('time');
            const guests = document.getElementById('guests');

            clearErrors(resForm);

            if (!name || name.value.trim().length < 3) {
                showError(name, 'Name must be at least 3 characters');
                isValid = false;
            }
            if (!email || !email.value.match(emailPattern)) {
                showError(email, 'Invalid email');
                isValid = false;
            }
            const today = new Date().toISOString().split('T')[0];
            if (!date || date.value < today) {
                showError(date, 'Select a valid date');
                isValid = false;
            }
            if (!time || time.value === '') {
                showError(time, 'Select time');
                isValid = false;
            }
            if (!guests || guests.value <= 0) {
                showError(guests, 'Guests must be at least 1');
                isValid = false;
            }

            if (isValid) {
                resForm.style.display = 'none';
                const successMessage = document.getElementById('success-message');
                const confirmationDetails = document.getElementById('confirmation-details');
                
                if (successMessage) {
                    if (confirmationDetails) {
                        const dateObj = new Date(date.value);
                        const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                        confirmationDetails.textContent = `${name.value} • ${formattedDate} at ${time.value} • ${guests.value} guest${guests.value > 1 ? 's' : ''}`;
                    }
                    successMessage.style.display = 'block';
                }
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
    form.querySelectorAll('input').forEach(el => el.classList.remove('input-error'));
}

function resetReservation() {
    const form = document.getElementById('reservation-form');
    const successMessage = document.getElementById('success-message');
    if (!form) return;
    form.reset();
    form.style.display = 'block';
    if (successMessage) successMessage.style.display = 'none';
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