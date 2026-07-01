
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
  ```

  ## Arquitetura

  - **Autenticação:** Supabase Auth (`supabase.auth.signInWithPassword` / `signUp`). O `access_token` (JWT) da sessão é a credencial usada na API.
  - **Backend:** Kinesis API (Spring Boot) em `https://api-kinesis-production.up.railway.app`.
  - **Camada de serviços:**
    - `src/lib/supabase.ts` — cliente Supabase (autenticação).
    - `src/app/services/api.ts` — `api<T>(method, path, body?)`: injeta `Authorization: Bearer {token}`, usa `VITE_API_BASE_URL`, trata `204` e lança `ApiError` em falha.
  - **Estado:** `clubStore` (Zustand + persist) com `currentUser`, `token`, `isAuthenticated`, `clubId`.

  ### Telas integradas com API real
  LoginScreen, RegisterScreen (Supabase Auth + `POST /api/users`), CalendarScreen (`GET /api/clubs/{clubId}/events`), AthleteProfileSettingsScreen (`GET`/`PUT /api/users/{id}`), AthleteHomeScreen e ClubHomeScreen (`currentUser` + eventos do clube).

  ### Ainda em mock (sem endpoint)
  PaymentsScreen, posts, ranking, frequência e notificações.
  