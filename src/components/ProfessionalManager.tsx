import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { UserPlus, Save, Loader2, Camera } from 'lucide-react';

export function ProfessionalManager({ userId, orgId }: { userId: string, orgId: string }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    image_url: 'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=200'
  });

  useEffect(() => {
    checkRegistration();
  }, [userId]);

  async function checkRegistration() {
    const { data } = await supabase
      .from('professionals')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setFormData({ name: data.name, role: data.role, image_url: data.image_url });
      setIsRegistered(true);
    }
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    const { error } = await supabase
      .from('professionals')
      .upsert({
        id: userId,
        organization_id: orgId,
        name: formData.name,
        role: formData.role,
        image_url: formData.image_url
      });

    if (error) alert("Erro ao salvar: " + error.message);
    else {
      alert("Perfil de profissional atualizado!");
      setIsRegistered(true);
    }
    setSaving(false);
  }

  if (loading) return <Loader2 className="animate-spin mx-auto text-blue-600" />;

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
          <UserPlus size={20} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">
          {isRegistered ? 'Meu Perfil Profissional' : 'Tornar-se um Barbeiro'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Nome Exibido</label>
          <input 
            type="text" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Ex: Gabriel Silva"
            className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Especialidade</label>
          <input 
            type="text" 
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            placeholder="Ex: Especialista em Degradê"
            className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">URL da Foto</label>
          <div className="flex gap-4">
            <input 
              type="text" 
              value={formData.image_url}
              onChange={(e) => setFormData({...formData, image_url: e.target.value})}
              className="flex-1 p-3 rounded-xl border border-gray-100 bg-gray-50 text-xs"
            />
            <img src={formData.image_url} className="w-12 h-12 rounded-xl object-cover border" alt="Preview" />
          </div>
        </div>
      </div>

      <button 
        onClick={handleSave}
        disabled={saving || !formData.name}
        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-tighter hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:bg-gray-200"
      >
        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
        {isRegistered ? 'Atualizar Perfil' : 'Ativar meu Perfil de Barbeiro'}
      </button>
    </div>
  );
}