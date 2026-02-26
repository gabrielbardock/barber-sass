import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Scissors, Plus, Trash2, Save, Loader2, X, Clock } from 'lucide-react';

export function ServiceManager({ orgId }: { orgId: string }) {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [newService, setNewService] = useState({
    name: '',
    price: '',
    duration_minutes: '30', // Valor padrão
    image_url: 'https://images.unsplash.com/photo-1585744860596-413d014f9c6c?w=400'
  });

  useEffect(() => {
    fetchServices();
  }, [orgId]);

  async function fetchServices() {
    setLoading(true);
    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('organization_id', orgId)
      .order('name');
    
    if (data) setServices(data);
    setLoading(false);
  }

  async function handleAddService() {
    if (!newService.name || !newService.price || !newService.duration_minutes) return;
    setSaving(true);
    
    const { error } = await supabase
      .from('services')
      .insert([{
        organization_id: orgId,
        name: newService.name,
        price: Number(newService.price),
        duration_minutes: Number(newService.duration_minutes), // AGORA ENVIANDO A DURAÇÃO
        image_url: newService.image_url
      }]);

    if (error) {
      alert("Erro ao adicionar serviço: " + error.message);
    } else {
      setIsAdding(false);
      setNewService({ name: '', price: '', duration_minutes: '30', image_url: 'https://images.unsplash.com/photo-1585744860596-413d014f9c6c?w=400' });
      fetchServices();
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir este serviço?")) return;
    await supabase.from('services').delete().eq('id', id);
    fetchServices();
  }

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
            <Scissors size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Serviços</h2>
        </div>
        <button onClick={() => setIsAdding(true)} className="bg-blue-600 text-white p-2 rounded-xl"><Plus size={20} /></button>
      </div>

      {isAdding && (
        <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-4 animate-in slide-in-from-top-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input 
              placeholder="Nome"
              className="p-3 rounded-xl border bg-white text-sm"
              value={newService.name}
              onChange={e => setNewService({...newService, name: e.target.value})}
            />
            <input 
              type="number"
              placeholder="Preço (R$)"
              className="p-3 rounded-xl border bg-white text-sm"
              value={newService.price}
              onChange={e => setNewService({...newService, price: e.target.value})}
            />
            {/* NOVO CAMPO DE DURAÇÃO */}
            <div className="relative">
              <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="number"
                placeholder="Minutos"
                className="w-full pl-9 pr-3 py-3 rounded-xl border bg-white text-sm"
                value={newService.duration_minutes}
                onChange={e => setNewService({...newService, duration_minutes: e.target.value})}
              />
            </div>
          </div>
          <button onClick={handleAddService} disabled={saving} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Salvar Serviço
          </button>
        </div>
      )}

      <div className="space-y-3">
        {services.map(srv => (
          <div key={srv.id} className="flex items-center justify-between p-3 border rounded-2xl bg-gray-50/30">
            <div className="flex items-center gap-3">
              <img src={srv.image_url} className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <p className="font-bold text-sm">{srv.name}</p>
                <p className="text-xs text-blue-600 font-bold">R$ {srv.price},00 • {srv.duration_minutes} min</p>
              </div>
            </div>
            <button onClick={() => handleDelete(srv.id)} className="p-2 text-gray-300 hover:text-red-500"><Trash2 size={18} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}