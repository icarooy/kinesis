# Kinesis (Esportiva) - Aplicação Web

Aplicação web para gerenciamento de clubes esportivos sociais com três tipos de usuários: Coordenador/Treinador (Clube), Admin e Atletas.

## 🎯 Estrutura de Navegação

### Fluxo de Autenticação
```
Onboarding (3 telas) → Login → Register → Club Connection → Dashboard
```

### Telas Implementadas (11 telas)

**📱 Onboarding (3 telas):**
- `/onboarding-1` - Gerencie seu Clube
- `/onboarding-2` - Conecte Atletas
- `/onboarding-3` - Acompanhe o Progresso

**🔐 Autenticação (3 telas):**
- `/login` - Login com toggle Atleta/Clube
- `/register` - Escolha do tipo de conta + Formulário
- `/club-connection` - Conexão via código de 6 dígitos

**📊 Dashboards (5 telas principais):**

**Clube/Admin Dashboard (6 abas):**
- `/dashboard` - Home (stats, código do clube, ações rápidas)
- `/dashboard/activities` - Feed de atividades
- `/dashboard/chat` - Sistema de mensagens
- `/dashboard/leaderboard` - Ranking de atletas
- `/dashboard/calendar` - Calendário de eventos
- `/dashboard/profile` - Perfil e configurações

**Atleta Dashboard (6 abas):**
- `/dashboard` - Home (progresso, eventos, metas)
- `/dashboard/activities` - Feed de atividades
- `/dashboard/chat` - Sistema de mensagens
- `/dashboard/calendar` - Calendário de eventos
- `/dashboard/payments` - Sistema de pagamentos
- `/dashboard/profile` - Perfil e configurações

## 📁 Estrutura de Arquivos

```
/
├── App.tsx                           # Roteador principal com controle de fluxo
├── package.json                      # Dependências
├── styles/
│   └── globals.css                   # Estilos globais + Tailwind
├── screens/
│   ├── OnboardingScreen1.tsx
│   ├── OnboardingScreen2.tsx
│   ├── OnboardingScreen3.tsx
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── ClubConnectionScreen.tsx
│   ├── ClubDashboard.tsx            # Dashboard Clube com bottom nav
│   ├── AthleteDashboard.tsx         # Dashboard Atleta com bottom nav
│   ├── club/
│   │   ├── ClubHomeScreen.tsx
│   │   ├── ActivitiesScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   ├── LeaderboardScreen.tsx
│   │   ├── CalendarScreen.tsx
│   │   └── ProfileScreen.tsx
│   └── athlete/
│       ├── AthleteHomeScreen.tsx
│       └── PaymentsScreen.tsx
└── components/
    └── figma/
        └── ImageWithFallback.tsx    # Componente protegido

```

## 🎨 Design System

- **Paleta:** Monocromática (Preto, Branco, Cinzas)
- **Estilo:** Minimalista moderno
- **Tipografia:** Geométrica
- **Animações:** Motion (300-400ms)
- **Layout:** Responsivo mobile-first

## 🔑 Sistema de Roles

```typescript
type UserRole = 'CLUB_OWNER' | 'CLUB_ADMIN' | 'ATHLETE' | null;
```

- **CLUB_OWNER:** Dono do clube (cria código, acesso completo)
- **CLUB_ADMIN:** Coordenador/Treinador (precisa código, acesso completo)
- **ATHLETE:** Atleta (precisa código, acesso limitado)

## 🚀 Como Funciona

1. **Primeira Vez:** Usuário vê 3 telas de onboarding
2. **Cadastro:**
   - Clube Owner → Cria conta → Recebe código → Dashboard
   - Admin/Atleta → Cria conta → Insere código do clube → Dashboard
3. **Login:** Usuários retornam direto ao dashboard
4. **Navegação:** Bottom navigation com 6 abas (varia por role)

## 📦 Dependências

```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "motion": "^10.16.4",
  "lucide-react": "^0.294.0"
}
```

## 🗑️ Limpeza Realizada

**Arquivos removidos (29 arquivos):**
- ✅ 17 componentes antigos da pasta `/components`
- ✅ 7 telas antigas da pasta `/components/screens`
- ✅ 4 arquivos de contexto não utilizados
- ✅ 1 arquivo de mock data

**Mantidos (somente o essencial):**
- ✅ App.tsx + 8 screens + 8 sub-screens = **17 arquivos**
- ✅ Components UI protegidos (não podem ser removidos)
- ✅ ImageWithFallback protegido

## ✨ Features Implementadas

- ✅ Navegação completa e funcional
- ✅ Persistência de estado (localStorage)
- ✅ Animações suaves em todas as transições
- ✅ Toggle de tipo de usuário no login
- ✅ Formulários dinâmicos no registro
- ✅ Sistema de conexão via código de 6 dígitos
- ✅ Bottom navigation com estado ativo
- ✅ Dashboards personalizados por role
- ✅ Sistema de logout funcional

## 🎯 Próximos Passos Sugeridos

1. Integrar backend/API real
2. Implementar funcionalidades das telas placeholder (Chat, Calendar, etc)
3. Adicionar validações de formulário
4. Implementar scanner de QR Code
5. Sistema de notificações
6. Dashboard de Pais/Responsáveis
