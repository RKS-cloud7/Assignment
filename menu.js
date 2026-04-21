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

    const spiceSelect = document.getElementById('spice-level');
    const cartToast = document.getElementById('cart-toast');

    function getCartItems() {
        try {
            return JSON.parse(localStorage.getItem('cartItems')) || [];
        } catch (e) {
            return [];
        }
    }

    function saveCartItems(items) {
        localStorage.setItem('cartItems', JSON.stringify(items));
    }

    function updateCartCount() {
        const countEl = document.getElementById('cart-count');
        const cart = getCartItems();
        const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
        if (countEl) countEl.textContent = totalQty;
    }

    function showCartToast(message) {
        if (!cartToast) return;
        cartToast.textContent = message;
        cartToast.classList.add('show');
        window.clearTimeout(window.cartToastTimer);
        window.cartToastTimer = window.setTimeout(function () {
            cartToast.classList.remove('show');
        }, 2500);
    }

    function addItemToCart(item) {
        const cart = getCartItems();
        const existing = cart.find(function (cartItem) {
            return cartItem.title === item.title;
        });
        if (existing) {
            existing.qty = (existing.qty || 1) + 1;
        } else {
            cart.push(Object.assign({}, item, { qty: 1 }));
        }
        saveCartItems(cart);
        updateCartCount();
        showCartToast(item.title + ' added to cart');
    }

    function activateCategory(category) {
        document.querySelectorAll('.tab-btn').forEach(function (button) {
            button.classList.toggle('active', button.dataset.category === category);
        });
        document.querySelectorAll('.menu-category').forEach(function (section) {
            section.classList.toggle('active', section.id === category);
        });
    }

    function applySpiceFilter(level) {
        document.querySelectorAll('.menu-item').forEach(function (item) {
            item.style.display = level === 'all' || item.dataset.spice === level ? 'block' : 'none';
        });
    }

    document.querySelectorAll('.tab-btn').forEach(function (button) {
        button.addEventListener('click', function () {
            activateCategory(this.dataset.category);
            localStorage.setItem('lastTab', this.dataset.category);
        });
    });

    if (spiceSelect) {
        spiceSelect.addEventListener('change', function () {
            applySpiceFilter(this.value);
            localStorage.setItem('lastSpice', this.value);
        });
    }

    const lastTab = localStorage.getItem('lastTab');
    if (lastTab) {
        activateCategory(lastTab);
    }
    const lastSpice = localStorage.getItem('lastSpice');
    if (lastSpice && spiceSelect) {
        spiceSelect.value = lastSpice;
        applySpiceFilter(lastSpice);
    }

    document.querySelectorAll('.menu-item').forEach(function (item) {
        item.addEventListener('click', function () {
            document.querySelector('.modal-title').textContent = this.querySelector('h3')?.textContent || '';
            document.querySelector('.modal-description').textContent = this.querySelector('p')?.textContent || '';
            document.querySelector('.modal-spice').textContent = 'Spice Level: ' + (this.dataset.spice || 'N/A');
            document.querySelector('.modal-price').textContent = this.querySelector('.item-price')?.textContent || '';
            document.querySelector('.modal-img').src = this.querySelector('img')?.src || '';
            document.getElementById('item-modal')?.classList.add('active');
        });
    });

    document.querySelector('.close-modal')?.addEventListener('click', function () {
        document.getElementById('item-modal')?.classList.remove('active');
    });

    window.addEventListener('click', function (e) {
        if (e.target.id === 'item-modal') {
            document.getElementById('item-modal')?.classList.remove('active');
        }
    });

    document.querySelector('.btn.add-to-cart')?.addEventListener('click', function (e) {
        e.stopPropagation();
        const title = document.querySelector('.modal-title')?.textContent.trim();
        const price = document.querySelector('.modal-price')?.textContent.trim() || '';
        const spice = document.querySelector('.modal-spice')?.textContent.replace('Spice Level:', '').trim() || '';
        if (!title) return;
        addItemToCart({ title: title, price: price, spice: spice });
        document.getElementById('item-modal')?.classList.remove('active');
    });

    updateCartCount();
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