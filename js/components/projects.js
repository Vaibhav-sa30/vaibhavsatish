/* ===== PROJECTS SHOWCASE LOGIC ===== */

/*
 * 📝 HOW TO ADD NEW PROJECTS:
 * 
 * EASY WAY (Recommended):
 * 1. Open admin/project-form.html in your browser
 * 2. Fill in project details
 * 3. Click "Generate JSON" and copy the output
 * 4. Paste the JSON below (don't forget comma after previous project!)
 * 5. Add images to assets/images/[project-id]-1.jpg and [project-id]-2.jpg
 * 6. Commit and push - GitHub Actions will auto-deploy!
 * 
 * 📖 Full Guide: admin/README.md
 * 🚀 Quick Start: admin/QUICK-START.md
 * 📊 Workflow: admin/WORKFLOW.md
 * 
 * MANUAL WAY:
 * Copy the structure below and fill in your project details.
 * Make sure to follow the exact format to avoid errors.
 */

// Project data structure
const projectsData = [
    {
        id: 'vehicle-parking-v1',
        title: 'Vehicle Parking WebApp v1',
        category: 'fullstack',
        description: 'Full-stack vehicle parking management system with real-time monitoring and analytics.',
        longDescription: 'A comprehensive vehicle parking management system built with Flask, SQLAlchemy, and Jinja2 templating. Features include real-time parking space monitoring, user authentication, booking system, and detailed analytics with Chart.js visualizations. The application handles multiple parking lots, user roles, and provides comprehensive reporting capabilities.',
        technologies: ['Python', 'Flask', 'SQLAlchemy', 'Jinja2', 'HTML', 'CSS', 'JavaScript', 'Chart.js'],
        thumbnail: 'assets/images/mad1/admin-dashboard.png',
        images: ['assets/images/mad1/admin-dashboard.png', 'assets/images/mad1/admin-create-parking-lot.png', 'assets/images/mad1/admin-user.png', 'assets/images/mad1/admin-reservations.png', 'assets/images/mad1/admin-summaries.png', 'assets/images/mad1/user-dashboard.png', 'assets/images/mad1/user-parking-lot.png', 'assets/images/mad1/user-reservations.png', 'assets/images/mad1/user-summaries.png', 'assets/images/mad1/user-profile.png'],
        githubUrl: 'https://github.com/21f3002068/Park-Ease',
        liveUrl: null,
        outcomes: [
            'Reduced parking search time by 60%',
            'Implemented real-time space availability tracking',
            'Created comprehensive admin dashboard',
            'Integrated payment processing system'
        ],
        status: 'completed'
    },
    {
        id: 'vehicle-parking-v2',
        title: 'Vehicle Parking WebApp v2',
        category: 'fullstack',
        description: 'Enhanced version with Vue.js frontend, Redis caching, and Celery for background tasks.',
        longDescription: 'An upgraded version of the parking management system featuring a modern Vue.js frontend, Redis for caching and session management, and Celery for handling background tasks. This version includes improved performance, real-time notifications, advanced analytics, and a more responsive user interface.',
        technologies: ['Python', 'Flask', 'Vue.js', 'Redis', 'Celery', 'SQLAlchemy', 'Chart.js', 'WebSocket'],
        thumbnail: 'assets/images/mad2/admin-dashboard.png',
        images: ['assets/images/mad2/admin-dashboard.png', 'assets/images/mad2/admin-lots.png', 'assets/images/mad2/admin-user.png', 'assets/images/mad2/admin-reservations.png', 'assets/images/mad2/admin-summaries.png', 'assets/images/mad2/user-dashboard.png', 'assets/images/mad2/user-lots.png', 'assets/images/mad2/user-reservations.png', 'assets/images/mad2/user-profile.png', 'assets/images/mad2/user-summaries.png'],
        githubUrl: 'https://github.com/21f3002068/ParkEase-V2',
        liveUrl: 'https://parking-demo.herokuapp.com',
        outcomes: [
            'Improved performance by 40% with Redis caching',
            'Added real-time notifications with WebSocket',
            'Implemented background task processing',
            'Enhanced mobile responsiveness'
        ],
        status: 'completed'
    },
    {
        id: 'kaggle-ml-competition',
        title: 'Toxic Comment Category Prediction | NLP Task',
        category: 'ml',
        description: 'Machine learning competition project using only scikit-learn library for model development.',
        longDescription: 'A challenging Kaggle competition project where I restricted myself to using only the scikit-learn library. The project involved extensive feature engineering, model selection, hyperparameter tuning, and ensemble methods to achieve competitive results while maintaining code simplicity and interpretability.',
        technologies: ['Python', 'scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Jupyter'],
        thumbnail: 'assets/images/mlp/intro.png',
        images: ['assets/images/mlp/intro.png', 'assets/images/mlp/image-1.png'],
        githubUrl: 'https://github.com/21f3002068/Toxic-Comment-Category-Prediction',
        liveUrl: null,
        outcomes: [
            'Achieved top 15% ranking in competition',
            'Developed robust feature engineering pipeline',
            'Implemented ensemble voting classifier',
            'Created comprehensive model evaluation framework'
        ],
        status: 'ongoing'

    },
    {
        id: 'sales-channel-optimization',
        title: 'Optimizing Sales Channels & Inventory for a Regional Distributor',
        category: 'data-analysis',
        description: 'Used data analysis to reduce contractor reliance and optimize inventory for a regional timber business, identifying a ₹1.18 crore strategic risk.',
        longDescription: `
            <div class="project-blog">
                <h3>How I Used Data to De-Risk a Regional Timber Business</h3>
                <p><em>By Vaibhav Satish</em></p>
                <p>We often hear that "Cash is King," but in the world of regional distribution, Relationships are King. Or at least, that’s what I thought when I started my Business Data Management (BDM) Capstone Project.</p>
                <p>I decided to work with S.K. Timber, a well-established plywood and interior materials distributor in my locality (Aligarh), founded back in 2000. My goal was simple: dig into their data and see if I could help them optimize their operations.</p>
                <p>But what I found wasn't just a simple optimization problem—it was a structural time bomb ticking under the surface of a successful business. Here is the story of how I went from scanning paper invoices to diagnosing a ₹1.18 crore strategic risk.</p>
                
                <h4>The Initial Meeting: "Contractors Are Everything"</h4>
                <p>In my very first meeting with the owner, Mohammad Aslam, he said something that defined the entire scope of my project: <em>"Maintaining a good relationship with contractors is much more important than a direct customer."</em></p>
                <p>This wasn't just an opinion; it was the business model. S.K. Timber operates on a network of 600+ informal contractors who bring in the end customers. The belief was that as long as the contractors were happy (usually via annual Diwali bonuses), the business was safe.</p>
                <p>I decided to test that belief. My project title became: <strong>"Minimizing Contractor Reliance & Credit Purchases to Strengthen Direct Customer Relationships."</strong></p>

                <h4>Phase 1: The "Scrappy" Data Engineering</h4>
                <p>Before I could run any fancy models, I hit a wall: The Data Didn't Exist. There was no SQL database. No clean CSVs. Just photographs of invoices, sales logs, and purchase records.</p>
                <p>If I wanted to do this, I had to build the dataset myself. My process was a mix of modern tech and brute force:</p>
                <ol>
                    <li><strong>Digitization:</strong> I used Windows 11’s "Scan Text" feature to pull raw text from image files.</li>
                    <li><strong>Structuring:</strong> I wrote a custom Python script to parse that messy text into structured rows and columns.</li>
                    <li><strong>Manual Entry:</strong> For sensitive data, like the "Estimate Memos" (which showed me how customers actually behave), I manually typed out the data.</li>
                </ol>
                <p>But data isn't just numbers; it's context. I used Professional Selling Concepts to build rapport with the owner, which led to crucial "off-the-books" disclosures. He admitted that ₹16–18 lakh was currently stuck in market receivables and that 80% of end-customer sales were actually contractor-influenced.</p>

                <h4>Phase 2: Busting Myths with Statistics</h4>
                <p>I started with a simple question: Who is actually making us money?</p>
                <p>I ran an ANOVA test to compare the Average Order Value (AOV) of B2B clients, Contractors, and End Customers.</p>
                <p><strong>The Surprise:</strong> End Customers had high order values, but further digging (using a Monte Carlo simulation) showed that the really big orders were coming from customers brought in by contractors.</p>
                <p>But here was the catch: the variance between these groups was wild. A B2B order might be ₹29,000, while a contractor might buy a ₹100 item. Standard statistical tests assume equal variance, but my data broke that rule.</p>
                <p><strong>My Approach:</strong> instead of quitting, I pivoted to robust statistics. I used Welch’s ANOVA and the Games-Howell post-hoc test. This confirmed that while B2B was the "value leader," the contractor channel was the high-volume engine driving the business.</p>

                <h4>Phase 3: The "Scary" Discovery (The Fragility of the A-List)</h4>
                <p>This is where the project turned from "analysis" to "risk management."</p>
                <p>The business has 600+ contractors. But when I analyzed the "A-List" (the top performers), I saw something alarming. I calculated a Contractor Dependency Index (CDI) and plotted a Lorenz Curve.</p>
                <p><strong>The result?</strong> A Partial Gini Coefficient of 0.329. In plain English: Inequality.</p>
                <p>My simulation showed that the business wasn't relying on 600 people; it was relying on about 20.</p>
                <ul>
                    <li>If the top 20 contractors left, the business would lose ~54% of its A-List revenue.</li>
                    <li>The Risk Priority Number (RPN) for this event was 315—the highest in my entire risk analysis.</li>
                </ul>
                <p>The "Asset" (the contractor network) was actually a massive vulnerability.</p>

                <h4>Phase 4: The Invisible Leaks (Credit & Inventory)</h4>
                <p>While the contractor risk was strategic, the operational risks were bleeding cash daily.</p>
                <ol>
                    <li><strong>The Hidden Credit Crisis:</strong> The books said credit sales were low. But by tracing UPI vs. Cash transactions, I found that 98.45% of sales were via UPI. The owner confirmed that ~35% of these UPI sales in the unregistered segment were actually credit. That explained the ₹16–18 lakh stuck in the market.</li>
                    <li><strong>Seasonal Blindness:</strong> I looked at inventory levels vs. sales. It was chaotic. In September, excess stock peaked at 148.5% because procurement didn't slow down when sales dropped. I applied an EOQ (Economic Order Quantity) model to benchmark their ordering.
                        <ul>
                            <li>Current State: They place ~829 fragmented orders a year.</li>
                            <li>Optimized State: They only need ~68 orders a year.</li>
                            <li>Impact: Implementing this could save them 90% of their ordering activity and over ₹2.6 lakh annually.</li>
                        </ul>
                    </li>
                </ol>

                <h4>The Solution: Don't Fire Them, Manage Them</h4>
                <p>My final recommendation wasn't to cut out the contractors—that would kill 80% of the revenue. Instead, I proposed a Balanced Channel Strategy:</p>
                <ol>
                    <li><strong>Formalize the Fragile:</strong> Move from annual "Diwali Bonuses" to monthly performance reviews. If a top contractor stops referring, we need to know in 30 days, not 12 months.</li>
                    <li><strong>Diversify:</strong> Aggressively target "Organic" End Customers using digital promos to reduce that 80% dependency down to 50–60%.</li>
                    <li><strong>Stop the Bleeding:</strong> Implement a "Soft Lock" on customers who have unpaid credit dues.</li>
                </ol>

                <h4>Final Thoughts</h4>
                <p>This project taught me that data analysis in the real world isn't about perfect datasets and standard textbook models. It's about being a detective. It's about realizing that a high "Contractor Dependency Index" might actually be hiding a dangerous concentration of risk.</p>
                <p>By the end, I didn't just hand over a report; I handed over a survival guide. We moved the business from relying on "gut feeling" and "relationships" to relying on Sales Inequality metrics, Risk Priority Numbers, and Seasonal EOQ models.</p>
                <p>And that is the power of Business Data Management.</p>
            </div>
        `,
        technologies: ['Python', 'Pandas', 'Risk Management', 'Monte Carlo Simulation', 'Data Visualization'],
        thumbnail: 'assets/images/bdm/Outside View.png',
        images: ['assets/images/bdm/Outside View.png', 'assets/images/bdm/Outside View.png', 'assets/images/bdm/blurred biz owner.png', 'assets/images/bdm/Products_image1.png'],
        githubUrl: 'https://github.com/21f3002068/Optimizing-Sales-Channels-Inventory-for-a-Regional-Distributor/tree/main',
        liveUrl: '#',
        liveUrlLabel: 'View Dashboard',
        outcomes: [
            'Identified ₹1.18 crore strategic risk',
            'Reduced contractor dependency risk',
            'Optimized inventory ordering (90% reduction)',
            'Projected ₹2.6 lakh annual savings'
        ],
        featured: true,
        status: 'completed'
    }

];

class ProjectsShowcase {
    constructor() {
        this.projects = projectsData;
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.container = document.getElementById('projects-container');
        this.filterButtons = document.querySelectorAll('.projects__filter-btn');
        this.searchInput = document.getElementById('projects-search');
        this.modal = null;

        this.init();
    }

    init() {
        // Use a small timeout to ensure DOM is fully ready and avoid race conditions
        setTimeout(() => {
            this.createProjectCards();
            this.setupFilterButtons();
            this.setupSearchFunctionality();
            this.createModal();
            this.setupEventListeners();
        }, 100);
    }

    createProjectCards() {
        if (!this.container) return;

        this.container.innerHTML = '';

        let filteredProjects = this.currentFilter === 'all'
            ? this.projects
            : this.projects.filter(project => project.category === this.currentFilter);

        // Apply search filter
        if (this.searchQuery) {
            filteredProjects = filteredProjects.filter(project =>
                project.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                project.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                project.technologies.some(tech =>
                    tech.toLowerCase().includes(this.searchQuery.toLowerCase())
                )
            );
        }

        // Show no results message if needed
        if (filteredProjects.length === 0) {
            this.showNoResults();
            return;
        }

        filteredProjects.forEach(project => {
            const card = this.createProjectCard(project);
            this.container.appendChild(card);
        });

        // Trigger stagger animation
        const cards = this.container.querySelectorAll('.project__card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in');
        });

        // Update results count
        this.updateResultsCount(filteredProjects.length);
    }

    showNoResults() {
        this.container.innerHTML = `
            <div class="projects__no-results">
                <svg class="projects__no-results-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
                <h3>No projects found</h3>
                <p>Try adjusting your search or filter criteria</p>
                <button class="button button--outline" onclick="window.projectsShowcase.clearFilters()">
                    Clear Filters
                </button>
            </div>
        `;
    }

    updateResultsCount(count) {
        const existingCount = document.querySelector('.projects__results-count');
        if (existingCount) {
            existingCount.remove();
        }

        if (this.searchQuery || this.currentFilter !== 'all') {
            const countElement = document.createElement('div');
            countElement.className = 'projects__results-count';
            countElement.textContent = `Showing ${count} project${count !== 1 ? 's' : ''}`;

            const projectsSection = document.querySelector('.projects');
            const container = projectsSection.querySelector('.container');
            const controls = container.querySelector('.projects__controls');
            controls.appendChild(countElement);
        }
    }

    clearFilters() {
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.searchInput.value = '';

        // Reset filter buttons
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-filter="all"]').classList.add('active');

        this.animateFilterChange();
    }

    createProjectCard(project) {
        const card = document.createElement('article');
        card.className = 'project__card';
        card.dataset.category = project.category;
        card.dataset.projectId = project.id;

        const statusBadge = `<span class="project__status project__status--${project.status}">${project.status}</span>`;
        const liveUrlButton = project.liveUrl ?
            `<a href="${project.liveUrl}" class="project__link" target="_blank" rel="noopener noreferrer">
                <svg class="project__link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15,3 21,3 21,9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                ${project.liveUrlLabel || 'Live Demo'}
            </a>` : '';

        card.innerHTML = `
            <div class="project__image">
                <img src="${project.thumbnail || project.images[0]}" alt="${project.title}" class="project__img" loading="lazy" onerror="console.error('Failed to load image:', this.src)">
                ${statusBadge}
                <div class="project__overlay">
                    <button class="project__view-btn" data-project-id="${project.id}">
                        View Details
                    </button>
                </div>
            </div>
            <div class="project__content">
                <div class="project__category-badge project__category-badge--${project.category}">
                    ${this.getCategoryName(project.category)}
                </div>
                <h3 class="project__title">${project.title}</h3>
                <p class="project__description">${project.description}</p>
                <div class="project__technologies">
                    ${project.technologies.slice(0, 4).map(tech =>
            `<span class="project__tech-tag">${tech}</span>`
        ).join('')}
                    ${project.technologies.length > 4 ?
                `<span class="project__tech-more">+${project.technologies.length - 4} more</span>` : ''}
                </div>
                <div class="project__actions">
                    <a href="${project.githubUrl}" class="project__link" target="_blank" rel="noopener noreferrer">
                        <svg class="project__link-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub
                    </a>
                    ${liveUrlButton}
                </div>
            </div>
        `;

        return card;
    }

    getCategoryName(category) {
        const categoryNames = {
            'fullstack': 'Full-Stack',
            'ml': 'Machine Learning',
            'data-analysis': 'Data Analysis'
        };
        return categoryNames[category] || category;
    }

    setupFilterButtons() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                this.filterButtons.forEach(btn => btn.classList.remove('active'));

                // Add active class to clicked button
                button.classList.add('active');

                // Update current filter
                this.currentFilter = button.dataset.filter;

                // Recreate project cards with animation
                this.animateFilterChange();
            });
        });
    }

    setupSearchFunctionality() {
        if (!this.searchInput) return;

        let searchTimeout;

        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);

            // Debounce search to avoid too many updates
            searchTimeout = setTimeout(() => {
                this.searchQuery = e.target.value.trim();
                this.animateFilterChange();
            }, 300);
        });

        // Clear search on escape
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.searchInput.value = '';
                this.searchQuery = '';
                this.animateFilterChange();
            }
        });
    }

    animateFilterChange() {
        const cards = this.container.querySelectorAll('.project__card');

        // Fade out existing cards
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.05}s`;
            card.classList.add('fade-out');
        });

        // Create new cards after fade out
        setTimeout(() => {
            this.createProjectCards();
        }, 300);
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'project__modal';
        this.modal.innerHTML = `
            <div class="project__modal-content">
                <button class="project__modal-close">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                <div class="project__modal-body">
                    <!-- Content will be dynamically inserted -->
                </div>
            </div>
        `;

        document.body.appendChild(this.modal);
    }

    setupEventListeners() {
        // Modal close button
        this.modal.querySelector('.project__modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal on backdrop click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });

        // Project card click handlers
        this.container.addEventListener('click', (e) => {
            const viewBtn = e.target.closest('.project__view-btn');
            if (viewBtn) {
                const projectId = viewBtn.dataset.projectId;
                this.openModal(projectId);
            }
        });
    }

    openModal(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        const modalBody = this.modal.querySelector('.project__modal-body');
        modalBody.innerHTML = this.createModalContent(project);

        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Setup image gallery
        this.setupImageGallery(project.images);
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    createModalContent(project) {
        const liveUrlButton = project.liveUrl ?
            `<a href="${project.liveUrl}" class="button button--primary" target="_blank" rel="noopener noreferrer">
                ${project.liveUrlLabel || 'Live Demo'}
            </a>` : '';

        return `
            <div class="project__modal-gallery">
                ${project.images.map((image, index) =>
            `<img src="${image}" alt="${project.title} screenshot ${index + 1}" 
                          class="project__modal-image ${index === 0 ? 'active' : ''}" 
                          data-index="${index}">`
        ).join('')}
                ${project.images.length > 1 ? `
                    <div class="project__gallery-nav">
                        <button class="gallery__nav-btn gallery__nav-prev">‹</button>
                        <button class="gallery__nav-btn gallery__nav-next">›</button>
                    </div>
                ` : ''}
            </div>

            <div class="project__modal-grid">
                <div class="project__modal-main">
                    <div class="project__modal-header">
                        <h2 class="project__modal-title">${project.title}</h2>
                        <div class="project__modal-category project__category-badge--${project.category}">
                            ${this.getCategoryName(project.category)}
                        </div>
                    </div>

                    <div class="project__modal-description">
                        <h3>About This Project</h3>
                        <p>${project.longDescription}</p>
                    </div>

                    <div class="project__modal-outcomes">
                        <h3>Key Outcomes</h3>
                        <ul class="project__outcomes-list">
                            ${project.outcomes.map(outcome =>
            `<li class="project__outcome-item">${outcome}</li>`
        ).join('')}
                        </ul>
                    </div>
                </div>

                <aside class="project__modal-sidebar">
                    <div class="project__modal-actions">
                        <a href="${project.githubUrl}" class="button button--fullwidth button--outline" target="_blank" rel="noopener noreferrer">
                            <svg class="button__icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            GitHub Repository
                        </a>
                        ${liveUrlButton}
                    </div>

                    <div class="project__modal-technologies">
                        <h3>Technologies</h3>
                        <div class="project__tech-list">
                            ${project.technologies.map(tech =>
            `<span class="project__tech-tag">${tech}</span>`
        ).join('')}
                        </div>
                    </div>
                </aside>
            </div>
        `;
    }

    setupImageGallery(images) {
        if (images.length <= 1) return;

        const modalImages = this.modal.querySelectorAll('.project__modal-image');
        const prevBtn = this.modal.querySelector('.gallery__nav-prev');
        const nextBtn = this.modal.querySelector('.gallery__nav-next');

        let currentIndex = 0;

        const showImage = (index) => {
            modalImages.forEach((img, i) => {
                img.classList.toggle('active', i === index);
            });
            currentIndex = index;
        };

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
                showImage(newIndex);
            });

            nextBtn.addEventListener('click', () => {
                const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
                showImage(newIndex);
            });
        }
    }
}

// Initialize projects showcase when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.projectsShowcase = new ProjectsShowcase();
});