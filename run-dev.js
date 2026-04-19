import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { platform } from 'os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isWindows = platform() === 'win32';

console.log('🚀 Starting development servers...\n');

// Determine shell based on OS
const shell = isWindows ? 'cmd.exe' : '/bin/sh';
const shellArgs = isWindows ? ['/c'] : ['-c'];

// Start email server
console.log('📧 Starting email server on port 3001...');
const emailCmd = isWindows 
  ? 'npm' 
  : 'npx';
const emailArgs = isWindows
  ? ['run', 'dev:email']
  : ['tsx', 'server.ts'];

const emailServer = spawn(emailCmd, emailArgs, {
  cwd: __dirname,
  stdio: 'inherit',
  shell: isWindows,
});

// Wait 3 seconds for email server to start, then start Vite
setTimeout(() => {
  console.log('\n🎨 Starting Vite dev server on port 5173...\n');
  
  const viteCmd = isWindows
    ? 'npm'
    : 'npx';
  const viteArgs = isWindows
    ? ['run', 'dev:frontend']
    : ['vite'];

  const viteServer = spawn(viteCmd, viteArgs, {
    cwd: __dirname,
    stdio: 'inherit',
    shell: isWindows,
  });

  viteServer.on('error', (error) => {
    console.error('Error starting Vite server:', error);
  });
}, 3000);

emailServer.on('error', (error) => {
  console.error('Error starting email server:', error);
});

// Handle shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down servers...');
  emailServer.kill();
  process.exit();
});
