const researchData = [
    {
        id: 'machine-unlearning',
        title: 'Machine Unlearning: Privacy-Preserving Model Modification',
        category: 'Conference Presentation',
        description: 'Conducted comprehensive research on machine unlearning techniques, focusing on methods for selectively removing specific data influences from trained machine learning models while preserving overall model performance.',
        longDescription: 'The research explores various unlearning algorithms, their effectiveness, and practical applications in privacy-preserving AI. Key focus areas include developing efficient algorithms for deep neural networks, evaluating performance trade-offs, and proposing robust metrics for verification.',
        venue: 'Responsible AI ACM Summer School',
        status: 'Ongoing',
        image: 'assets/images/unlearning-research.jpg',
        highlights: [
            'Developed novel unlearning algorithms for deep neural networks',
            'Evaluated performance trade-offs in privacy-preserving scenarios',
            'Proposed metrics for measuring unlearning effectiveness',
            'Demonstrated practical applications in healthcare and finance'
        ],
        links: [
            { label: 'Presentation Slides', url: '#', icon: 'slides' },
            { label: 'Code Repository', url: 'https://github.com/Vaibhav-sa30/machine-unlearning-research', icon: 'github' }
        ]
    },
    {
        id: 'iomt-privacy',
        title: 'Privacy-Preserving & Explainable AI for Wearable Health',
        category: 'Research Paper',
        description: 'A framework for secure IoMT health monitoring, integrating encrypted data management with LLM-assisted explainability to ensure patient data privacy and clinician trust.',
        longDescription: 'The paper presents a privacy-preserving and explainable AI framework for wearable health monitoring based on IoMT (Internet of Medical Things). Addressing challenges like data leakage and lack of transparency, the framework integrates encrypted data management, role-based access control, and secure communication protocols. To build clinician trust, it employs Large Language Models (LLMs) and model-agnostic interpretability techniques to provide clear reasoning behind AI-driven health insights, ensuring both security and intelligence in remote care.',
        venue: 'Research Paper',
        status: 'Ongoing',
        highlights: [
            'Integrated encrypted data management & Role-Based Access Control (RBAC)',
            'LLM-assisted explainability for clinical decision support',
            'Secure communication protocols for IoMT devices',
            'Proof-of-concept validation for privacy & interpretability'
        ],
        links: [
            { label: 'Read Abstract', url: '#', icon: 'document' }
        ]
    },
    {
        id: 'math-reasoning',
        title: 'Multilingual Language Model Alignment for Mathematical Reasoning',
        category: 'Ongoing Research',
        description: 'Currently conducting research on testing probing methodologies, red teaming techniques, and fine-tuning strategies for an Indian-based small language model specifically trained on JEE mathematics problems.',
        longDescription: 'The goal is to achieve better alignment with responsible AI principles while maintaining high performance on mathematical reasoning tasks. The project involves creating benchmarks for multilingual systems and implementing safety evaluation strategies.',
        venue: 'Independent Research',
        status: 'Ongoing',
        highlights: [
            'Develop robust probing methodologies for mathematical reasoning',
            'Implement red teaming strategies for model safety evaluation',
            'Fine-tune models for improved alignment and performance',
            'Create benchmarks for multilingual mathematical AI systems'
        ],
        links: [
            { label: 'Research Repository', url: 'https://github.com/Vaibhav-sa30/indian-llm-alignment', icon: 'github' }
        ]
    },
    {
        id: 'gpt5-red-teaming',
        title: 'AI Safety through Red Teaming: GPT-5 Vulnerability Assessment',
        category: 'Competition Research',
        description: 'Participated in a competitive red teaming initiative focused on identifying vulnerabilities and potential security issues in the GPT-5 model.',
        longDescription: 'This research contributed to AI safety by developing novel prompt engineering techniques and systematic approaches to model testing. The work focused on jailbreaking attempts, prompt injection, and identifying edge cases where the model might exhibit unsafe behavior.',
        venue: 'Kaggle Competition',
        status: 'Ongoing',
        highlights: [
            'Identified critical model vulnerabilities through systematic testing',
            'Developed innovative jailbreaking and prompt injection techniques',
            'Ranked in top 10% of competition participants',
            'Contributed findings to AI safety research community'
        ],
        links: [
            { label: 'Competition Repository', url: 'https://github.com/Vaibhav-sa30/gpt5-red-teaming', icon: 'github' }
        ]
    },
    {
        id: 'golf-code-agi',
        title: 'Golf Code Generation for AGI',
        category: 'Competition Research',
        description: 'A unique Kaggle competition project in the field of Artificial General Intelligence (AGI) that involved generating golf code (extremely concise code) to solve complex image-based puzzles.',
        longDescription: 'This project explored the intersection of code generation, image processing, and transparent AI systems. By focusing on minimal code solutions ("golf code"), we investigated the interpretability and efficiency of AGI-like reasoning patterns.',
        venue: 'Kaggle Competition',
        status: 'Ongoing',
        highlights: [
            'Developed ultra-concise problem-solving algorithms',
            'Explored transparent AI methodologies',
            'Created innovative image processing solutions',
            'Contributed to AGI research community'
        ],
        links: [
            { label: 'Competition Repository', url: 'https://github.com/Vaibhav-sa30/golf-code-agi', icon: 'github' }
        ]
    },
    {
        id: 'content-moderation',
        title: 'Automated Content Moderation System Analysis',
        category: 'Competition Research / Paper',
        description: 'Investigated how multi-modal signals (text, engagement, identity features) interact with internal platform features to shape automated content moderation outcomes.',
        longDescription: 'The study analyzes potential fairness and transparency concerns in large-scale online comment moderation. We examined how identity-related references and linguistic markers correlate with moderation decisions, highlighting potential biases in automated systems.',
        venue: 'Kaggle Competition',
        status: 'Ongoing',
        highlights: [
            'Internal platform signals exhibit significant predictive power beyond text',
            'Identity-related references are associated with differing categorization patterns',
            'Identified early linguistic markers predicting escalation',
            'Highlighted opaque automated components in moderation pipelines'
        ],
        links: [
            { label: 'Competition Repository', url: '#', icon: 'github' }
        ]
    }
];

class ResearchShowcase {
    constructor() {
        this.cards = document.querySelectorAll('.research__card');
        this.modal = null;
        this.init();
    }

    init() {
        this.createModal();
        this.addEventListeners();
    }

    createModal() {
        // Reuse project modal structure/classes for consistent styling
        this.modal = document.createElement('div');
        this.modal.className = 'project__modal research__modal'; // Added research__modal for specific overrides if needed
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

    addEventListeners() {
        // Card Click Events
        this.cards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Ignore clicks on links or buttons to prevent "double action"
                if (e.target.closest('a') || e.target.closest('button')) {
                    return;
                }

                const researchId = card.dataset.researchId;
                if (researchId) {
                    this.openModal(researchId);
                }
            });
        });

        // Modal Close Events
        this.modal.querySelector('.project__modal-close').addEventListener('click', () => this.closeModal());

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    openModal(id) {
        const data = researchData.find(item => item.id === id);
        if (!data) return;

        const modalBody = this.modal.querySelector('.project__modal-body');
        modalBody.innerHTML = this.createModalContent(data);

        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    createModalContent(data) {
        // Helper to get icon SVG
        const getIcon = (type) => {
            const icons = {
                github: '<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
                slides: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>',
                chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>',
                document: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>'
            };
            return icons[type] || icons.document;
        };

        return `
            <div class="project__modal-header">
                <h2 class="project__modal-title">${data.title}</h2>
                <div class="project__modal-category project__category-badge--research">
                    ${data.category}
                </div>
            </div>
            
            <div class="project__modal-info research__modal-layout">
                <!-- Data Visualization / Header Image could go here if available -->
                
                <section class="research__section research__overview">
                    <h3 class="research__section-title">Overview</h3>
                    <p class="research__overview-text">${data.longDescription}</p>
                </section>
                
                <div class="research__grid">
                    <section class="research__section research__highlights-section">
                        <h3 class="research__section-title">Key Findings</h3>
                        <ul class="research__highlights-list">
                            ${data.highlights.map(item => `
                                <li class="research__highlight-item">
                                    <span class="highlight-bullet"></span>
                                    <span>${item}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </section>
                    
                    <section class="research__section research__details-section">
                        <h3 class="research__section-title">Project Details</h3>
                        <div class="research__meta-grid">
                            <div class="research__meta-item">
                                <span class="research__meta-label">Venue</span>
                                <span class="research__meta-value">${data.venue}</span>
                            </div>
                            <div class="research__meta-item">
                                <span class="research__meta-label">Status</span>
                                <span class="research__meta-value research__status--tag ${data.status === 'Ongoing' ? 'status-ongoing' : 'status-completed'}">${data.status}</span>
                            </div>
                        </div>
                        
                        <div class="research__actions">
                             ${data.links.map(link => `
                                <a href="${link.url}" class="research__action-btn" target="_blank" rel="noopener noreferrer">
                                    ${getIcon(link.icon)} <span>${link.label}</span>
                                </a>
                            `).join('')}
                        </div>
                    </section>
                </div>
            </div>
        `;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new ResearchShowcase();
});
