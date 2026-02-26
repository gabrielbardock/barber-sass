import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { Search, Scissors, Rocket, Loader2, ArrowRight, Clock, ShieldCheck } from 'lucide-react';

interface Suggestion {
  name: string;
  slug: string;
}

export function Home() {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('name, slug')
          .ilike('name', `%${search}%`)
          .limit(5);

        if (error) throw error;
        setSuggestions(data || []);
      } catch (err) {
        console.error('Erro ao buscar sugestões:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  const handleSelect = (slug: string) => {
    navigate(`/${slug}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section com Busca */}
      <section className="px-6 py-16 md:py-24 text-center space-y-8 max-w-4xl mx-auto animate-in fade-in duration-700">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest">
          <Rocket size={14} /> BarberSaaS v1.0
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black italic text-gray-900 tracking-tighter leading-none">
          Agende seu corte
        </h1>
        
        <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
          A plataforma definitiva para agendamentos online. Encontre sua barbearia e reserve seu horário.
        </p>

        {/* Container do Autocomplete */}
        <div className="relative max-w-lg mx-auto mt-10">
          <div className="relative group">
            <input
              type="text"
              placeholder="Nome da barbearia (ex: Gabriel)..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full pl-14 pr-12 py-6 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-[32px] outline-none font-bold text-gray-700 transition-all shadow-sm group-hover:shadow-md"
            />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            
            {loading && (
              <Loader2 className="absolute right-6 top-1/2 -translate-y-1/2 text-blue-600 animate-spin" size={20} />
            )}
          </div>

          {showSuggestions && search.length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-[24px] shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
              {suggestions.length > 0 ? (
                suggestions.map((item) => (
                  <button
                    key={item.slug}
                    onClick={() => handleSelect(item.slug)}
                    className="w-full px-6 py-4 text-left hover:bg-blue-50 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <p className="font-bold text-gray-800">{item.name}</p>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter italic">Link: /{item.slug}</p>
                    </div>
                    <ArrowRight className="text-blue-600 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" size={18} />
                  </button>
                ))
              ) : !loading && (
                <div className="px-6 py-8 text-center text-gray-400 italic text-sm">
                  Nenhuma barbearia encontrada.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Grid de Apresentação (Restaurado e Melhorado) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-12 max-w-5xl mx-auto border-t border-gray-50">
        <div className="p-8 bg-gray-50 rounded-[40px] space-y-4 hover:bg-gray-100 transition-colors group">
          <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
            <Clock size={24} />
          </div>
          <h3 className="font-black text-gray-800 uppercase text-xs tracking-widest">Agendamento 24h</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Seus clientes marcam o horário a qualquer momento, sem precisar de mensagens no WhatsApp.
          </p>
        </div>

        <div className="p-8 bg-gray-50 rounded-[40px] space-y-4 hover:bg-gray-100 transition-colors group">
          <div className="bg-emerald-500 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100 group-hover:scale-110 transition-transform">
            <ShieldCheck size={24} />
          </div>
          <h3 className="font-black text-gray-800 uppercase text-xs tracking-widest">Painel Master</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Controle total de profissionais, faturamento e serviços em um painel robusto.
          </p>
        </div>

        <div className="p-8 bg-gray-50 rounded-[40px] space-y-4 hover:bg-gray-100 transition-colors group">
          <div className="bg-orange-500 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-100 group-hover:scale-110 transition-transform">
            <Scissors size={24} />
          </div>
          <h3 className="font-black text-gray-800 uppercase text-xs tracking-widest">Foco no Mobile</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Interface otimizada para o uso rápido no celular, garantindo a melhor experiência.
          </p>
        </div>
      </section>

      {/* Clique fora fecha sugestões */}
      {showSuggestions && (
        <div className="fixed inset-0 z-40" onClick={() => setShowSuggestions(false)} />
      )}
    </div>
  );
}