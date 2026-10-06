import { GsapWrapperCode } from '../plugins/integrations/gsap.js';
import { AuthUICode } from '../plugins/integrations/supabase.js';
import { RazorpayRouteCode, RazorpayButtonCode } from '../plugins/integrations/razorpay.js';
import { generateThemeCssVariables, resolveTheme } from './theme-engine.js';

/**
 * Next.js Generator
 * Scaffolds Next.js app, themes, slots, and imports modular plugins
 */
export function generateNextJsApp(jsxString, integrations, ast, themeConfig = resolveTheme('midnight')) {
  const files = {};

  const dependencies = {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^14.1.0",
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.31",
    "autoprefixer": "^10.4.19",
  };
  
  if (integrations.has('gsap')) dependencies['gsap'] = "^3.12.5";
  if (integrations.has('supabase')) dependencies['@supabase/supabase-js'] = "^2.42.0";
  if (integrations.has('razorpay')) dependencies['razorpay'] = "^2.9.3";

  files['package.json'] = JSON.stringify({
    name: "aetherml-generated-app",
    version: "1.0.0",
    private: true,
    scripts: {
      "dev": "next dev",
      "build": "next build",
      "start": "next start"
    },
    dependencies,
    devDependencies: {
      "typescript": "^5",
      "@types/node": "^20",
      "@types/react": "^18",
      "@types/react-dom": "^18"
    }
  }, null, 2);

  files['tsconfig.json'] = JSON.stringify({
    "compilerOptions": {
      "lib": ["dom", "dom.iterable", "esnext"],
      "allowJs": true,
      "skipLibCheck": true,
      "strict": true,
      "noEmit": true,
      "esModuleInterop": true,
      "module": "esnext",
      "moduleResolution": "bundler",
      "resolveJsonModule": true,
      "isolatedModules": true,
      "jsx": "preserve",
      "incremental": true,
      "plugins": [{ "name": "next" }],
      "paths": { "@/*": ["./*"] }
    },
    "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    "exclude": ["node_modules"]
  }, null, 2);

  files['tailwind.config.ts'] = `
import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          border: "var(--card-border)",
        },
        accent: "var(--accent)",
      },
      borderRadius: {
        theme: "var(--radius)",
      }
    }
  },
  plugins: [],
};
export default config;
  `.trim();

  files['postcss.config.js'] = `module.exports = { plugins: { tailwindcss: {}, autoprefixer: {}, } };`;

  const cssVars = generateThemeCssVariables(themeConfig);
  files['app/globals.css'] = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n${cssVars}\n\nbody { background-color: var(--background); color: var(--foreground); margin: 0; }`;

  files['app/layout.tsx'] = `
import './globals.css';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[var(--background)] text-[var(--foreground)]">{children}</body>
    </html>
  );
}
  `.trim();

  let pageImports = `import { CustomSlot } from '../components/slots/CustomSlot';\n`;
  
  if (integrations.has('gsap')) pageImports += `import { GsapWrapper } from '../components/GsapWrapper';\n`;
  if (integrations.has('supabase')) pageImports += `import { AuthUI } from '../components/AuthUI';\n`;
  if (integrations.has('razorpay')) pageImports += `import { RazorpayButton } from '../components/RazorpayButton';\n`;

  files['app/page.tsx'] = `
${pageImports}

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      ${jsxString}
      <CustomSlot />
    </main>
  );
}
  `.trim();

  // User Extensibility Slot: Never overwritten on re-compile!
  files['components/slots/CustomSlot.tsx'] = `
"use client";
import React from 'react';

/**
 * AetherML Custom Slot
 * Add your custom hand-coded React logic here!
 * NOTE: The AetherML compiler will NEVER overwrite this file on subsequent builds.
 */
export function CustomSlot() {
  return (
    <div className="aether-custom-slot">
      {/* Hand-crafted components, analytics, or third-party widgets go here */}
    </div>
  );
}
  `.trim();

  // Modular plugin templates
  if (integrations.has('gsap')) {
    files['components/GsapWrapper.tsx'] = GsapWrapperCode;
  }

  if (integrations.has('supabase')) {
    files['components/AuthUI.tsx'] = AuthUICode;
  }

  if (integrations.has('razorpay')) {
    files['app/api/checkout/route.ts'] = RazorpayRouteCode;
    files['components/RazorpayButton.tsx'] = RazorpayButtonCode;
  }

  return files;
}
