import { User, Mail, Phone } from 'lucide-react';

interface ClientFormData {
  name: string;
  email: string;
  phone: string;
}

interface ClientFormProps {
  data: ClientFormData;
  onChange: (data: ClientFormData) => void;
}

export function ClientForm({ data, onChange }: ClientFormProps) {
  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="bg-blue-100 text-blue-600 p-1 rounded-full"><User size={16}/></span>
        5. Seus Dados para Contato
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-2xl border shadow-sm">
        {/* Nome */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Nome Completo</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Ex: Gabriel Silva"
              value={data.name}
              onChange={(e) => onChange({ ...data, name: e.target.value })}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">E-mail</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="gabriel@exemplo.com"
              value={data.email}
              onChange={(e) => onChange({ ...data, email: e.target.value })}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
            />
          </div>
        </div>

        {/* WhatsApp */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">WhatsApp</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="tel"
              placeholder="(16) 99999-9999"
              value={data.phone}
              onChange={(e) => onChange({ ...data, phone: e.target.value })}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
            />
          </div>
        </div>
      </div>
    </section>
  );
}