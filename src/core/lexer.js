/**
 * Lexer for AetherML
 * Tokenizes raw AetherML string with Graceful Fallbacks and Source Mapping
 */
export function tokenize(input) {
  let current = 0;
  let line = 1;
  let tokens = [];
  let bracketStack = 0;

  while (current < input.length) {
    let char = input[current];

    if (char === '\n') {
      line++;
      current++;
      continue;
    }

    // Ignore random whitespace
    if (/\s/.test(char)) {
      current++;
      continue;
    }

    // Component Type: e.g., $sec: or $btn
    if (char === '$') {
      let value = '';
      while (current < input.length && /[a-zA-Z0-9$-]/i.test(input[current])) {
        value += input[current];
        current++;
      }
      // If it has a colon suffix, include it (e.g., $sec:)
      if (current < input.length && input[current] === ':') {
        value += ':';
        current++;
      }
      tokens.push({ type: 'ComponentType', value, line });
      continue;
    }

    // Keys (e.g., h1:, label:) and Identifiers (e.g., hero)
    if (/[a-zA-Z0-9]/i.test(char)) {
      let value = '';
      while (current < input.length && /[a-zA-Z0-9-]/i.test(input[current])) {
        value += input[current];
        current++;
      }
      if (current < input.length && input[current] === ':') {
        value += ':';
        current++;
        tokens.push({ type: 'Key', value, line });
      } else {
        tokens.push({ type: 'Identifier', value, line });
      }
      continue;
    }

    // Strings
    if (char === '"') {
      let value = '';
      let stringLine = line; // line number where string started
      current++; // skip opening quote
      
      let isClosed = false;
      while (current < input.length) {
        let nextChar = input[current];
        
        if (nextChar === '\n') {
          line++;
        }

        if (nextChar === '"') {
          isClosed = true;
          current++; // skip closing quote
          break;
        }
        
        value += nextChar;
        current++;
      }
      
      tokens.push({ type: 'String', value, line: stringLine });
      continue;
    }

    // Brackets
    if (char === '[') {
      bracketStack++;
      tokens.push({ type: 'Bracket', value: '[', line });
      current++;
      continue;
    }
    if (char === ']') {
      if (bracketStack > 0) bracketStack--;
      tokens.push({ type: 'Bracket', value: ']', line });
      current++;
      continue;
    }

    // Separators
    if (char === ',') {
      tokens.push({ type: 'Separator', value: ',', line });
      current++;
      continue;
    }

    // Unrecognized character
    current++;
  }

  while (bracketStack > 0) {
    tokens.push({ type: 'Bracket', value: ']', line });
    bracketStack--;
  }

  return tokens;
}
