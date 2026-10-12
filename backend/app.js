import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { timingSafeEqual } from 'node:crypto';

mongoose.set('bufferCommands', false);
const questionSchema = new mongoose.Schema({
  id: String, section: String, question: String, answer: String,
}, { _id: false });
export const Submission = mongoose.model('Submission', new mongoose.Schema({
  guideId: { type: String, required: true, enum: ['brief', 'general', 'bayview'] },
  title: { type: String, required: true },
  senderEmail: String,
  date: String,
  questions: [questionSchema],
  summary: String,
  createdAt: { type: Date, default: Date.now },
}));

export const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '256kb' }));
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.get('/api/health', (req, res) => {
  const ready = mongoose.connection.readyState === 1;
  res.status(ready ? 200 : 503).json({ status: ready ? 'ready' : 'database-unavailable' });
});

function validText(value, max, required = false) {
  return typeof value === 'string' && value.length <= max && (!required || value.trim().length > 0);
}

app.post('/api/submissions', async (req, res) => {
  if (!req.is('application/json')) return res.status(415).json({ error: 'Send JSON submissions.' });
  const body = req.body;
  if (!body || !['brief', 'general', 'bayview'].includes(body.guideId)
    || !validText(body.title, 200, true) || !validText(body.date, 80, true)
    || !validText(body.senderEmail, 254)
    || (body.senderEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.senderEmail))
    || !validText(body.summary, 150000, true)
    || !Array.isArray(body.questions) || body.questions.length < 1 || body.questions.length > 100
    || !body.questions.every(q => q && validText(q.id, 120, true)
      && validText(q.section, 200, true) && validText(q.question, 500, true) && validText(q.answer, 10000))
    || !body.questions.some(q => q.answer.trim())
    || new Set(body.questions.map(q => q.id)).size !== body.questions.length) {
    return res.status(400).json({ error: 'Provide valid briefing details, email and at least one answer.' });
  }
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ error: 'Database unavailable. Keep your backup and retry.' });
  try {
    const submission = await Submission.create({
      guideId: body.guideId, title: body.title.trim(), senderEmail: body.senderEmail.trim(),
      date: body.date, summary: body.summary,
      questions: body.questions.map(({ id, section, question, answer }) => ({ id, section, question, answer })),
    });
    res.status(201).json({ message: 'Submission saved successfully', id: submission.id });
  } catch {
    res.status(503).json({ error: 'Could not save. Keep your backup and retry.' });
  }
});

app.get('/api/submissions', async (req, res) => {
  const token = process.env.ADMIN_TOKEN || '';
  if (token.length < 32) return res.status(503).json({ error: 'Admin access is not configured.' });
  const supplied = req.get('Authorization') || '';
  const expected = `Bearer ${token}`;
  if (Buffer.byteLength(supplied) !== Buffer.byteLength(expected)
    || !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) {
    return res.status(401).json({ error: 'Admin token required.' });
  }
  const limit = req.query.limit === undefined ? 20 : Number(req.query.limit);
  const before = req.query.before;
  if (!Number.isInteger(limit) || limit < 1 || limit > 50
    || (before !== undefined && (typeof before !== 'string' || !/^[a-f\d]{24}$/i.test(before)))) {
    return res.status(400).json({ error: 'Invalid page cursor or limit (1–50).' });
  }
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ error: 'Database unavailable.' });
  try {
    const submissions = await Submission.find(before ? { _id: { $lt: before } } : {})
      .sort({ _id: -1 }).limit(limit).select('-__v').lean();
    res.json({ submissions, next: submissions.length === limit ? String(submissions.at(-1)._id) : null });
  } catch {
    res.status(503).json({ error: 'Could not load submissions. Retry later.' });
  }
});

app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Submission too large.' });
  if (err instanceof SyntaxError && err.status === 400) return res.status(400).json({ error: 'Invalid JSON.' });
  res.status(500).json({ error: 'Request failed.' });
});
