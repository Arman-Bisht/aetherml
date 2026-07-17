export function validateSEO(ast) {
  let h1Count = 0;
  let hasIntent = false;

  let pageTitle = null;
  let pageDesc = null;
  let firstH1 = null;

  let warnings = [];
  let errors = [];

  function scan(node, currentHeadingDepth) {
    if (node.type === 'Program') {
      node.body.forEach(child => scan(child, 0));
    } else if (node.type === 'Component') {
      let compType = node.name.replace('$', '').replace(':', '');
      
      let nextHeadingDepth = currentHeadingDepth;

      if (compType === 'page') {
        node.props.forEach(p => {
          if (p.key === 'intent:' || p.key === 'intent') hasIntent = true;
          if (p.key === 'title:' || p.key === 'title') pageTitle = p.value;
          if (p.key === 'desc:' || p.key === 'desc') pageDesc = p.value;
        });
      }
      
      let compHeadingDepth = null;
      for (let i = 1; i <= 6; i++) {
        let hProp = node.props.find(p => p.key === `h${i}:` || p.key === `h${i}`);
        if (hProp) {
          if (i === 1) {
            h1Count++;
            if (!firstH1) firstH1 = hProp.value;
          }
          if (compHeadingDepth === null || i < compHeadingDepth) {
            compHeadingDepth = i;
          }
        }
      }

      if (compHeadingDepth !== null) {
        if (currentHeadingDepth > 0 && compHeadingDepth > currentHeadingDepth + 1) {
          errors.push(`Heading hierarchy skip detected: H${compHeadingDepth} appears after H${currentHeadingDepth} without an intermediate heading.`);
        }
        nextHeadingDepth = compHeadingDepth;
      }
      
      let passDepth = nextHeadingDepth;
      if (compType === 'page') {
         passDepth = 1; // Top-level sections assume H1 exists at the page level
      }

      node.children.forEach(child => scan(child, passDepth));
    }
  }

  scan(ast, 0);

  // Existing validations
  if (h1Count === 0) errors.push("Missing <h1> tag. A hero section must have an 'h1' prop for SEO.");
  if (h1Count > 1) errors.push(`Found ${h1Count} <h1> tags. Google penalizes multiple H1s.`);
  if (!hasIntent) errors.push("Missing 'intent' prop on $page. (Required for JSON-LD schema generation)");

  // 1. Title Length Check
  let actualTitle = pageTitle || firstH1 || "";
  // Note: multi-byte/emoji characters may need Array.from(str).length or a grapheme-aware count later
  let titleLen = actualTitle.length;
  if (titleLen > 60) {
    errors.push(`Title exceeds 60 characters (${titleLen} chars).`);
  } else if (titleLen >= 50 && titleLen <= 60) {
    warnings.push(`Title is ${titleLen} characters (approaching the 60 char limit).`);
  }

  // 2. Meta Description Length Check
  if (pageDesc === null || pageDesc === undefined) {
    warnings.push(`Missing 'desc' prop on $page. A meta description is highly recommended.`);
  } else {
    let descLen = pageDesc.length;
    if (descLen > 165) {
      errors.push(`Meta description exceeds 165 characters (${descLen} chars).`);
    } else if (descLen < 120 || (descLen >= 160 && descLen <= 165)) {
      warnings.push(`Meta description is ${descLen} chars. Optimal length is 120-159 characters.`);
    }
  }

  return {
    isValid: errors.length === 0,
    h1Count,
    hasIntent,
    errors,
    warnings
  };
}
