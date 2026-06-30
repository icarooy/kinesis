import { motion } from 'motion/react';
import { ArrowLeft, Camera, User, Mail, Calendar, Phone, Users, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import ImageCropModal from '../../components/ImageCropModal';

interface AthleteProfileForm {
  name: string;
  email: string;
  birthDate: string;
  personalPhone: string;
  guardianName: string;
  guardianPhone: string;
}

export default function AthleteProfileSettingsScreen() {
  const navigate = useNavigate();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<AthleteProfileForm>({
    defaultValues: {
      name: 'João Silva',
      email: 'joao.silva@email.com',
      birthDate: '2009-03-15',
      personalPhone: '(11) 91234-5678',
      guardianName: 'Maria Silva',
      guardianPhone: '(11) 98765-4321',
    }
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result as string);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = (croppedImage: string) => {
    setAvatarPreview(croppedImage);
    setIsCropModalOpen(false);
  };

  const onSubmit = async (data: AthleteProfileForm) => {
    setIsSaving(true);
    
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Dados salvos:', data);
    alert('Perfil atualizado com sucesso! ✅');
    setIsSaving(false);
    navigate('/dashboard/profile');
  };

  return (
    <div className="min-h-screen bg-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="p-6 pt-12 max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/dashboard/profile')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Editar Perfil</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Avatar Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="flex flex-col items-center mb-8"
          >
            <div className="relative mb-4">
              <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-3xl">J</span>
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 w-8 h-8 bg-black border-2 border-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors"
              >
                <Camera size={16} className="text-white" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <p className="text-sm text-gray-600">Clique no ícone para alterar a foto</p>
          </motion.div>

          {/* Informações Pessoais */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mb-8"
          >
            <h3 className="font-semibold mb-4">Informações Pessoais</h3>
            <div className="space-y-4">
              {/* Nome */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Nome Completo</label>
                <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-black transition-colors">
                  <User size={20} className="text-gray-600" />
                  <input
                    {...register('name', { required: 'Nome é obrigatório' })}
                    type="text"
                    className="flex-1 bg-transparent outline-none text-sm"
                    placeholder="Digite seu nome completo"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">E-mail</label>
                <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-black transition-colors">
                  <Mail size={20} className="text-gray-600" />
                  <input
                    {...register('email', { 
                      required: 'E-mail é obrigatório',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'E-mail inválido'
                      }
                    })}
                    type="email"
                    className="flex-1 bg-transparent outline-none text-sm"
                    placeholder="seu@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Data de Nascimento */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Data de Nascimento</label>
                <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-black transition-colors">
                  <Calendar size={20} className="text-gray-600" />
                  <input
                    {...register('birthDate', { required: 'Data de nascimento é obrigatória' })}
                    type="date"
                    className="flex-1 bg-transparent outline-none text-sm"
                  />
                </div>
                {errors.birthDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.birthDate.message}</p>
                )}
              </div>

              {/* Telefone Pessoal */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Telefone Pessoal (Opcional)</label>
                <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-black transition-colors">
                  <Phone size={20} className="text-gray-600" />
                  <input
                    {...register('personalPhone')}
                    type="tel"
                    className="flex-1 bg-transparent outline-none text-sm"
                    placeholder="(11) 91234-5678"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Informações do Responsável */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mb-8"
          >
            <h3 className="font-semibold mb-4">Informações do Responsável</h3>
            <div className="space-y-4">
              {/* Nome do Responsável */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Nome do Responsável</label>
                <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-black transition-colors">
                  <Users size={20} className="text-gray-600" />
                  <input
                    {...register('guardianName', { required: 'Nome do responsável é obrigatório' })}
                    type="text"
                    className="flex-1 bg-transparent outline-none text-sm"
                    placeholder="Nome completo"
                  />
                </div>
                {errors.guardianName && (
                  <p className="text-red-500 text-xs mt-1">{errors.guardianName.message}</p>
                )}
              </div>

              {/* Telefone do Responsável */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Telefone do Responsável</label>
                <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-black transition-colors">
                  <Phone size={20} className="text-gray-600" />
                  <input
                    {...register('guardianPhone', { required: 'Telefone do responsável é obrigatório' })}
                    type="tel"
                    className="flex-1 bg-transparent outline-none text-sm"
                    placeholder="(11) 98765-4321"
                  />
                </div>
                {errors.guardianPhone && (
                  <p className="text-red-500 text-xs mt-1">{errors.guardianPhone.message}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Botões de Ação */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="flex gap-3 sticky bottom-6"
          >
            <button
              type="button"
              onClick={() => navigate('/dashboard/profile')}
              className="flex-1 p-4 bg-gray-100 border border-gray-200 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isDirty || isSaving}
              className="flex-1 p-4 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Salvar Alterações
                </>
              )}
            </button>
          </motion.div>
        </form>
      </motion.div>

      {/* Modal de Recorte de Imagem */}
      <ImageCropModal
        isOpen={isCropModalOpen}
        imageSrc={tempImage || ''}
        onClose={() => setIsCropModalOpen(false)}
        onComplete={handleCrop}
        title="Ajustar Foto de Perfil"
      />
    </div>
  );
}