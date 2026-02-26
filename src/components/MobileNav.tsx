import { CalendarCheck, History, LayoutDashboard, ShieldCheck, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabase';

export function MobileNav({ isAdmin, isMaster }: any) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex md:hidden justify-around items-center p-3 pb-8 z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
      <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-blue-600' : 'text-gray-300'}`}>
        <CalendarCheck size={22} /><span className="text-[10px] font-bold uppercase">Agendar</span>
      </Link>
      
      <Link to="/minha-agenda" className={`flex flex-col items-center gap-1 ${isActive('/minha-agenda') ? 'text-blue-600' : 'text-gray-400'}`}>
        <History size={22} /><span className="text-[10px] font-bold uppercase">Agenda</span>
      </Link>

      {isAdmin && (
        <Link to="/painel" className={`flex flex-col items-center gap-1 ${isActive('/painel') ? 'text-blue-600' : 'text-gray-400'}`}>
          <LayoutDashboard size={22} /><span className="text-[10px] font-bold uppercase">Painel</span>
        </Link>
      )}

      {isMaster && (
        <Link to="/master" className={`flex flex-col items-center gap-1 ${isActive('/master') ? 'text-emerald-500' : 'text-gray-300'}`}>
          <ShieldCheck size={22} /><span className="text-[10px] font-bold uppercase">Master</span>
        </Link>
      )}

      <button onClick={() => supabase.auth.signOut()} className="flex flex-col items-center gap-1 text-gray-300">
        <LogOut size={22} /><span className="text-[10px] font-bold uppercase">Sair</span>
      </button>
    </nav>
  );
}