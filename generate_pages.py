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
        <img src="../images/project-image.png" alt="Screenshot of the {title} project" />
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
        <a href="../{next_url}" class="next-project-link" aria-label="Next project: {next_title}">
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

def create_404_page():
    html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>404 Not Found - Ethan Sheaf-Morrison</title>
    <link rel="stylesheet" href="styles.css" />
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        h1 { font-size: 3em; color: #cc0000; }
        p { font-size: 1.5em; }
        a { color: #0066cc; text-decoration: none; font-weight: bold; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <h1>404 - Page Not Found</h1>
    <p>Sorry, the page you are looking for does not exist.</p>
    <p><a href="index.html" aria-label="Return to home page">Return to Home Page</a></p>
</body>
</html>
"""
    path = os.path.join(os.getcwd(), "404.html")
    with open(path, 'w') as f:
        f.write(html)
    print("✔ Created: 404.html")

def create_sitemap_page(projects):
    links_html = ""
    for project in projects:
        title = project["title"]
        url = project["url"]
        links_html += f'<li><a href="{url}" aria-label="Project page for {title}">{title}</a></li>\n'

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Sitemap - Ethan Sheaf-Morrison</title>
    <link rel="stylesheet" href="styles.css" />
    <style>
        body {{ font-family: Arial, sans-serif; padding: 20px; }}
        h1 {{ font-size: 2em; margin-bottom: 20px; }}
        ul {{ list-style-type: none; padding-left: 0; }}
        li {{ margin: 10px 0; }}
        a {{ color: #0066cc; text-decoration: none; }}
        a:hover {{ text-decoration: underline; }}
    </style>
</head>
<body>
    <h1>Sitemap</h1>
    <ul>
        {links_html}
    </ul>
</body>
</html>
"""
    path = os.path.join(os.getcwd(), "sitemap.html")
    with open(path, 'w') as f:
        f.write(html)
    print("✔ Created: sitemap.html")

projects = data["projects"]
for i, project in enumerate(projects):
    next_project = projects[(i + 1) % len(projects)]
    create_page(project, next_project)

create_404_page()
create_sitemap_page(projects)