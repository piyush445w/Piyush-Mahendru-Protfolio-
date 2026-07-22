# Piyush Mahendru — Portfolio Web App

A single-page portfolio web application built with **Flask** and **Jinja2**, designed to showcase Machine Learning and software engineering projects. Content is data-driven and editable from a single Python file — no template changes required for routine updates.

## Live Site

> Add your deployed URL here.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, Flask, Jinja2 |
| Frontend | HTML5, CSS3, vanilla JavaScript (ES6+) |
| Contact form | Flask-Mail, Flask-WTF, Flask-Limiter |
| Data layer | Python dataclasses (`data/content.py`) |
| Deployment | Docker, Gunicorn, Nginx |

## Prerequisites

- Python 3.10+
- Pip

## Local Setup

```bash
# Clone the repository
git clone <YOUR_REPO_URL>
cd portfolio_app

# Create a virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set required environment variables
$env:SECRET_KEY = "your-secret-key"
$env:MAIL_USERNAME = "your-email@gmail.com"
$env:MAIL_PASSWORD = "your-app-password"
$env:MAIL_DEFAULT_RECIPIENT = "piyushmahendru534@gmail.com"

# Run the app
python app.py
```

Open `http://127.0.0.1:5050` in your browser.

## Alternative: Start Script

```bash
python start_app.py
```

This clears stale `__pycache__` and starts Flask on port `5050`.

## Project Structure

```
portfolio_app/
├── app.py                 # Flask app factory
├── config.py              # Environment-based configuration
├── extensions.py          # Flask-Mail, CSRF, Limiter initialization
├── data/
│   └── content.py         # Single source of truth for all portfolio content
├── routes/
│   ├── main.py            # Homepage route
│   └── contact.py         # Contact form POST handler
├── templates/
│   ├── base.html          # Root template (head, nav, footer)
│   ├── index.html         # Main SPA layout
│   └── partials/          # Section partials (_hero, _projects, etc.)
├── static/
│   ├── css/               # main.css, animations.css
│   ├── js/                # scrollspy, counters, modal, form handling
│   └── files/             # Resume PDF
├── requirements.txt
└── start_app.py           # Clean start script (Windows)
```

## Content Management

All portfolio content lives in `data/content.py`. To update the site:

1. Open `data/content.py`
2. Edit the relevant section:
   - `PROFILE` — personal details, contact links, resume path
   - `ABOUT` — summary, focus areas, availability
   - `SKILLS` — categorized skill chips
   - `PROJECTS` — project cards (title, summary, tech stack, metrics, status)
   - `IMPACT` — animated counter metrics
   - `EDUCATION` — education timeline entries
   - `CERTIFICATIONS` — certification badges
3. Save and refresh the browser

No HTML, CSS, or route changes are needed for content updates.

## Features

- **Animated Hero** — role intro, tagline, dual CTAs
- **Scroll-spy Navigation** — sticky navbar with active section tracking
- **Skills Chips** — categorized by type (Languages, ML Libraries, Visualization, Databases, Tools)
- **Project Cards** — featured and secondary tiers, modal expansion with tech tags and metrics
- **Metric Counters** — animated counters (85% accuracy, 22% ROI, 50K+ records, etc.)
- **Education Timeline** — university and school history
- **Certifications** — badge strip
- **Contact Form** — validation, Flask-Mail delivery, rate limiting
- **Animations** — scroll-triggered reveals, hover effects, reduced-motion support
- **Responsive** — mobile-first, tested from 360px to 1920px+

## Contact Form Backend

The contact form uses a no-DB path:
- Client-side validation (required fields, email format)
- Server-side validation via Flask-WTF
- CSRF protection
- Rate limiting via Flask-Limiter
- Messages forwarded to inbox via Flask-Mail

No message history is stored locally.

## Testing

```bash
# Flask test discovery (requires pytest configuration)
python -m pytest tests/
```

See the [documentation spec](portfolio_app_documentation_pack.md) for the full manual QA checklist (responsive, keyboard nav, Lighthouse, cross-browser).

## Deployment

### Docker

```bash
docker build -t piyush-portfolio:latest .
docker run -p 8000:8000 --env-file .env piyush-portfolio:latest
```

### Render / Railway

Push to GitHub, connect the repo, and deploy using the included `Dockerfile` or a Gunicorn start command.

### AWS (optional)

Deployable to Elastic Beanstalk (Docker platform) or a single EC2 instance with Nginx + Gunicorn. CodeDeploy can be wired later for CI/CD.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `SECRET_KEY` | Yes | Flask session/CSRF secret |
| `MAIL_USERNAME` | Yes | SMTP username |
| `MAIL_PASSWORD` | Yes | SMTP password/app password |
| `MAIL_DEFAULT_RECIPIENT` | Yes | Inbound email destination |
| `RATELIMIT_ENABLED` | No | Defaults to `True` |
| `FLASK_ENV` | No | Defaults to `development` |

## License

MIT
