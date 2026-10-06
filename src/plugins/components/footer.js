import { escapeHtml } from '../../utils/escapeHtml.js';

export function renderFooterJSX(propsObj, childrenJSX) {
  const brand = escapeHtml(propsObj.brand || 'AetherML');
  const year = new Date().getFullYear();
  const copyright = escapeHtml(propsObj.copyright || `© ${year} ${propsObj.brand || 'AetherML'}. All rights reserved.`);

  const rawLinks = propsObj.links || 'Documentation,Privacy Policy,Terms of Service,GitHub';
  const links = rawLinks.split(',').map(l => l.trim()).filter(Boolean);

  const linksHtml = links.map(link => {
    const safeLink = escapeHtml(link);
    const slug = safeLink.toLowerCase().replace(/\s+/g, '-');
    return `<a href="#${slug}" className="text-slate-400 hover:text-white transition-colors text-sm">${safeLink}</a>`;
  }).join('\n        ');

  return `
<footer className="border-t border-slate-800/80 bg-slate-950 py-16 px-6 mt-auto">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
    <div className="flex flex-col items-center md:items-start gap-2">
      <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">${brand}</span>
      <p className="text-slate-500 text-sm">${copyright}</p>
    </div>
    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
      ${linksHtml}
    </div>
    ${childrenJSX ? `<div className="flex items-center gap-4">${childrenJSX}</div>` : ''}
  </div>
</footer>
  `.trim();
}
