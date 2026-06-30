import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { Team } from '../../types';

interface CreateChargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (charge: {
    title: string;
    description: string;
    amount: number;
    dueDate: Date;
    teamId?: string;
  }) => void;
  teams: Team[];
}

export function CreateChargeModal({ isOpen, onClose, onSubmit, teams }: CreateChargeModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');

  const handleSubmit = () => {
    if (title && amount && dueDate) {
      onSubmit({
        title,
        description,
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        teamId: selectedTeam || undefined,
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setAmount('');
      setDueDate('');
      setSelectedTeam('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-white rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="font-semibold">Nova Cobrança</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X size={20} />
              </Button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Mensalidade Dezembro"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-black transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalhes da cobrança (opcional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-black transition-colors resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Valor (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-black transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Data de Vencimento *</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-black transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Turma (opcional)</label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-black transition-colors"
                >
                  <option value="">Todas as turmas</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name} - {team.sport}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Se não selecionar uma turma, a cobrança será individual
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 sticky bottom-0 bg-white">
              <Button 
                onClick={handleSubmit}
                disabled={!title || !amount || !dueDate}
                className="w-full bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500"
              >
                Criar Cobrança
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
