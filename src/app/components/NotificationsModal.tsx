import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Trash2, Bell, UserPlus, AlertCircle, FileText, Cake, CheckCircle, Users, MessageSquare, Clock, Calendar, DollarSign, TrendingUp, Award, MessageCircle, AlertTriangle, Megaphone, FileWarning } from 'lucide-react';
import { useClubStore, Notification } from '../stores/clubStore';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tipo: 'clube' | 'atleta';
}

// Mapa de ícones Lucide
const IconMap: Record<string, any> = {
  Bell,
  UserPlus,
  AlertCircle,
  FileText,
  Cake,
  CheckCircle,
  Users,
  MessageSquare,
  Clock,
  Calendar,
  DollarSign,
  TrendingUp,
  Award,
  MessageCircle,
  AlertTriangle,
  Megaphone,
  FileWarning,
};

// Cores das categorias
const categoryColors: Record<string, string> = {
  gestao: 'bg-blue-500',
  financeiro: 'bg-green-500',
  treino: 'bg-purple-500',
  comunicacao: 'bg-orange-500',
  desempenho: 'bg-yellow-500',
  documentacao: 'bg-red-500',
};

export default function NotificationsModal({ isOpen, onClose, tipo }: Props) {
  const [filter, setFilter] = useState<'todas' | 'nao_lidas' | 'lidas'>('todas');
  
  const { 
    getNotificationsByType, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    getUnreadCount 
  } = useClubStore();

  const allNotifications = getNotificationsByType(tipo);
  const unreadCount = getUnreadCount(tipo);

  // Filtra notificações
  const filteredNotifications = allNotifications.filter((notif) => {
    if (filter === 'nao_lidas') return !notif.lida;
    if (filter === 'lidas') return notif.lida;
    return true;
  }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const handleDelete = (id: string) => {
    deleteNotification(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead(tipo);
  };

  const getIcon = (iconName: string) => {
    const Icon = IconMap[iconName];
    return Icon ? <Icon size={20} /> : <Bell size={20} />;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="bg-white w-full md:max-w-2xl md:rounded-2xl rounded-t-3xl max-h-[90vh] flex flex-col shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl md:rounded-t-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                  <Bell size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Notificações</h2>
                  {unreadCount > 0 && (
                    <p className="text-sm text-gray-600">
                      {unreadCount} {unreadCount === 1 ? 'nova' : 'novas'}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Filtros */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('todas')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'todas'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todas ({allNotifications.length})
              </button>
              <button
                onClick={() => setFilter('nao_lidas')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'nao_lidas'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Não lidas ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('lidas')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'lidas'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Lidas ({allNotifications.length - unreadCount})
              </button>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Bell size={48} className="mb-4 opacity-50" />
                <p className="text-lg font-medium">Nenhuma notificação</p>
                <p className="text-sm">
                  {filter === 'nao_lidas' && 'Você não tem notificações não lidas'}
                  {filter === 'lidas' && 'Você não tem notificações lidas'}
                  {filter === 'todas' && 'Você não tem notificações'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      notif.lida
                        ? 'bg-white border-gray-200'
                        : 'bg-gray-50 border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Ícone */}
                      <div className={`w-10 h-10 ${categoryColors[notif.categoria]} rounded-xl flex items-center justify-center flex-shrink-0 text-white`}>
                        {getIcon(notif.icone)}
                      </div>

                      {/* Conteúdo */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className={`font-semibold ${!notif.lida && 'text-black'}`}>
                            {notif.titulo}
                          </h3>
                          {!notif.lida && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notif.mensagem}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-400">
                            {formatDistanceToNow(notif.timestamp, {
                              addSuffix: true,
                              locale: ptBR,
                            })}
                          </p>
                          <div className="flex items-center gap-2">
                            {!notif.lida && (
                              <button
                                onClick={() => handleMarkAsRead(notif.id)}
                                className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                                title="Marcar como lida"
                              >
                                <Check size={16} className="text-green-600" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(notif.id)}
                              className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                              title="Excluir"
                            >
                              <Trash2 size={16} className="text-red-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {unreadCount > 0 && (
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
              <button
                onClick={handleMarkAllAsRead}
                className="w-full py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <Check size={20} />
                Marcar todas como lida
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}