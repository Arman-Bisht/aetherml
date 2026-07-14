import { escapeHtml } from '../../utils/escapeHtml.js';

export function renderHeroJSX(propsObj, childrenJSX) {
  const title = propsObj.h1 ? escapeHtml(propsObj.h1) : 'Build Faster with AetherML';
  const subtitle = propsObj.subtitle ? escapeHtml(propsObj.subtitle) : 'The AI-Native language that generates full-stack Next.js applications instantly.';

  return `
<section className="relative min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden px-6">
  {/* Dark gradient overlay for modern aesthetic */}
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-black z-0"></div>
  
  {/* Glass container */}
  <div className="relative z-10 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-[2rem] p-12 md:p-20 text-center max-w-5xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]">
    <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent tracking-tight leading-[1.1]">
      ${title}
    </h1>
    <p className="text-xl md:text-2xl text-slate-300 font-light mb-12 leading-relaxed max-w-3xl mx-auto">
      ${subtitle}
    </p>
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-8">
      ${childrenJSX}
    </div>
  </div>
</section>
  `.trim();
}
