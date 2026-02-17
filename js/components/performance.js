/* ===== PERFORMANCE OPTIMIZATION MODULE ===== */

class PerformanceOptimizer {
    constructor() {
        this.imageObserver = null;
        this.loadedImages = new Set();
        this.criticalImages = new Set();

        this.init();
    }

    init() {
        this.setupImageOptimization();
        this.setupResourceHints();
        this.setupCriticalResourceLoading();
        this.setupPerformanceMonitoring();
        this.setupServiceWorker();
    }

    /* ===== IMAGE OPTIMIZATION ===== */
    setupImageOptimization() {
        this.setupLazyLoading();
        // this.setupResponsiveImages(); // Disabled: Requires server-side generated responsive images
        this.setupImagePreloading();
        // this.setupWebPSupport(); // Disabled: Requires server-side generated WebP images
    }

    setupLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');

        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.imageObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            lazyImages.forEach(img => {
                this.imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            lazyImages.forEach(img => this.loadImage(img));
        }
    }

    loadImage(img) {
        return new Promise((resolve, reject) => {
            const imageUrl = img.dataset.src || img.src;

            if (this.loadedImages.has(imageUrl)) {
                resolve(img);
                return;
            }

            const tempImg = new Image();

            tempImg.onload = () => {
                img.src = imageUrl;
                img.classList.remove('lazy');
                img.classList.add('loaded');
                this.loadedImages.add(imageUrl);

                // Fade in animation
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
                requestAnimationFrame(() => {
                    img.style.opacity = '1';
                });

                resolve(img);
            };

            tempImg.onerror = () => {
                img.classList.add('error');
                this.handleImageError(img);
                reject(new Error(`Failed to load image: ${imageUrl}`));
            };

            tempImg.src = imageUrl;
        });
    }

    handleImageError(img) {
        // Create placeholder for failed images
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21,15 16,10 5,21"></polyline>
            </svg>
            <span>Image not available</span>
        `;

        img.parentNode.replaceChild(placeholder, img);
    }

    setupResponsiveImages() {
        const images = document.querySelectorAll('img');

        images.forEach(img => {
            if (!img.srcset && !img.dataset.srcset) {
                this.generateResponsiveSrcset(img);
            }
        });
    }

    generateResponsiveSrcset(img) {
        const baseSrc = img.src || img.dataset.src;
        if (!baseSrc) return;

        // Generate different sizes (this would typically be done server-side)
        const sizes = [320, 640, 960, 1280, 1920];
        const srcset = sizes.map(size => {
            const url = this.generateResizedImageUrl(baseSrc, size);
            return `${url} ${size}w`;
        }).join(', ');

        img.srcset = srcset;
        img.sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';
    }

    generateResizedImageUrl(originalUrl, width) {
        // This is a placeholder - in a real implementation, you'd use a service like Cloudinary
        // or generate different sized images during build
        return originalUrl.replace(/\.(jpg|jpeg|png|webp)$/i, `_${width}w.$1`);
    }

    setupWebPSupport() {
        if (this.supportsWebP()) {
            document.documentElement.classList.add('webp');
            this.convertImagesToWebP();
        }
    }

    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    convertImagesToWebP() {
        const images = document.querySelectorAll('img');

        images.forEach(img => {
            const src = img.src || img.dataset.src;
            if (src && !src.includes('.webp')) {
                const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');

                // Test if WebP version exists
                this.testImageExists(webpSrc).then(exists => {
                    if (exists) {
                        if (img.dataset.src) {
                            img.dataset.src = webpSrc;
                        } else {
                            img.src = webpSrc;
                        }
                    }
                });
            }
        });
    }

    testImageExists(url) {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }

    setupImagePreloading() {
        // Preload critical images
        const criticalImages = [
            'assets/images/profile.jpg',
            'assets/images/hero-bg.jpg'
        ];

        criticalImages.forEach(src => {
            this.preloadImage(src);
        });
    }

    preloadImage(src) {
        if (this.criticalImages.has(src)) return;

        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);

        this.criticalImages.add(src);
    }

    /* ===== RESOURCE HINTS ===== */
    setupResourceHints() {
        this.addDNSPrefetch();
        this.addPreconnect();
        this.addModulePreload();
    }

    addDNSPrefetch() {
        const domains = [
            'fonts.googleapis.com',
            'fonts.gstatic.com',
            'api.github.com'
        ];

        domains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = `//${domain}`;
            document.head.appendChild(link);
        });
    }

    addPreconnect() {
        const criticalDomains = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com'
        ];

        criticalDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }

    addModulePreload() {
        const criticalModules = [
            'js/components/navigation.js',
            'js/components/animations.js'
        ];

        criticalModules.forEach(module => {
            const link = document.createElement('link');
            link.rel = 'modulepreload';
            link.href = module;
            document.head.appendChild(link);
        });
    }

    /* ===== CRITICAL RESOURCE LOADING ===== */
    setupCriticalResourceLoading() {
        this.loadCriticalCSS();
        this.deferNonCriticalCSS();
        this.optimizeFontLoading();
    }

    loadCriticalCSS() {
        // Critical CSS is already inlined in the HTML head
        // This method can be used to load additional critical styles
        const criticalStyles = `
            .hero { min-height: 100vh; }
            .nav { position: fixed; top: 0; width: 100%; }
            .section { padding: 4rem 0; }
        `;

        const style = document.createElement('style');
        style.textContent = criticalStyles;
        document.head.appendChild(style);
    }

    deferNonCriticalCSS() {
        const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"][data-defer]');

        nonCriticalCSS.forEach(link => {
            link.media = 'print';
            link.onload = function () {
                this.media = 'all';
            };
        });
    }

    optimizeFontLoading() {
        // Use font-display: swap for better performance
        const fontFaces = `
            @font-face {
                font-family: 'Inter';
                font-display: swap;
                src: url('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2') format('woff2');
            }
        `;

        const style = document.createElement('style');
        style.textContent = fontFaces;
        document.head.appendChild(style);
    }

    /* ===== PERFORMANCE MONITORING ===== */
    setupPerformanceMonitoring() {
        if ('PerformanceObserver' in window) {
            this.observeLargestContentfulPaint();
            this.observeFirstInputDelay();
            this.observeCumulativeLayoutShift();
        }

        this.measureLoadTimes();
    }

    observeLargestContentfulPaint() {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];

            console.log('LCP:', lastEntry.startTime);
            this.reportMetric('LCP', lastEntry.startTime);
        });

        observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }

    observeFirstInputDelay() {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                console.log('FID:', entry.processingStart - entry.startTime);
                this.reportMetric('FID', entry.processingStart - entry.startTime);
            });
        });

        observer.observe({ entryTypes: ['first-input'] });
    }

    observeCumulativeLayoutShift() {
        let clsValue = 0;

        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });

            console.log('CLS:', clsValue);
            this.reportMetric('CLS', clsValue);
        });

        observer.observe({ entryTypes: ['layout-shift'] });
    }

    measureLoadTimes() {
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];

            const metrics = {
                'DNS Lookup': navigation.domainLookupEnd - navigation.domainLookupStart,
                'TCP Connection': navigation.connectEnd - navigation.connectStart,
                'Request': navigation.responseStart - navigation.requestStart,
                'Response': navigation.responseEnd - navigation.responseStart,
                'DOM Processing': navigation.domContentLoadedEventStart - navigation.responseEnd,
                'Load Complete': navigation.loadEventEnd - navigation.loadEventStart
            };

            console.table(metrics);

            Object.entries(metrics).forEach(([name, value]) => {
                this.reportMetric(name, value);
            });
        });
    }

    reportMetric(name, value) {
        // In a real application, you would send these metrics to an analytics service
        if (window.gtag) {
            gtag('event', 'performance_metric', {
                metric_name: name,
                metric_value: Math.round(value),
                custom_parameter: 'portfolio_site'
            });
        }
    }

    /* ===== SERVICE WORKER ===== */
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }

    /* ===== PUBLIC METHODS ===== */
    preloadRoute(url) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
    }

    getPerformanceMetrics() {
        if ('performance' in window) {
            return {
                navigation: performance.getEntriesByType('navigation')[0],
                resources: performance.getEntriesByType('resource'),
                marks: performance.getEntriesByType('mark'),
                measures: performance.getEntriesByType('measure')
            };
        }
        return null;
    }

    clearResourceTimings() {
        if ('performance' in window && performance.clearResourceTimings) {
            performance.clearResourceTimings();
        }
    }
}

// Initialize performance optimizer
document.addEventListener('DOMContentLoaded', () => {
    window.performanceOptimizer = new PerformanceOptimizer();
});