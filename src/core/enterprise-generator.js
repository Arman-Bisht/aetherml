import { GsapWrapperCode } from '../plugins/integrations/gsap.js';
import { AuthUICode } from '../plugins/integrations/supabase.js';
import { RazorpayRouteCode, RazorpayButtonCode } from '../plugins/integrations/razorpay.js';

/**
 * Next.js Generator
 * Scaffolds Next.js app and imports modular plugins
 */
export function generateNextJsApp(jsxString, integrations, ast) {
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
  theme: { extend: {} },
  plugins: [],
};
export default config;
  `.trim();

  files['postcss.config.js'] = `module.exports = { plugins: { tailwindcss: {}, autoprefixer: {}, } };`;

  files['app/globals.css'] = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\nbody { background-color: #0f172a; color: white; margin: 0; }`;

  files['app/layout.tsx'] = `
import './globals.css';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
  `.trim();

  let pageImports = '';
  
  if (integrations.has('gsap')) pageImports += `import { GsapWrapper } from '../components/GsapWrapper';\n`;
  if (integrations.has('supabase')) pageImports += `import { AuthUI } from '../components/AuthUI';\n`;
  if (integrations.has('razorpay')) pageImports += `import { RazorpayButton } from '../components/RazorpayButton';\n`;

  files['app/page.tsx'] = `
${pageImports}

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900">
      ${jsxString}
    </main>
  );
}
  `.trim();

  // Load from modular independent plugin files!
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
