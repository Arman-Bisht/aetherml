import test from 'node:test';
import assert from 'node:assert';
import { tokenize } from '../src/core/lexer.js';
import { parse } from '../src/core/parser.js';
import { transform } from '../src/core/transformer.js';

test('Happy Path: Standard DSL Compilation', async (t) => {
    const input = `$page[intent:"saas"]`;
    const tokens = tokenize(input);
    const ast = parse(tokens);
    const { jsxString } = await transform(ast);
    
    assert.strictEqual(ast.body[0].name, '$page');
    assert.strictEqual(ast.body[0].props[0].value, 'saas');
    assert.ok(jsxString.includes('data-intent="saas"'));
});

test('Adversarial Lexer: Missing Closing Quotes & Brackets', async (t) => {
    // Malformed AI output: missing the closing quote for "Hello" and missing the closing bracket ]
    const malformedInput = `$sec:hero[h1:"Hello, subtitle:"Missing"]`;
    const tokens = tokenize(malformedInput);
    
    // Check Graceful Syntax Repair: Lexer should auto-insert the missing bracket at the end
    const lastToken = tokens[tokens.length - 1];
    assert.strictEqual(lastToken.type, 'Bracket');
    assert.strictEqual(lastToken.value, ']');
    
    const ast = parse(tokens);
    assert.strictEqual(ast.body[0].name, '$sec:');
    assert.strictEqual(ast.body[0].identifier, 'hero');
});

test('Security Path: Prototype Pollution Shield', async (t) => {
    const maliciousInput = `$sec:hero[__proto__:"malicious", h1:"Safe"]`;
    const tokens = tokenize(maliciousInput);
    const ast = parse(tokens);
    
    const heroNode = ast.body[0];
    
    // Ensure __proto__ was completely stripped by the parser
    const hasProto = heroNode.props.some(p => p.key === '__proto__');
    assert.strictEqual(hasProto, false);
    
    // Ensure the safe prop survived
    const hasSafe = heroNode.props.some(p => p.key === 'h1:' && p.value === 'Safe');
    assert.strictEqual(hasSafe, true);
});

test('Security Path: XSS Sanitization in Transformer', async (t) => {
    const xssInput = `$sec:hero[h1:"<script>alert(1)</script>"]`;
    const tokens = tokenize(xssInput);
    const ast = parse(tokens);
    
    const { jsxString } = await transform(ast);
    
    // Ensure the script tag is escaped (e.g. &lt;script&gt;)
    assert.ok(!jsxString.includes('<script>'));
    assert.ok(jsxString.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
});
