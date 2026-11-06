import { Conversation, ChatMessage, TaskItem, SubscriptionVerificationRequest } from '../types';

const STORAGE_KEY_CONVOS = 'nexora_conversations';
const STORAGE_KEY_MESSAGES = 'nexora_messages';
const STORAGE_KEY_TASKS = 'nexora_tasks';
const STORAGE_KEY_NOTES = 'nexora_notes';
const STORAGE_KEY_VERIFS = 'nexora_subscription_verifications';

// Initial preloaded sample data for rich first-impression experience
const DEFAULT_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    userId: 'default',
    title: 'Welcome to NEXORA Intelligence',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    messageCount: 2,
  },
  {
    id: 'conv-2',
    userId: 'default',
    title: 'Urdu & Roman Urdu Assistant Test',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    messageCount: 2,
  },
];

const DEFAULT_MESSAGES: Record<string, ChatMessage[]> = {
  'conv-1': [
    {
      id: 'msg-1',
      conversationId: 'conv-1',
      userId: 'default',
      role: 'user',
      content: 'Hello! What can you help me with?',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'msg-2',
      conversationId: 'conv-1',
      userId: 'nexora',
      role: 'assistant',
      content: `Welcome to **NEXORA Intelligence** — *Your Smart Digital Partner*!

I am built to empower students, freelancers, professionals, and entrepreneurs across Pakistan and globally. Here is what we can accomplish together:

1. **AI Chat & Reasoning**: Natural multi-turn dialogue with deep problem-solving in English, Urdu (اردو), Roman Urdu, and international languages.
2. **AI Writing Studio**: Produce winning emails, CVs, sales proposals, Instagram captions, YouTube descriptions, and blog posts.
3. **AI Study Assistant**: Step-by-step math solver, science explainers, and interactive MCQ quizzes.
4. **AI Translator**: High-fidelity translation between English, Urdu, and world languages preserving cultural context.
5. **Business Partner**: Build business plans, marketing strategies, and Pakistan/international market projections.
6. **Personal Planner**: Manage your daily tasks, set academic timetables, and track long-term goals.

How may I assist you today?`,
      createdAt: new Date(Date.now() - 3600000 * 2 + 1000).toISOString(),
      modelUsed: 'gemini-3.8-flash',
    },
  ],
  'conv-2': [
    {
      id: 'msg-3',
      conversationId: 'conv-2',
      userId: 'default',
      role: 'user',
      content: 'Mujhe freelance client ke liye aik professional proposal draft kar ke dein.',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: 'msg-4',
      conversationId: 'conv-2',
      userId: 'nexora',
      role: 'assistant',
      content: `Zaroor! Ye raha aap ke freelance client ke liye aik highly professional aur persuasive proposal structure:

---
### **Project Proposal: Web Application Development**
**Client Name / Company:** [Client Name]  
**Prepared By:** [Your Name / Freelancer]  
**Date:** [Date]  

#### **1. Project Overview & Understanding**
Aap ke requirement documents ko analyze karne ke baad, hum ne note kiya hai ke aap ko aik high-speed, responsive, aur modern web platform dark/light theme aur AI integration ke sath develop karwana hai.

#### **2. Scope of Deliverables**
- **User Interface**: Modern responsive layout mobile, tablet, aur desktop ke liye.
- **Core Features**: Secure authentication, dynamic dashboards, aur real-time data persistence.
- **Performance**: Sub-second page loads, clean SEO structure, aur WCAG accessibility standard.

#### **3. Proposed Timeline & Milestones**
- **Milestone 1 (Week 1)**: UI/UX Wireframes aur architecture setup.
- **Milestone 2 (Week 2)**: Core functional modules aur API integrations.
- **Milestone 3 (Week 3)**: QA testing, feedback revisions, aur production deployment.

#### **4. Next Steps**
Aap agar is proposal se agree karte hain to hum aik 15-minute alignment call schedule kar sakte hain taake project officially kick-off kiya ja sake.

*Regards,*  
**[Your Name]**
---

Aap chaho to is proposal ko Writing Studio me specific niche (e.g. MERN stack, Graphic Design, Content Writing) ke mutabiq further customize bhi kar sakte hain!`,
      createdAt: new Date(Date.now() - 3600000 * 24 + 1000).toISOString(),
      modelUsed: 'gemini-3.8-flash',
    },
  ],
};

const DEFAULT_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    userId: 'default',
    title: 'Review Physics Chapter 4 notes with Study Assistant',
    category: 'Study',
    priority: 'high',
    completed: false,
    dueDate: 'Today, 5:00 PM',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    userId: 'default',
    title: 'Generate cold email sequence for 5 potential clients',
    category: 'Business',
    priority: 'medium',
    completed: true,
    dueDate: 'Completed',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    userId: 'default',
    title: 'Translate project brief to Urdu for local team briefing',
    category: 'Work',
    priority: 'low',
    completed: false,
    dueDate: 'Tomorrow',
    createdAt: new Date().toISOString(),
  },
];

// Conversations
export function getConversations(userId: string): Conversation[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_CONVOS}_${userId}`);
    if (!raw) {
      const initial = DEFAULT_CONVERSATIONS.map((c) => ({ ...c, userId }));
      localStorage.setItem(`${STORAGE_KEY_CONVOS}_${userId}`, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_CONVERSATIONS;
  }
}

export function saveConversation(userId: string, conversation: Conversation): void {
  const current = getConversations(userId);
  const exists = current.findIndex((c) => c.id === conversation.id);
  let updated: Conversation[];
  if (exists >= 0) {
    updated = [...current];
    updated[exists] = conversation;
  } else {
    updated = [conversation, ...current];
  }
  localStorage.setItem(`${STORAGE_KEY_CONVOS}_${userId}`, JSON.stringify(updated));
}

export function deleteConversation(userId: string, conversationId: string): void {
  const current = getConversations(userId);
  const updated = current.filter((c) => c.id !== conversationId);
  localStorage.setItem(`${STORAGE_KEY_CONVOS}_${userId}`, JSON.stringify(updated));
  localStorage.removeItem(`${STORAGE_KEY_MESSAGES}_${conversationId}`);
}

// Messages
export function getMessages(conversationId: string): ChatMessage[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_MESSAGES}_${conversationId}`);
    if (!raw) {
      if (DEFAULT_MESSAGES[conversationId]) {
        return DEFAULT_MESSAGES[conversationId];
      }
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveMessage(conversationId: string, message: ChatMessage): void {
  const messages = getMessages(conversationId);
  messages.push(message);
  localStorage.setItem(`${STORAGE_KEY_MESSAGES}_${conversationId}`, JSON.stringify(messages));
}

// Tasks
export function getTasks(userId: string): TaskItem[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_TASKS}_${userId}`);
    if (!raw) {
      const initial = DEFAULT_TASKS.map((t) => ({ ...t, userId }));
      localStorage.setItem(`${STORAGE_KEY_TASKS}_${userId}`, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_TASKS;
  }
}

export function saveTasks(userId: string, tasks: TaskItem[]): void {
  localStorage.setItem(`${STORAGE_KEY_TASKS}_${userId}`, JSON.stringify(tasks));
}

// Notes
export function getNotes(userId: string): string {
  return localStorage.getItem(`${STORAGE_KEY_NOTES}_${userId}`) || `## My NEXORA Quick Notes
- Need to prepare for Monday's presentation
- Key Urdu translations saved in Translator tab
- Goal: Reach 100 cold leads using Business Assistant this week`;
}

export function saveNotes(userId: string, notes: string): void {
  localStorage.setItem(`${STORAGE_KEY_NOTES}_${userId}`, notes);
}

// Submissions
export function submitVerificationRequest(request: SubscriptionVerificationRequest): void {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY_VERIFS) || '[]');
    existing.unshift(request);
    localStorage.setItem(STORAGE_KEY_VERIFS, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to submit verification request', e);
  }
}
