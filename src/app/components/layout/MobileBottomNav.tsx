import { LucideIcon } from 'lucide-react';

/**
 * Interface para tabs de navegação
 */
export interface NavigationTab {
  path: string;
  label: string;
  icon: LucideIcon;
}

interface MobileBottomNavProps {
  tabs: NavigationTab[];
  currentPath: string;
  onNavigate: (path: string) => void;
}

/**
 * Bottom Tab Navigator para mobile/tablet (< 1024px)
 * 
 * Mantém o design original do Figma com:
 * - Fixado na parte inferior da tela
 * - Grid responsivo baseado no número de tabs (4, 5, 6 ou 7 colunas)
 * - Ícones + labels pequenos
 * - Item ativo em preto
 * - Animação de entrada suave
 * 
 * @param {NavigationTab[]} tabs - Array de abas de navegação
 * @param {string} currentPath - Caminho atual da rota
 * @param {function} onNavigate - Callback para navegação
 */
export default function MobileBottomNav({
  tabs,
  currentPath,
  onNavigate,
}: MobileBottomNavProps) {
  // Calcula o número de colunas baseado no número de tabs
  const getGridCols = () => {
    switch (tabs.length) {
      case 4:
        return 'grid-cols-4';
      case 5:
        return 'grid-cols-5';
      case 6:
        return 'grid-cols-6';
      case 7:
        return 'grid-cols-7';
      default:
        return 'grid-cols-5';
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <div className={`max-w-2xl mx-auto grid ${getGridCols()} gap-1 px-2 py-2`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            currentPath === tab.path ||
            (tab.path !== '/dashboard' && currentPath.startsWith(tab.path));

          return (
            <button
              key={tab.path}
              onClick={() => onNavigate(tab.path)}
              className={`
                flex flex-col items-center gap-1 py-2 px-1 rounded-lg
                ${isActive ? 'text-black' : 'text-gray-400'}
              `}
            >
              <Icon 
                size={20} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={`
                  text-[10px] leading-tight text-center w-full truncate
                  ${isActive ? 'font-semibold' : 'font-medium'}
                `}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}