import { motion } from 'motion/react';
import { Users, TrendingUp, Calendar as CalendarIcon, Award, Plus, DollarSign, Bell } from 'lucide-react';
import { useAppData } from '../../contexts/AppDataContext';
import { useMemo, useState } from 'react';
import { isToday, isTomorrow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useClubStore } from '../../stores/clubStore';
import NotificationsDropdown from '../../components/NotificationsDropdown';
import { MiniCalendar } from '../../components/MiniCalendar';

export default function ClubHomeScreen() {
  const { events, payments, teams, leaderboard } = useAppData();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const getUnreadCount = useClubStore((state) => state.getUnreadCount);

  // Calculate real stats
  const stats = useMemo(() => {
    const totalAthletes = leaderboard.length;
    const upcomingEvents = events.filter(e => e.date >= new Date()).length;
    const pendingPayments = payments.filter(p => p.status === 'pending').length;
    
    return {
      totalAthletes,
      totalTeams: teams.length,
      upcomingEvents,
      pendingPayments,
    };
  }, [events, payments, teams, leaderboard]);

  // Get next events
  const nextEvents = useMemo(() => {
    return events
      .filter(e => e.date >= new Date())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 3);
  }, [events]);

  const getEventDateLabel = (date: Date) => {
    if (isToday(date)) return 'Hoje';
    if (isTomorrow(date)) return 'Amanhã';
    return format(date, "dd 'de' MMM", { locale: ptBR });
  };

  const unreadNotifications = getUnreadCount('clube');

  return (
    <div className="min-h-screen bg-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="p-6 pt-12"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Olá, Esportiva FC</h1>
            <p className="text-gray-600 text-sm">Coordenador</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(true)}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <Bell size={20} />
              </button>
              {unreadNotifications > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-semibold">{unreadNotifications}</span>
                </div>
              )}
            </div>
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
          </div>
        </div>

        {/* Stats Grid - Cards Interativos */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {/* Card Atletas - Clicável */}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/dashboard/athletes')}
            className="bg-black text-white p-5 rounded-2xl text-left cursor-pointer hover:bg-gray-900 transition-colors"
          >
            <Users size={24} className="mb-3" />
            <div className="text-3xl font-bold mb-1">{stats.totalAthletes}</div>
            <div className="text-gray-300 text-sm">Atletas</div>
          </motion.button>

          {/* Card Próximos Eventos - Clicável */}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/dashboard/calendar')}
            className="bg-gray-50 border border-gray-200 p-5 rounded-2xl text-left cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <CalendarIcon size={24} className="mb-3" />
            <div className="text-3xl font-bold mb-1">{stats.upcomingEvents}</div>
            <div className="text-gray-600 text-sm">Próximos Eventos</div>
          </motion.button>

          {/* Card Turmas - Clicável */}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/dashboard/classes')}
            className="bg-gray-50 border border-gray-200 p-5 rounded-2xl text-left cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <Award size={24} className="mb-3" />
            <div className="text-3xl font-bold mb-1">{stats.totalTeams}</div>
            <div className="text-gray-600 text-sm">Turmas</div>
          </motion.button>

          {/* Card Cobranças Pendentes - Clicável */}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/dashboard/payments')}
            className="bg-gray-50 border border-gray-200 p-5 rounded-2xl text-left cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <DollarSign size={24} className="mb-3" />
            <div className="text-3xl font-bold mb-1">{stats.pendingPayments}</div>
            <div className="text-gray-600 text-sm">Cobranças Pendentes</div>
          </motion.button>
        </div>

        {/* Código do Clube */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="bg-black text-white p-6 rounded-2xl mb-8 text-center"
        >
          <div className="text-sm text-gray-400 mb-2">Código do Clube</div>
          <div className="text-4xl font-bold tracking-[0.3em] mb-2">483921</div>
          <div className="text-xs text-gray-400">Compartilhe este código com novos membros</div>
        </motion.div>

        {/* Mini Calendar */}
        <MiniCalendar
          events={events}
          onDateClick={(date) => navigate('/dashboard/calendar')}
          onViewAll={() => navigate('/dashboard/calendar')}
        />

        {/* Próximos Eventos */}
        {nextEvents.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="mb-8"
          >
            <h2 className="font-bold text-lg mb-4">Próximos Eventos</h2>
            <div className="space-y-3">
              {nextEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-xl"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-semibold mb-1">{event.title}</div>
                      {event.teamName && (
                        <div className="text-sm text-gray-600">{event.teamName}</div>
                      )}
                    </div>
                    <div className="text-sm font-medium px-3 py-1 bg-white rounded-full">
                      {getEventDateLabel(event.date)}
                    </div>
                  </div>
                  {event.startTime && (
                    <div className="text-sm text-gray-600">
                      {event.startTime} {event.location && `• ${event.location}`}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
      
      {/* Modal de Notificações */}
      <NotificationsDropdown
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        tipo="clube"
      />
    </div>
  );
}