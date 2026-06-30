# 🔔 Sistema de Notificações - Esportiva (Kinesis)

## Como Funciona a Visualização de Notificações

### 📱 Acessar as Notificações
1. **Ícone de Sino**: Clique no ícone de sino (Bell) no cabeçalho da tela inicial
2. **Badge Vermelho**: Se houver notificações não lidas, aparece um badge vermelho com a quantidade
3. **Painel Superior**: O painel desliza do topo da tela com animação suave

### 👆 Interagir com Notificações

#### **Ao Clicar em uma Notificação:**
1. A notificação é **marcada como lida** automaticamente
2. O ícone muda de **fundo preto** (não lida) para **fundo cinza** (lida)
3. O ponto preto indicador desaparece
4. Se a notificação tiver um **link associado**, você é **navegado automaticamente** para a tela relacionada
5. O painel fecha automaticamente após a navegação

#### **Exemplos de Navegação:**

**Para Atletas:**
- 🏃 "Lembrete: Treino em 1 hora" → Navega para `/dashboard/calendar`
- 💰 "Mensalidade Próxima do Vencimento" → Navega para `/dashboard/payments`
- 📊 "Nova Avaliação Disponível" → Navega para `/dashboard/profile`
- 🏆 "Subiu no Ranking!" → Navega para `/dashboard/profile`
- 💬 "Mensagem do Treinador" → Navega para `/dashboard/chat`

**Para o Clube:**
- 👥 "Novo Atleta Cadastrado" → Navega para `/dashboard/athletes`
- 💵 "Pagamento Atrasado" → Navega para `/dashboard/payments`
- 📅 "Baixa Confirmação de Presença" → Navega para `/dashboard/calendar`
- 💬 "Nova Mensagem no Chat" → Navega para `/dashboard/chat`

### 🎨 Indicadores Visuais

#### **Notificação Não Lida:**
- ⚫ Ponto preto no canto superior direito
- 🖤 Ícone com fundo **preto** e ícone branco
- ✨ Fundo levemente cinza (bg-gray-50/70)
- **Fonte em negrito**

#### **Notificação Lida:**
- 🔘 Sem ponto indicador
- ⚪ Ícone com fundo **cinza** e ícone cinza escuro
- 📄 Fundo branco
- Fonte semi-negrito (menos destaque)

### 🚪 Fechar o Painel

Você pode fechar o painel de 4 formas diferentes:
1. **Botão X** no header (canto superior direito)
2. **Botão "Fechar"** no rodapé
3. **Clicar fora** do painel (no backdrop escuro)
4. **Tecla ESC** no teclado

### 📊 Categorias de Notificações

#### **Clube (Coordenador/Treinador):**
- 👥 **Atletas**: Novos cadastros, aniversários, documentação
- 💰 **Pagamentos**: Atrasados, confirmados, pendentes
- 📅 **Eventos**: Confirmações, alterações de horário
- 💬 **Mensagens**: Mensagens de responsáveis
- 📄 **Documentação**: Atestados vencidos

#### **Atleta:**
- 🏃 **Eventos**: Lembretes de treino, novos treinos agendados
- 💰 **Pagamentos**: Mensalidades vencendo, confirmações
- 📊 **Desempenho**: Avaliações publicadas
- 🏆 **Ranking**: Mudanças de posição
- 💬 **Mensagens**: Mensagens do treinador, anúncios
- 📄 **Documentação**: Atestados vencendo

### 🔧 Funcionalidades Técnicas

- **Mostra as 8 notificações mais recentes** (ordenadas por timestamp)
- **Contador dinâmico** de notificações não lidas no header
- **Scroll automático** se houver mais de 8 notificações
- **Bloqueia scroll** da página de fundo quando aberto
- **Animações suaves** com Motion (Framer Motion)
- **Design 100% monocromático** (preto, branco, cinzas)
- **Persistência** usando Zustand store

### 💡 Dica Pro
Se você quiser apenas marcar uma notificação como lida sem navegar, clique nela mesmo que não tenha link associado. Ela será marcada como lida e permanecerá no painel para você revisar depois!
