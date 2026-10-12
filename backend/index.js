import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: new URL('./.env', import.meta.url) });
const { app } = await import('./app.js');
const port = Number(process.env.PORT || 5001);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be 1–65535.');

try {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vincomm', {
    serverSelectionTimeoutMS: 5000,
  });
  const server = app.listen(port, process.env.HOST || '127.0.0.1', () => {
    console.log(`Client Briefing API ready on port ${port}`);
  });
  server.on('error', async () => {
    console.error('API could not listen. Check the host and port.');
    await mongoose.disconnect();
    process.exitCode = 1;
  });
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, () => server.close(async () => { await mongoose.disconnect(); process.exit(0); }));
  }
} catch {
  console.error('MongoDB unavailable. Check backend/.env and start MongoDB. No submissions accepted.');
  process.exitCode = 1;
}
