/**
 * AetherML Decompiler / Compressor
 * Reverse-engineers React / Next.js JSX code into ultra-compact AetherML DSL.
 */

export function decompileReactToAether(jsxCode) {
  if (!jsxCode || typeof jsxCode !== 'string') {
    return '$page[intent:"generic", theme:"midnight"]';
  }

  const components = [];

  // 1. Detect Navigation
  const navMatch = jsxCode.match(/<nav[\s\S]*?<\/nav>/i);
  if (navMatch) {
    const navBlock = navMatch[0];
    const brandMatch = navBlock.match(/<span[^>]*>([^<]+)<\/span>/i) || navBlock.match(/<a[^>]*brand[^>]*>([^<]+)<\/a>/i);
    const brand = brandMatch ? brandMatch[1].trim() : 'App';

    const linkMatches = [...navBlock.matchAll(/<a[^>]*href=["']#[^"']*["'][^>]*>([^<]+)<\/a>/gi)];
    const links = linkMatches.map(m => m[1].trim()).filter(Boolean);
    const linksProp = links.length > 0 ? `, links:"${links.join(',')}"` : '';

    components.push(`$nav[brand:"${brand}"${linksProp}]`);
  }

  // 2. Detect Hero Section (H1)
  const h1Match = jsxCode.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match) {
    const rawH1 = h1Match[1].replace(/<[^>]+>/g, '').trim();
    // Look for nearby subtitle in a <p> tag
    const heroSectionMatch = jsxCode.match(/<section[\s\S]*?<h1[\s\S]*?<\/section>/i);
    let subtitle = '';
    if (heroSectionMatch) {
      const pMatch = heroSectionMatch[0].match(/<p[^>]*>([\s\S]*?)<\/p>/i);
      if (pMatch) subtitle = pMatch[1].replace(/<[^>]+>/g, '').trim();
    }

    const subProp = subtitle ? `, subtitle:"${subtitle.replace(/"/g, '\\"')}"` : '';
    components.push(`$sec:hero[h1:"${rawH1.replace(/"/g, '\\"')}"${subProp}]`);
  }

  // 3. Detect Features Grid
  const featuresMatch = jsxCode.match(/<section[\s\S]*?(Features|Engineered|Capabilities|Why Choose)[\s\S]*?<\/section>/i);
  if (featuresMatch) {
    const featBlock = featuresMatch[0];
    const cardTitles = [...featBlock.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
    if (cardTitles.length > 0) {
      const items = cardTitles.slice(0, 4).map(t => `${t}:Built-in optimization`).join('|');
      components.push(`$sec:features[cols:"${Math.min(cardTitles.length, 3)}", items:"${items}"]`);
    } else {
      components.push(`$sec:features[cols:"3"]`);
    }
  }

  // 4. Detect Pricing Section
  const pricingMatch = jsxCode.match(/(Pricing|Simple no-tricks pricing|Pro Membership|subscription)/i);
  if (pricingMatch && !components.some(c => c.startsWith('$sec:pricing'))) {
    components.push(`$sec:pricing[tiers:"3", highlight:"pro"]`);
  }

  // 5. Detect FAQ (<details>)
  const detailsMatches = [...jsxCode.matchAll(/<summary[^>]*>([\s\S]*?)<\/summary>/gi)];
  if (detailsMatches.length > 0) {
    const questions = detailsMatches.map(m => m[1].replace(/<[^>]+>/g, '').trim()).slice(0, 3);
    const items = questions.map(q => `${q}:Instant automated answer`).join('|');
    components.push(`$sec:faq[items:"${items}"]`);
  }

  // 6. Detect Buttons (outside of nav)
  const buttonMatches = [...jsxCode.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/gi)];
  const nonNavButtons = buttonMatches
    .map(m => m[1].replace(/<[^>]+>/g, '').trim())
    .filter(label => label && !label.includes('+') && label.length < 30);
  
  if (nonNavButtons.length > 0) {
    const uniqueBtns = [...new Set(nonNavButtons)].slice(0, 2);
    uniqueBtns.forEach(lbl => {
      components.push(`$btn[label:"${lbl}"]`);
    });
  }

  // 7. Detect Footer
  const footerMatch = jsxCode.match(/<footer[\s\S]*?<\/footer>/i);
  if (footerMatch) {
    const brandMatch = footerMatch[0].match(/<span[^>]*>([^<]+)<\/span>/i);
    const brand = brandMatch ? brandMatch[1].trim() : 'AetherML';
    components.push(`$footer[brand:"${brand}"]`);
  }

  // If no recognized components, fallback to basic hero
  if (components.length === 0) {
    components.push('$sec:hero[h1:"Imported Project"]');
  }

  const dslString = `$page[intent:"saas", theme:"midnight",\n  ${components.join(',\n  ')}\n]`;

  const originalLength = jsxCode.length;
  const compressedLength = dslString.length;
  const ratio = (originalLength / Math.max(compressedLength, 1)).toFixed(1);

  return {
    dslString,
    stats: {
      originalLength,
      compressedLength,
      ratio: `${ratio}x`
    }
  };
}
