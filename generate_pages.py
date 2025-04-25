import json
import os

with open('data.json', 'r') as f:
    data = json.load(f)

def create_page(project, next_project=None):
    title = project["title"]
    summary = project["summary"]
    date = project["date"]
    tags = ", ".join(project.get("tags", []))
    url = project["url"]

    if not url.endswith('.html'):
        return

    next_title = next_summary = next_url = ""
    if next_project:
        next_title = next_project["title"]
        next_summary = next_project["summary"]
        next_url = next_project["url"]

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>{title} - Ethan Sheaf-Morrison</title>
    <link rel="stylesheet" href="../styles.css" />
</head>
<body>
    <section class="project-hero">
        <h1>{title}</h1>
        <div class="project-meta-grid">
            <p><strong>/ DATE</strong><br />{date}</p>
            <p><strong>/ ROLE</strong><br />Designer</p>
            <p><strong>/ TYPE</strong><br />Website</p>
        </div>
    </section>

    <section class="project-info-column">
        <h2>/ OVERVIEW</h2>
        <p>{summary}</p>
    </section>

    <section class="project-image-column">
        <img src="../images/project-image.png" alt="Project Image" />
    </section>

    <section class="project-tools-column">
        <h2>/ TOOLS</h2>
        <ul>
            <li>Tool 1</li>
            <li>Tool 2</li>
            <li>Tool 3</li>
        </ul>
    </section>

    <section class="project-next-column">
        <h2>/ NEXT</h2>
        <a href="../{next_url}" class="next-project-link">
            <h2>{next_title}</h2>
            <p>{next_summary}</p>
        </a>
    </section>
</body>
</html>
"""

    path = os.path.join(os.getcwd(), url)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(html)
    print(f"✔ Created: {url}")

projects = data["projects"]
for i, project in enumerate(projects):
    next_project = projects[(i + 1) % len(projects)]
    create_page(project, next_project)