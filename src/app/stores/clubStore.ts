import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

/**
 * 🏃‍♂️ ATLETA - Interface
 */
export interface Athlete {
  id: string;
  nome: string;
  idade: number;
  email: string;
  telefone: string;
  turmaId: string | null;
  modalidade: string;
  statusPagamento: 'em_dia' | 'pendente' | 'atrasado';
  dataCadastro: Date;
  ativo: boolean;
}

/**
 * 🏫 TURMA - Interface baseada no DER
 */
export interface Turma {
  id: string; // id_turma
  codigo: string; // Código único da turma (ex: "TUR-001")
  horario: string; // Horário das aulas (ex: "14:00")
  clubeId: string; // FK - Relacionamento oferta
  modalidadeId: string; // FK - Relacionamento possui
  treinadorId: string; // FK - Relacionamento ministrada
  localId: string; // FK - Relacionamento Rel
  nome: string; // Nome descritivo (ex: "Turma Infantil Futebol")
  faixaEtaria: string; // Ex: "8-12 anos"
  diasSemana: string[]; // Ex: ["Segunda", "Quarta", "Sexta"]
  numeroAtletas: number;
  ativa: boolean;
  dataCriacao: Date;
}

/**
 * 🏢 CLUBE - Interface
 */
export interface Clube {
  id: string;
  nome: string;
  codigo: string;
}

/**
 * ⚽ MODALIDADE - Interface
 */
export interface Modalidade {
  id: string;
  nome: string;
  icone: string;
}

/**
 * 👨‍🏫 TREINADOR - Interface
 */
export interface Treinador {
  id: string;
  nome: string;
  especialidade: string;
  disponivel: boolean;
}

/**
 * 📍 LOCAL - Interface
 */
export interface Local {
  id: string;
  nome: string;
  tipo: string; // Ex: "Quadra", "Campo", "Piscina"
  capacidade: number;
}

/**
 * 🔔 NOTIFICAÇÃO - Interface
 */
export interface Notification {
  id: string;
  tipo: 'clube' | 'atleta'; // Para quem é a notificação
  categoria: 'atletas' | 'pagamentos' | 'eventos' | 'sistema' | 'mensagens' | 'desempenho' | 'ranking' | 'documentacao' | 'turmas' | 'comunicacao';
  titulo: string;
  mensagem: string;
  lida: boolean;
  timestamp: Date;
  link?: string; // Link opcional para navegar ao clicar
}

/**
 * 🏪 STORE GLOBAL - Zustand
 */
interface ClubStore {
  // Estados
  atletas: Athlete[];
  turmas: Turma[];
  clubes: Clube[];
  modalidades: Modalidade[];
  treinadores: Treinador[];
  locais: Local[];
  notificacoes: Notification[];

  // Autenticação - Estado
  currentUser: User | null;
  token: string | null;
  isAuthenticated: boolean;
  clubId: string | null;

  // Autenticação - Actions
  setCurrentUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setClubId: (clubId: string | null) => void;
  logout: () => void;

  // Atletas - Actions
  addAtleta: (atleta: Omit<Athlete, 'id' | 'dataCadastro'>) => void;
  updateAtleta: (id: string, atleta: Partial<Athlete>) => void;
  deleteAtleta: (id: string) => void;
  getAtletasByTurma: (turmaId: string) => Athlete[];

  // Turmas - Actions
  addTurma: (turma: Omit<Turma, 'id' | 'codigo' | 'dataCriacao' | 'numeroAtletas'>) => void;
  updateTurma: (id: string, turma: Partial<Turma>) => void;
  deleteTurma: (id: string) => void;
  getTurmaById: (id: string) => Turma | undefined;

  // Notificações - Actions
  markAsRead: (id: string) => void;
  markAllAsRead: (tipo: 'clube' | 'atleta') => void;
  deleteNotification: (id: string) => void;
  getUnreadCount: (tipo: 'clube' | 'atleta') => number;
  getNotificationsByType: (tipo: 'clube' | 'atleta') => Notification[];

  // Helpers
  initializeMockData: () => void;
}

/**
 * 🎯 DADOS MOCKADOS INICIAIS
 */
const MOCK_CLUBES: Clube[] = [
  { id: '1', nome: 'Esportiva FC', codigo: '483921' },
  { id: '2', nome: 'Atlético Kids', codigo: '123456' },
];

const MOCK_MODALIDADES: Modalidade[] = [
  { id: '1', nome: 'Futebol', icone: '⚽' },
  { id: '2', nome: 'Vôlei', icone: '🏐' },
  { id: '3', nome: 'Basquete', icone: '🏀' },
  { id: '4', nome: 'Natação', icone: '🏊' },
  { id: '5', nome: 'Tênis', icone: '🎾' },
];

const MOCK_TREINADORES: Treinador[] = [
  { id: '1', nome: 'Carlos Silva', especialidade: 'Futebol', disponivel: true },
  { id: '2', nome: 'Ana Santos', especialidade: 'Vôlei', disponivel: true },
  { id: '3', nome: 'Roberto Oliveira', especialidade: 'Basquete', disponivel: true },
  { id: '4', nome: 'Marina Costa', especialidade: 'Natação', disponivel: true },
  { id: '5', nome: 'Paulo Mendes', especialidade: 'Futebol', disponivel: false },
];

const MOCK_LOCAIS: Local[] = [
  { id: '1', nome: 'Campo Principal', tipo: 'Campo', capacidade: 50 },
  { id: '2', nome: 'Quadra Poliesportiva 1', tipo: 'Quadra', capacidade: 30 },
  { id: '3', nome: 'Quadra Poliesportiva 2', tipo: 'Quadra', capacidade: 30 },
  { id: '4', nome: 'Piscina Olímpica', tipo: 'Piscina', capacidade: 25 },
  { id: '5', nome: 'Quadra de Tênis', tipo: 'Quadra', capacidade: 10 },
];

const MOCK_TURMAS: Turma[] = [
  {
    id: '1',
    codigo: 'TUR-001',
    nome: 'Turma Infantil Futebol',
    horario: '14:00',
    clubeId: '1',
    modalidadeId: '1',
    treinadorId: '1',
    localId: '1',
    faixaEtaria: '8-12 anos',
    diasSemana: ['Segunda', 'Quarta', 'Sexta'],
    numeroAtletas: 15,
    ativa: true,
    dataCriacao: new Date('2024-01-15'),
  },
  {
    id: '2',
    codigo: 'TUR-002',
    nome: 'Vôlei Juvenil',
    horario: '16:00',
    clubeId: '1',
    modalidadeId: '2',
    treinadorId: '2',
    localId: '2',
    faixaEtaria: '13-17 anos',
    diasSemana: ['Terça', 'Quinta'],
    numeroAtletas: 12,
    ativa: true,
    dataCriacao: new Date('2024-02-10'),
  },
  {
    id: '3',
    codigo: 'TUR-003',
    nome: 'Natação Iniciantes',
    horario: '09:00',
    clubeId: '1',
    modalidadeId: '4',
    treinadorId: '4',
    localId: '4',
    faixaEtaria: '6-10 anos',
    diasSemana: ['Segunda', 'Quarta'],
    numeroAtletas: 8,
    ativa: true,
    dataCriacao: new Date('2024-03-05'),
  },
];

const MOCK_ATLETAS: Athlete[] = [
  {
    id: '1',
    nome: 'João Silva',
    idade: 10,
    email: 'joao.silva@email.com',
    telefone: '(11) 98765-4321',
    turmaId: '1',
    modalidade: 'Futebol',
    statusPagamento: 'em_dia',
    dataCadastro: new Date('2024-01-20'),
    ativo: true,
  },
  {
    id: '2',
    nome: 'Maria Costa',
    idade: 15,
    email: 'maria.costa@email.com',
    telefone: '(11) 98765-1234',
    turmaId: '2',
    modalidade: 'Vôlei',
    statusPagamento: 'em_dia',
    dataCadastro: new Date('2024-02-15'),
    ativo: true,
  },
  {
    id: '3',
    nome: 'Pedro Santos',
    idade: 12,
    email: 'pedro.santos@email.com',
    telefone: '(11) 98765-5678',
    turmaId: '1',
    modalidade: 'Futebol',
    statusPagamento: 'pendente',
    dataCadastro: new Date('2024-01-25'),
    ativo: true,
  },
  {
    id: '4',
    nome: 'Ana Oliveira',
    idade: 14,
    email: 'ana.oliveira@email.com',
    telefone: '(11) 98765-9012',
    turmaId: '2',
    modalidade: 'Vôlei',
    statusPagamento: 'atrasado',
    dataCadastro: new Date('2024-02-20'),
    ativo: true,
  },
  {
    id: '5',
    nome: 'Lucas Mendes',
    idade: 8,
    email: 'lucas.mendes@email.com',
    telefone: '(11) 98765-3456',
    turmaId: '3',
    modalidade: 'Natação',
    statusPagamento: 'em_dia',
    dataCadastro: new Date('2024-03-10'),
    ativo: true,
  },
  {
    id: '6',
    nome: 'Beatriz Lima',
    idade: 11,
    email: 'beatriz.lima@email.com',
    telefone: '(11) 98765-7890',
    turmaId: '1',
    modalidade: 'Futebol',
    statusPagamento: 'em_dia',
    dataCadastro: new Date('2024-01-30'),
    ativo: true,
  },
  {
    id: '7',
    nome: 'Rafael Alves',
    idade: 16,
    email: 'rafael.alves@email.com',
    telefone: '(11) 98765-2345',
    turmaId: null,
    modalidade: 'Basquete',
    statusPagamento: 'pendente',
    dataCadastro: new Date('2024-03-01'),
    ativo: true,
  },
];

const MOCK_NOTIFICACOES: Notification[] = [
  // ============ NOTIFICAÇÕES CLUBE ============
  {
    id: 'notif-1',
    tipo: 'clube',
    categoria: 'atletas',
    titulo: 'Novo Atleta Cadastrado',
    mensagem: 'Rafael Alves foi cadastrado e aguarda alocação em uma turma.',
    lida: false,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
    link: '/dashboard/athletes',
  },
  {
    id: 'notif-2',
    tipo: 'clube',
    categoria: 'pagamentos',
    titulo: 'Pagamento Atrasado',
    mensagem: 'Ana Oliveira está com pagamento em atraso há 5 dias.',
    lida: false,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 horas atrás
    link: '/dashboard/payments',
  },
  {
    id: 'notif-3',
    tipo: 'clube',
    categoria: 'documentacao',
    titulo: 'Atestado Médico Vencido',
    mensagem: '3 atletas estão com atestado médico vencido ou próximo do vencimento.',
    lida: false,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
    link: '/dashboard/athletes',
  },
  {
    id: 'notif-4',
    tipo: 'clube',
    categoria: 'atletas',
    titulo: 'Aniversariante do Dia',
    mensagem: 'Hoje é aniversário de Maria Costa (15 anos)! 🎂',
    lida: true,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 horas atrás
    link: '/dashboard/athletes',
  },
  {
    id: 'notif-5',
    tipo: 'clube',
    categoria: 'pagamentos',
    titulo: 'Pagamento Confirmado',
    mensagem: 'Beatriz Lima realizou o pagamento da mensalidade de janeiro.',
    lida: true,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
    link: '/dashboard/payments',
  },
  {
    id: 'notif-6',
    tipo: 'clube',
    categoria: 'eventos',
    titulo: 'Baixa Confirmação de Presença',
    mensagem: 'Treino de Vôlei Juvenil amanhã tem apenas 40% de confirmações.',
    lida: false,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 horas atrás
    link: '/dashboard/calendar',
  },
  {
    id: 'notif-7',
    tipo: 'clube',
    categoria: 'mensagens',
    titulo: 'Nova Mensagem no Chat',
    mensagem: 'Responsável de João Silva enviou uma mensagem.',
    lida: true,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
    link: '/dashboard/chat',
  },

  // ============ NOTIFICAÇÕES ATLETA ============
  {
    id: 'notif-8',
    tipo: 'atleta',
    categoria: 'eventos',
    titulo: 'Lembrete: Treino em 1 hora',
    mensagem: 'Seu treino de Futebol começa às 14:00 no Campo Principal.',
    lida: false,
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
    link: '/dashboard/calendar',
  },
  {
    id: 'notif-9',
    tipo: 'atleta',
    categoria: 'eventos',
    titulo: 'Novo Treino Agendado',
    mensagem: 'Treino extra de preparação física foi agendado para sexta-feira às 16h.',
    lida: false,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
    link: '/dashboard/calendar',
  },
  {
    id: 'notif-10',
    tipo: 'atleta',
    categoria: 'pagamentos',
    titulo: 'Mensalidade Próxima do Vencimento',
    mensagem: 'Sua mensalidade vence em 3 dias. Evite atrasos!',
    lida: false,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 horas atrás
    link: '/dashboard/payments',
  },
  {
    id: 'notif-11',
    tipo: 'atleta',
    categoria: 'desempenho',
    titulo: 'Nova Avaliação Disponível',
    mensagem: 'Seu treinador Carlos Silva publicou uma nova avaliação de desempenho.',
    lida: false,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
    link: '/dashboard/profile',
  },
  {
    id: 'notif-12',
    tipo: 'atleta',
    categoria: 'ranking',
    titulo: 'Subiu no Ranking!',
    mensagem: 'Parabéns! Você subiu para a 3ª posição no leaderboard da sua turma. 🏆',
    lida: true,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
    link: '/dashboard/profile',
  },
  {
    id: 'notif-13',
    tipo: 'atleta',
    categoria: 'mensagens',
    titulo: 'Mensagem do Treinador',
    mensagem: 'Carlos Silva: "Ótimo desempenho no último treino! Continue assim."',
    lida: true,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
    link: '/dashboard/chat',
  },
  {
    id: 'notif-14',
    tipo: 'atleta',
    categoria: 'eventos',
    titulo: 'Alteração de Horário',
    mensagem: 'O treino de quarta-feira foi alterado de 14h para 15h.',
    lida: true,
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 dias atrás
    link: '/dashboard/calendar',
  },
  {
    id: 'notif-15',
    tipo: 'atleta',
    categoria: 'mensagens',
    titulo: 'Anúncio do Clube',
    mensagem: 'Campeonato interno de Futebol será realizado no próximo mês!',
    lida: false,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 horas atrás
    link: '/dashboard/announcements',
  },
  {
    id: 'notif-16',
    tipo: 'atleta',
    categoria: 'documentacao',
    titulo: 'Atestado Médico Vencendo',
    mensagem: 'Seu atestado médico vence em 15 dias. Renove o quanto antes!',
    lida: false,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 horas atrás
    link: '/dashboard/profile',
  },
];

/**
 * 🏪 Criação do Store
 */
export const useClubStore = create<ClubStore>()(
  persist(
    (set, get) => ({
      // Estado Inicial
      atletas: [],
      turmas: [],
      clubes: MOCK_CLUBES,
      modalidades: MOCK_MODALIDADES,
      treinadores: MOCK_TREINADORES,
      locais: MOCK_LOCAIS,
      notificacoes: MOCK_NOTIFICACOES,

      // Autenticação
      currentUser: null,
      token: null,
      isAuthenticated: false,
      clubId: null,

      // ==================== AUTENTICAÇÃO ====================

      setCurrentUser: (user) => {
        set({ currentUser: user, isAuthenticated: user !== null });
      },

      setToken: (token) => {
        // token é sempre o access_token (JWT) vindo da sessão do Supabase
        set({ token });
      },

      setClubId: (clubId) => {
        // clubId do clube ao qual o usuário pertence (UUID vindo de GET /api/clubs)
        set({ clubId });
      },

      logout: () => {
        // Limpa apenas os dados de autenticação. Como currentUser/token/
        // isAuthenticated/clubId estão no partialize, o persist reescreve a
        // chave já sem eles — atletas e turmas permanecem intactos.
        set({ currentUser: null, token: null, isAuthenticated: false, clubId: null });
      },

      // ==================== ATLETAS ====================

      addAtleta: (atletaData) => {
        const novoAtleta: Athlete = {
          ...atletaData,
          id: `ATL-${Date.now()}`,
          dataCadastro: new Date(),
        };

        set((state) => ({
          atletas: [...state.atletas, novoAtleta],
        }));

        // Atualiza contador de atletas na turma
        if (novoAtleta.turmaId) {
          const turma = get().turmas.find((t) => t.id === novoAtleta.turmaId);
          if (turma) {
            get().updateTurma(turma.id, {
              numeroAtletas: turma.numeroAtletas + 1,
            });
          }
        }
      },

      updateAtleta: (id, atletaData) => {
        set((state) => ({
          atletas: state.atletas.map((a) =>
            a.id === id ? { ...a, ...atletaData } : a
          ),
        }));
      },

      deleteAtleta: (id) => {
        const atleta = get().atletas.find((a) => a.id === id);
        
        set((state) => ({
          atletas: state.atletas.filter((a) => a.id !== id),
        }));

        // Atualiza contador de atletas na turma
        if (atleta?.turmaId) {
          const turma = get().turmas.find((t) => t.id === atleta.turmaId);
          if (turma && turma.numeroAtletas > 0) {
            get().updateTurma(turma.id, {
              numeroAtletas: turma.numeroAtletas - 1,
            });
          }
        }
      },

      getAtletasByTurma: (turmaId) => {
        return get().atletas.filter((a) => a.turmaId === turmaId);
      },

      // ==================== TURMAS ====================

      addTurma: (turmaData) => {
        const turmaCount = get().turmas.length + 1;
        const novaTurma: Turma = {
          ...turmaData,
          id: `TUR-${Date.now()}`,
          codigo: `TUR-${String(turmaCount).padStart(3, '0')}`,
          numeroAtletas: 0,
          dataCriacao: new Date(),
        };

        set((state) => ({
          turmas: [...state.turmas, novaTurma],
        }));
      },

      updateTurma: (id, turmaData) => {
        set((state) => ({
          turmas: state.turmas.map((t) =>
            t.id === id ? { ...t, ...turmaData } : t
          ),
        }));
      },

      deleteTurma: (id) => {
        // Remove turma
        set((state) => ({
          turmas: state.turmas.filter((t) => t.id !== id),
        }));

        // Remove referência da turma dos atletas
        set((state) => ({
          atletas: state.atletas.map((a) =>
            a.turmaId === id ? { ...a, turmaId: null } : a
          ),
        }));
      },

      getTurmaById: (id) => {
        return get().turmas.find((t) => t.id === id);
      },

      // ==================== NOTIFICAÇÕES ====================

      markAsRead: (id) => {
        set((state) => ({
          notificacoes: state.notificacoes.map((n) =>
            n.id === id ? { ...n, lida: true } : n
          ),
        }));
      },

      markAllAsRead: (tipo) => {
        set((state) => ({
          notificacoes: state.notificacoes.map((n) =>
            n.tipo === tipo ? { ...n, lida: true } : n
          ),
        }));
      },

      deleteNotification: (id) => {
        set((state) => ({
          notificacoes: state.notificacoes.filter((n) => n.id !== id),
        }));
      },

      getUnreadCount: (tipo) => {
        return get().notificacoes.filter((n) => n.tipo === tipo && !n.lida).length;
      },

      getNotificationsByType: (tipo) => {
        return get().notificacoes.filter((n) => n.tipo === tipo);
      },

      // ==================== HELPERS ====================

      initializeMockData: () => {
        // Inicializa apenas se estiver vazio
        if (get().atletas.length === 0 && get().turmas.length === 0) {
          set({
            atletas: MOCK_ATLETAS,
            turmas: MOCK_TURMAS,
          });
        }
      },
    }),
    {
      name: 'esportiva-club-storage', // Nome no localStorage
      partialize: (state) => ({
        atletas: state.atletas,
        turmas: state.turmas,
        currentUser: state.currentUser,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        clubId: state.clubId,
      }), // Persiste atletas, turmas e dados de autenticação
    }
  )
);