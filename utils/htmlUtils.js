// Generate preview HTML
export function generatePreviewHTML(title, content) {
  const contentHTML = content.map(item => {
    if (item.isAd) {
      return item.html;
    } else {
      return `<${item.type}>${item.text}</${item.type}>`;
    }
  }).join('\n');

  return `<!DOCTYPE html>
<html>
<head>
    <title>${title} - Preview</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        h1, h2, h3 { color: #333; margin-top: 2em; }
        p { margin-bottom: 1em; }
    </style>
</head>
<body>
    <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2>Preview: ${title}</h2>
        <p><em>Content with AI-generated ads</em></p>
    </div>
    ${contentHTML}
</body>
</html>`;
}
