# Vaibhav Satish Portfolio

A modern, responsive portfolio website showcasing data science projects, research work, and startup ventures. Built with vanilla HTML, CSS, and JavaScript for optimal performance and GitHub Pages compatibility.


[![Visit Portfolio]](https://vaibhav-sa30.github.io/vaibhavsatish/)
[![Lighthouse Score](https://img.shields.io/badge/Lighthouse-95%2B-brightgreen)](https://developers.google.com/web/tools/lighthouse)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-blue)](https://www.w3.org/WAI/WCAG21/quickref/)

## 🌟 Features

- **📱 Responsive Design**: Mobile-first approach with seamless adaptation across all devices
- **🎨 Modern UI/UX**: Clean, professional design with smooth animations and transitions
- **🚀 Performance Optimized**: 95+ Lighthouse score with lazy loading and optimized assets
- **♿ Accessibility**: WCAG 2.1 AA compliant with full keyboard navigation
- **🔍 SEO Friendly**: Proper meta tags, semantic HTML, and sitemap generation
- **📊 Project Showcase**: Interactive project gallery with filtering and detailed modal views
- **🔬 Research Section**: Academic work and ongoing research presentation
- **📧 Contact Form**: Professional contact form with validation and spam protection
- **🌙 Dark Mode**: Theme toggle with system preference detection
- **📱 PWA Ready**: Progressive Web App with offline functionality

## 🏗️ Project Structure

```
portfolio-website/
├── index.html                 # Main HTML file
├── css/
│   ├── main.css              # Main stylesheet with CSS variables
│   ├── components.css        # Component-specific styles
│   └── responsive.css        # Media queries and responsive design
├── js/
│   ├── main.js              # Main JavaScript functionality
│   └── components/          # JavaScript modules
│       ├── navigation.js    # Enhanced navigation with smooth scrolling
│       ├── projects.js      # Project showcase with filtering
│       ├── research.js      # Research section interactions
│       ├── contact.js       # Contact form with validation
│       ├── animations.js    # Scroll animations and transitions
│       └── performance.js   # Performance optimization utilities
├── assets/
│   ├── images/              # Project screenshots, profile photo
│   ├── icons/               # SVG icons and PWA icons
│   └── documents/           # Resume, research papers (PDFs)
├── test/
│   ├── responsive-test.html # Interactive responsive testing tool
│   ├── browser-compatibility.js # Cross-browser compatibility tests
│   ├── accessibility-test.js    # WCAG 2.1 compliance testing
│   └── README.md            # Testing documentation
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions deployment workflow
├── manifest.json            # PWA manifest
├── sw.js                   # Service worker for offline functionality
├── deploy.sh               # Deployment script
├── optimize.js             # Build optimization script
└── _config.yml             # Jekyll configuration for GitHub Pages
```

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3 (Grid, Flexbox, Custom Properties), Vanilla JavaScript (ES6+)
- **Performance**: Service Worker, Lazy Loading, Image Optimization, Code Splitting
- **PWA**: Web App Manifest, Offline Support, Install Prompts
- **Testing**: Cross-browser compatibility, Accessibility testing, Responsive design validation
- **Deployment**: GitHub Actions, GitHub Pages, Automated optimization
- **SEO**: Structured data, Meta tags, Sitemap generation
- **Analytics**: Performance monitoring, Core Web Vitals tracking

## 🚀 Quick Start

### Prerequisites

- Git
- Modern web browser
- Node.js (for build tools, optional)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/[username]/[username].github.io.git
   cd [username].github.io
   ```

2. **Open locally:**
   ```bash
   # Simple HTTP server (Python)
   python -m http.server 8000
   
   # Or using Node.js
   npx serve .
   
   # Or just open index.html in your browser
   ```

3. **View the website:**
   Open `http://localhost:8000` in your browser

## ⚙️ Customization

### 1. Personal Information

Update the following placeholders in `index.html`:

```html
<!-- Replace these placeholders -->
[Your Name] → Your actual name
[username] → Your GitHub/LinkedIn username
[your-email]@example.com → Your email address
```

### 2. Profile Photo

Add your professional photo:
```bash
# Add your photo (recommended: 400x400px, WebP format)
cp your-photo.jpg assets/images/profile.jpg
```

### 3. Adding Projects (Easy Way - Recommended!)

Use the admin form for easy project management:

```bash
# Open the project form in your browser
start admin/project-form.html
```

**Quick workflow:**
1. Fill in project details in the form
2. Click "Generate JSON" and copy the output
3. Paste into `js/components/projects.js` in the `projectsData` array
4. Add project images to `assets/images/[project-id]-1.jpg`
5. Commit and push - GitHub Actions auto-deploys!

📖 **Detailed guide**: See [admin/README.md](admin/README.md) for complete instructions, tips, and troubleshooting.

### 4. Adding Projects (Manual Way)

Update project information directly in `js/components/projects.js`:

```javascript
const projectsData = [
    {
        id: 'your-project',
        title: 'Your Project Title',
        category: 'ml', // 'fullstack', 'ml', 'data-analysis', 'research'
        description: 'Brief description',
        longDescription: 'Detailed description for modal',
        technologies: ['Python', 'TensorFlow', 'etc'],
        images: ['assets/images/your-project-1.jpg', 'assets/images/your-project-2.jpg'],
        githubUrl: 'https://github.com/username/project',
        liveUrl: 'https://project-demo.com', // optional
        outcomes: [
            'Achievement 1',
            'Achievement 2',
            'Achievement 3'
        ],
        featured: true // or false
    }
];
```

### 5. Research Work

Update research information in the HTML research section and `js/components/research.js`.

### 6. Styling

Customize colors and themes in `css/main.css`:

```css
:root {
    --primary-color: #your-color;
    --secondary-color: #your-secondary-color;
    /* ... other CSS variables */
}
```

## 🚀 Deployment to GitHub Pages

### Automatic Deployment (Recommended)

1. **Create GitHub repository:**
   ```bash
   # Create a repository named [username].github.io
   # This enables GitHub Pages at https://[username].github.io
   ```

2. **Push your code:**
   ```bash
   git add .
   git commit -m "Initial portfolio website"
   git push origin main
   ```

3. **GitHub Actions will automatically:**
   - Build and optimize your website
   - Deploy to GitHub Pages
   - Update on every push to main branch

### Manual Deployment

1. **Run the deployment script:**
   ```bash
   # On Unix/Linux/macOS
   ./deploy.sh
   
   # On Windows
   bash deploy.sh
   ```

2. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Save settings

3. **Your website will be live at:**
   `https://[username].github.io`

### Custom Domain (Optional)

1. **Add CNAME file:**
   ```bash
   echo "yourdomain.com" > CNAME
   ```

2. **Configure DNS:**
   - Add CNAME record pointing to `[username].github.io`
   - Or A records pointing to GitHub Pages IPs

## 🧪 Testing

### Responsive Design Testing

```bash
# Open the interactive testing tool
open test/responsive-test.html
```

### Cross-Browser Compatibility

```javascript
// Run in browser console
const tester = new BrowserCompatibilityTester();
console.log(tester.getResults());
```

### Accessibility Testing

```javascript
// Run in browser console
const a11yTester = new AccessibilityTester();
console.log(a11yTester.getResults());
```

### Performance Testing

```bash
# Using Lighthouse CLI
npm install -g lighthouse
lighthouse https://[username].github.io --view
```

## 📊 Performance Metrics

- **Lighthouse Score**: 95+ across all categories
- **Core Web Vitals**: All metrics in "Good" range
- **Bundle Size**: < 1MB total (optimized)
- **Load Time**: < 3 seconds on 3G
- **Accessibility**: WCAG 2.1 AA compliant

## 🌐 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome  | 90+     | ✅ Full |
| Firefox | 88+     | ✅ Full |
| Safari  | 14+     | ✅ Full |
| Edge    | 90+     | ✅ Full |
| Mobile  | Modern  | ✅ Full |

## 🔧 Development

### Build Tools

```bash
# Install build dependencies
npm install -g clean-css-cli terser html-minifier-terser

# Run optimization
node optimize.js

# Or use the deployment script
./deploy.sh
```

### File Structure for Development

```
src/                    # Source files (if using build process)
├── scss/              # Sass files
├── js/                # ES6+ JavaScript
└── assets/            # Raw assets

build/                 # Built files (generated)
├── styles.min.css     # Minified CSS
├── scripts.min.js     # Minified JavaScript
└── assets/            # Optimized assets
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes:**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch:**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and conventions
- Test across multiple browsers and devices
- Ensure accessibility compliance
- Optimize for performance
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact & Support

- **Email**: [your-email]@example.com
- **LinkedIn**: [linkedin.com/in/username](https://linkedin.com/in/username)
- **GitHub**: [github.com/username](https://github.com/username)
- **Website**: [https://[username].github.io](https://[username].github.io)

## 🙏 Acknowledgments

- **Design Inspiration**: Modern portfolio websites and design systems
- **Icons**: Custom SVG icons and open-source icon libraries
- **Fonts**: Google Fonts (Inter, JetBrains Mono)
- **Testing**: Cross-browser testing tools and accessibility validators
- **Performance**: Web performance best practices and optimization techniques

## 📈 Roadmap

- [ ] **Analytics Integration**: Google Analytics 4 setup
- [ ] **Blog Section**: Technical blog with markdown support
- [ ] **Internationalization**: Multi-language support
- [ ] **Advanced Animations**: Framer Motion or similar
- [ ] **CMS Integration**: Headless CMS for content management
- [ ] **API Integration**: Dynamic project data from GitHub API

---

**Built with ❤️ for showcasing data science expertise and responsible AI research.**

*Last updated: $(date)*
