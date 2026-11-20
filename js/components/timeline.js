/**
 * Timeline Data for Vaibhav Satish Research Portfolio
 * Chronological order: Most recent (2026) to oldest (2021)
 */
const TIMELINE_DATA = [
  {
    year: "2026",
    milestones: [
      {
        id: "ai-safety-canada-2026",
        date: "December 2026",
        title: "AI Controllability and Monitorability",
        organization: "AI Safety Canada Monthly Online Meetup",
        category: "Community & Talks",
        badge: "upcoming",
        summary: "I am scheduled to present on AI controllability and whether internal model reasoning traces provide dependable monitoring signals.",
        details: [
          "Scheduled to present ongoing work on AI Controllability and Monitorability.",
          "Examines whether internal chain-of-thought traces and activation states offer dependable signals for monitoring and steering autonomous AI agent behavior.",
          "Upcoming presentation scheduled for the monthly online community seminar."
        ],
        tags: ["Controllability", "Monitorability", "AI Safety", "Upcoming"],
        link: {
          url: null,
          label: null
        }
      },
      {
        id: "cdipr-fellowship-2026",
        date: "July – September 2026",
        title: "AI Tech Law Research Fellowship",
        organization: "Centre for Development of Intellectual Property and Research (CDIPR)",
        category: "Fellowship & Certifications",
        summary: "I completed a fellowship examining AI governance, technology law, and the legal sufficiency of automated compliance attestations.",
        details: [
          "Completed the competitive research fellowship at CDIPR exploring technology law and AI governance boundaries.",
          "Investigated the legal sufficiency of automated compliance attestations under evolving global regulations.",
          "Analyzed liability allocation and evidentiary standards for autonomous systems in high-stakes environments.",
          "Awarded the AI Tech Law Research Fellowship certificate."
        ],
        tags: ["AI Law", "AI Governance", "Compliance", "CDIPR"],
        link: {
          url: null,
          label: null
        }
      },
      {
        id: "iit-ropar-internship-2026",
        date: "May – July 2026 (Extended)",
        title: "AI Research Intern & Student Point of Contact",
        organization: "Project Tenali, IIT Ropar",
        category: "Internship & Leadership",
        summary: "I contributed to Vachana mathematics communication reasoning evaluation and coordinated 50–60 interns across cohorts.",
        details: [
          "Contributed to Project Tenali, specifically Vachana (Mathematics Communication Exercises), focusing on structured reasoning evaluation and interactive problem-solving logic.",
          "Served as Student Point of Contact (SPOC) and coordination lead for approximately 50–60 research interns.",
          "Conducted code reviews, mentored incoming interns, led sprint briefings, and streamlined mentor-student communication channels.",
          "Internship tenure was extended to support continuous execution across subsequent cohorts."
        ],
        tags: ["Reasoning Evaluation", "Project Tenali", "IIT Ropar", "Coordination Lead"],
        link: {
          url: null,
          label: null
        }
      },
      {
        id: "raiflow-governance-2026",
        date: "April 2026 – Present",
        title: "RaiFlow: Compliance-as-Code Framework & CI/CD Guardrails",
        organization: "CDIPR & Open-Source Engineering",
        category: "Research",
        summary: "I am developing RaiFlow, a research and systems initiative that turns EU AI Act and NIST AI RMF requirements into declarative CI/CD verification pipelines.",
        details: [
          "Authored a working paper at CDIPR proposing a Compliance-as-Code framework bridging high-level regulatory statutes and production CI/CD software pipelines.",
          "Translated multi-jurisdictional AI safety mandates (EU AI Act, NIST AI RMF) into declarative YAML validation schemas.",
          "Engineered an automated repository analyzer executing a seven-stage validation pipeline within GitHub Actions.",
          "Integrated localized semantic LLM-as-a-Judge evaluators for automated algorithmic compliance verification.",
          "Built a real-time FastAPI dashboard with Server-Sent Events (SSE) telemetry to visualize compliance manifests across pull requests."
        ],
        tags: ["Compliance-as-Code", "AI Governance", "EU AI Act", "CI/CD Guardrails", "FastAPI"],
        link: {
          url: "research.html",
          label: "View Research Page"
        }
      },
      {
        id: "social-cognition-benchmark-2026",
        date: "March – April 2026",
        title: "Benchmarking Social Cognition in LLMs",
        organization: "DeepMind Kaggle Hackathon: Tracking Progress Towards AGI",
        category: "Research",
        summary: "I built a four-task procedural benchmark to evaluate functional Theory of Mind, epistemic failure modes, and reasoning parasitism in frontier models.",
        details: [
          "Developed for the DeepMind Kaggle Hackathon 'Tracking Progress Towards AGI'.",
          "Engineered a benchmark suite across 4 procedural social evaluation tasks measuring Spontaneous Theory of Mind and Cryptographic Theory of Mind.",
          "Built a Neurosymbolic Evaluation bridge utilizing structured Mental State Log traces to isolate genuine intent inference from probabilistic pattern matching.",
          "Identified critical epistemic failures, social manipulation vulnerability, and reasoning parasitism in LLM multi-agent interactions.",
          "Published an accompanying research essay dissecting the social blind spot in current AGI benchmarks."
        ],
        tags: ["Theory of Mind", "Social Cognition", "AGI Benchmarks", "Neurosymbolic"],
        link: {
          url: "social-cognition-agi.html",
          label: "Read Research Essay"
        }
      },
      {
        id: "privacy-xai-iomt-2026",
        date: "February 2026 – Present",
        title: "Privacy-Preserving XAI in IoMT Wearables",
        organization: "CDIPR Collaborative Research",
        category: "Research",
        summary: "I co-authored an architecture that combines localized Gemma 4 LLM-as-a-Judge oversight with privacy-preserving telemetry for clinical wearable biosignals.",
        details: [
          "Co-authored working paper investigating explainable AI, telemetry privacy, and safety boundaries in Internet of Medical Things (IoMT) devices.",
          "Architected a privacy-preserving framework integrating on-device Gemma 4 models to generate longitudinal clinical summaries from sensitive continuous telemetry.",
          "Designed an AI Safety evaluation layer utilizing local LLM-as-a-Judge agents to audit clinical constraints, hallucination rates, and semantic drift.",
          "Benchmarked compliance with strict medical confidentiality and real-time inference latency constraints."
        ],
        tags: ["IoMT", "Explainable AI", "Gemma 4", "LLM-as-a-Judge", "Clinical Safety"],
        link: {
          url: "research.html",
          label: "View Research Page"
        }
      },
      {
        id: "algorithmic-moderation-cdipr-2026",
        date: "January – April 2026",
        title: "Auditing Algorithmic Moderation in Digital Platforms",
        organization: "Centre for Development of Intellectual Property and Research (CDIPR)",
        category: "Research",
        summary: "I formulated the “Transparency Gap Thesis” to examine accountability breakdowns in opaque platform moderation systems.",
        details: [
          "Authored a working paper at CDIPR establishing the 'Transparency Gap Thesis' on opacity and accountability breakdowns in large-scale platform enforcement.",
          "Analyzed trade-offs between predictive throughput maximization and ethical interpretability.",
          "Conducted an extensive ablation study benchmarking black-box classification features, achieving 0.83 Macro-F1.",
          "Formulated architectural specifications for transparent algorithmic fallback protocols under disputed edge cases.",
          "Presented analytical findings and governance recommendations to the academic research community at CDIPR."
        ],
        tags: ["Transparency Gap", "Algorithmic Moderation", "CDIPR", "Ablation Study"],
        link: {
          url: "research.html",
          label: "View Research Page"
        }
      },
      {
        id: "toxicity-classification-2026",
        date: "January – April 2026",
        title: "Online Comment Toxicity Classification & Audit Pipeline",
        organization: "Kaggle Academic Competition & Research",
        category: "Engineering",
        summary: "I engineered a multi-class moderation pipeline for 200,000+ comments, added SHAP interpretability audits, and achieved 0.82 Macro-F1.",
        details: [
          "Constructed an end-to-end NLP classification pipeline processing a large-scale corpus of 200,000+ user comments.",
          "Classified multi-tiered linguistic severity across Neutral, Mild, Offensive, and Toxic categories.",
          "Conducted rigorous feature ablation studies and statistical significance tests across SGD, Ridge, and LinearSVC classifiers.",
          "Attained a peak Macro-F1 score of 0.82 with optimized regularized loss formulations.",
          "Integrated SHAP (SHapley Additive exPlanations) for global and local feature importance audits to detect lexical bias."
        ],
        tags: ["NLP", "SHAP", "Model Auditing", "Macro-F1 0.82", "LinearSVC"],
        link: {
          url: "https://github.com/Vaibhav-sa30",
          label: "GitHub Profile"
        }
      },
      {
        id: "independent-ai-safety-writing-2026",
        date: "2026",
        title: "Independent AI Safety Research: CoT Monitorability & Evaluation",
        organization: "Aicademia Research & Independent Publication",
        category: "Writing & Publications",
        summary: "I investigate whether internal chain-of-thought traces faithfully reveal agent reasoning, and I have published surveys on machine unlearning.",
        details: [
          "Conducted independent research investigations into Chain-of-Thought (CoT) monitorability, model controllability, scalable oversight, and mechanistic interpretability.",
          "Published the foundational research article 'CoT Monitorability and Controllability', critiquing whether hidden reasoning traces can be reliably exploited for safety monitoring.",
          "Authored exhaustive field guides: 'Everything Happening in Machine Unlearning As of May 2026' and 'Ground Up Understanding of Transformers'.",
          "Active participant in technical reading groups, mechanistic interpretability seminars, and safety community discussions."
        ],
        tags: ["CoT Monitorability", "Scalable Oversight", "Machine Unlearning", "Mechanistic Interpretability"],
        link: {
          url: "writings.html",
          label: "View Writings"
        }
      },
      {
        id: "responsible-mlops-niui-logger-2026",
        date: "2026",
        title: "NiuSy Neuro-Symbolic Library & Responsible AI MLOps Suite",
        organization: "Independent Open-Source Engineering",
        category: "Engineering",
        summary: "I developed a neuro-symbolic logic engine with verifiable proof traces, a fair MLOps pipeline using AIF360 and Fairlearn, and a local-first research logger.",
        details: [
          "NiuSy Neuro-Symbolic Library: Built a Python library combining neural perception with forward/backward chaining probabilistic logic, generating explainable proof traces for agent reasoning.",
          "Responsible AI MLOps Pipeline: Implemented AIF360 Reweighing and Fairlearn disparity gates to enforce Demographic Parity Difference < 0.05, tracking bias-accuracy Pareto frontiers in MLflow.",
          "Obsidian Research Logger: Created a local-first research pipeline leveraging on-device Gemma 2 to extract structured academic synthesis and cross-domain concept bridges without cloud telemetry.",
          "Agicademia Research Dispatch: Automated serverless curation engine filtering ArXiv and frontier lab publications via a Signal Quality Gate."
        ],
        tags: ["Neurosymbolic AI", "Fairlearn", "AIF360", "MLOps", "Gemma 2", "Local LLM"],
        link: {
          url: "https://github.com/Vaibhav-sa30",
          label: "View GitHub"
        }
      },
      {
        id: "responsible-ai-nptel-2026",
        date: "2026",
        title: "Responsible and Safe AI Certification — Top 5% Silver Elite",
        organization: "NPTEL & IIT Madras",
        category: "Fellowship & Certifications",
        summary: "I ranked in the top 5% of about 14,000 candidates with a score of 79%, covering fairness, transparency, differential privacy, and unlearning.",
        details: [
          "Completed rigorous NPTEL national certification examination in Responsible and Safe AI.",
          "Achieved final score of 79%, earning the prestigious Silver Certificate distinction.",
          "Ranked within the top 5% percentile nationwide among approximately 14,000 participating students and practitioners.",
          "Demonstrated competency in algorithmic fairness, differential privacy, robust optimization, and interpretability mechanisms."
        ],
        tags: ["NPTEL", "IIT Madras", "Silver Elite", "Top 5%", "Responsible AI"],
        link: {
          url: null,
          label: null
        }
      }
    ]
  },
  {
    year: "2025",
    milestones: [
      {
        id: "neuroreset-unlearning-2025",
        date: "August 2025",
        title: "Machine Unlearning: NeuroReset Paper Replication",
        organization: "Independent Research",
        category: "Research",
        summary: "I replicated and evaluated dual-phase LLM unlearning on OLMo-1B using LoRA, inverse-gradient optimization, and membership inference attacks.",
        details: [
          "Replicated and empirically verified the NeuroReset dual-phase LLM unlearning architecture.",
          "Conducted experiments on OLMo-1B parameter weights using Low-Rank Adaptation (LoRA).",
          "Implemented a Forget-versus-Retain optimization routine balancing targeted degradation against linguistic retention.",
          "Investigated Fisher Information matrix constraints to protect salient general knowledge circuits during inverse-gradient updates.",
          "Evaluated unlearning efficacy via Membership Inference Attacks (MIA) and benchmarked retention against MMLU."
        ],
        tags: ["NeuroReset", "OLMo-1B", "LoRA", "Membership Inference Attack", "MMLU"],
        link: {
          url: "research.html",
          label: "View in Research"
        }
      },
      {
        id: "founded-aicademia-2025",
        date: "2025 – Present",
        title: "Founded Aicademia & Technical Writing Portfolio",
        organization: "Aicademia Research Initiative & Substack",
        category: "Entrepreneurship",
        summary: "I founded an independent AI Safety initiative and a Substack for technical alignment essays that have reached 400,000+ readers.",
        details: [
          "Founded Aicademia with the mandate of bridging formal AI Safety theoretical alignment with concrete engineering implementations.",
          "Began developing open-source governance tools, transparent evaluation harnesses, and public-facing research communication.",
          "Launched Aicademia's technical writing series on Substack focusing on alignment theory, LLM jailbreaks, and scalable oversight.",
          "Authored landmark technical essays including 'That's Not What I Meant! | AI Alignment Problem' and 'Can LLM Jailbreaking Prove Lack of Alignment?'.",
          "Writing portfolio has accumulated an estimated potential reach of over 400,000 readers across technical platforms."
        ],
        tags: ["Aicademia", "AI Safety Venture", "Technical Writing", "Substack", "400k+ Readership"],
        link: {
          url: "writings.html",
          label: "Read Writings"
        }
      },
      {
        id: "operations-optimization-2025",
        date: "2025",
        title: "Operational Optimization in Industrial Supply Chains",
        organization: "Commercial Plywood & Interior Materials Enterprise",
        category: "Engineering",
        summary: "I identified 148% overstock in low-demand seasons and modeled a 90% reduction in reorder frequency using Welch’s ANOVA, Games-Howell, and EOQ.",
        details: [
          "Executed comprehensive real-world business analytics on procurement cycles, sales distributions, and credit exposures.",
          "Conducted statistical hypothesis testing using Welch's ANOVA and Games-Howell post-hoc tests to isolate demand seasonality.",
          "Performed autocorrelation analysis revealing severe bullwhip inefficiencies and a 148% overstock condition during seasonal troughs.",
          "Formulated an Economic Order Quantity (EOQ) replenishment schedule projecting a 90% reduction in purchase order transactions.",
          "Identified credit-risk concentration and capital lock-in patterns within informal B2B credit channels."
        ],
        tags: ["Supply Chain", "Welch's ANOVA", "EOQ Modeling", "Applied Statistics"],
        link: {
          url: null,
          label: null
        }
      },
      {
        id: "parking-management-app-2025",
        date: "2025",
        title: "Parking Management System (v1 Monolith → v2 SPA)",
        organization: "Modern Application Development Coursework",
        category: "Engineering",
        summary: "I evolved a monolithic Flask/Jinja application into a decoupled REST API and Vue.js single-page app backed by SQLAlchemy.",
        details: [
          "Engineered a full-featured multi-tenant parking reservation management application.",
          "Version 1: Built monolithic architecture using Flask, Jinja2 templating, and server-side session management.",
          "Version 2: Re-architected system into a decoupled service-oriented architecture featuring a Python RESTful backend and a responsive Vue.js SPA frontend.",
          "Implemented complex transactional reservation locking, real-time slot occupancy states, and role-based access control with SQLAlchemy and SQLite."
        ],
        tags: ["Flask", "Vue.js", "REST API", "SQLAlchemy", "Architecture Evolution"],
        link: {
          url: "https://github.com/Vaibhav-sa30",
          label: "View GitHub"
        }
      }
    ]
  },
  {
    year: "2024",
    milestones: [
      {
        id: "acm-summer-school-2024",
        date: "June 2024",
        title: "ACM Summer School on Responsible AI: Machine Unlearning Project Lead",
        organization: "ACM India & IIT Madras",
        category: "Research",
        summary: "I led a team replicating the Incompetent Teacher unlearning method across ResNet and CoAtNet on CIFAR-10.",
        details: [
          "Selected for the competitive ACM Summer School on Responsible AI hosted at IIT Madras, marking the foundational transition into AI Safety.",
          "Appointed Project Lead for the Machine Unlearning team replicating the 'Incompetent Teacher' negative-gradient paradigm.",
          "Synthesized negative gradient learning signals to surgically excise sensitive training subsets while preventing catastrophic collapse.",
          "Benchmarked forgetting kinetics and classification retention across ResNet and CoAtNet hybrid vision transformers using CIFAR-10.",
          "Delivered oral research presentation defending replication findings before faculty and senior research scientists."
        ],
        tags: ["Machine Unlearning", "ACM Summer School", "Incompetent Teacher", "ResNet", "CoAtNet", "CIFAR-10"],
        link: {
          url: "machine-unlearning.html",
          label: "Read Dedicated Essay"
        }
      }
    ]
  },
  {
    year: "2022",
    milestones: [
      {
        id: "iit-madras-ds-2022",
        date: "2022 – Present",
        title: "BS in Data Science and Applications",
        organization: "Indian Institute of Technology Madras",
        category: "Education",
        summary: "At IIT Madras, I am building a foundation in modern computation, algorithmic mathematics, machine learning theory, and data architecture.",
        details: [
          "Commenced rigorous undergraduate degree in Data Science and Applications at IIT Madras.",
          "Completed advanced coursework spanning Linear Algebra, Probability, Machine Learning Foundations, Deep Learning, Database Systems, and Application Development.",
          "Applied statistical principles to empirical model benchmarking, safety evaluations, and software design across multiple academic terms."
        ],
        tags: ["IIT Madras", "Data Science", "Machine Learning", "Mathematics", "Ongoing"],
        link: {
          url: null,
          label: null
        }
      }
    ]
  },
  {
    year: "2021",
    milestones: [
      {
        id: "amu-bsc-stats-2021",
        date: "2021 – 2023",
        title: "BSc Statistics (Honours) — Quantitative Foundations",
        organization: "Aligarh Muslim University",
        category: "Education",
        summary: "I built a strong academic foundation in mathematical analysis, probability theory, statistical inference, and quantitative methods.",
        details: [
          "Enrolled in BSc Statistics (Honours) developing mathematical and quantitative foundations.",
          "Undertook intensive coursework in Real Analysis, Differential and Integral Calculus, Probability Theory, Descriptive and Inferential Statistics, and Hypothesis Testing.",
          "Formed the theoretical and probabilistic bedrock underpinning later research in mechanistic interpretability and probabilistic reasoning."
        ],
        tags: ["Statistics Honours", "Probability Theory", "Calculus", "Quantitative Foundations"],
        link: {
          url: null,
          label: null
        }
      }
    ]
  }
];

// Helper to render timeline component dynamically into DOM
function initJourneyTimeline() {
  const container = document.getElementById("journey-timeline-container");
  if (!container) return;

  const totalMilestones = TIMELINE_DATA.reduce((acc, y) => acc + y.milestones.length, 0);

  let html = `
    <div class="timeline-wrapper">
      <div class="timeline-intro-block">
        <h2 class="timeline-section-title">Research Timeline</h2>
        
        <!-- Controls: Category Filter & Expand/Collapse All -->
        <div class="timeline-controls" role="toolbar" aria-label="Timeline Filters and Controls">
          <div class="timeline-filters" id="timeline-filters">
            <button class="filter-chip active" data-category="all" aria-pressed="true">All (${totalMilestones})</button>
            <button class="filter-chip" data-category="Research" aria-pressed="false">Research</button>
            <button class="filter-chip" data-category="Engineering" aria-pressed="false">Engineering</button>
            <button class="filter-chip" data-category="Education" aria-pressed="false">Education</button>
            <button class="filter-chip" data-category="Fellowship & Certifications" aria-pressed="false">Fellowship & Certifications</button>
            <button class="filter-chip" data-category="Internship & Leadership" aria-pressed="false">Internship & Leadership</button>
            <button class="filter-chip" data-category="Writing & Publications" aria-pressed="false">Writing & Publications</button>
            <button class="filter-chip" data-category="Entrepreneurship" aria-pressed="false">Entrepreneurship</button>
            <button class="filter-chip" data-category="Community & Talks" aria-pressed="false">Community & Talks</button>
          </div>
          
          <div class="timeline-toggle-tools">
            <button class="timeline-expand-all-btn" id="timeline-expand-all" aria-expanded="false">
              <span class="expand-icon" aria-hidden="true">+</span> Expand All Details
            </button>
          </div>
        </div>
      </div>

      <!-- Vertical Timeline Track -->
      <div class="timeline-track" id="timeline-track">
  `;

  TIMELINE_DATA.forEach((yearGroup) => {
    const isProminentYear = yearGroup.year === "2026";
    html += `
      <section class="timeline-year-group ${isProminentYear ? 'prominent-year' : ''}" data-year="${yearGroup.year}" aria-label="Year ${yearGroup.year}">
        <div class="year-marker-wrapper">
          <div class="year-marker" aria-hidden="true">
            <span class="year-num">${yearGroup.year}</span>
            ${isProminentYear ? '<span class="year-tag">Independent AI Safety Research</span>' : ''}
          </div>
        </div>
        
        <div class="year-milestones">
    `;

    yearGroup.milestones.forEach((item) => {
      const isUpcoming = item.badge === "upcoming";
      const hasDetails = item.details && item.details.length > 0;
      html += `
        <article class="milestone-card ${isUpcoming ? 'is-upcoming' : ''}" 
                 data-category="${item.category}" 
                 id="${item.id}">
          <div class="milestone-spine-node" aria-hidden="true">
            <span class="node-dot"></span>
          </div>
          
          <div class="milestone-card-inner">
            <header class="milestone-header">
              <div class="milestone-meta">
                <span class="milestone-date">${item.date}</span>
              </div>
              <h3 class="milestone-title">${item.title}</h3>
              <div class="milestone-org">${item.organization}</div>
            </header>

            <div class="milestone-body">
              <p class="milestone-summary">${item.summary}</p>
            </div>

            ${hasDetails ? `
              <div class="milestone-expandable" id="details-${item.id}" hidden>
                <div class="milestone-details-inner">
                  <h4 class="details-heading">Key Technical Work &amp; Outcomes</h4>
                  <ul class="milestone-details-list">
                    ${item.details.map(d => `<li>${d}</li>`).join('')}
                  </ul>
                </div>
              </div>
            ` : ''}

            <footer class="milestone-footer">
              <div class="milestone-tags" aria-label="Topic tags">
                ${item.tags.map(t => `<span class="milestone-tag">${t}</span>`).join('')}
              </div>
              
              <div class="milestone-actions">
                ${hasDetails ? `
                  <button class="milestone-toggle-btn" 
                          aria-expanded="false" 
                          aria-controls="details-${item.id}"
                          data-target="details-${item.id}">
                    <span class="toggle-text">Details</span>
                    <svg class="toggle-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                ` : ''}
                
                ${item.link && item.link.url ? `
                  <a href="${item.link.url}" 
                     class="milestone-external-link" 
                     ${item.link.url.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''}>
                    ${item.link.label}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </a>
                ` : ''}
              </div>
            </footer>
          </div>
        </article>
      `;
    });

    html += `
        </div>
      </section>
    `;
  });

  html += `
      </div> <!-- /timeline-track -->
    </div> <!-- /timeline-wrapper -->
  `;

  container.innerHTML = html;
  bindTimelineInteractions();
}

function bindTimelineInteractions() {
  // 1. Expand / Collapse individual cards
  const toggleButtons = document.querySelectorAll(".milestone-toggle-btn");
  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      const isExpanded = btn.getAttribute("aria-expanded") === "true";
      if (isExpanded) {
        targetEl.hidden = true;
        btn.setAttribute("aria-expanded", "false");
        btn.querySelector(".toggle-text").textContent = "Details";
        btn.classList.remove("active");
      } else {
        targetEl.hidden = false;
        btn.setAttribute("aria-expanded", "true");
        btn.querySelector(".toggle-text").textContent = "Hide Details";
        btn.classList.add("active");
      }
    });
  });

  // 2. Expand All / Collapse All Toggle
  const expandAllBtn = document.getElementById("timeline-expand-all");
  if (expandAllBtn) {
    expandAllBtn.addEventListener("click", () => {
      const isAllExpanded = expandAllBtn.getAttribute("aria-expanded") === "true";
      const newExpandedState = !isAllExpanded;

      expandAllBtn.setAttribute("aria-expanded", newExpandedState.toString());
      expandAllBtn.innerHTML = newExpandedState 
        ? `<span class="expand-icon" aria-hidden="true">−</span> Collapse All Details`
        : `<span class="expand-icon" aria-hidden="true">+</span> Expand All Details`;

      toggleButtons.forEach((btn) => {
        const targetId = btn.getAttribute("data-target");
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.hidden = !newExpandedState;
          btn.setAttribute("aria-expanded", newExpandedState.toString());
          btn.querySelector(".toggle-text").textContent = newExpandedState ? "Hide Details" : "Details";
          if (newExpandedState) {
            btn.classList.add("active");
          } else {
            btn.classList.remove("active");
          }
        }
      });
    });
  }

  // 3. Category Filter Chips
  const filterChips = document.querySelectorAll(".filter-chip");
  const cards = document.querySelectorAll(".milestone-card");
  const yearGroups = document.querySelectorAll(".timeline-year-group");

  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const category = chip.getAttribute("data-category");

      filterChips.forEach((c) => {
        c.classList.remove("active");
        c.setAttribute("aria-pressed", "false");
      });
      chip.classList.add("active");
      chip.setAttribute("aria-pressed", "true");

      cards.forEach((card) => {
        const cardCat = card.getAttribute("data-category");
        if (category === "all" || cardCat === category) {
          card.classList.remove("filtered-out");
        } else {
          card.classList.add("filtered-out");
        }
      });

      // Update visibility of year groups if no visible milestones inside
      yearGroups.forEach((yearGroup) => {
        const visibleCards = yearGroup.querySelectorAll(".milestone-card:not(.filtered-out)");
        if (visibleCards.length === 0) {
          yearGroup.classList.add("year-hidden");
        } else {
          yearGroup.classList.remove("year-hidden");
        }
      });
    });
  });

  // 4. Subtle entrance animation observer
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px"
    });

    cards.forEach((card) => {
      observer.observe(card);
    });
  } else {
    cards.forEach((card) => card.classList.add("in-view"));
  }
}

// Auto-run on DOMContentLoaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initJourneyTimeline);
} else {
  initJourneyTimeline();
}
