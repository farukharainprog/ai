export type UserRole = 'user' | 'admin';
export type SubscriptionPlan = 'free' | 'plus' | 'pro';

export interface UserProfile {
  id: string;
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  plan: SubscriptionPlan;
  status: 'active' | 'suspended';
  createdAt: string;
  updatedAt?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  userId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  modelUsed?: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

export interface TaskItem {
  id: string;
  userId: string;
  title: string;
  category: 'Study' | 'Work' | 'Personal' | 'Business';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  dueDate?: string;
  createdAt: string;
}

export type WritingToolType =
  | 'email'
  | 'client_message'
  | 'facebook_post'
  | 'instagram_caption'
  | 'youtube_description'
  | 'business_proposal'
  | 'cv_resume'
  | 'cover_letter'
  | 'product_description'
  | 'ad_copy'
  | 'blog_article'
  | 'grammar_polish'
  | 'summarizer';

export type StudyMode =
  | 'step_by_step'
  | 'concept_explainer'
  | 'quiz_mcq'
  | 'chapter_summary'
  | 'exam_prep';

export type BusinessToolType =
  | 'idea_generator'
  | 'business_plan'
  | 'marketing_strategy'
  | 'content_calendar'
  | 'sales_pitch'
  | 'brand_names'
  | 'customer_support';

export interface SubscriptionVerificationRequest {
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

export interface SystemConfig {
  activeModel: string;
  freeQuota: number;
  plusQuota: number;
  proQuota: number;
  pricing: {
    pkr: { free: number; plus: number; pro: number };
    usd: { free: number; plus: number; pro: number };
  };
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalQueriesProcessed: number;
  totalTokensProcessed: number;
  estimatedCostUsd: number;
  activeSubscriptions: number;
  revenuePkr: number;
  revenueUsd: number;
  config: SystemConfig;
}
