import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { AppData, User, Post, ChatConversation, Message, LeaderboardEntry, CalendarEvent, Payment, Team, Comment } from '../types';

interface AppDataContextType extends AppData {
  setCurrentUser: (user: User | null) => void;
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments'>) => void;
  likePost: (postId: string, userId: string) => void;
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  sendMessage: (conversationId: string, message: Omit<Message, 'id' | 'createdAt'>) => void;
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (eventId: string, updates: Partial<CalendarEvent>) => void;
  toggleEventAttendance: (eventId: string, userId: string) => void;
  addPayment: (payment: Omit<Payment, 'id' | 'createdAt'>) => void;
  updatePaymentStatus: (paymentId: string, status: Payment['status'], paidAt?: Date, paymentMethod?: Payment['paymentMethod']) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

// Mock data inicial
const mockTeams: Team[] = [
  { id: '1', name: 'Sub-15 Masculino', sport: 'Futebol', category: 'Sub-15', color: '#3B82F6' },
  { id: '2', name: 'Sub-17 Feminino', sport: 'Futsal', category: 'Sub-17', color: '#EC4899' },
  { id: '3', name: 'Adulto Misto', sport: 'Vôlei', category: 'Adulto', color: '#10B981' },
  { id: '4', name: 'Iniciante', sport: 'Basquete', category: 'Iniciante', color: '#F59E0B' },
];

const mockPosts: Post[] = [
  {
    id: '1',
    authorId: 'club1',
    authorName: 'Esportiva FC',
    authorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=EFC',
    content: 'Grande vitória do Sub-15! Parabéns a todos os atletas pelo empenho! 🏆⚽',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: ['athlete1', 'athlete2'],
    comments: [
      {
        id: 'c1',
        authorId: 'athlete1',
        authorName: 'João Silva',
        content: 'Foi incrível! Obrigado pelo apoio!',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: '2',
    authorId: 'club1',
    authorName: 'Esportiva FC',
    content: 'Lembrete: Treino amanhã às 14h. Não esqueçam de trazer água e protetor solar! ☀️',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    likes: ['athlete3'],
    comments: [],
  },
  {
    id: '3',
    authorId: 'club1',
    authorName: 'Esportiva FC',
    content: 'Novos uniformes chegaram! Passem pela secretaria para retirar o seu.',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    likes: ['athlete1', 'athlete2', 'athlete3', 'athlete4'],
    comments: [
      {
        id: 'c2',
        authorId: 'athlete2',
        authorName: 'Maria Santos',
        content: 'Ficaram lindos!',
        createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
      },
    ],
  },
];

const mockConversations: ChatConversation[] = [
  {
    id: 'general',
    name: 'Chat Geral',
    type: 'general',
    lastMessage: 'Alguém sabe o horário do jogo?',
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
    unreadCount: 2,
  },
  {
    id: 'team1',
    name: 'Sub-15 Masculino',
    type: 'team',
    teamId: '1',
    lastMessage: 'Treino confirmado para amanhã!',
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 0,
  },
  {
    id: 'team2',
    name: 'Sub-17 Feminino',
    type: 'team',
    teamId: '2',
    lastMessage: 'Parabéns pela vitória meninas!',
    lastMessageTime: new Date(Date.now() - 5 * 60 * 60 * 1000),
    unreadCount: 1,
  },
  {
    id: 'team3',
    name: 'Adulto Misto',
    type: 'team',
    teamId: '3',
    lastMessage: 'Confirmem presença no evento de sábado',
    lastMessageTime: new Date(Date.now() - 8 * 60 * 60 * 1000),
    unreadCount: 0,
  },
];

const mockMessages: Message[] = [
  {
    id: 'm1',
    conversationId: 'general',
    authorId: 'athlete1',
    authorName: 'João Silva',
    content: 'Alguém sabe o horário do jogo?',
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: 'm2',
    conversationId: 'general',
    authorId: 'club1',
    authorName: 'Coordenador',
    content: 'O jogo é às 16h no campo principal!',
    createdAt: new Date(Date.now() - 25 * 60 * 1000),
  },
  {
    id: 'm3',
    conversationId: 'team1',
    authorId: 'club1',
    authorName: 'Coordenador',
    content: 'Treino confirmado para amanhã às 14h. Todos presentes!',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
];

const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: '1',
    athleteId: 'athlete1',
    athleteName: 'João Silva',
    teamId: '1',
    sport: 'Futebol',
    stats: { goals: 15, assists: 8, attendance: 95, points: 38 },
    position: 1,
  },
  {
    id: '2',
    athleteId: 'athlete2',
    athleteName: 'Maria Santos',
    teamId: '2',
    sport: 'Futsal',
    stats: { goals: 12, assists: 10, attendance: 92, points: 34 },
    position: 2,
  },
  {
    id: '3',
    athleteId: 'athlete3',
    athleteName: 'Pedro Costa',
    teamId: '1',
    sport: 'Futebol',
    stats: { goals: 10, assists: 6, attendance: 88, points: 26 },
    position: 3,
  },
  {
    id: '4',
    athleteId: 'athlete4',
    athleteName: 'Ana Oliveira',
    teamId: '3',
    sport: 'Vôlei',
    stats: { points: 120, attendance: 90, wins: 8 },
    position: 1,
  },
];

const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Treino Sub-15',
    description: 'Treino técnico e tático',
    type: 'training',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    startTime: '14:00',
    endTime: '16:00',
    teamId: '1',
    teamName: 'Sub-15 Masculino',
    location: 'Campo 1',
    attendees: ['athlete1', 'athlete3'],
  },
  {
    id: '2',
    title: 'Jogo Amistoso',
    description: 'Jogo amistoso contra FC Rival',
    type: 'game',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    startTime: '16:00',
    endTime: '18:00',
    teamId: '1',
    teamName: 'Sub-15 Masculino',
    location: 'Estádio Municipal',
    attendees: [],
  },
  {
    id: '3',
    title: 'Reunião de Pais',
    description: 'Reunião trimestral com responsáveis',
    type: 'meeting',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    startTime: '19:00',
    endTime: '21:00',
    location: 'Sala de Reuniões',
    attendees: [],
  },
];

const mockPayments: Payment[] = [
  {
    id: '1',
    title: 'Mensalidade Dezembro',
    description: 'Mensalidade do mês de dezembro',
    amount: 150.00,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: 'pending',
    teamId: '1',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    title: 'Taxa de Jogo',
    description: 'Taxa referente ao jogo amistoso',
    amount: 50.00,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: 'pending',
    athleteId: 'athlete1',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    title: 'Mensalidade Novembro',
    description: 'Mensalidade do mês de novembro',
    amount: 150.00,
    dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    status: 'paid',
    athleteId: 'athlete1',
    paidAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    paymentMethod: 'pix',
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
  },
];

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [conversations, setConversations] = useState<ChatConversation[]>(mockConversations);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(mockLeaderboard);
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [teams] = useState<Team[]>(mockTeams);

  // Carregar dados do localStorage
  useEffect(() => {
    const savedPosts = localStorage.getItem('app_posts');
    const savedMessages = localStorage.getItem('app_messages');
    const savedEvents = localStorage.getItem('app_events');
    const savedPayments = localStorage.getItem('app_payments');

    if (savedPosts) setPosts(JSON.parse(savedPosts, dateReviver));
    if (savedMessages) setMessages(JSON.parse(savedMessages, dateReviver));
    if (savedEvents) setEvents(JSON.parse(savedEvents, dateReviver));
    if (savedPayments) setPayments(JSON.parse(savedPayments, dateReviver));
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem('app_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('app_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('app_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('app_payments', JSON.stringify(payments));
  }, [payments]);

  const addPost = (post: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments'>) => {
    const newPost: Post = {
      ...post,
      id: `post_${Date.now()}`,
      createdAt: new Date(),
      likes: [],
      comments: [],
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const likePost = (postId: string, userId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const hasLiked = post.likes.includes(userId);
        return {
          ...post,
          likes: hasLiked 
            ? post.likes.filter(id => id !== userId)
            : [...post.likes, userId],
        };
      }
      return post;
    }));
  };

  const addComment = (postId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const newComment: Comment = {
          ...comment,
          id: `comment_${Date.now()}`,
          createdAt: new Date(),
        };
        return {
          ...post,
          comments: [...post.comments, newComment],
        };
      }
      return post;
    }));
  };

  const sendMessage = (conversationId: string, message: Omit<Message, 'id' | 'createdAt'>) => {
    const newMessage: Message = {
      ...message,
      id: `msg_${Date.now()}`,
      createdAt: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    
    // Atualizar última mensagem da conversa
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          lastMessage: message.content,
          lastMessageTime: new Date(),
        };
      }
      return conv;
    }));
  };

  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `event_${Date.now()}`,
      attendees: event.attendees || [],
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (eventId: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, ...updates } : event
    ));
  };

  const toggleEventAttendance = (eventId: string, userId: string) => {
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        const attendees = event.attendees || [];
        const isAttending = attendees.includes(userId);
        return {
          ...event,
          attendees: isAttending
            ? attendees.filter(id => id !== userId)
            : [...attendees, userId],
        };
      }
      return event;
    }));
  };

  const addPayment = (payment: Omit<Payment, 'id' | 'createdAt'>) => {
    const newPayment: Payment = {
      ...payment,
      id: `payment_${Date.now()}`,
      createdAt: new Date(),
    };
    setPayments(prev => [newPayment, ...prev]);
  };

  const updatePaymentStatus = (
    paymentId: string, 
    status: Payment['status'], 
    paidAt?: Date,
    paymentMethod?: Payment['paymentMethod']
  ) => {
    setPayments(prev => prev.map(payment => 
      payment.id === paymentId 
        ? { ...payment, status, paidAt, paymentMethod } 
        : payment
    ));
  };

  return (
    <AppDataContext.Provider
      value={{
        currentUser,
        posts,
        conversations,
        messages,
        leaderboard,
        events,
        payments,
        teams,
        setCurrentUser,
        addPost,
        likePost,
        addComment,
        sendMessage,
        addEvent,
        updateEvent,
        toggleEventAttendance,
        addPayment,
        updatePaymentStatus,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return context;
}

// Helper para reviver datas do JSON
function dateReviver(key: string, value: any) {
  const dateFields = ['createdAt', 'date', 'dueDate', 'paidAt', 'lastMessageTime'];
  if (dateFields.includes(key) && typeof value === 'string') {
    return new Date(value);
  }
  return value;
}
