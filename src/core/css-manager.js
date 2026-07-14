import fs from 'fs';
import path from 'path';

// CRITICAL SECURITY: Strict Allowlist to prevent Path Traversal attacks
const ALLOWED_COMPONENTS = ['hero', 'btn', 'chart', '3d'];

/**
 * Reads CSS files for requested components and returns minified CSS.
 */
export function generateCriticalCSS(componentNames) {
  let combinedCss = '';
  
  for (const name of componentNames) {
    // SECURITY ENFORCEMENT: Reject any requested component not explicitly allowed
    if (!ALLOWED_COMPONENTS.includes(name)) {
      console.warn(`SECURITY WARNING: Blocked attempt to load unauthorized CSS component -> ${name}`);
      continue;
    }

    // Expected path: src/templates/components/{name}.css
    const cssPath = path.join(process.cwd(), 'src', 'templates', 'components', `${name}.css`);
    if (fs.existsSync(cssPath)) {
      combinedCss += fs.readFileSync(cssPath, 'utf-8');
    }
  }

  // CRITICAL: Zero-dependency CSS Minifier using Regex
  let minified = combinedCss
    .replace(/\/\*[\s\S]*?\*\//g, '') // Strip all CSS comments /* ... */
    .replace(/[\r\n\t]+/g, ' ')       // Strip newlines and tabs
    .replace(/\s+/g, ' ')             // Collapse multiple spaces into one
    .replace(/\s*([{}:;,])\s*/g, '$1') // Remove spaces around syntax delimiters
    .trim();

  if (!minified) return '';
  return `<style>${minified}</style>`;
}
