import { escapeHtml } from '../../utils/escapeHtml.js';

export function renderFeaturesJSX(propsObj, childrenJSX) {
  const heading = propsObj.h2 || propsObj.title || 'Engineered for Performance';
  const subtitle = propsObj.subtitle || 'Built-in primitives that scale with your application.';
  const cols = propsObj.cols === '2' ? 'md:grid-cols-2' : propsObj.cols === '4' ? 'md:grid-cols-4' : 'md:grid-cols-3';
  
  const rawItems = propsObj.items || 'Speed:Compiles Next.js in milliseconds|Security:AST Prototype Pollution Protection|SEO:Automatic schema and heading guardrails';
  const items = rawItems.split('|').map(raw => {
    const [name, desc] = raw.split(':');
    return {
      title: (name || 'Feature').trim(),
      desc: (desc || 'High-performance built-in component.').trim()
    };
  });

  const cardsHtml = items.map((item, idx) => `
    <div key="${idx}" className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 transition-all duration-300 shadow-lg group">
      <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        ${idx + 1}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">${escapeHtml(item.title)}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">${escapeHtml(item.desc)}</p>
    </div>
  `).join('\n');

  return `
<section className="py-24 px-6 max-w-7xl mx-auto">
  <div className="text-center max-w-3xl mx-auto mb-16">
    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
      ${escapeHtml(heading)}
    </h2>
    <p className="text-lg text-slate-400">
      ${escapeHtml(subtitle)}
    </p>
  </div>
  <div className="grid grid-cols-1 ${cols} gap-8">
    ${cardsHtml}
  </div>
  ${childrenJSX ? `<div className="mt-12 text-center">${childrenJSX}</div>` : ''}
</section>
  `.trim();
}
