import { motion } from 'motion/react';
import { Calendar, CreditCard, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Payment } from '../../types';
import { format, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PaymentCardProps {
  payment: Payment;
  onClick?: () => void;
}

export function PaymentCard({ payment, onClick }: PaymentCardProps) {
  const isOverdue = payment.status === 'pending' && isPast(payment.dueDate);
  
  const statusConfig = {
    paid: {
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-50',
      label: 'Pago',
    },
    pending: {
      icon: isOverdue ? AlertCircle : Clock,
      color: isOverdue ? 'text-red-600' : 'text-yellow-600',
      bg: isOverdue ? 'bg-red-50' : 'bg-yellow-50',
      label: isOverdue ? 'Atrasado' : 'Pendente',
    },
    overdue: {
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      label: 'Atrasado',
    },
  };

  const config = statusConfig[payment.status];
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      whileTap={{ scale: onClick ? 0.98 : 1 }}
      onClick={onClick}
      className={`bg-white border border-gray-200 rounded-xl p-4 ${
        onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold mb-1">{payment.title}</h3>
          {payment.description && (
            <p className="text-sm text-gray-600">{payment.description}</p>
          )}
        </div>
        <div className={`${config.bg} ${config.color} rounded-full px-3 py-1 flex items-center gap-1`}>
          <StatusIcon size={14} />
          <span className="text-xs font-semibold">{config.label}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} />
            <span>
              Vencimento: {format(payment.dueDate, "dd 'de' MMMM", { locale: ptBR })}
            </span>
          </div>
          {payment.paidAt && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle2 size={16} />
              <span>
                Pago em: {format(payment.paidAt, "dd 'de' MMMM", { locale: ptBR })}
              </span>
            </div>
          )}
          {payment.paymentMethod && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CreditCard size={16} />
              <span className="capitalize">{payment.paymentMethod}</span>
            </div>
          )}
        </div>
        
        <div className="text-right">
          <p className="text-2xl font-bold">
            R$ {payment.amount.toFixed(2)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
