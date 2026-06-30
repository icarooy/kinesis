# Kinesis - Regras para o Claude Code

## O que NÃO tocar
- Nada dentro de `src/app/components/ui/` (componentes de design system)
- Nada dentro de `src/app/components/layout/`
- Arquivos de estilo em `styles/`
- Componentes visuais já existentes (PostCard, ChatRoom, PaymentCard, etc.)
- Arquivos `.md` de documentação

## O que pode modificar
- `src/app/stores/` — gerenciamento de estado
- `src/app/contexts/` — contextos
- `src/app/hooks/` — hooks
- `src/app/types/` — tipos
- Lógica de integração com API
- Arquivos de screen apenas na parte lógica, nunca no JSX/visual

## Regras gerais
- Sempre use TypeScript tipado
- Não instale novas dependências sem perguntar
- Sempre use o modo Plan antes de editar qualquer arquivo
- Foque apenas no que for pedido, nada além