/* ===== MAIN JAVASCRIPT FUNCTIONALITY ===== */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initTypingEffect();
    initScrollAnimations();
    initScrollHeader();
    initSkillsInteraction();
});

/* ===== TYPING EFFECT ===== */
function initTypingEffect() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;
    
    const texts = [
        'Data Science Student',
        'Machine Learning Researcher',
        'Responsible AI Advocate',
        'Full-Stack Developer',
        'Startup Founder'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function typeText() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            // Pause at end of text
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500;
        }
        
        setTimeout(typeText, typingSpeed);
    }
    
    // Start typing effect
    typeText();
}

/* ===== SCROLL HEADER ===== */
function initScrollHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    
    function scrollHeader() {
        if (window.scrollY >= 50) {
            header.classList.add('scroll-header');
        } else {
            header.classList.remove('scroll-header');
        }
    }
    
    window.addEventListener('scroll', scrollHeader);
}

/* ===== SCROLL ANIMATIONS ===== */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate skill bars when about section is visible
                if (entry.target.classList.contains('about')) {
                    animateSkillBars();
                }
            }
        });
    }, observerOptions);
    
    // Observe sections for scroll animations
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
    
    // Observe individual elements
    const animatedElements = document.querySelectorAll('.hero__content, .hero__image, .about__content');
    animatedElements.forEach(element => {
        element.classList.add('slide-up');
        observer.observe(element);
    });
}

/* ===== SKILL BARS ANIMATION ===== */
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skills__percentage');
    
    skillBars.forEach((bar, index) => {
        const targetWidth = bar.getAttribute('data-width') || bar.style.width;
        
        // Reset width to 0
        bar.style.width = '0%';
        
        // Animate each bar with a staggered delay
        setTimeout(() => {
            bar.style.width = targetWidth;
            
            // Add a pulse effect when animation completes
            setTimeout(() => {
                bar.style.boxShadow = '0 0 10px rgba(37, 99, 235, 0.3)';
                setTimeout(() => {
                    bar.style.boxShadow = 'none';
                }, 500);
            }, 1500);
            
        }, index * 100 + 300);
    });
}

/* ===== ENHANCED SKILLS INTERACTION ===== */
function initSkillsInteraction() {
    const skillCategories = document.querySelectorAll('.skills__category');
    
    skillCategories.forEach(category => {
        const skillItems = category.querySelectorAll('.skills__item');
        
        skillItems.forEach(item => {
            const skillBar = item.querySelector('.skills__percentage');
            const skillName = item.querySelector('.skills__name');
            const skillLevel = item.querySelector('.skills__level');
            
            // Add hover effects
            item.addEventListener('mouseenter', () => {
                skillBar.style.transform = 'scaleY(1.2)';
                skillBar.style.boxShadow = '0 2px 8px rgba(37, 99, 235, 0.3)';
                skillName.style.color = 'var(--primary-color)';
                skillLevel.style.color = 'var(--primary-color)';
            });
            
            item.addEventListener('mouseleave', () => {
                skillBar.style.transform = 'scaleY(1)';
                skillBar.style.boxShadow = 'none';
                skillName.style.color = 'var(--title-color)';
                skillLevel.style.color = 'var(--text-color-light)';
            });
        });
    });
    
    // Add click interaction for skill tags
    const skillTags = document.querySelectorAll('.skills__tag');
    skillTags.forEach(tag => {
        tag.addEventListener('click', () => {
            // Add a ripple effect
            tag.style.transform = 'scale(0.95)';
            setTimeout(() => {
                tag.style.transform = 'scale(1)';
            }, 150);
            
            // You could add functionality here to filter projects by skill
            console.log(`Clicked skill: ${tag.textContent}`);
        });
    });
}

/* ===== NAVIGATION FUNCTIONALITY ===== */
function initNavigation() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu');
        });
    }
    
    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    }
    
    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active link highlighting
    function updateActiveLink() {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav__link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const headerHeight = document.querySelector('.header').offsetHeight;
            
            if (window.scrollY >= (sectionTop - headerHeight - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active-link');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Initial call
}

/* ===== UTILITY FUNCTIONS ===== */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced scroll handler for performance
const debouncedScrollHandler = debounce(() => {
    // Any scroll-based functionality can be added here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

/* ===== PERFORMANCE OPTIMIZATIONS ===== */
// Preload critical images
function preloadImages() {
    const criticalImages = [
        'assets/images/profile.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading
preloadImages();

/* ===== INTERACTIVE COMPONENTS ===== */

// Back to top button
function initBackToTop() {
    const backToTopBtn = createBackToTopButton();
    
    const toggleBackToTop = () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    };
    
    const debouncedToggle = debounce(toggleBackToTop, 100);
    window.addEventListener('scroll', debouncedToggle);
    
    backToTopBtn.addEventListener('click', () => {
        if (window.navigationController) {
            window.navigationController.scrollToTop();
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

function createBackToTopButton() {
    const button = document.createElement('button');
    button.className = 'back-to-top';
    button.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="18,15 12,9 6,15"></polyline>
        </svg>
    `;
    button.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(button);
    return button;
}

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = createThemeToggle();
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeToggle(themeToggle, currentTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeToggle(themeToggle, newTheme);
    });
}

function createThemeToggle() {
    const button = document.createElement('button');
    button.className = 'theme-toggle';
    button.setAttribute('aria-label', 'Toggle theme');
    
    const nav = document.querySelector('.nav');
    if (nav) {
        nav.appendChild(button);
    }
    
    return button;
}

function updateThemeToggle(button, theme) {
    const sunIcon = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
    `;
    
    const moonIcon = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
    `;
    
    button.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    }
}

// Tooltip functionality
function initTooltips() {
    const elementsWithTooltips = document.querySelectorAll('[data-tooltip]');
    
    elementsWithTooltips.forEach(element => {
        const tooltip = createTooltip(element.dataset.tooltip);
        
        element.addEventListener('mouseenter', (e) => {
            showTooltip(tooltip, e.target);
        });
        
        element.addEventListener('mouseleave', () => {
            hideTooltip(tooltip);
        });
        
        element.addEventListener('focus', (e) => {
            showTooltip(tooltip, e.target);
        });
        
        element.addEventListener('blur', () => {
            hideTooltip(tooltip);
        });
    });
}

function createTooltip(text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    document.body.appendChild(tooltip);
    return tooltip;
}

function showTooltip(tooltip, target) {
    const rect = target.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 + 'px';
    tooltip.style.top = rect.top - 10 + 'px';
    tooltip.classList.add('show');
}

function hideTooltip(tooltip) {
    tooltip.classList.remove('show');
}

// Keyboard shortcuts
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Alt + H: Go to home
        if (e.altKey && e.key === 'h') {
            e.preventDefault();
            document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Alt + P: Go to projects
        if (e.altKey && e.key === 'p') {
            e.preventDefault();
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Alt + R: Go to research
        if (e.altKey && e.key === 'r') {
            e.preventDefault();
            document.getElementById('research')?.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Alt + C: Go to contact
        if (e.altKey && e.key === 'c') {
            e.preventDefault();
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Alt + T: Toggle theme
        if (e.altKey && e.key === 't') {
            e.preventDefault();
            const themeToggle = document.querySelector('.theme-toggle');
            if (themeToggle) {
                themeToggle.click();
            }
        }
    });
}

// Page loading animation
function initPageLoading() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <p class="loader-text">Loading Portfolio...</p>
        </div>
    `;
    
    document.body.appendChild(loader);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 1000);
    });
}

// Initialize all interactive components
document.addEventListener('DOMContentLoaded', function() {
    // Initialize existing components
    initNavigation();
    initTypingEffect();
    initScrollAnimations();
    initScrollHeader();
    initSkillsInteraction();
    
    // Initialize new interactive components
    initBackToTop();
    initThemeToggle();
    initLazyLoading();
    initTooltips();
    initKeyboardShortcuts();
    initPageLoading();
});