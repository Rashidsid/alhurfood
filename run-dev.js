import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🚀 Starting development servers...\n');

// Start email server
console.log('📧 Starting email server on port 3001...');
const emailServer = spawn('npx', ['tsx', 'server.ts'], {
  cwd: __dirname,
  stdio: 'inherit',
});

// Wait 2 seconds for email server to start, then start Vite
setTimeout(() => {
  console.log('\n🎨 Starting Vite dev server on port 5173...\n');
  const viteServer = spawn('npx', ['vite'], {
    cwd: __dirname,
    stdio: 'inherit',
  });

  viteServer.on('error', (error) => {
    console.error('Error starting Vite server:', error);
  });
}, 2000);

emailServer.on('error', (error) => {
  console.error('Error starting email server:', error);
});

// Handle shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down servers...');
  emailServer.kill();
  process.exit();
});
