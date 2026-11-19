// Frontend application logic
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initContactForm();
  initInboxModal();
  loadPortfolioData();
  checkBackendHealth();
});

// 1. Theme Management
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('site_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('site_theme', next);
    });
  }
}

// 2. Mobile Navigation & Smooth Scroll
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetNav = document.querySelector(`.nav-link[href*="${sectionId}"]`);
      if (targetNav) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetNav.classList.add('active');
        } else {
          targetNav.classList.remove('active');
        }
      }
    });
  });

  // Footer Year
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// 3. Backend Health Check Ping
async function checkBackendHealth() {
  const pingEl = document.getElementById('backend-ping');
  try {
    const res = await fetch('/api/health');
    if (res.ok) {
      const data = await res.json();
      if (pingEl) pingEl.textContent = `Online (${data.status})`;
      updateInboxCount();
    } else {
      if (pingEl) pingEl.textContent = 'Degraded';
    }
  } catch (err) {
    if (pingEl) pingEl.textContent = 'Offline (Static Mode)';
  }
}

// 4. Load Portfolio Data
async function loadPortfolioData() {
  try {
    const response = await fetch('/api/portfolio');
    if (!response.ok) throw new Error('Failed to load portfolio API');
    const data = await response.json();

    renderPersonalInfo(data.personal);
    renderStats(data.stats);
    renderSkills(data.skillCategories);
    renderProjects(data.projects);
    renderExperience(data.experience);
  } catch (error) {
    console.warn('Backend API request error, fallback to inline content:', error);
  }
}

// Render Functions
function renderPersonalInfo(personal) {
  if (!personal) return;

  const setName = id => {
    const el = document.getElementById(id);
    if (el) el.textContent = personal.name;
  };
  setName('hero-name');
  setName('nav-brand-name');
  setName('footer-name');

  const roleEl = document.getElementById('hero-role');
  if (roleEl) roleEl.textContent = personal.role;

  const taglineEl = document.getElementById('hero-tagline');
  if (taglineEl) taglineEl.textContent = personal.tagline;

  const availEl = document.getElementById('hero-availability');
  if (availEl) availEl.textContent = personal.availability;

  const bioEl = document.getElementById('about-bio');
  if (bioEl) bioEl.textContent = personal.bio;

  const locEl = document.getElementById('about-location');
  if (locEl) locEl.textContent = personal.location;

  const emailEl = document.getElementById('about-email');
  if (emailEl) emailEl.textContent = personal.email;

  const statusEl = document.getElementById('about-status');
  if (statusEl) statusEl.textContent = personal.availability;

  const contactEmail = document.getElementById('contact-link-email');
  if (contactEmail) {
    contactEmail.href = `mailto:${personal.email}`;
    contactEmail.textContent = personal.email;
  }

  const contactLoc = document.getElementById('contact-panel-location');
  if (contactLoc) contactLoc.textContent = personal.location;

  const contactStat = document.getElementById('contact-panel-status');
  if (contactStat) contactStat.textContent = personal.availability;

  // Social pills
  const socialsContainer = document.getElementById('hero-socials');
  if (socialsContainer && personal.socials) {
    socialsContainer.innerHTML = '';
    const socialItems = [
      { key: 'github', label: 'GitHub', icon: '🐙', url: personal.socials.github },
      { key: 'linkedin', label: 'LinkedIn', icon: '💼', url: personal.socials.linkedin },
      { key: 'twitter', label: 'Twitter', icon: '🐦', url: personal.socials.twitter }
    ];

    socialItems.forEach(item => {
      if (item.url) {
        const a = document.createElement('a');
        a.href = item.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'social-pill';
        a.innerHTML = `<span>${item.icon}</span> <span>${item.label}</span>`;
        socialsContainer.appendChild(a);
      }
    });
  }
}

function renderStats(stats) {
  const container = document.getElementById('stats-container');
  if (!container || !Array.isArray(stats)) return;

  container.innerHTML = stats.map(st => `
    <div class="stat-item">
      <div class="stat-value">${st.value}</div>
      <div class="stat-label">${st.label}</div>
    </div>
  `).join('');
}

function renderSkills(categories) {
  const container = document.getElementById('skills-container');
  if (!container || !Array.isArray(categories)) return;

  container.innerHTML = categories.map(cat => `
    <div class="skill-category-card">
      <h3 class="category-title">${cat.category}</h3>
      <div class="skills-list">
        ${cat.skills.map(skill => `
          <div class="skill-item">
            <div class="skill-item-header">
              <span class="skill-name-group">
                <span>${skill.icon}</span>
                <span>${skill.name}</span>
              </span>
              <span class="skill-percent">${skill.level}%</span>
            </div>
            <div class="skill-bar">
              <div class="skill-progress" style="width: ${skill.level}%"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

let allProjects = [];

function renderProjects(projects) {
  const container = document.getElementById('projects-container');
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!container || !Array.isArray(projects)) return;

  allProjects = projects;

  const display = filtered => {
    container.innerHTML = filtered.map(item => `
      <div class="project-card" data-category="${item.category}">
        <div class="project-top">
          <div class="project-badge-row">
            <span class="project-category-tag">${item.category}</span>
            ${item.featured ? '<span style="font-size: 0.75rem; color: #10b981; font-weight:700;">★ Featured</span>' : ''}
          </div>
          <h3 class="project-title">${item.title}</h3>
          <p class="project-desc">${item.description}</p>
          <div class="project-tags">
            ${item.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
          </div>
        </div>
        <div class="project-actions">
          <a href="${item.demoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary">
            <span>Live Demo</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
          </a>
          <a href="${item.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-secondary">
            <span>Code</span>
          </a>
        </div>
      </div>
    `).join('');
  };

  display(allProjects);

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter');
      if (cat === 'all') {
        display(allProjects);
      } else {
        display(allProjects.filter(p => p.category === cat));
      }
    });
  });
}

function renderExperience(items) {
  const container = document.getElementById('experience-container');
  if (!container || !Array.isArray(items)) return;

  container.innerHTML = items.map(exp => `
    <div class="timeline-item">
      <div class="timeline-node"></div>
      <div class="timeline-card">
        <div class="timeline-period">${exp.period}</div>
        <h3 class="timeline-role">${exp.role}</h3>
        <div class="timeline-company">${exp.company}</div>
        <p class="timeline-desc">${exp.description}</p>
      </div>
    </div>
  `).join('');
}

// 5. Contact Form Handler
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('btn-submit');
  const feedback = document.getElementById('form-feedback');

  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const formData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim()
    };

    if (!formData.name || !formData.email || !formData.message) {
      showFeedback('Please fill out all required fields.', 'error');
      return;
    }

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    feedback.className = 'form-feedback';
    feedback.textContent = '';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showFeedback(data.message || 'Message sent successfully!', 'success');
        form.reset();
        updateInboxCount();
      } else {
        showFeedback(data.error || 'Failed to deliver message. Please retry.', 'error');
      }
    } catch (err) {
      showFeedback('Unable to reach backend server. Please verify your connection.', 'error');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });

  function showFeedback(text, type) {
    feedback.textContent = text;
    feedback.className = `form-feedback ${type}`;
  }
}

// 6. Inbox Modal & Verification Drawer
function initInboxModal() {
  const modal = document.getElementById('inbox-modal');
  const openBtn = document.getElementById('btn-quick-inbox');
  const closeBtn = document.getElementById('modal-close-btn');
  const refreshBtn = document.getElementById('btn-refresh-inbox');
  const clearBtn = document.getElementById('btn-clear-inbox');

  if (!modal || !openBtn) return;

  const openModal = () => {
    modal.classList.add('open');
    fetchMessages();
  };

  const closeModal = () => {
    modal.classList.remove('open');
  };

  openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  if (refreshBtn) refreshBtn.addEventListener('click', fetchMessages);

  if (clearBtn) {
    clearBtn.addEventListener('click', async () => {
      if (confirm('Clear all stored test messages?')) {
        try {
          await fetch('/api/messages', { method: 'DELETE' });
          fetchMessages();
          updateInboxCount();
        } catch (err) {
          console.error(err);
        }
      }
    });
  }
}

async function updateInboxCount() {
  const countEl = document.getElementById('inbox-count');
  try {
    const res = await fetch('/api/messages');
    if (res.ok) {
      const data = await res.json();
      if (countEl) countEl.textContent = data.total || 0;
    }
  } catch (err) {
    // quiet fail
  }
}

async function fetchMessages() {
  const listEl = document.getElementById('modal-messages-list');
  if (!listEl) return;

  listEl.innerHTML = '<p class="empty-state">Loading messages from server...</p>';

  try {
    const res = await fetch('/api/messages');
    if (!res.ok) throw new Error('Fetch failed');
    const data = await res.json();

    if (!data.messages || data.messages.length === 0) {
      listEl.innerHTML = '<p class="empty-state">No messages stored in backend yet.</p>';
      return;
    }

    listEl.innerHTML = data.messages.map(m => `
      <div class="message-card">
        <div class="message-card-top">
          <span class="message-sender">${escapeHtml(m.name)}</span>
          <span class="message-time">${new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div class="message-email">${escapeHtml(m.email)}</div>
        <div class="message-subject">Subject: ${escapeHtml(m.subject)}</div>
        <div class="message-body">${escapeHtml(m.message)}</div>
      </div>
    `).join('');
  } catch (err) {
    listEl.innerHTML = '<p class="empty-state" style="color: #ef4444;">Could not load inbox from server.</p>';
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
