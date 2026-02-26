import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DatePickerProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

export function DatePicker({ selectedDate, onChange }: DatePickerProps) {
  // Gerar os próximos 7 dias para agendamento
  const days = Array.from({ length: 7 }).map((_, i) => addDays(new Date(), i));

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
      {days.map((day) => {
        const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
        return (
          <button
            key={day.toString()}
            onClick={() => onChange(day)}
            className={`
              flex flex-col items-center min-w-[80px] p-3 rounded-2xl border transition-all
              ${isSelected 
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-105' 
                : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'}
            `}
          >
            <span className="text-xs uppercase font-medium">
              {format(day, 'EEE', { locale: ptBR })}
            </span>
            <span className="text-lg font-bold">
              {format(day, 'dd')}
            </span>
          </button>
        );
      })}
    </div>
  );
}