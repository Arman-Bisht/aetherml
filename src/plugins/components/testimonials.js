import { escapeHtml } from '../../utils/escapeHtml.js';

export function renderTestimonialsJSX(propsObj, childrenJSX) {
  const heading = propsObj.h2 || propsObj.title || 'Loved by Developers Worldwide';
  const subtitle = propsObj.subtitle || 'See how teams ship full-stack products at 10x speed.';
  
  const rawItems = propsObj.items || 'AetherML cut our AI token spend by 80% while generating clean Next.js code.:Sarah Chen:CTO at CloudScale|The built-in SEO guardrails stopped broken heading tags before production.:Alex Rivera:Lead Frontend Architect|It feels like magic. Compiling dense DSL down to production React in milliseconds.:Marcus Vance:Staff Engineer';
  
  const testimonials = rawItems.split('|').map(raw => {
    const parts = raw.split(':');
    return {
      quote: (parts[0] || 'Incredible productivity boost.').trim(),
      author: (parts[1] || 'Verified User').trim(),
      role: (parts[2] || 'Developer').trim()
    };
  });

  const cardsHtml = testimonials.map((t, idx) => `
    <div key="${idx}" className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 flex flex-col justify-between shadow-xl">
      <p className="text-slate-300 text-base italic mb-6 leading-relaxed">"${escapeHtml(t.quote)}"</p>
      <div className="flex items-center gap-4 pt-4 border-t border-slate-850">
        <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-sm">
          ${escapeHtml(t.author.charAt(0) || 'U')}
        </div>
        <div>
          <div className="font-semibold text-white text-sm">${escapeHtml(t.author)}</div>
          <div className="text-xs text-slate-400">${escapeHtml(t.role)}</div>
        </div>
      </div>
    </div>
  `).join('\n');

  return `
<section className="py-24 px-6 max-w-7xl mx-auto">
  <div className="text-center max-w-2xl mx-auto mb-16">
    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
      ${escapeHtml(heading)}
    </h2>
    <p className="text-slate-400 text-lg">
      ${escapeHtml(subtitle)}
    </p>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    ${cardsHtml}
  </div>
  ${childrenJSX ? `<div className="mt-12 text-center">${childrenJSX}</div>` : ''}
</section>
  `.trim();
}
