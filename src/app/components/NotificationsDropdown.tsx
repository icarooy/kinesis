import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, UserPlus, Calendar, DollarSign, AlertCircle, CheckCircle, MessageSquare, TrendingUp, Award, FileText, Users } from 'lucide-react';
import { useClubStore, Notification } from '../stores/clubStore';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 🔔 NOTIFICAÇÕES DROPDOWN - PAINEL SUPERIOR
 * 
 * Como funciona a visualização:
 * 
 * 1. **Ao clicar em uma notificação:**
 *    - Marca como lida automaticamente
 *    - Se tiver link, navega para a tela relacionada e fecha o painel
 *    - Se não tiver link, apenas marca como lida
 * 
 * 2. **Indicadores visuais:**
 *    - Não lida: ícone fundo preto + ponto preto + fundo cinza claro
 *    - Lida: ícone fundo cinza + sem ponto + fundo branco
 * 
 * 3. **Formas de fechar:**
 *    - Botão X no header
 *    - Botão "Fechar" no footer
 *    - Clicar fora (backdrop)
 *    - Tecla ESC
 * 
 * 4. **Navegação automática:**
 *    - Clube: /dashboard/athletes, /dashboard/payments, /dashboard/calendar, /dashboard/chat
 *    - Atleta: /dashboard/calendar, /dashboard/payments, /dashboard/profile, /dashboard/chat
 */

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tipo: 'clube' | 'atleta';
}

// Ícones por categoria - monocromático
const categoryIcons: Record<string, any> = {
  atletas: UserPlus,
  pagamentos: DollarSign,
  eventos: Calendar,
  sistema: AlertCircle,
  mensagens: MessageSquare,
  desempenho: TrendingUp,
  ranking: Award,
  documentacao: FileText,
  turmas: Users,
  comunicacao: Bell,
};

export default function NotificationsDropdown({ isOpen, onClose, tipo }: Props) {
  const navigate = useNavigate();
  
  const { 
    getNotificationsByType, 
    markAsRead,
    getUnreadCount 
  } = useClubStore();

  const notifications = getNotificationsByType(tipo)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 8); // Mostra as 8 mais recentes
  
  const unreadCount = getUnreadCount(tipo);

  // Fecha ao pressionar ESC
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Previne scroll do body quando aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const handleNotificationClick = (notif: Notification) => {
    // Marca como lida
    if (!notif.lida) {
      markAsRead(notif.id);
    }
    
    // Se tiver link, navega e fecha o dropdown
    if (notif.link) {
      navigate(notif.link);
      onClose();
    }
  };

  const getIcon = (categoria: string) => {
    const IconComponent = categoryIcons[categoria] || Bell;
    return IconComponent;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - mais sutil */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
          />

          {/* Card flutuante com bordas arredondadas */}
          <motion.div
            initial={{ y: -20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-[95%] max-w-lg bg-white z-50 rounded-3xl shadow-2xl max-h-[75vh] flex flex-col overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="bg-black text-white px-6 py-4 flex items-center justify-between rounded-t-3xl">
              <div className="flex items-center gap-3">
                <Bell size={22} strokeWidth={2.5} />
                <div>
                  <h3 className="font-bold text-lg">Notificações</h3>
                  {unreadCount > 0 && (
                    <p className="text-xs text-gray-300">
                      {unreadCount} nova{unreadCount > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            {/* Lista de notificações */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-gray-400">
                  <Bell size={48} className="mb-4 opacity-20" strokeWidth={1.5} />
                  <p className="font-semibold text-gray-500">Nenhuma notificação</p>
                  <p className="text-sm text-gray-400 mt-1">Você está em dia!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notif) => {
                    const Icon = getIcon(notif.categoria);
                    
                    return (
                      <motion.button
                        key={notif.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => handleNotificationClick(notif)}
                        className={`
                          w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors relative
                          ${!notif.lida ? 'bg-gray-50/70' : ''}
                        `}
                      >
                        <div className="flex gap-4">
                          {/* Ícone */}
                          <div className={`
                            flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
                            ${!notif.lida ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'}
                          `}>
                            <Icon size={18} strokeWidth={2} />
                          </div>

                          {/* Conteúdo */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <p className={`text-sm leading-snug ${!notif.lida ? 'font-bold text-black' : 'font-semibold text-gray-700'}`}>
                                {notif.titulo}
                              </p>
                              {/* Indicador de não lida */}
                              {!notif.lida && (
                                <div className="flex-shrink-0 w-2 h-2 bg-black rounded-full mt-1.5" />
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {notif.mensagem}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {formatDistanceToNow(notif.timestamp, { 
                                addSuffix: true, 
                                locale: ptBR 
                              })}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 rounded-b-3xl">
                <button 
                  onClick={onClose}
                  className="w-full text-center text-sm font-semibold text-black hover:text-gray-600 transition-colors py-2"
                >
                  Fechar
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}