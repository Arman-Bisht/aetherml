import { escapeHtml } from '../utils/escapeHtml.js';
import { renderHeroJSX } from '../plugins/components/hero.js';

export async function transform(ast) {
  let integrations = new Set();

  async function walk(node) {
    if (node.type === 'Program') {
      const results = await Promise.allSettled(node.body.map(walk));
      return results.filter(r => r.status === 'fulfilled').map(r => r.value).join('\n');
    }
    
    if (node.type === 'Component') {
      let compType = node.name.replace('$', '').replace(':', '');
      let compName = node.identifier || compType;
      
      const rawTag = `$${compType}${compName && compName !== compType ? ':'+compName : ''}`;

      const childResults = await Promise.allSettled(node.children.map(walk));
      let childrenJSX = childResults.filter(r => r.status === 'fulfilled').map(r => r.value).join('\n');

      const propsObj = Object.create(null);
      let rawPropsList = [];
      node.props.forEach(p => {
        const keyName = p.key.replace(':', '');
        propsObj[keyName] = p.value;
        rawPropsList.push(`${p.key}"${p.value}"`);
      });
      
      let rawPropsString = rawPropsList.length > 0 ? `[${rawPropsList.join(', ')}]` : '';
      const sourceMap = `\n{/* AetherML Line ${node.line || '?'}: Generated from ${rawTag}${rawPropsString} */}\n`;

      if (compType === 'anim' && compName === 'gsap') {
        integrations.add('gsap');
        if (!propsObj.effect) throw new Error(`Error in GsapPlugin: Required prop 'effect' is missing on Line ${node.line || '?'}.`);
        return `${sourceMap}<GsapWrapper effect="${escapeHtml(propsObj.effect)}">\n${childrenJSX}\n</GsapWrapper>`;
      }

      if (compType === 'auth' && (compName === 'supabase' || compName === 'firebase')) {
        integrations.add('supabase'); 
        return `${sourceMap}<AuthUI />`;
      }

      if (compType === 'pay' && compName === 'razorpay') {
        integrations.add('razorpay');
        if (!propsObj.amount) throw new Error(`Error in RazorpayPlugin: Required prop 'amount' is missing on Line ${node.line || '?'}.`);
        return `${sourceMap}<RazorpayButton amount="${escapeHtml(propsObj.amount)}" />`;
      }

      if (compType === 'sec' && compName === 'hero') {
        if (!propsObj.h1) throw new Error(`Error in HeroPlugin: Required prop 'h1' is missing on Line ${node.line || '?'}.`);
        return sourceMap + renderHeroJSX(propsObj, childrenJSX);
      }
      
      if (compType === 'sec' && compName === 'pricing') {
        return sourceMap + `
        <div className="py-24 max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">Basic Plan</div>
            <div className="bg-indigo-900 p-8 rounded-2xl border border-indigo-500 scale-105 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
              <h3 className="text-xl font-bold text-indigo-300">Pro Plan</h3>
              <p className="text-4xl font-black mt-4">₹999</p>
              <div className="mt-8">${childrenJSX}</div>
            </div>
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">Enterprise</div>
          </div>
        </div>`.trim();
      }
      
      if (compName === 'btn') {
        if (!propsObj.label) throw new Error(`Error in BtnPlugin: Required prop 'label' is missing on Line ${node.line || '?'}.`);
        let label = escapeHtml(propsObj.label);
        
        if (propsObj.action && (propsObj.action.includes('firebase') || propsObj.action.includes('supabase'))) {
           integrations.add('supabase');
           return `${sourceMap}<AuthUI />`; 
        }
        if (propsObj.action && propsObj.action.includes('razorpay')) {
           integrations.add('razorpay');
           const amountMatch = propsObj.action.match(/amount:['"](\d+)['"]/);
           if (!amountMatch) throw new Error(`Error in BtnPlugin: Razorpay action requires 'amount' mapping on Line ${node.line || '?'}.`);
           return `${sourceMap}<RazorpayButton amount="${amountMatch[1]}" />`;
        }

        return `${sourceMap}<button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold shadow-lg shadow-blue-500/30 transition-colors">${label}</button>`;
      }
      
      if (compType === 'page') {
        return `${sourceMap}<div className="aether-page flex flex-col min-h-screen w-full" data-intent="${escapeHtml(propsObj.intent) || 'generic'}">\n${childrenJSX}\n</div>`;
      }

      return `${sourceMap}<div>${childrenJSX}</div>`;
    }
    
    return '';
  }

  const jsxString = await walk(ast);

  return { jsxString, integrations };
}
