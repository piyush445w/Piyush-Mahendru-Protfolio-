from flask import Blueprint, render_template
from data.content import PROFILE, ABOUT, SKILLS, PROJECTS, IMPACT, EDUCATION, CERTIFICATIONS, SKILL_DEFINITIONS

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
    all_skills_flat = list(dict.fromkeys(skill for skills in SKILLS.values() for skill in skills))

    def _project_matches(skill):
        skill_lower = skill.lower()
        matched = [
            p.title for p in PROJECTS
            if any(t.lower() == skill_lower for t in p.tech_stack)
        ]

        if matched:
            return matched

        smart_map = {
            'python': [p.title for p in PROJECTS],
            'sql': [p.title for p in PROJECTS if any(t.lower() in ('mysql', 'sql', 'sqlite', 'sqlalchemy') for t in p.tech_stack)],
            'numpy': [p.title for p in PROJECTS if any(t.lower() in ('pandas', 'numpy', 'scikit-learn', 'sklearn') for t in p.tech_stack)],
            'tensorflow': [p.title for p in PROJECTS if 'ml' in p.summary.lower() or 'model' in p.summary.lower() or 'prediction' in p.summary.lower()],
            'pytorch': [p.title for p in PROJECTS if 'ml' in p.summary.lower() or 'model' in p.summary.lower() or 'prediction' in p.summary.lower()],
            'xgboost': [p.title for p in PROJECTS if 'ml' in p.summary.lower() or 'model' in p.summary.lower() or 'prediction' in p.summary.lower()],
            'dash': [p.title for p in PROJECTS if 'plotly' in [t.lower() for t in p.tech_stack] or 'dashboard' in p.summary.lower()],
            'power bi': [p.title for p in PROJECTS if 'dashboard' in p.summary.lower() or 'analytics' in p.summary.lower()],
            'tableau': [p.title for p in PROJECTS if 'dashboard' in p.summary.lower() or 'analytics' in p.summary.lower()],
            'git': [p.title for p in PROJECTS],
            'github': [p.title for p in PROJECTS],
            'vs code': [p.title for p in PROJECTS],
            'jupyter notebook': [p.title for p in PROJECTS],
        }
        return smart_map.get(skill_lower, [])

    skill_project_map = {skill: _project_matches(skill) for skill in all_skills_flat}

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
        SKILL_DEFINITIONS=SKILL_DEFINITIONS,
        SKILL_PROJECT_MAP=skill_project_map,
    )
