import { useState, useEffect } from 'react';

/**
 * Hook customizado para detectar breakpoints responsivos
 * 
 * Breakpoints:
 * - mobile: < 768px
 * - tablet: 768px - 1023px
 * - desktop: ≥ 1024px
 * 
 * @returns {object} Estado responsivo com flags booleanas e dimensões
 */
export function useResponsive() {
  // Estado para armazenar as dimensões da janela
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    // Função de debounce para evitar re-renders excessivos
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 150); // Debounce de 150ms
    };

    // Adicionar listener de resize
    window.addEventListener('resize', handleResize);

    // Chamar uma vez para garantir valores corretos
    handleResize();

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Calcular flags de breakpoint
  const isMobile = dimensions.width < 768;
  const isTablet = dimensions.width >= 768 && dimensions.width < 1024;
  const isDesktop = dimensions.width >= 1024;

  // Para compatibilidade com React Native (caso necessário no futuro)
  const isSmallDevice = dimensions.width < 375;
  const isLargeDevice = dimensions.width >= 1440;

  return {
    // Dimensões
    width: dimensions.width,
    height: dimensions.height,
    
    // Breakpoints
    isMobile,
    isTablet,
    isDesktop,
    
    // Extras
    isSmallDevice,
    isLargeDevice,
    
    // Helper para verificar se deve mostrar bottom nav
    shouldShowBottomNav: isMobile || isTablet,
    
    // Helper para verificar se deve mostrar sidebar
    shouldShowSidebar: isDesktop,
  };
}

/**
 * Hook alternativo mais simples que apenas verifica se é desktop
 */
export function useIsDesktop() {
  const { isDesktop } = useResponsive();
  return isDesktop;
}

/**
 * Hook que retorna apenas a largura (para casos específicos)
 */
export function useScreenWidth() {
  const { width } = useResponsive();
  return width;
}
