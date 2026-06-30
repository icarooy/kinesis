// Tipos globais da aplicação

export type UserRole = 'CLUB_OWNER' | 'CLUB_ADMIN' | 'ATHLETE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  clubId?: string;
  teams?: string[]; // IDs das turmas que o usuário pertence
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  image?: string;
  video?: string;
  createdAt: Date;
  likes: string[]; // Array de user IDs que curtiram
  comments: Comment[];
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: Date;
}

export interface ChatConversation {
  id: string;
  name: string;
  type: 'general' | 'team';
  teamId?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  avatar?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: Date;
}

export interface LeaderboardEntry {
  id: string;
  athleteId: string;
  athleteName: string;
  athleteAvatar?: string;
  teamId: string;
  sport: string;
  stats: {
    points?: number;
    goals?: number;
    assists?: number;
    attendance?: number;
    wins?: number;
    [key: string]: number | undefined;
  };
  position: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: 'training' | 'game' | 'meeting' | 'other';
  date: Date;
  startTime?: string;
  endTime?: string;
  teamId?: string;
  teamName?: string;
  location?: string;
  attendees?: string[]; // User IDs que confirmaram presença
}

export interface Payment {
  id: string;
  title: string;
  description?: string;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue';
  athleteId?: string; // Se for cobrança individual
  teamId?: string; // Se for cobrança por turma
  paidAt?: Date;
  paymentMethod?: 'pix' | 'boleto' | 'card' | 'cash';
  createdAt: Date;
}

export interface Team {
  id: string;
  name: string;
  sport: string;
  category: string;
  color: string;
}

export interface AppData {
  currentUser: User | null;
  posts: Post[];
  conversations: ChatConversation[];
  messages: Message[];
  leaderboard: LeaderboardEntry[];
  events: CalendarEvent[];
  payments: Payment[];
  teams: Team[];
}
