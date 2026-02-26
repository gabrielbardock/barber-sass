import { useEffect, useState } from 'react';
import { Users, Calendar, DollarSign, Loader2, CheckCircle2, Clock, MessageCircle, X, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { supabase } from '../services/supabase';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { AppointmentWithDetails } from '../types';

interface DashboardProps {
  orgData: {
    id: string;
    name: string;
    slug: string; // Adicionamos o slug para o botão de compartilhar
  } | null; // Permitimos nulo para evitar erro de inicialização
}

export function Dashboard({ orgData }: DashboardProps) {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [stats, setStats] = useState({ dayCount: 0, dayRevenue: 0, totalPending: 0 });

  async function fetchDashboardData() {
    if (!orgData?.id) return;
    
    setLoading(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('appointments')
        .select('*, services(*), professionals(*)')
        .eq('organization_id', orgData.id)
        .eq('appointment_date', dateStr) // Filtra pela data selecionada
        .order('appointment_time', { ascending: true });

      if (error) throw error;
      
      const results = data || [];
      setAppointments(results);

      // Cálculo de Stats em tempo real
      const activeAppts = results.filter(a => a.status !== 'cancelled');
      const revenue = activeAppts.reduce((acc, curr) => acc + (curr.services?.price || 0), 0);
      
      setStats({
        dayCount: activeAppts.length,
        dayRevenue: revenue,
        totalPending: activeAppts.length // Aqui você pode expandir para buscar todos do mês se quiser
      });

    } catch (error: any) {
      console.error("Erro ao carregar dashboard:", error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, [orgData?.id, selectedDate]);

  const handleCancel = async (id: string) => {
    if (!confirm('Deseja cancelar este horário?')) return;
    const { error } = await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', id);
    if (!error) fetchDashboardData();
  };

  const handleWhatsAppMessage = (app: AppointmentWithDetails) => {
    const phone = app.client_phone?.replace(/\D/g, '');
    const message = encodeURIComponent(`Olá ${app.client_name}! Confirmamos seu horário hoje às ${app.appointment_time} na ${orgData?.name}.`);
    window.open(`https://wa.me/55${phone}?text=${message}`, '_blank');
  };

  // Função de Compartilhar Link da Barbearia
  const handleShareLink = () => {
    const url = `${window.location.origin}/${orgData?.slug}`;
    navigator.clipboard.writeText(url);
    alert('Link da barbearia copiado! Agora é só enviar no WhatsApp dos clientes.');
  };

  if (!orgData) return (
    <div className="py-20 flex justify-center italic text-gray-400">Carregando dados da barbearia...</div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Cabeçalho da Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <h1 className="text-2xl font-black text-gray-800 tracking-tighter uppercase">Minha Agenda</h1>
             <button onClick={handleShareLink} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title="Copiar link de agendamento">
               <Share2 size={18} />
             </button>
          </div>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
            <Calendar size={14} /> {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </p>
        </div>

        {/* Seletor de Data Rápido */}
        <div className="flex items-center bg-gray-50 p-1 rounded-2xl border">
          <button onClick={() => setSelectedDate(subDays(selectedDate, 1))} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all"><ChevronLeft size={20}/></button>
          <div className="px-4 text-sm font-bold text-gray-700 min-w-[120px] text-center">
            {isSameDay(selectedDate, new Date()) ? 'Hoje' : format(selectedDate, 'dd/MM')}
          </div>
          <button onClick={() => setSelectedDate(addDays(selectedDate, 1))} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all"><ChevronRight size={20}/></button>
        </div>
      </div>

      {/* Stats do Dia */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-lg shadow-blue-100">
          <p className="text-[10px] font-bold uppercase opacity-80 tracking-widest">Cortes do Dia</p>
          <p className="text-3xl font-black">{stats.dayCount}</p>
        </div>
        <div className="bg-emerald-500 p-6 rounded-3xl text-white shadow-lg shadow-emerald-100">
          <p className="text-[10px] font-bold uppercase opacity-80 tracking-widest">Receita do Dia</p>
          <p className="text-3xl font-black">R$ {stats.dayRevenue},00</p>
        </div>
        <div className="hidden md:block bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Próximos Agendamentos</p>
          <p className="text-3xl font-black text-gray-800">{stats.totalPending}</p>
        </div>
      </div>

      {/* Tabela de Agendamentos */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-2">
            <Loader2 className="animate-spin text-blue-600" />
            <span className="text-xs font-bold text-gray-400 uppercase">Sincronizando...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black">
                <tr>
                  <th className="px-6 py-4 tracking-widest">Horário / Cliente</th>
                  <th className="px-6 py-4 tracking-widest text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-6 py-20 text-center text-gray-400 text-sm italic">
                      Nenhum agendamento para este dia.
                    </td>
                  </tr>
                ) : (
                  appointments.map((app) => (
                    <tr key={app.id} className={`hover:bg-gray-50/50 transition-colors ${app.status === 'cancelled' ? 'opacity-40 grayscale' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-black text-blue-600 tabular-nums">{app.appointment_time}</span>
                          <div>
                            <div className="font-bold text-gray-900 leading-none mb-1">{app.client_name}</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                              {app.services?.name} • com {app.professionals?.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => handleWhatsAppMessage(app)}
                            className="p-3 bg-green-500 text-white rounded-2xl hover:bg-green-600 shadow-md active:scale-90 transition-all"
                          >
                            <MessageCircle size={18} />
                          </button>
                          {app.status === 'confirmed' && (
                            <button 
                              onClick={() => handleCancel(app.id)}
                              className="p-3 bg-white border border-red-100 text-red-500 rounded-2xl hover:bg-red-50 shadow-sm active:scale-90 transition-all"
                            >
                              <X size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}