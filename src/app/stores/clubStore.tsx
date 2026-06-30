import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

/**
 * 🏪 CONTEXT - Interface do Store
 */
interface ClubStoreContext {
  // Estados
  atletas: Athlete[];
  turmas: Turma[];
  clubes: Clube[];
  modalidades: Modalidade[];
  treinadores: Treinador[];
  locais: Local[];

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

  // Helpers
  initializeMockData: () => void;
}

const ClubStoreContext = createContext<ClubStoreContext | undefined>(undefined);

/**
 * 🏪 PROVIDER - Gerenciamento de Estado
 */
export function ClubStoreProvider({ children }: { children: ReactNode }) {
  const [atletas, setAtletas] = useState<Athlete[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [clubes] = useState<Clube[]>(MOCK_CLUBES);
  const [modalidades] = useState<Modalidade[]>(MOCK_MODALIDADES);
  const [treinadores] = useState<Treinador[]>(MOCK_TREINADORES);
  const [locais] = useState<Local[]>(MOCK_LOCAIS);

  // Carregar dados do localStorage
  useEffect(() => {
    const savedAtletas = localStorage.getItem('esportiva-atletas');
    const savedTurmas = localStorage.getItem('esportiva-turmas');

    if (savedAtletas) {
      setAtletas(JSON.parse(savedAtletas));
    } else {
      setAtletas(MOCK_ATLETAS);
    }

    if (savedTurmas) {
      const parsed = JSON.parse(savedTurmas);
      // Converter strings de data para objetos Date
      const turmasComDatas = parsed.map((t: any) => ({
        ...t,
        dataCriacao: new Date(t.dataCriacao),
      }));
      setTurmas(turmasComDatas);
    } else {
      setTurmas(MOCK_TURMAS);
    }
  }, []);

  // Salvar atletas no localStorage
  useEffect(() => {
    if (atletas.length > 0) {
      localStorage.setItem('esportiva-atletas', JSON.stringify(atletas));
    }
  }, [atletas]);

  // Salvar turmas no localStorage
  useEffect(() => {
    if (turmas.length > 0) {
      localStorage.setItem('esportiva-turmas', JSON.stringify(turmas));
    }
  }, [turmas]);

  // ==================== ATLETAS ====================

  const addAtleta = (atletaData: Omit<Athlete, 'id' | 'dataCadastro'>) => {
    const novoAtleta: Athlete = {
      ...atletaData,
      id: `ATL-${Date.now()}`,
      dataCadastro: new Date(),
    };

    setAtletas((prev) => [...prev, novoAtleta]);

    // Atualiza contador de atletas na turma
    if (novoAtleta.turmaId) {
      const turma = turmas.find((t) => t.id === novoAtleta.turmaId);
      if (turma) {
        updateTurma(turma.id, {
          numeroAtletas: turma.numeroAtletas + 1,
        });
      }
    }
  };

  const updateAtleta = (id: string, atletaData: Partial<Athlete>) => {
    setAtletas((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...atletaData } : a))
    );
  };

  const deleteAtleta = (id: string) => {
    const atleta = atletas.find((a) => a.id === id);

    setAtletas((prev) => prev.filter((a) => a.id !== id));

    // Atualiza contador de atletas na turma
    if (atleta?.turmaId) {
      const turma = turmas.find((t) => t.id === atleta.turmaId);
      if (turma && turma.numeroAtletas > 0) {
        updateTurma(turma.id, {
          numeroAtletas: turma.numeroAtletas - 1,
        });
      }
    }
  };

  const getAtletasByTurma = (turmaId: string) => {
    return atletas.filter((a) => a.turmaId === turmaId);
  };

  // ==================== TURMAS ====================

  const addTurma = (turmaData: Omit<Turma, 'id' | 'codigo' | 'dataCriacao' | 'numeroAtletas'>) => {
    const turmaCount = turmas.length + 1;
    const novaTurma: Turma = {
      ...turmaData,
      id: `TUR-${Date.now()}`,
      codigo: `TUR-${String(turmaCount).padStart(3, '0')}`,
      numeroAtletas: 0,
      dataCriacao: new Date(),
    };

    setTurmas((prev) => [...prev, novaTurma]);
  };

  const updateTurma = (id: string, turmaData: Partial<Turma>) => {
    setTurmas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...turmaData } : t))
    );
  };

  const deleteTurma = (id: string) => {
    setTurmas((prev) => prev.filter((t) => t.id !== id));

    // Remove referência da turma dos atletas
    setAtletas((prev) =>
      prev.map((a) => (a.turmaId === id ? { ...a, turmaId: null } : a))
    );
  };

  const getTurmaById = (id: string) => {
    return turmas.find((t) => t.id === id);
  };

  // ==================== HELPERS ====================

  const initializeMockData = () => {
    // Já inicializado no useEffect
  };

  const value: ClubStoreContext = {
    atletas,
    turmas,
    clubes,
    modalidades,
    treinadores,
    locais,
    addAtleta,
    updateAtleta,
    deleteAtleta,
    getAtletasByTurma,
    addTurma,
    updateTurma,
    deleteTurma,
    getTurmaById,
    initializeMockData,
  };

  return (
    <ClubStoreContext.Provider value={value}>
      {children}
    </ClubStoreContext.Provider>
  );
}

/**
 * 🪝 Hook para usar o ClubStore
 */
export function useClubStore() {
  const context = useContext(ClubStoreContext);
  if (!context) {
    throw new Error('useClubStore must be used within ClubStoreProvider');
  }
  return context;
}
