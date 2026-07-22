import os, sys
from flask import Flask

# ── ensure the project root is on sys.path for clean absolute imports ──
_project_root = os.path.dirname(os.path.abspath(__file__))
if _project_root not in sys.path:
    sys.path.insert(0, _project_root)

from config import Config
from extensions import mail, csrf, limiter
from routes.main import main_bp
from routes.contact import contact_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Init extensions
    csrf.init_app(app)
    mail.init_app(app)
    limiter.init_app(app)

    # Register blueprints
    app.register_blueprint(main_bp)
    app.register_blueprint(contact_bp)

    # Expose mail instance on app.extensions for route access
    app.extensions['mail'] = mail

    return app


# ── expose WSGI callable for gunicorn / WSGI servers ──
app = create_app()


if __name__ == '__main__':
    app.run(debug=True)
