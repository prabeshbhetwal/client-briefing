import { spawn } from 'node:child_process';

const children = [
  spawn(process.execPath, ['--watch', 'backend/index.js'], { stdio: 'inherit' }),
  spawn(process.execPath, ['frontend/node_modules/vite/bin/vite.js', '--config', 'frontend/vite.config.js', 'frontend', '--port', process.env.FRONTEND_PORT || '5173'], { stdio: 'inherit' }),
];
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) child.kill('SIGTERM');
  process.exitCode = code;
}
for (const child of children) {
  child.on('error', () => { console.error('Could not start development server. Install dependencies first.'); stop(1); });
  child.on('exit', code => stop(code || 0));
}
process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());
