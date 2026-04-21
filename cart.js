const CART_KEY = "royalThaliCart";
const cartItemsEl = document.getElementById("cart-items");
const emptyStateEl = document.getElementById("empty-state");
const subtotalEl = document.getElementById("subtotal");
const packagingEl = document.getElementById("packaging");
const taxEl = document.getElementById("tax");
const totalEl = document.getElementById("total");
const clearCartButton = document.getElementById("clear-cart");
const checkoutButton = document.getElementById("checkout-btn");
const orderSuccessEl = document.getElementById("order-success");
const newOrderButton = document.getElementById("new-order-btn");
const summaryCardEl = document.getElementById("summary-card");
const promoCardEl = document.getElementById("promo-card");
const cartHeadingEl = document.querySelector(".cart-panel .section-heading");

let cart = readCart();
let orderPlaced = false;

renderCart();

clearCartButton.addEventListener("click", () => {
    cart = [];
    saveCart();
    renderCart();
});

checkoutButton.addEventListener("click", () => {
    if (!cart.length) {
        return;
    }

    cart = [];
    saveCart();
    orderPlaced = true;
    renderCart();
});

if (newOrderButton) {
    newOrderButton.addEventListener("click", () => {
        orderPlaced = false;
        renderCart();
    });
}

function renderCart() {
    cartItemsEl.innerHTML = "";
    orderSuccessEl.hidden = true;
    cartItemsEl.classList.remove("is-hidden");
    summaryCardEl.classList.remove("is-hidden");
    promoCardEl.classList.remove("is-hidden");
    cartHeadingEl.classList.remove("is-hidden");

    if (orderPlaced) {
        emptyStateEl.hidden = true;
        clearCartButton.disabled = true;
        cartItemsEl.classList.add("is-hidden");
        summaryCardEl.classList.add("is-hidden");
        promoCardEl.classList.add("is-hidden");
        cartHeadingEl.classList.add("is-hidden");
        orderSuccessEl.hidden = false;
        updateSummary(0);
        return;
    }

    if (!cart.length) {
        emptyStateEl.hidden = false;
        clearCartButton.disabled = true;
        updateSummary(0);
        return;
    }

    emptyStateEl.hidden = true;
    clearCartButton.disabled = false;

    cart.forEach((item, index) => {
        const article = document.createElement("article");
        article.className = "cart-item";
        article.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div>
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="item-meta">
                    <span class="price-tag">${item.price}</span>
                    <span class="spice-tag">${capitalize(item.spice)} spice</span>
                </div>
            </div>
            <div class="item-actions">
                <div class="quantity-control">
                    <button type="button" data-action="decrease" data-index="${index}">-</button>
                    <strong>${item.quantity}</strong>
                    <button type="button" data-action="increase" data-index="${index}">+</button>
                </div>
                <button class="remove-btn" type="button" data-action="remove" data-index="${index}">Remove</button>
            </div>
        `;
        cartItemsEl.appendChild(article);
    });

    cartItemsEl.querySelectorAll("button[data-action]").forEach((button) => {
        button.addEventListener("click", handleCartAction);
    });

    updateSummary(getSubtotal());
}

function handleCartAction(event) {
    const action = event.currentTarget.dataset.action;
    const index = Number(event.currentTarget.dataset.index);
    const item = cart[index];

    if (!item) {
        return;
    }

    if (action === "increase") {
        item.quantity += 1;
    }

    if (action === "decrease") {
        item.quantity = Math.max(1, item.quantity - 1);
    }

    if (action === "remove") {
        cart.splice(index, 1);
    }

    saveCart();
    renderCart();
}

function getSubtotal() {
    return cart.reduce((sum, item) => sum + extractPrice(item.price) * item.quantity, 0);
}

function updateSummary(subtotal) {
    const packaging = cart.length ? 2.5 : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + packaging + tax;

    subtotalEl.textContent = formatCurrency(subtotal);
    packagingEl.textContent = formatCurrency(packaging);
    taxEl.textContent = formatCurrency(tax);
    totalEl.textContent = formatCurrency(total);
}

function extractPrice(value) {
    return Number(String(value).replace(/[^0-9.]/g, "")) || 0;
}

function formatCurrency(value) {
    return `$${value.toFixed(2)}`;
}

function capitalize(value) {
    if (!value) {
        return "Mild";
    }
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function readCart() {
    try {
        const stored = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
        return Array.isArray(stored) ? stored : [];
    } catch (error) {
        return [];
    }
}

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
