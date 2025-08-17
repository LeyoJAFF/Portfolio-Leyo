import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import resumePdf from './assets/Leyo_Jaffrin_Clington_Resume.pdf';
import profileImg from './assets/Profile_PIC.jpg';
/**
 * World-Class Neon Portfolio
 * Enhanced with advanced animations, interactions, and professional features
 */

const SECTIONS = ['hero', 'about', 'experience', 'projects', 'contact'];
// const FULL_TITLE = 'Software Developer';

const TECH_STACKS = [
  { name: 'C', category: 'language', icon: '⚡', level: 85 },
  { name: 'Java', category: 'language', icon: '☕', level: 90 },
  { name: 'SpringBoot', category: 'framework', icon: '🍃', level: 85 },
  { name: 'Angular', category: 'framework', icon: '🅰️', level: 80 },
  { name: 'Unity C#', category: 'game', icon: '🎮', level: 95 },
  { name: 'Unity 3D', category: 'game', icon: '🎯', level: 95 },
  { name: 'React', category: 'frontend', icon: '⚛️', level: 88 },
  { name: 'Node JS', category: 'backend', icon: '📗', level: 85 },
  { name: 'MongoDB', category: 'database', icon: '🍃', level: 82 },
  { name: 'AWS Service', category: 'cloud', icon: '☁️', level: 80 },
  { name: 'Google Cloud', category: 'cloud', icon: '🌤️', level: 78 },
  { name: 'Microsoft Azure', category: 'cloud', icon: '☁️', level: 75 },
];

const EXPERIENCES = [
  {
    company: 'M-Tutor',
    role: 'Game Developer Intern',
    period: 'Sep 2023 - Apr 2024',
    description: 'Developed educational apps for students across mobile, web, VR, and AR platforms. Created engaging apps like VR Labs and Virtual Tour.',
    skills: ['Unity', 'VR/AR', 'Cross-platform', 'API Integration'],
    achievements: ['Built 5+ educational VR applications', 'Improved user engagement by 150%', 'Led cross-platform development team'],
    logo: '🎓'
  },
  {
    company: 'Cisco',
    role: 'Cybersecurity Program',
    period: 'Jul 2023 - Sep 2023',
    description: 'Completed Cisco Virtual Internship in Cybersecurity, focusing on hacking techniques, countermeasures, and secure network design.',
    skills: ['Cybersecurity', 'Network Design', 'Cisco Tools'],
    achievements: ['Designed secure campus network', 'Completed advanced security training', 'Earned cybersecurity certification'],
    logo: '🔐'
  },
  {
    company: 'TryCAE',
    role: 'Virtual Reality Developer Intern',
    period: 'Jan 2023 - Jun 2023',
    description: 'Developed VR apps using Unity 3D on Meta Quest 2 for mechanical engineering prototypes.',
    skills: ['Unity 3D', 'VR Development', '3D Modeling'],
    achievements: ['Created immersive CAD visualizations', 'Reduced prototyping costs by 40%', 'Integrated with CAD workflows'],
    logo: '🥽'
  },
];

const PROJECTS = [
  {
    title: 'VR Mechanical Engineering Suite',
    description: 'Revolutionary VR platform for mechanical engineering education with immersive car engine simulations and AR bearing mechanisms.',
    tech: ['Unity 3D', 'VR', 'AR', 'CAD Integration'],
    highlight: '₹2.5L Funding',
    status: 'Live',
    metrics: { users: '1000+', rating: '4.8/5', downloads: '5000+' },
    features: ['Real-time 3D visualization', 'Interactive simulations', 'Multi-platform support'],
    demoUrl: '#',
    githubUrl: '#'
  },
  {
    title: 'Smart Healthcare Platform',
    description: 'Full-stack web application revolutionizing doctor appointment booking with AI-powered scheduling and patient management.',
    tech: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'AI/ML'],
    highlight: 'MERN Stack',
    status: 'In Development',
    metrics: { appointments: '500+', doctors: '50+', efficiency: '+85%' },
    features: ['AI scheduling', 'Real-time notifications', 'Analytics dashboard'],
    demoUrl: '#',
    githubUrl: '#'
  },
  {
    title: 'Immersive Virtual Tourism',
    description: 'Next-generation VR tourism platform enabling photorealistic virtual travel experiences with social interaction features.',
    tech: ['Unity', 'VR', '3D Modeling', 'WebRTC'],
    highlight: 'VR Innovation',
    status: 'Beta',
    metrics: { destinations: '25+', users: '2000+', satisfaction: '96%' },
    features: ['360° environments', 'Social VR', 'Real-time weather'],
    demoUrl: '#',
    githubUrl: '#'
  },
];

// Enhanced utility functions
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const useParticles = (count = 30) =>
  useMemo(() => {
    const rand = mulberry32(123456789);
    return Array.from({ length: count }, (_, i) => ({
      id: `p-${i}`,
      left: `${Math.floor(rand() * 100)}%`,
      delay: `${(rand() * 8).toFixed(2)}s`,
      duration: `${(4 + rand() * 6).toFixed(2)}s`,
      size: Math.floor(2 + rand() * 4),
      opacity: 0.3 + rand() * 0.7,
    }));
  }, [count]);

// Enhanced cursor follower hook
const useCursorFollower = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const updateCursor = (e) => {
      const isClickable = e.target.closest('button, a, .clickable, .nav-link, .project-card');
      setIsPointer(!!isClickable);
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', updateCursor);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', updateCursor);
    };
  }, []);

  return { position, isPointer };
};

// Progress bar component
const ProgressBar = ({ value, max = 100, label, color = 'cyan' }) => (
  <div className="progress-container">
    <div className="progress-label">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="progress-bar">
      <div 
        className={`progress-fill progress-${color}`} 
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  </div>
);

// Enhanced project card
const ProjectCard = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="project-card enhanced"
      style={{ animationDelay: `${index * 0.2}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="project-status">
        <span className={`status-badge ${project.status.toLowerCase().replace(' ', '-')}`}>
          {project.status}
        </span>
      </div>
      
      <div className="project-header">
        <h3 className="project-title">{project.title}</h3>
        <span className="project-highlight neon-text">{project.highlight}</span>
      </div>
      
      <p className="project-description">{project.description}</p>
      
      <div className="project-features">
        <h4>Key Features:</h4>
        <ul>
          {project.features.map((feature, idx) => (
            <li key={idx}>{feature}</li>
          ))}
        </ul>
      </div>
      
      <div className="project-metrics">
        {Object.entries(project.metrics).map(([key, value]) => (
          <div key={key} className="metric">
            <span className="metric-value neon-text">{value}</span>
            <span className="metric-label">{key}</span>
          </div>
        ))}
      </div>
      
      <div className="project-tech">
        {project.tech.map((tech) => (
          <span key={`${project.title}-${tech}`} className="tech-badge">{tech}</span>
        ))}
      </div>
      
      <div className="project-actions">
        <a href={project.demoUrl} className="btn-demo" target="_blank" rel="noopener noreferrer">
          Live Demo
        </a>
        <a href={project.githubUrl} className="btn-code" target="_blank" rel="noopener noreferrer">
          View Code
        </a>
      </div>
      
      <div className="project-glow"></div>
      <div className={`project-pulse ${isHovered ? 'active' : ''}`}></div>
    </div>
  );
};

// Main component
const NeonPortfolio = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [typed, setTyped] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTechFilter, setSelectedTechFilter] = useState('all');
  const OFFSET = 24;              // same offset everywhere
// const SCROLL_DURATION = 600;    // ms (matches smooth scroll animation)
const clearProgrammaticTO = useRef(null);
  // const typeIndexRef = useRef(0);
  // const typingTimerRef = useRef(null);
  const pendingTargetRef = useRef(null);
  const isProgrammaticRef = useRef(false);
  const particles = useParticles(25);
  const cursor = useCursorFollower();
  const [fade, setFade] = useState(false);

  // Loading screen
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Scroll progress (listen on WINDOW instead of .snap-container)
  useEffect(() => {
    const updateScrollProgress = () => {
      const scrolled = window.scrollY || document.documentElement.scrollTop || 0;
      const maxScroll =
        (document.documentElement.scrollHeight || 0) - window.innerHeight;
      setScrollProgress(maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0);
    };

    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  // Hash -> state (normalize '#about-section' -> 'about')
useEffect(() => {
  const normalize = (h) => h.replace('#', '').replace(/-section$/, '');
  const initial = normalize(window.location.hash);
  if (SECTIONS.includes(initial)) setActiveSection(initial);

  const onHashChange = () => {
    const hash = normalize(window.location.hash);
    if (SECTIONS.includes(hash)) setActiveSection(hash);
  };

  window.addEventListener('hashchange', onHashChange);
  return () => window.removeEventListener('hashchange', onHashChange);
}, []);

  // replace your current handleNav with this:
const handleNavScroll = useCallback((section) => {
  const target = document.getElementById(`${section}-section`);
  const navH = document.querySelector('.neon-nav')?.offsetHeight || 0;

  if (target) {
    // keep the UI “locked” on the clicked section during the scroll
    pendingTargetRef.current = section;
    isProgrammaticRef.current = true;

    const clearGuard = () => {
      isProgrammaticRef.current = false;
      pendingTargetRef.current = null;
      window.removeEventListener('scrollend', clearGuard);
    };

    // best-effort: modern browsers fire this
    window.addEventListener('scrollend', clearGuard, { once: true });
    // fallback safety in case scrollend isn’t supported / takes longer
    if (clearProgrammaticTO.current) clearTimeout(clearProgrammaticTO.current);
    clearProgrammaticTO.current = setTimeout(clearGuard, 1500);

    const top = target.getBoundingClientRect().top + window.scrollY - navH - OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  // immediately reflect the click in the UI
  setActiveSection(section);
  if (window.location.hash !== `#${section}`) {
    window.history.pushState(null, '', `#${section}`);
  }
}, []);


  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const idx = SECTIONS.indexOf(activeSection);
        const nextIdx = e.key === 'ArrowRight' ? idx + 1 : idx - 1;
        const clampedIdx = clamp(nextIdx, 0, SECTIONS.length - 1);
        const target = SECTIONS[clampedIdx];
        if (target !== activeSection) handleNavScroll(target);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeSection, handleNavScroll]);

  // state


// Looping typewriter: "Software Developer" → fade out → "Game Developer" → repeat
useEffect(() => {
  const PHRASES = ['Software Developer', 'Game Developer'];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const TYPE_SPEED = reduce ? 180 : 90;
  const HOLD_MS    = 900;  // pause after fully typed
  const FADE_MS    = 350;  // must match CSS transition
  const GAP_MS     = 250;  // small gap before typing next word

  let phraseIdx = 0;
  let i = 0;
  let t;

  const type = () => {
    const word = PHRASES[phraseIdx];
    setTyped(word.slice(0, i));

    if (i < word.length) {
      i += 1;
      t = setTimeout(type, TYPE_SPEED);
    } else {
      // fully typed → hold, then fade out, then next word
      t = setTimeout(() => {
        setFade(true); // start fade-out
        t = setTimeout(() => {
          phraseIdx = (phraseIdx + 1) % PHRASES.length;
          i = 0;
          setTyped('');     // clear while faded
          setFade(false);   // fade back in
          t = setTimeout(type, GAP_MS);
        }, FADE_MS);
      }, HOLD_MS);
    }
  };

  setTyped('');
  setFade(false);
  type();

  return () => clearTimeout(t);
}, []);



  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText('clingtonleyo@gmail.com');
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  }, []);

  const filteredTechs = useMemo(() => {
    if (selectedTechFilter === 'all') return TECH_STACKS;
    return TECH_STACKS.filter(tech => tech.category === selectedTechFilter);
  }, [selectedTechFilter]);

  const techCategories = useMemo(() => {
    const categories = [...new Set(TECH_STACKS.map(tech => tech.category))];
    return ['all', ...categories];
  }, []);

// Scrollspy: highlight the section whose center crosses a stable view-line
useEffect(() => {
  const navH   = document.querySelector('.neon-nav')?.offsetHeight || 0;
  const OFFSET = 24; // same value you use in handleNavScroll

  const onScroll = () => {
    // If you still use the programmatic guard, keep it:
    if (isProgrammaticRef.current || pendingTargetRef.current) {
    const pending = pendingTargetRef.current;
    if (pending && activeSection !== pending) setActiveSection(pending);
    return;
  }

    const y        = window.scrollY;
    const viewLine = y + navH + OFFSET + Math.round(window.innerHeight * 0.2); 
    // ^ a line ~20% below the top of the viewport, under the fixed nav

    let current = SECTIONS[0];
    let bestDist = Infinity;

    for (const section of SECTIONS) {
      const el = document.getElementById(`${section}-section`);
      if (!el) continue;

      const top    = el.offsetTop;
      const height = el.offsetHeight || 1;
      const mid    = top + height / 2;

      // choose the section whose midpoint is closest to the viewLine,
      // but only when the viewLine is within this section’s bounds
      const bottom = top + height;
      const within = viewLine >= top && viewLine < bottom;
      const dist   = Math.abs(mid - viewLine);

      if (within && dist < bestDist) {
        bestDist = dist;
        current = section;
      }
    }

    setActiveSection(prev => (prev !== current ? current : prev));
    if (window.location.hash !== `#${current}`) {
      window.history.replaceState(null, '', `#${current}`);
    }
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}, [activeSection]);


// Ensure initial hash (if any) scrolls with offset on load
useEffect(() => {
  const hash = window.location.hash.replace('#', '');
  if (SECTIONS.includes(hash)) {
    setTimeout(() => handleNavScroll(hash), 0);
  }
}, [handleNavScroll]);

useEffect(() => {
  // Skip if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const colors = ['var(--cyan)', 'var(--coral)', 'var(--purple)'];
  const MAX_LIVE = 70;       // cap DOM nodes for perf
  const SPARKLES_PER_MOVE = 2;
  let live = 0;
  let lastT = 0;

  const onMove = (e) => {
    const now = performance.now();
    if (now - lastT < 14) return;     // throttle ~70fps
    lastT = now;

    for (let i = 0; i < SPARKLES_PER_MOVE; i++) {
      if (live >= MAX_LIVE) break;

      const el = document.createElement('span');
      el.className = 'cursor-sparkle';

      // size 4–10px
      const size = 4 + Math.random() * 6;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;

      // start at cursor
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;

      // random color from your theme variables
      el.style.background = colors[(Math.random() * colors.length) | 0];

      // random drift (distance 20–60px, any angle)
      const angle = Math.random() * Math.PI * 2;
      const dist = 20 + Math.random() * 40;
      el.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      el.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);

      // slight random duration variation (keeps things organic)
      el.style.animationDuration = `${600 + Math.random() * 250}ms`;

      document.body.appendChild(el);
      live++;

      el.addEventListener(
        'animationend',
        // eslint-disable-next-line no-loop-func
        () => {
          el.remove();
          live--;
        },
        { once: true }
      );
    }
  };

  window.addEventListener('mousemove', onMove, { passive: true });
  return () => window.removeEventListener('mousemove', onMove);
}, []);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loader-container">
          <div className="neon-loader">
            <div className="loader-ring"></div>
            <div className="loader-ring"></div>
            <div className="loader-ring"></div>
          </div>
          <h2 className="loading-text neon-text">Loading Portfolio</h2>
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
        </div>
      </div>
    );
  }

  

  return (
    <div className="neon-portfolio">
      {/* Custom cursor */}
      <div 
        className={`custom-cursor ${cursor.isPointer ? 'pointer' : ''}`}
        style={{ left: cursor.position.x, top: cursor.position.y }}
      />

      {/* Progress bar */}
      <div className="scroll-progress">
        <div className="progress-line" style={{ width: `${scrollProgress}%` }}></div>
      </div>

      <a href="#hero-section" className="skip-link">Skip to content</a>

      {/* Navigation */}
      <nav className="neon-nav enhanced" role="navigation" aria-label="Primary">
        <div className="nav-brand">
          <span className="neon-text glow-text">LEYO's PORTFOLIO</span>
        </div>
        <div className="nav-links" role="tablist" aria-label="Sections">
          {SECTIONS.map((section) => (
            <button
              key={section}
              role="tab"
              aria-selected={activeSection === section}
              aria-controls={section}
              className={`nav-link ${activeSection === section ? 'active' : ''}`}
              onClick={() => handleNavScroll(section)}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      {/* Single-page content (no snap container) */}
      <main>
        {/* Hero */}
        <section id="hero-section" className="section hero-section">
          <div className="hero-aurora-bg" aria-hidden="true"></div>

          <div className="hero-content enhanced">
            <div className="hero-text">
              <h1 className="hero-name">
                <span className="neon-text glow-animation">LEYO JAFFRIN CLINGTON S</span>
              </h1>
              <h2 className="hero-title" aria-live="polite" aria-atomic="true">
                <span className={`typing-text ${fade ? 'fade' : ''}`}>{typed}</span>
<span className="cursor" aria-hidden></span>
                <span className="cursor" aria-hidden>|</span>
              </h2>
              <p className="hero-description enhanced">
                Passionate developer specializing in <span className="highlight">VR/AR</span>, 
                <span className="highlight"> Web Development</span>, and <span className="highlight">Cybersecurity</span>
              </p>

              {/* Enhanced CTAs */}
              <div className="hero-ctas enhanced">
                <a className="btn-neon primary" href={resumePdf} download="Leyo_Jaffrin_Clington_Resume.pdf">
                  <span>Download CV</span>
                  <i className="arrow">→</i>
                </a>
                <a
  className="btn-ghost"
  href="#contact"
  onClick={(e) => { e.preventDefault(); handleNavScroll('contact'); }}
>
  Contact
</a>
              </div>

              <div className="hero-stats enhanced" aria-label="quick stats">
                <div className="stat-item">
                  <span className="stat-number neon-text">8.02</span>
                  <span className="stat-label">CGPA</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number neon-text">161</span>
                  <span className="stat-label">IEEE Rank</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number neon-text">2.5L</span>
                  <span className="stat-label">Funding</span>
                </div>
              </div>
            </div>

          <div className="hero-visual enhanced">
  <div className="neon-circle pulse-animation">
    {/* soft radial backglow */}
    <div className="avatar-backglow" aria-hidden="true"></div>

    {/* main avatar */}
    <div className="inner-circle">
      <img
        src={profileImg}
        alt="Leyo Jaffrin Clington S portrait"
        className="hero-avatar"
        loading="lazy"
      />
      <div className="code-lines">
        <div className="code-line"></div>
        <div className="code-line"></div>
        <div className="code-line"></div>
      </div>
    </div>

    {/* decorative orbits & particles */}
    <span className="avatar-orbit o1" aria-hidden="true"></span>
    <span className="avatar-orbit o2" aria-hidden="true"></span>
    <span className="avatar-orbit o3" aria-hidden="true"></span>
    <span className="avatar-spark dot1" aria-hidden="true"></span>
    <span className="avatar-spark dot2" aria-hidden="true"></span>
    <span className="avatar-spark dot3" aria-hidden="true"></span>
  </div>
</div>

</div> {/* end .hero-content */}
        </section>

        {/* About */}
        <section id="about-section" className="section about-section">
          <div className="section-content">
            <h2 className="section-title neon-text">About Me</h2>
            <div className="about-grid enhanced">
              <div className="about-text">
                <p className="intro-text">
                  Computer Science graduate from <strong>National Engineering College</strong> with 
                  expertise in cutting-edge technologies. I specialize in creating immersive digital 
                  experiences that bridge the gap between imagination and reality.
                </p>
                
                <div className="skills-summary">
                  <div className="skill-category">
                    <h4>🎮 VR/AR Development</h4>
                    <p>Creating immersive experiences with Unity 3D and advanced VR frameworks</p>
                  </div>
                  <div className="skill-category">
                    <h4>🔒 Cybersecurity</h4>
                    <p>Securing digital infrastructures and implementing robust security protocols</p>
                  </div>
                  <div className="skill-category">
                    <h4>💻 Full-Stack Development</h4>
                    <p>Building scalable web applications with modern tech stacks</p>
                  </div>
                </div>

                <div className="achievements enhanced">
                  <h3 className="neon-text">Achievements & Recognition</h3>
                  <div className="achievement-list">
                    {[
                      { icon: '🏆', text: 'CSE Association Secretary 2022-2023', highlight: 'Leadership' },
                      { icon: '🌟', text: 'IEEE Xtreme Global Rank 161', highlight: 'Top 1%' },
                      { icon: '🏀', text: 'Basketball Zonal Winner 2023', highlight: 'Sports' },
                      { icon: '🤝', text: 'Active NSS Participant 2021-2024', highlight: 'Service' }
                    ].map((achievement, idx) => (
                      <div key={idx} className="achievement-item enhanced">
                        <span className="achievement-icon">{achievement.icon}</span>
                        <span className="achievement-text">{achievement.text}</span>
                        <span className="achievement-highlight neon-text">{achievement.highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="tech-stack enhanced">
                <h3 className="neon-text">Technical Arsenal</h3>
                
                <div className="tech-filters">
                  {techCategories.map(category => (
                    <button
                      key={category}
                      className={`filter-btn ${selectedTechFilter === category ? 'active' : ''}`}
                      onClick={() => setSelectedTechFilter(category)}
                    >
                      {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="tech-grid enhanced">
                  {filteredTechs.map((tech, index) => (
                    <div 
                      key={tech.name} 
                      className="tech-item enhanced" 
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="tech-icon">{tech.icon}</div>
                      <div className="tech-info">
                        <span className="tech-name">{tech.name}</span>
                        <ProgressBar value={tech.level} label="" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section id="experience-section" className="section experience-section">
          <div className="section-content">
            <h2 className="section-title neon-text">Professional Journey</h2>
            <div className="timeline enhanced">
              {EXPERIENCES.map((exp, index) => (
                <div
                  key={`${exp.company}-${exp.period}`}
                  className="timeline-item enhanced"
                  style={{ animationDelay: `${index * 0.3}s` }}
                >
                  <div className="timeline-dot enhanced">
                    <span className="company-logo">{exp.logo}</span>
                  </div>
                  <div className="timeline-content enhanced">
                    <div className="exp-header">
                      <h3 className="exp-company neon-text">{exp.company}</h3>
                      <span className="exp-period">{exp.period}</span>
                    </div>
                    <h4 className="exp-role">{exp.role}</h4>
                    <p className="exp-description">{exp.description}</p>
                    
                    <div className="exp-achievements">
                      <h5>Key Achievements:</h5>
                      <ul>
                        {exp.achievements.map((achievement, idx) => (
                          <li key={idx}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="exp-skills">
                      {exp.skills.map((skill) => (
                        <span key={`${exp.company}-${skill}`} className="skill-tag enhanced">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects-section" className="section projects-section">
          <div className="section-content">
            <h2 className="section-title neon-text">Featured Projects</h2>
            <p className="section-subtitle">
              Innovative solutions that push the boundaries of technology
            </p>
            <div className="projects-grid enhanced">
              {PROJECTS.map((project, index) => (
                <ProjectCard key={project.title} project={project} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact-section" className="section contact-section">
          <div className="section-content">
            <h2 className="section-title neon-text">Let's Build Something Amazing</h2>
            <p className="section-subtitle">
              Ready to bring your next project to life? Let's connect!
            </p>
            <div className="contact-content enhanced">
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-label">Email:</span>
                  <div className="contact-row">
                    <a
                      href="mailto:clingtonleyo@gmail.com"
                      className="contact-value neon-text"
                      rel="noopener noreferrer"
                    >
                      clingtonleyo@gmail.com
                    </a>
                    <button className="copy-btn" aria-label="Copy email" onClick={copyEmail}>
                      📋 Copy
                    </button>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Phone:</span>
                  <a href="tel:+916379737437" className="contact-value neon-text">
                    +91 6379737437
                  </a>
                </div>
                <div className="contact-item">
                  <span className="contact-label">GitHub:</span>
                  <a
                    href="https://github.com/LeyoJAFF"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-value neon-text"
                  >
                    github.com/LeyoJAFF
                  </a>
                </div>
                <div className="contact-item">
                  <span className="contact-label">LinkedIn:</span>
                  <a
                    href="https://www.linkedin.com/in/leyo-jaffrin-clington-s"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-value neon-text"
                  >
                    linkedin.com/in/leyo-jaffrin-clington-s
                  </a>
                </div>
              </div>
              
              <div className="contact-visual enhanced">
                <div className="contact-animation">
                  <div className="floating-icon code">💻</div>
                  <div className="floating-icon rocket">🚀</div>
                  <div className="floating-icon energy">⚡</div>
                  <div className="floating-icon fire">🔥</div>
                </div>
                <div className="contact-cta">
                  <a 
                    href="mailto:clingtonleyo@gmail.com" 
                    className="btn-neon primary large"
                  >
                    <span>Start a Project</span>
                    <i className="arrow">→</i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Enhanced Background Effects */}
      <div className="bg-effects enhanced" aria-hidden>
        <div className="grid-lines animated"></div>
        <div className="floating-particles">
          {particles.map((p) => (
            <div
              key={p.id}
              className="particle enhanced"
              style={{ 
                left: p.left, 
                animationDelay: p.delay, 
                animationDuration: p.duration,
                width: `${p.size}px`,
                height: `${p.size}px`,
                opacity: p.opacity
              }}
            />
          ))}
        </div>
        <div className="nebula-bg"></div>
      </div>

      {/* Floating action button */}
      <div className="floating-actions">
        <button 
          className="fab"
          onClick={() => handleNavScroll('hero')}
          aria-label="Back to top"
        >
          ↑
        </button>
      </div>
    </div>
  );
};

export default NeonPortfolio;
