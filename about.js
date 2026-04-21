const aboutNavToggle = document.querySelector(".nav-toggle");
const aboutNav = document.querySelector(".site-nav");

if (aboutNavToggle && aboutNav) {
    aboutNavToggle.addEventListener("click", () => {
        const isOpen = aboutNav.classList.toggle("is-open");
        aboutNavToggle.setAttribute("aria-expanded", String(isOpen));
    });

    aboutNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            aboutNav.classList.remove("is-open");
            aboutNavToggle.setAttribute("aria-expanded", "false");
        });
    });
}

const aboutRevealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && aboutRevealItems.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    aboutRevealItems.forEach((item) => revealObserver.observe(item));
} else {
    aboutRevealItems.forEach((item) => item.classList.add("is-visible"));
}

const statNumbers = document.querySelectorAll(".stat-number");

const animateValue = (element) => {
    const target = Number(element.dataset.target || 0);
    const duration = 1200;
    const start = performance.now();

    const update = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        element.textContent = Math.floor(progress * target);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = String(target);
        }
    };

    requestAnimationFrame(update);
};

if ("IntersectionObserver" in window && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateValue(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    statNumbers.forEach((stat) => statsObserver.observe(stat));
} else {
    statNumbers.forEach((stat) => {
        stat.textContent = stat.dataset.target || "0";
    });
}
