# Guia de Implementação - Esportiva (Kinesis)

## 📋 Visão Geral

Aplicação web completa para gestão de clubes esportivos amadores com funcionalidades diferenciadas para Coordenadores/Treinadores e Atletas.

## 🏗️ Arquitetura Implementada

### Estrutura de Pastas

```
/
├── App.tsx                           # Ponto de entrada, rotas principais
├── contexts/
│   └── AppDataContext.tsx            # Context global com dados mock e funções CRUD
├── types/
│   └── index.ts                      # Definições TypeScript globais
├── components/
│   ├── activities/
│   │   ├── PostCard.tsx              # Card de publicação com likes/comentários
│   │   └── CreatePostModal.tsx       # Modal para criar posts
│   ├── chat/
│   │   ├── ChatList.tsx              # Lista de conversas
│   │   ├── ChatRoom.tsx              # Sala de chat com mensagens
│   │   └── MessageBubble.tsx         # Balão de mensagem individual
│   ├── payments/
│   │   ├── PaymentCard.tsx           # Card de cobrança/pagamento
│   │   └── CreateChargeModal.tsx     # Modal para criar cobranças (clube)
│   └── ui/                           # 40+ componentes Shadcn/UI
├── screens/
│   ├── OnboardingScreen1-3.tsx       # 3 telas de onboarding
│   ├── LoginScreen.tsx               # Login diferenciado
│   ├── RegisterScreen.tsx            # Cadastro com seleção de tipo
│   ├── ClubConnectionScreen.tsx      # Conexão via código 6 dígitos
│   ├── ClubDashboard.tsx             # Container com 7 abas (Clube)
│   ├── AthleteDashboard.tsx          # Container com 6 abas (Atleta)
│   ├── club/                         # Telas do Clube
│   │   ├── ClubHomeScreen.tsx        # Overview com stats reais
│   │   ├── ActivitiesScreen.tsx      # Feed de posts completo
│   │   ├── ChatScreen.tsx            # Sistema de chat multi-sala
│   │   ├── LeaderboardScreen.tsx     # Ranking dinâmico filtrado
│   │   ├── CalendarScreen.tsx        # Calendário interativo
│   │   ├── ClubPaymentsScreen.tsx    # Gestão de cobranças (NOVO)
│   │   └── ProfileScreen.tsx         # Perfil e configurações
│   └── athlete/                      # Telas do Atleta
│       ├── AthleteHomeScreen.tsx     # Dashboard personalizado
│       └── PaymentsScreen.tsx        # Visualização e pagamento
└── styles/
    └── globals.css                   # Estilos Tailwind + tokens
```

## 🎯 Funcionalidades Implementadas

### Dashboard do Clube (7 Abas)

#### 1. **Início (ClubHomeScreen)**
- ✅ Cards com estatísticas reais calculadas
- ✅ Total de atletas no leaderboard
- ✅ Total de turmas
- ✅ Próximos eventos filtrados
- ✅ Cobranças pendentes com badge
- ✅ Código do clube (483921)
- ✅ Lista de próximos 3 eventos

#### 2. **Atividades (ActivitiesScreen)**
- ✅ Feed infinito de posts
- ✅ Criar nova publicação (texto + imagem URL)
- ✅ Sistema de likes (toggle)
- ✅ Comentários expandíveis
- ✅ Adicionar comentários (Enter para enviar)
- ✅ Persistência no localStorage
- ✅ Timestamps com date-fns

#### 3. **Chat (ChatScreen)**
- ✅ Lista de conversas (Chat Geral + Grupos por Turma)
- ✅ Badges de mensagens não lidas
- ✅ Sala de chat com histórico
- ✅ Enviar mensagens em tempo real (mock)
- ✅ Balões diferenciados (enviadas/recebidas)
- ✅ Auto-scroll para última mensagem
- ✅ Avatares e timestamps

#### 4. **Ranking (LeaderboardScreen)**
- ✅ Filtros por modalidade e turma
- ✅ Duas visualizações: Geral e Estatísticas
- ✅ Medalhas para top 3
- ✅ Cards com múltiplas estatísticas
- ✅ Grid de stats (gols, assistências, presença, pontos, vitórias)
- ✅ Ordenação dinâmica

#### 5. **Calendário (CalendarScreen)**
- ✅ Calendário mensal completo
- ✅ Navegação entre meses
- ✅ Indicadores visuais de eventos
- ✅ Destacar dia atual e selecionado
- ✅ Lista de eventos do dia selecionado
- ✅ Modal de detalhes do evento
- ✅ Tipos de evento com cores (treino, jogo, reunião, outro)
- ✅ Informações: local, horário, turma, confirmações

#### 6. **Pagamentos (ClubPaymentsScreen)** 🆕
- ✅ Dashboard de pagamentos com stats
- ✅ Total recebido, pendente e total cobrado
- ✅ Criar nova cobrança (modal)
- ✅ Configurar: título, descrição, valor, vencimento, turma
- ✅ Filtros por status (todas, pendentes, pagas)
- ✅ Cards de cobrança com status visual
- ✅ Persistência de cobranças

#### 7. **Perfil (ProfileScreen)**
- ✅ Configurações e logout

---

### Dashboard do Atleta (6 Abas)

#### 1. **Início (AthleteHomeScreen)**
- ✅ Dashboard personalizado com stats
- ✅ Próximos eventos filtrados
- ✅ Posição no ranking
- ✅ Frequência
- ✅ Alertas de pagamentos atrasados
- ✅ Total pendente destacado
- ✅ Últimas notícias do feed
- ✅ Navegação rápida para pagamentos

#### 2. **Atividades**
- ✅ Mesmo feed do clube (compartilhado)
- ✅ Visualização e interação completa

#### 3. **Chat**
- ✅ Mesmo sistema de chat do clube
- ✅ Acesso aos grupos das turmas do atleta

#### 4. **Calendário**
- ✅ Mesma visualização do clube
- ✅ Confirmação de presença em eventos (botão toggle)

#### 4. **Calendário (CalendarScreen - Versão Atleta)**
- ✅ Visualização completa do calendário mensal
- ✅ Navegação entre meses
- ✅ Lista de eventos por dia selecionado
- ✅ Modal de detalhes completos do evento
- ✅ **SEM botão de adicionar eventos** (apenas clube pode criar)
- ✅ Botão de confirmar/cancelar presença em cada evento
- ✅ Indicador visual de eventos confirmados
- ✅ Contador de confirmações por evento
- ✅ Status "Você confirmou" no modal de detalhes

#### 5. **Pagamentos (PaymentsScreen)** 🔥
- ✅ Stats de pendente e pago
- ✅ Lista de cobranças filtradas
- ✅ Filtros por status
- ✅ Clicar em cobrança pendente abre modal
- ✅ Modal de pagamento com:
  - Detalhes da cobrança
  - QR Code PIX (mock)
  - Código Copia e Cola gerado
  - Botão copiar código
  - Boleto e cartão (placeholders)
  - Botão "Simular Pagamento" (demo)
- ✅ Atualização de status após pagamento

#### 6. **Perfil**
- ✅ Configurações e logout (compartilhado)

---

## 🎨 Design System

### Paleta de Cores
- **Principal**: Preto (#000000)
- **Fundo**: Branco (#FFFFFF)
- **Cinzas**: gray-50 a gray-900
- **Status**:
  - Sucesso: green-500/green-600
  - Aviso: yellow-500/yellow-600
  - Erro: red-500/red-600
  - Info: blue-500/blue-600

### Componentes Visuais
- **Cards**: border-gray-200, rounded-xl, hover:shadow-md
- **Badges**: rounded-full, tamanho pequeno
- **Botões**: rounded-lg ou rounded-full, motion whileTap
- **Modais**: backdrop blur, animações de entrada/saída

### Animações
- Todas com `motion` (Framer Motion)
- Delays escalonados para listas
- whileTap para feedback tátil
- Transições suaves (0.3-0.4s)

---

## 📊 Gerenciamento de Estado

### AppDataContext

Provê dados mock e funções CRUD para toda a aplicação:

```typescript
// Dados disponíveis
- currentUser: User | null
- posts: Post[]
- conversations: ChatConversation[]
- messages: Message[]
- leaderboard: LeaderboardEntry[]
- events: CalendarEvent[]
- payments: Payment[]
- teams: Team[]

// Funções disponíveis
- setCurrentUser()
- addPost()
- likePost()
- addComment()
- sendMessage()
- addEvent()
- updateEvent()
- toggleEventAttendance()
- addPayment()
- updatePaymentStatus()
```

### Persistência

Dados salvos automaticamente no `localStorage`:
- `app_posts`: Posts e comentários
- `app_messages`: Mensagens de chat
- `app_events`: Eventos do calendário
- `app_payments`: Cobranças e pagamentos

---

## 🔐 Fluxo de Navegação

### Hierarquia de Rotas

```
1. Onboarding (primeira vez)
   ↓
2. Login/Register
   ↓
3. Club Connection (se ATHLETE ou CLUB_ADMIN)
   ↓
4. Dashboard (específico por role)
   ├── CLUB_OWNER/CLUB_ADMIN → ClubDashboard (7 abas)
   └── ATHLETE → AthleteDashboard (6 abas)
```

### Proteção de Rotas

- `hasSeenOnboarding` → localStorage
- `isAuthenticated` → localStorage
- `userRole` → localStorage ('CLUB_OWNER' | 'CLUB_ADMIN' | 'ATHLETE')
- `needsClubConnection` → localStorage (true para ATHLETE/ADMIN)

---

## 🧪 Dados Mock

### Times/Turmas
- Sub-15 Masculino (Futebol)
- Sub-17 Feminino (Futsal)
- Adulto Misto (Vôlei)
- Iniciante (Basquete)

### Posts Iniciais
- 3 posts com likes e comentários
- Imagens do Unsplash

### Conversas de Chat
- Chat Geral
- Grupos por turma (3)

### Eventos
- Treinos, jogos, reuniões
- Próximos e passados

### Pagamentos
- Mensalidades
- Taxa de jogo
- Status: pendente, pago, atrasado

### Leaderboard
- 4 atletas com estatísticas variadas

---

## 🚀 Próximos Passos Recomendados

### Curto Prazo
1. ✅ Implementar criação de eventos no calendário
2. ⬜ Adicionar upload de imagens real (não só URL)
3. ⬜ Sistema de notificações push (mock)
4. ⬜ Filtro de posts por data/autor
5. ⬜ Busca no chat

### Médio Prazo
1. ⬜ Backend real (Supabase/Firebase)
2. ⬜ Autenticação real
3. ⬜ Upload de mídia (Cloudinary/AWS S3)
4. ⬜ Integração com gateway de pagamento (Stripe/Mercado Pago)
5. ⬜ Sistema de notificações real (FCM/OneSignal)

### Longo Prazo
1. ⬜ App mobile (React Native/Expo)
2. ⬜ Sincronização em tempo real (WebSockets)
3. ⬜ Análises e relatórios
4. ⬜ Integração com wearables
5. ⬜ Gamificação e conquistas

---

## 📦 Dependências Principais

```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "motion": "^10.16.4",
  "lucide-react": "^0.294.0",
  "date-fns": "^3.0.0",
  "tailwindcss": "^3.4.0"
}
```

---

## 🎯 Comandos Úteis

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

---

## 📝 Notas Importantes

1. **Mock Data**: Todos os dados são mockados e persistem apenas no localStorage
2. **User IDs**: Hardcoded para demonstração ('club1', 'athlete1', etc.)
3. **Imagens**: URLs do Unsplash para demonstração
4. **Pagamentos**: Sistema de pagamento é simulado (não real)
5. **Chat**: Não há backend real, mensagens são locais
6. **Responsividade**: Otimizado para mobile-first (max-w-2xl)

---

## 🐛 Debug

Para resetar todos os dados:
```javascript
localStorage.clear()
location.reload()
```

Para verificar dados salvos:
```javascript
console.log('Posts:', localStorage.getItem('app_posts'))
console.log('Messages:', localStorage.getItem('app_messages'))
console.log('Events:', localStorage.getItem('app_events'))
console.log('Payments:', localStorage.getItem('app_payments'))
```

---

## 👨‍💻 Desenvolvimento

O código está estruturado para fácil manutenção:
- **Componentes reutilizáveis**: PostCard, PaymentCard, ChatRoom
- **Hooks customizados**: useAppData
- **TypeScript**: Tipagem forte em toda aplicação
- **Comentários**: Código documentado onde necessário
- **Padrões**: Consistent naming e estrutura de pastas

---

Implementado com ❤️ para Esportiva (Kinesis)