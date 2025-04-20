# Portfolio Website with Dynamic Content Loading

This portfolio website is designed to make it easy to add new projects with minimal changes to the codebase. The site uses a centralized JSON data file to store project information, which is then dynamically loaded and displayed on the homepage.

## System Overview

The portfolio uses:
- A central `data.json` file to store all project data
- JavaScript to dynamically populate content from this data
- An admin interface for adding/updating projects
- A project template for creating consistent project pages

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
4. Click "Create Project File" to generate and download an HTML file based on the project template
5. Place the downloaded file in your `projects/` directory
6. Add your project images to `images/projects/your-project-id/`
7. Edit the project file to update content, images, and descriptions

### Method 2: Manual Editing

1. Create a new HTML file for your project using `project-template.html` as a reference
2. Place it in the `projects/` directory
3. Add your project images to `images/projects/your-project-id/`
4. Edit the `data.json` file to add your project information
   - Follow the existing structure for project entries
   - Make sure to set the "featured" and "group" properties according to where you want the project to appear

## File Structure

- `index.html` - Main homepage with dynamic project listings
- `data.json` - Contains all project data
- `script.js` - Handles dynamic content loading and site functionality
- `styles.css` - Site-wide styling
- `admin.html` - Interface for adding/updating projects
- `project-template.html` - Template for new project pages
- `projects/` - Directory containing individual project pages
- `images/projects/` - Directory containing project images

## How the Dynamic Content Works

The system works by:
1. Loading project data from `data.json` when the page loads
2. Filtering projects based on properties (featured, group, year)
3. Dynamically creating HTML elements for each project
4. Inserting these elements into the appropriate sections of the page

This approach means you only need to:
1. Create a new project HTML file
2. Add the project data to `data.json`
3. Add your project images

The homepage will automatically update to display your new project.

## Customization

You can customize the site by:
- Editing `styles.css` to change the visual design
- Modifying `project-template.html` to change the structure of project pages
- Updating `index.html` to add/remove sections or change the layout
- Editing the JavaScript in `script.js` to change how projects are displayed

## Server Requirements

For the admin interface to work properly with saving data, you'll need:
- A web server with write permissions for the `data.json` file
- If using a static hosting service, the admin save functionality may not work (but you can still manually edit the JSON file)

## Browser Compatibility

This site works in all modern browsers with JavaScript enabled.
