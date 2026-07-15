import 'dotenv/config';
import { OpenAI } from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { tokenize } from '../src/core/lexer.js';
import { parse } from '../src/core/parser.js';
import chalk from 'chalk';

const systemPrompt = `You are an AetherML compiler expert. Your job is to output AetherML DSL string based on the user's design requirements.
Use the following tags:
$page[intent:"...", theme:"dark"]
$anim:gsap[trigger:"load", effect:"fadeUp"]
$sec:hero[h1:"...", subtitle:"..."]
$sec:pricing[tiers:"1", highlight:"pro"]
$btn[label:"...", action:"..."]

For actions, use $auth:supabase or $pay:razorpay[amount:'999'].
Always nest components correctly inside $page.
ONLY OUTPUT THE RAW DSL STRING. NO EXPLANATIONS. NO MARKDOWN BLOCK FORMATTING.`;

const testPrompt = "Build a SaaS pricing page with a hero and 3 pricing tiers.";
const RUNS = 5;

async function runEval() {
    console.log(chalk.bold.blue("===================================================="));
    console.log(chalk.bold.blue("AetherML Cross-Provider Reliability Eval (5 Runs)"));
    console.log(chalk.bold.blue("====================================================\n"));

    const providers = [
        { name: 'Gemini (gemini-1.5-flash)', key: process.env.GEMINI_API_KEY },
        { name: 'Claude (claude-3-haiku-20240307)', key: process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY },
        { name: 'OpenAI (gpt-3.5-turbo)', key: process.env.OPENAI_API_KEY }
    ];

    for (const p of providers) {
        console.log(chalk.bold.yellow(`Testing Provider: ${p.name}`));
        
        if (!p.key) {
            console.log(chalk.gray(`  [Skipped] No API key found in .env\n`));
            continue;
        }

        let successCount = 0;
        
        for (let i = 1; i <= RUNS; i++) {
            try {
                let dslString = '';
                
                if (p.name.includes('Gemini')) {
                    const genAI = new GoogleGenerativeAI(p.key);
                    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro', systemInstruction: { parts: [{ text: systemPrompt }] } });
                    const result = await model.generateContent(testPrompt);
                    dslString = result.response.text();
                } else if (p.name.includes('Claude')) {
                    const anthropic = new Anthropic({ apiKey: p.key });
                    const msg = await anthropic.messages.create({ model: 'claude-3-haiku-20240307', max_tokens: 1024, system: systemPrompt, messages: [{ role: 'user', content: testPrompt }] });
                    dslString = msg.content[0].text;
                } else if (p.name.includes('OpenAI')) {
                    const openai = new OpenAI({ apiKey: p.key });
                    const res = await openai.chat.completions.create({ model: 'gpt-3.5-turbo', messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: testPrompt }] });
                    dslString = res.choices[0].message.content;
                }

                // Run through AetherML Compiler
                const tokens = tokenize(dslString);
                const ast = parse(tokens);
                
                if (ast.body.length > 0 && ast.body[0].name === '$page') {
                    successCount++;
                    process.stdout.write(chalk.green('✓ '));
                } else {
                    process.stdout.write(chalk.red('✗ (Parse failed) '));
                }
            } catch (err) {
                process.stdout.write(chalk.red(`✗ (Error: ${err.message}) `));
            }
        }
        
        console.log('\n');
        console.log(`  Reliability Matrix: ${chalk.bold(successCount + '/' + RUNS)} successful parses.\n`);
    }
}

runEval();
