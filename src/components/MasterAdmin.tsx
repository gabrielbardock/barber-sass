import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Building2, Plus, Link as LinkIcon, ShieldCheck, Loader2, User } from 'lucide-react';

export function MasterAdmin() {
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newOrg, setNewOrg] = useState({ name: '', slug: '', owner_email: '' });

  useEffect(() => { fetchOrgs(); }, []);

  async function fetchOrgs() {
    setLoading(true);
    const { data } = await supabase.from('organizations').select('*').order('created_at', { ascending: false });
    if (data) setOrgs(data);
    setLoading(false);
  }

  async function handleCreateOrg() {
    if (!newOrg.name || !newOrg.slug || !newOrg.owner_email) return alert("Preencha todos os campos");
    
    setLoading(true);

    console.log('testeeee', newOrg)

    // 1. Buscamos o usuário pelo e-mail (usando .maybeSingle() em vez de .single())
    // O maybeSingle() retorna null se não encontrar nada, em vez de dar erro PGRST116
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', newOrg.owner_email.trim())
      .maybeSingle();

    if (userError) {
      alert("Erro ao buscar usuário: " + userError.message);
      setLoading(false);
      return;
    }

    if (!userData) {
      alert(`Usuário com o e-mail ${newOrg.owner_email} não encontrado. Peça para o dono criar uma conta no app primeiro.`);
      setLoading(false);
      return;
    }

    // 2. Se encontrou o usuário, cria a organização
    const { error: orgError } = await supabase.from('organizations').insert([
      { 
        name: newOrg.name, 
        slug: newOrg.slug.toLowerCase().trim(), 
        owner_id: userData.id 
      }
    ]);
    
    if (orgError) {
      alert("Erro ao criar barbearia: " + orgError.message);
    } else {
      alert("Barbearia cadastrada com sucesso!");
      setNewOrg({ name: '', slug: '', owner_email: '' });
      fetchOrgs();
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-2xl flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <ShieldCheck className="text-emerald-400" /> Master SaaS Control
          </h1>
          <p className="text-gray-400 text-sm">Controle global de organizações parceiras.</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-xs font-bold text-emerald-400 uppercase">Status do Sistema</p>
          <p className="text-xl font-black">100% ONLINE</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="font-bold flex items-center gap-2 text-gray-800"><Plus size={18}/> Nova Barbearia</h2>
          <input placeholder="Nome da Empresa" className="w-full p-3 rounded-xl border bg-gray-50 outline-none" onChange={e => setNewOrg({...newOrg, name: e.target.value})} value={newOrg.name} />
          <input placeholder="slug-da-url (ex: barbearia-vini)" className="w-full p-3 rounded-xl border bg-gray-50 outline-none" onChange={e => setNewOrg({...newOrg, slug: e.target.value})} value={newOrg.slug} />
          <input placeholder="E-mail do Admin/Dono" className="w-full p-3 rounded-xl border bg-gray-50 outline-none" onChange={e => setNewOrg({...newOrg, owner_email: e.target.value})} value={newOrg.owner_email} />
          <button onClick={handleCreateOrg} className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all">Ativar Empresa</button>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <h2 className="font-bold mb-4 flex items-center gap-2 text-gray-800"><Building2 size={18} /> Empresas na Base</h2>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {loading ? <Loader2 className="animate-spin mx-auto text-blue-600" /> : orgs.map(org => (
              <div key={org.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <p className="font-black text-gray-800 leading-none">{org.name}</p>
                  <p className="text-[10px] text-blue-600 font-bold mt-1 uppercase">/{org.slug}</p>
                </div>
                <div className="p-2 bg-white rounded-lg border shadow-sm"><User size={14} className="text-gray-400"/></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}