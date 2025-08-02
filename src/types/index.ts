export interface Feedback {
  id: string;
  name: string;
  email: string;
  message: string;
  type: 'bug' | 'feature' | 'general' | 'complaint';
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  message: string;
  response: string;
  timestamp: string;
}