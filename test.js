import { tokenize } from './src/core/lexer.js';
import { parse } from './src/core/parser.js';
import { transform } from './src/core/transformer.js';
import { generateSeoMetadata } from './src/seo/engine.js';
import { generateHtml } from './src/core/generator.js';

// Hallucinated / Mangled AetherML with Plugin test point
const hallucinatedSource = `
  $page[intent:"ecommerce"]
  $sec:hero [
    img: "hero-lcp.jpg",
    h1: "Welcome to AetherML , 
    $btn[label:"Click Now!"
  ]
  $sec:hero [
    h1: "Second Hero (Should be demoted to H2)"
  ]
  $plugin:chart[type:"bar", labels:"Q1|Q2|Q3", data:"15|30|45"]
`;

console.log("=========================================");
console.log("=== PHASE 1: LEXER & PARSER ===");
const tokens = tokenize(hallucinatedSource);
const ast = parse(tokens);
console.log("AST parsed successfully.");

console.log("\n=========================================");
console.log("=== PHASE 2: TRANSFORMER ===");
const transformerOutput = await transform(ast);
console.log("Intermediate output generated with Plugins:", transformerOutput.activePlugins);

console.log("\n=========================================");
console.log("=== PHASE 3 & 4: SEO ENGINE, GENERATOR, & PLUGINS ===");
const seoMetadata = generateSeoMetadata(ast);

const finalDocument = generateHtml(transformerOutput, seoMetadata);

console.log("\nFINAL HTML DOCUMENT:");
console.log(finalDocument);
