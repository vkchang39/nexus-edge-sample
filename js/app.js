/**
 * Nexus EDGE - Enterprise IT Consulting & IT Services
 * Complete Advanced Interactive Feature Suite
 */

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.setAttribute('data-theme', 'dark');
  initRouter();
  initHeader();
  initScrollProgress();
  initHeroParticles();
  initOdometerCounters();
  initCurrencySwitcher();
  initCostEstimator();
  initTechExplorer();
  initDeliveryMap();
  initArchitectureBlueprint();
  initSalaryCalculator();
  initVelocityQuiz();
  initCalendarSlotPicker();
  initFaqAccordions();
  initCaseStudyFilters();
  initCareerFilters();
  initBlogFilters();
  initModals();
  initForms();
  initFileUpload();
  initCertModals();
  initServicesCarousel();
  initAppinventivIndustryFilter();
  initHorizontalProcessTrack();
  registerServiceWorker();
});

/* ==========================================================================
   PWA Service Worker Registration
   ========================================================================== */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('Nexus EDGE Service Worker active'))
      .catch((err) => console.log('SW registration note:', err));
  }
}



/* ==========================================================================
   Top Scroll Progress Bar
   ========================================================================== */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress-bar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${progress}%`;
  });
}

/* ==========================================================================
   Interactive Hero Neural / Particle Canvas
   ========================================================================== */
function initHeroParticles() {
  const canvas = document.getElementById('hero-particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = canvas.parentElement.offsetWidth);
  let height = (canvas.height = canvas.parentElement.offsetHeight);

  window.addEventListener('resize', () => {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  });

  const particles = [];
  const particleCount = Math.min(width > 768 ? 45 : 20, 50);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1.2
    });
  }

  let mouse = { x: -1000, y: -1000 };
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  let isHeroVisible = true;
  const heroSection = document.querySelector('.hero-section');
  if (heroSection && 'IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver((entries) => {
      isHeroVisible = entries[0].isIntersecting;
      if (isHeroVisible) {
        requestAnimationFrame(render);
      }
    }, { threshold: 0.05 });
    heroObserver.observe(heroSection);
  }

  function render() {
    if (!isHeroVisible) return;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Mouse attraction
      const dxm = mouse.x - p.x;
      const dym = mouse.y - p.y;
      const distMouse = Math.sqrt(dxm * dxm + dym * dym);
      if (distMouse < 120) {
        p.x += (mouse.x - p.x) * 0.01;
        p.y += (mouse.y - p.y) * 0.01;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 200, 83, 0.4)';
      ctx.fill();

      // Connect near particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 200, 83, ${0.25 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    if (isHeroVisible) {
      requestAnimationFrame(render);
    }
  }

  render();
}

/* ==========================================================================
   Animated Number Counters (Odometer Effect)
   ========================================================================== */
function initOdometerCounters() {
  const statElements = document.querySelectorAll('.stat-counter');
  if (!statElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        let current = 0;
        const step = Math.max(1, Math.floor(target / 40));
        
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = `${target.toLocaleString()}${suffix}`;
            clearInterval(timer);
          } else {
            el.textContent = `${current.toLocaleString()}${suffix}`;
          }
        }, 30);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  statElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   Multi-Currency Switcher (INR / USD / EUR / GBP)
   ========================================================================== */
let currentCurrency = 'INR';
const currencyRates = {
  INR: { symbol: '₹', mult: 1, suffix: 'L' },
  USD: { symbol: '$', mult: 0.012, suffix: 'k' },
  EUR: { symbol: '€', mult: 0.011, suffix: 'k' },
  GBP: { symbol: '£', mult: 0.0095, suffix: 'k' }
};

function initCurrencySwitcher() {
  const selector = document.getElementById('global-currency-select');
  if (!selector) return;

  selector.addEventListener('change', (e) => {
    currentCurrency = e.target.value;
    updateSalaryEstimates();
    showToast(`Currency updated to ${currentCurrency}`);
  });
}

/* ==========================================================================
   Single Page Application Routing
   ========================================================================== */
const routes = ['home', 'about', 'services', 'industries', 'why-us', 'process', 'case-studies', 'careers', 'blog', 'contact'];

function initRouter() {
  document.querySelectorAll('[data-route]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const targetRoute = el.getAttribute('data-route');
      navigateTo(targetRoute);
      closeMobileDrawer();
    });
  });

  window.addEventListener('popstate', () => {
    const hash = window.location.hash.replace('#', '') || 'home';
    if (routes.includes(hash)) {
      showPage(hash, false);
    } else {
      showPage('home', false);
    }
  });

  const initialHash = window.location.hash.replace('#', '') || 'home';
  if (routes.includes(initialHash)) {
    showPage(initialHash, false);
  } else {
    showPage('home', false);
  }
}

function navigateTo(routeName) {
  const isHomeActive = document.getElementById('page-home') && document.getElementById('page-home').classList.contains('active');
  
  if (routeName === 'process' && isHomeActive) {
    const homeProcess = document.getElementById('process-section');
    if (homeProcess) {
      homeProcess.scrollIntoView({ behavior: 'smooth' });
      return;
    }
  }
  if (routeName === 'about' && isHomeActive) {
    const homeAbout = document.getElementById('home-about');
    if (homeAbout) {
      homeAbout.scrollIntoView({ behavior: 'smooth' });
      return;
    }
  }
  
  if (!routes.includes(routeName)) routeName = 'home';
  window.location.hash = routeName === 'home' ? '' : `#${routeName}`;
  showPage(routeName, true);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showPage(routeName, updateNav = true) {
  document.querySelectorAll('.page-section').forEach(sec => {
    sec.classList.remove('active');
  });

  const targetSection = document.getElementById(`page-${routeName}`);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  if (updateNav) {
    document.querySelectorAll('.nav-link, .drawer-link').forEach(link => {
      if (link.getAttribute('data-route') === routeName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  const titles = {
    'home': 'Nexus EDGE | IT Consulting & IT Services',
    'about': 'About Us | Nexus EDGE',
    'services': 'Consulting & IT Services | Nexus EDGE',
    'industries': 'Industries & Verticals | Nexus EDGE',
    'why-us': 'Why Choose Us | Nexus EDGE',
    'process': 'Our Structured Process | Nexus EDGE',
    'case-studies': 'Client Success Stories | Nexus EDGE',
    'careers': 'Join Our Team | Careers at Nexus EDGE',
    'blog': 'Insights & Perspectives | Nexus EDGE',
    'contact': 'Contact & Consultation | Nexus EDGE'
  };
  document.title = titles[routeName] || 'Nexus EDGE | IT Consulting & Services';
}

/* ==========================================================================
   Header & Mobile Drawer
   ========================================================================== */
function initHeader() {
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  const menuToggle = document.getElementById('menu-toggle');
  const drawerClose = document.getElementById('drawer-close');
  const backdrop = document.getElementById('drawer-backdrop');

  if (menuToggle) menuToggle.addEventListener('click', openMobileDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeMobileDrawer);
  if (backdrop) backdrop.addEventListener('click', closeMobileDrawer);
}

function openMobileDrawer() {
  document.getElementById('mobile-drawer')?.classList.add('open');
  document.getElementById('drawer-backdrop')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileDrawer() {
  document.getElementById('mobile-drawer')?.classList.remove('open');
  document.getElementById('drawer-backdrop')?.classList.remove('open');
  document.body.style.overflow = '';
}



/* ==========================================================================
   Interactive Cost / Hiring Estimator
   ========================================================================== */
function initCostEstimator() {
  let selectedService = 'staffing';
  let selectedLevel = 'senior';
  let teamSize = 3;

  const serviceBtns = document.querySelectorAll('.est-service-btn');
  const levelBtns = document.querySelectorAll('.est-level-btn');
  const slider = document.getElementById('est-team-slider');
  const sliderVal = document.getElementById('est-slider-val');

  const outTurnaround = document.getElementById('est-out-turnaround');
  const outEngineers = document.getElementById('est-out-engineers');
  const outModel = document.getElementById('est-out-model');
  const estQuoteBtn = document.getElementById('est-quote-trigger');

  function calculateEstimates() {
    if (sliderVal) sliderVal.textContent = `${teamSize} ${teamSize === 1 ? 'Role' : 'Roles'}`;
    if (outEngineers) outEngineers.textContent = `${teamSize} ${selectedLevel.toUpperCase()} Specialists`;

    if (selectedService === 'staffing') {
      if (outTurnaround) outTurnaround.textContent = teamSize <= 2 ? '7 - 10 Days' : '12 - 16 Days';
      if (outModel) outModel.textContent = 'Dedicated Staff Augmentation';
    } else if (selectedService === 'turnkey') {
      if (outTurnaround) outTurnaround.textContent = '2-Week Agile Sprints';
      if (outModel) outModel.textContent = 'Turnkey Autonomous Pod';
    } else if (selectedService === 'executive') {
      if (outTurnaround) outTurnaround.textContent = '14 - 21 Days';
      if (outModel) outModel.textContent = 'Confidential CXO Search';
    } else {
      if (outTurnaround) outTurnaround.textContent = '10 - 14 Days';
      if (outModel) outModel.textContent = 'Enterprise RPO Program';
    }
  }

  serviceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      serviceBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedService = btn.getAttribute('data-service');
      calculateEstimates();
    });
  });

  levelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      levelBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedLevel = btn.getAttribute('data-level');
      calculateEstimates();
    });
  });

  if (slider) {
    slider.addEventListener('input', (e) => {
      teamSize = parseInt(e.target.value, 10);
      calculateEstimates();
    });
  }

  if (estQuoteBtn) {
    estQuoteBtn.addEventListener('click', () => {
      openModal('consultation-modal');
    });
  }

  calculateEstimates();
}

/* ==========================================================================
   Interactive Architecture Blueprint Builder
   ========================================================================== */
function initArchitectureBlueprint() {
  let fe = 'Next.js 15 (React)';
  let be = 'Golang Microservices';
  let broker = 'Apache Kafka';
  let cloud = 'AWS EKS (Kubernetes)';
  let db = 'PostgreSQL Cluster';

  const bpFeBtns = document.querySelectorAll('.bp-fe-btn');
  const bpBeBtns = document.querySelectorAll('.bp-be-btn');
  const bpBrokerBtns = document.querySelectorAll('.bp-broker-btn');
  const bpCloudBtns = document.querySelectorAll('.bp-cloud-btn');

  const nodeFe = document.getElementById('bp-node-fe');
  const nodeBe = document.getElementById('bp-node-be');
  const nodeBroker = document.getElementById('bp-node-broker');
  const nodeCloud = document.getElementById('bp-node-cloud');
  const nodeDb = document.getElementById('bp-node-db');

  function updateBlueprint() {
    if (nodeFe) nodeFe.textContent = fe;
    if (nodeBe) nodeBe.textContent = be;
    if (nodeBroker) nodeBroker.textContent = broker;
    if (nodeCloud) nodeCloud.textContent = cloud;
    if (nodeDb) nodeDb.textContent = db;
  }

  bpFeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      bpFeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      fe = btn.getAttribute('data-val');
      updateBlueprint();
    });
  });

  bpBeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      bpBeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      be = btn.getAttribute('data-val');
      updateBlueprint();
    });
  });

  bpBrokerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      bpBrokerBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      broker = btn.getAttribute('data-val');
      updateBlueprint();
    });
  });

  bpCloudBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      bpCloudBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      cloud = btn.getAttribute('data-val');
      updateBlueprint();
    });
  });

  updateBlueprint();
}

/* ==========================================================================
   2026 Salary Benchmark Tool
   ========================================================================== */
function initSalaryCalculator() {
  const roleSelect = document.getElementById('sal-role-select');
  const expSelect = document.getElementById('sal-exp-select');
  const citySelect = document.getElementById('sal-city-select');

  const outMin = document.getElementById('sal-out-min');
  const outMedian = document.getElementById('sal-out-median');
  const outMax = document.getElementById('sal-out-max');

  if (!roleSelect) return;

  function updateSalary() {
    const role = roleSelect.value;
    const exp = parseInt(expSelect.value, 10);
    const cityMult = parseFloat(citySelect.value);

    let baseInr = 18;
    if (role === 'golang') baseInr = 24;
    else if (role === 'devops') baseInr = 26;
    else if (role === 'ai') baseInr = 30;
    else if (role === 'architect') baseInr = 36;
    else if (role === 'react') baseInr = 20;

    const expMult = 1 + (exp - 3) * 0.15;
    const finalInr = baseInr * expMult * cityMult;

    const minInr = (finalInr * 0.85).toFixed(1);
    const medInr = finalInr.toFixed(1);
    const maxInr = (finalInr * 1.2).toFixed(1);

    const r = currencyRates[currentCurrency];
    if (currentCurrency === 'INR') {
      outMin.textContent = `₹${minInr} L`;
      outMedian.textContent = `₹${medInr} L`;
      outMax.textContent = `₹${maxInr} L`;
    } else {
      const minForeign = (minInr * 100000 * r.mult / 1000).toFixed(0);
      const medForeign = (medInr * 100000 * r.mult / 1000).toFixed(0);
      const maxForeign = (maxInr * 100000 * r.mult / 1000).toFixed(0);
      outMin.textContent = `${r.symbol}${minForeign}k`;
      outMedian.textContent = `${r.symbol}${medForeign}k`;
      outMax.textContent = `${r.symbol}${maxForeign}k`;
    }
  }

  window.updateSalaryEstimates = updateSalary;

  roleSelect.addEventListener('change', updateSalary);
  expSelect.addEventListener('change', updateSalary);
  citySelect.addEventListener('change', updateSalary);

  updateSalary();
}

/* ==========================================================================
   Engineering Velocity & Tech Debt Audit Quiz
   ========================================================================== */
function initVelocityQuiz() {
  const quizSteps = [
    {
      q: 'How frequently does your engineering team deploy code to production?',
      options: [
        { text: 'Multiple times daily / continuous CI/CD', score: 20 },
        { text: 'Once every 2-week sprint', score: 14 },
        { text: 'Monthly with manual QA cycles', score: 8 },
        { text: 'Quarterly with extensive downtime', score: 3 }
      ]
    },
    {
      q: 'What is your current average time-to-hire for Senior Software Engineers?',
      options: [
        { text: 'Under 14 days with high conversion', score: 20 },
        { text: '15 to 30 days', score: 15 },
        { text: '30 to 60 days', score: 8 },
        { text: 'Over 60 days with frequent dropouts', score: 2 }
      ]
    },
    {
      q: 'What architectural state is your core application currently in?',
      options: [
        { text: 'Cloud-native Kubernetes microservices', score: 20 },
        { text: 'Decoupled services with some shared databases', score: 14 },
        { text: 'Monolith with growing latency and technical debt', score: 8 },
        { text: 'Legacy monolith prone to frequent outages', score: 2 }
      ]
    },
    {
      q: 'How are your automated test coverage and security pipelines configured?',
      options: [
        { text: '80%+ automated coverage with automated security SAST/DAST', score: 20 },
        { text: 'Unit tests present, manual QA regression testing', score: 14 },
        { text: 'Minimal automated tests, mostly manual verification', score: 7 },
        { text: 'No automated tests in production pipelines', score: 2 }
      ]
    },
    {
      q: 'How do you currently handle unexpected engineering bandwidth demands?',
      options: [
        { text: 'Strategic partner supplying pre-vetted senior squads in 7 days', score: 20 },
        { text: 'Staffing agencies with lengthy vetting turnaround', score: 12 },
        { text: 'Slow internal hiring resulting in delayed product milestones', score: 6 },
        { text: 'Overworking internal staff with mounting attrition risk', score: 2 }
      ]
    }
  ];

  let currentStep = 0;
  let totalScore = 0;

  const qTitle = document.getElementById('quiz-q-title');
  const qOptionsContainer = document.getElementById('quiz-options-container');
  const qStepIndicator = document.getElementById('quiz-step-indicator');
  const qResultBox = document.getElementById('quiz-result-box');
  const qCardBody = document.getElementById('quiz-card-body');

  if (!qTitle) return;

  function renderQuestion() {
    if (currentStep >= quizSteps.length) {
      renderQuizResult();
      return;
    }

    const currentQ = quizSteps[currentStep];
    qStepIndicator.textContent = `Question ${currentStep + 1} of ${quizSteps.length}`;
    qTitle.textContent = currentQ.q;

    qOptionsContainer.innerHTML = currentQ.options.map(opt => `
      <button class="quiz-option-btn" onclick="selectQuizOption(${opt.score})">
        <span>${opt.text}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    `).join('');
  }

  window.selectQuizOption = (score) => {
    totalScore += score;
    currentStep++;
    renderQuestion();
  };

  function renderQuizResult() {
    qCardBody.style.display = 'none';
    qResultBox.style.display = 'block';

    let tier = 'High Velocity';
    let recommendation = 'Your engineering operations are strong. Focus on AI-agent workflows and selective executive leadership search.';
    if (totalScore < 50) {
      tier = 'High Tech Debt & Bottleneck Alert';
      recommendation = 'Your team is burdened by slow hiring cycles and legacy technical debt. We recommend deploying a Dedicated Nexus Modernization Pod to decouple monoliths and automate CI/CD.';
    } else if (totalScore < 80) {
      tier = 'Moderate Velocity with Scaling Gaps';
      recommendation = 'You have good foundational practices, but hiring latency and partial monolith architectures are slowing releases. Nexus Staff Augmentation can boost velocity by 45%.';
    }

    qResultBox.innerHTML = `
      <div class="badge" style="margin-bottom: 0.75rem;"><span class="badge-dot"></span> Audit Complete</div>
      <h3 style="font-size: 1.8rem; margin-bottom: 0.5rem;">Diagnostic Score: <span style="color: var(--brand-green-500);">${totalScore}/100</span></h3>
      <div style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 1rem;">Status: ${tier}</div>
      <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 2rem;">${recommendation}</p>
      
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <button class="btn btn-primary" onclick="openModal('consultation-modal');">Schedule Free 30-Min Architecture Audit</button>
        <button class="btn btn-outline" onclick="resetQuiz();">Retake Quiz</button>
      </div>
    `;
  }

  window.resetQuiz = () => {
    currentStep = 0;
    totalScore = 0;
    qCardBody.style.display = 'block';
    qResultBox.style.display = 'none';
    renderQuestion();
  };

  renderQuestion();
}

/* ==========================================================================
   Interactive Calendar Slot Picker in Consultation Modal
   ========================================================================== */
function initCalendarSlotPicker() {
  const slotBtns = document.querySelectorAll('.slot-btn');
  slotBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      slotBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}



/* ==========================================================================
   Interactive Tech Capability Explorer
   ========================================================================== */
const techStackItems = [
  { name: 'React / Next.js', layer: 'frontend', desc: 'SSR, Micro-frontends & App Router' },
  { name: 'TypeScript', layer: 'frontend', desc: 'End-to-end Strict Type Safety' },
  { name: 'Vue.js / Nuxt', layer: 'frontend', desc: 'Reactive Component Architectures' },
  { name: 'Tailwind CSS', layer: 'frontend', desc: 'Design Token Systems' },

  { name: 'Node.js / Express', layer: 'backend', desc: 'High-Concurrency Event Loops' },
  { name: 'Golang', layer: 'backend', desc: 'High-Throughput Microservices' },
  { name: 'Python / FastAPI', layer: 'backend', desc: 'Async APIs & ML Service Pipelines' },
  { name: 'Java / Spring Boot', layer: 'backend', desc: 'Enterprise Grade Banking Ledgers' },

  { name: 'Flutter', layer: 'mobile', desc: 'Cross-Platform 60fps Native Apps' },
  { name: 'React Native', layer: 'mobile', desc: 'Unified iOS & Android Codebase' },
  { name: 'Swift / SwiftUI', layer: 'mobile', desc: 'High-Performance Apple Ecosystem' },
  { name: 'Kotlin / Jetpack', layer: 'mobile', desc: 'Modern Android Native Solutions' },

  { name: 'Kubernetes & EKS', layer: 'cloud', desc: 'Container Orchestration & Scaling' },
  { name: 'AWS Cloud Architecture', layer: 'cloud', desc: 'Serverless, RDS, Lambda, S3' },
  { name: 'Terraform & IaC', layer: 'cloud', desc: 'Immutable Infrastructure Pipelines' },
  { name: 'Docker & CI/CD', layer: 'cloud', desc: 'Automated GitHub Actions/GitLab' },

  { name: 'PostgreSQL', layer: 'database', desc: 'ACID Relational Distributed Clusters' },
  { name: 'Apache Kafka', layer: 'database', desc: 'Real-Time Event Stream Broker' },
  { name: 'Redis Enterprise', layer: 'database', desc: 'Sub-Millisecond In-Memory Cache' },
  { name: 'MongoDB / DynamoDB', layer: 'database', desc: 'High-Velocity NoSQL Stores' },

  { name: 'OpenAI & Gemini API', layer: 'ai', desc: 'LLM Multi-Agent System Integrations' },
  { name: 'LangChain & LlamaIndex', layer: 'ai', desc: 'Enterprise RAG & Document Retrieval' },
  { name: 'PyTorch & TensorFlow', layer: 'ai', desc: 'Computer Vision & Predictive Models' },
  { name: 'Vector DBs (Pinecone)', layer: 'ai', desc: 'Semantic Search Embeddings' }
];

function initTechExplorer() {
  const tabBtns = document.querySelectorAll('.tech-tab-btn');
  const container = document.getElementById('tech-grid-container');

  if (!container) return;

  function renderTech(layer) {
    const filtered = layer === 'all' ? techStackItems : techStackItems.filter(t => t.layer === layer);
    container.innerHTML = filtered.map(item => `
      <div class="tech-card">
        <div class="tech-icon-box">&lt;/&gt;</div>
        <div class="tech-info">
          <div class="t-name">${item.name}</div>
          <div class="t-desc">${item.desc}</div>
        </div>
      </div>
    `).join('');
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTech(btn.getAttribute('data-tech-layer'));
    });
  });

  renderTech('all');
}

/* ==========================================================================
   Interactive Delivery Hubs Map
   ========================================================================== */
const deliveryHubs = {
  mumbai: {
    city: 'Mumbai (Corporate HQ)',
    address: 'Level 12, Nexus Tower, Bandra Kurla Complex (BKC), Mumbai - 400051',
    strength: '120+ Consultants & Senior Architects',
    specialty: 'Executive Search, FinTech Practice & Board Advisory',
    phone: '+91 22 6789 0123'
  },
  bangalore: {
    city: 'Bengaluru Delivery Hub',
    address: '5th Floor, Cyber Park, Electronic City Phase 1, Bengaluru - 560100',
    strength: '250+ Engineers & Tech Recruiters',
    specialty: 'Full-Stack Software Engineering, SaaS & Cloud Pods',
    phone: '+91 80 4123 4567'
  },
  hyderabad: {
    city: 'Hyderabad Technology Center',
    address: 'Tower B, HITEC City, Madhapur, Hyderabad - 500081',
    strength: '140+ Cloud & DevOps Architects',
    specialty: 'Kubernetes, Cloud Modernization & Data Engineering',
    phone: '+91 40 6789 1122'
  },
  pune: {
    city: 'Pune Engineering Facility',
    address: '4th Floor, Tech Centre, Hinjewadi Phase 1, Pune - 411057',
    strength: '95+ QA Automation & Systems Engineers',
    specialty: 'Enterprise QA Automation, Automotive & Embedded Tech',
    phone: '+91 20 2789 3344'
  },
  gurugram: {
    city: 'Gurugram (NCR) Regional Office',
    address: 'Building 10, DLF Cyber City, Phase II, Gurugram - 122002',
    strength: '80+ Enterprise Account Directors',
    specialty: 'BFSI Leadership, E-Commerce & Retail Staffing',
    phone: '+91 124 456 7890'
  }
};

function initDeliveryMap() {
  const pins = document.querySelectorAll('.map-pin');
  const detailsBox = document.getElementById('hub-details-content');

  function selectHub(hubKey) {
    pins.forEach(p => {
      if (p.getAttribute('data-hub') === hubKey) p.classList.add('active');
      else p.classList.remove('active');
    });

    const data = deliveryHubs[hubKey];
    if (!data || !detailsBox) return;

    detailsBox.innerHTML = `
      <div class="badge" style="margin-bottom: 0.75rem;"><span class="badge-dot"></span> Active Delivery Hub</div>
      <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--text-primary);">${data.city}</h3>
      <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.25rem;">${data.address}</p>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.5rem;">
        <div style="background: var(--bg-surface); padding: 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.7rem; color: var(--text-muted); font-weight: 600;">STAFFING STRENGTH</div>
          <div style="font-weight: 700; font-size: 0.95rem; color: var(--brand-green-500); margin-top: 0.2rem;">${data.strength}</div>
        </div>
        <div style="background: var(--bg-surface); padding: 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.7rem; color: var(--text-muted); font-weight: 600;">DIRECT PHONE</div>
          <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary); margin-top: 0.2rem;">${data.phone}</div>
        </div>
      </div>
      
      <div style="font-size: 0.85rem; color: var(--text-secondary);">
        <strong>Core Practice:</strong> ${data.specialty}
      </div>
    `;

    detailsBox.classList.add('highlight');
    setTimeout(() => detailsBox.classList.remove('highlight'), 300);
  }

  pins.forEach(pin => {
    pin.addEventListener('click', () => {
      selectHub(pin.getAttribute('data-hub'));
    });
  });

  selectHub('mumbai');
}

/* ==========================================================================
   FAQ Accordions
   ========================================================================== */
function initFaqAccordions() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isActive = item.classList.contains('active');
      
      item.parentElement.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   Filterable Case Studies
   ========================================================================== */
const caseStudiesData = [
  {
    id: 'paystream',
    client: 'PayStream Technologies',
    category: 'fintech',
    title: 'Scaling a FinTech Engineering Team from 50 to 200',
    metrics: [
      { label: 'Time-to-Hire', val: '-42%' },
      { label: 'Engineers Placed', val: '150+' },
      { label: '1-Yr Retention', val: '98%' }
    ],
    summary: 'A high-growth digital payments unicorn needed to triple their engineering, security, and product squads in 6 months for NPCI and international expansion.',
    challenge: 'Stringent compliance benchmarks, scarce niche Golang/React Native engineers, and fierce talent competition in Bangalore.',
    solution: 'Deployed a dedicated 6-member recruiter pod with deep payments domain knowledge, introduced automated coding assessments, and built an exclusive pre-vetted candidate pipeline.',
    impact: 'Successfully closed 150+ senior technical roles within 16 weeks with a 98% 12-month retention rate and zero compliance escalations.'
  },
  {
    id: 'cloudscale',
    client: 'CloudScale Logistics',
    category: 'saas',
    title: 'Microservices & Real-Time Tracking Cloud Rebuild',
    metrics: [
      { label: 'Throughput', val: '4.2x' },
      { label: 'Cloud Cost', val: '-35%' },
      { label: 'Uptime', val: '99.99%' }
    ],
    summary: 'End-to-end modernization of a legacy enterprise freight management monolith into a Kubernetes-powered event-driven microservices architecture.',
    challenge: 'Legacy system crashed during peak e-commerce sales seasons, with 40-minute shipment tracking latency and mounting server costs.',
    solution: 'Architected distributed event streaming using Apache Kafka, containerized services on AWS EKS, and built a real-time tracking web & mobile dashboard.',
    impact: 'Handled 5M+ daily shipment events with sub-second tracking latency and cut infrastructure expenses by 35%.'
  },
  {
    id: 'healthvault',
    client: 'HealthVault Care',
    category: 'healthcare',
    title: 'HIPAA-Compliant Telemedicine & Diagnostics Suite',
    metrics: [
      { label: 'Launch Time', val: '4 Mos' },
      { label: 'Daily Consults', val: '25k+' },
      { label: 'Security Score', val: '100%' }
    ],
    summary: 'Developed an encrypted cross-platform telemedicine consultation system and placed 35 certified biomedical software engineers.',
    challenge: 'Strict HIPAA and ISO 27001 data privacy compliance with real-time video consultation under low-bandwidth networks.',
    solution: 'Built WebRTC video engine with automated end-to-end encryption, integrated EHR database, and assembled dedicated QA automation squad.',
    impact: 'Platform launched in 16 weeks, facilitating 25,000+ daily consultations across Tier-1 and Tier-2 regions.'
  },
  {
    id: 'neobank',
    client: 'NeoBank Global',
    category: 'bfsi',
    title: 'Next-Gen Core Banking API & Mobile Platform',
    metrics: [
      { label: 'API Latency', val: '<45ms' },
      { label: 'Staff Deployed', val: '60+' },
      { label: 'Monthly Active', val: '1.8M' }
    ],
    summary: 'Augmented engineering leadership and delivered open-banking API microservices connected to core legacy banking ledgers.',
    challenge: 'Complex banking regulatory audits and rapid delivery deadlines for mobile launch.',
    solution: 'Engineered high-security OAuth2 API gateways, automated ISO 8583 payment protocol wrappers, and supplied 60 senior cloud developers.',
    impact: 'Surpassed 1.8M active accounts within 90 days of rollout with 45ms average transactional response time.'
  }
];

function initCaseStudyFilters() {
  const filterBtns = document.querySelectorAll('.case-filter-btn');
  const caseCards = document.querySelectorAll('.case-card-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      caseCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-cat') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  document.querySelectorAll('.open-case-modal').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const caseId = el.getAttribute('data-case-id');
      const data = caseStudiesData.find(c => c.id === caseId);
      if (data) openCaseStudyModal(data);
    });
  });
}

function openCaseStudyModal(data) {
  const modal = document.getElementById('case-study-modal');
  const title = document.getElementById('modal-case-title');
  const client = document.getElementById('modal-case-client');
  const body = document.getElementById('modal-case-body');

  if (!modal) return;

  client.textContent = data.client;
  title.textContent = data.title;
  body.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <p style="font-size: 1.05rem; color: var(--text-primary); margin-bottom: 1.5rem;">${data.summary}</p>
      
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; background: var(--bg-subtle); padding: 1.25rem; border-radius: var(--radius-md); text-align: center; margin-bottom: 2rem;">
        ${data.metrics.map(m => `
          <div>
            <div style="font-size: 1.5rem; font-weight: 800; color: var(--brand-green-500); font-family: var(--font-heading);">${m.val}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">${m.label}</div>
          </div>
        `).join('')}
      </div>

      <div style="margin-bottom: 1.25rem;">
        <h4 style="font-size: 1rem; color: var(--text-primary); margin-bottom: 0.4rem;">The Challenge</h4>
        <p style="font-size: 0.9rem; color: var(--text-secondary);">${data.challenge}</p>
      </div>

      <div style="margin-bottom: 1.25rem;">
        <h4 style="font-size: 1rem; color: var(--text-primary); margin-bottom: 0.4rem;">Our Strategic Solution</h4>
        <p style="font-size: 0.9rem; color: var(--text-secondary);">${data.solution}</p>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h4 style="font-size: 1rem; color: var(--text-primary); margin-bottom: 0.4rem;">Business & Technical Impact</h4>
        <p style="font-size: 0.9rem; color: var(--text-secondary);">${data.impact}</p>
      </div>
    </div>
    <div style="display: flex; gap: 1rem; justify-content: flex-end; border-top: 1px solid var(--border-color); padding-top: 1.25rem;">
      <button class="btn btn-outline" onclick="downloadCaseStudyPDF('${data.client}')">📥 Download PDF 1-Pager</button>
      <button class="btn btn-primary" onclick="closeModal('case-study-modal'); navigateTo('contact');">Discuss Similar Project</button>
    </div>
  `;

  openModal('case-study-modal');
}

function downloadCaseStudyPDF(clientName) {
  showToast(`Generating & downloading full executive case study for ${clientName}...`);
}

/* ==========================================================================
   Careers Component & Drag-and-Drop File Upload
   ========================================================================== */
function initCareerFilters() {
  const deptBtns = document.querySelectorAll('.job-filter-btn');
  const jobItems = document.querySelectorAll('.job-item-card');

  deptBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      deptBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-dept');
      jobItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-dept') === filter) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  document.querySelectorAll('.apply-job-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const jobTitle = btn.getAttribute('data-job-title');
      const input = document.getElementById('apply-role-input');
      if (input) input.value = jobTitle || 'General Application';
      openModal('job-apply-modal');
    });
  });
}

function initFileUpload() {
  const dropArea = document.getElementById('resume-drop-area');
  const fileInput = document.getElementById('resume-file-input');
  const fileStatus = document.getElementById('file-upload-status');

  if (!dropArea || !fileInput) return;

  dropArea.addEventListener('click', () => fileInput.click());

  ['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropArea.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropArea.classList.remove('dragover');
    });
  });

  dropArea.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
  });

  fileInput.addEventListener('change', () => {
    handleFiles(fileInput.files);
  });

  function handleFiles(files) {
    if (files.length > 0) {
      const file = files[0];
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      fileStatus.innerHTML = `
        <div style="font-weight: 700; color: var(--brand-green-500); margin-top: 0.5rem;">
          ✓ Attached: ${file.name} (${sizeMb} MB)
        </div>
        <div class="ats-score-badge">
          <span>AI Resume ATS Match: <strong>94% High Alignment</strong></span>
        </div>
      `;
    }
  }
}

/* ==========================================================================
   Blog Articles & Modal Reader
   ========================================================================== */
const blogPostsData = [
  {
    id: 'tech-hiring-2026',
    category: 'Technology',
    date: 'February 2026',
    readTime: '6 min read',
    title: 'The 2026 Tech Hiring Playbook: Navigating AI, Compensation & Hybrid Models',
    summary: 'How leading enterprises are restructuring engineering evaluation, balancing AI productivity with core algorithmic talent, and winning top 1% candidates.',
    content: `
      <p style="margin-bottom: 1rem;">The technological landscape in 2026 has witnessed unprecedented acceleration with generative tooling, multi-agent frameworks, and distributed cloud computing. Enterprise hiring teams face a dual challenge: assessing real problem-solving capabilities while moving at market speed.</p>
      <h4 style="margin: 1.5rem 0 0.5rem; font-size: 1.1rem;">1. Shifting Beyond Generic LeetCode</h4>
      <p style="margin-bottom: 1rem;">Modern technical evaluation has evolved towards architectural systems design, code debugging in live environments, and AI-assisted workflow assessments rather than memorized data structures.</p>
      <h4 style="margin: 1.5rem 0 0.5rem; font-size: 1.1rem;">2. Proactive Pipeline Architecture</h4>
      <p style="margin-bottom: 1rem;">Enterprises that succeed in 2026 do not start sourcing when a requisition opens. They partner with specialist talent firms that maintain curated cohorts of verified senior staff engineers, tech leads, and DevOps architects.</p>
      <h4 style="margin: 1.5rem 0 0.5rem; font-size: 1.1rem;">3. The Unified Consulting Advantage</h4>
      <p>By blending talent acquisition with active software delivery capabilities, organizations gain an advisor that understands both the human and technical stack required to ship production code on time.</p>
    `
  },
  {
    id: 'monolith-microservices',
    category: 'Software Development',
    date: 'January 2026',
    readTime: '8 min read',
    title: 'Monolith to Microservices: Architectural Lessons from 200+ Enterprise Migrations',
    summary: 'Key anti-patterns to avoid when decoupling core systems, choosing the right event brokers, and establishing distributed observability.',
    content: `
      <p style="margin-bottom: 1rem;">Deconstructing large enterprise monoliths requires a balance of domain-driven design, incremental strangler patterns, and rock-solid automated testing.</p>
      <h4 style="margin: 1.5rem 0 0.5rem; font-size: 1.1rem;">The Strangler Fig Pattern in Practice</h4>
      <p style="margin-bottom: 1rem;">Rather than attempting high-risk big-bang rewrites, successful digital transformations carve out vertical slices—such as authentication, notification gateways, and payments—behind an API gateway.</p>
      <h4 style="margin: 1.5rem 0 0.5rem; font-size: 1.1rem;">Distributed Observability & Tracing</h4>
      <p>Deploying microservices without OpenTelemetry and unified metric tracking leads to blind spots. We mandate structured logging and end-to-end trace propagation across every microservice sprint.</p>
    `
  },
  {
    id: 'unified-consulting',
    category: 'Consulting',
    date: 'December 2025',
    readTime: '5 min read',
    title: 'Why Traditional IT Staffing is Broken and How Unified Consulting Solves It',
    summary: 'Why transactional recruitment and disconnected software vendors create friction, and how an end-to-end partner drives sustainable speed.',
    content: `
      <p style="margin-bottom: 1rem;">For decades, enterprises managed two disconnected vendors: staffing agencies that pitched resumes without technical validation, and IT body shops that locked clients into bloated contracts.</p>
      <p style="margin-bottom: 1rem;">Nexus EDGE pioneered the Unified Consulting model: engineers evaluating engineers, recruitment squads embedded directly with delivery architects, and flexible engagement models ranging from staff augmentation to turn-key product builds.</p>
      <p>The result is a 45% reduction in time-to-hire, zero knowledge loss between recruitment and project kickoff, and unmatched alignment with corporate strategic goals.</p>
    `
  }
];

function initBlogFilters() {
  const catBtns = document.querySelectorAll('.blog-filter-btn');
  const blogCards = document.querySelectorAll('.blog-card-item');

  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-cat');
      blogCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-cat') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  document.querySelectorAll('.open-blog-modal').forEach(card => {
    card.addEventListener('click', () => {
      const blogId = card.getAttribute('data-blog-id');
      const post = blogPostsData.find(b => b.id === blogId);
      if (post) openBlogModal(post);
    });
  });
}

function openBlogModal(post) {
  const modal = document.getElementById('blog-read-modal');
  const title = document.getElementById('modal-blog-title');
  const meta = document.getElementById('modal-blog-meta');
  const body = document.getElementById('modal-blog-body');

  if (!modal) return;

  title.textContent = post.title;
  meta.textContent = `${post.category} · ${post.date} · ${post.readTime}`;
  body.innerHTML = post.content;

  openModal('blog-read-modal');
}

/* ==========================================================================
   Compliance & Certificate Preview Modals
   ========================================================================== */
function initCertModals() {
  document.querySelectorAll('.cert-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const certName = tag.textContent;
      showToast(`Verified Security Credential: ${certName} active & audit-ready.`);
    });
  });
}

/* ==========================================================================
   Modal Helpers
   ========================================================================== */
function initModals() {
  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => {
        m.classList.remove('active');
      });
      document.body.style.overflow = '';
    }
  });

  document.querySelectorAll('.trigger-consultation').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('consultation-modal');
    });
  });

  document.querySelectorAll('.trigger-hire-talent').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('hire-talent-modal');
    });
  });

  // Interactive specialization chips in Talent modal
  document.querySelectorAll('#talent-role-chips .talent-chip-item').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
      const activeVals = Array.from(document.querySelectorAll('#talent-role-chips .talent-chip-item.active'))
        .map(c => c.getAttribute('data-val'));
      const hiddenInput = document.getElementById('selected-talent-roles');
      if (hiddenInput) {
        hiddenInput.value = activeVals.join(', ');
      }
    });
  });

  const whatsappFab = document.getElementById('fab-whatsapp-trigger');
  if (whatsappFab) {
    whatsappFab.addEventListener('click', () => {
      window.open('https://api.whatsapp.com/send?phone=919876543210&text=Hi%20Nexus%20EDGE,%20I%20would%20like%20to%20discuss%20an%20IT%20consulting%20or%20software%20project.', '_blank');
    });
  }
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}



/* ==========================================================================
   Forms & Toast Notifications
   ========================================================================== */
function initForms() {
  const contactForm = document.getElementById('main-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = 'Sending Message...';
        submitBtn.disabled = true;
      }
      setTimeout(() => {
        contactForm.reset();
        if (submitBtn) {
          submitBtn.textContent = 'Send Message';
          submitBtn.disabled = false;
        }
        showToast('Thank you! Your message has been sent. Our Senior Partner will contact you within 2 hours.');
      }, 900);
    });
  }

  const consultForm = document.getElementById('consultation-form');
  if (consultForm) {
    consultForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal('consultation-modal');
      consultForm.reset();
      showToast('Consultation request confirmed! Calendar invite (.ics) generated.');
    });
  }

  const hireForm = document.getElementById('hire-talent-form');
  if (hireForm) {
    hireForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = hireForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = 'Submitting Request...';
        submitBtn.disabled = true;
      }
      setTimeout(() => {
        closeModal('hire-talent-modal');
        hireForm.reset();
        if (submitBtn) {
          submitBtn.textContent = 'Submit';
          submitBtn.disabled = false;
        }
        showToast('Talent request received! A Senior Partner will share vetted candidate profiles within 24 hours.');
      }, 700);
    });
  }

  const jobForm = document.getElementById('job-apply-form');
  if (jobForm) {
    jobForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal('job-apply-modal');
      jobForm.reset();
      showToast('Application & resume received! Our recruitment squad will evaluate your profile.');
    });
  }

  const newsForm = document.getElementById('newsletter-form');
  if (newsForm) {
    newsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      newsForm.reset();
      showToast('Subscribed! The 2026 Tech Hiring & Architecture Report is on its way to your inbox.');
    });
  }
}

function showToast(msg) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--brand-green-500); flex-shrink: 0;">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
    <span>${msg}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 50);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ==========================================================================
   Scroll-to-Top Button
   ========================================================================== */
(function initScrollTop() {
  const btn = document.getElementById('scroll-top-btn');
  if (!btn) return;

  const onScroll = () => {
    btn.classList.toggle('visible', window.scrollY > 420);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ==========================================================================
   Cookie Consent Banner
   ========================================================================== */
(function initCookieBanner() {
  const COOKIE_KEY = 'nexus_cookie_consent';
  if (localStorage.getItem(COOKIE_KEY)) return;

  const banner   = document.getElementById('cookie-banner');
  const accept   = document.getElementById('cookie-accept');
  const decline  = document.getElementById('cookie-decline');
  const scrollBtn = document.getElementById('scroll-top-btn');
  if (!banner) return;

  setTimeout(() => {
    banner.classList.add('show');
    // Push scroll-to-top button above the banner
    if (scrollBtn) {
      requestAnimationFrame(() => {
        scrollBtn.style.bottom = (banner.offsetHeight + 16) + 'px';
      });
    }
  }, 1800);

  function dismiss(choice) {
    localStorage.setItem(COOKIE_KEY, choice);
    banner.classList.remove('show');
    if (scrollBtn) scrollBtn.style.bottom = '';
    setTimeout(() => banner.remove(), 500);
  }

  accept.addEventListener('click',  () => dismiss('accepted'));
  decline.addEventListener('click', () => dismiss('declined'));
})();

/* ==========================================================================
   Horizontal Services Showcase Carousel
   ========================================================================== */
function initServicesCarousel() {
  const track = document.getElementById('services-horizontal-track');
  const prevBtn = document.getElementById('carousel-prev-btn');
  const nextBtn = document.getElementById('carousel-next-btn');
  const dots = document.querySelectorAll('#carousel-dots-wrap .carousel-dot');
  if (!track) return;

  function updateActiveDot() {
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= 0 || !dots.length) return;
    const progress = track.scrollLeft / maxScroll;
    const activeDotIndex = Math.min(dots.length - 1, Math.max(0, Math.round(progress * (dots.length - 1))));
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeDotIndex);
    });
  }

  track.addEventListener('scroll', updateActiveDot, { passive: true });

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      const targetScroll = (idx / (dots.length - 1)) * maxScroll;
      track.scrollTo({ left: targetScroll, behavior: 'smooth' });
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const card = track.querySelector('.horizontal-service-card');
      const amount = card ? card.offsetWidth + 24 : 360;
      track.scrollBy({ left: -amount, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const card = track.querySelector('.horizontal-service-card');
      const amount = card ? card.offsetWidth + 24 : 360;
      track.scrollBy({ left: amount, behavior: 'smooth' });
    });
  }

  // Mouse Grab & Drag
  let isDown = false;
  let startX;
  let scrollLeft;

  track.addEventListener('mousedown', (e) => {
    isDown = true;
    track.classList.add('dragging');
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  track.addEventListener('mouseleave', () => {
    isDown = false;
    track.classList.remove('dragging');
  });

  track.addEventListener('mouseup', () => {
    isDown = false;
    track.classList.remove('dragging');
  });

  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeft - walk;
  });
}

/* ==========================================================================
   Fluid Ribbon Accordion Deck Controller
   ========================================================================== */
function initAppinventivIndustryFilter() {
  initRibbonIndustryDeck();
}

function initRibbonIndustryDeck() {
  const track = document.getElementById('ribbon-deck-track');
  const cards = document.querySelectorAll('.ribbon-card');
  const filterBtns = document.querySelectorAll('.app-industry-filter-bar .app-filter-btn');
  const prevBtn = document.getElementById('ribbon-prev-btn');
  const nextBtn = document.getElementById('ribbon-next-btn');

  if (!cards.length) return;

  let hoverTimer = null;

  // Dynamically re-index visible cards so numbers are ALWAYS 01, 02, 03... sequentially
  function renumberVisibleCards() {
    let counter = 1;
    cards.forEach(card => {
      if (!card.classList.contains('hidden-card')) {
        const numStr = String(counter).padStart(2, '0');

        // Update watermark number
        const watermark = card.querySelector('.ribbon-watermark');
        if (watermark) watermark.textContent = numStr;

        // Update collapsed vertical label
        const verticalLabel = card.querySelector('.ribbon-vertical-label');
        if (verticalLabel) {
          if (!verticalLabel.hasAttribute('data-raw-title')) {
            verticalLabel.setAttribute('data-raw-title', verticalLabel.textContent.replace(/^\d+\s*·\s*/, '').trim());
          }
          const rawTitle = verticalLabel.getAttribute('data-raw-title');
          verticalLabel.textContent = `${numStr} · ${rawTitle}`;
        }

        // Update expanded header badge
        const badgeTag = card.querySelector('.ribbon-badge-tag');
        if (badgeTag) {
          if (!badgeTag.hasAttribute('data-raw-badge')) {
            badgeTag.setAttribute('data-raw-badge', badgeTag.textContent.replace(/^\d+\s*·\s*/, '').trim());
          }
          const rawBadge = badgeTag.getAttribute('data-raw-badge');
          badgeTag.textContent = `${numStr} · ${rawBadge}`;
        }

        counter++;
      }
    });
  }

  // Initial numbering pass on load
  renumberVisibleCards();

  // Function to activate a specific card with smooth scrolling into view
  function activateCard(targetCard, autoScroll = false) {
    if (!targetCard || targetCard.classList.contains('hidden-card') || targetCard.classList.contains('active')) return;
    cards.forEach(c => c.classList.remove('active'));
    targetCard.classList.add('active');

    if (autoScroll && track && window.innerWidth > 640) {
      const cardRect = targetCard.getBoundingClientRect();
      const trackRect = track.getBoundingClientRect();
      if (cardRect.right > trackRect.right - 20) {
        track.scrollBy({ left: cardRect.right - trackRect.right + 40, behavior: 'smooth' });
      } else if (cardRect.left < trackRect.left + 20) {
        track.scrollBy({ left: cardRect.left - trackRect.left - 40, behavior: 'smooth' });
      }
    }
  }

  // Debounced Hover and Immediate Click expansion
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (window.innerWidth > 640) {
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => {
          activateCard(card, true);
        }, 60);
      }
    });

    card.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimer);
    });

    card.addEventListener('click', (e) => {
      // Don't override CTA button clicks
      if (e.target.closest('.trigger-hire-talent') || e.target.closest('button')) {
        return;
      }
      clearTimeout(hoverTimer);
      activateCard(card, true);
    });
  });

  // Prev / Next Nav Buttons
  if (prevBtn && track) {
    prevBtn.addEventListener('click', () => {
      const scrollAmount = Math.max(track.offsetWidth * 0.45, 300);
      track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
  }

  if (nextBtn && track) {
    nextBtn.addEventListener('click', () => {
      const scrollAmount = Math.max(track.offsetWidth * 0.45, 300);
      track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  // Category Filter Functionality
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterVal = btn.getAttribute('data-filter');
        let firstVisible = null;

        cards.forEach(card => {
          const cat = card.getAttribute('data-cat');
          if (filterVal === 'all' || cat === filterVal) {
            card.classList.remove('hidden-card');
            if (!firstVisible) firstVisible = card;
          } else {
            card.classList.add('hidden-card');
          }
        });

        // Always re-number the currently visible filtered cards sequentially (01, 02, 03...)
        renumberVisibleCards();

        if (firstVisible) {
          activateCard(firstVisible);
          if (track && window.innerWidth > 640) {
            track.scrollTo({ left: 0, behavior: 'smooth' });
          }
        }
      });
    });
  }

  // Mouse Grab & Drag for Desktop Track
  if (track) {
    let isDown = false;
    let startX;
    let scrollLeft;

    track.addEventListener('mousedown', (e) => {
      if (e.target.closest('button') || e.target.closest('a')) return;
      isDown = true;
      track.classList.add('dragging');
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });

    track.addEventListener('mouseleave', () => {
      isDown = false;
      track.classList.remove('dragging');
    });

    track.addEventListener('mouseup', () => {
      isDown = false;
      track.classList.remove('dragging');
    });

    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      track.scrollLeft = scrollLeft - walk;
    });
  }
}

/* ==========================================================================
   Horizontal Alternating 11-Step Talent Consulting Process (Zig-Zag Rail)
   ========================================================================== */
function initHorizontalProcessTrack() {
  const section = document.getElementById('process-section');
  const viewport = document.getElementById('proc-scroll-viewport');
  const track = document.getElementById('proc-horizontal-track');
  const progressFill = document.getElementById('proc-progress-fill');
  const stepLabel = document.getElementById('proc-step-label');
  const prevBtn = document.getElementById('proc-prev-btn');
  const nextBtn = document.getElementById('proc-next-btn');

  if (!section || !viewport || !track) return;

  const cols = track.querySelectorAll('.proc-step-col');
  const totalSteps = cols.length;
  let currentActiveIndex = 0;
  let isDragging = false;
  let userInteractionTimer = null;
  let targetScrollLeft = 0;
  let isScrollLoopRunning = false;

  // Function to update active/passed glow states on cols and nodes
  function setActiveStep(index, smoothScrollTrack = true) {
    if (index < 0) index = 0;
    if (index >= totalSteps) index = totalSteps - 1;
    if (index === currentActiveIndex && !smoothScrollTrack) return;
    currentActiveIndex = index;

    cols.forEach((col, i) => {
      if (i === index) {
        col.classList.add('active');
        col.classList.remove('passed');
      } else if (i < index) {
        col.classList.remove('active');
        col.classList.add('passed');
      } else {
        col.classList.remove('active');
        col.classList.remove('passed');
      }
    });

    // Update continuous central line progress fill
    const progressPercent = ((index + 1) / totalSteps) * 100;
    if (progressFill) {
      progressFill.style.width = `${progressPercent}%`;
    }

    // Update live step label
    const activeCol = cols[index];
    const cardTitle = activeCol ? activeCol.querySelector('h4').textContent : '';
    if (stepLabel) {
      stepLabel.textContent = `STEP 0${index + 1} OF ${totalSteps}: ${cardTitle}`.replace('010', '10').replace('011', '11');
    }

    // Scroll viewport to show active column with smooth spring interpolation
    if (smoothScrollTrack && activeCol) {
      const colLeft = activeCol.offsetLeft - track.offsetLeft;
      const target = colLeft - (viewport.clientWidth / 2) + (activeCol.offsetWidth / 2);
      smoothScrollTo(target);
    }
  }

  // Smooth 60fps spring interpolation loop for track scrolling
  function smoothScrollTo(target) {
    targetScrollLeft = Math.max(0, Math.min(target, viewport.scrollWidth - viewport.clientWidth));
    if (!isScrollLoopRunning) {
      isScrollLoopRunning = true;
      requestAnimationFrame(runSpringScroll);
    }
  }

  function runSpringScroll() {
    if (isDragging) {
      isScrollLoopRunning = false;
      return;
    }
    const current = viewport.scrollLeft;
    const diff = targetScrollLeft - current;

    if (Math.abs(diff) > 0.75) {
      viewport.scrollLeft = current + diff * 0.18;
      requestAnimationFrame(runSpringScroll);
    } else {
      viewport.scrollLeft = targetScrollLeft;
      isScrollLoopRunning = false;
    }
  }

  // 1. Page Scroll Synchronization:
  // As the user scrolls vertically through the process section on the homepage,
  // translate the horizontal track smoothly without layout reflows or stutter.
  let isScrollTicking = false;
  window.addEventListener('scroll', () => {
    if (isDragging || userInteractionTimer) return;
    if (!isScrollTicking) {
      window.requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

        // When the section is within viewport
        if (rect.top <= windowHeight * 0.8 && rect.bottom >= windowHeight * 0.2) {
          const totalDistance = windowHeight * 0.6 + rect.height;
          const currentDistance = (windowHeight * 0.8) - rect.top;
          const scrollFraction = Math.max(0, Math.min(1, currentDistance / totalDistance));

          // Calculate active step (0 to 10)
          const targetIndex = Math.min(totalSteps - 1, Math.floor(scrollFraction * totalSteps));

          // Translate horizontal scroll viewport smoothly
          const maxScroll = viewport.scrollWidth - viewport.clientWidth;
          if (maxScroll > 0) {
            smoothScrollTo(scrollFraction * maxScroll);
          }

          if (targetIndex !== currentActiveIndex) {
            setActiveStep(targetIndex, false);
          }
        }
        isScrollTicking = false;
      });
      isScrollTicking = true;
    }
  }, { passive: true });

  // 2. Viewport Scroll Listener for manual drag/touch:
  viewport.addEventListener('scroll', () => {
    if (isScrollLoopRunning) return; // Only process when user is manually scrolling/dragging
    const scrollLeft = viewport.scrollLeft;
    const viewportCenter = scrollLeft + (viewport.clientWidth / 2);

    let closestIndex = 0;
    let minDistance = Infinity;

    cols.forEach((col, idx) => {
      const colCenter = col.offsetLeft + (col.offsetWidth / 2);
      const dist = Math.abs(colCenter - viewportCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = idx;
      }
    });

    if (closestIndex !== currentActiveIndex) {
      setActiveStep(closestIndex, false);
    }
  }, { passive: true });

  // 3. Previous / Next Button Controls
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      setUserInteracting();
      setActiveStep(currentActiveIndex - 1, true);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      setUserInteracting();
      setActiveStep(currentActiveIndex + 1, true);
    });
  }

  // 4. Click to Focus any Column / Node / Card
  cols.forEach((col, idx) => {
    col.addEventListener('click', () => {
      setUserInteracting();
      setActiveStep(idx, true);
    });
  });

  function setUserInteracting() {
    if (userInteractionTimer) clearTimeout(userInteractionTimer);
    userInteractionTimer = setTimeout(() => {
      userInteractionTimer = null;
    }, 1200);
  }

  // 5. Mouse Drag-to-Scroll support
  let startX;
  let startScrollLeft;

  viewport.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - viewport.offsetLeft;
    startScrollLeft = viewport.scrollLeft;
    setUserInteracting();
  });

  window.addEventListener('mouseleave', () => { isDragging = false; });
  window.addEventListener('mouseup', () => { isDragging = false; });

  viewport.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - viewport.offsetLeft;
    const walk = (x - startX) * 1.5;
    viewport.scrollLeft = startScrollLeft - walk;
    setUserInteracting();
  });

  // Initial state setup
  setActiveStep(0, false);
}




