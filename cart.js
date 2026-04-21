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
        const totalQty = cart.reduce(function (sum, item) {
            return sum + (item.qty || 1);
        }, 0);
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

    function renderCartPage() {
        const cartItemsEl = document.getElementById('cart-items');
        const cartSummary = document.getElementById('cart-summary');
        const emptyMessage = document.getElementById('cart-empty');
        const successMessage = document.getElementById('order-success');
        const cart = getCartItems();

        if (!cartItemsEl || !cartSummary || !emptyMessage) return;

        if (cart.length === 0) {
            cartItemsEl.innerHTML = '';
            cartSummary.style.display = 'none';
            emptyMessage.style.display = 'block';
            if (successMessage) successMessage.style.display = 'none';
            return;
        }

        emptyMessage.style.display = 'none';
        cartSummary.style.display = 'flex';

        let subtotal = 0;
        cartItemsEl.innerHTML = cart.map(function (item, index) {
            const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
            subtotal += price * (item.qty || 1);
            return '<div class="cart-item">' +
                '<div><h4>' + item.title + '</h4><p>' + item.qty + ' × ' + item.price + '</p></div>' +
                '<button class="remove-item" data-index="' + index + '">Remove</button>' +
                '</div>';
        }).join('');

        // Calculate delivery charge
        const deliveryCharge = subtotal > 50 ? 0 : 3.99;
        const total = subtotal + deliveryCharge;

        // Update summary
        const subtotalEl = document.getElementById('subtotal');
        const deliveryEl = document.getElementById('delivery-charge');
        const totalEl = document.getElementById('cart-total');

        if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);
        if (deliveryEl) deliveryEl.textContent = deliveryCharge === 0 ? 'Free' : '$' + deliveryCharge.toFixed(2);
        if (totalEl) totalEl.textContent = total.toFixed(2);
    }

    function removeCartItem(index) {
        const cart = getCartItems();
        if (!Number.isFinite(index) || index < 0 || index >= cart.length) return;
        cart.splice(index, 1);
        saveCartItems(cart);
        updateCartCount();
        renderCartPage();
    }

    document.addEventListener('click', function (event) {
        if (event.target.matches('#place-order-btn')) {
            event.preventDefault();
            const cart = getCartItems();
            if (cart.length === 0) {
                showCartToast('Your cart is empty.');
                return;
            }
            saveCartItems([]);
            updateCartCount();
            renderCartPage();
            const successMessage = document.getElementById('order-success');
            if (successMessage) {
                successMessage.textContent = '✅ Your order is placed. Thank you!';
                successMessage.style.display = 'block';
                successMessage.classList.add('show');
                window.setTimeout(function () {
                    successMessage.classList.remove('show');
                }, 3500);
            }
        }

        if (event.target.matches('.remove-item')) {
            const index = Number(event.target.dataset.index);
            removeCartItem(index);
        }
    });

    updateCartCount();
    renderCartPage();
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