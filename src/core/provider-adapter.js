import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

/**
 * Enterprise Provider Adapter
 * Routes requests to the configured AI backend based on aetherml.config.json
 */
export async function generateAetherML(prompt) {
    const configPath = path.resolve('aetherml.config.json');
    if (!fs.existsSync(configPath)) {
        throw new Error('aetherml.config.json not found. Please run "aetherml init" first.');
    }
    
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const { provider, model } = config;
    
    // Master prompt for AetherML DSL generation
    const systemPrompt = `You are an AetherML compiler expert. Your job is to output AetherML DSL string based on the user's design requirements.
Use the following tags:
$page[intent:"...", theme:"dark"]
$anim:gsap[trigger:"load", effect:"fadeUp"]
$anim:gsap[trigger:"scroll", effect:"stagger"]
$sec:hero[h1:"...", subtitle:"..."]
$sec:pricing[tiers:"1", highlight:"pro"]
$btn[label:"...", action:"..."]

For actions, use $auth:supabase or $pay:razorpay[amount:'999'].
Always nest components correctly inside $page.
ONLY OUTPUT THE RAW DSL STRING. NO EXPLANATIONS. NO MARKDOWN BLOCK FORMATTING.`;

    try {
        switch (provider) {
            case 'NIM':
            case 'OpenAI':
                const client = new OpenAI({ 
                    apiKey: process.env[`${provider.toUpperCase()}_API_KEY`] || process.env.OPENAI_API_KEY || 'missing',
                    baseURL: provider === 'NIM' ? (process.env.NIM_BASE_URL || 'https://integrate.api.nvidia.com/v1') : undefined
                });
                const chatCompletion = await client.chat.completions.create({
                    model: model,
                    messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: prompt }]
                });
                return chatCompletion.choices[0].message.content;

            case 'Claude':
                const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY || 'missing' });
                const message = await anthropic.messages.create({
                    model: model,
                    max_tokens: 1024,
                    system: systemPrompt,
                    messages: [{ role: 'user', content: prompt }]
                });
                return message.content[0].text;

            case 'Gemini':
                const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'missing');
                const geminiModel = genAI.getGenerativeModel({ 
                    model: model,
                    systemInstruction: { parts: [{ text: systemPrompt }] }
                });
                const result = await geminiModel.generateContent(prompt);
                return result.response.text();

            default:
                throw new Error(`Unsupported provider: ${provider}`);
        }
    } catch (err) {
        throw new Error(`Provider API Error (${provider}): ${err.message}. Please check your API keys in .env`);
    }
}

/**
 * Validates the API key and model against the provider before saving config.
 */
export async function validateCredentials(provider, key, model) {
    try {
        switch (provider) {
            case 'NIM':
            case 'OpenAI':
                const client = new OpenAI({ 
                    apiKey: key,
                    baseURL: provider === 'NIM' ? 'https://integrate.api.nvidia.com/v1' : undefined
                });
                await client.chat.completions.create({
                    model: model,
                    messages: [{ role: 'user', content: 'Ping' }],
                    max_tokens: 1
                });
                return true;

            case 'Claude':
                const anthropic = new Anthropic({ apiKey: key });
                await anthropic.messages.create({
                    model: model,
                    max_tokens: 1,
                    messages: [{ role: 'user', content: 'Ping' }]
                });
                return true;

            case 'Gemini':
                const genAI = new GoogleGenerativeAI(key);
                const geminiModel = genAI.getGenerativeModel({ model: model });
                await geminiModel.generateContent('Ping');
                return true;

            default:
                throw new Error(`Unsupported provider: ${provider}`);
        }
    } catch (err) {
        throw new Error(err.message);
    }
}
