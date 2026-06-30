import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock } from 'lucide-react';
import { useClubStore } from '../stores/clubStore';
import { supabase } from '../../lib/supabase';
import { api, type ApiError } from '../services/api';
import type { User } from '../types';

// Resposta de GET /api/clubs (apenas o que usamos aqui — o id é UUID).
interface ClubResponse {
  id: string;
}

interface Props {
  onLogin: (
    role: 'CLUB_OWNER' | 'CLUB_ADMIN' | 'ATHLETE',
    needsClubConnection: boolean,
  ) => void;
}

export default function LoginScreen({ onLogin }: Props) {
  const navigate = useNavigate();
  const setAuthToken = useClubStore((state) => state.setToken);
  const setCurrentUser = useClubStore((state) => state.setCurrentUser);
  const setClubId = useClubStore((state) => state.setClubId);
  const [isClubSide, setIsClubSide] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{ email: string; password: string }>();

  const handleLogin = handleSubmit(async ({ email, password }) => {
    setErrorMessage('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.session) {
        setErrorMessage('E-mail ou senha inválidos. Tente novamente.');
        return;
      }

      // O role do domínio vem do user_metadata da sessão do Supabase
      const role = data.session.user.user_metadata?.role as
        | 'CLUB_OWNER'
        | 'CLUB_ADMIN'
        | 'ATHLETE'
        | undefined;

      if (role !== 'CLUB_OWNER' && role !== 'CLUB_ADMIN' && role !== 'ATHLETE') {
        setErrorMessage('Não foi possível identificar o perfil do usuário.');
        return;
      }

      // clubStore: token sempre é o access_token (JWT) da sessão do Supabase
      setAuthToken(data.session.access_token);

      // Garante que o perfil exista na nossa API. Como o cadastro só cria o
      // usuário no Supabase Auth (confirmação de e-mail ativada), o perfil é
      // criado aqui, no primeiro login após a confirmação. É idempotente:
      // 409 significa que o perfil já existe — apenas seguimos o fluxo.
      const metadata = data.session.user.user_metadata ?? {};
      const name = metadata.name as string | undefined;
      const systemRole = metadata.systemRole as string | undefined;

      if (name && systemRole) {
        try {
          await api('POST', '/api/users', {
            name,
            email: data.session.user.email,
            systemRole,
          });
        } catch (err) {
          const apiError = err as ApiError;
          if (apiError.status === 409) {
            // Perfil já existe — segue normalmente.
          } else if (apiError.status === 400 && apiError.fieldErrors) {
            setErrorMessage(Object.values(apiError.fieldErrors).join(' '));
            return;
          } else {
            setErrorMessage(apiError.message ?? 'Não foi possível concluir o login.');
            return;
          }
        }
      }

      // Popula o currentUser do clubStore a partir da sessão do Supabase.
      // OBS: o `id` aqui é o UID do Supabase. Para PUT /api/users/{id} no
      // futuro pode ser necessário o id da nossa API (a confirmar).
      const currentUser: User = {
        id: data.session.user.id,
        name: name ?? '',
        email: data.session.user.email ?? '',
        role,
      };
      setCurrentUser(currentUser);

      // Descobre o clube do usuário via GET /api/clubs.
      // TODO: confirmar se /api/clubs filtra pelo usuário logado. A doc não
      // deixa claro — pode retornar TODOS os clubes do sistema. Por ora
      // pegamos o primeiro item como SIMPLIFICAÇÃO TEMPORÁRIA.
      let needsClubConnection = false;
      try {
        const clubs = await api<ClubResponse[]>('GET', '/api/clubs');
        if (Array.isArray(clubs) && clubs.length > 0) {
          setClubId(clubs[0].id); // simplificação temporária: primeiro clube
        } else {
          setClubId(null);
          // Sem clube: usuário (que não é dono) precisa conectar a um clube.
          needsClubConnection = role !== 'CLUB_OWNER';
        }
      } catch (err) {
        const apiError = err as ApiError;
        setErrorMessage(apiError.message ?? 'Não foi possível carregar seus clubes.');
        return;
      }

      onLogin(role, needsClubConnection);
      navigate(needsClubConnection ? '/club-connection' : '/dashboard');
    } catch {
      setErrorMessage('Não foi possível conectar ao servidor. Tente novamente.');
    }
  });

  return (
    <div className="h-dvh bg-white flex flex-col overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 flex flex-col justify-center px-6 py-12"
      >
        {/* Container centralizado para desktop */}
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-10">
          <span className="text-3xl font-black tracking-widest text-black">KINESIS</span>
            <p className="text-gray-600">Bem-vindo de volta</p>
          </div>

          {/* Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="bg-gray-100 rounded-xl p-1 mb-6"
          >
            <div className="grid grid-cols-2 gap-1">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsClubSide(false)}
                className={`py-3 rounded-lg font-medium transition-all ${
                  !isClubSide
                    ? 'bg-black text-white'
                    : 'text-gray-600'
                }`}
              >
                Sou Atleta/Aluno
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsClubSide(true)}
                className={`py-3 rounded-lg font-medium transition-all ${
                  isClubSide
                    ? 'bg-black text-white'
                    : 'text-gray-600'
                }`}
              >
                Sou Clube/Admin
              </motion.button>
            </div>
          </motion.div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="E-mail"
                  {...register('email')}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Senha"
                  {...register('password')}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              type="button"
              className="text-sm text-gray-600 hover:text-black transition-colors"
            >
              Esqueci minha senha
            </motion.button>

            {/* Mensagem de erro */}
            {errorMessage && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600"
              >
                {errorMessage}
              </motion.p>
            )}

            {/* Login Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-black text-white rounded-xl font-semibold mt-6 disabled:opacity-60"
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </motion.button>
          </form>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="relative my-6"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">ou</span>
            </div>
          </motion.div>

          {/* Register Button - Destaque para novos usuários */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            whileHover={{ scale: 1.02, borderColor: '#000' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/register')}
            className="w-full py-4 bg-white text-black border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all"
          >
            Criar nova conta
          </motion.button>

          {/* Helper text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.4 }}
            className="mt-3 text-center text-xs text-gray-500"
          >
            Junte-se ao Kinesis gratuitamente
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}