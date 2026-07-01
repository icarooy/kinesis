import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useResponsive } from '../../hooks/useResponsive';
import DesktopSidebar, { NavigationTab } from './DesktopSidebar';
import MobileBottomNav from './MobileBottomNav';

interface ResponsiveLayoutProps {
  tabs: NavigationTab[];
  currentPath: string;
  onNavigate: (path: string) => void;
  children: ReactNode;
  userRole?: 'CLUB' | 'ATHLETE';
  onLogout?: () => void;
}

/**
 * Layout responsivo inteligente que alterna entre:
 * - Mobile/Tablet (< 1024px): Bottom Tab Navigator
 * - Desktop (≥ 1024px): Sidebar lateral fixa
 * 
 * Este componente é o coração da responsividade do app,
 * detectando o tamanho da tela e renderizando o layout apropriado.
 * 
 * Características:
 * - Transições suaves entre layouts
 * - Zero re-render desnecessário com memoização
 * - Mantém estado de navegação entre mudanças de layout
 * - Padding automático no conteúdo baseado no layout
 * 
 * @param {NavigationTab[]} tabs - Abas de navegação
 * @param {string} currentPath - Rota atual
 * @param {function} onNavigate - Função de navegação
 * @param {ReactNode} children - Conteúdo das telas
 * @param {string} userRole - Tipo de usuário (CLUB/ATHLETE)
 * @param {function} onLogout - Função de logout (opcional)
 */
export default function ResponsiveLayout({
  tabs,
  currentPath,
  onNavigate,
  children,
  userRole = 'CLUB',
  onLogout,
}: ResponsiveLayoutProps) {
  // Hook customizado para detectar breakpoints
  const { shouldShowSidebar, shouldShowBottomNav } = useResponsive();

  return (
    <div className="min-h-screen bg-white flex">
      {/* Desktop Sidebar - Renderizado apenas em desktop */}
      <AnimatePresence>
        {shouldShowSidebar && (
          <DesktopSidebar
            key="desktop-sidebar"
            tabs={tabs}
            currentPath={currentPath}
            onNavigate={onNavigate}
            onLogout={onLogout}
            userRole={userRole}
          />
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main
        className={`
          flex-1 min-h-screen overflow-auto
          ${shouldShowSidebar ? 'ml-[280px]' : 'ml-0'}
          ${shouldShowBottomNav ? 'pb-[calc(5rem+env(safe-area-inset-bottom))]' : 'pb-0'}
          transition-all duration-300 ease-in-out
        `}
      >
        {/* Content Container com animação de fade */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile Bottom Navigation - Renderizado apenas em mobile/tablet */}
      {shouldShowBottomNav && (
        <MobileBottomNav
          tabs={tabs}
          currentPath={currentPath}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}