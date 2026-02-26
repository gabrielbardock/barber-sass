import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './services/supabase';
import { Loader2 } from 'lucide-react';

// Componentes Globais
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { Auth } from './components/Auth';

// Páginas
import { Home } from './pages/Home';
import { Booking } from './pages/Booking';
import { Dashboard } from './pages/Dashboard';
import { MasterAdmin } from './components/MasterAdmin';
import { UserAppointments } from './components/UserAppointments';
import { NotFound } from './pages/NotFound';

const MASTER_EMAIL = "gabriel.henrique.gf01@gmail.com";

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [orgData, setOrgData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const { data: { session: curSession } } = await supabase.auth.getSession();
        setSession(curSession);

        // Detecta organização pelo slug na URL
        const slug = window.location.pathname.split('/')[1] || '';
        if (slug && slug !== 'minha-agenda' && slug !== 'painel' && slug !== 'master') {
          const { data: org } = await supabase.from('organizations').select('*').eq('slug', slug).maybeSingle();
          setOrgData(org);
        }

        if (curSession) {
          const { data: prof } = await supabase.from('profiles').select('*').eq('id', curSession.user.id).maybeSingle();
          setProfile(prof);
        }
      } catch (e) {
        console.error("Erro na inicialização:", e);
      } finally {
        setLoading(false);
      }
    }
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  const isMaster = session?.user?.email === MASTER_EMAIL;
  const isAdmin = isMaster || (profile?.id === orgData?.owner_id);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Mostra Navegação apenas se estiver logado */}
        {session && <Header orgName={orgData?.name} isAdmin={isAdmin} isMaster={isMaster} />}
        
        <main className="flex-1 max-w-5xl mx-auto w-full p-4 pb-28 md:pb-8">
          <Routes>
            {/* ROTA PÚBLICA */}
            <Route path="/" element={<Home />} />

            {/* ROTAS PROTEGIDAS (Exigem Login) */}
            <Route path="/minha-agenda" element={
              session ? <UserAppointments userEmail={session.user.email} /> : <Auth onLoginSuccess={() => window.location.reload()} />
            } />

            <Route path="/painel" element={
              session && isAdmin ? <Dashboard orgData={orgData} /> : <Navigate to="/" />
            } />

            <Route path="/master" element={
              session && isMaster ? <MasterAdmin /> : <Navigate to="/" />
            } />
            
            {/* ROTA DINÂMICA DA BARBEARIA */}
            <Route path="/:slug" element={
              !session ? (
                <Auth onLoginSuccess={() => window.location.reload()} />
              ) : orgData ? (
                <Booking orgData={orgData} session={session} />
              ) : (
                <NotFound />
              )
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {session && <MobileNav isAdmin={isAdmin} isMaster={isMaster} />}
      </div>
    </BrowserRouter>
  );
}