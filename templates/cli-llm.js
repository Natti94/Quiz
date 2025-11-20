#!/usr/bin/env node

// CLI Tool with LLM Integration
// Install: npm install commander node-fetch dotenv
// Run: node cli-llm.js "Your question here"

const { Command } = require('commander');
const LLMClient = require('../lib/llmTemplate');
require('dotenv').config();

const program = new Command();

program
  .name('llm-cli')
  .description('Command-line interface for AI chat')
  .version('1.0.0');

program
  .command('chat <message>')
  .description('Send a message to AI')
  .option('-p, --provider <provider>', 'AI provider (ollama, grok, huggingface)', 'ollama')
  .option('-m, --model <model>', 'Model to use')
  .option('-t, --temperature <temp>', 'Temperature for response creativity', parseFloat, 0.7)
  .option('-v, --verbose', 'Verbose output')
  .action(async (message, options) => {
    try {
      const llm = new LLMClient(options.provider);

      if (options.verbose) {
        console.log(`Using provider: ${options.provider}`);
        if (options.model) console.log(`Using model: ${options.model}`);
        console.log(`Temperature: ${options.temperature}`);
        console.log('---');
      }

      const startTime = Date.now();

      const response = await llm.query(message, {
        model: options.model,
        temperature: options.temperature
      });

      const duration = Date.now() - startTime;

      console.log(response);

      if (options.verbose) {
        console.log('---');
        console.log(`Response time: ${duration}ms`);
      }

    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program
  .command('interactive')
  .description('Start interactive chat session')
  .option('-p, --provider <provider>', 'AI provider', 'ollama')
  .action(async (options) => {
    const llm = new LLMClient(options.provider);
    const readline = require('readline');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log(`🤖 Interactive chat with ${options.provider} (type 'exit' to quit)`);
    console.log('---');

    const askQuestion = () => {
      rl.question('You: ', async (input) => {
        if (input.toLowerCase() === 'exit') {
          console.log('Goodbye! 👋');
          rl.close();
          return;
        }

        try {
          console.log('AI: Thinking...');
          const response = await llm.query(input);
          console.log(`AI: ${response}`);
          console.log('---');
          askQuestion();
        } catch (error) {
          console.error('Error:', error.message);
          askQuestion();
        }
      });
    };

    askQuestion();
  });

program
  .command('test')
  .description('Test AI provider connectivity')
  .option('-p, --provider <provider>', 'AI provider to test', 'ollama')
  .action(async (options) => {
    try {
      const llm = new LLMClient(options.provider);

      console.log(`Testing ${options.provider} connection...`);

      const startTime = Date.now();
      const response = await llm.query('Hello! Please respond with just "OK" if you can hear me.');
      const duration = Date.now() - startTime;

      if (response.includes('OK')) {
        console.log('✅ Connection successful!');
        console.log(`Response time: ${duration}ms`);
      } else {
        console.log('⚠️  Unexpected response:', response);
      }

    } catch (error) {
      console.error('❌ Connection failed:', error.message);
      process.exit(1);
    }
  });

program.parse();