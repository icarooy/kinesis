
  # Kinesis (definitivo)

  This is a code bundle for Kinesis (definitivo). The original project is available at https://www.figma.com/design/XFTCPyZCUiiB6bqNmCo0iT/Kinesis--definitivo-.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Variáveis de ambiente

  Copie `.env.example` para `.env` e preencha:

  ```
  VITE_SUPABASE_URL=https://seu-projeto.supabase.co
  VITE_SUPABASE_ANON_KEY=sua-anon-key-publica
  VITE_API_BASE_URL=https://api-kinesis-production.up.railway.app
  VITE_MERCADOPAGO_PUBLIC_KEY=TEST-00000000-0000-0000-0000-000000000000
  ```

  `VITE_MERCADOPAGO_PUBLIC_KEY` é a **Public Key** do Mercado Pago (chave pública, segura para
  o frontend). Use a chave de teste (`TEST-...`) da sua aplicação em
  https://www.mercadopago.com.br/developers para testar em Sandbox — veja o passo a passo em
  [`api-kinesis/README.md`](../api-kinesis/README.md#configurando-o-mercado-pago-sandbox). O
  Access Token (privado) nunca é usado aqui: ele fica só no backend.

  ## Arquitetura

  - **Autenticação:** Supabase Auth (`supabase.auth.signInWithPassword` / `signUp`). O `access_token` (JWT) da sessão é a credencial usada na API.
  - **Backend:** Kinesis API (Spring Boot) em `https://api-kinesis-production.up.railway.app`.
  - **Camada de serviços:**
    - `src/lib/supabase.ts` — cliente Supabase (autenticação).
    - `src/app/services/api.ts` — `api<T>(method, path, body?)`: injeta `Authorization: Bearer {token}`, usa `VITE_API_BASE_URL`, trata `204` e lança `ApiError` em falha.
    - `src/app/services/payments.ts` — cobranças e checkout do módulo de pagamentos (Mercado Pago).
  - **Estado:** `clubStore` (Zustand + persist) com `currentUser`, `token`, `isAuthenticated`, `clubId`.
  - **Pagamentos:** checkout real via [Payment Brick](https://www.mercadopago.com.br/developers/pt/docs/checkout-bricks/payment-brick/introduction) (`@mercadopago/sdk-react`), inicializado em `src/main.tsx` com `VITE_MERCADOPAGO_PUBLIC_KEY`. Suporta Pix, cartão de crédito/débito e boleto.

  ### Telas integradas com API real
  LoginScreen, RegisterScreen (Supabase Auth + `POST /api/users`), CalendarScreen (`GET /api/clubs/{clubId}/events`), AthleteProfileSettingsScreen (`GET`/`PUT /api/users/{id}`), AthleteHomeScreen e ClubHomeScreen (`currentUser` + eventos do clube), PaymentsScreen e ClubPaymentsScreen (`/api/clubs/{clubId}/payments/*`, checkout real via Mercado Pago).

  ### Ainda em mock (sem endpoint)
  Posts, ranking, frequência e notificações. Na tela de pagamentos do clube, o seletor de
  turma também é cosmético (o backend ainda não modela "turma" — toda cobrança criada é
  individual, para cada membro ativo do clube).

  ## Como testar um pagamento (Sandbox)

  1. Configure `VITE_MERCADOPAGO_PUBLIC_KEY` (frontend) e as credenciais de teste
     correspondentes no backend (veja [`api-kinesis/README.md`](../api-kinesis/README.md)).
  2. Logue como coordenador/treinador, vá em **Pagamentos** e crie uma cobrança — ela é criada
     para todos os membros ativos do clube.
  3. Logue como um dos atletas cobrados, abra **Pagamentos** e clique na cobrança pendente.
  4. No checkout (Payment Brick), escolha Pix, cartão ou boleto:
     - **Pix:** use o QR code/código copia-e-cola gerado; aprove manualmente pelo simulador
       de webhooks do painel do Mercado Pago (ou aguarde o webhook, se estiver com túnel público configurado).
     - **Cartão:** use um dos [cartões de teste do Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs/checkout-bricks/additional-content/your-integrations/test/cards).
     - **Boleto:** abra o link gerado (`ticketUrl`).
  5. Use o botão "Verificar status do pagamento" para consultar o status mais recente sem
     esperar o webhook.
  