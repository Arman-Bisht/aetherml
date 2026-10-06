import { escapeHtml } from '../../utils/escapeHtml.js';

export function renderNavJSX(propsObj, childrenJSX) {
  const brand = escapeHtml(propsObj.brand || 'AetherML');
  const linksRaw = propsObj.links || 'Features,Pricing,About';
  const links = linksRaw.split(',').map(l => l.trim()).filter(Boolean);
  const cta = propsObj.cta ? escapeHtml(propsObj.cta) : null;

  const linksHtml = links.map(link => {
    const safeLink = escapeHtml(link);
    const slug = safeLink.toLowerCase().replace(/\s+/g, '-');
    return `<a href="#${slug}" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">${safeLink}</a>`;
  }).join('\n      ');

  const ctaHtml = cta
    ? `<a href="#action" className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full text-sm font-semibold shadow-md transition-all">${cta}</a>`
    : '';

  return `
<nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-slate-950/80 border-b border-slate-800/80 px-6 py-4">
  <div className="max-w-7xl mx-auto flex items-center justify-between">
    <div className="flex items-center gap-3">
      <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">${brand}</span>
    </div>
    <div className="hidden md:flex items-center gap-8">
      ${linksHtml}
    </div>
    <div className="flex items-center gap-4">
      ${ctaHtml}
      ${childrenJSX}
    </div>
  </div>
</nav>
  `.trim();
}
