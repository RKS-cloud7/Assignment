const CART_KEY = "royalThaliCart";
const menuHeader = document.querySelector(".site-header");
const navToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".site-nav");
const tabButtons = document.querySelectorAll(".tab-btn");
const categories = document.querySelectorAll(".menu-category");
const spiceSelect = document.querySelector("#spice-level");
const menuItems = document.querySelectorAll(".menu-item");
const modal = document.querySelector("#item-modal");
const closeModalButton = document.querySelector(".close-modal");
const addToCartButton = document.querySelector(".add-to-cart-btn");

let selectedItem = null;

if (menuHeader) {
    const handleHeader = () => {
        menuHeader.classList.toggle("scrolled", window.scrollY > 16);
    };

    handleHeader();
    window.addEventListener("scroll", handleHeader, { passive: true });
}

if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("open");
            navToggle.setAttribute("aria-expanded", "false");
        });
    });
}

const applyFilter = () => {
    const activeCategory = document.querySelector(".menu-category.active");
    const selectedSpice = spiceSelect ? spiceSelect.value : "all";

    menuItems.forEach((item) => item.classList.remove("is-hidden"));

    if (!activeCategory) {
        return;
    }

    activeCategory.querySelectorAll(".menu-item").forEach((item) => {
        const itemSpice = item.dataset.spice;
        const hideItem = selectedSpice !== "all" && itemSpice !== selectedSpice;
        item.classList.toggle("is-hidden", hideItem);
    });
};

tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const categoryId = button.dataset.category;

        tabButtons.forEach((btn) => btn.classList.remove("active"));
        categories.forEach((section) => section.classList.remove("active"));

        button.classList.add("active");
        const selectedCategory = document.getElementById(categoryId);
        if (selectedCategory) {
            selectedCategory.classList.add("active");
        }

        localStorage.setItem("royalThaliCategory", categoryId);
        applyFilter();
    });
});

if (spiceSelect) {
    spiceSelect.addEventListener("change", () => {
        localStorage.setItem("royalThaliSpice", spiceSelect.value);
        applyFilter();
    });
}

const openModal = (item) => {
    if (!modal) {
        return;
    }

    const title = item.querySelector("h3")?.textContent || "";
    const description = item.querySelector("p")?.textContent || "";
    const price = item.querySelector(".item-price")?.textContent || "";
    const spice = item.dataset.spice || "mild";
    const image = item.querySelector("img");

    selectedItem = {
        name: title,
        description,
        spice,
        price,
        image: image?.getAttribute("src") || "",
        quantity: 1
    };

    modal.querySelector(".modal-title").textContent = title;
    modal.querySelector(".modal-description").textContent = description;
    modal.querySelector(".modal-spice").textContent = `Spice Level: ${spice.charAt(0).toUpperCase()}${spice.slice(1)}`;
    modal.querySelector(".modal-price").textContent = price;

    const modalImage = modal.querySelector(".modal-img");
    modalImage.src = image?.src || "";
    modalImage.alt = image?.alt || title;

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
}

menuItems.forEach((item) => {
    item.addEventListener("click", () => openModal(item));
});

if (closeModalButton && modal) {
    closeModalButton.addEventListener("click", closeModal);

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
}

if (addToCartButton) {
    addToCartButton.addEventListener("click", () => {
        if (!selectedItem) {
            return;
        }

        const cart = readCart();
        const existing = cart.find((item) => item.name === selectedItem.name);

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push(selectedItem);
        }

        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        addToCartButton.textContent = "Added";

        setTimeout(() => {
            addToCartButton.textContent = "Add to Cart";
            closeModal();
        }, 700);
    });
}

const savedCategory = localStorage.getItem("royalThaliCategory");
const savedSpice = localStorage.getItem("royalThaliSpice");

if (savedCategory) {
    document.querySelector(`.tab-btn[data-category="${savedCategory}"]`)?.click();
}

if (spiceSelect && savedSpice) {
    spiceSelect.value = savedSpice;
}

applyFilter();

function readCart() {
    try {
        const stored = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
        return Array.isArray(stored) ? stored : [];
    } catch (error) {
        return [];
    }
}

function closeModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
}
