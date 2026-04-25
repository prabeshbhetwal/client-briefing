import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vincomm')
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));

// Define Schema & Model for Submissions
const submissionSchema = new mongoose.Schema({
  guideId: String,
  title: String,
  senderEmail: String,
  date: String,
  questions: Array,
  createdAt: { type: Date, default: Date.now }
});

const Submission = mongoose.model('Submission', submissionSchema);

// API Routes
app.post('/api/submissions', async (req, res) => {
  try {
    const newSubmission = new Submission(req.body);
    await newSubmission.save();
    res.status(201).json({ message: 'Submission saved successfully', submission: newSubmission });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save submission' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
