/* ===== ACCESSIBILITY TESTING SCRIPT ===== */

class AccessibilityTester {
    constructor() {
        this.testResults = [];
        this.errors = [];
        this.warnings = [];
        this.passes = [];
        
        this.init();
    }
    
    init() {
        console.log('♿ Starting accessibility tests...');
        this.runAllTests();
        this.generateReport();
    }
    
    runAllTests() {
        // WCAG 2.1 Level AA Tests
        this.testImageAltText();
        this.testFormLabels();
        this.testHeadingStructure();
        this.testColorContrast();
        this.testKeyboardNavigation();
        this.testFocusManagement();
        this.testARIAAttributes();
        this.testSemanticHTML();
        this.testLinkAccessibility();
        this.testTableAccessibility();
        this.testMediaAccessibility();
        this.testLanguageAttributes();
    }
    
    testImageAltText() {
        const images = document.querySelectorAll('img');
        let issues = 0;
        
        images.forEach((img, index) => {
            if (!img.alt && !img.getAttribute('aria-label') && !img.getAttribute('aria-labelledby')) {
                if (img.getAttribute('role') !== 'presentation' && img.getAttribute('role') !== 'none') {
                    issues++;
                    this.errors.push({
                        type: 'Missing Alt Text',
                        element: `img[${index}]`,
                        message: 'Image missing alternative text',
                        wcag: '1.1.1 Non-text Content',
                        severity: 'error'
                    });
                }
            } else if (img.alt && img.alt.length > 125) {
                this.warnings.push({
                    type: 'Long Alt Text',
                    element: `img[${index}]`,
                    message: 'Alt text is longer than 125 characters',
                    wcag: '1.1.1 Non-text Content',
                    severity: 'warning'
                });
            }
        });
        
        if (issues === 0) {
            this.passes.push('All images have appropriate alternative text');
        }
    }
    
    testFormLabels() {
        const inputs = document.querySelectorAll('input, textarea, select');
        let issues = 0;
        
        inputs.forEach((input, index) => {
            const hasLabel = this.hasAssociatedLabel(input);
            const hasAriaLabel = input.getAttribute('aria-label');
            const hasAriaLabelledby = input.getAttribute('aria-labelledby');
            const hasTitle = input.getAttribute('title');
            
            if (!hasLabel && !hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
                issues++;
                this.errors.push({
                    type: 'Missing Form Label',
                    element: `${input.tagName.toLowerCase()}[${index}]`,
                    message: 'Form control missing accessible label',
                    wcag: '1.3.1 Info and Relationships',
                    severity: 'error'
                });
            }
        });
        
        if (issues === 0) {
            this.passes.push('All form controls have accessible labels');
        }
    }
    
    hasAssociatedLabel(input) {
        if (input.id) {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label) return true;
        }
        
        // Check if input is inside a label
        let parent = input.parentElement;
        while (parent) {
            if (parent.tagName.toLowerCase() === 'label') {
                return true;
            }
            parent = parent.parentElement;
        }
        
        return false;
    }
    
    testHeadingStructure() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let issues = 0;
        let previousLevel = 0;
        
        // Check for h1
        const h1Count = document.querySelectorAll('h1').length;
        if (h1Count === 0) {
            this.errors.push({
                type: 'Missing H1',
                element: 'document',
                message: 'Page missing main heading (h1)',
                wcag: '1.3.1 Info and Relationships',
                severity: 'error'
            });
            issues++;
        } else if (h1Count > 1) {
            this.warnings.push({
                type: 'Multiple H1',
                element: 'document',
                message: 'Multiple h1 elements found',
                wcag: '1.3.1 Info and Relationships',
                severity: 'warning'
            });
        }
        
        // Check heading hierarchy
        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.charAt(1));
            
            if (previousLevel > 0 && level > previousLevel + 1) {
                this.warnings.push({
                    type: 'Heading Skip',
                    element: `${heading.tagName.toLowerCase()}[${index}]`,
                    message: `Heading level skipped from h${previousLevel} to h${level}`,
                    wcag: '1.3.1 Info and Relationships',
                    severity: 'warning'
                });
            }
            
            // Check for empty headings
            if (!heading.textContent.trim()) {
                this.errors.push({
                    type: 'Empty Heading',
                    element: `${heading.tagName.toLowerCase()}[${index}]`,
                    message: 'Heading element is empty',
                    wcag: '1.3.1 Info and Relationships',
                    severity: 'error'
                });
                issues++;
            }
            
            previousLevel = level;
        });
        
        if (issues === 0) {
            this.passes.push('Heading structure is logical and complete');
        }
    }
    
    testColorContrast() {
        // This is a simplified test - full color contrast testing requires more complex calculations
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, label');
        let issues = 0;
        
        textElements.forEach((element, index) => {
            const styles = getComputedStyle(element);
            const fontSize = parseFloat(styles.fontSize);
            const fontWeight = styles.fontWeight;
            
            // Check for very light text on light backgrounds (simplified check)
            const color = styles.color;
            const backgroundColor = styles.backgroundColor;
            
            if (color === 'rgb(255, 255, 255)' && backgroundColor === 'rgb(255, 255, 255)') {
                this.errors.push({
                    type: 'Poor Color Contrast',
                    element: `${element.tagName.toLowerCase()}[${index}]`,
                    message: 'White text on white background',
                    wcag: '1.4.3 Contrast (Minimum)',
                    severity: 'error'
                });
                issues++;
            }
            
            // Check for very small text
            if (fontSize < 12) {
                this.warnings.push({
                    type: 'Small Text Size',
                    element: `${element.tagName.toLowerCase()}[${index}]`,
                    message: `Text size ${fontSize}px may be too small`,
                    wcag: '1.4.4 Resize text',
                    severity: 'warning'
                });
            }
        });
        
        if (issues === 0) {
            this.passes.push('No obvious color contrast issues detected');
        }
    }
    
    testKeyboardNavigation() {
        const focusableElements = document.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        let issues = 0;
        
        focusableElements.forEach((element, index) => {
            // Check for positive tabindex (anti-pattern)
            const tabindex = element.getAttribute('tabindex');
            if (tabindex && parseInt(tabindex) > 0) {
                this.warnings.push({
                    type: 'Positive Tabindex',
                    element: `${element.tagName.toLowerCase()}[${index}]`,
                    message: 'Positive tabindex disrupts natural tab order',
                    wcag: '2.4.3 Focus Order',
                    severity: 'warning'
                });
            }
            
            // Check for missing focus indicators
            const styles = getComputedStyle(element, ':focus');
            if (styles.outline === 'none' && !styles.boxShadow && !styles.border) {
                this.warnings.push({
                    type: 'Missing Focus Indicator',
                    element: `${element.tagName.toLowerCase()}[${index}]`,
                    message: 'Element may not have visible focus indicator',
                    wcag: '2.4.7 Focus Visible',
                    severity: 'warning'
                });
            }
        });
        
        if (issues === 0) {
            this.passes.push('Keyboard navigation appears to be properly implemented');
        }
    }
    
    testFocusManagement() {
        // Check for skip links
        const skipLinks = document.querySelectorAll('a[href^="#"]');
        let hasSkipToMain = false;
        
        skipLinks.forEach(link => {
            if (link.textContent.toLowerCase().includes('skip') && 
                link.textContent.toLowerCase().includes('main')) {
                hasSkipToMain = true;
            }
        });
        
        if (!hasSkipToMain) {
            this.warnings.push({
                type: 'Missing Skip Link',
                element: 'document',
                message: 'No "skip to main content" link found',
                wcag: '2.4.1 Bypass Blocks',
                severity: 'warning'
            });
        }
        
        // Check for focus traps in modals
        const modals = document.querySelectorAll('[role="dialog"], .modal');
        modals.forEach((modal, index) => {
            if (!modal.getAttribute('aria-labelledby') && !modal.getAttribute('aria-label')) {
                this.warnings.push({
                    type: 'Modal Missing Label',
                    element: `modal[${index}]`,
                    message: 'Modal dialog missing accessible name',
                    wcag: '4.1.2 Name, Role, Value',
                    severity: 'warning'
                });
            }
        });
    }
    
    testARIAAttributes() {
        const elementsWithAria = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby], [role]');
        let issues = 0;
        
        elementsWithAria.forEach((element, index) => {
            // Check for invalid ARIA attributes
            const ariaAttributes = Array.from(element.attributes).filter(attr => 
                attr.name.startsWith('aria-')
            );
            
            ariaAttributes.forEach(attr => {
                // Check for empty ARIA labels
                if ((attr.name === 'aria-label' || attr.name === 'aria-labelledby') && !attr.value.trim()) {
                    this.errors.push({
                        type: 'Empty ARIA Label',
                        element: `${element.tagName.toLowerCase()}[${index}]`,
                        message: `${attr.name} is empty`,
                        wcag: '4.1.2 Name, Role, Value',
                        severity: 'error'
                    });
                    issues++;
                }
            });
            
            // Check for valid roles
            const role = element.getAttribute('role');
            if (role) {
                const validRoles = [
                    'alert', 'alertdialog', 'application', 'article', 'banner', 'button',
                    'cell', 'checkbox', 'columnheader', 'combobox', 'complementary',
                    'contentinfo', 'definition', 'dialog', 'directory', 'document',
                    'feed', 'figure', 'form', 'grid', 'gridcell', 'group', 'heading',
                    'img', 'link', 'list', 'listbox', 'listitem', 'log', 'main',
                    'marquee', 'math', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox',
                    'menuitemradio', 'navigation', 'none', 'note', 'option', 'presentation',
                    'progressbar', 'radio', 'radiogroup', 'region', 'row', 'rowgroup',
                    'rowheader', 'scrollbar', 'search', 'searchbox', 'separator',
                    'slider', 'spinbutton', 'status', 'switch', 'tab', 'table',
                    'tablist', 'tabpanel', 'term', 'textbox', 'timer', 'toolbar',
                    'tooltip', 'tree', 'treegrid', 'treeitem'
                ];
                
                if (!validRoles.includes(role)) {
                    this.warnings.push({
                        type: 'Invalid ARIA Role',
                        element: `${element.tagName.toLowerCase()}[${index}]`,
                        message: `Invalid role: ${role}`,
                        wcag: '4.1.2 Name, Role, Value',
                        severity: 'warning'
                    });
                }
            }
        });
        
        if (issues === 0) {
            this.passes.push('ARIA attributes appear to be properly implemented');
        }
    }
    
    testSemanticHTML() {
        // Check for semantic landmarks
        const landmarks = {
            'main': document.querySelectorAll('main, [role="main"]').length,
            'navigation': document.querySelectorAll('nav, [role="navigation"]').length,
            'banner': document.querySelectorAll('header, [role="banner"]').length,
            'contentinfo': document.querySelectorAll('footer, [role="contentinfo"]').length
        };
        
        Object.entries(landmarks).forEach(([landmark, count]) => {
            if (count === 0) {
                this.warnings.push({
                    type: 'Missing Landmark',
                    element: 'document',
                    message: `No ${landmark} landmark found`,
                    wcag: '1.3.1 Info and Relationships',
                    severity: 'warning'
                });
            } else if (landmark === 'main' && count > 1) {
                this.warnings.push({
                    type: 'Multiple Main Landmarks',
                    element: 'document',
                    message: 'Multiple main landmarks found',
                    wcag: '1.3.1 Info and Relationships',
                    severity: 'warning'
                });
            }
        });
        
        // Check for proper list structure
        const lists = document.querySelectorAll('ul, ol');
        lists.forEach((list, index) => {
            const directChildren = Array.from(list.children);
            const nonListItems = directChildren.filter(child => child.tagName.toLowerCase() !== 'li');
            
            if (nonListItems.length > 0) {
                this.warnings.push({
                    type: 'Invalid List Structure',
                    element: `${list.tagName.toLowerCase()}[${index}]`,
                    message: 'List contains non-list-item children',
                    wcag: '1.3.1 Info and Relationships',
                    severity: 'warning'
                });
            }
        });
    }
    
    testLinkAccessibility() {
        const links = document.querySelectorAll('a');
        let issues = 0;
        
        links.forEach((link, index) => {
            // Check for empty links
            if (!link.textContent.trim() && !link.getAttribute('aria-label') && !link.querySelector('img[alt]')) {
                this.errors.push({
                    type: 'Empty Link',
                    element: `a[${index}]`,
                    message: 'Link has no accessible text',
                    wcag: '2.4.4 Link Purpose (In Context)',
                    severity: 'error'
                });
                issues++;
            }
            
            // Check for generic link text
            const genericTexts = ['click here', 'read more', 'more', 'here', 'link'];
            if (genericTexts.includes(link.textContent.toLowerCase().trim())) {
                this.warnings.push({
                    type: 'Generic Link Text',
                    element: `a[${index}]`,
                    message: `Generic link text: "${link.textContent.trim()}"`,
                    wcag: '2.4.4 Link Purpose (In Context)',
                    severity: 'warning'
                });
            }
            
            // Check for links opening in new window without warning
            if (link.target === '_blank' && !link.textContent.includes('opens in new') && 
                !link.getAttribute('aria-label')?.includes('opens in new')) {
                this.warnings.push({
                    type: 'New Window Warning',
                    element: `a[${index}]`,
                    message: 'Link opens in new window without warning',
                    wcag: '3.2.5 Change on Request',
                    severity: 'warning'
                });
            }
        });
        
        if (issues === 0) {
            this.passes.push('Links have appropriate accessible text');
        }
    }
    
    testTableAccessibility() {
        const tables = document.querySelectorAll('table');
        
        tables.forEach((table, index) => {
            // Check for table caption or summary
            const caption = table.querySelector('caption');
            const summary = table.getAttribute('summary');
            
            if (!caption && !summary) {
                this.warnings.push({
                    type: 'Missing Table Caption',
                    element: `table[${index}]`,
                    message: 'Table missing caption or summary',
                    wcag: '1.3.1 Info and Relationships',
                    severity: 'warning'
                });
            }
            
            // Check for table headers
            const headers = table.querySelectorAll('th');
            const rows = table.querySelectorAll('tr');
            
            if (headers.length === 0 && rows.length > 1) {
                this.warnings.push({
                    type: 'Missing Table Headers',
                    element: `table[${index}]`,
                    message: 'Data table missing header cells',
                    wcag: '1.3.1 Info and Relationships',
                    severity: 'warning'
                });
            }
        });
    }
    
    testMediaAccessibility() {
        // Check video elements
        const videos = document.querySelectorAll('video');
        videos.forEach((video, index) => {
            const tracks = video.querySelectorAll('track');
            const hasCaptions = Array.from(tracks).some(track => track.kind === 'captions');
            
            if (!hasCaptions) {
                this.warnings.push({
                    type: 'Missing Video Captions',
                    element: `video[${index}]`,
                    message: 'Video missing captions track',
                    wcag: '1.2.2 Captions (Prerecorded)',
                    severity: 'warning'
                });
            }
        });
        
        // Check audio elements
        const audios = document.querySelectorAll('audio');
        audios.forEach((audio, index) => {
            // Audio should have transcript or alternative
            this.warnings.push({
                type: 'Audio Alternative',
                element: `audio[${index}]`,
                message: 'Verify audio has transcript or alternative',
                wcag: '1.2.1 Audio-only and Video-only (Prerecorded)',
                severity: 'warning'
            });
        });
    }
    
    testLanguageAttributes() {
        // Check for lang attribute on html element
        const html = document.documentElement;
        if (!html.getAttribute('lang')) {
            this.errors.push({
                type: 'Missing Language Attribute',
                element: 'html',
                message: 'HTML element missing lang attribute',
                wcag: '3.1.1 Language of Page',
                severity: 'error'
            });
        }
        
        // Check for lang changes in content
        const elementsWithLang = document.querySelectorAll('[lang]');
        elementsWithLang.forEach((element, index) => {
            const lang = element.getAttribute('lang');
            if (!lang || lang.length < 2) {
                this.warnings.push({
                    type: 'Invalid Language Code',
                    element: `${element.tagName.toLowerCase()}[${index}]`,
                    message: 'Invalid or missing language code',
                    wcag: '3.1.2 Language of Parts',
                    severity: 'warning'
                });
            }
        });
    }
    
    generateReport() {
        const totalIssues = this.errors.length + this.warnings.length;
        const score = Math.max(0, 100 - (this.errors.length * 10) - (this.warnings.length * 2));
        
        console.log('\n♿ Accessibility Test Report');
        console.log('═'.repeat(50));
        console.log(`Overall Score: ${score}/100`);
        console.log(`Total Issues: ${totalIssues} (${this.errors.length} errors, ${this.warnings.length} warnings)`);
        
        if (this.errors.length > 0) {
            console.log('\n❌ Errors (Critical Issues):');
            console.log('-'.repeat(30));
            this.errors.forEach(error => {
                console.log(`• ${error.type}: ${error.message}`);
                console.log(`  Element: ${error.element}`);
                console.log(`  WCAG: ${error.wcag}`);
                console.log('');
            });
        }
        
        if (this.warnings.length > 0) {
            console.log('\n⚠️  Warnings (Potential Issues):');
            console.log('-'.repeat(30));
            this.warnings.forEach(warning => {
                console.log(`• ${warning.type}: ${warning.message}`);
                console.log(`  Element: ${warning.element}`);
                console.log(`  WCAG: ${warning.wcag}`);
                console.log('');
            });
        }
        
        if (this.passes.length > 0) {
            console.log('\n✅ Passed Tests:');
            console.log('-'.repeat(20));
            this.passes.forEach(pass => {
                console.log(`• ${pass}`);
            });
        }
        
        console.log('\n💡 Recommendations:');
        console.log('-'.repeat(20));
        
        if (score >= 90) {
            console.log('✅ Excellent accessibility! Minor improvements may still be possible.');
        } else if (score >= 75) {
            console.log('⚠️  Good accessibility with some issues to address.');
        } else if (score >= 60) {
            console.log('⚠️  Moderate accessibility. Several issues need attention.');
        } else {
            console.log('❌ Poor accessibility. Significant improvements needed.');
        }
        
        // Store results for external access
        window.accessibilityResults = {
            score,
            errors: this.errors,
            warnings: this.warnings,
            passes: this.passes,
            timestamp: new Date().toISOString()
        };
    }
    
    getResults() {
        return {
            score: Math.max(0, 100 - (this.errors.length * 10) - (this.warnings.length * 2)),
            errors: this.errors,
            warnings: this.warnings,
            passes: this.passes,
            timestamp: new Date().toISOString()
        };
    }
}

// Auto-run tests when script loads
if (typeof window !== 'undefined') {
    window.accessibilityTester = new AccessibilityTester();
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityTester;
}