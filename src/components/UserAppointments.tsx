import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { Clock, Calendar, Scissors, AlertCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function UserAppointments({ userEmail }: { userEmail: string }) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function fetchMyAppointments() {
    setLoading(true);
    const { data } = await supabase
      .from('appointments')
      .select(`
        *,
        organizations(name, slug),
        services(name, price),
        professionals(name)
      `)
      .eq('client_email', userEmail)
      .order('appointment_date', { ascending: false });

    if (data) setAppointments(data);
    setLoading(false);
  }
  fetchMyAppointments();
}, [userEmail]);

  console.log(appointments);

  if (loading) return (
    <div className="flex justify-center py-12">
      <Loader2 className="animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Meus Agendamentos</h2>
        <p className="text-sm text-gray-500">Histórico de cortes e barbas.</p>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl border border-dashed border-gray-200 text-center">
          <AlertCircle className="mx-auto text-gray-300 mb-2" size={32} />
          <p className="text-gray-500 text-sm">Você ainda não tem agendamentos.</p>
        </div>
      ) : (
        appointments.map((app) => (
          <div key={app.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                <Scissors size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">{app.services?.name}</p>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
                  Com {app.professionals?.name}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-[10px] text-gray-500">
                    <Calendar size={12} /> {format(new Date(app.appointment_date + 'T00:00:00'), "dd/MM")}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-gray-500">
                    <Clock size={12} /> {app.appointment_time}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase ${
                app.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {app.status === 'confirmed' ? 'Confirmado' : 'Cancelado'}
              </span>
              <p className="text-xs font-bold text-gray-800 mt-2">R$ {app.services?.price},00</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}