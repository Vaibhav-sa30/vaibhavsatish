/* ===== CROSS-BROWSER COMPATIBILITY TESTING ===== */

class BrowserCompatibilityTester {
    constructor() {
        this.testResults = new Map();
        this.browserInfo = this.getBrowserInfo();
        this.supportedFeatures = new Map();
        
        this.init();
    }
    
    init() {
        console.log('🔍 Starting cross-browser compatibility tests...');
        console.log('Browser:', this.browserInfo);
        
        this.runAllTests();
        this.generateReport();
    }
    
    getBrowserInfo() {
        const ua = navigator.userAgent;
        const browser = {
            name: 'Unknown',
            version: 'Unknown',
            engine: 'Unknown'
        };
        
        // Detect browser
        if (ua.includes('Chrome') && !ua.includes('Edg')) {
            browser.name = 'Chrome';
            browser.version = ua.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
            browser.engine = 'Blink';
        } else if (ua.includes('Firefox')) {
            browser.name = 'Firefox';
            browser.version = ua.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
            browser.engine = 'Gecko';
        } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
            browser.name = 'Safari';
            browser.version = ua.match(/Version\/(\d+)/)?.[1] || 'Unknown';
            browser.engine = 'WebKit';
        } else if (ua.includes('Edg')) {
            browser.name = 'Edge';
            browser.version = ua.match(/Edg\/(\d+)/)?.[1] || 'Unknown';
            browser.engine = 'Blink';
        }
        
        return browser;
    }
    
    runAllTests() {
        // CSS Feature Tests
        this.testCSSFeatures();
        
        // JavaScript API Tests
        this.testJavaScriptAPIs();
        
        // HTML5 Feature Tests
        this.testHTML5Features();
        
        // Performance API Tests
        this.testPerformanceAPIs();
        
        // Security Feature Tests
        this.testSecurityFeatures();
        
        // Accessibility Tests
        this.testAccessibilityFeatures();
    }
    
    testCSSFeatures() {
        const cssTests = {
            'CSS Grid': () => CSS.supports('display', 'grid'),
            'CSS Flexbox': () => CSS.supports('display', 'flex'),
            'CSS Custom Properties': () => CSS.supports('--test', 'value'),
            'CSS Transforms': () => CSS.supports('transform', 'translateX(10px)'),
            'CSS Transitions': () => CSS.supports('transition', 'all 0.3s ease'),
            'CSS Animations': () => CSS.supports('animation', 'test 1s ease'),
            'CSS Backdrop Filter': () => CSS.supports('backdrop-filter', 'blur(10px)'),
            'CSS Container Queries': () => CSS.supports('container-type', 'inline-size'),
            'CSS Aspect Ratio': () => CSS.supports('aspect-ratio', '16/9'),
            'CSS Gap': () => CSS.supports('gap', '1rem'),
            'CSS Clamp': () => CSS.supports('width', 'clamp(1rem, 5vw, 3rem)'),
            'CSS Logical Properties': () => CSS.supports('margin-inline-start', '1rem')
        };
        
        const results = {};
        Object.entries(cssTests).forEach(([feature, test]) => {
            try {
                results[feature] = test();
            } catch (error) {
                results[feature] = false;
            }
        });
        
        this.testResults.set('CSS Features', results);
    }
    
    testJavaScriptAPIs() {
        const jsTests = {
            'Intersection Observer': () => 'IntersectionObserver' in window,
            'Resize Observer': () => 'ResizeObserver' in window,
            'Mutation Observer': () => 'MutationObserver' in window,
            'Performance Observer': () => 'PerformanceObserver' in window,
            'Service Worker': () => 'serviceWorker' in navigator,
            'Web Workers': () => 'Worker' in window,
            'Fetch API': () => 'fetch' in window,
            'Promise': () => 'Promise' in window,
            'Async/Await': () => {
                try {
                    eval('(async () => {})');
                    return true;
                } catch (e) {
                    return false;
                }
            },
            'ES6 Modules': () => 'noModule' in HTMLScriptElement.prototype,
            'Local Storage': () => 'localStorage' in window,
            'Session Storage': () => 'sessionStorage' in window,
            'IndexedDB': () => 'indexedDB' in window,
            'WebGL': () => {
                try {
                    const canvas = document.createElement('canvas');
                    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
                } catch (e) {
                    return false;
                }
            },
            'WebGL2': () => {
                try {
                    const canvas = document.createElement('canvas');
                    return !!canvas.getContext('webgl2');
                } catch (e) {
                    return false;
                }
            }
        };
        
        const results = {};
        Object.entries(jsTests).forEach(([feature, test]) => {
            try {
                results[feature] = test();
            } catch (error) {
                results[feature] = false;
            }
        });
        
        this.testResults.set('JavaScript APIs', results);
    }
    
    testHTML5Features() {
        const htmlTests = {
            'Canvas': () => {
                const canvas = document.createElement('canvas');
                return !!(canvas.getContext && canvas.getContext('2d'));
            },
            'SVG': () => !!(document.createElementNS && document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect),
            'Video': () => !!document.createElement('video').canPlayType,
            'Audio': () => !!document.createElement('audio').canPlayType,
            'Geolocation': () => 'geolocation' in navigator,
            'History API': () => !!(window.history && history.pushState),
            'File API': () => 'FileReader' in window,
            'Drag and Drop': () => 'draggable' in document.createElement('div'),
            'Web Sockets': () => 'WebSocket' in window,
            'Application Cache': () => 'applicationCache' in window,
            'Web Storage': () => 'localStorage' in window && 'sessionStorage' in window,
            'Offline Detection': () => 'onLine' in navigator,
            'Touch Events': () => 'ontouchstart' in window,
            'Device Orientation': () => 'DeviceOrientationEvent' in window,
            'Fullscreen API': () => 'requestFullscreen' in document.documentElement || 'webkitRequestFullscreen' in document.documentElement
        };
        
        const results = {};
        Object.entries(htmlTests).forEach(([feature, test]) => {
            try {
                results[feature] = test();
            } catch (error) {
                results[feature] = false;
            }
        });
        
        this.testResults.set('HTML5 Features', results);
    }
    
    testPerformanceAPIs() {
        const perfTests = {
            'Performance API': () => 'performance' in window,
            'Performance Navigation': () => 'performance' in window && 'navigation' in performance,
            'Performance Timing': () => 'performance' in window && 'timing' in performance,
            'User Timing': () => 'performance' in window && 'mark' in performance,
            'Resource Timing': () => 'performance' in window && 'getEntriesByType' in performance,
            'Navigation Timing': () => 'performance' in window && performance.getEntriesByType('navigation').length > 0,
            'High Resolution Time': () => 'performance' in window && 'now' in performance,
            'Performance Observer': () => 'PerformanceObserver' in window,
            'Long Tasks API': () => {
                try {
                    return 'PerformanceLongTaskTiming' in window;
                } catch (e) {
                    return false;
                }
            }
        };
        
        const results = {};
        Object.entries(perfTests).forEach(([feature, test]) => {
            try {
                results[feature] = test();
            } catch (error) {
                results[feature] = false;
            }
        });
        
        this.testResults.set('Performance APIs', results);
    }
    
    testSecurityFeatures() {
        const securityTests = {
            'HTTPS': () => location.protocol === 'https:',
            'Content Security Policy': () => 'SecurityPolicyViolationEvent' in window,
            'Subresource Integrity': () => 'integrity' in document.createElement('script'),
            'Secure Context': () => 'isSecureContext' in window && window.isSecureContext,
            'Permissions API': () => 'permissions' in navigator,
            'Credential Management': () => 'credentials' in navigator,
            'Web Crypto API': () => 'crypto' in window && 'subtle' in crypto,
            'Referrer Policy': () => 'referrerPolicy' in document.createElement('a')
        };
        
        const results = {};
        Object.entries(securityTests).forEach(([feature, test]) => {
            try {
                results[feature] = test();
            } catch (error) {
                results[feature] = false;
            }
        });
        
        this.testResults.set('Security Features', results);
    }
    
    testAccessibilityFeatures() {
        const a11yTests = {
            'ARIA Support': () => 'setAttribute' in document.createElement('div'),
            'Focus Management': () => 'focus' in document.createElement('div'),
            'Screen Reader Detection': () => {
                // Basic screen reader detection
                return window.speechSynthesis !== undefined || 
                       navigator.userAgent.includes('NVDA') ||
                       navigator.userAgent.includes('JAWS') ||
                       navigator.userAgent.includes('VoiceOver');
            },
            'High Contrast Mode': () => {
                if (window.matchMedia) {
                    return window.matchMedia('(prefers-contrast: high)').matches;
                }
                return false;
            },
            'Reduced Motion': () => {
                if (window.matchMedia) {
                    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                }
                return false;
            },
            'Color Scheme Preference': () => {
                if (window.matchMedia) {
                    return window.matchMedia('(prefers-color-scheme: dark)').matches ||
                           window.matchMedia('(prefers-color-scheme: light)').matches;
                }
                return false;
            }
        };
        
        const results = {};
        Object.entries(a11yTests).forEach(([feature, test]) => {
            try {
                results[feature] = test();
            } catch (error) {
                results[feature] = false;
            }
        });
        
        this.testResults.set('Accessibility Features', results);
    }
    
    generateReport() {
        console.log('\n📊 Browser Compatibility Report');
        console.log('═'.repeat(50));
        
        let totalTests = 0;
        let passedTests = 0;
        
        this.testResults.forEach((results, category) => {
            console.log(`\n🔍 ${category}:`);
            console.log('-'.repeat(30));
            
            Object.entries(results).forEach(([feature, supported]) => {
                totalTests++;
                if (supported) passedTests++;
                
                const status = supported ? '✅' : '❌';
                console.log(`${status} ${feature}: ${supported ? 'Supported' : 'Not Supported'}`);
            });
        });
        
        const compatibilityScore = Math.round((passedTests / totalTests) * 100);
        
        console.log('\n📈 Overall Compatibility Score');
        console.log('═'.repeat(30));
        console.log(`Score: ${compatibilityScore}% (${passedTests}/${totalTests} features supported)`);
        
        // Provide recommendations
        this.generateRecommendations(compatibilityScore);
        
        // Store results for external access
        window.browserCompatibilityResults = {
            browser: this.browserInfo,
            score: compatibilityScore,
            results: Object.fromEntries(this.testResults),
            timestamp: new Date().toISOString()
        };
    }
    
    generateRecommendations(score) {
        console.log('\n💡 Recommendations:');
        console.log('-'.repeat(20));
        
        if (score >= 90) {
            console.log('✅ Excellent compatibility! Your browser supports most modern features.');
        } else if (score >= 75) {
            console.log('⚠️  Good compatibility with some limitations. Consider updating your browser.');
        } else if (score >= 60) {
            console.log('⚠️  Moderate compatibility. Some features may not work as expected.');
        } else {
            console.log('❌ Poor compatibility. Please update to a modern browser for the best experience.');
        }
        
        // Specific recommendations based on missing features
        const jsResults = this.testResults.get('JavaScript APIs');
        const cssResults = this.testResults.get('CSS Features');
        
        if (!jsResults['Service Worker']) {
            console.log('• Service Worker not supported - offline functionality unavailable');
        }
        
        if (!jsResults['Intersection Observer']) {
            console.log('• Intersection Observer not supported - lazy loading may not work optimally');
        }
        
        if (!cssResults['CSS Grid']) {
            console.log('• CSS Grid not supported - layout may fall back to flexbox');
        }
        
        if (!cssResults['CSS Custom Properties']) {
            console.log('• CSS Custom Properties not supported - theming may not work');
        }
    }
    
    // Public method to get test results
    getResults() {
        return {
            browser: this.browserInfo,
            results: Object.fromEntries(this.testResults),
            timestamp: new Date().toISOString()
        };
    }
    
    // Method to test specific feature
    testFeature(category, feature) {
        const categoryResults = this.testResults.get(category);
        return categoryResults ? categoryResults[feature] : null;
    }
}

// Auto-run tests when script loads
if (typeof window !== 'undefined') {
    window.browserCompatibilityTester = new BrowserCompatibilityTester();
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BrowserCompatibilityTester;
}