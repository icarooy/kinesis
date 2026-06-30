import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, BookOpen, Trophy, ArrowLeft, User, Mail, Lock, Building, Briefcase, Calendar, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Props {
  onRegister: (role: 'CLUB_OWNER' | 'CLUB_ADMIN' | 'ATHLETE') => void;
}

type Step = 'selection' | 'form';
type UserType = 'CLUB_OWNER' | 'CLUB_ADMIN' | 'ATHLETE' | null;

// Valores do enum UserRole da API (Spring Boot). Não existe CLUB_OWNER/CLUB_ADMIN no enum.
type SystemRole = 'ATHLETE' | 'COORDINATOR' | 'TRAINER';

/**
 * Mapeia o tipo escolhido no frontend (+ cargo, no caso de admin) para o
 * systemRole esperado pela API. Retorna null quando o admin ainda não
 * escolheu um cargo válido (aí o submit é bloqueado, sem inventar valor).
 */
function resolveSystemRole(userType: UserType, cargo: string): SystemRole | null {
  if (userType === 'ATHLETE') return 'ATHLETE';
  if (userType === 'CLUB_OWNER') return 'COORDINATOR';
  if (userType === 'CLUB_ADMIN') {
    switch (cargo) {
      case 'Coordenador':
        return 'COORDINATOR';
      case 'Treinador':
      case 'Técnico':
      case 'Assistente':
        return 'TRAINER';
      default:
        return null;
    }
  }
  return null;
}

export default function RegisterScreen({ onRegister }: Props) {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('selection');
  const [userType, setUserType] = useState<UserType>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [acceptedClubTerms, setAcceptedClubTerms] = useState(false);
  const [showClubTermsModal, setShowClubTermsModal] = useState(false);
  const [acceptedAdminTerms, setAcceptedAdminTerms] = useState(false);
  const [showAdminTermsModal, setShowAdminTermsModal] = useState(false);
  const [cargo, setCargo] = useState('');

  const handleSelectType = (type: UserType) => {
    setUserType(type);
    setStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Para atletas, valida se aceitou os termos
    if (userType === 'ATHLETE' && !acceptedTerms) {
      alert('Você precisa aceitar os termos de responsabilidade para continuar.');
      return;
    }

    // Para clubes, valida se aceitou os termos
    if (userType === 'CLUB_OWNER' && !acceptedClubTerms) {
      alert('Você precisa aceitar os termos de prestação de serviços para continuar.');
      return;
    }

    // Para admins, valida se aceitou os termos
    if (userType === 'CLUB_ADMIN' && !acceptedAdminTerms) {
      alert('Você precisa aceitar os termos de responsabilidade profissional para continuar.');
      return;
    }

    if (!formData.name || !formData.email || !formData.password || !userType) {
      return;
    }

    // Define o systemRole da API a partir do tipo (e do cargo, no caso de admin).
    const systemRole = resolveSystemRole(userType, cargo);
    if (!systemRole) {
      alert('Selecione o cargo para continuar.');
      return;
    }

    try {
      // Cria o usuário no Supabase Auth. Como a confirmação de e-mail está
      // ativada, o signUp NÃO retorna sessão — o perfil na nossa API só pode
      // ser criado no primeiro login (ver LoginScreen). Guardamos name/role/
      // systemRole no user_metadata para que esse fluxo posterior os recupere.
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: userType, // lido pelo LoginScreen via user_metadata.role
            systemRole,
          },
        },
      });

      if (error) {
        alert(`Não foi possível criar a conta: ${error.message}`);
        return;
      }

      alert('Conta criada! Enviamos um e-mail de confirmação. Confirme seu e-mail para acessar.');
      navigate('/login');
    } catch {
      alert('Não foi possível conectar ao servidor. Tente novamente.');
    }
  };

  if (step === 'selection') {
    return (
      <div className="min-h-screen bg-white">
        <button
          onClick={() => navigate('/login')}
          className="fixed top-6 left-6 z-10 text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="p-6 max-w-2xl mx-auto"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-12 text-center mt-12"
          >
            <h1 className="text-3xl font-bold mb-2">Criar Conta</h1>
            <p className="text-gray-600">Escolha o tipo de conta</p>
          </motion.div>

          <div className="space-y-4 max-w-md mx-auto">
            {/* Clube Owner */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectType('CLUB_OWNER')}
              className="w-full flex items-center gap-4 p-5 bg-gray-50 border border-gray-200 rounded-2xl hover:border-black transition-all"
            >
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center flex-shrink-0">
                <Shield size={28} className="text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Clube</h3>
                <p className="text-sm text-gray-600">Cadastre aqui o clube no sistema</p>
              </div>
            </motion.button>

            {/* Admin */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectType('CLUB_ADMIN')}
              className="w-full flex items-center gap-4 p-5 bg-gray-50 border border-gray-200 rounded-2xl hover:border-black transition-all"
            >
              <div className="w-14 h-14 bg-[rgb(0,0,0)] rounded-2xl flex items-center justify-center flex-shrink-0">
                <BookOpen size={28} className="text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Admin do Clube</h3>
                <p className="text-sm text-gray-600">Técnico, treinador ou funcionário</p>
              </div>
            </motion.button>

            {/* Atleta */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectType('ATHLETE')}
              className="w-full flex items-center gap-4 p-5 bg-gray-50 border border-gray-200 rounded-2xl hover:border-black transition-all"
            >
              <div className="w-14 h-14 bg-[rgb(0,0,0)] rounded-2xl flex items-center justify-center flex-shrink-0">
                <Trophy size={28} className="text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Atleta</h3>
                <p className="text-sm text-gray-600">Participante das atividades</p>
              </div>
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mt-8 p-4 bg-gray-50 rounded-xl max-w-md mx-auto"
          >
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Responsáveis:</span> O acesso pode ser o mesmo do e-mail cadastrado. Assim, pais e responsáveis terão acesso à área específica.
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Form Step
  return (
    <div className="min-h-screen bg-white">
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6"
      >
        <button
          onClick={() => setStep('selection')}
          className="mb-6 text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft size={24} />
        </button>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-center">
            {userType === 'CLUB_OWNER' && 'Cadastro do Clube'}
            {userType === 'CLUB_ADMIN' && 'Admin do Clube'}
            {userType === 'ATHLETE' && 'Cadastro de Atleta'}
          </h1>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
          {/* Nome */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <label className="block text-sm text-gray-600 mb-2">
              {userType === 'CLUB_OWNER' ? 'Nome do Clube' : 'Nome Completo'}
            </label>
            <div className="relative">
              {userType === 'CLUB_OWNER' ? (
                <Building size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              ) : (
                <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              )}
              <input
                type="text"
                placeholder={userType === 'CLUB_OWNER' ? 'Nome do Clube' : 'João da Silva'}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </motion.div>

          {/* Email */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <label className="block text-sm text-gray-600 mb-2">E-mail</label>
            <div className="relative">
              <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <label className="block text-sm text-gray-600 mb-2">Senha</label>
            <div className="relative">
              <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </motion.div>

          {/* Campos específicos por tipo */}
          {userType === 'CLUB_ADMIN' && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <label className="block text-sm text-gray-600 mb-2">Cargo</label>
              <div className="relative">
                <Briefcase size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors appearance-none"
                >
                  <option value="">Selecione o cargo...</option>
                  <option value="Coordenador">Coordenador</option>
                  <option value="Treinador">Treinador</option>
                  <option value="Técnico">Técnico</option>
                  <option value="Assistente">Assistente</option>
                </select>
              </div>
            </motion.div>
          )}

          {userType === 'ATHLETE' && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <label className="block text-sm text-gray-600 mb-2">Data de Nascimento</label>
              <div className="relative">
                <Calendar size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="DD/MM/AAAA"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </motion.div>
          )}

          {/* Termos de Responsabilidade - Apenas para Atletas */}
          {userType === 'ATHLETE' && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="bg-gray-50 border border-gray-200 rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 flex-shrink-0"
                  id="terms-checkbox"
                />
                <label htmlFor="terms-checkbox" className="text-sm text-gray-700 flex-1">
                  Li e aceito o{' '}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="font-semibold text-black underline hover:text-gray-700 transition-colors"
                  >
                    Termo de Responsabilidade
                  </button>
                  {' '}para participação nas atividades esportivas
                </label>
              </div>
            </motion.div>
          )}

          {/* Termos de Prestação de Serviços - Apenas para Clubes */}
          {userType === 'CLUB_OWNER' && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="bg-gray-50 border border-gray-200 rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={acceptedClubTerms}
                  onChange={(e) => setAcceptedClubTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 flex-shrink-0"
                  id="club-terms-checkbox"
                />
                <label htmlFor="club-terms-checkbox" className="text-sm text-gray-700 flex-1">
                  Li e aceito o{' '}
                  <button
                    type="button"
                    onClick={() => setShowClubTermsModal(true)}
                    className="font-semibold text-black underline hover:text-gray-700 transition-colors"
                  >
                    Termo de Prestação de Serviços
                  </button>
                  {' '}para a prestação de serviços do clube
                </label>
              </div>
            </motion.div>
          )}

          {/* Termos de Responsabilidade Profissional - Apenas para Admins */}
          {userType === 'CLUB_ADMIN' && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="bg-gray-50 border border-gray-200 rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={acceptedAdminTerms}
                  onChange={(e) => setAcceptedAdminTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 flex-shrink-0"
                  id="admin-terms-checkbox"
                />
                <label htmlFor="admin-terms-checkbox" className="text-sm text-gray-700 flex-1">
                  Li e aceito o{' '}
                  <button
                    type="button"
                    onClick={() => setShowAdminTermsModal(true)}
                    className="font-semibold text-black underline hover:text-gray-700 transition-colors"
                  >
                    Termo de Responsabilidade Profissional
                  </button>
                  {' '}para a prestação de serviços do clube
                </label>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 bg-black text-white rounded-xl font-semibold mt-6"
          >
            Criar Conta
          </motion.button>
        </form>

        {/* Modal de Termo de Responsabilidade */}
        {showTermsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowTermsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                    <FileText size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Termo de Responsabilidade</h2>
                    <p className="text-sm text-gray-600">Participação em Atividades Esportivas</p>
                  </div>
                </div>
              </div>

              {/* Conteúdo Scrollável */}
              <div className="px-6 py-5 overflow-y-auto max-h-[calc(85vh-180px)] space-y-5">
                {/* Seção 1: Introdução */}
                <div>
                  <h3 className="font-semibold mb-2">1. Conhecimento dos Riscos</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Ao aceitar este termo, o atleta (ou responsável legal, no caso de menores de idade) declara estar ciente de que a prática de atividades esportivas envolve riscos inerentes, incluindo, mas não limitado a, lesões físicas, quedas, colisões e outros incidentes que podem ocorrer durante treinos, competições ou eventos organizados pelo clube.
                  </p>
                </div>

                {/* Seção 2: Saúde e Condicionamento */}
                <div>
                  <h3 className="font-semibold mb-2">2. Condição de Saúde</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">
                    O atleta declara que:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                    <li>Está em condições físicas adequadas para a prática das atividades propostas</li>
                    <li>Não possui restrições médicas que impeçam a participação em atividades esportivas</li>
                    <li>Compromete-se a informar imediatamente ao clube qualquer alteração em sua condição de saúde</li>
                    <li>Realizará acompanhamento médico regular conforme recomendação profissional</li>
                  </ul>
                </div>

                {/* Seção 3: Autorização de Imagem */}
                <div>
                  <h3 className="font-semibold mb-2">3. Uso de Imagem</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    O atleta autoriza o uso de sua imagem, voz e nome em fotografias, vídeos e demais materiais de divulgação produzidos durante eventos, treinos e atividades do clube, para fins de promoção institucional, redes sociais, site oficial e materiais informativos, sem qualquer ônus para o clube.
                  </p>
                </div>

                {/* Seção 4: Supervisão e Menores */}
                <div>
                  <h3 className="font-semibold mb-2">4. Responsabilidade Parental (Menores de Idade)</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">
                    Para atletas menores de 18 anos:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                    <li>O responsável legal autoriza a participação do menor nas atividades do clube</li>
                    <li>Compromete-se a garantir que o menor compareça aos treinos com equipamentos adequados</li>
                    <li>Manterá contato atualizado para emergências</li>
                    <li>Estará disponível para ser contatado durante as atividades, se necessário</li>
                  </ul>
                </div>

                {/* Seção 5: Equipamentos e Segurança */}
                <div>
                  <h3 className="font-semibold mb-2">5. Equipamentos de Proteção</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    O atleta compromete-se a utilizar os equipamentos de proteção individual (EPIs) recomendados pelo clube para cada modalidade esportiva, incluindo vestimenta adequada, calçados apropriados e demais itens de segurança obrigatórios.
                  </p>
                </div>

                {/* Seção 6: Código de Conduta */}
                <div>
                  <h3 className="font-semibold mb-2">6. Conduta e Disciplina</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">
                    O atleta compromete-se a:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                    <li>Respeitar treinadores, coordenadores e demais membros do clube</li>
                    <li>Seguir as orientações técnicas e de segurança fornecidas pelos profissionais</li>
                    <li>Manter comportamento ético e respeitoso durante todas as atividades</li>
                    <li>Comunicar imediatamente qualquer incidente ou desconforto durante as práticas</li>
                  </ul>
                </div>

                {/* Seção 7: Isenção de Responsabilidade */}
                <div>
                  <h3 className="font-semibold mb-2">7. Limitação de Responsabilidade</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    O clube não se responsabiliza por objetos pessoais perdidos, danificados ou furtados nas dependências ou durante atividades externas. Recomenda-se não trazer objetos de valor para as práticas esportivas.
                  </p>
                </div>

                {/* Seção 8: Dados Pessoais */}
                <div>
                  <h3 className="font-semibold mb-2">8. Proteção de Dados (LGPD)</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Os dados pessoais fornecidos serão utilizados exclusivamente para fins de gestão das atividades do clube, comunicação com atletas e responsáveis, e organização de eventos esportivos, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
                  </p>
                </div>

                {/* Seção 9: Validade */}
                <div>
                  <h3 className="font-semibold mb-2">9. Vigência</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Este termo permanece válido durante todo o período de vínculo do atleta com o clube, podendo ser revogado a qualquer momento mediante comunicação formal por escrito.
                  </p>
                </div>

                {/* Data e Aviso */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-6">
                  <p className="text-xs text-gray-600 text-center">
                    <strong>Data da última atualização:</strong> 05 de Janeiro de 2026
                  </p>
                  <p className="text-xs text-gray-600 text-center mt-2">
                    Ao aceitar este termo, você confirma que leu, compreendeu e concorda com todas as cláusulas aqui descritas.
                  </p>
                </div>
              </div>

              {/* Footer com botões */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowTermsModal(false)}
                  className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAcceptedTerms(true);
                    setShowTermsModal(false);
                  }}
                  className="flex-1 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                >
                  Aceitar Termo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Modal de Termo de Prestação de Serviços */}
        {showClubTermsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowClubTermsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                    <FileText size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Termo de Prestação de Serviços</h2>
                    <p className="text-sm text-gray-600">Prestação de Serviços do Clube</p>
                  </div>
                </div>
              </div>

              {/* Conteúdo Scrollável */}
              <div className="px-6 py-5 overflow-y-auto max-h-[calc(85vh-180px)] space-y-5">
                {/* Seção 1: Introdução */}
                <div>
                  <h3 className="font-semibold mb-2">1. Introdução</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Este Termo de Prestação de Serviços (o "Termo") é um acordo entre o Clube (o "Fornecedor") e o Usuário (o "Cliente"), que estabelece os termos e condições para a prestação de serviços relacionados a atividades esportivas.
                  </p>
                </div>

                {/* Seção 2: Serviços Prestados */}
                <div>
                  <h3 className="font-semibold mb-2">2. Serviços Prestados</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    O Fornecedor se compromete a fornecer aos Clientes os seguintes serviços:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                    <li>Treinamento e desenvolvimento de habilidades esportivas</li>
                    <li>Organização e coordenação de eventos esportivos</li>
                    <li>Supervisão e orientação de atividades físicas</li>
                    <li>Monitoramento de desempenho e progresso dos Clientes</li>
                  </ul>
                </div>

                {/* Seção 3: Responsabilidades do Fornecedor */}
                <div>
                  <h3 className="font-semibold mb-2">3. Responsabilidades do Fornecedor</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    O Fornecedor se compromete a:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                    <li>Fornecer serviços de alta qualidade e conforme as especificações acordadas</li>
                    <li>Manter a confidencialidade dos dados pessoais dos Clientes</li>
                    <li>Realizar treinos e atividades de forma segura e adequada</li>
                    <li>Comunicar-se regularmente com os Clientes sobre o progresso e desenvolvimento</li>
                  </ul>
                </div>

                {/* Seção 4: Responsabilidades do Cliente */}
                <div>
                  <h3 className="font-semibold mb-2">4. Responsabilidades do Cliente</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    O Cliente se compromete a:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                    <li>Participar ativamente das atividades e treinos agendados</li>
                    <li>Informar imediatamente ao Fornecedor sobre quaisquer lesões ou condições de saúde que possam afetar sua participação</li>
                    <li>Manter equipamentos e materiais fornecidos pelo Fornecedor em bom estado</li>
                    <li>Respeitar as regras e diretrizes estabelecidas pelo Fornecedor</li>
                  </ul>
                </div>

                {/* Seção 5: Limitação de Responsabilidade */}
                <div>
                  <h3 className="font-semibold mb-2">5. Limitação de Responsabilidade</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    O Fornecedor não se responsabiliza por:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                    <li>Lesões ou danos físicos que ocorram durante as atividades, a menos que sejam causados por negligência grave do Fornecedor</li>
                    <li>Perdas ou danos resultantes de atrasos ou cancelamentos de eventos</li>
                    <li>Qualquer outro dano ou perda que não seja diretamente causado pelo Fornecedor</li>
                  </ul>
                </div>

                {/* Seção 6: Dados Pessoais */}
                <div>
                  <h3 className="font-semibold mb-2">6. Proteção de Dados (LGPD)</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Os dados pessoais fornecidos serão utilizados exclusivamente para fins de gestão das atividades do clube, comunicação com atletas e responsáveis, e organização de eventos esportivos, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
                  </p>
                </div>

                {/* Seção 7: Validade */}
                <div>
                  <h3 className="font-semibold mb-2">7. Vigência</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Este termo permanece válido durante todo o período de vínculo do atleta com o clube, podendo ser revogado a qualquer momento mediante comunicação formal por escrito.
                  </p>
                </div>

                {/* Data e Aviso */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-6">
                  <p className="text-xs text-gray-600 text-center">
                    <strong>Data da última atualização:</strong> 05 de Janeiro de 2026
                  </p>
                  <p className="text-xs text-gray-600 text-center mt-2">
                    Ao aceitar este termo, você confirma que leu, compreendeu e concorda com todas as cláusulas aqui descritas.
                  </p>
                </div>
              </div>

              {/* Footer com botões */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowClubTermsModal(false)}
                  className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAcceptedClubTerms(true);
                    setShowClubTermsModal(false);
                  }}
                  className="flex-1 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                >
                  Aceitar Termo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Modal de Termo de Responsabilidade Profissional */}
        {showAdminTermsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowAdminTermsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                    <FileText size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Termo de Responsabilidade Profissional</h2>
                    <p className="text-sm text-gray-600">Prestação de Serviços do Clube</p>
                  </div>
                </div>
              </div>

              {/* Conteúdo Scrollável */}
              <div className="px-6 py-5 overflow-y-auto max-h-[calc(85vh-180px)] space-y-5">
                {/* Seção 1: Introdução */}
                <div>
                  <h3 className="font-semibold mb-2">1. Identificação Profissional</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Ao aceitar este termo, o profissional (coordenador, treinador, técnico ou assistente) declara possuir as qualificações, certificações e competências técnicas necessárias para o exercício da função no clube esportivo, comprometendo-se a atuar com ética, profissionalismo e responsabilidade.
                  </p>
                </div>

                {/* Seção 2: Responsabilidades Profissionais */}
                <div>
                  <h3 className="font-semibold mb-2">2. Responsabilidades Profissionais</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">
                    O profissional compromete-se a:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                    <li>Planejar, organizar e conduzir treinos e atividades esportivas com qualidade técnica</li>
                    <li>Garantir a segurança física e emocional de todos os atletas sob sua supervisão</li>
                    <li>Aplicar metodologias pedagógicas adequadas à faixa etária e nível técnico dos praticantes</li>
                    <li>Avaliar continuamente o desempenho e progresso dos atletas</li>
                    <li>Comunicar-se de forma clara e respeitosa com atletas, pais e responsáveis</li>
                  </ul>
                </div>

                {/* Seção 3: Proteção de Menores */}
                <div>
                  <h3 className="font-semibold mb-2">3. Proteção de Crianças e Adolescentes (ECA)</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">
                    Em conformidade com o Estatuto da Criança e do Adolescente (ECA - Lei nº 8.069/90), o profissional:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                    <li>Compromete-se a zelar pela integridade física, mental e moral dos menores</li>
                    <li>Proíbe-se de aplicar punições físicas, humilhações ou tratamentos degradantes</li>
                    <li>Deve comunicar imediatamente à coordenação qualquer suspeita de violência ou abuso</li>
                    <li>Respeita os direitos fundamentais de crianças e adolescentes em todas as atividades</li>
                  </ul>
                </div>

                {/* Seção 4: Conduta Ética */}
                <div>
                  <h3 className="font-semibold mb-2">4. Código de Conduta e Ética Profissional</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">
                    O profissional se compromete a:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                    <li>Manter postura profissional, respeitosa e imparcial com todos os atletas</li>
                    <li>Não praticar discriminação de qualquer natureza (etnia, gênero, religião, orientação sexual, etc.)</li>
                    <li>Manter sigilo profissional sobre informações pessoais e médicas dos atletas</li>
                    <li>Não utilizar sua posição para obter vantagens pessoais indevidas</li>
                    <li>Denunciar atos de corrupção, doping ou fraudes esportivas</li>
                  </ul>
                </div>

                {/* Seção 5: Saúde e Segurança */}
                <div>
                  <h3 className="font-semibold mb-2">5. Segurança e Primeiros Socorros</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">
                    O profissional deve:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                    <li>Verificar as condições de segurança do local antes de iniciar as atividades</li>
                    <li>Conhecer procedimentos básicos de primeiros socorros e protocolos de emergência</li>
                    <li>Exigir atestados médicos atualizados dos atletas</li>
                    <li>Adaptar treinos às condições físicas e limitações individuais de cada atleta</li>
                    <li>Comunicar imediatamente à coordenação qualquer acidente ou lesão ocorrida</li>
                  </ul>
                </div>

                {/* Seção 6: Desenvolvimento Profissional */}
                <div>
                  <h3 className="font-semibold mb-2">6. Qualificação e Atualização Profissional</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    O profissional declara possuir formação e certificações pertinentes à sua função e compromete-se a buscar atualização contínua através de cursos, workshops e capacitações na área esportiva, visando oferecer serviços de excelência aos atletas.
                  </p>
                </div>

                {/* Seção 7: Prevenção de Assédio */}
                <div>
                  <h3 className="font-semibold mb-2">7. Prevenção de Assédio Moral e Sexual</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">
                    O profissional reconhece e compromete-se a:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                    <li>Não praticar ou tolerar qualquer forma de assédio moral, sexual ou psicológico</li>
                    <li>Manter relacionamento estritamente profissional com todos os atletas</li>
                    <li>Evitar situações que possam gerar constrangimento ou desconforto aos atletas</li>
                    <li>Respeitar os limites físicos e emocionais de cada indivíduo</li>
                  </ul>
                </div>

                {/* Seção 8: Uso de Imagem e Redes Sociais */}
                <div>
                  <h3 className="font-semibold mb-2">8. Uso de Imagem e Comunicação Digital</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">
                    O profissional compromete-se a:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                    <li>Não divulgar imagens ou informações de atletas menores sem autorização dos responsáveis</li>
                    <li>Manter comunicação profissional e transparente através de canais oficiais do clube</li>
                    <li>Não fazer comentários depreciativos sobre atletas, pais ou o clube em redes sociais</li>
                    <li>Representar adequadamente o clube em todas as comunicações públicas</li>
                  </ul>
                </div>

                {/* Seção 9: Responsabilidade Civil */}
                <div>
                  <h3 className="font-semibold mb-2">9. Responsabilidade Civil e Compliance</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    O profissional reconhece que pode ser responsabilizado civil e criminalmente por negligência, imperícia ou imprudência no exercício de suas funções, comprometendo-se a seguir todas as normas, regulamentos e legislações aplicáveis ao esporte e à educação física.
                  </p>
                </div>

                {/* Seção 10: Proteção de Dados */}
                <div>
                  <h3 className="font-semibold mb-2">10. Proteção de Dados (LGPD)</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    O profissional compromete-se a tratar dados pessoais de atletas, pais e responsáveis exclusivamente para fins profissionais relacionados às atividades do clube, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018), garantindo confidencialidade e segurança das informações.
                  </p>
                </div>

                {/* Seção 11: Rescisão */}
                <div>
                  <h3 className="font-semibold mb-2">11. Rescisão e Desligamento</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    O clube reserva-se o direito de desligar o profissional em caso de descumprimento deste termo, conduta inadequada, negligência profissional ou qualquer ato que comprometa a segurança, integridade ou reputação dos atletas e da instituição.
                  </p>
                </div>

                {/* Seção 12: Vigência */}
                <div>
                  <h3 className="font-semibold mb-2">12. Vigência</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Este termo permanece válido durante todo o período de vínculo profissional com o clube, podendo ser atualizado mediante comunicação formal, cabendo ao profissional manter-se informado sobre quaisquer alterações.
                  </p>
                </div>

                {/* Data e Aviso */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-6">
                  <p className="text-xs text-gray-600 text-center">
                    <strong>Data da última atualização:</strong> 05 de Janeiro de 2026
                  </p>
                  <p className="text-xs text-gray-600 text-center mt-2">
                    Ao aceitar este termo, você confirma que leu, compreendeu e concorda com todas as cláusulas aqui descritas, comprometendo-se a exercer suas funções com profissionalismo, ética e responsabilidade.
                  </p>
                </div>
              </div>

              {/* Footer com botões */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAdminTermsModal(false)}
                  className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAcceptedAdminTerms(true);
                    setShowAdminTermsModal(false);
                  }}
                  className="flex-1 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                >
                  Aceitar Termo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}