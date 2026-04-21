// =========================
// RUN AFTER PAGE LOAD
// =========================
document.addEventListener("DOMContentLoaded", function () {

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/;

    // =========================
    // HEADER SCROLL
    // =========================
    window.addEventListener("scroll", function () {
        document.querySelector("header")?.classList.toggle(
            "shrink",
            window.scrollY > 40
        );
    });

    // =========================
    // MOBILE MENU
    // =========================
    const menuBtn = document.querySelector(".mobile-menu-btn");
    const navMenu = document.querySelector("nav ul");

    if (menuBtn && navMenu) {
        menuBtn.addEventListener("click", () => {
            navMenu.classList.toggle("open");
        });

        navMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                if (window.innerWidth < 500) {
                    navMenu.classList.remove("open");
                }
            });
        });
    }

    // =========================
    // MENU TABS / SPICE FILTER
    // =========================
    if (window.jQuery) {
        const $ = window.jQuery;

        function activateCategory(category) {
            $('.tab-btn').removeClass('active');
            $(`.tab-btn[data-category="${category}"]`).addClass('active');
            $('.menu-category').removeClass('active');
            $(`#${category}`).addClass('active');
        }

        function updateSpiceFilter(level) {
            $('.menu-item').each(function () {
                const itemLevel = $(this).data('spice') || '';
                if (level === 'all' || itemLevel === level) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        }

        $(document).on('click', '.tab-btn', function () {
            const category = $(this).data('category');
            activateCategory(category);
            localStorage.setItem('lastTab', category);
        });

        $(document).on('change', '#spice-level', function () {
            const level = $(this).val();
            updateSpiceFilter(level);
            localStorage.setItem('lastSpice', level);
        });

        const lastTab = localStorage.getItem('lastTab');
        if (lastTab) {
            activateCategory(lastTab);
        }

        const lastSpice = localStorage.getItem('lastSpice');
        if (lastSpice) {
            $('#spice-level').val(lastSpice);
            updateSpiceFilter(lastSpice);
        }

        $(document).on('click', '.navbar-toggler', function () {
            $('#nav').toggleClass('show');
            const expanded = $(this).attr('aria-expanded') === 'true';
            $(this).attr('aria-expanded', !expanded);
        });

        $(document).on('click', '.navbar-nav .nav-link', function () {
            if ($('#nav').hasClass('show')) {
                $('#nav').removeClass('show');
                $('.navbar-toggler').attr('aria-expanded', 'false');
            }
        });
    } else {
        const tabs = document.querySelectorAll('.tab-btn');

        tabs.forEach(tab => {
            tab.addEventListener('click', function () {
                const category = this.dataset.category;

                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                document.querySelectorAll('.menu-category').forEach(c =>
                    c.classList.remove('active')
                );

                document.getElementById(category)?.classList.add('active');

                localStorage.setItem('lastTab', category);
            });
        });

        const lastTab = localStorage.getItem('lastTab');
        if (lastTab) {
            document.querySelector(`[data-category="${lastTab}"]`)?.click();
        }

        const spiceSelect = document.getElementById('spice-level');

        if (spiceSelect) {
            spiceSelect.addEventListener('change', function () {
                const level = this.value;

                document.querySelectorAll('.menu-item').forEach(item => {
                    item.style.display =
                        level === 'all' || item.dataset.spice === level
                            ? 'block'
                            : 'none';
                });

                localStorage.setItem('lastSpice', level);
            });

            const lastSpice = localStorage.getItem('lastSpice');
            if (lastSpice) {
                spiceSelect.value = lastSpice;
                spiceSelect.dispatchEvent(new Event('change'));
            }
        }
    }

    // =========================
    // MENU MODAL
    // =========================
    document.querySelectorAll(".menu-item").forEach(item => {
        item.addEventListener("click", function () {
            document.querySelector(".modal-title").textContent =
                this.querySelector("h3")?.textContent || "";

            document.querySelector(".modal-description").textContent =
                this.querySelector("p")?.textContent || "";

            document.querySelector(".modal-spice").textContent =
                "Spice Level: " + (this.dataset.spice || "N/A");

            document.querySelector(".modal-price").textContent =
                this.querySelector(".item-price")?.textContent || "";

            document.querySelector(".modal-img").src =
                this.querySelector("img")?.src || "";

            document.getElementById("item-modal")?.classList.add("active");
        });
    });

    document.querySelector(".close-modal")?.addEventListener("click", () => {
        document.getElementById("item-modal")?.classList.remove("active");
    });

    window.addEventListener("click", function (e) {
        if (e.target.id === "item-modal") {
            document.getElementById("item-modal")?.classList.remove("active");
        }
    });

    function getCartItems() {
        try {
            return JSON.parse(localStorage.getItem("cartItems")) || [];
        } catch (e) {
            return [];
        }
    }

    function saveCartItems(items) {
        localStorage.setItem("cartItems", JSON.stringify(items));
    }

    function updateCartCount() {
        const countEl = document.getElementById("cart-count");
        const cart = getCartItems();
        const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
        if (countEl) {
            countEl.textContent = totalQty;
        }
    }

    function showCartToast(message) {
        const toast = document.getElementById("cart-toast");
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add("show");
        window.clearTimeout(window.cartToastTimer);
        window.cartToastTimer = window.setTimeout(() => {
            toast.classList.remove("show");
        }, 2500);
    }

    function addItemToCart(item) {
        const cart = getCartItems();
        const existing = cart.find((cartItem) => cartItem.title === item.title);
        if (existing) {
            existing.qty = (existing.qty || 1) + 1;
        } else {
            cart.push({ ...item, qty: 1 });
        }
        saveCartItems(cart);
        updateCartCount();
        showCartToast(`${item.title} added to cart`);
    }

    document.querySelector(".btn.add-to-cart")?.addEventListener("click", function (e) {
        e.stopPropagation();
        const title = document.querySelector(".modal-title")?.textContent.trim();
        const price = document.querySelector(".modal-price")?.textContent.trim() || "";
        const spice = document.querySelector(".modal-spice")?.textContent.replace("Spice Level:", "").trim() || "";
        if (!title) return;
        addItemToCart({ title, price, spice });
        document.getElementById("item-modal")?.classList.remove("active");
    });

    function renderCartPage() {
        const cartPage = document.getElementById("cart-page");
        if (!cartPage) return;

        const cartItemsEl = document.getElementById("cart-items");
        const cartSummary = document.getElementById("cart-summary");
        const emptyMessage = document.getElementById("cart-empty");
        const successMessage = document.getElementById("order-success");
        const cart = getCartItems();

        if (!cartItemsEl || !cartSummary || !emptyMessage) return;

        if (cart.length === 0) {
            cartItemsEl.innerHTML = "";
            cartSummary.style.display = "none";
            emptyMessage.style.display = "block";
            if (successMessage) {
                successMessage.style.display = "none";
            }
            return;
        }

        emptyMessage.style.display = "none";
        cartSummary.style.display = "flex";

        let total = 0;
        cartItemsEl.innerHTML = cart
            .map((item, index) => {
                const price = parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0;
                total += price * (item.qty || 1);
                return `
                    <div class="cart-item">
                        <div>
                            <h4>${item.title}</h4>
                            <p>${item.qty} × ${item.price}</p>
                        </div>
                        <button class="remove-item" data-index="${index}">Remove</button>
                    </div>
                `;
            })
            .join("");

        document.getElementById("cart-total").textContent = total.toFixed(2);
    }

    document.addEventListener("click", function (event) {
        const target = event.target;
        if (target.matches("#place-order-btn")) {
            event.preventDefault();
            const cart = getCartItems();
            if (cart.length === 0) {
                showCartToast("Your cart is empty.");
                return;
            }
            saveCartItems([]);
            updateCartCount();
            renderCartPage();
            const successMessage = document.getElementById("order-success");
            if (successMessage) {
                successMessage.textContent = "✅ Your order is placed. Thank you!";
                successMessage.classList.add("show");
                successMessage.style.display = "block";
                window.setTimeout(() => {
                    successMessage.classList.remove("show");
                }, 3500);
            }
        }

        if (target.matches(".remove-item")) {
            const index = Number(target.dataset.index);
            const cart = getCartItems();
            if (!Number.isFinite(index) || index < 0 || index >= cart.length) return;
            cart.splice(index, 1);
            saveCartItems(cart);
            updateCartCount();
            renderCartPage();
        }
    });

    updateCartCount();
    renderCartPage();

    // =========================
    // FEEDBACK FORM
    // =========================
    const feedbackForm = document.getElementById("feedback-form");

    if (feedbackForm) {
        feedbackForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.getElementById("feedback-name").value.trim();
            const message = document.getElementById("feedback-message").value.trim();

            if (!name || !message) {
                document.getElementById("feedback-error").textContent =
                    "Please fill out all fields.";
                return;
            }

            alert("Thank you for your feedback, " + name + "!");
            feedbackForm.reset();
        });
    }

    // =========================
    // FORM HELPERS
    // =========================
    function showError(input, message) {
        if (!input) return;

        input.classList.add("input-error");

        const errorElement = input.parentElement.querySelector(".error");
        if (errorElement) errorElement.textContent = message;
    }

    function clearErrors(form) {
        if (!form) return;

        form.querySelectorAll(".error").forEach(el => (el.textContent = ""));
        form.querySelectorAll("input, textarea").forEach(el =>
            el.classList.remove("input-error", "input-success")
        );
    }

    // =========================
    // RESERVATION FORM
    // =========================
    const resForm = document.getElementById("reservation-form");

    if (resForm) {
        resForm.addEventListener("submit", function (e) {
            e.preventDefault();

            let isValid = true;

            const name = document.getElementById("name");
            const email = document.getElementById("email");
            const date = document.getElementById("date");
            const time = document.getElementById("time");
            const guests = document.getElementById("guests");

            clearErrors(resForm);

            if (!name || name.value.trim().length < 3) {
                showError(name, "Name must be at least 3 characters");
                isValid = false;
            }

            if (!email || !email.value.match(emailPattern)) {
                showError(email, "Invalid email");
                isValid = false;
            }

            if (!date || date.value < new Date().toISOString().split("T")[0]) {
                showError(date, "Select a valid date");
                isValid = false;
            }

            if (!time || time.value === "") {
                showError(time, "Select time");
                isValid = false;
            }

            if (!guests || guests.value <= 0) {
                showError(guests, "Guests must be at least 1");
                isValid = false;
            }

            if (isValid) {
                resForm.style.display = "none";
                const successMessage = document.getElementById("success-message");
                if (successMessage) {
                    successMessage.style.display = "block";
                }
                resForm.reset();
            }
        });
    }

    // =========================
    // CONTACT FORM
    // =========================
    const contactForm = document.getElementById("contact-form");

    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            let isValid = true;

            const name = document.getElementById("cname");
            const email = document.getElementById("cemail");
            const message = document.getElementById("cmessage");

            clearErrors(contactForm);

            if (!name || name.value.trim().length < 3) {
                showError(name, "Name too short");
                isValid = false;
            }

            if (!email || !email.value.match(emailPattern)) {
                showError(email, "Invalid email");
                isValid = false;
            }

            if (!message || message.value.trim().length < 10) {
                showError(message, "Message must be at least 10 characters");
                isValid = false;
            }

            if (isValid) {
                alert("✅ Thank you for contacting Royal Thali!");

                contactForm.style.display = "none";
                const successBox = document.getElementById("contact-success");
if (successBox) {
    successBox.style.display = "block";
}
            }
        });
    }

});

// =========================
// RESET CONTACT
// =========================
function resetContact() {
    const form = document.getElementById("contact-form");
    const successBox = document.getElementById("contact-success");
    if (!form) return;

    form.reset();
    form.style.display = "block";
    if (successBox) {
        successBox.style.display = "none";
    }
}

function resetReservation() {
    const form = document.getElementById("reservation-form");
    const successMessage = document.getElementById("success-message");
    if (!form) return;

    form.reset();
    form.style.display = "block";
    if (successMessage) {
        successMessage.style.display = "none";
    }
}

// =========================
// COOKIES
// =========================
function acceptCookies() {
  const cookieBox = document.getElementById("cookie-box");
if (cookieBox) {
    cookieBox.style.display = "none";
}
    localStorage.setItem("cookiesAccepted", "true");
}

window.onload = function () {
    if (localStorage.getItem("cookiesAccepted")) {
        const cookieBox = document.getElementById("cookie-box");
if (cookieBox) {
    cookieBox.style.display = "none";
}
    }
};