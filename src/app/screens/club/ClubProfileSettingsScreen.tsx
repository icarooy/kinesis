import { motion } from 'motion/react';
import { ArrowLeft, Camera, Building2, Mail, Phone, MapPin, FileText, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import ImageCropModal from '../../components/ImageCropModal';

interface ClubProfileForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  description: string;
}

export default function ClubProfileSettingsScreen() {
  const navigate = useNavigate();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<ClubProfileForm>({
    defaultValues: {
      name: 'FC Barcelona Academy',
      email: 'admin@fcbarcelona.com',
      phone: '(11) 3456-7890',
      address: 'Rua do Fogo, 123',
      city: 'Caxias',
      state: 'MA',
      zipCode: '01234-567',
      description: 'Academia de futebol focada no desenvolvimento técnico e tático de jovens atletas.',
    }
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setLogoPreview(croppedImage);
    setIsCropModalOpen(false);
  };

  const onSubmit = async (data: ClubProfileForm) => {
    setIsSaving(true);
    
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Dados salvos:', data);
    alert('Perfil do clube atualizado com sucesso! ✅');
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
          <h1 className="text-2xl font-bold">Editar Perfil do Clube</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Logo Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="flex flex-col items-center mb-8"
          >
            <div className="relative mb-4">
              <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center overflow-hidden">
                {logoPreview ? (
                  <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-3xl">F</span>
                )}
              </div>
              <label
                htmlFor="logo-upload"
                className="absolute bottom-0 right-0 w-8 h-8 bg-black border-2 border-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors"
              >
                <Camera size={16} className="text-white" />
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                />
              </label>
            </div>
            <p className="text-sm text-gray-600">Clique no ícone para alterar o logo</p>
          </motion.div>

          {/* Informações Básicas */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mb-8"
          >
            <h3 className="font-semibold mb-4">Informações Básicas</h3>
            <div className="space-y-4">
              {/* Nome do Clube */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Nome do Clube</label>
                <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-black transition-colors">
                  <Building2 size={20} className="text-gray-600" />
                  <input
                    {...register('name', { required: 'Nome do clube é obrigatório' })}
                    type="text"
                    className="flex-1 bg-transparent outline-none text-sm"
                    placeholder="Digite o nome do clube"
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
                    placeholder="contato@clube.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Telefone */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Telefone</label>
                <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-black transition-colors">
                  <Phone size={20} className="text-gray-600" />
                  <input
                    {...register('phone', { required: 'Telefone é obrigatório' })}
                    type="tel"
                    className="flex-1 bg-transparent outline-none text-sm"
                    placeholder="(11) 3456-7890"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>

              {/* Descrição */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Descrição do Clube</label>
                <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-black transition-colors">
                  <FileText size={20} className="text-gray-600 mt-1" />
                  <textarea
                    {...register('description')}
                    rows={4}
                    className="flex-1 bg-transparent outline-none text-sm resize-none"
                    placeholder="Descreva seu clube, modalidades, missão..."
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Endereço */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mb-8"
          >
            <h3 className="font-semibold mb-4">Endereço (Opcional)</h3>
            <div className="space-y-4">
              {/* Endereço */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Rua e Número</label>
                <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-black transition-colors">
                  <MapPin size={20} className="text-gray-600" />
                  <input
                    {...register('address')}
                    type="text"
                    className="flex-1 bg-transparent outline-none text-sm"
                    placeholder="Rua do Fogo, 123"
                  />
                </div>
              </div>

              {/* Cidade e Estado */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Cidade</label>
                  <input
                    {...register('city')}
                    type="text"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm focus:border-black transition-colors"
                    placeholder="Caxias"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Estado</label>
                  <input
                    {...register('state')}
                    type="text"
                    maxLength={2}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm focus:border-black transition-colors uppercase"
                    placeholder="MA"
                  />
                </div>
              </div>

              {/* CEP */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">CEP</label>
                <input
                  {...register('zipCode')}
                  type="text"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm focus:border-black transition-colors"
                  placeholder="01234-567"
                />
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
        title="Ajustar Logo do Clube"
      />
    </div>
  );
}