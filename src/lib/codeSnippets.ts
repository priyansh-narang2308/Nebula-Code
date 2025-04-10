
export const codeSnippets: Record<string, string> = {
  // JavaScript
  "index.js": `// Main application entry point
import { renderApp } from './components/app';
import { initializeState } from './utils/state';

// Initialize application state
const state = initializeState();

// Render the application
document.addEventListener('DOMContentLoaded', () => {
  renderApp(document.getElementById('root'), state);
  
  console.log('NebulaCode Studio application initialized');
});

// Event listeners for keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Command palette: Ctrl+P
  if (e.ctrlKey && e.key === 'p') {
    e.preventDefault();
    console.log('Opening command palette...');
  }
  
  // Save file: Ctrl+S
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    console.log('Saving file...');
  }
});`,

  // CSS
  "styles.css": `/* Main application styles */
:root {
  --color-background: #1a1f2c;
  --color-foreground: #f8f9fa;
  --color-primary: #9b87f5;
  --color-accent: #33c3f0;
  --color-border: #2d3748;
  --font-mono: 'JetBrains Mono', monospace;
  --font-sans: 'Inter', sans-serif;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--color-background);
  color: var(--color-foreground);
  font-family: var(--font-sans);
  line-height: 1.6;
}

.editor {
  font-family: var(--font-mono);
  font-size: 14px;
}

.glass-panel {
  background: rgba(45, 55, 72, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.neon-glow {
  box-shadow: 0 0 10px var(--color-primary),
              0 0 20px rgba(155, 135, 245, 0.5);
}`,

  // JSX
  "Button.jsx": `import React from 'react';
import './Button.css';

/**
 * Custom button component with various styles and animations
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  className = '',
  icon,
  ...props
}) => {
  const handleClick = (e) => {
    // Add ripple effect
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = \`\${x}px\`;
    ripple.style.top = \`\${y}px\`;
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
    
    if (onClick) onClick(e);
  };
  
  return (
    <button
      className={\`button button--\${variant} button--\${size} \${className}\`}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="button__icon">{icon}</span>}
      <span className="button__text">{children}</span>
    </button>
  );
};

export default Button;`,

  // JSX
  "Card.jsx": `import React from 'react';
import './Card.css';

/**
 * Card component with glassmorphism effect
 */
const Card = ({
  children,
  title,
  subtitle,
  className = '',
  elevation = 'medium',
  glass = true,
  ...props
}) => {
  return (
    <div
      className={\`card card--\${elevation} \${glass ? 'card--glass' : ''} \${className}\`}
      {...props}
    >
      {(title || subtitle) && (
        <div className="card__header">
          {title && <h3 className="card__title">{title}</h3>}
          {subtitle && <div className="card__subtitle">{subtitle}</div>}
        </div>
      )}
      <div className="card__content">
        {children}
      </div>
    </div>
  );
};

export default Card;`,

  // HTML
  "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NebulaCode Studio</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap">
</head>
<body>
  <div id="root"></div>
  
  <div class="stars-container">
    <!-- Stars will be generated with JavaScript -->
  </div>
  
  <script src="index.js"></script>
  <script>
    // Generate stars for background
    const starsContainer = document.querySelector('.stars-container');
    const starCount = 150;
    
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      
      // Random size
      const size = Math.random();
      if (size < 0.6) {
        star.classList.add('tiny');
      } else if (size < 0.9) {
        star.classList.add('small');
      } else {
        star.classList.add('medium');
      }
      
      // Random position
      star.style.left = \`\${Math.random() * 100}%\`;
      star.style.top = \`\${Math.random() * 100}%\`;
      
      starsContainer.appendChild(star);
    }
  </script>
</body>
</html>`,

  // Markdown
  "README.md": `# NebulaCode Studio

> 🚀 Launch your logic into the stars.

## About

NebulaCode Studio is a futuristic code editor with space-age UI, immersive effects, and full functionality for editing code in multiple languages.

## Features

- 🔤 Multi-language syntax highlighting
- 🗂️ Interactive file explorer 
- 🧭 Multi-tab navigation
- 📟 Integrated terminal
- 🧠 Command palette
- 🎛️ Customizable settings

## Getting Started

1. Clone this repository
2. Install dependencies with \`npm install\`
3. Start the development server with \`npm run dev\`
4. Open your browser to \`http://localhost:3000\`

## Keyboard Shortcuts

- Ctrl+P: Open command palette
- Ctrl+S: Save current file
- Ctrl+\`: Toggle terminal
- F5: Run code
- Ctrl+Shift+D: Toggle dark mode
- Ctrl+Shift+L: Toggle light mode

## Technologies

- React
- TypeScript
- Tailwind CSS
- CodeMirror (for syntax highlighting)

## License

MIT

---

Created with 💜 by NebulaCode Team`,

  // JSON
  "package.json": `{
  "name": "nebulacode-studio",
  "version": "1.0.0",
  "description": "A futuristic code editor with space-age UI and immersive effects",
  "main": "index.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "jest"
  },
  "keywords": [
    "code-editor",
    "ide",
    "developer-tools",
    "syntax-highlighting"
  ],
  "author": "NebulaCode Team",
  "license": "MIT",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "codemirror": "^6.0.1"
  },
  "devDependencies": {
    "vite": "^4.4.0",
    "tailwindcss": "^3.3.3",
    "jest": "^29.6.0",
    "typescript": "^5.1.6"
  }
}`
};
