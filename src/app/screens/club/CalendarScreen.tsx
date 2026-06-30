import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, Plus, X, MapPin, Clock, Users } from 'lucide-react';
import { useAppData } from '../../contexts/AppDataContext';
import { CalendarEvent } from '../../types';
import { Button } from '../../components/ui/button';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function CalendarScreen() {
  const { events, teams, addEvent } = useAppData();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState<CalendarEvent | null>(null);

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

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold">Calendário</h1>
            <Button
              onClick={() => setShowCreateEvent(true)}
              size="icon"
              className="rounded-full bg-black text-white hover:bg-gray-800"
            >
              <Plus size={20} />
            </Button>
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
                <div key={day} className="p-3 text-center text-xs font-medium text-gray-600">
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
                const dayNumber = format(day, 'd');

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(day)}
                    className="aspect-square p-2 border-b border-r border-gray-200 relative flex flex-col items-center justify-center"
                    style={{
                      backgroundColor: isSelected ? '#000000' : isCurrentMonth ? '#ffffff' : '#f9fafb',
                      borderWidth: isTodayDate && !isSelected ? '2px' : '1px',
                      borderColor: isTodayDate && !isSelected ? '#000000' : '#e5e7eb'
                    }}
                  >
                    <span 
                      style={{
                        color: isSelected ? '#ffffff !important' : !isCurrentMonth ? '#9ca3af !important' : '#111827 !important',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        lineHeight: '1',
                        display: 'inline-block',
                        userSelect: 'none',
                        pointerEvents: 'none'
                      }}
                    >
                      {dayNumber}
                    </span>
                    {dayHasEvents && (
                      <div 
                        style={{
                          backgroundColor: isSelected ? '#ffffff' : '#000000',
                          width: '4px',
                          height: '4px',
                          marginTop: '4px',
                          pointerEvents: 'none'
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Events for Selected Date */}
          <div>
            <h3 className="font-semibold mb-3">
              Eventos - {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
            </h3>
            
            {selectedDateEvents.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <CalendarIcon size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500 mb-3">Nenhum evento neste dia</p>
                <Button
                  onClick={() => setShowCreateEvent(true)}
                  variant="outline"
                  size="sm"
                >
                  <Plus size={16} className="mr-2" />
                  Adicionar Evento
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedDateEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setShowEventDetails(event)}
                    className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
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
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPin size={14} />
                            {event.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
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

                <div className="space-y-3">
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

                {showEventDetails.attendees && showEventDetails.attendees.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium mb-2">
                      {showEventDetails.attendees.length} confirmações
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create Event Modal - Simplified for now */}
      <AnimatePresence>
        {showCreateEvent && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateEvent(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-white rounded-2xl shadow-2xl z-50 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">Novo Evento</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowCreateEvent(false)}>
                  <X size={20} />
                </Button>
              </div>
              <p className="text-gray-600 text-center py-8">
                Funcionalidade de criação de eventos será implementada em breve.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}