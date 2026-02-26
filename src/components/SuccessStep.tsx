import { CheckCircle, Calendar, Clock, Scissors, User } from 'lucide-react';
import type { Service, Professional } from '../types';

interface SuccessStepProps {
  service: Service;
  professional: Professional;
  date: string; // Ex: "25/02"
  time: string;
  onReset: () => void;
}

export function SuccessStep({ service, professional, date, time, onReset }: SuccessStepProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 animate-in zoom-in duration-300">
      {/* Ícone Animado */}
      <div className="bg-green-100 p-4 rounded-full mb-6">
        <CheckCircle size={64} className="text-green-600 animate-bounce" />
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Agendamento Confirmado!</h2>
      <p className="text-gray-500 mb-8 text-center">Enviamos os detalhes para o seu WhatsApp e e-mail.</p>

      {/* Card de Resumo */}
      <div className="w-full max-w-sm bg-white border border-gray-100 rounded-3xl shadow-xl overflow-hidden mb-8">
        <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
          <span className="font-medium text-sm">Resumo do Agendamento</span>
          <span className="text-xs opacity-80">Ref: #{Math.floor(Math.random() * 10000)}</span>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 text-gray-700">
            <Scissors size={18} className="text-blue-500" />
            <div>
              <p className="text-xs text-gray-400 leading-none">Serviço</p>
              <p className="font-semibold">{service.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <User size={18} className="text-blue-500" />
            <div>
              <p className="text-xs text-gray-400 leading-none">Profissional</p>
              <p className="font-semibold">{professional.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-gray-700">
              <Calendar size={18} className="text-blue-500" />
              <div>
                <p className="text-xs text-gray-400 leading-none">Data</p>
                <p className="font-semibold">{date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Clock size={18} className="text-blue-500" />
              <div>
                <p className="text-xs text-gray-400 leading-none">Horário</p>
                <p className="font-semibold">{time}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-lg font-bold text-blue-600">Total: R$ {service.price},00</p>
        </div>
      </div>

      <button
        onClick={onReset}
        className="text-gray-500 hover:text-blue-600 font-medium transition-colors"
      >
        Fazer outro agendamento
      </button>
    </div>
  );
}