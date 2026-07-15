import { encode } from 'gpt-tokenizer';
import chalk from 'chalk';

const categories = {
    "SaaS Landing Page": [
        {
            name: "Simple Hero",
            react: `
import React from 'react';
export default function LandingPage() {
    return (
        <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center justify-center">
            <h1 className="text-6xl font-bold mb-4">Build Faster</h1>
            <p className="text-xl mb-8">The AI Compiler for the Modern Web</p>
            <button className="px-6 py-3 bg-blue-600 rounded-lg">Get Started</button>
        </div>
    );
}
            `.trim(),
            aetherml: `$page[intent:"saas", theme:"dark", $sec:hero[h1:"Build Faster", subtitle:"The AI Compiler for the Modern Web"]]`
        },
        {
            name: "Hero + Testimonials",
            react: `
import React from 'react';
export default function LandingPage() {
    return (
        <div className="bg-gray-900 min-h-screen text-white">
            <div className="flex flex-col items-center py-20">
                <h1 className="text-6xl font-bold mb-4">Build Faster</h1>
                <p className="text-xl mb-8">The AI Compiler for the Modern Web</p>
                <button className="px-6 py-3 bg-blue-600 rounded-lg">Get Started</button>
            </div>
            <div className="py-20 bg-gray-800">
                <h2 className="text-3xl text-center mb-10">What our customers say</h2>
                <div className="flex justify-center gap-8">
                    <div className="p-6 bg-gray-700 rounded-lg">"Incredible tool" - CEO</div>
                    <div className="p-6 bg-gray-700 rounded-lg">"Saved us months" - CTO</div>
                </div>
            </div>
        </div>
    );
}
            `.trim(),
            aetherml: `$page[intent:"saas", theme:"dark", $sec:hero[h1:"Build Faster", subtitle:"The AI Compiler for the Modern Web"], $sec:testimonials]`
        },
        {
            name: "Full Page (Hero + Testimonials + Pricing)",
            react: `
import React from 'react';
export default function LandingPage() {
    return (
        <div className="bg-gray-900 min-h-screen text-white">
            <div className="flex flex-col items-center py-20">
                <h1 className="text-6xl font-bold mb-4">Build Faster</h1>
                <p className="text-xl mb-8">The AI Compiler for the Modern Web</p>
                <button className="px-6 py-3 bg-blue-600 rounded-lg">Get Started</button>
            </div>
            <div className="py-20 bg-gray-800 text-center">
                <h2 className="text-3xl mb-10">What our customers say</h2>
                <div className="flex justify-center gap-8">
                    <div className="p-6 bg-gray-700 rounded-lg">"Incredible tool" - CEO</div>
                </div>
            </div>
            <div className="py-20 text-center">
                <h2 className="text-3xl mb-10">Pricing</h2>
                <div className="border border-gray-600 p-8 rounded-lg max-w-sm mx-auto">
                    <h3 className="text-2xl">Pro</h3>
                    <p className="text-4xl font-bold my-4">$99/mo</p>
                    <button className="w-full bg-blue-600 py-2 rounded-lg">Buy Now</button>
                </div>
            </div>
        </div>
    );
}
            `.trim(),
            aetherml: `$page[intent:"saas", theme:"dark", $sec:hero[h1:"Build Faster"], $sec:testimonials, $sec:pricing[tiers:"1"]]`
        }
    ],
    "Auth Flow": [
        {
            name: "Simple Login Form",
            react: `
import { useState } from 'react';
export default function AuthFlow() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = (e) => { e.preventDefault(); };
    return (
        <form onSubmit={handleLogin} className="p-8">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit">Login</button>
        </form>
    );
}
            `.trim(),
            aetherml: `$page[intent:"login", action:"$auth:supabase"]`
        },
        {
            name: "Login + SSO Providers",
            react: `
import { useState } from 'react';
export default function AuthFlow() {
    const handleGoogle = () => { /* Google SSO */ };
    const handleGithub = () => { /* Github SSO */ };
    return (
        <div className="p-8 max-w-sm mx-auto">
            <h2 className="text-2xl mb-4">Sign In</h2>
            <button onClick={handleGoogle} className="w-full bg-white text-black border border-gray-300 py-2 mb-2">Google</button>
            <button onClick={handleGithub} className="w-full bg-gray-900 text-white py-2 mb-4">Github</button>
            <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-gray-400"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400">Or continue with</span>
                <div className="flex-grow border-t border-gray-400"></div>
            </div>
            <input type="email" placeholder="Email" className="w-full border p-2 mb-2" />
            <input type="password" placeholder="Password" className="w-full border p-2 mb-4" />
            <button className="w-full bg-blue-600 text-white py-2">Sign in with Email</button>
        </div>
    );
}
            `.trim(),
            aetherml: `$page[intent:"login", providers:"google,github", action:"$auth:supabase"]`
        },
        {
            name: "Full Auth (Reset + 2FA)",
            react: `
import { useState } from 'react';
export default function AuthFlow() {
    return (
        <div className="p-8 max-w-sm mx-auto shadow-xl rounded-xl">
            <h2 className="text-2xl mb-4 font-bold text-center">Secure Sign In</h2>
            <input type="email" placeholder="Email" className="w-full border p-2 mb-2 rounded" />
            <input type="password" placeholder="Password" className="w-full border p-2 mb-2 rounded" />
            <div className="flex justify-between items-center mb-4 text-sm text-blue-600">
                <label><input type="checkbox" className="mr-2" />Remember me</label>
                <a href="#">Forgot password?</a>
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded mb-4">Sign in</button>
            <div className="bg-blue-50 p-4 rounded text-sm text-blue-800">
                A 2FA code will be sent to your device upon successful login.
            </div>
        </div>
    );
}
            `.trim(),
            aetherml: `$page[intent:"login", mfa:"true", reset:"true", action:"$auth:supabase"]`
        }
    ],
    "Pricing Page": [
        {
            name: "Simple 1-Tier Pricing",
            react: `
import React from 'react';
export default function PricingPage() {
    return (
        <div className="bg-white py-24 sm:py-32 flex justify-center">
            <div className="border border-gray-200 p-10 rounded-2xl shadow-lg max-w-md w-full text-center">
                <h3 className="text-2xl font-bold tracking-tight text-gray-900">Pro</h3>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                    <span className="text-5xl font-bold tracking-tight text-gray-900">$29</span>
                    <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">/mo</span>
                </p>
                <button className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">Subscribe</button>
            </div>
        </div>
    );
}
            `.trim(),
            aetherml: `$page[intent:"pricing", $sec:pricing[tiers:"1"], action:"$pay:stripe"]`
        },
        {
            name: "Monthly/Annual Toggle (3 Tiers)",
            react: `
import React, { useState } from 'react';
export default function PricingPage() {
    const [annual, setAnnual] = useState(true);
    return (
        <div className="py-24 max-w-7xl mx-auto px-6">
            <div className="flex justify-center mb-10">
                <button onClick={() => setAnnual(false)} className={!annual ? "bg-indigo-600 text-white px-4 py-2" : "px-4 py-2"}>Monthly</button>
                <button onClick={() => setAnnual(true)} className={annual ? "bg-indigo-600 text-white px-4 py-2" : "px-4 py-2"}>Annual (Save 20%)</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="border p-8 rounded-xl"><h3 className="text-xl">Starter</h3><p className="text-3xl my-4">{annual ? '$9' : '$12'}</p><button className="w-full bg-gray-900 text-white py-2">Buy</button></div>
                <div className="border-2 border-indigo-600 p-8 rounded-xl shadow-xl"><h3 className="text-xl text-indigo-600">Pro</h3><p className="text-3xl my-4">{annual ? '$29' : '$39'}</p><button className="w-full bg-indigo-600 text-white py-2">Buy</button></div>
                <div className="border p-8 rounded-xl"><h3 className="text-xl">Enterprise</h3><p className="text-3xl my-4">Custom</p><button className="w-full bg-gray-900 text-white py-2">Contact</button></div>
            </div>
        </div>
    );
}
            `.trim(),
            aetherml: `$page[intent:"pricing", $sec:pricing[tiers:"3", toggle:"true", highlight:"pro"], action:"$pay:stripe"]`
        },
        {
            name: "Feature Comparison Matrix",
            react: `
import React from 'react';
export default function PricingPage() {
    return (
        <div className="py-24 max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-16">Compare Plans</h2>
            <table className="w-full text-left">
                <thead>
                    <tr>
                        <th className="py-4 font-bold text-xl">Features</th>
                        <th className="py-4 font-bold text-xl text-center">Starter</th>
                        <th className="py-4 font-bold text-xl text-center">Pro</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    <tr><td className="py-4">Users</td><td className="py-4 text-center">1</td><td className="py-4 text-center">Unlimited</td></tr>
                    <tr><td className="py-4">API Access</td><td className="py-4 text-center text-gray-400">No</td><td className="py-4 text-center text-indigo-600">Yes</td></tr>
                    <tr><td className="py-4">Custom Domain</td><td className="py-4 text-center text-gray-400">No</td><td className="py-4 text-center text-indigo-600">Yes</td></tr>
                </tbody>
            </table>
        </div>
    );
}
            `.trim(),
            aetherml: `$page[intent:"pricing", $sec:pricing[matrix:"true"], action:"$pay:stripe"]`
        }
    ],
    "Dashboard": [
        {
            name: "Simple KPI Cards",
            react: `
import React from 'react';
export default function Dashboard() {
    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border"><h3 className="text-gray-500 text-sm font-medium">Revenue</h3><p className="text-3xl font-bold mt-2">$45,231</p></div>
                <div className="bg-white p-6 rounded-lg shadow-sm border"><h3 className="text-gray-500 text-sm font-medium">Users</h3><p className="text-3xl font-bold mt-2">1,203</p></div>
                <div className="bg-white p-6 rounded-lg shadow-sm border"><h3 className="text-gray-500 text-sm font-medium">Uptime</h3><p className="text-3xl font-bold mt-2 text-green-500">99.9%</p></div>
            </div>
        </div>
    );
}
            `.trim(),
            aetherml: `$page[intent:"dashboard", $sec:kpi[count:"3"]]`
        },
        {
            name: "Data Heavy (Charts + Tables)",
            react: `
import React from 'react';
export default function Dashboard() {
    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4 border-b pb-2">User Growth (YTD)</h2>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded text-gray-400">[ Line Chart Component Rendered Here ]</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4 border-b pb-2">Recent Transactions</h2>
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr><th className="px-4 py-2 text-left">ID</th><th className="px-4 py-2 text-left">Status</th><th className="px-4 py-2 text-right">Amount</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr><td className="px-4 py-3">#4093</td><td className="px-4 py-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Paid</span></td><td className="px-4 py-3 text-right font-medium">$199.00</td></tr>
                            <tr><td className="px-4 py-3">#4092</td><td className="px-4 py-3"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Pending</span></td><td className="px-4 py-3 text-right font-medium">$49.00</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
            `.trim(),
            aetherml: `$page[intent:"dashboard", $sec:chart[type:"line"], $sec:table[data:"transactions"]]`
        },
        {
            name: "Admin Settings Panel",
            react: `
import React from 'react';
export default function Settings() {
    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-8">Settings</h1>
            <div className="bg-white shadow rounded-lg mb-8">
                <div className="px-6 py-5 border-b"><h3 className="text-lg font-medium">Profile</h3></div>
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" defaultValue="Jane Doe" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input type="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50" defaultValue="jane@example.com" disabled />
                    </div>
                    <div className="flex justify-end"><button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Save Changes</button></div>
                </div>
            </div>
            <div className="bg-white shadow rounded-lg border-red-200 border">
                <div className="px-6 py-5 border-b border-red-200"><h3 className="text-lg font-medium text-red-600">Danger Zone</h3></div>
                <div className="p-6">
                    <p className="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Delete Account</button>
                </div>
            </div>
        </div>
    );
}
            `.trim(),
            aetherml: `$page[intent:"settings", $sec:form[fields:"profile"], $sec:danger_zone]`
        }
    ]
};

console.log(chalk.bold.blue("===================================================="));
console.log(chalk.bold.blue("AetherML Compression Benchmark (OpenAI BPE Tokens)"));
console.log(chalk.bold.blue("====================================================\n"));

let totalReactTokens = 0;
let totalAetherTokens = 0;

for (const [categoryName, items] of Object.entries(categories)) {
    console.log(chalk.bold.bgBlue.white(` CATEGORY: ${categoryName} `));
    
    let minRatio = Infinity;
    let maxRatio = 0;
    
    items.forEach(bm => {
        const reactTokens = encode(bm.react).length;
        const aetherTokens = encode(bm.aetherml).length;
        
        totalReactTokens += reactTokens;
        totalAetherTokens += aetherTokens;
        
        const ratio = (reactTokens / aetherTokens);
        if (ratio < minRatio) minRatio = ratio;
        if (ratio > maxRatio) maxRatio = ratio;
        
        console.log(`  ${chalk.green(bm.name)}`);
        console.log(`  ├─ React:    ${chalk.yellow(reactTokens)} tokens`);
        console.log(`  ├─ AetherML: ${chalk.cyan(aetherTokens)} tokens`);
        console.log(`  └─ Ratio:    ${chalk.magenta(ratio.toFixed(1) + 'x')}\n`);
    });
    
    console.log(chalk.bold.yellow(`  => ${categoryName} Range: `) + chalk.bold.white(`[ ${minRatio.toFixed(1)}x - ${maxRatio.toFixed(1)}x ]\n`));
}

const avgRatio = (totalReactTokens / totalAetherTokens).toFixed(1);
console.log(chalk.bold.blue("===================================================="));
console.log(`Overall Average Compression: ${chalk.bold.magenta(avgRatio + 'x')}`);
console.log(chalk.bold.blue("====================================================\n"));
