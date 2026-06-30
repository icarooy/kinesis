import { motion } from 'motion/react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronRight } from 'lucide-react';

interface Event {
  id: string;
  date: Date;
  title: string;
  category?: string;
}

interface MiniCalendarProps {
  events: Event[];
  onDateClick?: (date: Date) => void;
  onViewAll?: () => void;
}

export function MiniCalendar({ events, onDateClick, onViewAll }: MiniCalendarProps) {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 0 }); // Domingo

  // Gera os próximos 7 dias a partir de hoje
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  // Verifica se um dia tem eventos
  const hasEvent = (date: Date) => {
    return events.some(event => isSameDay(event.date, date));
  };

  // Conta quantos eventos tem em um dia
  const getEventCount = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date)).length;
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg">Calendário da Semana</h2>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-black transition-colors"
        >
          Ver calendário
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const isToday = isSameDay(day, today);
            const hasEvents = hasEvent(day);
            const eventCount = getEventCount(day);

            return (
              <motion.button
                key={day.toISOString()}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                onClick={() => onDateClick?.(day)}
                className={`
                  relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all
                  ${isToday 
                    ? 'bg-black text-white' 
                    : hasEvents
                    ? 'bg-white hover:bg-gray-100'
                    : 'hover:bg-white'
                  }
                `}
              >
                {/* Dia da semana */}
                <span className={`text-[10px] font-medium uppercase ${
                  isToday ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {format(day, 'EEEEE', { locale: ptBR })}
                </span>

                {/* Número do dia */}
                <span className={`text-lg font-bold ${
                  isToday ? 'text-white' : 'text-gray-900'
                }`}>
                  {format(day, 'd')}
                </span>

                {/* Indicador de eventos */}
                {hasEvents && (
                  <div className="flex gap-0.5 mt-1">
                    {eventCount > 0 && (
                      <div className={`w-1 h-1 rounded-full ${
                        isToday ? 'bg-white' : 'bg-black'
                      }`} />
                    )}
                    {eventCount > 1 && (
                      <div className={`w-1 h-1 rounded-full ${
                        isToday ? 'bg-white' : 'bg-black'
                      }`} />
                    )}
                    {eventCount > 2 && (
                      <div className={`w-1 h-1 rounded-full ${
                        isToday ? 'bg-white' : 'bg-black'
                      }`} />
                    )}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}