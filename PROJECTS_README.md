# Projects Management System

## Overview

Your portfolio website now uses a **single source of truth** for projects. Instead of updating projects in two separate places (desktop and mobile HTML), you only need to update one JavaScript file.

## How It Works

1. **`projects-data.js`** - Contains all project data in a single array
2. **`projects-renderer.js`** - Automatically generates both desktop and mobile HTML from the data
3. **`index.html`** - Uses the rendered projects (no manual HTML needed)

## Adding or Editing Projects

### To Add a New Project

1. Open `projects-data.js`
2. Add a new object to the `projectsData` array:

```javascript
{
    number: "17",
    title: "Your Project Title",
    url: "projects/your-project.html",
    image: "images/projects/your-project/main.jpg",
    tags: ["Tag1", "Tag2", "Tag3"],
    description: "Your project description here.",
    visible: true  // Set to false to hide without deleting
}
```

3. Save the file - both desktop and mobile views will automatically update!

### To Edit an Existing Project

1. Open `projects-data.js`
2. Find the project you want to edit
3. Update any field (title, url, image, tags, description)
4. Save - changes appear automatically on both desktop and mobile

### To Hide a Project (Without Deleting)

Set `visible: false` in the project object. The project will be hidden from both desktop and mobile views but can be easily restored later.

## Project Data Structure

Each project object has these fields:

- **`number`** (string): Project number (e.g., "01", "02")
- **`title`** (string): Full project title
- **`url`** (string): Path to project page (e.g., "projects/MyProject.html")
- **`image`** (string): Path to project image (used for hover effects)
- **`tags`** (array): Array of tag strings (e.g., ["Web", "Design", "Research"])
- **`description`** (string): Project description text
- **`visible`** (boolean): Whether the project should be displayed

## Benefits

✅ **Single source of truth** - Update once, works everywhere  
✅ **No duplicate code** - Desktop and mobile generated from same data  
✅ **Easy to maintain** - Simple JavaScript object structure  
✅ **Quick to hide/show** - Just toggle the `visible` property  
✅ **Type-safe** - Clear structure prevents errors

## Notes

- Projects are automatically filtered to show only those with `visible: true`
- The order in the array determines the display order
- Image paths should be relative to the root of your site
- Tags are used for filtering on both desktop and mobile
