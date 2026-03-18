// ========== Lazy Image Loading (Blur-Up) ==========
(() => {
    const lazyImgs = document.querySelectorAll('img.lazy-img[data-src]');
    
    const loadImage = (img) => {
        const realSrc = img.dataset.src;
        if (!realSrc) return;
        const temp = new Image();
        temp.onload = () => {
            img.src = realSrc;
            img.classList.add('loaded');
            delete img.dataset.src;
        };
        temp.src = realSrc;
    };

    // Hero image: load immediately
    const heroImg = document.querySelector('.hero-bg .lazy-img[data-src]');
    if (heroImg) loadImage(heroImg);

    // Other images: use IntersectionObserver
    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadImage(entry.target);
                    imgObserver.unobserve(entry.target);
                }
            });
        }, { rootMargin: '200px 0px' });

        lazyImgs.forEach(img => {
            if (img !== heroImg) imgObserver.observe(img);
        });
    } else {
        // Fallback: load all
        lazyImgs.forEach(loadImage);
    }
})();

// ========== Navbar Scroll Effect ==========
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ========== Mobile Nav Toggle ==========
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
    });
});

// ========== Solution Tabs ==========
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.tab;

        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById('tab-' + target).classList.add('active');
    });
});

// ========== Number Counter Animation ==========
const statNumbers = document.querySelectorAll('.stat-number[data-target]');

const animateCounter = (el) => {
    const target = parseInt(el.dataset.target);
    const duration = 1500;
    const start = performance.now();

    const update = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased);

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    };

    requestAnimationFrame(update);
};

// ========== Scroll Animations (IntersectionObserver) ==========
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

// Fade-in elements
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add fade-in class to sections
document.querySelectorAll(
    '.pain-card, .deliver-card, .arch-card, .cloud-feature, ' +
    '.pipeline-step, .sdk-card, .roadmap-item, .tech-item, ' +
    '.pricing-card, .news-card, .stat-item'
).forEach(el => {
    el.classList.add('fade-in');
    fadeObserver.observe(el);
});

// Counter animation observer
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            statNumbers.forEach(animateCounter);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    counterObserver.observe(statsSection);
}

// ========== Contact Form ==========
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = '已提交，感谢您的咨询！';
        btn.style.background = 'linear-gradient(135deg, #00E5CC, #00BFFF)';
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
            contactForm.reset();
        }, 3000);
    });
}

// ========== Smooth scroll for anchor links ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = navbar.offsetHeight + 10;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});
