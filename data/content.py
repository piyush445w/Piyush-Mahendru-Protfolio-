from dataclasses import dataclass, field
from typing import Dict, List, Optional


@dataclass
class Profile:
    name: str
    title: str
    tagline: str
    location: str
    phone: str
    email: str
    linkedin: str
    github: str
    resume_pdf: str


@dataclass
class About:
    summary: str
    location: str
    availability: str
    focus_areas: List[str]


@dataclass
class ProjectMetric:
    label: str
    value: str


@dataclass
class Project:
    title: str
    status: str
    summary: str
    tech_stack: List[str]
    metrics: List[ProjectMetric]


@dataclass
class ImpactMetric:
    label: str
    value: str
    suffix: str


@dataclass
class EducationEntry:
    institution: str
    degree: str
    period: str


@dataclass
class Certification:
    title: str
    issuer: str
    date: Optional[str] = None


# ---------------------------------------------------------------------------
# Module-level constants — all constructed from dataclass instances
# ---------------------------------------------------------------------------

PROFILE = Profile(
    name="Piyush Mahendru",
    title="Aspiring Machine Learning Engineer",
    tagline=(
        "B.Sc. IT graduate passionate about building ML-powered applications "
        "that turn data into real-world solutions."
    ),
    location="Ludhiana, Punjab, India",
    phone="+91-7986086946",
    email="piyushmahendru534@gmail.com",
    linkedin="https://linkedin.com/in/piyush-mahendru-342758271",
    github="https://github.com/piyushmahendru",
    resume_pdf="/static/files/Piyush_Mahendru_Resume.pdf",
)

SKILLS: Dict[str, List[str]] = {
    "Programming Languages": ["Python", "C++", "SQL", "R"],
    "Libraries & Frameworks": ["Pandas", "NumPy", "Scikit-learn", "TensorFlow", "PyTorch", "XGBoost", "Flask"],
    "Data Visualization": ["Power BI", "Tableau", "Matplotlib", "Seaborn", "Plotly", "Dash"],
    "Databases": ["MySQL"],
    "Tools & Platforms": ["Git", "GitHub", "Jupyter Notebook", "VS Code"],
}

PROJECTS: List[Project] = [
    Project(
        title="A.U.R.A — Academic Understanding and Retention Application",
        status="featured",
        summary="Full school ERP with an ML-driven early-warning system for student dropout risk.",
        tech_stack=["Flask", "MySQL", "scikit-learn", "Docker", "Nginx", "Gunicorn"],
        metrics=[ProjectMetric(label="Model accuracy", value="85%"), ProjectMetric(label="AUC-ROC", value="0.87")],
    ),
    Project(
        title="Multi-Disease Prediction System",
        status="featured",
        summary="Predicts diabetes, heart disease, COVID-19, and dengue from health parameters, with an admin dashboard and PDF reporting.",
        tech_stack=["Flask", "scikit-learn", "Plotly", "ReportLab", "SQLAlchemy"],
        metrics=[],
    ),
    Project(
        title="Credit Risk Analyzer",
        status="featured",
        summary="Loan default risk scoring with an interactive analytics dashboard.",
        tech_stack=["Flask", "scikit-learn", "Pandas", "Matplotlib", "Seaborn"],
        metrics=[],
    ),
    Project(
        title="VoiceForge — ML-Integrated Text-to-Speech",
        status="featured",
        summary="Full-stack TTS app with dual voice engines, multi-language support, and a 3D glassmorphism interface.",
        tech_stack=["Flask", "gTTS", "pyttsx3", "SQLite"],
        metrics=[ProjectMetric(label="Languages supported", value="6")],
    ),
    Project(
        title="Hospital Management System",
        status="secondary",
        summary="Streamlit dashboard for patient, staff, and billing management.",
        tech_stack=["Streamlit", "Pandas", "Matplotlib"],
        metrics=[],
    ),
    Project(
        title="School Management System",
        status="secondary",
        summary="Streamlit app for student, teacher, fee, and schedule management.",
        tech_stack=["Streamlit", "Pandas", "Matplotlib"],
        metrics=[],
    ),
]

EDUCATION: List[EducationEntry] = [
    EducationEntry(institution="GNA University, Punjab", degree="B.Sc. Information Technology", period="2026"),
    EducationEntry(institution="GMT International School", degree="Senior Secondary (12th Grade)", period="2023"),
    EducationEntry(institution="GMT International School", degree="Secondary (10th Grade)", period="2021"),
]

ABOUT = About(
    summary=(
        "Recent B.Sc. Information Technology graduate with a strong foundation in machine learning, "
        "data analytics, and full-stack application development. Hands-on experience building "
        "end-to-end ML projects across healthcare, education, and finance domains. Skilled in "
        "Python, scikit-learn, Flask, and data visualization tools with a focus on turning "
        "academic knowledge into production-ready applications."
    ),
    location="Ludhiana, Punjab, India",
    availability="Open to entry-level ML and software engineering roles",
    focus_areas=["Predictive Modeling", "Full-Stack Data Apps", "ML Deployment", "Data Analytics"],
)

IMPACT: List[ImpactMetric] = [
    ImpactMetric(label="Model Accuracy", value="85", suffix="%"),
    ImpactMetric(label="Campaign ROI Improvement", value="22", suffix="%"),
    ImpactMetric(label="Records Processed", value="50", suffix="K+"),
    ImpactMetric(label="ML/Web Projects Built", value="9", suffix=""),
]

CERTIFICATIONS: List[Certification] = [
    Certification(title="Data Science Professional Certificate", issuer="Techcadd Ludhiana", date="2023"),
    Certification(title="Advanced Python Programming Certification", issuer="ExcelR EdTech", date="2024"),
    Certification(title="IBM SkillsBuild Data Analytics Certificate", issuer="IBM SkillsBuild", date="2024"),
]
