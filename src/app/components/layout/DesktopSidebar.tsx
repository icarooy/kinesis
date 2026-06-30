import { motion } from 'motion/react';
import { LogOut } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

/**
 * Interface para tabs de navegação
 */
export interface NavigationTab {
  path: string;
  label: string;
  icon: LucideIcon;
}

interface DesktopSidebarProps {
  tabs: NavigationTab[];
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout?: () => void;
  userRole?: 'CLUB' | 'ATHLETE';
}

/**
 * Sidebar lateral fixa para layout desktop (≥ 1024px)
 * 
 * Design minimalista monocromático com:
 * - Largura fixa de 280px
 * - Fundo branco com borda direita sutil
 * - Logo no topo
 * - Lista vertical de navegação
 * - Item ativo com background preto
 * - Logout no rodapé
 * 
 * @param {NavigationTab[]} tabs - Array de abas de navegação
 * @param {string} currentPath - Caminho atual da rota
 * @param {function} onNavigate - Callback para navegação
 * @param {function} onLogout - Callback para logout (opcional)
 * @param {string} userRole - Tipo de usuário para personalização (opcional)
 */
export default function DesktopSidebar({
  tabs,
  currentPath,
  onNavigate,
  onLogout,
  userRole = 'CLUB',
}: DesktopSidebarProps) {
  return (
    <motion.aside
      initial={{ x: -280, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed left-0 top-0 h-screen w-[280px] bg-white border-r border-gray-200 flex flex-col"
    >
      {/* Header - Logo */}
      <div className="px-6 py-8 border-b border-gray-100">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <h1 className="flex items-center">
         <span className="text-2xl font-black tracking-widest text-black">
  KINESIS
</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {userRole === 'CLUB' ? 'Painel do Clube' : 'Painel do Atleta'}
          </p>
        </motion.div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <div className="space-y-1">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive =
              currentPath === tab.path ||
              (tab.path !== '/dashboard' && currentPath.startsWith(tab.path));

            return (
              <motion.button
                key={tab.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate(tab.path)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200 group
                  ${
                    isActive
                      ? 'bg-black text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                  }
                `}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`
                    transition-transform duration-200
                    ${isActive ? '' : 'group-hover:scale-110'}
                  `}
                />
                <span
                  className={`
                    text-sm transition-all duration-200
                    ${isActive ? 'font-semibold' : 'font-medium'}
                  `}
                >
                  {tab.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* Footer - Logout */}
      {onLogout && (
        <div className="px-3 py-4 border-t border-gray-100">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogout}
            className="
              w-full flex items-center gap-3 px-4 py-3 rounded-lg
              text-gray-600 hover:bg-red-50 hover:text-red-600
              transition-all duration-200 group
            "
          >
            <LogOut
              size={20}
              strokeWidth={2}
              className="transition-transform duration-200 group-hover:scale-110"
            />
            <span className="text-sm font-medium">Sair</span>
          </motion.button>
        </div>
      )}

      {/* Decorative element - opcional */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-50" />
    </motion.aside>
  );
}