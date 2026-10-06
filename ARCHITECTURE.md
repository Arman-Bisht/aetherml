# AetherML Architecture Guide 🌌

Welcome to the internal engine of AetherML! This document explains how the compiler takes highly compressed, AI-generated DSL (Domain Specific Language) and expands it into a production-grade Next.js application.

---

## ⚙️ The 6-Stage Pipeline

AetherML operates on a strict, linear compilation pipeline:

### 1. The Lexer (`src/core/lexer.js`)
The Lexer's job is to read the raw `.aether` string character by character and convert it into an array of semantic Tokens (like `ComponentType`, `String`, `Bracket`). 
**Enterprise Feature:** The Lexer includes graceful syntax repair. Because LLMs sometimes hallucinate (e.g., forgetting a closing quote), the Lexer uses heuristics to auto-repair the code before passing it forward.

### 2. The Parser (`src/core/parser.js`)
The Parser consumes the Token array and builds an **Abstract Syntax Tree (AST)**. 
**Enterprise Feature:** It acts as the first security layer. It validates the parent-child relationships and shields against AST Prototype Pollution attacks.

### 3. The Transformer (`src/core/transformer.js`)
The Transformer traverses the AST and begins the heavy lifting. It maps AetherML tags (like `$sec:hero`) to their underlying React/Tailwind string templates. It also keeps track of which `activePlugins` were triggered.

### 4. The SEO Engine (`src/seo/engine.js` & `src/seo/validator.js`)
Before code generation, the AST is passed through the SEO Guardrails.
*   **Validator:** Scans the AST to protect Search Engine rankings. If `--strict` mode is enabled, it fatally crashes the build on the following violations:
    *   Missing `<h1>` tags or missing page intents.
    *   Page `title` exceeding 60 characters.
    *   Meta `desc` exceeding 165 characters.
    *   Heading hierarchy skips within a section scope (e.g., an `<h3>` appears without a preceding `<h2>`).
*   **Engine:** Automatically generates Schema.org JSON-LD structured data based on the page intent (e.g., generating `SoftwareApplication` schema for SaaS pages).

### 5. The Theme Engine (`src/core/theme-engine.js`)
Maps abstract DSL design tokens into standard CSS custom properties (`--primary`, `--background`, `--card`, `--radius`) and dynamically updates `tailwind.config.ts`. Includes out-of-the-box presets: `midnight`, `cyberpunk`, `minimal`, `corporate`, and `emerald`.

### 6. The Plugin Trust Model & Bridge (`src/plugins/`)
A decoupled architecture where third-party integrations (like Razorpay, Supabase, GSAP) and semantic component primitives (`$nav`, `$sec:features`, `$sec:testimonials`, `$sec:faq`, `$footer`) are completely separated from the core compiler. 
**Enterprise Trust Model:** AetherML does **not** dynamically load unverified NPM packages at runtime. All plugins must be submitted as Pull Requests and manually audited by the core team before being merged.

### 7. The Generator & Non-Destructive Slots (`src/core/enterprise-generator.js`)
The final stage. The Generator takes the transformed React components, the theme tokens, and the plugin requirements, and scaffolds a pure Next.js 14 App Router application inside `dist_app/`.
*   **Slot Preservation:** Includes `components/slots/CustomSlot.tsx`. Any hand-crafted code written in the `slots/` directory is permanently protected and will never be overwritten on subsequent `build` or `dev` runs.

### 8. The Reverse Compiler (`src/core/decompiler.js`)
Translates standard React/JSX markup backwards into dense `.aether` DSL via pattern recognition, achieving up to 23x compression ratios for existing codebases.

---

## 🔄 Data Flow Diagram

```text
Forward Pipeline:
User Prompt 
  => [AI Provider via provider-adapter.js] 
  => .aether String
  => [Lexer] 
  => Tokens 
  => [Parser] 
  => AST 
  => [SEO Validator] (Pass/Fail)
  => [Transformer + Theme Engine + Plugins] 
  => React String Templates + Dependencies + CSS Tokens
  => [Generator (Preserving Slots)] 
  => Next.js Application

Reverse Pipeline:
Existing React JSX File
  => [Decompiler]
  => Pattern Extraction & AST Mapping
  => Compressed .aether DSL (up to 23x smaller)
```

## 🔒 Security Posture
AetherML uses `src/utils/escapeHtml.js` to strictly sanitize all text inputs injected into React templates, preventing XSS attacks from hallucinated AI strings. AST creation is shielded against `__proto__` prototype pollution.
