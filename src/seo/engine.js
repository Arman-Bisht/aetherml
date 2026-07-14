/**
 * SEO & Performance Engine
 * Scans the AST for semantic integrity, JSON-LD Schema generation, and Preload opportunities.
 */
export function generateSeoMetadata(ast) {
  let h1Count = 0;
  let intent = null;
  let heroImage = null;

  function walk(node) {
    if (node.type === 'Program') {
      node.body.forEach(walk);
    } else if (node.type === 'Component') {
      // 1. Check for page intent
      if (node.name.startsWith('$page')) {
        let intentProp = node.props.find(p => p.key === 'intent:' || p.key === 'intent');
        if (intentProp) intent = intentProp.value;
      }
      
      // 2. Check for hero image (img prop in a hero component)
      let compType = node.name.replace('$', '').replace(':', '');
      let compName = node.identifier || compType;
      
      if (compType === 'sec' && compName === 'hero') {
        let imgProp = node.props.find(p => p.key === 'img:' || p.key === 'img');
        if (imgProp) heroImage = imgProp.value;
      }

      // 3. Count h1 tags in the AST (based on h1 prop)
      let h1Prop = node.props.find(p => p.key === 'h1:' || p.key === 'h1');
      if (h1Prop) h1Count++;

      // Recursively walk children
      node.children.forEach(walk);
    }
  }

  walk(ast);

  // Semantic Instructions
  let semanticInstructions = { promoteH2: false, demoteH1s: false };
  if (h1Count === 0) {
    console.warn("SEO WARNING: Zero <h1> tags found. Promoting first <h2> to <h1>.");
    semanticInstructions.promoteH2 = true;
  } else if (h1Count > 1) {
    console.warn(`SEO WARNING: Found ${h1Count} <h1> tags. Demoting subsequent <h1> tags to <h2>.`);
    semanticInstructions.demoteH1s = true;
  }

  // JSON-LD Schema Generation
  let schemaHtml = '';
  if (intent === 'ecommerce') {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Store",
      "name": "AetherML Store"
    };
    schemaHtml = `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
  } else if (intent === 'article') {
    const schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "AetherML Article"
    };
    schemaHtml = `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
  }

  // LCP Preloading
  let preloadHtml = '';
  if (heroImage) {
    preloadHtml = `<link rel="preload" as="image" href="${heroImage}">`;
  }

  return { semanticInstructions, schemaHtml, preloadHtml };
}
