/**
 * Parser for AetherML
 * Builds AST from lexer tokens with line number tracking
 */
export function parse(tokens) {
  let current = 0;

  function walk() {
    if (current >= tokens.length) return null;

    let token = tokens[current];

    if (token.type === 'ComponentType') {
      let node = {
        type: 'Component',
        name: token.value,
        identifier: null,
        props: [],
        children: [],
        line: token.line
      };
      current++;

      if (current < tokens.length && tokens[current].type === 'Identifier') {
        node.identifier = tokens[current].value;
        current++;
      }

      if (current < tokens.length && tokens[current].type === 'Bracket' && tokens[current].value === '[') {
        current++;
        
        while (current < tokens.length && !(tokens[current].type === 'Bracket' && tokens[current].value === ']')) {
          let innerToken = tokens[current];

          if (innerToken.type === 'ComponentType') {
            let child = walk();
            if (child) node.children.push(child);
            continue;
          }

          if (innerToken.type === 'Key') {
            let keyName = innerToken.value;
            current++;
            
            if (/__proto__|constructor|prototype/.test(keyName)) {
              if (current < tokens.length && (tokens[current].type === 'String' || tokens[current].type === 'Identifier')) {
                current++;
              }
              continue;
            }

            let val = '';
            if (current < tokens.length && (tokens[current].type === 'String' || tokens[current].type === 'Identifier')) {
              val = tokens[current].value;
              current++;
            }
            node.props.push({ key: keyName, value: val });
            continue;
          }

          if (innerToken.type === 'Separator') {
            current++;
            continue;
          }
          
          current++;
        }
        
        if (current < tokens.length && tokens[current].type === 'Bracket' && tokens[current].value === ']') {
          current++; 
        }
      }
      return node;
    }

    current++;
    return null;
  }

  let ast = {
    type: 'Program',
    body: []
  };

  while (current < tokens.length) {
    let node = walk();
    if (node) {
      ast.body.push(node);
    }
  }

  return ast;
}
