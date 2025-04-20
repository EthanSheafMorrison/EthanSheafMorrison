![Hero image for Sample Project](../images/projects/sample-project/hero.jpg)

## Background

This is an example of how you can use Markdown to create project pages easily. Markdown is a simple markup language that allows you to write content using an easy-to-read, easy-to-write plain text format.

The first image in your Markdown file will automatically be used as the hero image for the project.

## Process

The process of creating a project page with Markdown is now very simple:

1. Create a new Markdown file in the `markdown` folder with your project ID as the filename
2. Add your project details to `data.json`
3. Create a new HTML file in the `projects` folder using the markdown-template.html

### Example Code

You can even include code snippets:

```javascript
// Example JavaScript code
function createProject(id, title) {
  return {
    id: id,
    title: title,
    date: "2024"
  };
}
```

## Features

- **Easy to update**: Just edit the Markdown file
- **Responsive**: All styling is taken care of
- **Automatic loading**: Project info is loaded from data.json
- **Support for all Markdown features**:
  - Lists
  - *Italic* and **bold** text
  - [Links](https://example.com)
  - Code blocks
  - Images
  - And more!

## Images

You can add multiple images throughout your content:

![Additional image](../images/projects/sample-project/image2.jpg)

## Quotes

> This is an example of a blockquote. You can use these to highlight important information or quotes.

## Outcome

This approach makes it much easier to maintain your portfolio. Instead of editing HTML, you can focus on writing content in a simple, readable format.

## Related Links

- [Markdown Guide](https://www.markdownguide.org/)
- [Marked.js Documentation](https://marked.js.org/) 