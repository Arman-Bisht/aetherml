import { encode } from 'gpt-tokenizer';
import chalk from 'chalk';

const benchmarks = [
    {
        name: "SaaS Landing Page",
        react: `
import React from 'react';
import { gsap } from 'gsap';
export default function LandingPage() {
    return (
        <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center justify-center">
            <h1 className="text-6xl font-bold mb-4">Build Faster</h1>
            <p className="text-xl mb-8">The AI Compiler for the Modern Web</p>
            <div className="flex gap-4">
                <button className="px-6 py-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition">Get Started</button>
                <button className="px-6 py-3 bg-transparent border border-white rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition">View Documentation</button>
            </div>
        </div>
    );
}
        `.trim(),
        aetherml: `$page[intent:"saas", theme:"dark", $sec:hero[h1:"Build Faster", subtitle:"The AI Compiler for the Modern Web"]]`
    },
    {
        name: "Auth Flow (Supabase)",
        react: `
import { createClient } from '@supabase/supabase-js';
import { useState } from 'react';

const supabase = createClient('URL', 'KEY');

export default function AuthFlow() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        await supabase.auth.signInWithPassword({ email, password });
    };

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                        <div className="mt-2"><input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/></div>
                    </div>
                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
        `.trim(),
        aetherml: `$page[intent:"login", theme:"light", action:"$auth:supabase"]`
    },
    {
        name: "Pricing Page (Razorpay)",
        react: `
import React from 'react';
import Script from 'next/script';

export default function PricingPage() {
    const handlePayment = async () => {
        const options = { key: 'RAZORPAY_KEY', amount: 99900, currency: 'INR', name: 'Pro Plan' };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    return (
        <div className="bg-white py-24 sm:py-32">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl sm:text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Simple no-tricks pricing</h2>
                </div>
                <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
                    <div className="p-8 sm:p-10 lg:flex-auto">
                        <h3 className="text-2xl font-bold tracking-tight text-gray-900">Pro Membership</h3>
                        <p className="mt-6 text-base leading-7 text-gray-600">Get full access to all features.</p>
                    </div>
                    <div className="p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
                        <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                            <div className="mx-auto max-w-xs px-8">
                                <p className="text-base font-semibold text-gray-600">Pay once, own it forever</p>
                                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                                    <span className="text-5xl font-bold tracking-tight text-gray-900">₹999</span>
                                </p>
                                <button onClick={handlePayment} className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">Get Access</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
        `.trim(),
        aetherml: `$page[intent:"pricing", theme:"light", $sec:pricing[tiers:"1", highlight:"pro"], action:"$pay:razorpay[amount:'999']"]`
    },
    {
        name: "Dashboard (Data Heavy)",
        react: `
import React from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

export default function Dashboard() {
    const data = { labels: ['Jan', 'Feb', 'Mar'], datasets: [{ label: 'Users', data: [100, 200, 150] }] };
    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-semibold mb-2">User Growth</h2>
                    <Line data={data} />
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-semibold mb-2">Recent Transactions</h2>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th></tr></thead>
                        <tbody>
                            <tr><td className="px-6 py-4">#1024</td><td className="px-6 py-4">$99.00</td></tr>
                            <tr><td className="px-6 py-4">#1025</td><td className="px-6 py-4">$49.00</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
        `.trim(),
        aetherml: `$page[intent:"dashboard", theme:"light", $sec:chart[type:"line", data:"users"], $sec:table[data:"transactions"]]`
    }
];

console.log(chalk.bold.blue("===================================================="));
console.log(chalk.bold.blue("AetherML Compression Benchmark (OpenAI BPE Tokens)"));
console.log(chalk.bold.blue("====================================================\n"));

let totalReactTokens = 0;
let totalAetherTokens = 0;

benchmarks.forEach(bm => {
    const reactTokens = encode(bm.react).length;
    const aetherTokens = encode(bm.aetherml).length;
    
    totalReactTokens += reactTokens;
    totalAetherTokens += aetherTokens;
    
    const ratio = (reactTokens / aetherTokens).toFixed(1);
    
    console.log(chalk.bold.green(`[ ${bm.name} ]`));
    console.log(`React Boilerplate: ${chalk.yellow(reactTokens)} tokens`);
    console.log(`AetherML DSL:      ${chalk.cyan(aetherTokens)} tokens`);
    console.log(`Compression:       ${chalk.bold.magenta(ratio + 'x')} smaller\n`);
});

const avgRatio = (totalReactTokens / totalAetherTokens).toFixed(1);
console.log(chalk.bold.blue("===================================================="));
console.log(`Average Compression Ratio: ${chalk.bold.magenta(avgRatio + 'x')}`);
console.log(chalk.bold.blue("====================================================\n"));
