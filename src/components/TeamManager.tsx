import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Users, UserPlus, X, Save, Loader2, Trash2 } from 'lucide-react';
import type { Professional } from '../types';

export function TeamManager({ orgId }: { orgId: string }) {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const [newPro, setNewPro] = useState({
    name: '',
    role: '',
    image_url: 'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=200'
  });

  useEffect(() => {
    fetchTeam();
  }, [orgId]);

  async function fetchTeam() {
    setLoading(true);
    const { data } = await supabase
      .from('professionals')
      .select('*')
      .eq('organization_id', orgId)
      .order('name');
    
    if (data) setProfessionals(data);
    setLoading(false);
  }

  async function handleAddProfessional() {
    if (!newPro.name || !newPro.role) return;
    
    const { error } = await supabase
      .from('professionals')
      .insert([{
        organization_id: orgId,
        name: newPro.name,
        role: newPro.role,
        image_url: newPro.image_url
      }]);

    if (error) {
      alert("Erro ao adicionar: " + error.message);
    } else {
      setIsAdding(false);
      setNewPro({ name: '', role: '', image_url: 'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=200' });
      fetchTeam();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remover este barbeiro da equipe?")) return;
    const { error } = await supabase.from('professionals').delete().eq('id', id);
    if (!error) fetchTeam();
  }

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
            <Users size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Equipe da Barbearia</h2>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-all"
        >
          <UserPlus size={20} />
        </button>
      </div>

      {isAdding && (
        <div className="p-4 bg-gray-50 rounded-2xl border border-blue-100 space-y-4 animate-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black uppercase text-blue-600">Novo Barbeiro</h3>
            <button onClick={() => setIsAdding(false)}><X size={18} className="text-gray-400" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input 
              placeholder="Nome do Barbeiro"
              className="p-3 rounded-xl border bg-white text-sm outline-none focus:ring-2 focus:ring-blue-100"
              value={newPro.name}
              onChange={e => setNewPro({...newPro, name: e.target.value})}
            />
            <input 
              placeholder="Cargo (ex: Master Barber)"
              className="p-3 rounded-xl border bg-white text-sm outline-none focus:ring-2 focus:ring-blue-100"
              value={newPro.role}
              onChange={e => setNewPro({...newPro, role: e.target.value})}
            />
          </div>
          <button 
            onClick={handleAddProfessional}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm"
          >
            Confirmar Adição
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {loading ? (
          <Loader2 className="animate-spin mx-auto text-blue-600" />
        ) : (
          professionals.map(pro => (
            <div key={pro.id} className="flex items-center justify-between p-3 border rounded-2xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <img src={pro.image_url} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-bold text-sm text-gray-800">{pro.name}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{pro.role}</p>
                </div>
              </div>
              <button onClick={() => handleDelete(pro.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}