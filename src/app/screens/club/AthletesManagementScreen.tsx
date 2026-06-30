import { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Filter,
  User,
  Mail,
  Phone,
  Calendar,
  Award,
  DollarSign,
} from 'lucide-react';
import { useClubStore } from '../../stores/clubStore';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { Slider } from '../../components/ui/slider';

/**
 * 🏃‍♂️ TELA DE GERENCIAMENTO DE ATLETAS
 * 
 * Funcionalidades:
 * - Visualizar todos os atletas
 * - Buscar por nome com debounce
 * - Filtrar por idade (range), modalidade, turma
 * - Adicionar novo atleta
 * - Editar atleta existente
 * - Excluir atleta
 * - Ver status de pagamento
 */
export default function AthletesManagementScreen() {
  const {
    atletas,
    turmas,
    modalidades,
    addAtleta,
    updateAtleta,
    deleteAtleta,
    initializeMockData,
  } = useClubStore();

  // Inicializa dados mockados
  useEffect(() => {
    initializeMockData();
  }, [initializeMockData]);

  // Estados
  const [searchQuery, setSearchQuery] = useState('');
  const [filterIdadeMin, setFilterIdadeMin] = useState(0);
  const [filterIdadeMax, setFilterIdadeMax] = useState(18);
  const [filterModalidade, setFilterModalidade] = useState<string>('all');
  const [filterTurma, setFilterTurma] = useState<string>('all');
  const [filterPagamento, setFilterPagamento] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAtleta, setEditingAtleta] = useState<string | null>(null);

  // Estado do formulário
  const [formData, setFormData] = useState({
    nome: '',
    idade: '',
    email: '',
    telefone: '',
    turmaId: null as string | null,
    modalidade: '',
    statusPagamento: 'em_dia' as 'em_dia' | 'pendente' | 'atrasado',
    ativo: true,
  });

  /**
   * Filtrar e buscar atletas
   */
  const atletasFiltrados = useMemo(() => {
    return atletas.filter((atleta) => {
      const matchSearch = atleta.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        atleta.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchIdade = atleta.idade >= filterIdadeMin && atleta.idade <= filterIdadeMax;
      const matchModalidade = filterModalidade === 'all' || atleta.modalidade === filterModalidade;
      const matchTurma = filterTurma === 'all' || 
        (filterTurma === 'sem_turma' ? atleta.turmaId === null : atleta.turmaId === filterTurma);
      const matchPagamento = filterPagamento === 'all' || atleta.statusPagamento === filterPagamento;

      return matchSearch && matchIdade && matchModalidade && matchTurma && matchPagamento;
    });
  }, [atletas, searchQuery, filterIdadeMin, filterIdadeMax, filterModalidade, filterTurma, filterPagamento]);

  /**
   * Estatísticas
   */
  const stats = useMemo(() => {
    return {
      total: atletasFiltrados.length,
      emDia: atletasFiltrados.filter((a) => a.statusPagamento === 'em_dia').length,
      pendente: atletasFiltrados.filter((a) => a.statusPagamento === 'pendente').length,
      atrasado: atletasFiltrados.filter((a) => a.statusPagamento === 'atrasado').length,
    };
  }, [atletasFiltrados]);

  /**
   * Abrir modal para criar novo atleta
   */
  const handleOpenCreateModal = () => {
    setEditingAtleta(null);
    setFormData({
      nome: '',
      idade: '',
      email: '',
      telefone: '',
      turmaId: null,
      modalidade: '',
      statusPagamento: 'em_dia',
      ativo: true,
    });
    setIsModalOpen(true);
  };

  /**
   * Abrir modal para editar atleta
   */
  const handleOpenEditModal = (atletaId: string) => {
    const atleta = atletas.find((a) => a.id === atletaId);
    if (!atleta) return;

    setEditingAtleta(atletaId);
    setFormData({
      nome: atleta.nome,
      idade: String(atleta.idade),
      email: atleta.email,
      telefone: atleta.telefone,
      turmaId: atleta.turmaId,
      modalidade: atleta.modalidade,
      statusPagamento: atleta.statusPagamento,
      ativo: atleta.ativo,
    });
    setIsModalOpen(true);
  };

  /**
   * Salvar atleta (criar ou editar)
   */
  const handleSaveAtleta = () => {
    if (!formData.nome || !formData.idade || !formData.email) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const atletaData = {
      ...formData,
      idade: parseInt(formData.idade),
    };

    if (editingAtleta) {
      // Editar atleta existente
      updateAtleta(editingAtleta, atletaData);
    } else {
      // Criar novo atleta
      addAtleta(atletaData);
    }

    setIsModalOpen(false);
  };

  /**
   * Excluir atleta
   */
  const handleDeleteAtleta = (atletaId: string) => {
    if (confirm('Tem certeza que deseja excluir este atleta?')) {
      deleteAtleta(atletaId);
    }
  };

  /**
   * Pegar nome da turma
   */
  const getTurmaNome = (turmaId: string | null) => {
    if (!turmaId) return 'Sem turma';
    return turmas.find((t) => t.id === turmaId)?.nome || 'N/A';
  };

  /**
   * Badge de status de pagamento
   */
  const getStatusBadge = (status: string) => {
    const variants = {
      em_dia: { label: 'Em dia', className: 'bg-green-100 text-green-800' },
      pendente: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
      atrasado: { label: 'Atrasado', className: 'bg-red-100 text-red-800' },
    };
    const variant = variants[status as keyof typeof variants] || variants.pendente;
    return (
      <Badge className={variant.className} variant="outline">
        {variant.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="p-6 pt-12"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Gerenciamento de Atletas</h1>
            <p className="text-gray-600 text-sm mt-1">
              {stats.total} {stats.total === 1 ? 'atleta encontrado' : 'atletas encontrados'}
            </p>
          </div>
          <Button
            onClick={handleOpenCreateModal}
            className="bg-black text-white hover:bg-gray-800"
          >
            <Plus size={18} className="mr-2" />
            Novo Atleta
          </Button>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
            <div className="text-2xl font-bold text-green-700">{stats.emDia}</div>
            <div className="text-xs text-gray-600">Em dia</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
            <div className="text-2xl font-bold text-yellow-700">{stats.pendente}</div>
            <div className="text-xs text-gray-600">Pendente</div>
          </div>
          <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
            <div className="text-2xl font-bold text-red-700">{stats.atrasado}</div>
            <div className="text-xs text-gray-600">Atrasado</div>
          </div>
        </div>

        {/* Busca */}
        <div className="relative mb-4">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtros */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={16} />
            <span className="font-semibold text-sm">Filtros</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Faixa Etária */}
            <div>
              <Label className="text-xs mb-2">
                Idade: {filterIdadeMin} - {filterIdadeMax} anos
              </Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  min={0}
                  max={18}
                  value={filterIdadeMin}
                  onChange={(e) => setFilterIdadeMin(Number(e.target.value))}
                  className="w-20"
                />
                <span className="text-gray-400">-</span>
                <Input
                  type="number"
                  min={0}
                  max={18}
                  value={filterIdadeMax}
                  onChange={(e) => setFilterIdadeMax(Number(e.target.value))}
                  className="w-20"
                />
              </div>
            </div>

            {/* Modalidade */}
            <div>
              <Label className="text-xs mb-2">Modalidade</Label>
              <Select value={filterModalidade} onValueChange={setFilterModalidade}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {modalidades.map((mod) => (
                    <SelectItem key={mod.id} value={mod.nome}>
                      {mod.icone} {mod.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Turma */}
            <div>
              <Label className="text-xs mb-2">Turma</Label>
              <Select value={filterTurma} onValueChange={setFilterTurma}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="sem_turma">Sem turma</SelectItem>
                  {turmas.map((turma) => (
                    <SelectItem key={turma.id} value={turma.id}>
                      {turma.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Pagamento */}
            <div>
              <Label className="text-xs mb-2">Status Pagamento</Label>
              <Select value={filterPagamento} onValueChange={setFilterPagamento}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="em_dia">Em dia</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="atrasado">Atrasado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Lista de Atletas */}
        <div className="space-y-3">
          {atletasFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">Nenhum atleta encontrado</div>
              <Button onClick={handleOpenCreateModal} variant="outline">
                <Plus size={16} className="mr-2" />
                Adicionar primeiro atleta
              </Button>
            </div>
          ) : (
            atletasFiltrados.map((atleta, index) => (
              <motion.div
                key={atleta.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold">
                      {atleta.nome.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{atleta.nome}</h3>
                        <Badge variant="outline" className="text-xs">
                          {atleta.idade} anos
                        </Badge>
                        {getStatusBadge(atleta.statusPagamento)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {atleta.modalidade} • {getTurmaNome(atleta.turmaId)}
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpenEditModal(atleta.id)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteAtleta(atleta.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>

                {/* Detalhes */}
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail size={14} />
                    <span>{atleta.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} />
                    <span>{atleta.telefone}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Modal de Criar/Editar Atleta */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAtleta ? 'Editar Atleta' : 'Novo Atleta'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Nome */}
            <div>
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: João Silva"
              />
            </div>

            {/* Idade */}
            <div>
              <Label htmlFor="idade">Idade *</Label>
              <Input
                id="idade"
                type="number"
                min="4"
                max="99"
                value={formData.idade}
                onChange={(e) => setFormData({ ...formData, idade: e.target.value })}
                placeholder="Ex: 12"
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Ex: joao@email.com"
              />
            </div>

            {/* Telefone */}
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                type="tel"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="Ex: (11) 98765-4321"
              />
            </div>

            {/* Modalidade */}
            <div>
              <Label htmlFor="modalidade">Modalidade *</Label>
              <Select
                value={formData.modalidade}
                onValueChange={(value) => setFormData({ ...formData, modalidade: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a modalidade" />
                </SelectTrigger>
                <SelectContent>
                  {modalidades.map((mod) => (
                    <SelectItem key={mod.id} value={mod.nome}>
                      {mod.icone} {mod.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Turma */}
            <div>
              <Label htmlFor="turma">Turma</Label>
              <Select
                value={formData.turmaId || 'none'}
                onValueChange={(value) =>
                  setFormData({ ...formData, turmaId: value === 'none' ? null : value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a turma (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem turma</SelectItem>
                  {turmas
                    .filter((t) => t.ativa)
                    .map((turma) => (
                      <SelectItem key={turma.id} value={turma.id}>
                        {turma.nome} ({turma.horario})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Pagamento */}
            <div>
              <Label htmlFor="statusPagamento">Status de Pagamento</Label>
              <Select
                value={formData.statusPagamento}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, statusPagamento: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="em_dia">Em dia</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="atrasado">Atrasado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveAtleta} className="bg-black text-white hover:bg-gray-800">
              {editingAtleta ? 'Salvar Alterações' : 'Adicionar Atleta'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
