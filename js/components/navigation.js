/* ===== ENHANCED NAVIGATION FUNCTIONALITY ===== */

class NavigationController {
    constructor() {
        this.header = document.getElementById('header');
        this.navMenu = document.getElementById('nav-menu');
        this.navToggle = document.getElementById('nav-toggle');
        this.navClose = document.getElementById('nav-close');
        this.navLinks = document.querySelectorAll('.nav__link');
        this.sections = document.querySelectorAll('.section');

        this.isScrolling = false;
        this.scrollTimeout = null;

        this.init();
    }

    init() {
        this.setupMobileNavigation();
        this.setupSmoothScrolling();
        this.setupActiveNavigation();
        this.setupScrollHeader();
        this.setupKeyboardNavigation();
        this.setupScrollSpy();
    }

    setupMobileNavigation() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => {
                this.openMobileMenu();
            });
        }

        if (this.navClose) {
            this.navClose.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.navMenu.classList.contains('show-menu') &&
                !this.navMenu.contains(e.target) &&
                !this.navToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navMenu.classList.contains('show-menu')) {
                this.closeMobileMenu();
            }
        });
    }

    openMobileMenu() {
        this.navMenu.classList.add('show-menu');
        document.body.style.overflow = 'hidden';

        // Focus first nav link for accessibility
        const firstLink = this.navMenu.querySelector('.nav__link');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
        }
    }

    closeMobileMenu() {
        this.navMenu.classList.remove('show-menu');
        document.body.style.overflow = '';

        // Return focus to toggle button
        if (this.navToggle) {
            this.navToggle.focus();
        }
    }

    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');

                // Only intercept hash links
                if (targetId.startsWith('#')) {
                    e.preventDefault();

                    const targetSection = document.querySelector(targetId);

                    if (targetSection) {
                        this.scrollToSection(targetSection);
                        this.closeMobileMenu();
                    }
                }
            });
        });
    }

    scrollToSection(targetSection) {
        const headerHeight = this.header.offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight - 20;

        // Smooth scroll with easing
        this.smoothScrollTo(targetPosition, 800);
    }

    smoothScrollTo(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const easeInOutCubic = (t) => {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        };

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = easeInOutCubic(progress);

            window.scrollTo(0, startPosition + distance * ease);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    setupActiveNavigation() {
        const updateActiveLink = () => {
            let current = '';
            const headerHeight = this.header.offsetHeight;

            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;

                if (window.scrollY >= (sectionTop - headerHeight - 200)) {
                    current = section.getAttribute('id');
                }
            });

            this.navLinks.forEach(link => {
                link.classList.remove('active-link');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active-link');
                }
            });
        };

        // Throttled scroll handler for performance
        const throttledUpdate = this.throttle(updateActiveLink, 100);
        window.addEventListener('scroll', throttledUpdate);
        updateActiveLink(); // Initial call
    }

    setupScrollHeader() {
        const updateScrollHeader = () => {
            if (window.scrollY >= 50) {
                this.header.classList.add('scroll-header');
            } else {
                this.header.classList.remove('scroll-header');
            }
        };

        const throttledUpdate = this.throttle(updateScrollHeader, 100);
        window.addEventListener('scroll', throttledUpdate);
        updateScrollHeader(); // Initial call
    }

    setupKeyboardNavigation() {
        this.navLinks.forEach((link, index) => {
            link.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    const nextIndex = (index + 1) % this.navLinks.length;
                    this.navLinks[nextIndex].focus();
                } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const prevIndex = (index - 1 + this.navLinks.length) % this.navLinks.length;
                    this.navLinks[prevIndex].focus();
                }
            });
        });
    }

    setupScrollSpy() {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: `-${this.header.offsetHeight}px 0px -50% 0px`
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    this.updateActiveNavLink(sectionId);
                }
            });
        }, observerOptions);

        this.sections.forEach(section => {
            observer.observe(section);
        });
    }

    updateActiveNavLink(sectionId) {
        this.navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active-link');
            }
        });
    }

    // Utility function for throttling
    throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Public methods for external use
    scrollToTop() {
        this.smoothScrollTo(0, 600);
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            this.scrollToSection(section);
        }
    }

    getCurrentSection() {
        const headerHeight = this.header.offsetHeight;
        let current = '';

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - headerHeight - 200)) {
                current = section.getAttribute('id');
            }
        });

        return current;
    }
}

// Initialize navigation controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.navigationController = new NavigationController();
});