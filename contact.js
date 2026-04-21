const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !email || !phone || !subject || !message) {
        showStatus("Please complete all fields before sending your message.", "error");
        return;
    }

    if (!isValidEmail(email)) {
        showStatus("Please enter a valid email address.", "error");
        return;
    }

    if (message.length < 12) {
        showStatus("Your message should be at least 12 characters long.", "error");
        return;
    }

    showStatus(`Thank you, ${name}. Your Royal Thali message has been received.`, "success");
    contactForm.reset();
});

function showStatus(message, type) {
    formStatus.hidden = false;
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
