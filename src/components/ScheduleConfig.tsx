import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { Save, Loader2, Clock } from 'lucide-react';

const DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export function ScheduleConfig({ professionalId }: { professionalId: string }) {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, [professionalId]);

  async function fetchSchedules() {
    setLoading(true);
    const { data, error } = await supabase
      .from('professional_schedules')
      .select('*')
      .eq('professional_id', professionalId)
      .order('day_of_week', { ascending: true });

    if (data && data.length > 0) {
      setSchedules(data);
    } else {
      // Se não houver dados no banco, criamos um estado inicial local para você salvar
      const initialSchedules = DAYS.map((_, index) => ({
        professional_id: professionalId,
        day_of_week: index,
        start_time: '09:00',
        end_time: '18:00',
        is_working: index !== 0 // Domingo (0) começa como folga
      }));
      setSchedules(initialSchedules);
    }
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    const { error } = await supabase.from('professional_schedules').upsert(schedules);
    if (error) alert("Erro ao salvar");
    else alert("Horários atualizados!");
    setSaving(false);
  }

  const updateDay = (index: number, field: string, value: any) => {
    const newSchedules = [...schedules];
    newSchedules[index] = { ...newSchedules[index], [field]: value };
    setSchedules(newSchedules);
  };

  if (loading) return <Loader2 className="animate-spin mx-auto mt-10 text-blue-600" />;

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Meu Horário de Trabalho</h2>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Salvar
        </button>
      </div>

      <div className="space-y-4">
        {schedules.map((s, index) => (
          <div key={s.day_of_week} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div className="w-24">
              <span className="font-bold text-sm text-gray-700">{DAYS[s.day_of_week]}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <input 
                type="checkbox" 
                checked={s.is_working}
                onChange={(e) => updateDay(index, 'is_working', e.target.checked)}
                className="w-5 h-5 rounded-lg text-blue-600 focus:ring-blue-500"
              />
              
              {s.is_working ? (
                <div className="flex items-center gap-2">
                  <input 
                    type="time" 
                    value={s.start_time.substring(0,5)}
                    onChange={(e) => updateDay(index, 'start_time', e.target.value)}
                    className="bg-white border p-2 rounded-lg text-xs font-bold"
                  />
                  <span className="text-gray-400">às</span>
                  <input 
                    type="time" 
                    value={s.end_time.substring(0,5)}
                    onChange={(e) => updateDay(index, 'end_time', e.target.value)}
                    className="bg-white border p-2 rounded-lg text-xs font-bold"
                  />
                </div>
              ) : (
                <span className="text-xs text-red-400 font-bold uppercase italic">Folga</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}