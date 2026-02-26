import { format } from 'date-fns'; // O IMPORT QUE ESTAVA FALTANDO

interface TimeGridProps {
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  disabledTimes: string[];
  startLimit: string;
  endLimit: string;
}

export function TimeGrid({ selectedTime, onSelectTime, disabledTimes, startLimit, endLimit }: TimeGridProps) {
  const times = [];
  let current = new Date(`2024-01-01T${startLimit}`);
  const end = new Date(`2024-01-01T${endLimit}`);

  while (current < end) {
    times.push(format(current, 'HH:mm'));
    current.setMinutes(current.getMinutes() + 30);
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
      {times.map((time) => {
        const isOccupied = disabledTimes.includes(time);
        return (
          <button
            key={time}
            disabled={isOccupied}
            onClick={() => onSelectTime(time)}
            className={`py-4 rounded-2xl font-bold text-sm transition-all ${
              isOccupied ? 'bg-gray-100 text-gray-300' : 
              selectedTime === time ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white border text-gray-600'
            }`}
          >
            {time}
          </button>
        );
      })}
    </div>
  );
}