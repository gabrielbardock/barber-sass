import { useState } from 'react';
import { supabase } from '../services/supabase';
import { Scissors, Loader2, User, Mail, Lock, ArrowRight } from 'lucide-react';

export function Auth({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Estado para alternar entre Login e Cadastro
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); // Campo extra para o cadastro

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Lógica de Cadastro
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName, // Salva o nome nos metadados do usuário
            },
          },
        });

        if (error) throw error;
        alert('Conta criada com sucesso! Verifique seu e-mail ou faça login.');
        setIsSignUp(false); // Volta para tela de login após cadastrar
      } else {
        // Lógica de Login
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.session) onLoginSuccess();
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-sm w-full space-y-8 animate-in fade-in zoom-in duration-300">
        
        <form onSubmit={handleAuth} className="bg-white p-8 rounded-[40px] shadow-2xl shadow-blue-100/50 border border-gray-100 space-y-6">
          <div className="text-center space-y-2">
            <div className="bg-blue-600 w-16 h-16 rounded-[24px] flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-200 rotate-3">
              <Scissors className="text-white -rotate-3" size={32} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic uppercase">
              {isSignUp ? 'Criar Conta' : 'Acessar'}
            </h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">BarberSaaS Online</p>
          </div>

          <div className="space-y-3">
            {isSignUp && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Seu Nome Completo" 
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-gray-50 outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                  value={fullName} 
                  onChange={e => setFullName(e.target.value)} 
                  required 
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="email" 
                placeholder="E-mail" 
                className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-gray-50 outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="password" 
                placeholder="Senha" 
                className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-gray-50 outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>
          </div>

          <button 
            disabled={loading} 
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                {isSignUp ? 'Cadastrar agora' : 'Entrar no Sistema'} 
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-gray-400 hover:text-blue-600 font-bold text-sm transition-colors"
          >
            {isSignUp ? (
              <>Já tem uma conta? <span className="text-blue-600">Faça login</span></>
            ) : (
              <>Novo por aqui? <span className="text-blue-600">Crie sua conta</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}