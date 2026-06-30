# 📐 Componentes de Layout Responsivo

## Estrutura de Arquivos

```
components/layout/
├── ResponsiveLayout.tsx      # Componente principal (orquestrador)
├── DesktopSidebar.tsx        # Sidebar para desktop (≥ 1024px)
├── MobileBottomNav.tsx       # Bottom nav para mobile (< 1024px)
└── README.md                 # Este arquivo
```

---

## 🎯 Como Funciona

### Fluxo de Renderização

```
ResponsiveLayout
    │
    ├─> useResponsive() hook
    │   └─> Detecta: isMobile / isTablet / isDesktop
    │
    ├─> if (shouldShowSidebar) → DesktopSidebar
    │   └─> Renderiza sidebar lateral fixa
    │
    ├─> Main Content (children)
    │   └─> Aplica padding automático
    │
    └─> if (shouldShowBottomNav) → MobileBottomNav
        └─> Renderiza bottom tabs fixo
```

---

## 📱 Mobile Layout (< 1024px)

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│        CONTENT AREA                 │
│        (children)                   │
│                                     │
│                                     │
│                                     │
├─────────────────────────────────────┤
│ 🏠  ⚡  💬  🏆  📅  💰  👤         │ ← Bottom Nav
└─────────────────────────────────────┘
```

**Características:**
- Bottom Nav fixo com 6-7 ícones
- Content com `pb-20` (padding inferior)
- Animação de slide-up ao entrar
- Grid responsivo automático

---

## 💻 Desktop Layout (≥ 1024px)

```
┌──────────────┬───────────────────────────────┐
│  KINESIS     │                               │
│              │                               │
│  🏠 Início   │                               │
│  ⚡ Ativs    │        CONTENT AREA           │
│  💬 Chat     │        (children)             │
│  🏆 Ranking  │                               │
│  📅 Calendr  │                               │
│  💰 Pagtos   │                               │
│  👤 Perfil   │                               │
│              │                               │
│  ──────────  │                               │
│  🚪 Sair     │                               │
└──────────────┴───────────────────────────────┘
    280px              Resto da tela
```

**Características:**
- Sidebar fixa de 280px
- Content com `ml-[280px]` (margem esquerda)
- Animação de slide-in ao entrar
- Item ativo com background preto

---

## 🔧 Uso dos Componentes

### 1. ResponsiveLayout (Componente Principal)

**Quando usar:**
- Em todos os dashboards (Club/Athlete)
- Quando precisar de navegação responsiva automática

**Exemplo:**
```tsx
<ResponsiveLayout
  tabs={[
    { path: '/home', label: 'Home', icon: Home },
    { path: '/settings', label: 'Settings', icon: Settings },
  ]}
  currentPath={location.pathname}
  onNavigate={navigate}
  onLogout={handleLogout}
  userRole="CLUB"
>
  <Routes>
    <Route path="/home" element={<HomePage />} />
    <Route path="/settings" element={<SettingsPage />} />
  </Routes>
</ResponsiveLayout>
```

---

### 2. DesktopSidebar (Uso Direto - Raro)

**Quando usar:**
- Casos especiais onde você precisa de sidebar personalizado
- Layouts customizados que não usam ResponsiveLayout

**Exemplo:**
```tsx
<DesktopSidebar
  tabs={tabs}
  currentPath={currentPath}
  onNavigate={navigate}
  onLogout={handleLogout}
  userRole="ATHLETE"
/>
```

**Customização:**
```tsx
// Mudar cor do item ativo
// Em DesktopSidebar.tsx, linha 75:
isActive
  ? 'bg-black text-white'              // Padrão
  ? 'bg-blue-600 text-white'           // Azul
  ? 'border-l-4 border-black bg-gray-50' // Borda lateral
```

---

### 3. MobileBottomNav (Uso Direto - Raro)

**Quando usar:**
- Layouts customizados que não usam ResponsiveLayout
- Casos onde você quer forçar bottom nav mesmo em desktop

**Exemplo:**
```tsx
<MobileBottomNav
  tabs={tabs}
  currentPath={currentPath}
  onNavigate={navigate}
/>
```

---

## 🎨 Customização de Estilos

### Cores e Tema

#### Sidebar (Desktop)
```tsx
// Fundo da sidebar
className="bg-white border-r border-gray-200"

// Item ativo
className="bg-black text-white"

// Item inativo
className="text-gray-600 hover:bg-gray-50"

// Logout (hover vermelho)
className="hover:bg-red-50 hover:text-red-600"
```

#### Bottom Nav (Mobile)
```tsx
// Fundo do bottom nav
className="bg-white border-t border-gray-200"

// Item ativo
className="text-black"

// Item inativo
className="text-gray-400"
```

---

### Dimensões

#### Sidebar
```tsx
// Largura (280px padrão)
const SIDEBAR_WIDTH = 280;

// Altura do header
const HEADER_HEIGHT = 88; // px-6 py-8

// Padding dos itens
const ITEM_PADDING = "px-4 py-3";
```

#### Bottom Nav
```tsx
// Altura automática (baseada no conteúdo)
// Grid columns: 6 ou 7
// Gap entre itens: gap-1 (4px)
// Padding: px-2 py-2
```

---

### Animações

#### Entrada da Sidebar
```tsx
initial={{ x: -280, opacity: 0 }}
animate={{ x: 0, opacity: 1 }}
transition={{ duration: 0.3, ease: 'easeOut' }}
```

#### Entrada do Bottom Nav
```tsx
initial={{ y: 100, opacity: 0 }}
animate={{ y: 0, opacity: 1 }}
transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
```

#### Hover nos Itens (Sidebar)
```tsx
whileHover={{ x: 4 }}  // Desliza 4px para direita
whileTap={{ scale: 0.98 }}
```

#### Tap nos Itens (Bottom Nav)
```tsx
whileTap={{ scale: 0.95 }}
```

---

## 📐 Breakpoints

Definidos em `hooks/useResponsive.ts`:

```tsx
const isMobile = width < 768;              // 0-767px
const isTablet = width >= 768 && < 1024;   // 768-1023px
const isDesktop = width >= 1024;           // 1024px+
```

**Para mudar:**
```tsx
// Arquivo: hooks/useResponsive.ts
const isDesktop = dimensions.width >= 1280; // Desktop em 1280px
```

---

## ⚡ Performance

### Otimizações Implementadas

1. **Debounce no resize**: 150ms
   ```tsx
   setTimeout(() => {
     setDimensions({ width, height });
   }, 150);
   ```

2. **AnimatePresence**: Renderiza apenas o layout ativo
   ```tsx
   <AnimatePresence>
     {shouldShowSidebar && <DesktopSidebar />}
   </AnimatePresence>
   ```

3. **CSS Transitions**: Mudanças de margem suaves
   ```tsx
   className="transition-all duration-300 ease-in-out"
   ```

4. **Memoização** (recomendado):
   ```tsx
   const tabs = useMemo(() => [
     { path: '/home', label: 'Home', icon: Home },
   ], []);
   ```

---

## 🧪 Testes

### Checklist de Testes

- [ ] Mobile (< 768px) → Bottom Nav aparece
- [ ] Tablet (768-1023px) → Bottom Nav aparece
- [ ] Desktop (≥ 1024px) → Sidebar aparece
- [ ] Redimensionar janela → Troca suave de layout
- [ ] Navegação funciona em ambos os layouts
- [ ] Item ativo destacado corretamente
- [ ] Logout funciona (se implementado)
- [ ] Animações suaves (60fps)
- [ ] Não há "pulo" ao trocar de layout

### Comando de Teste
```bash
# Rodar em diferentes tamanhos
npm run dev

# Testar:
1. 375px (iPhone SE)
2. 768px (iPad)
3. 1024px (Desktop pequeno)
4. 1920px (Desktop grande)
```

---

## 🔄 Versionamento

**v1.0.0** - Implementação inicial
- ResponsiveLayout base
- DesktopSidebar com 7 items (Clube)
- MobileBottomNav com 6-7 items
- Hook useResponsive com debounce

**Próximas features:**
- [ ] Sidebar colapsável (modo mini)
- [ ] Temas customizáveis
- [ ] Animações de transição entre páginas
- [ ] Suporte a gestos (swipe para navegação)

---

## 📝 Notas Técnicas

### Por que não usar CSS Media Queries?

Decidimos usar JavaScript (useResponsive hook) em vez de CSS media queries porque:

1. **Controle de Renderização**: Evita renderizar componentes desnecessários
2. **Lógica Condicional**: Permite decisões complexas baseadas em múltiplos fatores
3. **Animações**: Controle fino sobre animações de entrada/saída
4. **State Management**: Mais fácil integrar com estado do React
5. **Testabilidade**: Mais fácil mockar tamanhos de tela em testes

### Por que AnimatePresence?

```tsx
<AnimatePresence>
  {shouldShowSidebar && <DesktopSidebar />}
</AnimatePresence>
```

- Permite animações de saída antes de desmontar
- Evita "pulo" visual ao trocar de layout
- Sincroniza animações de entrada/saída

### Por que Sidebar fixa?

Sidebar fixa (`position: fixed`) em vez de relativa porque:
- Permanece visível ao rolar o conteúdo
- Padrão em apps desktop modernos (Slack, Discord, etc.)
- Melhor UX para navegação frequente

---

## 🆘 Troubleshooting

### Problema: Sidebar não aparece

**Solução:**
```tsx
// Verifique se o hook está retornando corretamente
const { shouldShowSidebar } = useResponsive();
console.log('shouldShowSidebar:', shouldShowSidebar);
```

### Problema: Conteúdo cortado no desktop

**Solução:**
```tsx
// Verifique se a margem esquerda está aplicada
className={`${shouldShowSidebar ? 'ml-[280px]' : 'ml-0'}`}
```

### Problema: Animações "pulando"

**Solução:**
```tsx
// Adicione transition CSS
className="transition-all duration-300 ease-in-out"
```

---

**Documentação criada para facilitar manutenção e extensão do sistema** 🚀
