export function validateSEO(ast) {
  let h1Count = 0;
  let hasIntent = false;

  function scan(node) {
    if (node.type === 'Program') {
      node.body.forEach(scan);
    } else if (node.type === 'Component') {
      let compType = node.name.replace('$', '').replace(':', '');
      
      if (compType === 'page') {
        node.props.forEach(p => {
          if (p.key === 'intent:') hasIntent = true;
        });
      }
      
      node.props.forEach(p => {
        if (p.key === 'h1:') h1Count++;
      });
      
      node.children.forEach(scan);
    }
  }

  scan(ast);

  let errors = [];
  if (h1Count === 0) errors.push("Missing <h1> tag. A hero section must have an 'h1' prop for SEO.");
  if (h1Count > 1) errors.push(`Found ${h1Count} <h1> tags. Google penalizes multiple H1s.`);
  if (!hasIntent) errors.push("Missing 'intent' prop on $page. (Required for JSON-LD schema generation)");

  return {
    isValid: errors.length === 0,
    h1Count,
    hasIntent,
    errors
  };
}
