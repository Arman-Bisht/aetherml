# Contributing to AetherML 🌌

First off, thank you for considering contributing to AetherML! Our goal is to create the fastest, most cost-effective AI-Native compiler in the world. 

The most common way to contribute is by adding new **Plugins** and **Integrations** to the language!

## The Plugin Trust Model

AetherML uses a strictly vetted, decoupled string-template architecture. To prevent supply-chain attacks, **AetherML does not support dynamic, unverified third-party plugins at runtime.**

Whenever the compiler reads a tag like `$auth:supabase`, it doesn't need to know how Supabase works. It simply asks the internal Plugin Bridge if a verified Supabase template exists.

If you want to add support for a new library, you must submit it as a Pull Request to be audited and merged by the core team.

### Step 1: Create a Plugin File
Navigate to `src/plugins/integrations/` (for backend services) or `src/plugins/libraries/` (for frontend libraries) and create a new Javascript file. 

Example: `src/plugins/integrations/stripe.js`

### Step 2: Export React Templates
Inside your file, export the raw React/Next.js code as string literals. 
You can export Client Components, API Routes, or standard UI components.

```javascript
// src/plugins/integrations/stripe.js
export const StripeButtonCode = `
"use client";
export function StripeButton({ priceId }) {
  return (
    <button onClick={() => alert("Checkout with " + priceId)}>
      Pay with Stripe
    </button>
  );
}
`.trim();
```

### Step 3: Register the Plugin in the Transformer
Open `src/core/transformer.js` and add your new integration to the registry so the compiler knows what to do when it sees your tag!

1. Add your tag to the action handler (e.g., `$pay:stripe`).
2. Tell the transformer to push your `StripeButtonCode` into the `activePlugins` array.
3. Map the tag to `<StripeButton priceId="XYZ" />`.

### Step 4: Test Your Plugin
1. Open a terminal in the root directory.
2. Run `npm link` to map your local changes to the global CLI.
3. Create a test DSL file using your new tag.
4. Run `aetherml dev test.aether` and ensure the Next.js server compiles without errors!

## The Human Quality Gate (For Contributors)

Before your PR can be merged by the maintainers, it must pass these strict architectural rules:

1. **Security Gate**: Did you use `src/utils/escapeHtml.js`? Any PR that attempts to inject unsanitized raw strings into JSX templates will be automatically rejected.
2. **Plugin Isolation**: Does the new feature live entirely in `src/plugins/`? Changes to the core engine (`lexer.js`, `parser.js`) must be heavily justified by a foundational architectural need.
3. **Test Coverage**: Does the feature include a test case? If the feature works but isn't tested in the test suite, it doesn't exist.
4. **Eject Compatibility**: Run `node bin/aetherml.js eject <file>`. Does it generate a clean Next.js app? If your plugin breaks the eject extraction process, the PR is rejected.

## Submitting a Pull Request
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/stripe-plugin`.
3. Commit your changes.
4. Push to the branch and open a Pull Request!

We review PRs weekly. Welcome to the AetherML core team!
