import { motion } from 'motion/react';
import { Calendar as CalendarIcon, DollarSign, TrendingUp, Trophy, AlertCircle, CheckCircle2, Bell } from 'lucide-react';
import { useAppData } from '../../contexts/AppDataContext';
import { useMemo, useState, useEffect } from 'react';
import { isToday, isTomorrow, format, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useClubStore } from '../../stores/clubStore';
import { api } from '../../services/api';
import { CalendarEvent } from '../../types';
import NotificationsDropdown from '../../components/NotificationsDropdown';
import { MiniCalendar } from '../../components/MiniCalendar';

// Resposta de GET /api/clubs/{clubId}/events (mesmo padrão da CalendarScreen).
interface EventResponse {
  id: string;
  title: string;
  startsAt: string;
  endsAt?: string;
  category?: string;
  location?: string;
  description?: string;
}

function mapCategoryToType(category?: string): CalendarEvent['type'] {
  switch (category) {
    case 'TRAINING':
      return 'training';
    case 'GAME':
      return 'game';
    case 'MEETING':
      return 'meeting';
    default:
      return 'other';
  }
}

function mapEventResponse(event: EventResponse): CalendarEvent {
  const date = new Date(event.startsAt);
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    type: mapCategoryToType(event.category),
    date,
    startTime: format(date, 'HH:mm'),
    endTime: event.endsAt ? format(new Date(event.endsAt), 'HH:mm') : undefined,
    location: event.location,
    attendees: [],
  };
}

export default function AthleteHomeScreen() {
  const { payments, posts } = useAppData();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const getUnreadCount = useClubStore((state) => state.getUnreadCount);
  const currentUser = useClubStore((state) => state.currentUser);
  const clubId = useClubStore((state) => state.clubId);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Mock athlete ID - in real app, this would come from auth
  const athleteId = 'athlete1';

  // Eventos reais do clube. Degradação silenciosa: enquanto carrega ou em
  // caso de erro, `events` fica vazio e as seções de evento não aparecem.
  useEffect(() => {
    if (!clubId) {
      setEvents([]);
      return;
    }

    let cancelled = false;

    api<EventResponse[]>('GET', `/api/clubs/${clubId}/events`)
      .then((data) => {
        if (cancelled) return;
        setEvents(Array.isArray(data) ? data.map(mapEventResponse) : []);
      })
      .catch(() => {
        if (!cancelled) setEvents([]);
      });

    return () => {
      cancelled = true;
    };
  }, [clubId]);

  // Calculate stats
  const stats = useMemo(() => {
    const myEvents = events.filter(e => e.date >= new Date()).slice(0, 5);
    const myPayments = payments.filter(p => 
      p.athleteId === athleteId || !p.athleteId
    );
    const pendingPayments = myPayments.filter(p => p.status === 'pending');
    const overduePayments = myPayments.filter(p => 
      p.status === 'pending' && isPast(p.dueDate)
    );
    const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

    return {
      upcomingEvents: myEvents.length,
      pendingPayments: pendingPayments.length,
      overduePayments: overduePayments.length,
      totalPending,
      nextEvents: myEvents.slice(0, 3),
      recentPosts: posts.slice(0, 2),
    };
  }, [events, payments, posts, athleteId]);

  const getEventDateLabel = (date: Date) => {
    if (isToday(date)) return 'Hoje';
    if (isTomorrow(date)) return 'Amanhã';
    return format(date, "dd 'de' MMM", { locale: ptBR });
  };

  const unreadNotifications = getUnreadCount('atleta');

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
            <h1 className="text-2xl font-bold">Olá, {currentUser?.name ?? ''}</h1>
            <p className="text-gray-600 text-sm">Sub-15 Masculino</p>
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
            <button
              onClick={() => navigate('/dashboard/profile')}
              className="w-12 h-12 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <span className="text-white font-bold text-lg">{currentUser?.name?.charAt(0).toUpperCase() ?? ''}</span>
            </button>
          </div>
        </div>

        {/* Alerts */}
        {stats.overduePayments > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3"
          >
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-900 mb-1">
                Você tem {stats.overduePayments} pagamento{stats.overduePayments > 1 ? 's' : ''} atrasado{stats.overduePayments > 1 ? 's' : ''}
              </p>
              <button
                onClick={() => navigate('/dashboard/payments')}
                className="text-sm text-red-700 underline"
              >
                Ver pendências
              </button>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="bg-black text-white p-5 rounded-2xl"
          >
            <CalendarIcon size={24} className="mb-3" />
            <div className="text-3xl font-bold mb-1">{stats.upcomingEvents}</div>
            <div className="text-gray-300 text-sm">Próximos Eventos</div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="bg-gray-50 border border-gray-200 p-5 rounded-2xl"
          >
            <Trophy size={24} className="mb-3" />
            <div className="text-3xl font-bold mb-1">3º</div>
            <div className="text-gray-600 text-sm">Posição Ranking</div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="bg-gray-50 border border-gray-200 p-5 rounded-2xl"
          >
            <TrendingUp size={24} className="mb-3" />
            <div className="text-3xl font-bold mb-1">88%</div>
            <div className="text-gray-600 text-sm">Frequência</div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            onClick={() => stats.pendingPayments > 0 && navigate('/dashboard/payments')}
            className={`p-5 rounded-2xl ${
              stats.pendingPayments > 0
                ? 'bg-yellow-50 border border-yellow-200 cursor-pointer hover:bg-yellow-100 transition-colors'
                : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <DollarSign size={24} className={stats.pendingPayments > 0 ? 'text-yellow-600 mb-3' : 'mb-3'} />
            <div className="text-3xl font-bold mb-1">{stats.pendingPayments}</div>
            <div className={`text-sm ${stats.pendingPayments > 0 ? 'text-yellow-700' : 'text-gray-600'}`}>
              {stats.pendingPayments > 0 ? 'Pagamentos Pendentes' : 'Nada Pendente'}
            </div>
          </motion.div>
        </div>

        {/* Pending Payments Summary */}
        {stats.totalPending > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            onClick={() => navigate('/dashboard/payments')}
            className="bg-yellow-50 border border-yellow-200 p-5 rounded-2xl mb-8 cursor-pointer hover:bg-yellow-100 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <DollarSign size={20} className="text-yellow-600" />
                <span className="font-semibold">Total Pendente</span>
              </div>
              <AlertCircle size={18} className="text-yellow-600" />
            </div>
            <div className="text-3xl font-bold mb-2">R$ {stats.totalPending.toFixed(2)}</div>
            <p className="text-sm text-yellow-700">Toque para ver detalhes e pagar</p>
          </motion.div>
        )}

        {/* Mini Calendar */}
        <MiniCalendar
          events={events}
          onDateClick={(date) => navigate('/dashboard/calendar')}
          onViewAll={() => navigate('/dashboard/calendar')}
        />

        {/* Next Events */}
        {stats.nextEvents.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="mb-8"
          >
            <h2 className="font-bold text-lg mb-4">Próximos Eventos</h2>
            <div className="space-y-3">
              {stats.nextEvents.map((event, index) => (
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

        {/* Recent Activity */}
        {stats.recentPosts.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Últimas Notícias</h2>
              <button
                onClick={() => navigate('/dashboard/activities')}
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                Ver todas
              </button>
            </div>
            <div className="space-y-3">
              {stats.recentPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 + index * 0.1 }}
                  onClick={() => navigate('/dashboard/activities')}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="font-medium mb-1 line-clamp-2">{post.content}</div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>{post.authorName}</span>
                    <span>•</span>
                    <span>{format(post.createdAt, "dd 'de' MMM", { locale: ptBR })}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Modal de Notificações */}
        <NotificationsDropdown
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          tipo="atleta"
        />
      </motion.div>
    </div>
  );
}