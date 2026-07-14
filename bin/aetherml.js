#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import figlet from 'figlet';
import ora from 'ora';
import 'dotenv/config';

import { tokenize } from '../src/core/lexer.js';
import { parse } from '../src/core/parser.js';
import { transform } from '../src/core/transformer.js';
import { generateNextJsApp } from '../src/core/enterprise-generator.js';
import { validateSEO } from '../src/seo/validator.js';
import { generateAetherML, validateCredentials } from '../src/core/provider-adapter.js';

function showWelcome() {
    console.log(chalk.cyan(figlet.textSync('AetherML', { font: 'Slant' })));
    console.log(chalk.white('===================================================='));
    console.log(`${chalk.bold('AetherML Enterprise Engine')} ${chalk.dim('v2.0.0')}`);
    console.log(`${chalk.blue('Status:')} ${chalk.green('Compiler Online')}`);
    console.log(chalk.white('====================================================\n'));
}

const program = new Command();

program
    .name('aetherml')
    .description('AI-Native Enterprise Compiler')
    .version('2.0.0');

program
    .command('init')
    .description('Configure your AetherML environment via interactive wizard')
    .action(async () => {
        showWelcome();
        const answers = await inquirer.prompt([
            { type: 'select', name: 'provider', message: 'Select AI Provider:', choices: ['Gemini', 'Claude', 'NIM', 'OpenAI'] },
            { type: 'input', name: 'key', message: 'Enter your API Key (hidden for security):', type: 'password' },
            { type: 'input', name: 'model', message: 'Enter Model Name (e.g. gemini-1.5-pro, claude-3-5-sonnet-20240620, gpt-4o):', default: 'gemini-1.5-pro' }
        ]);

        const spinner = ora('Verifying API Key and Model with Provider...').start();
        
        try {
            await validateCredentials(answers.provider, answers.key, answers.model);
            spinner.succeed(chalk.green('API Handshake Successful!'));
        } catch (err) {
            spinner.fail(chalk.red(`Validation Failed: ${err.message}`));
            console.log(chalk.yellow('Config was NOT saved. Please run "aetherml init" again with correct credentials.'));
            process.exit(1);
        }

        const configPath = path.resolve('aetherml.config.json');
        fs.writeFileSync(configPath, JSON.stringify({ provider: answers.provider, model: answers.model }, null, 2));
        
        const envPath = path.resolve('.env');
        const envLine = `\n${answers.provider.toUpperCase()}_API_KEY=${answers.key}\n`;
        if (fs.existsSync(envPath)) {
            fs.appendFileSync(envPath, envLine);
        } else {
            fs.writeFileSync(envPath, envLine, 'utf-8');
        }
        
        console.log(chalk.green('\n✔ Configuration saved successfully!'));
        console.log(chalk.dim(`- Config stored in ${configPath}`));
        console.log(chalk.dim(`- Keys secured in ${envPath}`));
    });

program
    .command('generate <prompt>')
    .description('Generate AetherML DSL from natural language using the configured provider')
    .action(async (prompt) => {
        showWelcome();
        const spinner = ora('Contacting AI Provider...').start();
        try {
            const dsl = await generateAetherML(prompt);
            const outputPath = path.resolve('temp.aether');
            fs.writeFileSync(outputPath, dsl);
            spinner.succeed(chalk.green(`DSL Generated successfully: ${outputPath}`));
            console.log(chalk.dim('You can now run: aetherml build temp.aether'));
        } catch (err) {
            spinner.fail(chalk.red(`Generation Failed: ${err.message}`));
            process.exit(1);
        }
    });

program
    .command('build <file>')
    .description('Compile DSL to a full Next.js directory')
    .option('--output <dir>', 'Specify output directory', 'dist_app')
    .option('--debug', 'Output AST and Token trace')
    .option('--strict', 'Fail on SEO violations')
    .action(async (file, options) => {
        showWelcome();
        const inputPath = path.resolve(file);
        if (!fs.existsSync(inputPath)) {
            console.error(chalk.red(`✖ Error: Input file not found at ${inputPath}`));
            process.exit(1);
        }

        const spinner = ora('Initializing Enterprise Scaffold...').start();
        
        try {
            const source = fs.readFileSync(inputPath, 'utf-8');
            
            spinner.text = 'Tokenizing DSL...';
            await new Promise(r => setTimeout(r, 400));
            
            const tokens = tokenize(source);
            if (options.debug) {
                spinner.info('Lexer Tokens:');
                console.log(chalk.gray(JSON.stringify(tokens, null, 2)));
                spinner.start();
            }
            
            spinner.text = 'Parsing AST & Validating SEO...';
            await new Promise(r => setTimeout(r, 400));
            
            const ast = parse(tokens);
            if (options.debug) {
                spinner.info('AST Structure:');
                console.log(chalk.gray(JSON.stringify(ast, null, 2)));
                spinner.start();
            }

            const seoReport = validateSEO(ast);
            if (options.strict && !seoReport.isValid) {
                spinner.fail(chalk.red('STRICT MODE FATAL: Build failed due to SEO violations:'));
                seoReport.errors.forEach(e => console.log(chalk.red(` - ${e}`)));
                process.exit(1);
            }

            spinner.text = 'Transforming to React Components...';
            await new Promise(r => setTimeout(r, 400));
            
            const { jsxString, integrations } = transform(ast);

            spinner.text = 'Generating Virtual Filesystem...';
            await new Promise(r => setTimeout(r, 400));
            const files = generateNextJsApp(jsxString, integrations, ast);
            
            const outputPath = path.resolve(options.output);
            if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, { recursive: true });

            for (const [relativePath, content] of Object.entries(files)) {
                const fullPath = path.join(outputPath, relativePath);
                const dir = path.dirname(fullPath);
                if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
                fs.writeFileSync(fullPath, content, 'utf-8');
            }

            spinner.succeed(chalk.green(`Pipeline Complete! Compiled to ${options.output}/`));
            
            // Print SEO Report
            console.log(chalk.dim('\n--- SEO Guardrail Report ---'));
            console.log(`${chalk.blue('[SEO] Headings:')} ${seoReport.h1Count === 1 ? chalk.green('OK (1 H1 found)') : chalk.yellow('WARNING (' + seoReport.h1Count + ' H1s)')}`);
            console.log(`${chalk.blue('[SEO] Intent Meta:')} ${seoReport.hasIntent ? chalk.green('OK') : chalk.yellow('WARNING')}`);

        } catch (error) {
            spinner.fail(chalk.red('Compilation failed: ' + error.message));
            if (options.debug) console.error(chalk.red(error.stack));
            process.exit(1);
        }
    });

program
    .command('eject <file>')
    .description('Extract pure source code to root directory')
    .option('--output <dir>', 'Specify output directory', 'extracted_app')
    .action(async (file, options) => {
        showWelcome();
        const spinner = ora('Extracting and unlinking metadata...').start();
        const inputPath = path.resolve(file);
        
        try {
            await new Promise(r => setTimeout(r, 800)); // Premium delay
            const source = fs.readFileSync(inputPath, 'utf-8');
            const tokens = tokenize(source);
            const ast = parse(tokens);
            const { jsxString, integrations } = transform(ast);
            const files = generateNextJsApp(jsxString, integrations, ast);
            
            const outputPath = path.resolve(options.output);
            if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, { recursive: true });

            for (const [relativePath, content] of Object.entries(files)) {
                const fullPath = path.join(outputPath, relativePath);
                const dir = path.dirname(fullPath);
                if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
                fs.writeFileSync(fullPath, content, 'utf-8');
            }
            
            spinner.succeed(chalk.green(`Project ejected successfully to /${options.output}`));
        } catch (error) {
            spinner.fail(chalk.red('Ejection failed: ' + error.message));
            process.exit(1);
        }
    });

program
    .command('dev <file>')
    .description('Compile DSL and instantly start a local Next.js development server')
    .action(async (file) => {
        showWelcome();
        const inputPath = path.resolve(file);
        if (!fs.existsSync(inputPath)) {
            console.error(chalk.red(`✖ Error: Input file not found at ${inputPath}`));
            process.exit(1);
        }

        const spinner = ora('Compiling AetherML DSL...').start();
        const outputDir = path.resolve('dist_app');
        
        try {
            const source = fs.readFileSync(inputPath, 'utf-8');
            const tokens = tokenize(source);
            const ast = parse(tokens);
            const { jsxString, integrations } = transform(ast);
            const files = generateNextJsApp(jsxString, integrations, ast);
            
            if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

            for (const [relativePath, content] of Object.entries(files)) {
                const fullPath = path.join(outputDir, relativePath);
                const dir = path.dirname(fullPath);
                if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
                fs.writeFileSync(fullPath, content, 'utf-8');
            }
            spinner.succeed(chalk.green('Compiled successfully.'));
        } catch (error) {
            spinner.fail(chalk.red('Compilation failed: ' + error.message));
            process.exit(1);
        }

        const installSpinner = ora('Installing NPM dependencies (this may take a minute)...').start();
        
        // Run npm install
        const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
        
        const installProc = spawn(npmCmd, ['install'], { cwd: outputDir, stdio: 'ignore', shell: true });
        
        installProc.on('close', (code) => {
            if (code !== 0) {
                installSpinner.fail(chalk.red('Failed to install dependencies.'));
                process.exit(1);
            }
            installSpinner.succeed(chalk.green('Dependencies installed!'));
            
            console.log(chalk.cyan('\n🚀 Starting Next.js development server...\n'));
            
            // Run npm run dev (inherits stdio so user sees the Next.js output)
            const devProc = spawn(npmCmd, ['run', 'dev'], { cwd: outputDir, stdio: 'inherit', shell: true });
            
            devProc.on('error', (err) => {
                console.error(chalk.red('Failed to start dev server: ' + err.message));
            });
        });
    });

// Fallback logic to show help if no args provided
if (process.argv.length <= 2) {
    showWelcome();
    program.help();
}

program.parse(process.argv);
