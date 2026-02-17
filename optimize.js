#!/usr/bin/env node

/* ===== BUILD OPTIMIZATION SCRIPT ===== */

const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const CleanCSS = require('clean-css');

class BuildOptimizer {
    constructor() {
        this.distDir = 'dist';
        this.sourceDir = '.';
        
        this.cssFiles = [
            'css/main.css',
            'css/components.css',
            'css/responsive.css'
        ];
        
        this.jsFiles = [
            'js/main.js',
            'js/components/navigation.js',
            'js/components/projects.js',
            'js/components/research.js',
            'js/components/contact.js',
            'js/components/animations.js',
            'js/components/performance.js'
        ];
        
        this.htmlFiles = [
            'index.html'
        ];
        
        this.staticFiles = [
            'manifest.json',
            'sw.js',
            'assets/**/*'
        ];
    }
    
    async optimize() {
        console.log('🚀 Starting build optimization...');
        
        try {
            await this.createDistDirectory();
            await this.optimizeCSS();
            await this.optimizeJS();
            await this.optimizeHTML();
            await this.copyStaticFiles();
            await this.generateCriticalCSS();
            await this.generateSitemap();
            await this.generateRobotsTxt();
            
            console.log('✅ Build optimization completed successfully!');
            this.printStats();
            
        } catch (error) {
            console.error('❌ Build optimization failed:', error);
            process.exit(1);
        }
    }
    
    async createDistDirectory() {
        if (fs.existsSync(this.distDir)) {
            fs.rmSync(this.distDir, { recursive: true });
        }
        fs.mkdirSync(this.distDir, { recursive: true });
        
        // Create subdirectories
        ['css', 'js', 'js/components', 'assets', 'assets/images', 'assets/icons', 'assets/documents'].forEach(dir => {
            fs.mkdirSync(path.join(this.distDir, dir), { recursive: true });
        });
    }
    
    async optimizeCSS() {
        console.log('📦 Optimizing CSS...');
        
        const cleanCSS = new CleanCSS({
            level: 2,
            returnPromise: true
        });
        
        // Combine and minify CSS files
        let combinedCSS = '';
        for (const file of this.cssFiles) {
            if (fs.existsSync(file)) {
                const content = fs.readFileSync(file, 'utf8');
                combinedCSS += content + '\n';
            }
        }
        
        const result = await cleanCSS.minify(combinedCSS);
        
        if (result.errors.length > 0) {
            throw new Error('CSS optimization errors: ' + result.errors.join(', '));
        }
        
        fs.writeFileSync(path.join(this.distDir, 'css/styles.min.css'), result.styles);
        
        console.log(`✅ CSS optimized: ${this.formatBytes(combinedCSS.length)} → ${this.formatBytes(result.styles.length)}`);
    }
    
    async optimizeJS() {
        console.log('📦 Optimizing JavaScript...');
        
        // Combine and minify JS files
        let combinedJS = '';
        for (const file of this.jsFiles) {
            if (fs.existsSync(file)) {
                const content = fs.readFileSync(file, 'utf8');
                combinedJS += content + '\n';
            }
        }
        
        const result = await minify(combinedJS, {
            compress: {
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info', 'console.debug']
            },
            mangle: true,
            format: {
                comments: false
            }
        });
        
        if (result.error) {
            throw new Error('JavaScript optimization error: ' + result.error);
        }
        
        fs.writeFileSync(path.join(this.distDir, 'js/scripts.min.js'), result.code);
        
        console.log(`✅ JavaScript optimized: ${this.formatBytes(combinedJS.length)} → ${this.formatBytes(result.code.length)}`);
    }
    
    async optimizeHTML() {
        console.log('📦 Optimizing HTML...');
        
        for (const file of this.htmlFiles) {
            if (fs.existsSync(file)) {
                let content = fs.readFileSync(file, 'utf8');
                
                // Update CSS references
                content = content.replace(
                    /<link rel="stylesheet" href="css\/main\.css">\s*<link rel="stylesheet" href="css\/components\.css">\s*<link rel="stylesheet" href="css\/responsive\.css">/g,
                    '<link rel="stylesheet" href="css/styles.min.css">'
                );
                
                // Update JS references
                content = content.replace(
                    /<script src="js\/main\.js"><\/script>\s*<script src="js\/components\/navigation\.js"><\/script>\s*<script src="js\/components\/projects\.js"><\/script>\s*<script src="js\/components\/research\.js"><\/script>\s*<script src="js\/components\/contact\.js"><\/script>\s*<script src="js\/components\/animations\.js"><\/script>\s*<script src="js\/components\/performance\.js"><\/script>/g,
                    '<script src="js/scripts.min.js"></script>'
                );
                
                // Minify HTML
                content = this.minifyHTML(content);
                
                fs.writeFileSync(path.join(this.distDir, file), content);
            }
        }
        
        console.log('✅ HTML optimized');
    }
    
    minifyHTML(html) {
        return html
            .replace(/\s+/g, ' ')
            .replace(/>\s+</g, '><')
            .replace(/\s+>/g, '>')
            .replace(/<\s+/g, '<')
            .trim();
    }
    
    async copyStaticFiles() {
        console.log('📦 Copying static files...');
        
        // Copy manifest.json
        if (fs.existsSync('manifest.json')) {
            fs.copyFileSync('manifest.json', path.join(this.distDir, 'manifest.json'));
        }
        
        // Copy and optimize service worker
        if (fs.existsSync('sw.js')) {
            let swContent = fs.readFileSync('sw.js', 'utf8');
            const result = await minify(swContent);
            fs.writeFileSync(path.join(this.distDir, 'sw.js'), result.code);
        }
        
        // Copy assets (would typically use a more sophisticated file copying utility)
        if (fs.existsSync('assets')) {
            this.copyDirectory('assets', path.join(this.distDir, 'assets'));
        }
        
        console.log('✅ Static files copied');
    }
    
    copyDirectory(src, dest) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        
        const entries = fs.readdirSync(src, { withFileTypes: true });
        
        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);
            
            if (entry.isDirectory()) {
                this.copyDirectory(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }
    
    async generateCriticalCSS() {
        console.log('📦 Generating critical CSS...');
        
        const criticalCSS = `
            /* Critical CSS for above-the-fold content */
            :root { --primary-color: #2563eb; --text-color: #475569; --bg-color: #ffffff; }
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Inter', sans-serif; line-height: 1.6; color: var(--text-color); }
            .header { position: fixed; top: 0; width: 100%; background: #fff; z-index: 100; }
            .hero { min-height: 100vh; display: flex; align-items: center; }
            .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
        `;
        
        fs.writeFileSync(path.join(this.distDir, 'css/critical.css'), criticalCSS.trim());
        
        console.log('✅ Critical CSS generated');
    }
    
    async generateSitemap() {
        console.log('📦 Generating sitemap...');
        
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://[username].github.io/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://[username].github.io/#about</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://[username].github.io/#projects</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://[username].github.io/#research</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://[username].github.io/#contact</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.7</priority>
    </url>
</urlset>`;
        
        fs.writeFileSync(path.join(this.distDir, 'sitemap.xml'), sitemap);
        
        console.log('✅ Sitemap generated');
    }
    
    async generateRobotsTxt() {
        console.log('📦 Generating robots.txt...');
        
        const robots = `User-agent: *
Allow: /

Sitemap: https://[username].github.io/sitemap.xml`;
        
        fs.writeFileSync(path.join(this.distDir, 'robots.txt'), robots);
        
        console.log('✅ Robots.txt generated');
    }
    
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    printStats() {
        console.log('\n📊 Build Statistics:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        try {
            const cssStats = fs.statSync(path.join(this.distDir, 'css/styles.min.css'));
            const jsStats = fs.statSync(path.join(this.distDir, 'js/scripts.min.js'));
            const htmlStats = fs.statSync(path.join(this.distDir, 'index.html'));
            
            console.log(`CSS:  ${this.formatBytes(cssStats.size)}`);
            console.log(`JS:   ${this.formatBytes(jsStats.size)}`);
            console.log(`HTML: ${this.formatBytes(htmlStats.size)}`);
            console.log(`Total: ${this.formatBytes(cssStats.size + jsStats.size + htmlStats.size)}`);
        } catch (error) {
            console.log('Could not calculate file sizes');
        }
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎉 Ready for deployment!');
    }
}

// Run optimization if called directly
if (require.main === module) {
    const optimizer = new BuildOptimizer();
    optimizer.optimize();
}

module.exports = BuildOptimizer;