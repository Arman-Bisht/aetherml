import test from 'node:test';
import assert from 'node:assert';
import { tokenize } from '../src/core/lexer.js';
import { parse } from '../src/core/parser.js';
import { transform } from '../src/core/transformer.js';

test('1. Happy Path: Standard DSL Compilation', async (t) => {
    const input = `$page[intent:"saas"]`;
    const tokens = tokenize(input);
    const ast = parse(tokens);
    const { jsxString } = await transform(ast);
    assert.strictEqual(ast.body[0].name, '$page');
    assert.strictEqual(ast.body[0].props[0].value, 'saas');
    assert.ok(jsxString.includes('data-intent="saas"'));
});

test('2. Adversarial Lexer: Missing Closing Quotes & Brackets', async (t) => {
    const malformedInput = `$sec:hero[h1:"Hello, subtitle:"Missing"]`;
    const tokens = tokenize(malformedInput);
    const lastToken = tokens[tokens.length - 1];
    assert.strictEqual(lastToken.type, 'Bracket');
    assert.strictEqual(lastToken.value, ']');
});

test('3. Security Path: Prototype Pollution Shield', async (t) => {
    const maliciousInput = `$sec:hero[__proto__:"malicious", h1:"Safe"]`;
    const ast = parse(tokenize(maliciousInput));
    const hasProto = ast.body[0].props.some(p => p.key === '__proto__');
    assert.strictEqual(hasProto, false);
});

test('4. Security Path: XSS Sanitization in Transformer', async (t) => {
    const xssInput = `$sec:hero[h1:"<script>alert(1)</script>"]`;
    const { jsxString } = await transform(parse(tokenize(xssInput)));
    assert.ok(!jsxString.includes('<script>'));
    assert.ok(jsxString.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
});

// === NEW FUZZ CASES ===

test('5. Fuzz: Deep Nesting (Valid)', async (t) => {
    const input = `$page[intent:"test", $sec:hero[h1:"Nested", $btn[label:"Click", action:"deep"]]]`;
    const ast = parse(tokenize(input));
    assert.strictEqual(ast.body[0].children[0].children[0].name, '$btn');
});

test('6. Fuzz: Emoji and Unicode Injection', async (t) => {
    const input = `$sec:hero[h1:"🚀 Hello 🌍", subtitle:"こんにちは"]`;
    const ast = parse(tokenize(input));
    assert.strictEqual(ast.body[0].props[0].value, '🚀 Hello 🌍');
});

test('7. Fuzz: Extremely Long String Values', async (t) => {
    const longString = "A".repeat(10000);
    const input = `$sec:hero[h1:"${longString}"]`;
    const ast = parse(tokenize(input));
    assert.strictEqual(ast.body[0].props[0].value.length, 10000);
});

test('8. Fuzz: Empty/Null Values', async (t) => {
    const input = `$sec:hero[h1:"", subtitle:null]`;
    const ast = parse(tokenize(input));
    assert.strictEqual(ast.body[0].props[0].value, '');
});

test('9. Fuzz: Whitespace Chaos', async (t) => {
    const input = `  $page  [  intent  :   "saas"  ,    theme : "dark"  ]  `;
    const ast = parse(tokenize(input));
    assert.ok(ast !== null);
});

test('10. Fuzz: Mixed Valid + Invalid Components', async (t) => {
    const input = `$page[intent:"saas", $invalid:tag, $sec:hero[h1:"valid"]]`;
    const ast = parse(tokenize(input));
    // The parser should just treat $invalid:tag as a generic component or skip gracefully
    assert.ok(ast.body[0].children.length >= 1); 
});

test('11. Fuzz: Unclosed Brackets Chaos (Auto-Repair)', async (t) => {
    const input = `$page[intent:"saas" $sec:hero[h1:"test"`;
    const tokens = tokenize(input);
    const lastToken = tokens[tokens.length - 1];
    assert.strictEqual(lastToken.type, 'Bracket');
    assert.strictEqual(lastToken.value, ']');
});

test('12. Fuzz: Completely Garbage Tokens', async (t) => {
    const input = `not_a_tag { hello = world } $page[intent:"found"]`;
    const tokens = tokenize(input);
    const ast = parse(tokens);
    // Should still find the $page tag and parse it
    assert.strictEqual(ast.body.length > 0, true);
});

test('13. Fuzz: Extreme Missing Quotes', async (t) => {
    const input = `$sec:pricing[tiers:3, highlight:pro]`; // Missing quotes around 3 and pro
    const ast = parse(tokenize(input));
    // Lexer heuristic might bundle them or ignore them, but shouldn't crash
    assert.ok(ast !== null);
});

test('14. Fuzz: Rapid Nested Unclosed', async (t) => {
    const input = `$page[$sec:a[$sec:b[$sec:c[`;
    const tokens = tokenize(input);
    // Should gracefully auto-close or truncate without throwing StackOverflow
    assert.ok(tokens.length > 0);
});

test('15. Fuzz: SQL Injection in Props (Safe Handling)', async (t) => {
    const input = `$sec:hero[h1:"DROP TABLE users;--"]`;
    const { jsxString } = await transform(parse(tokenize(input)));
    // Next.js React JSX natively prevents SQLi by rendering as text, but we ensure it doesn't break our AST
    assert.ok(jsxString.includes('DROP TABLE'));
});
