import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { supabase } from '../services/supabase';
import { Loader2 } from 'lucide-react';

// Componentes do Fluxo
import { TimeGrid } from '../components/TimeGrid';
import { CalendarSelector } from '../components/CalendarSelector';
import { ClientForm } from '../components/ClientForm';
import { SuccessStep } from '../components/SuccessStep';

export function Booking({ orgData, session }: any) {
  const [services, setServices] = useState<any[]>([]);
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de Seleção
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [occupiedTimes, setOccupiedTimes] = useState<string[]>([]);
  const [daySchedule, setDaySchedule] = useState({ start: '09:00', end: '18:00', isWorking: true });
  const [clientData, setClientData] = useState({ name: '', phone: '', email: session?.user?.email || '' });
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (orgData) {
      async function loadData() {
        setLoading(true);
        const [srv, pro] = await Promise.all([
          supabase.from('services').select('*').eq('organization_id', orgData.id),
          supabase.from('professionals').select('*').eq('organization_id', orgData.id)
        ]);
        setServices(srv.data || []);
        setProfessionals(pro.data || []);
        setLoading(false);
      }
      loadData();
    }
  }, [orgData]);

  useEffect(() => {
    if (selectedProfessional && selectedDate) {
      const fetchAvailability = async () => {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const dayOfWeek = selectedDate.getDay();
        const [appts, sched] = await Promise.all([
          supabase.from('appointments').select('appointment_time').eq('professional_id', selectedProfessional.id).eq('appointment_date', dateStr).neq('status', 'cancelled'),
          supabase.from('professional_schedules').select('*').eq('professional_id', selectedProfessional.id).eq('day_of_week', dayOfWeek).maybeSingle()
        ]);
        if (appts.data) setOccupiedTimes(appts.data.map(a => a.appointment_time));
        if (sched.data) setDaySchedule({ start: sched.data.start_time, end: sched.data.end_time, isWorking: sched.data.is_working });
        else setDaySchedule({ start: '09:00', end: '18:00', isWorking: true });
      };
      fetchAvailability();
    }
  }, [selectedDate, selectedProfessional]);

  const handleConfirmAppointment = async () => {
    if (!selectedService || !selectedProfessional || !selectedTime || !orgData?.id) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('appointments').insert([{
        organization_id: orgData.id,
        professional_id: selectedProfessional.id,
        service_id: selectedService.id,
        client_name: clientData.name,
        client_phone: clientData.phone,
        client_email: session.user.email,
        appointment_date: format(selectedDate, 'yyyy-MM-dd'),
        appointment_time: selectedTime,
        status: 'confirmed'
      }]);
      if (error) throw error;
      setIsConfirmed(true);
    } catch (error: any) { alert(error.message); }
    finally { setIsSubmitting(false); }
  };

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <div className="space-y-8 py-4">
      {!isConfirmed ? (
        <>
          <section className="animate-in fade-in">
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">1. Escolha o Serviço</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map(s => (
                <div key={s.id} onClick={() => { setSelectedService(s); setSelectedTime(null); }} className={`flex border rounded-2xl overflow-hidden cursor-pointer transition-all ${selectedService?.id === s.id ? 'ring-2 ring-blue-600 bg-blue-50 shadow-lg' : 'bg-white hover:border-blue-200'}`}>
                  <img src={s.image_url} className="w-24 h-24 object-cover" />
                  <div className="p-4 flex flex-col justify-center"><h3 className="font-bold text-gray-800">{s.name}</h3><p className="text-blue-600 font-black">R$ {s.price},00</p></div>
                </div>
              ))}
            </div>
          </section>

          {selectedService && (
            <section className="animate-in fade-in">
              <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">2. Escolha o Profissional</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {professionals.map(p => (
                  <button key={p.id} onClick={() => { setSelectedProfessional(p); setSelectedTime(null); }} className={`flex-shrink-0 flex flex-col items-center p-6 rounded-3xl border transition-all w-32 ${selectedProfessional?.id === p.id ? 'bg-blue-600 text-white shadow-xl' : 'bg-white hover:bg-gray-50'}`}>
                    <img src={p.image_url} className="w-16 h-16 rounded-full object-cover mb-3 shadow-sm" />
                    <span className="font-bold text-[10px] uppercase text-center">{p.name}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {selectedService && selectedProfessional && (
            <section className="animate-in fade-in">
              <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">3. Data e Horário</h2>
              <CalendarSelector selectedDate={selectedDate} onSelectDate={(d) => { setSelectedDate(d); setSelectedTime(null); }} />
              <div className="mt-6">
                {daySchedule.isWorking ? (
                  <TimeGrid selectedTime={selectedTime} onSelectTime={setSelectedTime} disabledTimes={occupiedTimes} startLimit={daySchedule.start} endLimit={daySchedule.end} />
                ) : (
                  <div className="p-12 bg-white rounded-3xl border border-dashed text-center text-gray-400 font-bold uppercase text-[10px]">Barbeiro de folga</div>
                )}
              </div>
            </section>
          )}
          
          {selectedTime && (
            <>
              <ClientForm data={clientData} onChange={setClientData} />
              <div className="fixed bottom-24 md:bottom-4 left-4 right-4 bg-white p-4 rounded-3xl shadow-2xl border border-gray-100 flex items-center justify-between z-40 animate-in slide-in-from-bottom-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase mb-1 leading-none">Total</span>
                  <p className="font-black text-xl text-blue-600 leading-none">R$ {selectedService?.price},00</p>
                </div>
                <button onClick={handleConfirmAppointment} disabled={isSubmitting || !clientData.name} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-tighter shadow-lg shadow-blue-200">
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Agendar'}
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <SuccessStep service={selectedService} professional={selectedProfessional} date={format(selectedDate, "dd/MM")} time={selectedTime!} onReset={() => { setIsConfirmed(false); setSelectedService(null); setSelectedProfessional(null); setSelectedTime(null); }} />
      )}
    </div>
  );
}