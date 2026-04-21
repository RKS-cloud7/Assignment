const reservationNavToggle = document.querySelector(".nav-toggle");
const reservationNav = document.querySelector(".site-nav");

if (reservationNavToggle && reservationNav) {
    reservationNavToggle.addEventListener("click", () => {
        const isOpen = reservationNav.classList.toggle("is-open");
        reservationNavToggle.setAttribute("aria-expanded", String(isOpen));
    });

    reservationNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            reservationNav.classList.remove("is-open");
            reservationNavToggle.setAttribute("aria-expanded", "false");
        });
    });
}

const revealBlocks = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealBlocks.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    revealBlocks.forEach((item) => revealObserver.observe(item));
} else {
    revealBlocks.forEach((item) => item.classList.add("is-visible"));
}

const reservationForm = document.getElementById("reservation-form");
const dateInput = document.getElementById("date");
const formMessage = document.getElementById("form-message");

if (dateInput) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    dateInput.min = `${year}-${month}-${day}`;
}

const markValidity = (field, isValid) => {
    field.classList.toggle("is-invalid", !isValid);
};

if (reservationForm && formMessage) {
    reservationForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const fields = {
            name: document.getElementById("name"),
            phone: document.getElementById("phone"),
            email: document.getElementById("email"),
            guests: document.getElementById("guests"),
            date: document.getElementById("date"),
            time: document.getElementById("time"),
            request: document.getElementById("request")
        };

        const validators = [
            {
                field: fields.name,
                valid: fields.name.value.trim().length >= 2
            },
            {
                field: fields.phone,
                valid: /^[0-9+\-\s()]{7,}$/.test(fields.phone.value.trim())
            },
            {
                field: fields.email,
                valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value.trim())
            },
            {
                field: fields.guests,
                valid: fields.guests.value.trim() !== ""
            },
            {
                field: fields.date,
                valid: fields.date.value.trim() !== ""
            },
            {
                field: fields.time,
                valid: fields.time.value.trim() !== ""
            }
        ];

        let hasError = false;

        validators.forEach(({ field, valid }) => {
            markValidity(field, valid);
            if (!valid) {
                hasError = true;
            }
        });

        if (hasError) {
            formMessage.textContent = "Please complete all required details with valid information.";
            formMessage.className = "form-message error";
            return;
        }

        const reservationSummary = [
            `Reservation confirmed for ${fields.name.value.trim()}.`,
            `${fields.guests.value} on ${fields.date.value} at ${fields.time.value}.`
        ];

        if (fields.request.value.trim()) {
            reservationSummary.push(`Special request noted: ${fields.request.value.trim()}`);
        }

        formMessage.textContent = reservationSummary.join(" ");
        formMessage.className = "form-message success";
        reservationForm.reset();

        if (dateInput) {
            dateInput.min = dateInput.min;
        }
    });
}
