const fs = require('fs');

function convertHtmlToJsx(htmlStr) {
  // Extract content inside <body>
  let bodyMatch = htmlStr.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let bodyContent = bodyMatch ? bodyMatch[1] : htmlStr;

  // Remove script tags
  bodyContent = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Convert basic attributes
  bodyContent = bodyContent.replace(/ class="/g, ' className="');
  bodyContent = bodyContent.replace(/ for="/g, ' htmlFor="');
  
  // Convert standard self-closing tags (very basic regex, assuming no > in attributes)
  bodyContent = bodyContent.replace(/<(img|input|br|hr|meta|link)([^>]*?)(?<!\/)>/g, '<$1$2 />');
  
  // Handle inline styles - convert string to object (simplified, handles basic cases if any)
  bodyContent = bodyContent.replace(/style="([^"]*)"/g, (match, p1) => {
    let styles = p1.split(';').filter(s => s.trim() !== '');
    let styleObjStr = styles.map(s => {
      let [key, val] = s.split(':');
      if(!val) return '';
      key = key.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      return `${key}: '${val.trim()}'`;
    }).join(', ');
    return `style={{${styleObjStr}}}`;
  });

  return bodyContent;
}

const indexHtml = fs.readFileSync('index.html', 'utf8');
const indexJsxContent = convertHtmlToJsx(indexHtml);

const clientHtml = fs.readFileSync('client-question-guide.html', 'utf8');
const clientJsxContent = convertHtmlToJsx(clientHtml);

const homeTemplate = `import React, { useEffect } from 'react';
import '../home.css';

export default function Home() {
  useEffect(() => {
    // Add brief.js logic here or include it
  }, []);

  return (
    <>
      ${indexJsxContent}
    </>
  );
}
`;

const clientTemplate = `import React, { useEffect } from 'react';
import '../index.css';

export default function ClientGuide() {
  useEffect(() => {
    // Add question-guides.js logic here or include it
  }, []);

  return (
    <>
      ${clientJsxContent}
    </>
  );
}
`;

fs.writeFileSync('frontend/src/pages/Home.jsx', homeTemplate);
fs.writeFileSync('frontend/src/pages/ClientGuide.jsx', clientTemplate);
console.log("Conversion complete!");
