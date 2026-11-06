import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-memory runtime state for administration & quota tracking
interface SystemConfig {
  activeModel: string;
  freeQuota: number;
  plusQuota: number;
  proQuota: number;
  pricing: {
    pkr: { free: number; plus: number; pro: number };
    usd: { free: number; plus: number; pro: number };
  };
}

let systemConfig: SystemConfig = {
  activeModel: 'gemini-3.8-flash',
  freeQuota: 30,
  plusQuota: 200,
  proQuota: 1000,
  pricing: {
    pkr: { free: 0, plus: 499, pro: 999 },
    usd: { free: 0, plus: 4.99, pro: 9.99 },
  },
};

interface UserUsageRecord {
  date: string;
  queriesToday: number;
  tokensEstimated: number;
}

const userUsageStore: Record<string, UserUsageRecord> = {};
let totalQueriesProcessed = 142;
let totalTokensProcessed = 64200;

interface SubscriptionVerification {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  plan: 'plus' | 'pro';
  amount: string;
  currency: 'PKR' | 'USD';
  gateway: 'Easypaisa' | 'JazzCash' | 'Bank Transfer' | 'Card';
  transactionRef: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
}

const subscriptionVerifications: SubscriptionVerification[] = [
  {
    id: 'sub-sample-1',
    userId: 'usr-demo-pk1',
    userEmail: 'ali.raza@example.pk',
    userName: 'Ali Raza',
    plan: 'plus',
    amount: 'Rs. 499',
    currency: 'PKR',
    gateway: 'JazzCash',
    transactionRef: 'JC882947192',
    timestamp: '2026-11-05T06:15:00Z',
    status: 'approved',
  },
  {
    id: 'sub-sample-2',
    userId: 'usr-demo-pk2',
    userEmail: 'zainab.k@example.com',
    userName: 'Zainab Khan',
    plan: 'pro',
    amount: 'Rs. 999',
    currency: 'PKR',
    gateway: 'Easypaisa',
    transactionRef: 'EP993817264',
    timestamp: '2026-11-05T07:10:00Z',
    status: 'pending',
  },
];

interface ManagedUser {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'plus' | 'pro';
  status: 'active' | 'suspended';
  joinedDate: string;
  queriesCount: number;
}

const managedUsers: ManagedUser[] = [
  {
    id: 'usr-owner',
    email: 'farukharain962@gmail.com',
    name: 'Farukh Arain (Owner)',
    plan: 'pro',
    status: 'active',
    joinedDate: '2026-11-01',
    queriesCount: 88,
  },
  {
    id: 'usr-1',
    email: 'ali.raza@example.pk',
    name: 'Ali Raza',
    plan: 'plus',
    status: 'active',
    joinedDate: '2026-11-02',
    queriesCount: 34,
  },
  {
    id: 'usr-2',
    email: 'zainab.k@example.com',
    name: 'Zainab Khan',
    plan: 'pro',
    status: 'active',
    joinedDate: '2026-11-03',
    queriesCount: 52,
  },
  {
    id: 'usr-3',
    email: 'hammad.tech@gmail.com',
    name: 'Hammad Tariq',
    plan: 'free',
    status: 'active',
    joinedDate: '2026-11-04',
    queriesCount: 19,
  },
];

// Helper: Check and record quota
function checkQuota(userId: string, plan: 'free' | 'plus' | 'pro' = 'free'): { allowed: boolean; remaining: number; limit: number } {
  const today = new Date().toISOString().split('T')[0];
  if (!userUsageStore[userId] || userUsageStore[userId].date !== today) {
    userUsageStore[userId] = { date: today, queriesToday: 0, tokensEstimated: 0 };
  }

  const limit = plan === 'pro' ? systemConfig.proQuota : plan === 'plus' ? systemConfig.plusQuota : systemConfig.freeQuota;
  const current = userUsageStore[userId].queriesToday;

  if (current >= limit) {
    return { allowed: false, remaining: 0, limit };
  }

  userUsageStore[userId].queriesToday += 1;
  totalQueriesProcessed += 1;
  return { allowed: true, remaining: limit - current - 1, limit };
}

// System Persona instruction for NEXORA Intelligence
const NEXORA_SYSTEM_INSTRUCTION = `You are NEXORA Intelligence — "Your Smart Digital Partner", a modern, reliable, and deeply capable AI assistant designed for students, teachers, freelancers, developers, entrepreneurs, and professionals across Pakistan and international markets.

Key Behavioral Guidelines:
1. LANGUAGE FIDELITY:
   - When the user asks in Urdu script (اردو), reply in polished, grammatically correct Urdu script without defaulting to Hindi/Devanagari.
   - When the user speaks in Roman Urdu (e.g., "Mujhe aik acha business plan bana kar dein"), respond in natural, friendly Roman Urdu or English with Roman Urdu context as requested.
   - When the user speaks in English or any international language, respond in articulate, professional, and clear English or the target language.
2. PEDAGOGY & REASONING:
   - For students and study queries, do not simply dump final answers. Provide clear step-by-step explanations, intuitive examples, and conceptual breakdowns.
3. ACCURACY & HONESTY:
   - Admit uncertainty instead of hallucinating.
   - Clearly distinguish between general informational advice and regulated professional financial/legal advice.
4. FORMATTING:
   - Use clean Markdown with structured headings, bullet points, and code blocks with language identifiers where appropriate.`;

// Resilient Gemini Invoker with automatic retry & model fallback
async function callGeminiWithRetry(options: {
  contents: string | any;
  systemInstruction?: string;
  preferredModel?: string;
}): Promise<{ text: string; modelUsed: string }> {
  if (!ai) {
    throw new Error('Gemini API is not configured on the server. Please verify GEMINI_API_KEY in Settings > Secrets.');
  }

  const candidateModels = Array.from(
    new Set([
      options.preferredModel || systemConfig.activeModel,
      'gemini-flash-latest',
      'gemini-3.1-flash-lite',
    ])
  );

  let lastError: any = null;

  for (const model of candidateModels) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: options.contents,
          config: options.systemInstruction
            ? { systemInstruction: options.systemInstruction }
            : undefined,
        });

        if (response && response.text) {
          return { text: response.text, modelUsed: model };
        }
      } catch (err: any) {
        lastError = err;
        const msg = err?.message || String(err);
        const isTemporary =
          msg.includes('503') ||
          msg.includes('UNAVAILABLE') ||
          msg.includes('high demand') ||
          msg.includes('429') ||
          msg.includes('RESOURCE_EXHAUSTED');

        if (isTemporary && attempt === 0) {
          await new Promise((r) => setTimeout(r, 800));
          continue;
        }
        break; // try next candidate model
      }
    }
  }

  throw lastError || new Error('Failed to generate content after retry attempts.');
}

// API Routes

// 1. Core Chat Endpoint
app.post('/api/gemini/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages, language, systemPrompt, userId = 'guest_user', plan = 'free' } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Messages array is required.' });
      return;
    }

    // Quota check
    const quota = checkQuota(userId, plan);
    if (!quota.allowed) {
      res.status(429).json({
        error: `Daily message quota limit reached (${quota.limit} messages). Please upgrade to NEXORA Plus or Pro for higher limits.`,
        remaining: 0,
        limit: quota.limit,
      });
      return;
    }

    // Convert messages into contents string
    const formattedHistory = messages
      .map((m: { role: string; content: string }) => `${m.role === 'user' ? 'User' : 'NEXORA'}: ${m.content}`)
      .join('\n\n');

    const promptWithLanguage = `${formattedHistory}\n\n[Instruction: ${language ? `Respond in ${language}. ` : ''}${systemPrompt || ''}]`;

    const result = await callGeminiWithRetry({
      contents: promptWithLanguage,
      systemInstruction: NEXORA_SYSTEM_INSTRUCTION,
      preferredModel: systemConfig.activeModel,
    });

    const reply = result.text || 'I apologize, but I could not generate a response at this moment.';
    totalTokensProcessed += Math.round((promptWithLanguage.length + reply.length) / 4);

    res.json({
      reply,
      modelUsed: result.modelUsed,
      remainingQuota: quota.remaining,
      limit: quota.limit,
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/chat:', error);
    res.status(500).json({
      error: error?.message || 'An error occurred while generating AI response.',
    });
  }
});

// 2. Writing Studio Endpoint
app.post('/api/gemini/studio', async (req: Request, res: Response): Promise<void> => {
  try {
    const { toolType, prompt, tone = 'Professional', language = 'English', options = {}, userId = 'guest_user', plan = 'free' } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required.' });
      return;
    }

    const quota = checkQuota(userId, plan);
    if (!quota.allowed) {
      res.status(429).json({ error: 'Daily quota exceeded. Upgrade to continue writing.' });
      return;
    }

    const writingInstruction = `You are the NEXORA Writing Studio expert assistant.
Tool Type: ${toolType}
Tone: ${tone}
Target Language: ${language}
Additional Options: ${JSON.stringify(options)}

Generate high-quality, polished, ready-to-use content. Format with clean markdown headers and bullet points where beneficial.`;

    const result = await callGeminiWithRetry({
      contents: `Please generate content for the following request:\n${prompt}`,
      systemInstruction: writingInstruction,
      preferredModel: systemConfig.activeModel,
    });

    res.json({
      result: result.text || '',
      remainingQuota: quota.remaining,
      modelUsed: result.modelUsed,
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/studio:', error);
    res.status(500).json({ error: error?.message || 'Writing Studio generation failed.' });
  }
});

// 3. Study Assistant Endpoint
app.post('/api/gemini/study', async (req: Request, res: Response): Promise<void> => {
  try {
    const { mode, topic, gradeLevel = 'General', question = '', options = {}, userId = 'guest_user', plan = 'free' } = req.body;

    const quota = checkQuota(userId, plan);
    if (!quota.allowed) {
      res.status(429).json({ error: 'Daily study limit reached. Please upgrade to continue.' });
      return;
    }

    let instruction = `You are the NEXORA AI Study Assistant, an empathetic, highly structured academic tutor.
Level: ${gradeLevel}
Topic: ${topic}
Mode: ${mode} (options: 'explain', 'step-by-step', 'quiz', 'mcq', 'summary', 'revision')

Rules:
- Explain difficult concepts using intuitive analogies.
- For Math & Science: Breakdown solutions step by step, never jump to the result.
- If Mode is 'quiz' or 'mcq', provide multiple-choice questions with 4 distinct choices (A, B, C, D) and explanations hidden or marked.
- Support both English and Urdu/Roman Urdu terminology where relevant for Pakistani & international curriculums.`;

    const result = await callGeminiWithRetry({
      contents: question || `Teach me about ${topic} in detail.`,
      systemInstruction: instruction,
      preferredModel: systemConfig.activeModel,
    });

    res.json({
      result: result.text || '',
      remainingQuota: quota.remaining,
      modelUsed: result.modelUsed,
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/study:', error);
    res.status(500).json({ error: error?.message || 'Study Assistant failed.' });
  }
});

// 4. Translator Endpoint
app.post('/api/gemini/translate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, fromLang = 'Auto-Detect', toLang = 'Urdu', userId = 'guest_user', plan = 'free' } = req.body;

    if (!text) {
      res.status(400).json({ error: 'Text is required for translation.' });
      return;
    }

    const quota = checkQuota(userId, plan);
    if (!quota.allowed) {
      res.status(429).json({ error: 'Daily translation quota exceeded.' });
      return;
    }

    const translationInstruction = `You are a professional linguistic translator for NEXORA Intelligence.
Translate the text from ${fromLang} to ${toLang}.
Crucial rules:
1. If translating to Urdu (اردو), output authentic, natural Urdu in Arabic script (نستعلیق / اردو). Do not mix Hindi words.
2. If translating to Roman Urdu, use standard conversational Pakistani Roman Urdu spelling.
3. If translating to English, maintain the tone and natural idiom.
4. Output the translation cleanly followed by a brief linguistic note explaining nuance if applicable.`;

    const result = await callGeminiWithRetry({
      contents: text,
      systemInstruction: translationInstruction,
      preferredModel: systemConfig.activeModel,
    });

    res.json({
      translatedText: result.text || '',
      fromLang,
      toLang,
      remainingQuota: quota.remaining,
      modelUsed: result.modelUsed,
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/translate:', error);
    res.status(500).json({ error: error?.message || 'Translation failed.' });
  }
});

// 5. Business Assistant Endpoint
app.post('/api/gemini/business', async (req: Request, res: Response): Promise<void> => {
  try {
    const { toolType, prompt, marketContext = 'Pakistan & Global', userId = 'guest_user', plan = 'free' } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Business prompt is required.' });
      return;
    }

    const quota = checkQuota(userId, plan);
    if (!quota.allowed) {
      res.status(429).json({ error: 'Daily quota exceeded.' });
      return;
    }

    const businessInstruction = `You are the NEXORA Business Productivity Partner, advising entrepreneurs, small businesses, and freelancers in ${marketContext}.
Tool: ${toolType}

Deliver thorough, actionable strategies, financial models, marketing copy, or operational plans.
Include a brief disclaimer at the end stating: "*Notice: This output is for strategic planning and educational guidance. Consult a qualified professional for legal or tax advice.*"`;

    const result = await callGeminiWithRetry({
      contents: prompt,
      systemInstruction: businessInstruction,
      preferredModel: systemConfig.activeModel,
    });

    res.json({
      result: result.text || '',
      remainingQuota: quota.remaining,
      modelUsed: result.modelUsed,
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/business:', error);
    res.status(500).json({ error: error?.message || 'Business Assistant failed.' });
  }
});

// Admin API Routes (Owner Farukh Arain / farukharain962@gmail.com)

// Admin Stats
app.get('/api/admin/stats', (_req: Request, res: Response): void => {
  const activeSubsCount = managedUsers.filter((u) => u.plan !== 'free').length;
  const estimatedCost = (totalTokensProcessed / 1000000) * 0.15; // ~$0.15 per million tokens est.

  res.json({
    totalUsers: managedUsers.length,
    activeUsers: managedUsers.filter((u) => u.status === 'active').length,
    totalQueriesProcessed,
    totalTokensProcessed,
    estimatedCostUsd: Number(estimatedCost.toFixed(4)),
    activeSubscriptions: activeSubsCount,
    revenuePkr: activeSubsCount * 749, // Average blended PKR revenue
    revenueUsd: activeSubsCount * 7.49,
    config: systemConfig,
  });
});

// Admin Users List
app.get('/api/admin/users', (_req: Request, res: Response): void => {
  res.json({ users: managedUsers });
});

// Admin Toggle User Status
app.post('/api/admin/users/toggle-status', (req: Request, res: Response): void => {
  const { userId } = req.body;
  const user = managedUsers.find((u) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: 'User not found.' });
    return;
  }
  user.status = user.status === 'active' ? 'suspended' : 'active';
  res.json({ success: true, user });
});

// Admin Subscriptions
app.get('/api/admin/subscriptions', (_req: Request, res: Response): void => {
  res.json({ subscriptions: subscriptionVerifications });
});

// Admin Verify Subscription
app.post('/api/admin/subscriptions/verify', (req: Request, res: Response): void => {
  const { subId, action } = req.body;
  const sub = subscriptionVerifications.find((s) => s.id === subId);
  if (!sub) {
    res.status(404).json({ error: 'Subscription not found.' });
    return;
  }
  sub.status = action === 'approve' ? 'approved' : 'rejected';

  // Upgrade user if approved
  if (action === 'approve') {
    const user = managedUsers.find((u) => u.id === sub.userId || u.email === sub.userEmail);
    if (user) {
      user.plan = sub.plan;
    }
  }

  res.json({ success: true, subscription: sub });
});

// Admin Update Config
app.post('/api/admin/config', (req: Request, res: Response): void => {
  const { activeModel, freeQuota, plusQuota, proQuota, pricing } = req.body;
  if (activeModel) systemConfig.activeModel = activeModel;
  if (typeof freeQuota === 'number') systemConfig.freeQuota = freeQuota;
  if (typeof plusQuota === 'number') systemConfig.plusQuota = plusQuota;
  if (typeof proQuota === 'number') systemConfig.proQuota = proQuota;
  if (pricing) systemConfig.pricing = pricing;

  res.json({ success: true, config: systemConfig });
});

// Start server with Vite middleware in development
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NEXORA Intelligence server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
