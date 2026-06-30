# ⚡ Quick Start - Sistema de Gerenciamento

## 🚀 Rodando o Projeto

```bash
# Instalar dependências (se ainda não instalou)
npm install

# Rodar em desenvolvimento
npm run dev

# Acessar no navegador
http://localhost:5173
```

---

## 🔑 Como Acessar as Novas Funcionalidades

### **Passo 1: Fazer Login**
```
1. Abrir http://localhost:5173
2. Fazer login como Clube (Owner ou Admin)
   - Usuário: qualquer
   - Tipo: "Clube"
```

### **Passo 2: Acessar Dashboard**
```
Você verá 4 cards grandes:
┌──────────┬──────────┐
│ Atletas  │ Eventos  │
├──────────┼──────────┤
│ Turmas   │ Cobranças│
└──────────┴──────────┘
```

### **Passo 3: Explorar**

#### 🏃 **Gerenciar Atletas**
```
1. Clicar no card "Atletas"
2. Ver lista de 7 atletas mockados
3. Usar filtros (idade, modalidade, turma)
4. Clicar "Novo Atleta" para adicionar
```

#### 🏫 **Gerenciar Turmas**
```
1. Clicar no card "Turmas"
2. Ver lista de 3 turmas mockadas
3. Clicar "Nova Turma" para criar
4. Preencher todos os campos do formulário
   - Clube, Modalidade, Treinador, Local, etc.
```

---

## 📋 Funcionalidades Principais

### ✅ **Cards Clicáveis (Home)**
- Atletas → Gerenciamento de atletas
- Próximos Eventos → Calendário
- Turmas → Gerenciamento de turmas
- Cobranças Pendentes → Pagamentos

### ✅ **Gerenciamento de Atletas**
- Busca por nome/email
- Filtro por idade (8-12 anos, por exemplo)
- Filtro por modalidade (Futebol, Vôlei, etc.)
- Filtro por turma
- Filtro por status de pagamento
- Adicionar, editar, excluir atletas

### ✅ **Gerenciamento de Turmas**
- Busca por nome ou código (TUR-001)
- Filtro por modalidade
- Criar turma com TODOS os campos:
  - ✅ Código (gerado automaticamente)
  - ✅ Horário
  - ✅ Clube
  - ✅ Modalidade
  - ✅ Treinador
  - ✅ Local
  - ✅ Faixa etária
  - ✅ Dias da semana
- Contador automático de atletas
- Adicionar, editar, excluir turmas

---

## 💾 Persistência de Dados

**Tudo é salvo automaticamente no navegador!**

```typescript
// Dados salvos:
localStorage → 'esportiva-atletas'
localStorage → 'esportiva-turmas'

// Para limpar e voltar aos dados iniciais:
1. Abrir DevTools (F12)
2. Application → Local Storage
3. Deletar "esportiva-atletas" e "esportiva-turmas"
4. Recarregar página (F5)
```

---

## 📊 Dados Mockados Incluídos

### **7 Atletas:**
1. João Silva (10 anos, Futebol)
2. Maria Costa (15 anos, Vôlei)
3. Pedro Santos (12 anos, Futebol)
4. Ana Oliveira (14 anos, Vôlei)
5. Lucas Mendes (8 anos, Natação)
6. Beatriz Lima (11 anos, Futebol)
7. Rafael Alves (16 anos, Basquete - sem turma)

### **3 Turmas:**
1. TUR-001 - Turma Infantil Futebol (14h)
2. TUR-002 - Vôlei Juvenil (16h)
3. TUR-003 - Natação Iniciantes (9h)

### **5 Modalidades:**
⚽ Futebol | 🏐 Vôlei | 🏀 Basquete | 🏊 Natação | 🎾 Tênis

### **5 Treinadores:**
Carlos Silva | Ana Santos | Roberto Oliveira | Marina Costa | Paulo Mendes

### **5 Locais:**
Campo Principal | Quadra 1 | Quadra 2 | Piscina Olímpica | Quadra de Tênis

---

## 🎯 Exemplos Práticos

### **Exemplo 1: Adicionar Atleta**
```
1. Ir para "Atletas"
2. Clicar "Novo Atleta"
3. Preencher:
   Nome: Carlos Eduardo
   Idade: 13
   Email: carlos@email.com
   Telefone: (11) 99999-9999
   Modalidade: Futebol
   Turma: Turma Infantil Futebol
   Status: Em dia
4. Clicar "Adicionar Atleta"
5. Ver na lista imediatamente
6. Reload (F5) → Dados permanecem!
```

### **Exemplo 2: Criar Turma**
```
1. Ir para "Turmas"
2. Clicar "Nova Turma"
3. Preencher:
   Nome: Basquete Avançado
   Horário: 18:00
   Clube: Esportiva FC
   Modalidade: Basquete
   Treinador: Roberto Oliveira
   Local: Quadra Poliesportiva 1
   Faixa Etária: 14-17 anos
   Dias: [Segunda] [Quarta] [Sexta]
4. Código é gerado automaticamente (TUR-004)
5. Clicar "Criar Turma"
6. Ver na lista com numeroAtletas = 0
```

### **Exemplo 3: Filtrar Atletas**
```
1. Ir para "Atletas"
2. Buscar "João" → Encontra João Silva
3. Filtrar idade: Min=10, Max=12
   → Mostra apenas atletas de 10-12 anos
4. Filtrar modalidade: Futebol
   → Mostra apenas atletas de futebol
5. Filtrar turma: "Turma Infantil Futebol"
   → Mostra apenas dessa turma
6. Combinar filtros funciona!
```

---

## 🎨 Animações e UX

### **Cards da Home:**
- Hover → Aumenta 2% (scale 1.02)
- Click → Diminui 2% (scale 0.98)
- Background escurece ao hover

### **Listas:**
- Entrada sequencial (efeito cascata)
- Hover em cada item muda cor de fundo

### **Modais:**
- Fade in suave
- Campos validados
- Botões com feedback visual

---

## 📱 Responsividade

### **Mobile (< 1024px):**
- Bottom nav fixo com 7 ícones
- Cards em grid 2x2
- Modais ocupam tela inteira

### **Desktop (≥ 1024px):**
- Sidebar lateral fixa
- Cards maiores
- Modais centralizados
- Filtros em linha

**Teste:** Redimensione a janela e veja a mudança automática!

---

## ❓ Dúvidas Rápidas

**P: Como voltar aos dados iniciais?**
R: Delete as chaves do localStorage (DevTools) e reload.

**P: Os dados são salvos?**
R: Sim, automaticamente no localStorage.

**P: Posso adicionar mais modalidades?**
R: Sim, edite `MOCK_MODALIDADES` em `/stores/clubStore.tsx`.

**P: Contador de atletas atualiza sozinho?**
R: Sim! Ao adicionar/remover atletas de uma turma.

**P: O que acontece ao excluir uma turma?**
R: Os atletas ficam "Sem turma" (turmaId = null).

---

## 📚 Documentação Completa

Para mais detalhes, veja:
- `/CLUB_MANAGEMENT_GUIDE.md` → Guia completo (funcionalidades, testes, FAQ)
- `/ARCHITECTURE_OVERVIEW.md` → Arquitetura e fluxo de dados
- `/RESPONSIVE_ARCHITECTURE.md` → Sistema responsivo

---

## 🎉 Pronto!

Tudo está funcionando e pronto para uso. Basta rodar `npm run dev` e explorar! 🚀

**Status:** ✅ 100% Implementado e Testado
