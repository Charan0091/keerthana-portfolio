import { useEffect, useMemo, useRef, useState } from "react";
import {
  beyond,
  contactDetails,
  interests,
  journey,
  learningAreas,
  navItems,
  personal,
  socialLinks,
} from "./data";

const LINKEDIN_PATTERN = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[A-Za-z0-9-_%]+\/?$/i;

function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastSubmittedName, setLastSubmittedName] = useState("");
  const [formData, setFormData] = useState({ name: "", linkedin: "", message: "" });
  const [errors, setErrors] = useState({});
  const sectionRefs = useRef([]);

  const initials = useMemo(() => "PK", []);

  useEffect(() => {
    const sections = sectionRefs.current.filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id || "home");
      },
      { threshold: [0.2, 0.45, 0.7] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches);
    updateMotionPreference();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateMotionPreference);
      return () => mediaQuery.removeEventListener("change", updateMotionPreference);
    }

    mediaQuery.addListener(updateMotionPreference);
    return () => mediaQuery.removeListener(updateMotionPreference);
  }, []);

  useEffect(() => {
    const handlePointerMove = (event) => {
      setCursor({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const revealElements = document.querySelectorAll(".reveal");
    if (!revealElements.length) return undefined;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
    return () => revealObserver.disconnect();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Please enter your name.";
    }

    if (!formData.linkedin.trim()) {
      nextErrors.linkedin = "Please add your LinkedIn profile.";
    } else if (!LINKEDIN_PATTERN.test(formData.linkedin.trim())) {
      nextErrors.linkedin = "Please provide a valid LinkedIn URL.";
    }

    if (formData.message.trim().length > 300) {
      nextErrors.message = "Message should be under 300 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const safeName = formData.name.trim();
    setLastSubmittedName(safeName);
    setSubmitted(true);
    setFormData({ name: "", linkedin: "", message: "" });
  };

  return (
    <div className="app-shell" aria-live="polite">
      <div
        className="cursor-glow"
        aria-hidden="true"
        style={{
          transform: `translate(${cursor.x - 18}px, ${cursor.y - 18}px)`,
          opacity: reducedMotion ? 0 : 1,
        }}
      />

      <header className="topbar">
        <nav className="nav container" aria-label="Main navigation">
          <a href="#home" className="brand" aria-label="Penugonda Keerthana home">
            {initials}
          </a>

          <div className="nav-links desktop-nav" aria-label="Navigation items">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={activeSection === item.href.replace("#", "") ? "active" : ""}
              >
                {item.label}
              </a>
            ))}
            <a href="#contact" className="nav-cta">
              LET'S CONNECT
            </a>
          </div>

          <button
            type="button"
            className="menu-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </nav>

        {menuOpen && (
          <div className="mobile-nav" aria-label="Mobile navigation menu">
            <div className="mobile-nav-inner container">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </a>
              ))}
              <a href="#contact" className="mobile-connect" onClick={() => setMenuOpen(false)}>
                LET'S CONNECT
              </a>
            </div>
          </div>
        )}
      </header>

      <main>
        <section id="home" className="hero section container" ref={(node) => { sectionRefs.current[0] = node; }}>
          <div className="hero-copy">
            <span className="eyebrow">B.Tech IT • Year 01 • Hyderabad, India</span>
            <h1>
              <span className="display-name">PENUGONDA</span>
              <span className="display-name block">KEERTHANA</span>
            </h1>
            <p className="tagline">{personal.tagline}</p>
            <p className="hero-intro">{personal.intro}</p>

            <div className="button-row">
              <a href="#journey" className="button primary">
                EXPLORE MY JOURNEY
              </a>
              <a href="#contact" className="button secondary">
                LET'S CONNECT
              </a>
            </div>
          </div>

          <div className="hero-visual" aria-label="Abstract design visual">
            <div className="geometry-frame">
              <div className="grid-surface" aria-hidden="true" />
              <div className="orbit orbit-one" aria-hidden="true" />
              <div className="orbit orbit-two" aria-hidden="true" />
              <div className="coordinate-card">
                <span>NOW</span>
                <strong>{personal.education}</strong>
                <small>{personal.major}</small>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section container" ref={(node) => { sectionRefs.current[1] = node; }}>
          <div className="section-heading">
            <span className="eyebrow">01 — WHO I AM</span>
            <h2>The person behind the screen.</h2>
          </div>

          <div className="about-layout">
            <div className="story-panel reveal">
              <p>{personal.story}</p>
            </div>

            <div className="meta-stack reveal">
              <div className="meta-item">
                <span>EDUCATION</span>
                <strong>{personal.education}</strong>
              </div>
              <div className="meta-item">
                <span>MAJOR</span>
                <strong>{personal.major}</strong>
              </div>
              <div className="meta-item">
                <span>LOCATION</span>
                <strong>{personal.location}</strong>
              </div>
            </div>
          </div>
        </section>

        <section id="journey" className="section container" ref={(node) => { sectionRefs.current[2] = node; }}>
          <div className="section-heading">
            <span className="eyebrow">MY JOURNEY</span>
            <h2>Learning one step at a time.</h2>
          </div>

          <div className="journey-list" aria-label="Personal journey timeline">
            {journey.map((item, index) => (
              <article key={item.id} className="journey-item reveal" style={{ transitionDelay: `${index * 100}ms` }}>
                <div className="journey-number">{item.id}</div>
                <div className="journey-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="learning" className="section container" ref={(node) => { sectionRefs.current[3] = node; }}>
          <div className="section-heading">
            <span className="eyebrow">CURRENTLY LOADING...</span>
            <h2>What’s on my mind right now.</h2>
          </div>

          <div className="learning-grid reveal">
            {learningAreas.map((item, index) => (
              <div key={`${item.label}-${item.status}`} className="learning-item" style={{ transitionDelay: `${index * 40}ms` }}>
                <span className="learning-label">{item.label}</span>
                <span className="learning-status">{item.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="interests" className="section container" ref={(node) => { sectionRefs.current[4] = node; }}>
          <div className="section-heading">
            <span className="eyebrow">MY INTERESTS</span>
            <h2>What keeps me curious.</h2>
          </div>

          <div className="interest-words" aria-label="Areas of interest">
            {interests.map((interest, index) => (
              <span key={interest} style={{ animationDelay: `${index * 120}ms` }}>
                {interest}
              </span>
            ))}
          </div>
        </section>

        <section className="section container philosophy-section">
          <div className="section-heading narrow-heading">
            <span className="eyebrow">ONE STEP AT A TIME</span>
            <h2>I’m learning, not rushing.</h2>
          </div>

          <div className="philosophy-copy reveal">
            <p>{personal.philosophy}</p>
          </div>
        </section>

        <section className="section container beyond-section">
          <div className="section-heading narrow-heading">
            <span className="eyebrow">BEYOND THE SCREEN</span>
            <h2>There’s more to me than the technologies I’m learning.</h2>
          </div>

          <div className="beyond-grid reveal" aria-label="Values and traits">
            {beyond.map((item) => (
              <div key={item} className="beyond-pill">{item}</div>
            ))}
          </div>
        </section>

        <section className="section container why-it-section">
          <div className="section-heading">
            <span className="eyebrow">WHY INFORMATION TECHNOLOGY?</span>
            <h2>Because ideas can become real things.</h2>
          </div>

          <div className="why-it-copy reveal">
            <p>{personal.whyIt}</p>
          </div>
        </section>

        <section id="vision" className="section container" ref={(node) => { sectionRefs.current[5] = node; }}>
          <div className="section-heading narrow-heading">
            <span className="eyebrow">NEXT CHAPTER</span>
            <h2>Where I’m heading.</h2>
          </div>

          <div className="vision-copy reveal">
            <p>{personal.vision}</p>
          </div>
        </section>

        <section id="contact" className="section container contact-section" ref={(node) => { sectionRefs.current[6] = node; }}>
          <div className="connect-panel reveal">
            <div className="connect-copy">
              <span className="eyebrow">YOU MADE IT THIS FAR.</span>
              <h2>Let's connect.</h2>
            </div>

            <form className="connect-form" onSubmit={handleSubmit} noValidate>
              <label>
                <span>NAME</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  aria-invalid={!!errors.name}
                />
                {errors.name && <small>{errors.name}</small>}
              </label>

              <label>
                <span>LINKEDIN</span>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://www.linkedin.com/in/yourname"
                  aria-invalid={!!errors.linkedin}
                />
                {errors.linkedin && <small>{errors.linkedin}</small>}
              </label>

              <label>
                <span>OPTIONAL MESSAGE</span>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Say hello..."
                />
                {errors.message && <small>{errors.message}</small>}
              </label>

              <button type="submit" className="button primary connect-button">
                CONNECT WITH KEERTHANA
              </button>

              {submitted && (
                <div className="success-state" role="status" aria-live="polite">
                  <p>Thanks for stopping by, {lastSubmittedName}.</p>
                  <strong>Let's stay connected.</strong>
                </div>
              )}
            </form>
          </div>
        </section>

        <section className="container final-cta">
          <div className="final-cta-inner reveal">
            <span className="eyebrow">THE STORY IS JUST BEGINNING.</span>
            <h2>Want to connect, exchange ideas or simply say hello?</h2>
            <div className="final-actions">
              <a href={`mailto:${contactDetails.email}`} className="button primary">
                EMAIL ME
              </a>
              <a href="#contact" className="button secondary">
                CONNECT
              </a>
            </div>

            <div className="contact-strip">
              <div>
                <span>Email</span>
                <strong>{contactDetails.email}</strong>
              </div>
              <div>
                <span>LinkedIn</span>
                <strong>{contactDetails.linkedin}</strong>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-row">
          <div className="footer-mark" aria-label="Penugonda Keerthana initials">{initials}</div>
          <div className="footer-links">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer noopener" : undefined}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
