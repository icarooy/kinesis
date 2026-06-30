import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Home, Activity, MessageCircle, Trophy, User } from 'lucide-react';
import ResponsiveLayout from '../components/layout/ResponsiveLayout';
import ClubHomeScreen from './club/ClubHomeScreen';
import ActivitiesScreen from './club/ActivitiesScreen';
import ChatScreen from './club/ChatScreen';
import LeaderboardScreen from './club/LeaderboardScreen';
import CalendarScreen from './club/CalendarScreen';
import ClubPaymentsScreen from './club/ClubPaymentsScreen';
import ProfileScreen from './club/ProfileScreen';
import AthletesManagementScreen from './club/AthletesManagementScreen';
import ClassesManagementScreen from './club/ClassesManagementScreen';
import ClubProfileSettingsScreen from './club/ClubProfileSettingsScreen';

interface Props {
  onLogout: () => void;
}

/**
 * Dashboard do Clube com layout responsivo
 * 
 * Mobile (< 1024px): Bottom Tab Navigator com 5 abas
 * Desktop (≥ 1024px): Sidebar lateral fixa
 * 
 * Abas:
 * 1. Início - Visão geral do clube (com atalhos para Calendário e Pagamentos)
 * 2. Atividades - Feed de atividades
 * 3. Chat - Sistema de mensagens
 * 4. Ranking - Leaderboard de atletas
 * 5. Perfil - Configurações do usuário
 */
export default function ClubDashboard({ onLogout }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  // Configuração das abas de navegação
  const tabs = [
    { path: '/dashboard', label: 'Início', icon: Home },
    { path: '/dashboard/activities', label: 'Atividades', icon: Activity },
    { path: '/dashboard/chat', label: 'Chat', icon: MessageCircle },
    { path: '/dashboard/leaderboard', label: 'Ranking', icon: Trophy },
    { path: '/dashboard/profile', label: 'Perfil', icon: User },
  ];

  const currentPath = location.pathname;

  return (
    <ResponsiveLayout
      tabs={tabs}
      currentPath={currentPath}
      onNavigate={navigate}
      onLogout={onLogout}
      userRole="CLUB"
    >
      {/* Rotas das telas internas */}
      <Routes>
        <Route path="/" element={<ClubHomeScreen />} />
        <Route path="/activities" element={<ActivitiesScreen />} />
        <Route path="/chat" element={<ChatScreen />} />
        <Route path="/leaderboard" element={<LeaderboardScreen />} />
        <Route path="/calendar" element={<CalendarScreen />} />
        <Route path="/payments" element={<ClubPaymentsScreen />} />
        <Route path="/profile" element={<ProfileScreen onLogout={onLogout} />} />
        <Route path="/club-profile-settings" element={<ClubProfileSettingsScreen />} />
        <Route path="/athletes" element={<AthletesManagementScreen />} />
        <Route path="/classes" element={<ClassesManagementScreen />} />
      </Routes>
    </ResponsiveLayout>
  );
}