# 📱💻 Guia de Uso - Sistema Responsivo Esportiva

## 🎯 Visão Geral

O sistema responsivo implementado permite que o app **Esportiva (Kinesis)** funcione perfeitamente tanto em **dispositivos móveis** quanto em **navegadores desktop**, alternando automaticamente entre dois layouts:

### 📱 **Mobile/Tablet (< 1024px)**
- Bottom Tab Navigator fixo na parte inferior
- 6 abas (Atleta) ou 7 abas (Clube)
- Ícones + labels pequenos
- Animação de entrada suave

### 💻 **Desktop (≥ 1024px)**
- Sidebar lateral fixa (280px)
- Logo KINESIS no topo
- Lista vertical de navegação
- Item ativo com background preto
- Botão de logout no rodapé

---

## 🚀 Como Usar

### 1. **Hook useResponsive**

Use em qualquer componente para detectar o tamanho da tela:

```tsx
import { useResponsive } from '../hooks/useResponsive';

function MyComponent() {
  const { isMobile, isTablet, isDesktop, width } = useResponsive();

  return (
    <div>
      {isMobile && <p>Você está no mobile</p>}
      {isDesktop && <p>Você está no desktop</p>}
      <p>Largura atual: {width}px</p>
    </div>
  );
}
```

**Valores disponíveis:**
```typescript
{
  width: number;              // Largura atual da janela
  height: number;             // Altura atual da janela
  isMobile: boolean;          // < 768px
  isTablet: boolean;          // 768px - 1023px
  isDesktop: boolean;         // ≥ 1024px
  isSmallDevice: boolean;     // < 375px
  isLargeDevice: boolean;     // ≥ 1440px
  shouldShowBottomNav: boolean; // isMobile || isTablet
  shouldShowSidebar: boolean;   // isDesktop
}
```

---

### 2. **Componente ResponsiveLayout**

Envolve suas rotas e gerencia automaticamente a navegação:

```tsx
import ResponsiveLayout from '../components/layout/ResponsiveLayout';

function Dashboard({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: '/dashboard', label: 'Início', icon: Home },
    { path: '/dashboard/chat', label: 'Chat', icon: MessageCircle },
    // ... mais tabs
  ];

  return (
    <ResponsiveLayout
      tabs={tabs}
      currentPath={location.pathname}
      onNavigate={navigate}
      onLogout={onLogout}
      userRole="CLUB" // ou "ATHLETE"
    >
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/chat" element={<ChatScreen />} />
      </Routes>
    </ResponsiveLayout>
  );
}
```

**Props:**
- `tabs`: Array de objetos `{ path, label, icon }`
- `currentPath`: Rota atual (`location.pathname`)
- `onNavigate`: Função de navegação (`navigate`)
- `onLogout`: (Opcional) Função de logout
- `userRole`: (Opcional) `'CLUB'` ou `'ATHLETE'`

---

### 3. **Componente DesktopSidebar**

Sidebar automática para desktop (raramente usado diretamente):

```tsx
import DesktopSidebar from '../components/layout/DesktopSidebar';

<DesktopSidebar
  tabs={tabs}
  currentPath={currentPath}
  onNavigate={navigate}
  onLogout={handleLogout}
  userRole="CLUB"
/>
```

---

### 4. **Componente MobileBottomNav**

Bottom nav automático para mobile (raramente usado diretamente):

```tsx
import MobileBottomNav from '../components/layout/MobileBottomNav';

<MobileBottomNav
  tabs={tabs}
  currentPath={currentPath}
  onNavigate={navigate}
/>
```

---

## 📐 Breakpoints

| Largura      | Categoria | Layout          | Navegação      |
|-------------|-----------|-----------------|----------------|
| < 768px     | Mobile    | Single column   | Bottom Tabs    |
| 768-1023px  | Tablet    | Single column   | Bottom Tabs    |
| ≥ 1024px    | Desktop   | Sidebar + main  | Sidebar        |

---

## 🎨 Customização de Estilos

### Alterar largura do Sidebar

Em `DesktopSidebar.tsx`:
```tsx
// Linha 51
className="... w-[280px] ..."  // Mude 280px para o valor desejado
```

E em `ResponsiveLayout.tsx`:
```tsx
// Linha 68
${shouldShowSidebar ? 'ml-[280px]' : 'ml-0'}  // Mude aqui também
```

### Alterar breakpoint Desktop

Em `hooks/useResponsive.ts`:
```tsx
// Linha 37-39
const isDesktop = dimensions.width >= 1024;  // Mude 1024 para o valor desejado
```

### Alterar cores do Sidebar (item ativo)

Em `DesktopSidebar.tsx`:
```tsx
// Linha 75-77
${
  isActive
    ? 'bg-black text-white'  // Item ativo
    : 'text-gray-600 hover:bg-gray-50'  // Item inativo
}
```

**Alternativa com borda lateral:**
```tsx
${
  isActive
    ? 'border-l-4 border-black bg-gray-50 text-black'
    : 'border-l-4 border-transparent text-gray-600 hover:bg-gray-50'
}
```

---

## 🧪 Como Testar

### 1. **No navegador (Chrome DevTools)**

```bash
# Abrir o app
npm run dev

# No navegador:
1. Pressione F12 (DevTools)
2. Clique no ícone de dispositivo móvel (Ctrl+Shift+M)
3. Selecione diferentes tamanhos:
   - iPhone SE (375px) → Bottom Nav
   - iPad (768px) → Bottom Nav
   - Desktop (1280px) → Sidebar
4. Redimensione a janela manualmente
```

### 2. **Testes automatizados de breakpoints**

```tsx
// Exemplo de teste
describe('ResponsiveLayout', () => {
  it('should show sidebar on desktop', () => {
    // Mock window.innerWidth = 1280
    const { container } = render(<ResponsiveLayout {...props} />);
    expect(container.querySelector('aside')).toBeInTheDocument();
  });

  it('should show bottom nav on mobile', () => {
    // Mock window.innerWidth = 375
    const { container } = render(<ResponsiveLayout {...props} />);
    expect(container.querySelector('nav')).toBeInTheDocument();
  });
});
```

---

## 🔧 Solução de Problemas

### ❌ Sidebar não aparece no desktop

**Causa**: Breakpoint não está sendo detectado corretamente

**Solução**:
1. Verifique se o hook `useResponsive` está retornando `isDesktop: true`
2. Adicione um console.log temporário:
```tsx
const responsive = useResponsive();
console.log('Responsive state:', responsive);
```

---

### ❌ Bottom Nav e Sidebar aparecem juntos

**Causa**: Condicionais de renderização incorretas

**Solução**: Verifique em `ResponsiveLayout.tsx`:
```tsx
{shouldShowSidebar && <DesktopSidebar />}  // ✅ Correto (com &&)
{shouldShowBottomNav && <MobileBottomNav />}  // ✅ Correto (com &&)
```

---

### ❌ Transição entre layouts está "pulando"

**Causa**: Falta de transição CSS

**Solução**: Adicione em `ResponsiveLayout.tsx`:
```tsx
className="transition-all duration-300 ease-in-out"
```

---

### ❌ Conteúdo está cortado no desktop

**Causa**: Padding do sidebar não está sendo aplicado

**Solução**: Verifique em `ResponsiveLayout.tsx`:
```tsx
${shouldShowSidebar ? 'ml-[280px]' : 'ml-0'}  // ✅ Margem esquerda
```

---

## 📝 Exemplos Práticos

### Exemplo 1: Criar novo Dashboard com layout responsivo

```tsx
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Home, Settings } from 'lucide-react';
import ResponsiveLayout from '../components/layout/ResponsiveLayout';

export default function CustomDashboard({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: '/custom', label: 'Home', icon: Home },
    { path: '/custom/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <ResponsiveLayout
      tabs={tabs}
      currentPath={location.pathname}
      onNavigate={navigate}
      onLogout={onLogout}
    >
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/settings" element={<div>Settings</div>} />
      </Routes>
    </ResponsiveLayout>
  );
}
```

---

### Exemplo 2: Componente que se adapta ao layout

```tsx
import { useResponsive } from '../hooks/useResponsive';

export default function AdaptiveCard() {
  const { isMobile, isDesktop } = useResponsive();

  return (
    <div className={`
      p-4 rounded-lg
      ${isMobile ? 'w-full' : 'w-1/2'}
      ${isDesktop ? 'shadow-lg' : 'shadow-sm'}
    `}>
      <h2 className={isMobile ? 'text-lg' : 'text-2xl'}>
        Título Responsivo
      </h2>
      <p>Conteúdo que se adapta ao tamanho da tela</p>
    </div>
  );
}
```

---

### Exemplo 3: Ocultar elementos em mobile

```tsx
import { useResponsive } from '../hooks/useResponsive';

export default function Header() {
  const { isDesktop } = useResponsive();

  return (
    <header className="flex items-center justify-between p-4">
      <h1>Título</h1>
      
      {/* Este botão só aparece em desktop */}
      {isDesktop && (
        <button className="bg-black text-white px-4 py-2 rounded-lg">
          Ação Desktop
        </button>
      )}
    </header>
  );
}
```

---

## 🎯 Boas Práticas

### ✅ **DO (Faça)**

- Use o hook `useResponsive` para decisões de layout
- Mantenha a mesma funcionalidade em todos os tamanhos
- Teste em múltiplos breakpoints
- Use transições CSS suaves
- Memoize componentes pesados

### ❌ **DON'T (Não Faça)**

- Não use CSS media queries no lugar do hook
- Não renderize conteúdo diferente por plataforma (mesmo UX)
- Não hardcode tamanhos de tela
- Não crie layouts específicos de plataforma desnecessariamente

---

## 🔄 Migração de Dashboards Existentes

### Antes (Bottom Nav fixo):
```tsx
export default function OldDashboard() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 overflow-auto pb-20">
        <Routes>...</Routes>
      </div>
      <motion.nav className="fixed bottom-0 ...">
        {/* Bottom navigation */}
      </motion.nav>
    </div>
  );
}
```

### Depois (Responsivo):
```tsx
export default function NewDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [...]; // Defina suas abas

  return (
    <ResponsiveLayout
      tabs={tabs}
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <Routes>...</Routes>
    </ResponsiveLayout>
  );
}
```

---

## 📊 Performance

### Otimizações implementadas:

1. **Debounce no resize**: 150ms para evitar re-renders
2. **AnimatePresence**: Apenas componentes visíveis são renderizados
3. **CSS Transitions**: Animações com GPU
4. **Memoização**: Tabs são calculados uma vez

### Métricas esperadas:
- Mudança de breakpoint: < 100ms
- Re-render do layout: < 50ms
- FPS durante animação: 60fps

---

## 🆘 Suporte

Dúvidas? Verifique:
1. `/RESPONSIVE_ARCHITECTURE.md` - Arquitetura completa
2. Código-fonte dos componentes (bem comentado)
3. Console do navegador para erros de runtime

---

**Implementado com ❤️ para Esportiva (Kinesis)**
