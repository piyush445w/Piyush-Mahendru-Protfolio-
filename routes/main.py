from flask import Blueprint, render_template
from data.content import PROFILE, ABOUT, SKILLS, PROJECTS, IMPACT, EDUCATION, CERTIFICATIONS

main_bp = Blueprint('main', __name__)


def _projects_to_json(projects):
    """Convert Project dataclass list to JSON-serializable list of dicts."""
    result = []
    for p in projects:
        result.append({
            'title': p.title,
            'status': p.status,
            'summary': p.summary,
            'tech_stack': p.tech_stack,
            'metrics': [{'label': m.label, 'value': m.value} for m in p.metrics],
        })
    return result


@main_bp.route('/')
def index():
    return render_template(
        'index.html',
        PROFILE=PROFILE,
        ABOUT=ABOUT,
        SKILLS=SKILLS,
        PROJECTS=PROJECTS,
        PROJECTS_JSON=_projects_to_json(PROJECTS),
        IMPACT=IMPACT,
        EDUCATION=EDUCATION,
        CERTIFICATIONS=CERTIFICATIONS,
    )
