import { format, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CalendarSelectorProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function CalendarSelector({ selectedDate, onSelectDate }: CalendarSelectorProps) {
  // Gera os próximos 14 dias
  const days = Array.from({ length: 14 }).map((_, i) => addDays(new Date(), i));

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
      {days.map((day) => {
        const isSelected = isSameDay(day, selectedDate);
        return (
          <button
            key={day.toString()}
            onClick={() => onSelectDate(day)}
            className={`flex flex-col items-center min-w-[70px] p-4 rounded-2xl border transition-all
              ${isSelected 
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-105' 
                : 'bg-white border-gray-200 text-gray-500 hover:border-blue-300'}`}
          >
            <span className="text-[10px] uppercase font-bold tracking-tighter">
              {format(day, 'EEE', { locale: ptBR })}
            </span>
            <span className="text-xl font-black">
              {format(day, 'dd')}
            </span>
            <span className="text-[10px] opacity-80">
              {format(day, 'MMM', { locale: ptBR })}
            </span>
          </button>
        );
      })}
    </div>
  );
}