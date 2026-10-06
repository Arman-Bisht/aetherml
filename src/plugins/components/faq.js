import { escapeHtml } from '../../utils/escapeHtml.js';

export function renderFaqJSX(propsObj, childrenJSX) {
  const heading = propsObj.h2 || propsObj.title || 'Frequently Asked Questions';
  const subtitle = propsObj.subtitle || 'Everything you need to know about the product and architecture.';

  const rawItems = propsObj.items || 'How does token compression work?:AetherML compresses standard React boilerplate into dense DSL tags, allowing LLMs to generate full Next.js apps with up to 23x fewer tokens.|Can I edit the generated code?:Yes! You can customize files or run "aetherml eject" to detach completely and keep standard, unopinionated Next.js source code.|Does it support custom styling?:Yes, AetherML includes a full dynamic theme token engine and standard Tailwind CSS.';

  const faqItems = rawItems.split('|').map(raw => {
    const [q, a] = raw.split(':');
    return {
      q: (q || 'Common Question').trim(),
      a: (a || 'Detailed explanation of how this works.').trim()
    };
  });

  const faqsHtml = faqItems.map((item, idx) => `
    <details key="${idx}" className="group bg-slate-900/60 border border-slate-800 rounded-xl p-6 transition-all duration-200 open:bg-slate-850 open:border-slate-700">
      <summary className="flex justify-between items-center font-semibold text-white cursor-pointer list-none text-lg select-none">
        <span>${escapeHtml(item.q)}</span>
        <span className="text-blue-400 group-open:rotate-45 transition-transform duration-200 text-2xl font-light leading-none">+</span>
      </summary>
      <p className="mt-4 text-slate-300 text-sm leading-relaxed border-t border-slate-800/80 pt-4">
        ${escapeHtml(item.a)}
      </p>
    </details>
  `).join('\n');

  return `
<section className="py-24 px-6 max-w-4xl mx-auto">
  <div className="text-center mb-16">
    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
      ${escapeHtml(heading)}
    </h2>
    <p className="text-slate-400 text-lg">
      ${escapeHtml(subtitle)}
    </p>
  </div>
  <div className="space-y-4">
    ${faqsHtml}
  </div>
  ${childrenJSX ? `<div className="mt-12 text-center">${childrenJSX}</div>` : ''}
</section>
  `.trim();
}
