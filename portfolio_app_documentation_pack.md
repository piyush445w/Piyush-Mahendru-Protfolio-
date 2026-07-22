# Portfolio Web App — Documentation & Design Specification
**Subject:** Piyush Mahendru — Machine Learning Engineer / B.Sc. IT (GNA University)
**Target stack:** Python (Flask) + HTML5/CSS3 + JavaScript · Single-Page Application

---

## Notes on Sources & Assumptions

Your two resume files disagree slightly on per-project tooling (e.g., the AI Diagnostic project lists Docker/AWS in one version but not the other; XGBoost/Tableau/PyTorch/R appear only in the more detailed version). I synthesized the **union of both**, since the more detailed version's tooling is exactly what you asked the tech stack section to reflect (XGBoost, Docker, AWS). Flagging where I made a call so you can correct anything:

| Item | What I did | Why |
|---|---|---|
| Project tool tags | Used the fuller list (adds XGBoost/Tableau to A.U.R.A.; Docker/AWS to the Diagnostic Assistant; Plotly/Dash to the BI dashboard) | Matches your requested tech-stack section; more specific and recruiter-friendly |
| Education section | Kept your **actual** structure: 1 university entry (GNA University, B.Sc. IT, expected 2026) + 2 school entries (GMT International School — Senior Secondary 2023, Secondary 2021) | Your brief asked for "2 GNA experiences + 1 other school," but neither resume supports a second GNA entry. Rather than invent one, I used what's documented — tell me if you actually meant something like "GNA University coursework highlights" as a second card |
| Contact form backend | Left as an **open choice** (see §6, §7) between (a) no-DB email-forward via Flask-Mail, or (b) MySQL-backed message store | Neither resume nor your brief specifies whether you want stored inbound messages; defaulting recommendation to (a) — simplest, no PII sitting in a DB |
| Certifications | Included all three found across both resumes (Data Science Professional Certificate, Advanced Python Programming Certification, IBM SkillsBuild Data Analytics Certificate) | Union of both documents |
| Employer / work history | Omitted — no employer data exists in either resume (this is a project/academic profile) | Per your instruction not to invent personal details |
| Phone / email / links | Used exactly as in your resume (no invention) | +91-7986086946, piyushmahendru534@gmail.com, linkedin.com/in/piyush-mahendru-34275271, github.com/piyushmahendru |

Anything marked **`[PLACEHOLDER]`** below still needs your input.

---

## 1. Project Overview

### Purpose
A single-page, portfolio web application that presents Piyush as a Machine Learning Engineer to recruiters, hiring managers, and technical collaborators — optimized for a fast first impression, credible proof of skill (via project metrics), and a low-friction path to contact.

### Target Audience
- **Primary:** Technical recruiters and hiring managers screening ML/Data Science candidates
- **Secondary:** Engineering leads/interviewers doing a deeper technical review before an interview
- **Tertiary:** Peers, professors, or collaborators evaluating project work

### Success Criteria
- Recruiter can identify role fit, top 3 skills, and 1 standout metric within **10 seconds** of landing (hero + skills strip)
- All 3 flagship projects are scannable in under **60 seconds** with clear problem → approach → metric framing
- Contact action (email, LinkedIn, resume download) reachable in **≤ 2 clicks** from any scroll position
- Site scores **90+** on Lighthouse Performance & Accessibility
- Works fully on mobile (360px) through desktop (1920px+) with no layout breakage
- Content (projects, skills, certs) is updatable by editing **one data file**, with no template code changes required

### Key Features
- Animated hero with role/tagline and primary CTAs (View Projects, Contact, Download Résumé)
- Scroll-spy navigation bar with smooth-scroll anchors
- Skills section grouped by category (Languages, ML/DS Libraries, Visualization, Databases, Tools) rendered as interactive chips
- Projects section with card-based layout, hover reveal of tech tags, and modal/detail expansion per project
- Education timeline (university + school stages)
- Certifications strip/badges
- Metrics/impact highlights (89% accuracy, 91% AUC, 22% ROI, 50K+ records) as animated counters
- Contact section with form + direct links (email, LinkedIn, GitHub)
- Scroll-triggered reveal animations and micro-interactions throughout
- Fully responsive, keyboard-navigable, reduced-motion aware

---

## 2. Information Architecture + Page Structure

Single-page app (SPA-style scroll experience) with anchored sections. Flask renders one template; content is data-driven.

### Section-by-Section Outline

| # | Section | Anchor | Purpose |
|---|---|---|---|
| 1 | Navbar (sticky) | `#top` | Logo/name, section links, resume download, theme toggle (optional) |
| 2 | Hero | `#hero` | Name, title, one-line value prop, CTAs, subtle animated background |
| 3 | About / Summary | `#about` | Resume summary paragraph, quick facts (location, availability, focus areas) |
| 4 | Skills | `#skills` | Categorized chip grid: Languages, Libraries/Frameworks, Visualization, Databases, Tools/Platforms |
| 5 | Projects | `#projects` | 3 flagship project cards with expandable detail (modal or accordion) |
| 6 | Metrics/Impact strip | `#impact` | Animated counters: 89% / 91% / 22% / 50K+ |
| 7 | Education | `#education` | Timeline: GNA University → Senior Secondary → Secondary |
| 8 | Certifications | `#certifications` | Badge/card row for the 3 certifications |
| 9 | Contact | `#contact` | Form + direct contact links + location |
| 10 | Footer | `#footer` | Copyright, quick links, socials |

### Navigation Behavior
- **Sticky navbar** that condenses (height/opacity shift) after scrolling past hero
- **Scroll-spy:** active nav link updates via `IntersectionObserver` watching each `<section>`
- **Smooth scrolling:** CSS `scroll-behavior: smooth` with JS fallback and header-offset compensation (`scroll-margin-top`)
- **Mobile:** nav collapses into a hamburger/drawer; scroll-spy still drives active state
- Deep-linkable anchors (`/#projects`) so a recruiter can be sent a direct link to a section

---

## 3. User Flow / Workflow

### 3.1 Recruiter Browsing Flow
```
Land on Hero
   │
   ├─ Skim summary (About)
   │
   ├─ Scan Skills chips (keyword match against JD)
   │
   ├─ Scroll to Projects
   │     ├─ Read card summary (problem + metric)
   │     └─ Click "View details" → modal opens with full description, stack, links
   │
   ├─ Glance at Impact metrics strip
   │
   ├─ Check Education / Certifications (credibility check)
   │
   └─ Contact: click email / LinkedIn OR fill contact form → confirmation state
```

### 3.2 Project Deep-Dive Flow (technical reviewer)
```
Click project card → Modal/expanded view opens
   │
   ├─ Problem statement
   ├─ Approach / architecture (e.g., CNN-LSTM hybrid)
   ├─ Tech stack tags
   ├─ Metrics (accuracy/AUC/ROI) with brief methodology note
   └─ Links: GitHub repo [PLACEHOLDER per-project repo URL], live demo if any [PLACEHOLDER]
Close modal → returns to same scroll position (state preserved)
```

### 3.3 Contact Flow
```
User fills form (name, email, message)
   │
   ├─ Client-side validation (required fields, email format)
   ├─ Submit → Flask route (POST /contact)
   │     ├─ Server-side validation + spam check (honeypot field / rate limit)
   │     ├─ Option A: send via Flask-Mail → your inbox (no storage)
   │     └─ Option B: persist to MySQL `messages` table + optional email notify
   └─ Success/failure feedback shown inline (no page reload — fetch/AJAX)
```

### 3.4 Admin / Content Update Workflow (how you update the site)
Since there's no CMS or database for portfolio content, updates happen by editing a single structured data file:

```
1. Open /data/content.py (or content.yaml/json)
2. Edit relevant dict: PROJECTS / SKILLS / EDUCATION / CERTIFICATIONS
3. Save file
4. Run locally: flask run  → verify in browser (localhost:5000)
5. Commit + push to GitHub (git add . && git commit -m "update: add project X" && git push)
6. Redeploy:
     - Docker: docker build + docker push → restart container on host
     - AWS CodeDeploy: push triggers pipeline → auto-redeploy (if configured)
```
No database migration, no template edits, no rebuild step beyond a redeploy — this is intentional so content changes are a **5-minute task**.

---

## 4. Data Flow Diagrams (DFD)

Because this is a static-content-first portfolio (no primary database), the "data store" is a structured content file (Python dict / JSON / YAML), with an *optional* MySQL store used only for the contact-form path.

### 4.1 Context Diagram (Level 0)

```
                    ┌─────────────────────────┐
   (Visitor/         │                         │
    Recruiter) ─────▶│   PORTFOLIO WEB APP     │◀───── (Site Owner /
     Browser          │   (Flask + Frontend)   │        Piyush, via
                    │                         │        content file edits)
                    └───────────┬─────────────┘
                                │
                                ▼
                    ┌─────────────────────────┐
                    │  Optional: Email /       │
                    │  MySQL (contact messages)│
                    └─────────────────────────┘
```
**External entities:** Visitor (browser), Site Owner (content editor)
**Process:** Portfolio Web App (single process at Level 0)
**Data store:** Content store (static) + optional contact-message store

### 4.2 Level 1 DFD

```
[Visitor] ──(HTTP GET /)──▶ (P1: Render Page)
                                   │
                                   ▼
                         (D1: Content Store — content.py/json/yaml:
                          projects, skills, education, certifications)
                                   │
                                   ▼
                         (P1 renders template) ──▶ [Visitor: HTML/CSS/JS]

[Visitor] ──(HTTP GET /api/projects, /api/skills — optional JSON endpoints)──▶
                         (P2: Serve Content API) ──▶ (D1) ──▶ [Visitor: JSON for dynamic rendering]

[Visitor] ──(HTTP POST /contact: name, email, message)──▶
                         (P3: Validate & Process Contact)
                             │
                             ├─▶ (D2: Message Store — MySQL, optional) [write]
                             └─▶ (P4: Send Notification Email via Flask-Mail/SMTP)
                                        │
                                        ▼
                                 [Site Owner's inbox]
                         (P3) ──▶ [Visitor: success/failure response]

[Site Owner] ──(edits content.py locally)──▶ (D1: Content Store) ──(git push + deploy)──▶ (P1/P2 pick up new content on next request/restart)
```

**Processes:** P1 Render Page · P2 Serve Content API (optional, for JS-driven rendering) · P3 Validate & Process Contact · P4 Send Notification Email
**Data stores:** D1 Content Store (static, file-based) · D2 Message Store (optional, MySQL)
**External entities:** Visitor, Site Owner, (optional) Email provider/SMTP

---

## 5. System Design / Architecture

### 5.1 High-Level Architecture

```
┌───────────────────────────┐        ┌──────────────────────────────┐
│         Client            │  HTTP  │         Flask Server          │
│  HTML5 + CSS3 + Vanilla JS│◀──────▶│  Routes → Templates (Jinja2)  │
│  (scroll-spy, animations, │        │  Blueprints: main, api,       │
│   modals, form validation)│        │  contact                      │
└───────────────────────────┘        └───────────┬──────────────────┘
                                                  │
                                   ┌──────────────┼───────────────────┐
                                   ▼              ▼                   ▼
                          ┌────────────────┐ ┌──────────────┐ ┌──────────────────┐
                          │ Content Layer  │ │ Contact Layer│ │ Analytics (opt.)  │
                          │ content.py /   │ │ Flask-Mail / │ │ Plausible / GA /  │
                          │ JSON/YAML      │ │ MySQL (opt.) │ │ self-hosted event │
                          │ (no DB needed) │ │              │ │ log                │
                          └────────────────┘ └──────────────┘ └──────────────────┘
```

### 5.2 Module Breakdown

```
portfolio_app/
├── app.py                  # App factory, config, blueprint registration
├── config.py                # Env-based config (dev/prod)
├── data/
│   └── content.py           # Single source of truth: PROJECTS, SKILLS, EDUCATION, CERTS, PROFILE
├── routes/
│   ├── main.py               # "/" (renders index.html)
│   ├── api.py                # optional "/api/*" JSON endpoints (for JS fetch-driven sections)
│   └── contact.py            # "/contact" POST handler
├── models/                   # only if MySQL contact-store is used
│   └── message.py            # SQLAlchemy model: ContactMessage
├── templates/
│   ├── base.html
│   ├── index.html            # includes all sections via Jinja includes/partials
│   └── partials/
│       ├── _hero.html, _about.html, _skills.html, _projects.html,
│       └── _education.html, _certifications.html, _contact.html
├── static/
│   ├── css/ (main.css, animations.css)
│   ├── js/ (scrollspy.js, reveal.js, modal.js, form.js, counters.js)
│   └── img/ (project screenshots, icons)
├── tests/
│   ├── test_routes.py
│   └── test_contact.py
├── requirements.txt
├── Dockerfile
└── .github/workflows/deploy.yml   # CI/CD (optional)
```

### 5.3 Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | First Contentful Paint < 1.5s on 4G; total page weight < 1.5MB; lazy-load project images; defer non-critical JS |
| **Scalability** | Static-content architecture means near-zero server load; Flask app can run on smallest tier (e.g., single small EC2/Elastic Beanstalk instance or even serverless via a WSGI adapter) |
| **Accessibility** | WCAG 2.1 AA: semantic HTML5, ARIA labels on interactive components, full keyboard navigation, visible focus states, `prefers-reduced-motion` support |
| **Security** | CSRF protection on contact form (Flask-WTF), input sanitization, rate-limiting on `/contact` (Flask-Limiter), HTTPS-only in production, no secrets in repo (use env vars) |
| **Maintainability** | Content changes require editing exactly one data file; no template logic changes needed for routine updates |
| **Browser support** | Latest 2 versions of Chrome, Firefox, Safari, Edge; graceful degradation of animations on older browsers |
| **SEO** | Semantic headings, meta description/OG tags, sitemap.xml, structured data (Person + CreativeWork schema.org) |

---

## 6. Tech Stack

| Layer | Technology | Justification | Viable Alternative |
|---|---|---|---|
| **Markup/Styling** | HTML5 (semantic) + CSS3 (Grid/Flexbox, custom properties, keyframe animations) | No framework overhead for a single page; full control over the animated "interactive" feel you want | Tailwind CSS (utility-first, faster iteration, slightly less "bespoke" feel) |
| **Interactivity** | Vanilla JavaScript (ES6+): IntersectionObserver for scroll-spy/reveal, small modal/counter modules | Keeps bundle tiny, avoids build tooling, matches "no heavy external UI frameworks" preference | Alpine.js (declarative sprinkles of interactivity without a build step) |
| **Backend** | Python + Flask | Matches your core language (Python) and lets the same person who does ML work own the whole stack; Jinja2 templating keeps content server-rendered and SEO-friendly | FastAPI (if you want async/auto-docs; overkill for a static-content site) |
| **Data/Analytics tools reflected in content, not runtime** | Power BI, Pandas, Matplotlib, Plotly.js, Jupyter, TensorFlow, Scikit-learn, XGBoost | These are **your project skills**, showcased via project descriptions, embedded chart images/exports, or a live Plotly.js chart reproducing a project's key visualization | Embed a static Plotly.js chart (exported from your actual project notebooks) for a genuinely interactive, on-brand touch in the Projects section |
| **DevOps — Containerization** | Docker | Portable, reproducible deployment; matches your Multi-Disease Prediction project's existing Docker usage | Podman (drop-in alternative, less common in hiring contexts) |
| **DevOps — Source control/CI** | GitHub (+ GitHub Actions optional) | Already your platform of record; enables automated build/test/deploy on push | GitLab CI (if you migrate repos) |
| **DevOps — Deployment** | AWS CodeDeploy **(optional)**, or simpler: AWS Elastic Beanstalk / a single EC2 + Nginx+Gunicorn, or Render/Railway for a zero-ops option | CodeDeploy fits if you want to demonstrate AWS deployment pipeline skills (relevant since your AI Diagnostic project already deployed to AWS); simpler PaaS options reduce ops overhead for a personal site | Render, Railway, or Fly.io (near-zero DevOps for a portfolio-scale app) |
| **Database** | MySQL — **optional**, used only if you want to persist contact-form submissions or add a future blog/CMS | Not required for the core portfolio content (that lives in a static data file); including it demonstrates your MySQL skill and gives you an actual reason to write a small schema | SQLite (zero-config, fine for low-traffic contact storage) or skip entirely and use Flask-Mail |
| **OOP / language paradigm** | Python's class-based structure used for: Flask Blueprint organization, a `Project`/`SkillGroup`/`EducationEntry` dataclass model in `content.py`, and (if MySQL used) SQLAlchemy ORM models | Demonstrates "object-oriented languages" skill directly in the codebase — content isn't just raw dicts, it's typed dataclasses/objects, which is also easier to validate and extend | Plain dicts + JSON Schema validation (simpler, less OOP demonstration) |

**Recommended default (lowest effort, still hits every required tech):** Flask + Jinja2 + vanilla JS/CSS, content as Python dataclasses in `content.py`, Docker for packaging, GitHub Actions for CI, deploy via Elastic Beanstalk or a single EC2 instance (CodeDeploy as a stretch goal to demonstrate the pipeline), MySQL only if you decide the contact form should persist messages — otherwise Flask-Mail and skip the DB entirely.

---

## 7. Data Model

Even though the primary content is static/file-based, here is a minimal schema — usable whether you keep it as Python dataclasses/JSON or eventually move to MySQL.

### 7.1 Entities (ERD, text-based)

```
Project                        Skill                       SkillCategory
────────────────               ─────────────               ─────────────────
id (PK)                        id (PK)                     id (PK)
title                          name                        name  (e.g. "Libraries & Frameworks")
summary                        category_id (FK) ───────────▶ id
problem_statement
approach
tech_stack (list<string>)
metrics (list<{label,value}>)
repo_url [PLACEHOLDER]
demo_url [PLACEHOLDER]
image_path
order

EducationEntry                 Certification               ContactMessage (optional, MySQL)
─────────────────              ─────────────                ──────────────────────────────────
id (PK)                        id (PK)                      id (PK)
institution                    title                        name
degree_or_level                issuer                       email
start_date                     date_earned [PLACEHOLDER]    message
end_date                       credential_url [PLACEHOLDER] submitted_at (timestamp)
order                          order                        is_spam (bool, for honeypot flag)
```

**Relationships:**
- `Skill` → `SkillCategory` : many-to-one
- `Project`, `EducationEntry`, `Certification` are independent top-level entities (no FK dependencies), each with an `order` field to control display sequence
- `ContactMessage` has no relationship to other entities — it's a standalone inbound log, only instantiated if you choose the MySQL option

### 7.2 Content Store Shape (if kept file-based — recommended default)

```python
# data/content.py — single source of truth
PROFILE = {
    "name": "Piyush Mahendru",
    "title": "Machine Learning Engineer",
    "location": "Ludhiana, Punjab, India",
    "phone": "+91-7986086946",
    "email": "piyushmahendru534@gmail.com",
    "linkedin": "https://linkedin.com/in/piyush-mahendru-34275271",
    "github": "https://github.com/piyushmahendru",
    "resume_pdf": "/static/files/Piyush_Mahendru_Resume.pdf"
}

SKILLS = {
    "Programming Languages": ["Python", "C++", "SQL", "R"],
    "Libraries & Frameworks": ["Pandas", "NumPy", "Scikit-learn", "TensorFlow", "PyTorch", "XGBoost", "Flask"],
    "Data Visualization": ["Power BI", "Tableau", "Matplotlib", "Seaborn", "Plotly", "Dash"],
    "Databases": ["MySQL"],
    "Tools & Platforms": ["Git", "GitHub", "Jupyter Notebook", "VS Code"]
}

PROJECTS = [
    {
        "title": "A.U.R.A — Academic Understanding and Retention Analysis",
        "summary": "Student retention prediction system with automated dashboards.",
        "tech_stack": ["Python", "XGBoost", "Tableau", "SQL"],
        "metrics": [{"label": "Accuracy", "value": "89%"}, {"label": "Records processed", "value": "50K+"}]
    },
    {
        "title": "Multi-Disease Prediction System — AI Diagnostic Assistant",
        "summary": "Hybrid CNN-LSTM model for diabetes, cardiovascular, and Parkinson's detection.",
        "tech_stack": ["TensorFlow", "Keras", "Flask", "Docker", "AWS"],
        "metrics": [{"label": "Average AUC", "value": "91%"}]
    },
    {
        "title": "Predictive Analytics Dashboard — Business Intelligence",
        "summary": "RFM segmentation and time series forecasting for customer transactions.",
        "tech_stack": ["Python", "Scikit-learn", "Plotly", "Dash", "SQL"],
        "metrics": [{"label": "Campaign ROI improvement", "value": "22%"}]
    }
]

EDUCATION = [
    {"institution": "GNA University, Punjab", "degree": "B.Sc. Information Technology", "period": "Expected 2026"},
    {"institution": "GMT International School", "degree": "Senior Secondary (12th Grade)", "period": "2023"},
    {"institution": "GMT International School", "degree": "Secondary (10th Grade)", "period": "2021"}
]

CERTIFICATIONS = [
    {"title": "Data Science Professional Certificate", "issuer": "Techcadd Ludhiana"},
    {"title": "Advanced Python Programming Certification", "issuer": "ExcelR EdTech"},
    {"title": "IBM SkillsBuild Data Analytics Certificate", "issuer": "IBM SkillsBuild"}
]
```

---

## 8. UI/UX Design Spec

### 8.1 Visual Style Guide

**Concept:** Dark, technical, "data console" aesthetic that reflects an ML engineer's toolkit — confident but not gimmicky.

| Token | Value | Notes |
|---|---|---|
| Background (base) | `#0B0E14` | Near-black, slight blue undertone |
| Surface (cards) | `#131722` | One step up from base for elevation |
| Primary accent | `#3DDC97` (signal green) or `#00B4D8` (data-blue) — pick one | Used for CTAs, active nav state, chart accents |
| Secondary accent | `#F4A261` (warm amber) | Used sparingly for metric highlights/badges |
| Text — primary | `#E6E8EC` | High-contrast body text |
| Text — muted | `#9AA3B2` | Captions, secondary labels |
| Success/Error (form) | `#3DDC97` / `#E5484D` | Form validation states |
| Font — Display/Headings | "Space Grotesk" or "Sora" (variable weight) | Technical, modern geometric sans |
| Font — Body | "Inter" | High legibility at small sizes |
| Font — Monospace (code/metrics) | "JetBrains Mono" | Used for stat counters and tech-tag chips |
| Spacing scale | 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px | Consistent rhythm across sections |
| Corner radius | 8px (cards), 999px (chips/pills) | |
| Section max-width | 1140px, centered, 24px side padding on mobile | |

### 8.2 Component List
- **Navbar:** logo/initials mark, anchor links, resume-download button, scroll-progress underline
- **Hero:** animated headline (letter/word reveal), subtitle, dual CTA buttons, subtle animated background (particle grid or gradient mesh reacting lightly to mouse position)
- **Skill chips:** pill-shaped, grouped by category, hover = slight lift + accent border
- **Project cards:** image/visual header, title, 1-line summary, tech tag chips, metric badge, "View details" trigger
- **Project modal/expanded view:** full description, tech stack, metrics, external links (GitHub/demo), close via ✕, `Esc`, or backdrop click
- **Metric counters:** large monospace numbers that count up on scroll-into-view
- **Education timeline:** vertical line with node markers, entries alternate or stack depending on viewport
- **Certification badges:** small card row, icon + title + issuer
- **Contact form:** floating-label inputs, inline validation states, submit button with loading/success micro-animation
- **Footer:** minimal, quick links + social icons

### 8.3 Animation / Interaction Plan

| Interaction | Behavior |
|---|---|
| **Scroll reveal** | Sections/cards fade + translateY(16px→0) on entering viewport via IntersectionObserver; staggered for grids (skills, project cards) |
| **Hover effects** | Cards: subtle scale(1.02) + shadow lift; chips: border-color shift to accent; buttons: fill/underline sweep |
| **Nav scroll-spy** | Active link gets accent color + animated underline that slides between links |
| **Metric counters** | Count from 0 to target value over ~1.2s using `requestAnimationFrame`, triggered once on scroll-into-view |
| **Hero background** | Low-opacity animated gradient or particle mesh; mouse-move parallax on desktop only (disabled on touch) |
| **Modal open/close** | Scale + fade transition (~200ms), backdrop blur |
| **Micro-interactions** | Button press = slight scale-down; form success = checkmark animation; copy-to-clipboard on email icon = brief "Copied!" tooltip |

### 8.4 Accessibility Requirements
- All interactive elements reachable and operable via keyboard (`Tab`, `Enter`, `Esc` for modal close)
- Visible focus outlines (never `outline: none` without a replacement focus style)
- Color contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text, against the dark background
- `prefers-reduced-motion: reduce` media query disables/simplifies scroll-reveal, parallax, and counters (values appear instantly instead of animating)
- Semantic landmarks: `<nav>`, `<main>`, `<section aria-label="...">`, `<footer>`
- Form fields have associated `<label>`s and `aria-describedby` for error messages
- Modal uses `role="dialog"`, `aria-modal="true"`, and traps focus while open

---

## 9. Content Plan

### 9.1 Presenting Projects / ML-DS Work
Each project card/modal follows a consistent narrative arc so a non-technical recruiter and a technical reviewer both get value:

1. **One-line hook** (what it does, in plain English)
2. **Problem** (1-2 sentences — what gap it solves)
3. **Approach** (key technique — e.g., "hybrid CNN-LSTM architecture combining convolutional feature extraction with sequential modeling")
4. **Stack** (tech tags)
5. **Result** (the headline metric, bolded)
6. **Optional visual:** an embedded static chart image or a lightweight Plotly.js reproduction of a key chart from the actual project (e.g., feature importance for A.U.R.A., ROC curve for the Diagnostic Assistant, RFM segment scatter for the BI dashboard) — this directly showcases your Pandas/Matplotlib/Plotly skills as *evidence*, not just a listed skill

### 9.2 Education Section
Presented as a simple vertical timeline, most recent/highest level first:
1. **GNA University, Punjab** — B.Sc. Information Technology — *Expected 2026*
2. **GMT International School** — Senior Secondary (12th Grade) — *2023*
3. **GMT International School** — Secondary (10th Grade) — *2021*

*(If you intended a distinct second GNA-related entry — e.g., a specific specialization, honors project, or relevant coursework — send details and I'll add it as a 4th timeline node rather than duplicating the degree entry.)*

### 9.3 Certifications
Presented as a compact badge row beneath Education:
- Data Science Professional Certificate — Techcadd Ludhiana
- Advanced Python Programming Certification — ExcelR EdTech
- IBM SkillsBuild Data Analytics Certificate — IBM SkillsBuild

---

## 10. Implementation Plan

### 10.1 Milestones & Task Breakdown

| Milestone | Tasks |
|---|---|
| **M1 — Scaffolding** | Flask app factory, blueprint structure, base template, static asset pipeline, `content.py` populated with real data |
| **M2 — Static Layout** | Build all sections in HTML/Jinja with placeholder styling; confirm content renders correctly from `content.py` |
| **M3 — Visual Design** | Apply style guide (colors, typography, spacing); build responsive grid for skills/projects |
| **M4 — Interactivity** | Scroll-spy nav, smooth scroll, reveal-on-scroll, metric counters, project modal, hover states |
| **M5 — Contact Flow** | Build `/contact` route, client + server validation, Flask-Mail (or MySQL) wiring, spam protection |
| **M6 — Accessibility & Performance Pass** | Keyboard nav test, contrast check, reduced-motion support, image optimization, Lighthouse audit |
| **M7 — Testing** | Unit tests for routes/contact logic, manual cross-browser/device QA |
| **M8 — Deployment** | Dockerize, push to GitHub, deploy (Elastic Beanstalk/EC2, optionally wire CodeDeploy pipeline) |

### 10.2 Repo Structure
*(as detailed in §5.2 Module Breakdown above)*

### 10.3 Testing Checklist
- [ ] All nav anchors scroll to correct section with correct offset
- [ ] Scroll-spy highlights correct active link at every scroll position
- [ ] All project modals open/close correctly (click, `Esc`, backdrop)
- [ ] Metric counters animate once and don't re-trigger on re-scroll
- [ ] Contact form: empty-field validation, invalid-email validation, successful submit path, server-error path
- [ ] Spam protection (honeypot/rate-limit) verified with a scripted rapid-submit test
- [ ] Responsive check at 360px, 768px, 1024px, 1440px, 1920px widths
- [ ] Keyboard-only pass: can reach and operate every interactive element
- [ ] `prefers-reduced-motion` respected (test via OS/browser setting)
- [ ] Lighthouse: Performance/Accessibility/Best Practices/SEO all ≥ 90
- [ ] Cross-browser check: Chrome, Firefox, Safari, Edge

### 10.4 Deployment Steps

**Docker:**
```bash
docker build -t piyush-portfolio:latest .
docker run -p 8000:8000 --env-file .env piyush-portfolio:latest
```

**GitHub (CI trigger):**
```bash
git add .
git commit -m "deploy: vX.X release"
git push origin main
```

**AWS CodeDeploy (optional path):**
1. Push Docker image to Amazon ECR
2. Define `appspec.yml` with deployment hooks (`ApplicationStart`, `ApplicationStop`)
3. CodeDeploy pulls latest image to target EC2/ECS instance on each push (via GitHub Actions → CodeDeploy trigger)
4. Health-check endpoint `/healthz` confirms successful rollout before old instance is retired

**Simpler alternative (recommended to start):** Deploy directly to AWS Elastic Beanstalk (Docker platform) or Render/Railway — push image, get a live URL in minutes, add CodeDeploy later only if you want to showcase that specific pipeline skill.

---

## 11. Addendum — Full Project Inventory (from `Piyush.zip`)

I extracted and read through the codebase (not just filenames — READMEs, requirements.txt, project docs, and in one case the actual training script). It contains **9 project folders** beyond the 3 on your resume, and a few of them change what I'd recommend featuring. Full findings below, with a curation plan.

### 11.1 What's actually in each folder

| # | Project | Type | Real stack (from code) | What it actually does | Recommendation |
|---|---|---|---|---|---|
| 1 | **A.U.R.A** (Academic Understanding & Retention Application) | Flask — production-grade | Flask 3.0, Flask-SQLAlchemy, Flask-Login, Flask-WTF, Flask-Limiter, Flask-Mail, MySQL, scikit-learn (RF/GB/LogReg/SVM), Pandas, NumPy, Matplotlib, Seaborn, Gunicorn, Docker, Nginx, pytest | Full school ERP: role-based auth (admin/teacher/student), attendance, marks, fees, library, complaints, ML dropout-risk engine (15+ engineered features), REST API, three role-specific dashboards. Already ships its own `docs/` folder with DFDs, ER diagram, flowcharts, and API docs. | **Feature prominently — your strongest, most complete build.** ⚠️ In-code metrics are Accuracy 85% / Precision 82% / Recall 79% / F1 80% / AUC-ROC 0.87 — this differs from the 89% on your resume. Worth reconciling to one true number before publishing. |
| 2 | **SmartStudentAI** ("Intelligent Student Risk Monitoring & Decision Support System") | Flask | Flask, MySQL, scikit-learn | Earlier iteration of the same student-risk concept as A.U.R.A. | **Don't feature as a separate project** — it's a prior version of A.U.R.A. Presenting both as unrelated flagships would read as duplication. Could fold in as one line in an A.U.R.A case study ("iterated from an early prototype to a production system"). |
| 3 | **Student Management & Dropout Analytics** (folder named "old") | Flask | Flask, MySQL, scikit-learn | Even earlier predecessor — student/teacher management + dropout and teacher-performance prediction. | **Archive, don't feature.** Superseded by A.U.R.A. |
| 4 | **Multi-Disease Prediction System** | Flask (migrated from an original Streamlit build) | Flask, scikit-learn, Pandas/NumPy, Matplotlib/Seaborn/Plotly, SQLAlchemy, ReportLab | Predicts **Diabetes, Heart Disease, COVID-19, and Dengue** from tabular inputs; login/roles, admin dashboard, model-comparison charts, PDF report export, chatbot. | **Feature, but rewrite the description.** ⚠️ The code uses classic scikit-learn classifiers on these 4 diseases — not a CNN-LSTM hybrid, and Parkinson's isn't implemented here. Your resume's "hybrid CNN-LSTM ... cardiovascular, Parkinson's ... 91% AUC ... AWS" doesn't match this folder. I'd describe what's actually built (still a solid multi-model project) unless that version lives in a repo you haven't sent me. |
| 5 | **Credit Risk Analyzer** | Flask | Flask, scikit-learn (RandomForest), Pandas, NumPy, Matplotlib/Seaborn | Predicts loan default from applicant financials; dashboard with 5 generated charts (income vs. loan, credit score distribution, feature importance, etc.). | **Feature — good addition not currently on your resume.** ⚠️ I ran the shipped model against its own dataset: `credit_data.csv` has only **12 rows total**. That's a demo-scale dataset, not enough to support a headline accuracy/AUC claim. Recommend retraining on a larger public credit-risk dataset (e.g., a Kaggle credit-scoring set) before giving this project a metric on the site — otherwise present it stack-first, metric-free. |
| 6 | **VoiceForge** (text to speech) | Flask | Flask, gTTS/pyttsx3, SQLite | Full-stack TTS app: online/offline voice engines, 6 languages, speed control, accounts, conversion history (last 50) + favorites, and an elaborate 3D/glassmorphism UI (Orbitron/Exo 2 fonts, neon accents, animated waveform). | **Strong candidate to feature** — not on your resume, and its UI language (3D tilt, glass cards, dark neon) directly echoes your portfolio site's own "instrument deck" aesthetic. Nice thematic tie-in. |
| 7 | **Hospital Management System** | Streamlit | Streamlit, Pandas, Matplotlib/Seaborn, CSV storage | Patient/staff/billing dashboard: admissions, staff directory, revenue tracking, gender-distribution chart. | **Optional secondary card** — shows domain breadth, but CSV storage + Streamlit make it clearly lighter-tier; keep it compact, not a flagship. |
| 8 | **School Management System** | Streamlit | Streamlit, Pandas, Matplotlib, CSV storage | Student/teacher/fee/schedule manager with a login gate. | **Optional secondary, or skip.** Overlaps conceptually with A.U.R.A's territory — three "school + dashboard" apps in one portfolio reads as repetitive. ⚠️ Also has a hardcoded username/password in source (`Taran` / `004`) — worth knowing before this repo is public anywhere. |
| 9 | **Others/Blog-php.zip** | PHP | PHP/MySQL blog template | A "Complete Responsive Blog Website" — its own readme says "thanks for watching," and it ships default `admin`/`123456` login credentials. | **Exclude.** Reads as a followed tutorial rather than original work, and shipping default creds is a real security smell regardless. |

### 11.2 Recommended "Featured" set for the one-pager

With 9 real projects on the table, showing all of them as equal-weight cards would dilute the page. Restructuring the Projects section (updates §2 and §8) into two tiers:

**Featured (full cards, 4):**
1. A.U.R.A — flagship
2. Multi-Disease Prediction System — description rewritten to match actual scope
3. Credit Risk Analyzer — needs a real metric after retraining on a larger dataset
4. VoiceForge — design-forward showcase

**More Projects (compact secondary row / "Show more" toggle, 2–3):**
- Predictive Analytics Dashboard (from your resume; not present in this zip, so kept as originally briefed)
- Hospital Management System
- School Management System — one-line mention only, given the domain overlap with A.U.R.A

**Left out entirely:** SmartStudentAI and Student Management & Dropout Analytics old (superseded prototypes), Blog-php.zip (tutorial project with default credentials).

### 11.3 Resulting changes to earlier sections
- **§2 (Information Architecture):** Projects section now needs two tiers — Featured (4 full cards) and a secondary "More Projects" row/toggle (2–3 compact cards) — update the section outline accordingly.
- **§7 (Data model):** add `status: "featured" | "secondary"` to the `Project` entity so the content file drives which tier a card renders in — see updated snippet below.
- **§8 (UI/UX):** add a "View more projects" expand interaction, using the same reveal-on-scroll treatment as the featured grid.
- **§9 (Content Plan):** Multi-Disease Prediction System copy should describe the actual 4-disease scikit-learn build rather than the CNN-LSTM/Parkinson's framing, unless that version exists in a repo not included here.

### 11.4 Updated `PROJECTS` content-store entries (additive to §7.2)

```python
PROJECTS = [
    # ...existing A.U.R.A, Multi-Disease, Predictive Analytics Dashboard entries, updated:
    {
        "title": "A.U.R.A — Academic Understanding and Retention Application",
        "status": "featured",
        "summary": "Full school ERP with an ML-driven early-warning system for student dropout risk.",
        "tech_stack": ["Flask", "MySQL", "scikit-learn", "Docker", "Nginx", "Gunicorn"],
        "metrics": [{"label": "Model accuracy", "value": "85%"}, {"label": "AUC-ROC", "value": "0.87"}]
    },
    {
        "title": "Multi-Disease Prediction System",
        "status": "featured",
        "summary": "Predicts diabetes, heart disease, COVID-19, and dengue from health parameters, with an admin dashboard and PDF reporting.",
        "tech_stack": ["Flask", "scikit-learn", "Plotly", "ReportLab", "SQLAlchemy"],
        "metrics": []  # add once a specific per-disease accuracy is confirmed
    },
    {
        "title": "Credit Risk Analyzer",
        "status": "featured",
        "summary": "Loan default risk scoring with an interactive analytics dashboard.",
        "tech_stack": ["Flask", "scikit-learn", "Pandas", "Matplotlib", "Seaborn"],
        "metrics": []  # retrain on a larger dataset before publishing a metric — current sample is 12 rows
    },
    {
        "title": "VoiceForge — ML-Integrated Text-to-Speech",
        "status": "featured",
        "summary": "Full-stack TTS app with dual voice engines, multi-language support, and a 3D glassmorphism interface.",
        "tech_stack": ["Flask", "gTTS", "pyttsx3", "SQLite"],
        "metrics": [{"label": "Languages supported", "value": "6"}]
    },
    {
        "title": "Hospital Management System",
        "status": "secondary",
        "summary": "Streamlit dashboard for patient, staff, and billing management.",
        "tech_stack": ["Streamlit", "Pandas", "Matplotlib"],
        "metrics": []
    },
    {
        "title": "School Management System",
        "status": "secondary",
        "summary": "Streamlit app for student, teacher, fee, and schedule management.",
        "tech_stack": ["Streamlit", "Pandas", "Matplotlib"],
        "metrics": []
    }
]
```

---

*End of documentation pack. Let me know if you'd like this split into separate files (e.g., one per section) or converted to a Word/PDF deliverable, and send along any `[PLACEHOLDER]` values (per-project repo/demo URLs, resume PDF filename) so I can finalize the content file.*
