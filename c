<section id="projects" aria-label="Projects">
  <div class="container">
    <h2 class="reveal">Projects</h2>

    <div class="projects-featured">
      <h3 class="reveal reveal-delay-1">Featured</h3>
      <div class="project-grid">
        {% for project in PROJECTS if project.status == "featured" %}
        {% set idx = loop.index0 %}
        <article class="project-card reveal reveal-delay-{{ idx + 2 }}" data-status="featured" data-project-id="{{ idx }}">
          <h4>{{ project.title }}</h4>
          <p>{{ project.summary }}</p>
          <ul class="project-tags">
            {% for tag in project.tech_stack %}
            <li class="chip">{{ tag }}</li>
            {% endfor %}
          </ul>
          {% if project.metrics %}
          <div class="project-metrics">
            {% for metric in project.metrics %}
            <span class="metric-badge">{{ metric.label }}: {{ metric.value }}</span>
            {% endfor %}
          </div>
          {% endif %}
          <button class="view-details-btn" data-open-modal="{{ idx }}">View Details →</button>
        </article>
        {% endfor %}
      </div>

    <!-- Card-morph detail container (expanded state) — FLIP target -->
    <div class="morph-overlay" role="dialog" aria-modal="true" aria-label="Project details">
      <div class="morph-container">
        <button class="morph-close" aria-label="Close project details">&times;</button>
        <div class="morph-body"></div>
    </div>

    <div class="projects-secondary">
      <h3 class="reveal reveal-delay-1">More Projects</h3>
      <div class="project-grid-secondary">
        {% for project in PROJECTS if project.status == "secondary" %}
        <article class="project-card reveal reveal-delay-{{ loop.index + 1 }}" data-status="secondary">
          <h4>{{ project.title }}</h4>
          <p>{{ project.summary }}</p>
          <ul class="project-tags">
            {% for tag in project.tech_stack %}
            <li class="chip">{{ tag }}</li>
            {% endfor %}
          </ul>
        </article>
        {% endfor %}
      </div>

    <!-- "View More Projects" toggle (§11.2 / §11.3) -->
    <div style="text-align: center">
      <button class="toggle-secondary-btn" data-toggle-secondary>View More Projects</button>
    </div>

  <!-- Hidden JSON data for modal population -->
  <script id="projects-data-json" type="application/json">{{ PROJECTS_JSON | tojson | safe }}</script>
</section>
