# 🏗️ Overview da Arquitetura - Sistema de Gerenciamento

## 📐 Estrutura de Pastas

```
kinesis-app/
├── stores/
│   └── clubStore.tsx                      ← Estado global (Context API)
│
├── screens/
│   ├── ClubDashboard.tsx                  ← Router principal (+ 2 rotas novas)
│   └── club/
│       ├── ClubHomeScreen.tsx             ← Cards clicáveis ✨
│       ├── AthletesManagementScreen.tsx   ← Gerenciamento de atletas 🏃
│       ├── ClassesManagementScreen.tsx    ← Gerenciamento de turmas 🏫
│       ├── ActivitiesScreen.tsx
│       ├── ChatScreen.tsx
│       ├── LeaderboardScreen.tsx
│       ├── CalendarScreen.tsx
│       ├── ClubPaymentsScreen.tsx
│       └── ProfileScreen.tsx
│
├── components/
│   ├── layout/
│   │   ├── ResponsiveLayout.tsx
│   │   ├── DesktopSidebar.tsx
│   │   └── MobileBottomNav.tsx
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       ├── dialog.tsx
│       ├── select.tsx
│       ├── badge.tsx
│       └── ...
│
├── contexts/
│   └── AppDataContext.tsx                 ← Dados existentes (eventos, etc.)
│
└── App.tsx                                ← ClubStoreProvider adicionado
```

---

## 🔄 Fluxo de Navegação

```
ClubHomeScreen (Dashboard Inicial)
    │
    ├─ 🔘 Card "Atletas"
    │   └─> /dashboard/athletes-management
    │        └─> AthletesManagementScreen
    │             ├─ Lista de atletas
    │             ├─ Busca e filtros
    │             └─ Modal de cadastro/edição
    │
    ├─ 🔘 Card "Próximos Eventos"
    │   └─> /dashboard/calendar
    │        └─> CalendarScreen (existente)
    │
    ├─ 🔘 Card "Turmas"
    │   └─> /dashboard/classes-management
    │        └─> ClassesManagementScreen
    │             ├─ Lista de turmas
    │             ├─ Filtros
    │             └─ Modal de cadastro/edição (campos DER)
    │
    └─ 🔘 Card "Cobranças Pendentes"
        └─> /dashboard/payments
             └─> ClubPaymentsScreen (existente)
```

---

## 🗂️ Gerenciamento de Estado

### **ClubStoreProvider (Context API)**

```typescript
App.tsx
  └─> <ClubStoreProvider>
       │
       ├─ Estados:
       │  ├─ atletas: Athlete[]
       │  ├─ turmas: Turma[]
       │  ├─ clubes: Clube[]
       │  ├─ modalidades: Modalidade[]
       │  ├─ treinadores: Treinador[]
       │  └─ locais: Local[]
       │
       ├─ Actions (Atletas):
       │  ├─ addAtleta()
       │  ├─ updateAtleta()
       │  ├─ deleteAtleta()
       │  └─ getAtletasByTurma()
       │
       └─ Actions (Turmas):
          ├─ addTurma()
          ├─ updateTurma()
          ├─ deleteTurma()
          └─ getTurmaById()
```

### **Persistência (localStorage)**

```typescript
useEffect(() => {
  // Carrega ao montar
  const saved = localStorage.getItem('esportiva-atletas');
  if (saved) setAtletas(JSON.parse(saved));
}, []);

useEffect(() => {
  // Salva a cada mudança
  localStorage.setItem('esportiva-atletas', JSON.stringify(atletas));
}, [atletas]);
```

---

## 📊 Modelo de Dados (DER Implementado)

```
┌─────────────┐
│   CLUBE     │
│  id, nome   │
│   codigo    │
└──────┬──────┘
       │ oferta (1:N)
       ↓
┌─────────────────────────────────────────┐
│              TURMA                      │
│  id, codigo, horario, nome              │
│  clubeId, modalidadeId, treinadorId     │
│  localId, faixaEtaria, diasSemana       │
│  numeroAtletas, ativa, dataCriacao      │
└──────────────┬──────────────────────────┘
       │ 1:N
       │
       ↓
┌─────────────────────────────────────┐
│           ATLETA                    │
│  id, nome, idade, email, telefone   │
│  turmaId, modalidade, statusPagto   │
│  dataCadastro, ativo                │
└─────────────────────────────────────┘

Relacionamentos:
- TURMA → MODALIDADE (possui)
- TURMA → TREINADOR (ministrada)
- TURMA → LOCAL (Rel)
- ATLETA → TURMA (pertence)
```

---

## 🎨 Componentes UI Utilizados

### **shadcn/ui Components**

```typescript
// Formulários
<Button />          // Ações principais
<Input />           // Campos de texto
<Label />           // Labels de formulário
<Select />          // Dropdowns (Clube, Modalidade, etc.)

// Feedback Visual
<Badge />           // Status (Em dia, Pendente, etc.)
<Dialog />          // Modais de cadastro/edição

// Layout
<motion.div />      // Animações (Motion/Framer)
```

---

## 🔀 Rotas do Sistema

### **ClubDashboard.tsx - Rotas Principais**

```typescript
<Routes>
  {/* Existentes */}
  <Route path="/" element={<ClubHomeScreen />} />
  <Route path="/activities" element={<ActivitiesScreen />} />
  <Route path="/chat" element={<ChatScreen />} />
  <Route path="/leaderboard" element={<LeaderboardScreen />} />
  <Route path="/calendar" element={<CalendarScreen />} />
  <Route path="/payments" element={<ClubPaymentsScreen />} />
  <Route path="/profile" element={<ProfileScreen />} />
  
  {/* Novas - Gerenciamento */}
  <Route path="/athletes-management" element={<AthletesManagementScreen />} />
  <Route path="/classes-management" element={<ClassesManagementScreen />} />
</Routes>
```

---

## ⚙️ Funcionalidades por Tela

### **1️⃣ ClubHomeScreen (Home com Cards)**

**Funcionalidades:**
- ✅ 4 cards clicáveis com animações
- ✅ Estatísticas em tempo real
- ✅ Redirecionamento para telas específicas
- ✅ Código do clube exibido
- ✅ Próximos 3 eventos

**Interações:**
```typescript
onClick={() => navigate('/dashboard/athletes-management')}  // Atletas
onClick={() => navigate('/dashboard/calendar')}             // Eventos
onClick={() => navigate('/dashboard/classes-management')}   // Turmas
onClick={() => navigate('/dashboard/payments')}             // Pagamentos
```

---

### **2️⃣ AthletesManagementScreen**

**Funcionalidades:**
- ✅ Lista com 7 atletas mockados
- ✅ Busca por nome/email (sem debounce - reativo)
- ✅ Filtro por idade (min-max)
- ✅ Filtro por modalidade
- ✅ Filtro por turma
- ✅ Filtro por status de pagamento
- ✅ Estatísticas (total, em dia, pendente, atrasado)
- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Validação de campos obrigatórios

**Campos do Formulário:**
```typescript
- Nome Completo *
- Idade *
- Email *
- Telefone
- Modalidade * (dropdown)
- Turma (dropdown - opcional)
- Status Pagamento (dropdown)
```

---

### **3️⃣ ClassesManagementScreen**

**Funcionalidades:**
- ✅ Lista com 3 turmas mockadas
- ✅ Busca por nome/código
- ✅ Filtro por modalidade
- ✅ Visualização completa (horário, atletas, local, treinador)
- ✅ CRUD completo
- ✅ Geração automática de código (TUR-001, TUR-002...)
- ✅ Contador automático de atletas
- ✅ Todos os campos do DER implementados

**Campos do Formulário (DER):**
```typescript
✅ Código da Turma       → Gerado automaticamente (TUR-XXX)
✅ Horário das Aulas     → Input type="time"
✅ Selecionar Clube      → Dropdown (FK clubeId)
✅ Selecionar Modalidade → Dropdown (FK modalidadeId)
✅ Selecionar Treinador  → Dropdown (FK treinadorId)
✅ Selecionar Local      → Dropdown (FK localId)
✅ Nome da Turma         → Input text
✅ Faixa Etária          → Input text (ex: "8-12 anos")
✅ Dias da Semana        → Multi-seleção (botões)
```

---

## 🔗 Sincronização de Dados

### **Atleta ↔ Turma**

```typescript
// Ao adicionar atleta com turma:
addAtleta({ turmaId: "TUR-001", ... })
  ↓
turma.numeroAtletas++  // Incrementa automaticamente

// Ao excluir atleta:
deleteAtleta("ATL-123")
  ↓
turma.numeroAtletas--  // Decrementa automaticamente

// Ao excluir turma:
deleteTurma("TUR-001")
  ↓
atletas.turmaId = null  // Para todos atletas da turma
```

---

## 🎨 Animações Implementadas

### **Cards da Home**

```typescript
// Entrada sequencial
initial={{ y: 20, opacity: 0 }}
animate={{ y: 0, opacity: 1 }}
transition={{ delay: 0.1 + index * 0.1 }}

// Interação
whileHover={{ scale: 1.02 }}   // Hover: aumenta 2%
whileTap={{ scale: 0.98 }}     // Click: diminui 2%
```

### **Listas (Atletas/Turmas)**

```typescript
// Efeito cascata
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: index * 0.05 }}  // Cada item com delay
```

---

## 📦 Dados Mockados Iniciais

### **7 Atletas**
1. João Silva (10 anos, Futebol, Turma 1, Em dia)
2. Maria Costa (15 anos, Vôlei, Turma 2, Em dia)
3. Pedro Santos (12 anos, Futebol, Turma 1, Pendente)
4. Ana Oliveira (14 anos, Vôlei, Turma 2, Atrasado)
5. Lucas Mendes (8 anos, Natação, Turma 3, Em dia)
6. Beatriz Lima (11 anos, Futebol, Turma 1, Em dia)
7. Rafael Alves (16 anos, Basquete, Sem turma, Pendente)

### **3 Turmas**
1. TUR-001 - Turma Infantil Futebol (14h, 15 atletas, Campo Principal)
2. TUR-002 - Vôlei Juvenil (16h, 12 atletas, Quadra Poliesportiva 1)
3. TUR-003 - Natação Iniciantes (9h, 8 atletas, Piscina Olímpica)

### **5 Modalidades**
⚽ Futebol | 🏐 Vôlei | 🏀 Basquete | 🏊 Natação | 🎾 Tênis

### **5 Treinadores**
Carlos Silva (Futebol) | Ana Santos (Vôlei) | Roberto Oliveira (Basquete) | Marina Costa (Natação) | Paulo Mendes (Futebol - indisponível)

### **5 Locais**
Campo Principal | Quadra Poliesportiva 1 | Quadra Poliesportiva 2 | Piscina Olímpica | Quadra de Tênis

---

## 🧪 Checklist de Teste

### **Teste de Navegação**
- [ ] Card "Atletas" abre tela de gerenciamento
- [ ] Card "Turmas" abre tela de gerenciamento
- [ ] Card "Eventos" abre calendário
- [ ] Card "Cobranças" abre pagamentos
- [ ] Animações funcionam (hover + click)

### **Teste de Atletas**
- [ ] Lista exibe 7 atletas iniciais
- [ ] Busca por nome funciona
- [ ] Filtros funcionam (idade, modalidade, turma, pagamento)
- [ ] Adicionar atleta persiste
- [ ] Editar atleta funciona
- [ ] Excluir atleta atualiza contador da turma
- [ ] Reload mantém dados

### **Teste de Turmas**
- [ ] Lista exibe 3 turmas iniciais
- [ ] Todos campos DER aparecem no formulário
- [ ] Criar turma gera código TUR-XXX
- [ ] Editar turma mantém dados
- [ ] Excluir turma desvincula atletas
- [ ] Contador de atletas atualiza automaticamente
- [ ] Reload mantém dados

### **Teste de Sincronização**
- [ ] Adicionar atleta em turma → contador++
- [ ] Remover atleta de turma → contador--
- [ ] Excluir turma → atletas ficam "Sem turma"

---

## 📱 Responsividade

### **Mobile (< 1024px)**
- Bottom Tab Navigator fixo
- Cards em grid 2x2
- Modais ocupam 90% da tela
- Filtros empilhados verticalmente

### **Desktop (≥ 1024px)**
- Sidebar lateral fixa
- Cards em grid 2x2 ou 4x1
- Modais centralizados (max-w-2xl)
- Filtros em linha horizontal

---

## 🔮 Extensões Futuras

### **Fase 2 - Visualizações**
- [ ] Ver atletas de uma turma específica
- [ ] Dashboard com gráficos (recharts)
- [ ] Exportar CSV/Excel

### **Fase 3 - Relacionamentos**
- [ ] Atribuir múltiplos treinadores por turma
- [ ] Histórico de turmas do atleta
- [ ] Agendar eventos por turma

### **Fase 4 - Backend**
- [ ] Integração com Supabase
- [ ] Upload de foto do atleta
- [ ] Notificações push

---

## 📝 Conclusão

**Sistema completo implementado com:**
- ✅ 2 novas telas de gerenciamento
- ✅ Todos os campos do DER da turma
- ✅ Persistência local (localStorage)
- ✅ CRUD completo para atletas e turmas
- ✅ Animações e UX polidos
- ✅ Responsividade mobile/desktop
- ✅ TypeScript 100%
- ✅ Dados mockados realistas

**Pronto para uso e extensão!** 🚀
