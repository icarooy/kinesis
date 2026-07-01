import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, X, MapPin, Clock, Users, CheckCircle2, UserPlus } from 'lucide-react';
import { useClubStore } from '../../stores/clubStore';
import { api, type ApiError } from '../../services/api';
import { CalendarEvent } from '../../types';
import { Button } from '../../components/ui/button';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Resposta de GET /api/clubs/{clubId}/events (campos confirmados na doc).
// `category` é o enum CreateEventRequest: TRAINING | GAME | MEETING (| OTHER).
interface EventResponse {
  id: string;
  title: string;
  startsAt: string;
  endsAt?: string;
  category?: string;
  location?: string;
  description?: string;
}

// category (API) → type (CalendarEvent). Qualquer valor desconhecido → 'other'.
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

export default function CalendarScreen() {
  const clubId = useClubStore((state) => state.clubId);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showEventDetails, setShowEventDetails] = useState<CalendarEvent | null>(null);

  // Mock athlete ID - in real app, this would come from auth
  const athleteId = 'athlete1';

  // Busca os eventos reais do clube. Sem clubId, não chamamos a API.
  useEffect(() => {
    if (!clubId) {
      setEvents([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError('');

    api<EventResponse[]>('GET', `/api/clubs/${clubId}/events`)
      .then((data) => {
        if (cancelled) return;
        setEvents(Array.isArray(data) ? data.map(mapEventResponse) : []);
      })
      .catch((err) => {
        if (cancelled) return;
        const apiError = err as ApiError;
        setError(apiError.message ?? 'Não foi possível carregar os eventos.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [clubId]);

  // Calendar days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get events for selected date
  const selectedDateEvents = events.filter(event => 
    isSameDay(event.date, selectedDate)
  );

  // Event type colors
  const eventTypeColors = {
    training: 'bg-blue-500',
    game: 'bg-green-500',
    meeting: 'bg-purple-500',
    other: 'bg-gray-500',
  };

  const eventTypeLabels = {
    training: 'Treino',
    game: 'Jogo',
    meeting: 'Reunião',
    other: 'Outro',
  };

  // Check if day has events
  const hasEvents = (day: Date) => {
    return events.some(event => isSameDay(event.date, day));
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  // Presença é client-side/local: a API não tem endpoint de attendance.
  // Alterna o athleteId no array `attendees` do evento no estado local.
  const toggleAttendees = (event: CalendarEvent): CalendarEvent => {
    const attendees = event.attendees ?? [];
    const attending = attendees.includes(athleteId);
    return {
      ...event,
      attendees: attending
        ? attendees.filter((id) => id !== athleteId)
        : [...attendees, athleteId],
    };
  };

  const handleToggleAttendance = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? toggleAttendees(e) : e)),
    );
    // Mantém o modal de detalhes em sincronia com o estado local.
    setShowEventDetails((current) =>
      current && current.id === eventId ? toggleAttendees(current) : current,
    );
  };

  const isAttending = (event: CalendarEvent) => {
    return event.attendees?.includes(athleteId) || false;
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-xl font-bold">Calendário</h1>
            <p className="text-sm text-gray-600 mt-1">Veja os eventos e confirme sua presença</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-4 space-y-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ←
            </button>
            <h2 className="font-semibold capitalize">
              {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              →
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                <div key={day} className="p-2 text-center text-xs font-medium text-gray-600">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => {
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isTodayDate = isToday(day);
                const dayHasEvents = hasEvents(day);

                return (
                  <motion.button
                    key={index}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      aspect-square p-2 border-b border-r border-gray-200 relative
                      ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                      ${isSelected ? 'bg-black text-white' : ''}
                      ${isTodayDate && !isSelected ? 'ring-2 ring-black ring-inset' : ''}
                      hover:bg-gray-100 transition-colors
                    `}
                  >
                    <span className={`text-sm ${!isCurrentMonth && !isSelected ? 'text-gray-400' : ''}`}>
                      {format(day, 'd')}
                    </span>
                    {dayHasEvents && (
                      <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                        isSelected ? 'bg-white' : 'bg-black'
                      }`} />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Events for Selected Date */}
          <div>
            <h3 className="font-semibold mb-3">
              Eventos - {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
            </h3>
            
            {!clubId ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <CalendarIcon size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">Nenhum clube conectado</p>
              </div>
            ) : isLoading ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <CalendarIcon size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">Carregando eventos...</p>
              </div>
            ) : error ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <CalendarIcon size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">{error}</p>
              </div>
            ) : selectedDateEvents.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <CalendarIcon size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">Nenhum evento neste dia</p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedDateEvents.map((event, index) => {
                  const attending = isAttending(event);
                  
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white border border-gray-200 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-1 h-full ${eventTypeColors[event.type]} rounded-full`} />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">{event.title}</h4>
                              <p className="text-xs text-gray-500 capitalize">{eventTypeLabels[event.type]}</p>
                            </div>
                            {event.startTime && (
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Clock size={14} />
                                {event.startTime}
                              </div>
                            )}
                          </div>
                          {event.teamName && (
                            <p className="text-sm text-gray-600 mb-1">{event.teamName}</p>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                              <MapPin size={14} />
                              {event.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Attendance Button */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users size={16} />
                          <span>{event.attendees?.length || 0} confirmações</span>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleToggleAttendance(event.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                            attending
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                          }`}
                        >
                          {attending ? (
                            <>
                              <CheckCircle2 size={16} />
                              <span>Confirmado</span>
                            </>
                          ) : (
                            <>
                              <UserPlus size={16} />
                              <span>Confirmar Presença</span>
                            </>
                          )}
                        </motion.button>
                      </div>

                      {/* View Details Button */}
                      <button
                        onClick={() => setShowEventDetails(event)}
                        className="w-full mt-2 text-sm text-gray-600 hover:text-black transition-colors"
                      >
                        Ver detalhes completos →
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      <AnimatePresence>
        {showEventDetails && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEventDetails(null)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className={`inline-block px-3 py-1 rounded-full text-white text-xs font-medium mb-3 ${eventTypeColors[showEventDetails.type]}`}>
                      {eventTypeLabels[showEventDetails.type]}
                    </div>
                    <h2 className="text-xl font-bold mb-1">{showEventDetails.title}</h2>
                    {showEventDetails.description && (
                      <p className="text-gray-600">{showEventDetails.description}</p>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setShowEventDetails(null)}>
                    <X size={20} />
                  </Button>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-gray-700">
                    <CalendarIcon size={18} />
                    <span>{format(showEventDetails.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                  </div>
                  {showEventDetails.startTime && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Clock size={18} />
                      <span>{showEventDetails.startTime} {showEventDetails.endTime && `- ${showEventDetails.endTime}`}</span>
                    </div>
                  )}
                  {showEventDetails.location && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <MapPin size={18} />
                      <span>{showEventDetails.location}</span>
                    </div>
                  )}
                  {showEventDetails.teamName && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Users size={18} />
                      <span>{showEventDetails.teamName}</span>
                    </div>
                  )}
                </div>

                {/* Attendance Info */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium">
                      {showEventDetails.attendees?.length || 0} pessoa{(showEventDetails.attendees?.length || 0) !== 1 ? 's' : ''} confirmada{(showEventDetails.attendees?.length || 0) !== 1 ? 's' : ''}
                    </p>
                    {isAttending(showEventDetails) && (
                      <div className="flex items-center gap-1 text-green-600 text-sm">
                        <CheckCircle2 size={14} />
                        <span>Você confirmou</span>
                      </div>
                    )}
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleToggleAttendance(showEventDetails.id)}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                      isAttending(showEventDetails)
                        ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {isAttending(showEventDetails) ? (
                      <>
                        <X size={18} />
                        <span>Cancelar Confirmação</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
                        <span>Confirmar Presença</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
