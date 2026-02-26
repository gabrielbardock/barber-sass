import { SearchX, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      <div className="bg-red-50 p-6 rounded-full text-red-500 mb-6 shadow-sm">
        <SearchX size={60} strokeWidth={1.5} />
      </div>
      
      <h2 className="text-3xl font-black text-gray-800 tracking-tighter italic mb-2">
        BARBEARIA NÃO ENCONTRADA
      </h2>
      
      <p className="text-gray-500 max-w-xs mx-auto mb-8">
        O link que você acessou não pertence a nenhuma unidade ativa no sistema.
      </p>

      <div className="flex flex-col w-full max-w-xs gap-3">
        <button 
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
        >
          <Home size={18} /> Ir para o Início
        </button>
        
        <button 
          onClick={() => navigate(-1)}
          className="bg-white text-gray-500 py-4 rounded-2xl font-bold border border-gray-200 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
        >
          <ArrowLeft size={18} /> Voltar
        </button>
      </div>
    </div>
  );
}