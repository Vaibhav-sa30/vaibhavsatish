#!/bin/bash

# GitHub Pages Deployment Script for Data Science Portfolio
# This script prepares and deploys the portfolio to GitHub Pages

set -e  # Exit on any error

echo "🚀 Starting GitHub Pages deployment preparation..."

# Configuration
REPO_NAME="[username].github.io"
GITHUB_USERNAME="[username]"
BUILD_DIR="build"
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    local missing_deps=()
    
    if ! command -v git &> /dev/null; then
        missing_deps+=("git")
    fi
    
    if ! command -v node &> /dev/null; then
        missing_deps+=("node")
    fi
    
    if ! command -v npm &> /dev/null; then
        missing_deps+=("npm")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing dependencies: ${missing_deps[*]}"
        print_error "Please install the missing dependencies and try again."
        exit 1
    fi
    
    print_success "All dependencies are installed"
}

# Install build tools
install_build_tools() {
    print_status "Installing build tools..."
    
    if ! command -v cleancss &> /dev/null; then
        npm install -g clean-css-cli
    fi
    
    if ! command -v terser &> /dev/null; then
        npm install -g terser
    fi
    
    if ! command -v html-minifier-terser &> /dev/null; then
        npm install -g html-minifier-terser
    fi
    
    print_success "Build tools installed"
}

# Create backup of current state
create_backup() {
    print_status "Creating backup..."
    
    if [ -d "$BUILD_DIR" ]; then
        cp -r "$BUILD_DIR" "$BACKUP_DIR"
        print_success "Backup created: $BACKUP_DIR"
    fi
}

# Clean build directory
clean_build() {
    print_status "Cleaning build directory..."
    
    if [ -d "$BUILD_DIR" ]; then
        rm -rf "$BUILD_DIR"
    fi
    
    mkdir -p "$BUILD_DIR"
    print_success "Build directory cleaned"
}

# Optimize CSS
optimize_css() {
    print_status "Optimizing CSS..."
    
    # Combine CSS files
    cat css/main.css css/components.css css/responsive.css > "$BUILD_DIR/styles.css"
    
    # Minify CSS
    cleancss -o "$BUILD_DIR/styles.min.css" "$BUILD_DIR/styles.css"
    
    # Remove temporary file
    rm "$BUILD_DIR/styles.css"
    
    local original_size=$(du -h css/main.css css/components.css css/responsive.css | awk '{sum+=$1} END {print sum}')
    local optimized_size=$(du -h "$BUILD_DIR/styles.min.css" | awk '{print $1}')
    
    print_success "CSS optimized: $optimized_size (from ~${original_size}K)"
}

# Optimize JavaScript
optimize_js() {
    print_status "Optimizing JavaScript..."
    
    # Combine JS files
    cat js/main.js js/components/*.js > "$BUILD_DIR/scripts.js"
    
    # Minify JavaScript
    terser "$BUILD_DIR/scripts.js" -o "$BUILD_DIR/scripts.min.js" \
        --compress drop_console=true,drop_debugger=true \
        --mangle \
        --comments false
    
    # Remove temporary file
    rm "$BUILD_DIR/scripts.js"
    
    local original_size=$(du -ch js/main.js js/components/*.js | tail -1 | awk '{print $1}')
    local optimized_size=$(du -h "$BUILD_DIR/scripts.min.js" | awk '{print $1}')
    
    print_success "JavaScript optimized: $optimized_size (from $original_size)"
}

# Optimize HTML
optimize_html() {
    print_status "Optimizing HTML..."
    
    # Copy HTML file
    cp index.html "$BUILD_DIR/"
    
    # Update asset references
    sed -i.bak 's|<link rel="stylesheet" href="css/main.css">.*<link rel="stylesheet" href="css/responsive.css">|<link rel="stylesheet" href="styles.min.css">|g' "$BUILD_DIR/index.html"
    sed -i.bak 's|<script src="js/main.js"></script>.*<script src="js/components/performance.js"></script>|<script src="scripts.min.js"></script>|g' "$BUILD_DIR/index.html"
    
    # Remove testing scripts section
    sed -i.bak '/<!-- Testing Scripts/,/^[[:space:]]*<\/script>/d' "$BUILD_DIR/index.html"
    
    # Minify HTML
    html-minifier-terser \
        --collapse-whitespace \
        --remove-comments \
        --remove-optional-tags \
        --remove-redundant-attributes \
        --remove-script-type-attributes \
        --remove-tag-whitespace \
        --use-short-doctype \
        --minify-css true \
        --minify-js true \
        -o "$BUILD_DIR/index.min.html" \
        "$BUILD_DIR/index.html"
    
    # Replace original with minified
    mv "$BUILD_DIR/index.min.html" "$BUILD_DIR/index.html"
    
    # Clean up backup file
    rm -f "$BUILD_DIR/index.html.bak"
    
    print_success "HTML optimized"
}

# Copy static assets
copy_assets() {
    print_status "Copying static assets..."
    
    # Copy directories if they exist
    [ -d "assets" ] && cp -r assets "$BUILD_DIR/"
    
    # Copy individual files if they exist
    [ -f "manifest.json" ] && cp manifest.json "$BUILD_DIR/"
    [ -f "sw.js" ] && cp sw.js "$BUILD_DIR/"
    [ -f "robots.txt" ] && cp robots.txt "$BUILD_DIR/"
    [ -f "sitemap.xml" ] && cp sitemap.xml "$BUILD_DIR/"
    [ -f "favicon.ico" ] && cp favicon.ico "$BUILD_DIR/"
    [ -f "_config.yml" ] && cp _config.yml "$BUILD_DIR/"
    
    print_success "Static assets copied"
}

# Generate additional files
generate_files() {
    print_status "Generating additional files..."
    
    # Generate robots.txt if it doesn't exist
    if [ ! -f "$BUILD_DIR/robots.txt" ]; then
        cat > "$BUILD_DIR/robots.txt" << EOF
User-agent: *
Allow: /

Sitemap: https://${GITHUB_USERNAME}.github.io/sitemap.xml
EOF
        print_success "Generated robots.txt"
    fi
    
    # Generate sitemap.xml if it doesn't exist
    if [ ! -f "$BUILD_DIR/sitemap.xml" ]; then
        cat > "$BUILD_DIR/sitemap.xml" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://${GITHUB_USERNAME}.github.io/</loc>
        <lastmod>$(date -u +%Y-%m-%d)</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://${GITHUB_USERNAME}.github.io/#about</loc>
        <lastmod>$(date -u +%Y-%m-%d)</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://${GITHUB_USERNAME}.github.io/#projects</loc>
        <lastmod>$(date -u +%Y-%m-%d)</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://${GITHUB_USERNAME}.github.io/#research</loc>
        <lastmod>$(date -u +%Y-%m-%d)</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://${GITHUB_USERNAME}.github.io/#contact</loc>
        <lastmod>$(date -u +%Y-%m-%d)</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.7</priority>
    </url>
</urlset>
EOF
        print_success "Generated sitemap.xml"
    fi
    
    # Generate .nojekyll file to bypass Jekyll processing
    touch "$BUILD_DIR/.nojekyll"
    print_success "Generated .nojekyll file"
}

# Validate build
validate_build() {
    print_status "Validating build..."
    
    local errors=0
    
    # Check required files
    if [ ! -f "$BUILD_DIR/index.html" ]; then
        print_error "Missing index.html"
        ((errors++))
    fi
    
    if [ ! -f "$BUILD_DIR/styles.min.css" ]; then
        print_error "Missing styles.min.css"
        ((errors++))
    fi
    
    if [ ! -f "$BUILD_DIR/scripts.min.js" ]; then
        print_error "Missing scripts.min.js"
        ((errors++))
    fi
    
    # Check file sizes
    local html_size=$(stat -f%z "$BUILD_DIR/index.html" 2>/dev/null || stat -c%s "$BUILD_DIR/index.html" 2>/dev/null || echo "0")
    local css_size=$(stat -f%z "$BUILD_DIR/styles.min.css" 2>/dev/null || stat -c%s "$BUILD_DIR/styles.min.css" 2>/dev/null || echo "0")
    local js_size=$(stat -f%z "$BUILD_DIR/scripts.min.js" 2>/dev/null || stat -c%s "$BUILD_DIR/scripts.min.js" 2>/dev/null || echo "0")
    
    if [ "$html_size" -eq 0 ] || [ "$css_size" -eq 0 ] || [ "$js_size" -eq 0 ]; then
        print_error "One or more files are empty"
        ((errors++))
    fi
    
    if [ $errors -eq 0 ]; then
        print_success "Build validation passed"
        return 0
    else
        print_error "Build validation failed with $errors errors"
        return 1
    fi
}

# Display build summary
show_summary() {
    print_status "Build Summary:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if [ -d "$BUILD_DIR" ]; then
        echo "Build directory: $BUILD_DIR"
        echo "Files created:"
        ls -la "$BUILD_DIR" | grep -v "^total" | awk '{print "  " $9 " (" $5 " bytes)"}'
        
        local total_size=$(du -sh "$BUILD_DIR" | awk '{print $1}')
        echo "Total size: $total_size"
    fi
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Main deployment function
main() {
    print_status "GitHub Pages Deployment Script"
    print_status "Portfolio: Data Science Portfolio"
    echo ""
    
    # Run all steps
    check_dependencies
    install_build_tools
    create_backup
    clean_build
    optimize_css
    optimize_js
    optimize_html
    copy_assets
    generate_files
    
    if validate_build; then
        show_summary
        print_success "✅ Build completed successfully!"
        print_status "Next steps:"
        echo "  1. Review the build directory: $BUILD_DIR"
        echo "  2. Test the build locally by serving the $BUILD_DIR directory"
        echo "  3. Commit and push to GitHub to trigger deployment"
        echo ""
        print_status "GitHub Pages URL: https://${GITHUB_USERNAME}.github.io"
    else
        print_error "❌ Build failed! Check the errors above."
        exit 1
    fi
}

# Run main function
main "$@"