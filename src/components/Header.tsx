import { Scissors, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabase';

export function Header({ orgName, isAdmin, isMaster }: any) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <header className="bg-white border-b p-4 sticky top-0 z-40 hidden md:block">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex flex-col">
          <h1 className="flex items-center gap-2 text-blue-600 font-black italic text-xl uppercase tracking-tighter">
            <Scissors size={20} /> BarberSaaS
          </h1>
          <span className="text-[10px] font-bold text-gray-400 uppercase">{orgName}</span>
        </Link>
        
        <nav className="flex items-center gap-2">
          {isMaster && <Link to="/master" className={`px-4 py-2 rounded-xl text-sm font-bold ${isActive('/master') ? 'bg-emerald-500 text-white' : 'text-emerald-500'}`}>Master</Link>}
          <Link to="/" className={`px-4 py-2 rounded-xl text-sm font-bold ${location.pathname === '/' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>Agendar</Link>
          <Link to="/minha-agenda" className={`px-4 py-2 rounded-xl text-sm font-bold ${isActive('/minha-agenda') ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>Minha Agenda</Link>
          {isAdmin && <Link to="/painel" className={`px-4 py-2 rounded-xl text-sm font-bold ${isActive('/painel') ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>Painel</Link>}
          <button onClick={() => supabase.auth.signOut()} className="p-2 text-gray-300 hover:text-red-500 ml-2"><LogOut size={20}/></button>
        </nav>
      </div>
    </header>
  );
}