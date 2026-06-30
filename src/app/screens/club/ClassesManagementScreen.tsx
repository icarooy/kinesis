import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  Clock,
  MapPin,
  X,
  Calendar as CalendarIcon,
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

/**
 * 🏫 TELA DE GERENCIAMENTO DE TURMAS
 * 
 * Funcionalidades:
 * - Visualizar todas as turmas cadastradas
 * - Criar nova turma com campos do DER
 * - Editar turmas existentes
 * - Excluir turmas
 * - Visualizar número de atletas por turma
 * - Busca e filtros
 */
export default function ClassesManagementScreen() {
  const {
    turmas,
    clubes,
    modalidades,
    treinadores,
    locais,
    addTurma,
    updateTurma,
    deleteTurma,
    initializeMockData,
  } = useClubStore();

  // Inicializa dados mockados
  useEffect(() => {
    initializeMockData();
  }, [initializeMockData]);

  // Estados
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalidade, setFilterModalidade] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTurma, setEditingTurma] = useState<string | null>(null);

  // Estado do formulário
  const [formData, setFormData] = useState({
    nome: '',
    horario: '',
    clubeId: clubes[0]?.id || '',
    modalidadeId: '',
    treinadorId: '',
    localId: '',
    faixaEtaria: '',
    diasSemana: [] as string[],
    ativa: true,
  });

  // Dias da semana disponíveis
  const diasDisponiveis = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  /**
   * Filtrar e buscar turmas
   */
  const turmasFiltradas = useMemo(() => {
    return turmas.filter((turma) => {
      const matchSearch = turma.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        turma.codigo.toLowerCase().includes(searchQuery.toLowerCase());
      const matchModalidade = filterModalidade === 'all' || turma.modalidadeId === filterModalidade;

      return matchSearch && matchModalidade;
    });
  }, [turmas, searchQuery, filterModalidade]);

  /**
   * Abrir modal para criar nova turma
   */
  const handleOpenCreateModal = () => {
    setEditingTurma(null);
    setFormData({
      nome: '',
      horario: '',
      clubeId: clubes[0]?.id || '',
      modalidadeId: '',
      treinadorId: '',
      localId: '',
      faixaEtaria: '',
      diasSemana: [],
      ativa: true,
    });
    setIsModalOpen(true);
  };

  /**
   * Abrir modal para editar turma
   */
  const handleOpenEditModal = (turmaId: string) => {
    const turma = turmas.find((t) => t.id === turmaId);
    if (!turma) return;

    setEditingTurma(turmaId);
    setFormData({
      nome: turma.nome,
      horario: turma.horario,
      clubeId: turma.clubeId,
      modalidadeId: turma.modalidadeId,
      treinadorId: turma.treinadorId,
      localId: turma.localId,
      faixaEtaria: turma.faixaEtaria,
      diasSemana: turma.diasSemana,
      ativa: turma.ativa,
    });
    setIsModalOpen(true);
  };

  /**
   * Salvar turma (criar ou editar)
   */
  const handleSaveTurma = () => {
    if (!formData.nome || !formData.modalidadeId || !formData.treinadorId || !formData.localId) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (editingTurma) {
      // Editar turma existente
      updateTurma(editingTurma, formData);
    } else {
      // Criar nova turma
      addTurma(formData);
    }

    setIsModalOpen(false);
  };

  /**
   * Excluir turma
   */
  const handleDeleteTurma = (turmaId: string) => {
    if (confirm('Tem certeza que deseja excluir esta turma? Os atletas serão desvinculados.')) {
      deleteTurma(turmaId);
    }
  };

  /**
   * Toggle dia da semana
   */
  const toggleDiaSemana = (dia: string) => {
    setFormData((prev) => ({
      ...prev,
      diasSemana: prev.diasSemana.includes(dia)
        ? prev.diasSemana.filter((d) => d !== dia)
        : [...prev.diasSemana, dia],
    }));
  };

  /**
   * Pegar nome de relacionamentos
   */
  const getModalidadeNome = (id: string) => modalidades.find((m) => m.id === id)?.nome || 'N/A';
  const getTreinadorNome = (id: string) => treinadores.find((t) => t.id === id)?.nome || 'N/A';
  const getLocalNome = (id: string) => locais.find((l) => l.id === id)?.nome || 'N/A';

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
            <h1 className="text-2xl font-bold">Gerenciamento de Turmas</h1>
            <p className="text-gray-600 text-sm mt-1">
              {turmas.length} {turmas.length === 1 ? 'turma cadastrada' : 'turmas cadastradas'}
            </p>
          </div>
          <Button
            onClick={handleOpenCreateModal}
            className="bg-black text-white hover:bg-gray-800"
          >
            <Plus size={18} className="mr-2" />
            Nova Turma
          </Button>
        </div>

        {/* Filtros e Busca */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {/* Busca */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por nome ou código..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtro por Modalidade */}
          <Select value={filterModalidade} onValueChange={setFilterModalidade}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por modalidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Modalidades</SelectItem>
              {modalidades.map((mod) => (
                <SelectItem key={mod.id} value={mod.id}>
                  {mod.icone} {mod.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Lista de Turmas */}
        <div className="space-y-3">
          {turmasFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">Nenhuma turma encontrada</div>
              <Button onClick={handleOpenCreateModal} variant="outline">
                <Plus size={16} className="mr-2" />
                Criar primeira turma
              </Button>
            </div>
          ) : (
            turmasFiltradas.map((turma, index) => (
              <motion.div
                key={turma.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{turma.nome}</h3>
                      <Badge variant="outline" className="text-xs">
                        {turma.codigo}
                      </Badge>
                      {!turma.ativa && (
                        <Badge variant="secondary" className="text-xs">
                          Inativa
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {getModalidadeNome(turma.modalidadeId)}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpenEditModal(turma.id)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteTurma(turma.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>

                {/* Informações */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={14} />
                    <span>{turma.horario}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users size={14} />
                    <span>{turma.numeroAtletas} atletas</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={14} />
                    <span>{getLocalNome(turma.localId)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CalendarIcon size={14} />
                    <span>{turma.diasSemana.length} dias/semana</span>
                  </div>
                </div>

                {/* Treinador e Faixa Etária */}
                <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>👨‍🏫 {getTreinadorNome(turma.treinadorId)}</span>
                    <span>👶 {turma.faixaEtaria}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Modal de Criar/Editar Turma */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTurma ? 'Editar Turma' : 'Nova Turma'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Nome da Turma */}
            <div>
              <Label htmlFor="nome">Nome da Turma *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Turma Infantil Futebol"
              />
            </div>

            {/* Horário */}
            <div>
              <Label htmlFor="horario">Horário das Aulas *</Label>
              <Input
                id="horario"
                type="time"
                value={formData.horario}
                onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
              />
            </div>

            {/* Clube (Dropdown) */}
            <div>
              <Label htmlFor="clube">Clube *</Label>
              <Select
                value={formData.clubeId}
                onValueChange={(value) => setFormData({ ...formData, clubeId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o clube" />
                </SelectTrigger>
                <SelectContent>
                  {clubes.map((clube) => (
                    <SelectItem key={clube.id} value={clube.id}>
                      {clube.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Modalidade (Dropdown) */}
            <div>
              <Label htmlFor="modalidade">Modalidade *</Label>
              <Select
                value={formData.modalidadeId}
                onValueChange={(value) => setFormData({ ...formData, modalidadeId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a modalidade" />
                </SelectTrigger>
                <SelectContent>
                  {modalidades.map((mod) => (
                    <SelectItem key={mod.id} value={mod.id}>
                      {mod.icone} {mod.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Treinador (Dropdown) */}
            <div>
              <Label htmlFor="treinador">Treinador *</Label>
              <Select
                value={formData.treinadorId}
                onValueChange={(value) => setFormData({ ...formData, treinadorId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o treinador" />
                </SelectTrigger>
                <SelectContent>
                  {treinadores
                    .filter((t) => t.disponivel)
                    .map((treinador) => (
                      <SelectItem key={treinador.id} value={treinador.id}>
                        {treinador.nome} - {treinador.especialidade}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Local (Dropdown) */}
            <div>
              <Label htmlFor="local">Local *</Label>
              <Select
                value={formData.localId}
                onValueChange={(value) => setFormData({ ...formData, localId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o local" />
                </SelectTrigger>
                <SelectContent>
                  {locais.map((local) => (
                    <SelectItem key={local.id} value={local.id}>
                      {local.nome} ({local.tipo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Faixa Etária */}
            <div>
              <Label htmlFor="faixaEtaria">Faixa Etária</Label>
              <Input
                id="faixaEtaria"
                value={formData.faixaEtaria}
                onChange={(e) => setFormData({ ...formData, faixaEtaria: e.target.value })}
                placeholder="Ex: 8-12 anos"
              />
            </div>

            {/* Dias da Semana */}
            <div>
              <Label>Dias da Semana</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {diasDisponiveis.map((dia) => (
                  <Button
                    key={dia}
                    type="button"
                    variant={formData.diasSemana.includes(dia) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleDiaSemana(dia)}
                    className={formData.diasSemana.includes(dia) ? 'bg-black' : ''}
                  >
                    {dia.slice(0, 3)}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveTurma} className="bg-black text-white hover:bg-gray-800">
              {editingTurma ? 'Salvar Alterações' : 'Criar Turma'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
