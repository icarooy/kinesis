import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Trophy } from 'lucide-react';

export default function OnboardingScreen1({ onComplete }: { onComplete: () => void }) {
  const navigate = useNavigate();

  const handleSkip = () => {
    onComplete();
    navigate('/login');
  };
  // ...

  return (
    <div className="h-dvh bg-white flex flex-col items-center overflow-hidden">
      <div className="w-full max-w-md flex flex-col h-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex-1 flex flex-col items-center justify-center px-8"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-32 h-32 lg:w-40 lg:h-40 bg-gray-100 rounded-full flex items-center justify-center mb-8"
          >
            <Trophy size={64} className="text-black" strokeWidth={1.5} />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-2xl lg:text-3xl font-bold text-center mb-4"
          >
            Gerencie seu Clube
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center text-gray-600 text-base lg:text-lg max-w-sm px-4"
          >
            Organize atividades, eventos e comunique-se com todos os membros de forma simples e eficiente.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="p-6 lg:p-8 pb-8"
        >
          <div className="flex justify-center gap-2 mb-6">
            <div className="w-8 h-2 bg-black rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSkip}
              className="flex-1 py-3 lg:py-4 text-gray-600 font-medium"
            >
              Pular
            </button>
            <motion.button
  type="button"
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  onClick={() => navigate('/onboarding-2')}
  className="flex-1 py-3 lg:py-4 bg-black text-white rounded-xl font-semibold"
>
  Próximo
</motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}