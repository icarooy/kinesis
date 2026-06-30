# 📱 Esportiva (Kinesis) - Documentação Completa do Projeto

## 🎨 Design System

### Paleta de Cores

#### **Cores Principais (Implementadas)**
```
Monocromático:
- Preto Principal: #000000 (elementos principais, texto, backgrounds ativos)
- Branco: #FFFFFF (background principal, texto em preto)
- Cinza Claro: #F3F4F6 (cards secundários)
- Cinza Médio: #9CA3AF (texto secundário, ícones inativos)
- Cinza Borda: #E5E5E5 (bordas sutis)
```

#### **Cores da Nova Paleta (Planejadas para implementação)**
```
Principais:
- #003049 (Cosmos Blue) - Azul principal da marca
- #669BBC (Blue Marble) - Azul secundário

Background:
- #FAE1D2 (Varden) - Bege/background

Alertas:
- #C1121F (Crimson Blaze) - Vermelho alerta
- #780000 (Gochujang Red) - Vermelho escuro
```

**Status Atual**: Sistema monocromático implementado. Nova paleta definida mas ainda não aplicada.

---

### Tipografia

```
Fonte Principal: Inter / System Font
Pesos:
- 700 (Bold) - Títulos e números grandes
- 600 (Semibold) - Subtítulos e labels ativas
- 500 (Medium) - Labels padrão
- 400 (Regular) - Texto corrido

Tamanhos:
- text-4xl (36px) - Números de estatísticas
- text-2xl (24px) - Títulos de página
- text-lg (18px) - Subtítulos de seções
- text-base (16px) - Texto padrão
- text-sm (14px) - Texto secundário
- text-xs (12px) - Legendas e hints
- text-[10px] - Labels de navegação
```

**Estilo**: Geométrico minimalista, tracking reduzido para códigos/números.

---

### Componentes UI

**Base**: Shadcn/UI + Tailwind CSS
**Animações**: Motion (Framer Motion)

Principais componentes:
- Cards com `rounded-2xl` (16px border radius)
- Botões com estados hover/active
- Inputs com bordas sutis
- Modais com backdrop blur
- Bottom sheets para mobile
- Toasts para notificações

---

## 🗺️ Arquitetura de Navegação

### Fluxo Geral do App

```
APP START
    ↓
┌─────────────────────┐
│  Onboarding         │ (3 telas, apenas na primeira vez)
│  - Tela 1/3         │
│  - Tela 2/3         │
│  - Tela 3/3         │
└─────────────────────┘
    ↓
┌─────────────────────┐
│  Login/Register     │
│  - Login Screen     │
│  - Register Screen  │
└─────────────────────┘
    ↓
    ├─ Se CLUBE_OWNER → Dashboard Clube (7 abas)
    │
    └─ Se ATLETA/ADMIN → Club Connection Screen
                            ↓
                         Dashboard Atleta (6 abas)
```

---

## 📱 Fluxo de Telas Detalhado

### 1️⃣ **Onboarding** (Primeira Experiência)

```
Tela 1: OnboardingScreen1
├─ Imagem ilustrativa
├─ Título: "Gerencie seu clube esportivo"
├─ Descrição
└─ Botão: "Próximo" → OnboardingScreen2

Tela 2: OnboardingScreen2
├─ Imagem ilustrativa
├─ Título: "Organize treinos e eventos"
├─ Descrição
└─ Botão: "Próximo" → OnboardingScreen3

Tela 3: OnboardingScreen3
├─ Imagem ilustrativa
├─ Título: "Conecte-se com atletas"
├─ Descrição
└─ Botão: "Começar" → LoginScreen
```

**Navegação**:
- Linear (1 → 2 → 3)
- Salva flag no localStorage: `hasSeenOnboarding: true`
- Nunca mais aparece após conclusão

---

### 2️⃣ **Autenticação**

#### **Login Screen**
```
┌─────────────────────────────┐
│  Logo KINESIS               │
│                             │
│  [Email Input]              │
│  [Senha Input]              │
│                             │
│  [Botão: Entrar]            │
│                             │
│  Não tem conta?             │
│  → Link: Cadastre-se        │
└─────────────────────────────┘
```

**Fluxo após login**:
- Identifica tipo de usuário
- `CLUB_OWNER` → Dashboard Clube direto
- `ATHLETE` ou `CLUB_ADMIN` → Tela de conexão com clube

#### **Register Screen**
```
┌─────────────────────────────┐
│  Criar Conta                │
│                             │
│  [Nome Input]               │
│  [Email Input]              │
│  [Senha Input]              │
│  [Confirmar Senha]          │
│                             │
│  Tipo de usuário:           │
│  ○ Clube/Coordenador        │
│  ○ Atleta                   │
│                             │
│  [Botão: Cadastrar]         │
│                             │
│  Já tem conta?              │
│  → Link: Entrar             │
└─────────────────────────────┘
```

**Fluxo após cadastro**:
- `CLUB_OWNER` → Dashboard Clube (gera código de 6 dígitos)
- `ATHLETE` → Club Connection Screen

---

### 3️⃣ **Club Connection Screen** (Apenas para Atletas/Admins)

```
┌─────────────────────────────┐
│  Conectar ao Clube          │
│                             │
│  Digite o código do clube:  │
│                             │
│  ┌───┬───┬───┬───┬───┬───┐ │
│  │ 4 │ 8 │ 3 │ 9 │ 2 │ 1 │ │ (6 dígitos)
│  └───┴───┴───┴───┴───┴───┘ │
│                             │
│  ou                         │
│                             │
│  [Botão: Escanear QR Code]  │
│                             │
│  [Botão: Conectar]          │
└─────────────────────────────┘
```

**Após conexão bem-sucedida** → Dashboard Atleta

---

## 🏠 Dashboard do Clube (7 Abas)

### Estrutura de Navegação

```
┌─────────────────────────────────────────┐
│  [Conteúdo da aba ativa]                │
│                                         │
│                                         │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│ 🏠  ⚡  💬  🏆  📅  💰  👤             │ ← Bottom Nav (Mobile)
│ In  At  Ch  Ra  Ca  Pa  Pe              │
└─────────────────────────────────────────┘
```

**Desktop** → Sidebar lateral substitui o bottom nav

---

### Aba 1: **Home** (ClubHomeScreen) ✅ ATUAL

```
┌─────────────────────────────────────┐
│  Olá, Esportiva FC         [🔔] [E] │
│  Coordenador                        │
│                                     │
│  ┌──────────────┬─────────────────┐│
│  │ 👥 45        │ 📅 12           ││ ← CARDS CLICÁVEIS
│  │ Atletas      │ Próximos Eventos││   (recém implementados)
│  ├──────────────┼─────────────────┤│
│  │ 🏆 8         │ 💰 5            ││
│  │ Turmas       │ Cobranças Pend. ││
│  └──────────────┴─────────────────┘│
│                                     │
│  ┌───────────────────────────────┐ │
│  │  Código do Clube              │ │
│  │  483921                       │ │
│  └───────────────────────────────┘ │
│                                     │
│  Próximos Eventos                   │
│  ┌─────────────────────────────┐   │
│  │ Treino de Futebol           │   │
│  │ Segunda, 15h • Campo 1      │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Clicks implementados**:
1. **Card "Atletas"** → `/dashboard/athletes-management` (nova tela)
2. **Card "Próximos Eventos"** → `/dashboard/calendar` (existente)
3. **Card "Turmas"** → `/dashboard/classes-management` (nova tela)
4. **Card "Cobranças Pendentes"** → `/dashboard/payments` (existente)
5. **Notificação (🔔)** → Abre lista de notificações
6. **Avatar (E)** → Vai para Profile

---

### Aba 2: **Activities** (ActivitiesScreen)

```
┌─────────────────────────────────────┐
│  Atividades            [+ Criar]    │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [E] Esportiva FC            │   │
│  │ Compartilhou: Treino de hoje│   │
│  │ [Imagem/Vídeo]              │   │
│  │ ❤️ 45  💬 12  🔄 3          │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [M] Maria Silva             │   │
│  │ Parabéns campeões! 🏆       │   │
│  │ ❤️ 23  💬 5                 │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Funcionalidades**:
- Feed de posts (como Instagram)
- Criar novo post (texto, imagem, vídeo)
- Curtir, comentar, compartilhar
- Filtrar por turma

**Clicks**:
- **[+ Criar]** → Abre modal `CreatePostModal`
- **Post** → Abre detalhes com comentários
- **Avatar** → Vai para perfil do usuário

---

### Aba 3: **Chat** (ChatScreen)

```
┌─────────────────────────────────────┐
│  Conversas                          │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 👥 Turma Infantil           │   │
│  │ João: Confirmado para amanhã│   │
│  │ 14:30                    [3]│   │ (3 não lidas)
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 👥 Turma Juvenil            │   │
│  │ Maria: Vamos treinar! 💪    │   │
│  │ Ontem                       │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 👤 Pedro Costa              │   │
│  │ Você: Ok, até amanhã        │   │
│  │ 2 dias atrás                │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Tipos de chat**:
- Grupos por turma
- Mensagens diretas (1 a 1)
- Chat geral do clube

**Clicks**:
- **Conversa** → Abre `ChatRoom` com mensagens

#### Chat Room (ao clicar em uma conversa)

```
┌─────────────────────────────────────┐
│  ← Turma Infantil              [...] │
│                                     │
│           [Mensagem recebida]       │
│           João: Confirmado!         │
│           14:30                     │
│                                     │
│  [Sua mensagem]                     │
│  Ótimo! Vejo vocês amanhã           │
│  14:32                              │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Digite uma mensagem...    [📎]│ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

### Aba 4: **Leaderboard** (LeaderboardScreen)

```
┌─────────────────────────────────────┐
│  Ranking                 [Filtros]  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🥇 1º João Silva            │   │
│  │    1250 pontos              │   │
│  │    Turma Juvenil            │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🥈 2º Maria Costa           │   │
│  │    1180 pontos              │   │
│  │    Turma Juvenil            │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🥉 3º Pedro Oliveira        │   │
│  │    1050 pontos              │   │
│  │    Turma Infantil           │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 4º Ana Santos               │   │
│  │    980 pontos               │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Funcionalidades**:
- Ranking de atletas por pontos
- Filtrar por turma/modalidade
- Podium destacado (1º, 2º, 3º)
- Click no atleta → Detalhes do perfil

---

### Aba 5: **Calendar** (ClubCalendarScreen)

```
┌─────────────────────────────────────┐
│  Calendário              [+ Evento] │
│                                     │
│  Janeiro 2024          [< >]        │
│  ┌─────────────────────────────┐   │
│  │ D  S  T  Q  Q  S  S         │   │
│  │    1  2  3  4  5  6         │   │
│  │ 7  8  9 10 11 12 13         │   │
│  │14 15 ●16 17 18 19 20        │   │ (●16 tem evento)
│  │21 22 23 24 25 26 27         │   │
│  │28 29 30 31                  │   │
│  └─────────────────────────────┘   │
│                                     │
│  Eventos do dia 16/01:              │
│  ┌─────────────────────────────┐   │
│  │ 15:00 - Treino de Futebol   │   │
│  │ Campo 1 • Turma Juvenil     │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 18:00 - Torneio Amistoso    │   │
│  │ Quadra 2 • Todas turmas     │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Funcionalidades**:
- Calendário interativo (date-fns)
- Criar eventos (treinos, jogos, torneios)
- Vincular evento a turmas
- Notificar atletas
- Visualizar por mês/semana/dia

**Clicks**:
- **[+ Evento]** → Modal de criação
- **Dia no calendário** → Mostra eventos daquele dia
- **Evento** → Detalhes e confirmação de presença

---

### Aba 6: **Payments** (ClubPaymentsScreen)

```
┌─────────────────────────────────────┐
│  Cobranças               [+ Nova]   │
│                                     │
│  📊 Resumo                          │
│  ┌──────────────┬─────────────────┐│
│  │ R$ 12.500    │ R$ 3.200        ││
│  │ Total        │ Pendente        ││
│  └──────────────┴─────────────────┘│
│                                     │
│  Cobranças Ativas                   │
│  ┌─────────────────────────────┐   │
│  │ Mensalidade Janeiro         │   │
│  │ R$ 150,00 • Vence 05/01     │   │
│  │ ✅ 30 pagos | ⏳ 15 pendentes│   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Taxa Uniforme               │   │
│  │ R$ 80,00 • Vence 10/01      │   │
│  │ ✅ 20 pagos | ⏳ 5 pendentes │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Funcionalidades**:
- Criar cobranças (mensalidade, taxas, uniformes)
- Atribuir a turmas ou atletas individuais
- Acompanhar status de pagamento
- Histórico de pagamentos
- Enviar lembretes

**Clicks**:
- **[+ Nova]** → Modal `CreateChargeModal`
- **Cobrança** → Detalhes com lista de pagadores

---

### Aba 7: **Profile** (ProfileScreen)

```
┌─────────────────────────────────────┐
│  Perfil                             │
│                                     │
│  ┌─────────────────────────────┐   │
│  │         [Avatar E]          │   │
│  │     Esportiva FC            │   │
│  │  contato@esportivafc.com    │   │
│  └─────────────────────────────┘   │
│                                     │
│  ⚙️ Configurações                   │
│  ┌─────────────────────────────┐   │
│  │ Dados do Clube           >  │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ Notificações             >  │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ Privacidade              >  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🚪 Sair                     │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Funcionalidades**:
- Editar dados do clube
- Gerenciar notificações
- Configurações de privacidade
- Logout

---

## 👤 Dashboard do Atleta (6 Abas)

**Diferenças do Dashboard do Clube**:
- Remove aba "Leaderboard" (vê apenas sua posição)
- Remove controle de cobranças (apenas visualiza seus pagamentos)
- Algumas telas compartilhadas (Activities, Chat, Profile)

### Estrutura de Navegação

```
┌─────────────────────────────────────────┐
│  [Conteúdo da aba ativa]                │
│                                         │
├─────────────────────────────────────────┤
│ 🏠  ⚡  💬  📅  💰  👤                  │ ← Bottom Nav (6 ícones)
│ In  At  Ch  Ca  Pa  Pe                  │
└─────────────────────────────────────────┘
```

---

### Aba 1: **Home** (AthleteHomeScreen)

```
┌─────────────────────────────────────┐
│  Olá, João Silva!      [🔔] [J]     │
│  Turma Juvenil                      │
│                                     │
│  Suas Estatísticas                  │
│  ┌──────────────┬─────────────────┐│
│  │ 🏃 120       │ 🎯 85%          ││
│  │ Treinos      │ Presença        ││
│  └──────────────┴─────────────────┘│
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🏆 Seu Ranking              │   │
│  │ 5º lugar                    │   │
│  │ 890 pontos                  │   │
│  └─────────────────────────────┘   │
│                                     │
│  Próximo Treino                     │
│  ┌─────────────────────────────┐   │
│  │ Segunda, 15:00              │   │
│  │ Campo 1                     │   │
│  │ [Confirmar Presença]        │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Diferenças**:
- Foco em estatísticas pessoais
- Posição no ranking
- Próximos treinos/eventos
- Confirmação de presença

---

### Aba 2-6: Activities, Chat, Calendar, Payments, Profile

Mesmas telas do clube, mas com permissões diferentes:
- **Activities**: Pode criar posts, mas não moderar
- **Chat**: Participa dos chats, não cria grupos
- **Calendar**: Visualiza eventos, confirma presença
- **Payments**: Vê suas cobranças, histórico de pagamento
- **Profile**: Edita seus dados pessoais

---

## 📐 Responsividade Mobile/Desktop

### 🎯 Breakpoints

```
Mobile:    < 768px
Tablet:    768px - 1023px
Desktop:   ≥ 1024px
```

### 📱 Layout Mobile (< 1024px)

**Características**:
- Bottom Tab Navigator fixo
- 6 ou 7 ícones horizontais
- Conteúdo com `padding-bottom: 80px` (pb-20)
- Full width (100vw)
- Scroll vertical

**Visual**:
```
┌─────────────────────┐
│                     │ ← Status bar (iOS/Android)
│  [Header]           │
│                     │
│                     │
│   CONTENT AREA      │
│   (scroll vertical) │
│                     │
│                     │
│                     │
│                     │
│                     │
├─────────────────────┤
│ 🏠 ⚡ 💬 🏆 📅 💰 👤│ ← Bottom Nav (fixo)
└─────────────────────┘
   Safe area bottom
```

**Padding/Margens Mobile**:
```css
Container: px-6 (24px lateral)
Cards: p-4 ou p-5 (16-20px)
Gap entre cards: gap-3 (12px)
Bottom nav height: 64px + safe area
```

---

### 💻 Layout Desktop (≥ 1024px)

**Características**:
- Sidebar lateral fixa (280px)
- Conteúdo ao lado direito
- Margem esquerda: `margin-left: 280px`
- Sem bottom nav
- Grid de cards: 2 colunas

**Visual**:
```
┌────────────┬──────────────────────────────┐
│  KINESIS   │  [Header]                    │
│  Painel    │                              │
│  Clube     │  ┌──────────┬──────────┐     │
│            │  │  Card 1  │  Card 2  │     │
│ 🏠 Início  │  └──────────┴──────────┘     │
│            │                              │
│ ⚡ Ativids │  ┌──────────┬──────────┐     │
│            │  │  Card 3  │  Card 4  │     │
│ 💬 Chat    │  └──────────┴──────────┘     │
│            │                              │
│ 🏆 Ranking │  [Mais conteúdo]             │
│            │                              │
│ 📅 Calendr │                              │
│            │                              │
│ 💰 Pagtos  │                              │
│            │                              │
│ 👤 Perfil  │                              │
│            │                              │
│────────────│                              │
│ 🚪 Sair    │                              │
└────────────┴──────────────────────────────┘
    280px            Resto (flex-1)
```

**Layout Desktop - Cards em Grid**:
```
ClubHomeScreen Desktop:
┌──────────────┬──────────────┐
│ 👥 45        │ 📅 12        │
│ Atletas      │ Eventos      │
├──────────────┼──────────────┤
│ 🏆 8         │ 💰 5         │
│ Turmas       │ Cobranças    │
└──────────────┴──────────────┘

grid-cols-2 gap-3
```

---

### 🔄 Transição Mobile ↔ Desktop

**Como funciona**:
1. Hook `useResponsive()` detecta largura da janela
2. Se `width >= 1024px`:
   - Renderiza `<DesktopSidebar>`
   - Remove `<MobileBottomNav>`
   - Aplica `ml-[280px]` no conteúdo
3. Se `width < 1024px`:
   - Remove `<DesktopSidebar>`
   - Renderiza `<MobileBottomNav>`
   - Aplica `pb-20` no conteúdo

**Animações de transição**:
```
Sidebar entrada: slide-in (esquerda) + fade-in (300ms)
Bottom nav entrada: slide-up (baixo) + fade-in (400ms)
Conteúdo: ajuste de margem com transition-all (300ms)
```

---

## 🆕 Novas Telas (Planejadas)

### 1. **Athletes Management Screen** (nova)

```
┌─────────────────────────────────────┐
│  ← Atletas                [+ Novo]  │
│                                     │
│  [🔍 Buscar por nome...]            │
│                                     │
│  Filtros: [Idade ▼] [Modalidade ▼] │
│           [Turma ▼]                 │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [J] João Silva | 15 anos    │   │
│  │ Turma Juvenil • Futebol     │   │
│  │ ✅ Pagamento em dia    [...]│   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [M] Maria Costa | 14 anos   │   │
│  │ Turma Juvenil • Vôlei       │   │
│  │ ⏳ Pagamento pendente  [...]│   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [P] Pedro Oliveira | 12 anos│   │
│  │ Turma Infantil • Natação    │   │
│  │ ✅ Pagamento em dia    [...]│   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Campos de cadastro** (ao clicar [+ Novo]):
- Nome completo
- Idade/Data de nascimento
- Email
- Telefone
- Turma (dropdown)
- Modalidade (dropdown)
- Foto (upload)

**Filtros**:
- Busca por nome (TextInput com debounce)
- Range de idade (slider: 0-99 anos)
- Modalidade (dropdown: Futebol, Vôlei, Natação, etc.)
- Turma (dropdown)
- Status pagamento (todos, em dia, pendente)

**Clicks**:
- **Card do atleta** → Detalhes (editar/excluir)
- **[...]** → Menu rápido (editar/excluir/contatar)

---

### 2. **Classes Management Screen** (nova)

```
┌─────────────────────────────────────┐
│  ← Turmas                 [+ Nova]  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Turma Juvenil               │   │
│  │ Futebol • 14-17 anos        │   │
│  │ Seg/Qua 15:00 • Campo 1     │   │
│  │ 👥 25 atletas          [...]│   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Turma Infantil              │   │
│  │ Vôlei • 10-13 anos          │   │
│  │ Ter/Qui 16:00 • Quadra 2    │   │
│  │ 👥 18 atletas          [...]│   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Nataç��o Avançada            │   │
│  │ Natação • 15+ anos          │   │
│  │ Ter/Qui 18:00 • Piscina     │   │
│  │ 👥 12 atletas          [...]│   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Campos de cadastro** (ao clicar [+ Nova]):

Baseado na sua tabela:
- **Código da Turma**: Gerado automaticamente (id_turma)
- **Nome da Turma**: TextInput
- **Horário das Aulas**: Time picker (ex: "15:00")
- **Selecionar Clube**: Dropdown (FK - oferta)
- **Selecionar Modalidade**: Dropdown (FK - possui)
  - Opções: Futebol, Vôlei, Basquete, Natação, etc.
- **Selecionar Treinador**: Dropdown (FK - ministrada)
- **Selecionar Local**: Dropdown (FK - Rel)
  - Opções: Campo 1, Quadra 2, Piscina, Ginásio, etc.
- **Faixa Etária**: TextInput (ex: "10-13 anos")
- **Dias da Semana**: Multi-select (Seg, Ter, Qua, Qui, Sex, Sab, Dom)

**Funcionalidades**:
- Editar turma
- Excluir turma (com confirmação)
- Ver/gerenciar atletas da turma
- Atribuir novos atletas

**Clicks**:
- **Card da turma** → Detalhes e lista de atletas
- **[...]** → Menu rápido (editar/excluir/ver atletas)

---

## 🔗 Mapa Completo de Navegação

```
APP
│
├─ Onboarding (primeira vez)
│  ├─ Tela 1 → Tela 2 → Tela 3 → Login
│
├─ Login → [identifica usuário]
│  ├─ CLUB_OWNER → Dashboard Clube
│  └─ ATHLETE → Club Connection → Dashboard Atleta
│
└─ Register → [cria conta]
   ├─ CLUB_OWNER → Dashboard Clube
   └─ ATHLETE → Club Connection → Dashboard Atleta

DASHBOARD CLUBE (7 abas)
│
├─ Home (ClubHomeScreen)
│  ├─ Click: Card Atletas → Athletes Management ⭐ NOVA
│  ├─ Click: Card Eventos → Calendar
│  ├─ Click: Card Turmas → Classes Management ⭐ NOVA
│  ├─ Click: Card Cobranças → Payments
│  ├─ Click: Notificação → Lista de notificações
│  └─ Click: Avatar → Profile
│
├─ Activities (ActivitiesScreen)
│  ├─ Click: [+ Criar] → CreatePostModal
│  ├─ Click: Post → Detalhes/Comentários
│  └─ Click: Avatar → Perfil do usuário
│
├─ Chat (ChatScreen)
│  ├─ Click: Conversa → ChatRoom
│  └─ ChatRoom
│     ├─ Enviar mensagem
│     └─ Upload de mídia
│
├─ Leaderboard (LeaderboardScreen)
│  ├─ Click: [Filtros] → Filtrar por turma/modalidade
│  └─ Click: Atleta → Perfil do atleta
│
├─ Calendar (CalendarScreen)
│  ├─ Click: [+ Evento] → Criar evento
│  ├─ Click: Dia → Eventos do dia
│  └─ Click: Evento → Detalhes do evento
│
├─ Payments (ClubPaymentsScreen)
│  ├─ Click: [+ Nova] → CreateChargeModal
│  └─ Click: Cobrança → Detalhes e pagadores
│
└─ Profile (ProfileScreen)
   ├─ Click: Dados do Clube → Editar
   ├─ Click: Notificações → Configurar
   ├─ Click: Privacidade → Configurar
   └─ Click: Sair → Logout → Login

DASHBOARD ATLETA (6 abas)
│
├─ Home (AthleteHomeScreen)
│  ├─ Visualiza estatísticas pessoais
│  ├─ Confirma presença em eventos
│  └─ Vê seu ranking
│
├─ Activities (ActivitiesScreen) - Compartilhada
├─ Chat (ChatScreen) - Compartilhada
├─ Calendar (CalendarScreen) - Visualização
├─ Payments (PaymentsScreen) - Apenas seus pagamentos
└─ Profile (ProfileScreen) - Compartilhada

NOVAS TELAS ⭐
│
├─ Athletes Management
│  ├─ Lista de atletas
│  ├─ Busca por nome
│  ├─ Filtros (idade, modalidade, turma)
│  ├─ Click: [+ Novo] → Formulário de cadastro
│  └─ Click: Atleta → Detalhes/Editar/Excluir
│
└─ Classes Management
   ├─ Lista de turmas
   ├─ Click: [+ Nova] → Formulário de cadastro
   │  └─ Campos:
   │     ├─ Código (auto)
   │     ├─ Nome
   │     ├─ Horário
   │     ├─ Clube (dropdown)
   │     ├─ Modalidade (dropdown)
   │     ├─ Treinador (dropdown)
   │     ├─ Local (dropdown)
   │     └─ Faixa etária
   │
   └─ Click: Turma → Detalhes/Editar/Excluir/Ver Atletas
```

---

## 📱 Dimensionamento Mobile

### Tamanhos de Tela Suportados

```
iPhone SE:       375 × 667px   (Small)
iPhone 12/13:    390 × 844px   (Standard)
iPhone 14 Plus:  428 × 926px   (Large)
iPad Mini:       768 × 1024px  (Tablet)
Android Small:   360 × 640px
Android Medium:  412 × 915px
```

### Safe Areas (iOS)

```
Status Bar:       44px (top)
Home Indicator:   34px (bottom)
Bottom Nav:       64px + safe area

Total padding top:    44px
Total padding bottom: 98px (64 + 34)
```

### Grid Responsivo

```
Mobile (< 768px):
- Cards: grid-cols-2 (2 colunas)
- Gap: gap-3 (12px)
- Padding: px-6 (24px lateral)

Tablet (768-1023px):
- Cards: grid-cols-2 (2 colunas)
- Gap: gap-4 (16px)
- Padding: px-8 (32px lateral)
- Max-width: 640px (centralizado)

Desktop (≥ 1024px):
- Cards: grid-cols-2 ou grid-cols-3
- Gap: gap-6 (24px)
- Padding: px-8 (32px lateral)
- Com sidebar de 280px
```

### Tamanhos de Componentes

```
Buttons:
- Small:  h-8 px-3 text-sm
- Medium: h-10 px-4 text-base (padrão)
- Large:  h-12 px-6 text-lg

Cards:
- Padding: p-4 ou p-5
- Border radius: rounded-2xl (16px)
- Shadow: shadow-sm

Icons:
- Small:  16px
- Medium: 20px (padrão)
- Large:  24px (títulos/stats)

Bottom Nav Icons: 20px
Sidebar Icons: 20px

Text Inputs:
- Height: h-12 (48px - touch-friendly)
- Padding: px-4
- Border radius: rounded-lg (8px)
```

---

## 🎯 Status Atual do Projeto

### ✅ Implementado
- [x] Sistema de onboarding (3 telas)
- [x] Login e Register
- [x] Club Connection (código de 6 dígitos)
- [x] Dashboard Clube (7 abas)
- [x] Dashboard Atleta (6 abas)
- [x] ClubHomeScreen com stats
- [x] ActivitiesScreen (feed)
- [x] ChatScreen (lista de conversas)
- [x] LeaderboardScreen (ranking)
- [x] CalendarScreen (calendário)
- [x] PaymentsScreen (ambos)
- [x] ProfileScreen
- [x] Responsividade mobile/desktop
- [x] Sidebar desktop
- [x] Bottom nav mobile
- [x] **Cards clicáveis no ClubHomeScreen** ⭐ NOVO

### 🚧 Em Desenvolvimento
- [ ] Athletes Management Screen
- [ ] Classes Management Screen
- [ ] Estado global (Zustand)
- [ ] Persistência de dados
- [ ] Aplicação da nova paleta de cores

### 📋 Planejado
- [ ] Notificações push
- [ ] Upload de imagens/vídeos
- [ ] Integração com backend real
- [ ] Pagamentos integrados
- [ ] Chat em tempo real (WebSocket)
- [ ] Exportação de relatórios
- [ ] QR Code para club connection

---

## 🎨 Próxima Etapa: Aplicação da Nova Paleta

**De** (atual):
```
Monocromático: Preto + Branco
```

**Para** (planejado):
```
- #003049 (Cosmos Blue) - Elementos principais
- #669BBC (Blue Marble) - Secundário
- #FAE1D2 (Varden) - Background
- #C1121F (Crimson Blaze) - Alertas
- #780000 (Gochujang Red) - Crítico
```

**Onde aplicar**:
1. Background principal: `#FAE1D2`
2. Cards principais: `#003049` (azul escuro)
3. Botões primários: `#003049`
4. Botões secundários: `#669BBC`
5. Alertas: `#C1121F`
6. Ícones ativos: `#003049`
7. Manter preto apenas em textos

---

**Documentação completa e atualizada!** 🚀

Pronto para criar as telas de Athletes Management e Classes Management?
