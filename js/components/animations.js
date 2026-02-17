/* ===== SCROLL ANIMATIONS AND TRANSITIONS ===== */

// Animation utilities and effects
class AnimationController {
    constructor() {
        this.observers = new Map();
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.setupParallaxEffects();
        this.setupHoverAnimations();
    }
    
    /* ===== INTERSECTION OBSERVER FOR SCROLL ANIMATIONS ===== */
    setupIntersectionObserver() {
        const options = {
            threshold: [0.1, 0.3, 0.7],
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.handleIntersection(entry);
                }
            });
        }, options);
        
        // Observe elements with animation classes
        const animatedElements = document.querySelectorAll(
            '.fade-in, .slide-up, .slide-left, .slide-right, .scale-in'
        );
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
        
        this.observers.set('main', observer);
    }
    
    handleIntersection(entry) {
        const element = entry.target;
        const animationDelay = element.dataset.delay || 0;
        
        setTimeout(() => {
            element.classList.add('visible');
            
            // Trigger specific animations based on element type
            if (element.classList.contains('skills__percentage')) {
                this.animateSkillBar(element);
            }
            
            if (element.classList.contains('counter')) {
                this.animateCounter(element);
            }
        }, animationDelay);
    }
    
    /* ===== SKILL BAR ANIMATIONS ===== */
    animateSkillBar(skillBar) {
        const targetWidth = skillBar.dataset.width || skillBar.style.width;
        skillBar.style.width = '0%';
        
        setTimeout(() => {
            skillBar.style.width = targetWidth;
        }, 300);
    }
    
    /* ===== COUNTER ANIMATIONS ===== */
    animateCounter(counterElement) {
        const target = parseInt(counterElement.dataset.target) || 0;
        const duration = parseInt(counterElement.dataset.duration) || 2000;
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counterElement.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counterElement.textContent = target;
            }
        };
        
        updateCounter();
    }
    
    /* ===== PARALLAX EFFECTS ===== */
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        if (parallaxElements.length === 0) return;
        
        const handleParallax = () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const rate = scrolled * -0.5;
                element.style.transform = `translateY(${rate}px)`;
            });
        };
        
        // Use requestAnimationFrame for smooth parallax
        let ticking = false;
        const requestParallax = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleParallax();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestParallax);
    }
    
    /* ===== HOVER ANIMATIONS ===== */
    setupHoverAnimations() {
        // Card hover effects
        const cards = document.querySelectorAll('.card, .project__card, .research__card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = 'var(--shadow-large)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'var(--shadow-light)';
            });
        });
        
        // Button ripple effect
        const buttons = document.querySelectorAll('.button');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
    
    /* ===== STAGGER ANIMATIONS ===== */
    staggerAnimation(elements, delay = 100) {
        elements.forEach((element, index) => {
            element.style.animationDelay = `${index * delay}ms`;
            element.classList.add('stagger-item');
        });
    }
    
    /* ===== REVEAL ANIMATIONS ===== */
    revealOnScroll(selector, animationType = 'fade-in') {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(element => {
            element.classList.add(animationType);
        });
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(element => observer.observe(element));
    }
    
    /* ===== CLEANUP ===== */
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
    }
}

// Initialize animation controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.animationController = new AnimationController();
});

/* ===== CSS ANIMATION CLASSES ===== */
// These classes work with the CSS animations defined in the stylesheets

// Add ripple effect styles dynamically
const rippleStyles = `
.button {
    position: relative;
    overflow: hidden;
}

.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.stagger-item {
    opacity: 0;
    transform: translateY(20px);
    animation: stagger-fade-in 0.6s ease forwards;
}

@keyframes stagger-fade-in {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = rippleStyles;
document.head.appendChild(styleSheet);