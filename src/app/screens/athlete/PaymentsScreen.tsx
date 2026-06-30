import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DollarSign, QrCode, CreditCard, X, CheckCircle2, Copy, Calendar } from 'lucide-react';
import { useAppData } from '../../contexts/AppDataContext';
import { PaymentCard } from '../../components/payments/PaymentCard';
import { Payment } from '../../types';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function PaymentsScreen() {
  const { payments, updatePaymentStatus } = useAppData();
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'paid'>('all');

  // Mock athlete ID
  const athleteId = 'athlete1';

  // Filter payments for this athlete
  const myPayments = useMemo(() => {
    return payments.filter(p => p.athleteId === athleteId || !p.athleteId);
  }, [payments, athleteId]);

  // Calculate stats
  const stats = useMemo(() => {
    const pending = myPayments.filter(p => p.status === 'pending');
    const paid = myPayments.filter(p => p.status === 'paid');
    const totalPending = pending.reduce((sum, p) => sum + p.amount, 0);
    const totalPaid = paid.reduce((sum, p) => sum + p.amount, 0);

    return { pending, paid, totalPending, totalPaid };
  }, [myPayments]);

  // Filter by status
  const filteredPayments = useMemo(() => {
    if (filterStatus === 'all') return myPayments;
    return myPayments.filter(p => p.status === filterStatus);
  }, [myPayments, filterStatus]);

  const handlePaymentClick = (payment: Payment) => {
    if (payment.status === 'pending') {
      setSelectedPayment(payment);
      setShowPaymentModal(true);
    }
  };

  const handlePaymentConfirm = () => {
    if (selectedPayment) {
      updatePaymentStatus(
        selectedPayment.id,
        'paid',
        new Date(),
        'pix'
      );
      setShowPaymentModal(false);
      setSelectedPayment(null);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-br from-black to-gray-800 text-white p-6 pb-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign size={32} />
              <h1 className="text-2xl font-bold">Pagamentos</h1>
            </div>
            <p className="text-gray-300">
              Acompanhe suas mensalidades e cobranças
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-2xl mx-auto -mt-4 px-4 mb-6">
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 border border-gray-200"
            >
              <div className="flex items-center gap-2 text-yellow-600 mb-2">
                <Calendar size={18} />
                <span className="text-sm font-medium">Pendente</span>
              </div>
              <p className="text-2xl font-bold">R$ {stats.totalPending.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-1">{stats.pending.length} cobrança{stats.pending.length !== 1 ? 's' : ''}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded-xl p-4 border border-gray-200"
            >
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <CheckCircle2 size={18} />
                <span className="text-sm font-medium">Pago</span>
              </div>
              <p className="text-2xl font-bold">R$ {stats.totalPaid.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-1">{stats.paid.length} pagamento{stats.paid.length !== 1 ? 's' : ''}</p>
            </motion.div>
          </div>
        </div>

        {/* Payments List */}
        <div className="max-w-2xl mx-auto px-4 pb-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="all" onClick={() => setFilterStatus('all')}>
                Todas
              </TabsTrigger>
              <TabsTrigger value="pending" onClick={() => setFilterStatus('pending')}>
                Pendentes
              </TabsTrigger>
              <TabsTrigger value="paid" onClick={() => setFilterStatus('paid')}>
                Pagas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3">
              {filteredPayments.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center">
                  <DollarSign size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">Nenhuma cobrança encontrada</p>
                </div>
              ) : (
                filteredPayments.map(payment => (
                  <PaymentCard
                    key={payment.id}
                    payment={payment}
                    onClick={() => handlePaymentClick(payment)}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-3">
              {filteredPayments.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center">
                  <CheckCircle2 size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">Nenhuma cobrança pendente! 🎉</p>
                </div>
              ) : (
                filteredPayments.map(payment => (
                  <PaymentCard
                    key={payment.id}
                    payment={payment}
                    onClick={() => handlePaymentClick(payment)}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="paid" className="space-y-3">
              {filteredPayments.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center">
                  <DollarSign size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">Nenhum pagamento realizado ainda</p>
                </div>
              ) : (
                filteredPayments.map(payment => (
                  <PaymentCard key={payment.id} payment={payment} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && selectedPayment && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPaymentModal(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-white rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
                <h2 className="font-semibold">Pagar Cobrança</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowPaymentModal(false)}>
                  <X size={20} />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Payment Details */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <h3 className="font-semibold mb-3">{selectedPayment.title}</h3>
                  {selectedPayment.description && (
                    <p className="text-sm text-gray-600 mb-3">{selectedPayment.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Valor</span>
                    <span className="text-2xl font-bold">R$ {selectedPayment.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-600">Vencimento</span>
                    <span className="text-sm font-medium">
                      {format(selectedPayment.dueDate, "dd 'de' MMMM", { locale: ptBR })}
                    </span>
                  </div>
                </div>

                {/* PIX QR Code (Mock) */}
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 mb-6">
                  <div className="text-center mb-4">
                    <QrCode size={160} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600 mb-2">Código PIX Copia e Cola</p>
                    <div className="bg-gray-100 rounded-lg p-3 font-mono text-xs break-all text-gray-700 mb-3">
                      00020126580014br.gov.bcb.pix0136{selectedPayment.id}520400005303986540{selectedPayment.amount.toFixed(2)}5802BR5925Esportiva FC6009SAO PAULO62070503***6304ABCD
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        // In real app, this would copy to clipboard
                        alert('Código PIX copiado!');
                      }}
                    >
                      <Copy size={16} className="mr-2" />
                      Copiar Código PIX
                    </Button>
                  </div>
                </div>

                {/* Other Payment Methods */}
                <div className="space-y-3 mb-6">
                  <p className="text-sm font-medium text-gray-600">Outras formas de pagamento</p>
                  <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <CreditCard size={20} />
                      <span className="font-medium">Boleto Bancário</span>
                    </div>
                    <span className="text-sm text-gray-600">→</span>
                  </button>
                  <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <CreditCard size={20} />
                      <span className="font-medium">Cartão de Crédito</span>
                    </div>
                    <span className="text-sm text-gray-600">→</span>
                  </button>
                </div>

                {/* Mock Payment Button */}
                <Button
                  onClick={handlePaymentConfirm}
                  className="w-full bg-green-600 text-white hover:bg-green-700"
                >
                  <CheckCircle2 size={18} className="mr-2" />
                  Simular Pagamento (Demo)
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Este é um ambiente de demonstração
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
