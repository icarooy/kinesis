import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Home, Activity, MessageCircle, User } from 'lucide-react';
import ResponsiveLayout from '../components/layout/ResponsiveLayout';
import AthleteHomeScreen from './athlete/AthleteHomeScreen';
import ActivitiesScreen from './club/ActivitiesScreen';
import ChatScreen from './club/ChatScreen';
import CalendarScreen from './athlete/CalendarScreen';
import PaymentsScreen from './athlete/PaymentsScreen';
import ProfileScreen from './club/ProfileScreen';
import AthleteProfileSettingsScreen from './athlete/AthleteProfileSettingsScreen';

interface Props {
  onLogout: () => void;
}

/**
 * Dashboard do Atleta com layout responsivo
 * 
 * Mobile (< 1024px): Bottom Tab Navigator com 4 abas
 * Desktop (≥ 1024px): Sidebar lateral fixa
 * 
 * Abas:
 * 1. Início - Dashboard do atleta (com atalhos para Calendário e Pagamentos)
 * 2. Atividades - Feed de atividades (compartilhado com clube)
 * 3. Chat - Sistema de mensagens (compartilhado com clube)
 * 4. Perfil - Configurações do usuário
 */
export default function AthleteDashboard({ onLogout }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  // Configuração das abas de navegação (4 abas para atleta)
  const tabs = [
    { path: '/dashboard', label: 'Início', icon: Home },
    { path: '/dashboard/activities', label: 'Atividades', icon: Activity },
    { path: '/dashboard/chat', label: 'Chat', icon: MessageCircle },
    { path: '/dashboard/profile', label: 'Perfil', icon: User },
  ];

  const currentPath = location.pathname;

  return (
    <ResponsiveLayout
      tabs={tabs}
      currentPath={currentPath}
      onNavigate={navigate}
      onLogout={onLogout}
      userRole="ATHLETE"
    >
      {/* Rotas das telas internas com transição de entrada/saída por rota */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPath}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <Routes location={location}>
            <Route path="/" element={<AthleteHomeScreen />} />
            <Route path="/activities" element={<ActivitiesScreen />} />
            <Route path="/chat" element={<ChatScreen />} />
            <Route path="/calendar" element={<CalendarScreen />} />
            <Route path="/payments" element={<PaymentsScreen />} />
            <Route path="/profile" element={<ProfileScreen onLogout={onLogout} userRole="ATHLETE" />} />
            <Route path="/settings" element={<AthleteProfileSettingsScreen />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </ResponsiveLayout>
  );
}