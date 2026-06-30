import { motion } from 'motion/react';
import { Mail, Settings, LogOut, Shield, User, Calendar, Phone, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  onLogout: () => void;
  userRole?: 'CLUB' | 'ATHLETE';
}

export default function ProfileScreen({ onLogout, userRole = 'CLUB' }: Props) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (confirm('Deseja realmente sair da sua conta?')) {
      onLogout();
      window.location.href = '/';
    }
  };

  const handleSettings = () => {
    if (userRole === 'ATHLETE') {
      navigate('/dashboard/settings');
    } else {
      navigate('/dashboard/club-profile-settings');
    }
  };

  // Dados mockados do atleta
  const athleteData = {
    name: 'João Silva',
    category: 'Sub-15 Masculino',
    sport: 'Futebol',
    birthDate: '15/03/2009',
    age: 15,
    email: 'joao.silva@email.com',
    guardian: 'Maria Silva',
    guardianPhone: '(11) 98765-4321',
  };

  // Dados mockados do clube
  const clubData = {
    name: 'FC Barcelona Academy',
    role: 'Proprietário do Clube',
    email: 'admin@fcbarcelona.com',
    clubCode: '483921',
  };

  return (
    <div className="min-h-screen bg-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="p-6 pt-12"
      >
        <h1 className="text-2xl font-bold mb-8">Perfil</h1>

        {/* Profile Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mb-4">
            <span className="text-white font-bold text-3xl">
              {userRole === 'ATHLETE' ? 'J' : 'F'}
            </span>
          </div>
          <h2 className="text-xl font-bold mb-1">
            {userRole === 'ATHLETE' ? athleteData.name : clubData.name}
          </h2>
          <p className="text-gray-600 text-sm">
            {userRole === 'ATHLETE' 
              ? `${athleteData.category} • ${athleteData.sport}` 
              : clubData.role
            }
          </p>
        </motion.div>

        {/* Informações */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-8"
        >
          <h3 className="font-semibold mb-4">Informações</h3>
          <div className="space-y-3">
            {/* Email */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <Mail size={20} className="text-gray-600" />
              <span className="text-sm">
                {userRole === 'ATHLETE' ? athleteData.email : clubData.email}
              </span>
            </div>

            {userRole === 'ATHLETE' ? (
              <>
                {/* Data de Nascimento / Idade */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <Calendar size={20} className="text-gray-600" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-600 mb-1">Data de Nascimento</div>
                    <div className="text-sm font-medium">{athleteData.birthDate} ({athleteData.age} anos)</div>
                  </div>
                </div>

                {/* Responsável */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <Users size={20} className="text-gray-600 mt-1" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-600 mb-1">Responsável</div>
                    <div className="text-sm font-medium mb-1">{athleteData.guardian}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={14} />
                      {athleteData.guardianPhone}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Código do Clube */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <Shield size={20} className="text-gray-600 mt-1" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-600 mb-1">Código do Clube</div>
                    <div className="text-lg font-bold tracking-[0.2em]">{clubData.clubCode}</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Configurações */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <h3 className="font-semibold mb-4">Configurações</h3>
          <div className="space-y-3">
            <button
              onClick={handleSettings}
              className="w-full flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-black transition-colors"
            >
              <Settings size={20} />
              <span className="font-medium">Configurações</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-red-500 hover:text-red-500 transition-colors text-red-500"
            >
              <LogOut size={20} />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}