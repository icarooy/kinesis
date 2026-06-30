import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { KeyRound, QrCode } from 'lucide-react';

interface Props {
  onConnect: () => void;
}

export default function ClubConnectionScreen({ onConnect }: Props) {
  const navigate = useNavigate();
  const [code, setCode] = useState('');

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length === 6) {
      onConnect();
      navigate('/dashboard');
    }
  };

  const handleCodeChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 6);
    setCode(numericValue);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 flex flex-col justify-center px-6 py-12"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <KeyRound size={60} className="text-black" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Conectar ao Clube</h1>
          <p className="text-gray-600">
            Insira o código de 6 dígitos fornecido pelo seu clube
          </p>
        </motion.div>

        <form onSubmit={handleConnect} className="max-w-md mx-auto w-full">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="mb-6"
          >
            <input
              type="text"
              inputMode="numeric"
              placeholder="000000"
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="w-full px-6 py-5 text-center text-4xl font-bold tracking-[0.5em] bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
              maxLength={6}
            />
          </motion.div>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={code.length !== 6}
            className={`w-full py-4 rounded-xl font-semibold transition-all ${
              code.length === 6
                ? 'bg-black text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Conectar
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl"
          >
            <p className="text-sm text-yellow-900">
              <span className="font-semibold">Onde encontrar o código?</span>
              <br />
              Peça ao administrador do clube para compartilhar o código de acesso.
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            type="button"
            className="w-full mt-6 py-3 flex items-center justify-center gap-2 text-gray-600 hover:text-black transition-colors"
          >
            <QrCode size={24} />
            <span className="font-medium">Escanear QR Code</span>
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
