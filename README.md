# Portfolio Website with Dynamic Content Loading

This portfolio website is designed to make it easy to add new projects with minimal changes to the codebase. The site uses a centralized JSON data file to store project information, which is then dynamically loaded and displayed on the homepage.

## System Overview

The portfolio uses:
- A central `data.json` file to store all project data
- JavaScript to dynamically populate content from this data
- An admin interface for adding/updating projects
- A project template for creating consistent project pages
- **NEW**: Markdown support for easy content creation

## How to Add a New Project

### Method 1: Using the Admin Interface

1. Navigate to `admin.html` in your browser
2. Fill out the project form with your project details:
   - Title, ID (use kebab-case: "my-project-name"), year, month
   - Project summary
   - URL (e.g., "projects/ProjectName.html")
   - Check "Featured Project" if it should appear in the Selected Works section
   - Check "Group Project" if it should appear in the Group Projects section
   - Add tags relevant to your project
3. Click "Save Project" to update the data.json file
4. Choose one of the following options:
   - Click "Create HTML File" to generate a traditional HTML file
   - **NEW**: Click "Create Markdown Project" to generate both a Markdown content file and its HTML wrapper

### Method 2: Manual Editing

1. Create a new HTML file for your project using `project-template.html` as a reference
2. Place it in the `projects/` directory
3. Add your project images to `images/projects/your-project-id/`
4. Edit the `data.json` file to add your project information
   - Follow the existing structure for project entries
   - Make sure to set the "featured" and "group" properties according to where you want the project to appear

### Method 3: Markdown-Based Projects (NEW)

1. Create a new Markdown file in the `markdown/` directory with your project ID as the filename
   - For example: `markdown/my-project.md`
2. Add your project details to `data.json` as usual
3. Create a new HTML file in the `projects/` directory based on `markdown-template.html`
   - This HTML file will automatically load and render the Markdown content
4. Add your project images to `images/projects/your-project-id/`

## File Structure

- `index.html` - Main homepage with dynamic project listings
- `data.json` - Contains all project data
- `script.js` - Handles dynamic content loading and site functionality
- `simple-script.js` - Simplified script that's easier to maintain
- `styles.css` - Site-wide styling
- `admin.html` - Interface for adding/updating projects
- `project-template.html` - Template for new project pages
- `markdown-template.html` - **NEW**: Template for Markdown-based projects
- `markdown/` - **NEW**: Directory containing Markdown content files
- `projects/` - Directory containing individual project pages
- `images/projects/` - Directory containing project images

## How the Dynamic Content Works

The system works by:
1. Loading project data from `data.json` when the page loads
2. Filtering projects based on properties (featured, group, year)
3. Dynamically creating HTML elements for each project
4. Inserting these elements into the appropriate sections of the page

## New Markdown-Based Projects

The Markdown system works by:
1. Creating a standard HTML wrapper page based on `markdown-template.html`
2. Writing your content in Markdown format in a .md file
3. When the HTML page loads, it:
   - Fetches the project data from `data.json`
   - Loads the corresponding Markdown file
   - Converts the Markdown to HTML using the marked.js library
   - Inserts the converted HTML into the page

### Markdown Benefits

- **Easier to write**: Markdown is much simpler than HTML
- **Content focused**: Focus on the content, not the HTML structure
- **Consistent styling**: The template handles all the styling
- **Quick updates**: Just edit the Markdown file, no need to touch HTML

## Customization

You can customize the site by:
- Editing `styles.css` to change the visual design
- Modifying `project-template.html` or `markdown-template.html` to change the structure of project pages
- Updating `index.html` to add/remove sections or change the layout
- Editing the JavaScript in `simple-script.js` to change how projects are displayed

## Server Requirements

For the admin interface to work properly with saving data, you'll need:
- A web server with write permissions for the `data.json` file
- If using a static hosting service, the admin save functionality may not work (but you can still manually edit the JSON file)

## Browser Compatibility

This site works in all modern browsers with JavaScript enabled.
