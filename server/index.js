import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
const router = express.Router();
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(process.cwd(), 'server', 'data', 'feedback.json');

// Middleware
app.use(cors());
app.use(express.json());

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(DATA_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Read feedback data
async function readFeedbackData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Write feedback data
async function writeFeedbackData(data) {
  await ensureDataDirectory();
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// Routes
app.get('/api/feedback', async (req, res) => {
  try {
    const feedback = await readFeedbackData();
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read feedback data' });
  }
});

app.post('/api/feedback', async (req, res) => {
  try {
    const { name, email, message, type } = req.body;
    
    if (!name || !email || !message || !type) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const feedback = await readFeedbackData();
    const newFeedback = {
      id: Date.now().toString(),
      name,
      email,
      message,
      type,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    feedback.push(newFeedback);
    await writeFeedbackData(feedback);
    
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

app.put('/api/feedback/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const feedback = await readFeedbackData();
    const index = feedback.findIndex(f => f.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    
    feedback[index].status = status;
    await writeFeedbackData(feedback);
    
    res.json(feedback[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update feedback' });
  }
});

app.delete('/api/feedback/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await readFeedbackData();
    const filteredFeedback = feedback.filter(f => f.id !== id);
    
    if (feedback.length === filteredFeedback.length) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    
    await writeFeedbackData(filteredFeedback);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (typeof message !== 'string') {
    return res.status(400).json({ error: "Message must be a string" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

    const chat = model.startChat({ history: [] });
    const result = await chat.sendMessage(message);
    const response = result.response.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    res.json({ response });
    
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use("/", router);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});