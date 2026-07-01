import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DollarSign, X, CheckCircle2, Copy, Calendar, ExternalLink } from 'lucide-react';
import { Payment as MPPaymentBrick } from '@mercadopago/sdk-react';
import { toast } from 'sonner';
import { useClubStore } from '../../stores/clubStore';
import { PaymentCard } from '../../components/payments/PaymentCard';
import { Payment } from '../../types';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { listPayments, checkoutPayment, refreshPaymentStatus } from '../../services/payments';
import type { ApiError } from '../../services/api';

// Formato do formData retornado pelo Payment Brick no onSubmit (payment-method.md
// da SDK do Mercado Pago). Tipado localmente para não depender de tipos internos
// não exportados publicamente pelo pacote @mercadopago/sdk-react.
interface BrickPayerAddress {
  zip_code?: string;
  street_name?: string;
  street_number?: string;
  neighborhood?: string;
  city?: string;
  federal_unit?: string;
}

interface BrickFormData {
  payment_method_id: string;
  token?: string;
  issuer_id?: string;
  installments?: number;
  payer: {
    email: string;
    first_name?: string;
    last_name?: string;
    identification?: { type?: string; number?: string };
    address?: BrickPayerAddress;
  };
}

interface BrickSubmitParam {
  paymentType: string;
  formData: BrickFormData;
}

export default function PaymentsScreen() {
  const clubId = useClubStore((state) => state.clubId);
  const currentUser = useClubStore((state) => state.currentUser);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [checkoutResult, setCheckoutResult] = useState<Payment | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'paid'>('all');

  // O backend já retorna apenas as cobranças do próprio atleta (ou todas, se
  // o usuário logado for staff do clube) — sem filtro local por athleteId mock.
  useEffect(() => {
    if (!clubId) {
      setPayments([]);
      return;
    }

    let cancelled = false;

    listPayments(clubId)
      .then((data) => {
        if (!cancelled) setPayments(data);
      })
      .catch((err) => {
        if (!cancelled) {
          toast.error((err as ApiError).message ?? 'Não foi possível carregar as cobranças.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [clubId]);

  // Calculate stats
  const stats = useMemo(() => {
    const pending = payments.filter(p => p.status === 'pending');
    const paid = payments.filter(p => p.status === 'paid');
    const totalPending = pending.reduce((sum, p) => sum + p.amount, 0);
    const totalPaid = paid.reduce((sum, p) => sum + p.amount, 0);

    return { pending, paid, totalPending, totalPaid };
  }, [payments]);

  // Filter by status
  const filteredPayments = useMemo(() => {
    if (filterStatus === 'all') return payments;
    return payments.filter(p => p.status === filterStatus);
  }, [payments, filterStatus]);

  const handlePaymentClick = (payment: Payment) => {
    if (payment.status === 'pending') {
      setSelectedPayment(payment);
      setCheckoutResult(null);
      setShowPaymentModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
    setSelectedPayment(null);
    setCheckoutResult(null);
  };

  const applyUpdatedPayment = (updated: Payment) => {
    setPayments((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleBrickSubmit = async ({ paymentType, formData }: BrickSubmitParam) => {
    if (!clubId || !selectedPayment) return;

    try {
      const result = await checkoutPayment(clubId, selectedPayment.id, {
        paymentMethodId: formData.payment_method_id,
        paymentTypeId: paymentType,
        token: formData.token,
        issuerId: formData.issuer_id,
        installments: formData.installments,
        payerEmail: formData.payer.email,
        payerFirstName: formData.payer.first_name,
        payerLastName: formData.payer.last_name,
        identificationType: formData.payer.identification?.type,
        identificationNumber: formData.payer.identification?.number,
        address: formData.payer.address
          ? {
              zipCode: formData.payer.address.zip_code,
              streetName: formData.payer.address.street_name,
              streetNumber: formData.payer.address.street_number,
              neighborhood: formData.payer.address.neighborhood,
              city: formData.payer.address.city,
              federalUnit: formData.payer.address.federal_unit,
            }
          : undefined,
      });

      setCheckoutResult(result);
      applyUpdatedPayment(result);

      if (result.status === 'paid') {
        toast.success('Pagamento aprovado!');
      } else {
        toast.success('Cobrança gerada. Conclua o pagamento conforme as instruções.');
      }
    } catch (err) {
      toast.error((err as ApiError).message ?? 'Não foi possível processar o pagamento.');
      throw err;
    }
  };

  const handleCheckStatus = async () => {
    if (!clubId || !checkoutResult) return;

    setIsCheckingStatus(true);
    try {
      const updated = await refreshPaymentStatus(clubId, checkoutResult.id);
      setCheckoutResult(updated);
      applyUpdatedPayment(updated);

      if (updated.status === 'paid') {
        toast.success('Pagamento confirmado!');
      } else {
        toast.info('Ainda não identificamos a confirmação do pagamento.');
      }
    } catch (err) {
      toast.error((err as ApiError).message ?? 'Não foi possível consultar o status.');
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleCopyPixCode = async () => {
    if (!checkoutResult?.qrCode) return;
    try {
      await navigator.clipboard.writeText(checkoutResult.qrCode);
      toast.success('Código Pix copiado!');
    } catch {
      toast.error('Não foi possível copiar o código.');
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
              onClick={handleCloseModal}
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
                <Button variant="ghost" size="icon" onClick={handleCloseModal}>
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

                {!checkoutResult ? (
                  // Checkout real: Payment Brick do Mercado Pago (Pix, cartão e boleto).
                  <MPPaymentBrick
                    initialization={{
                      amount: selectedPayment.amount,
                      payer: currentUser?.email ? { email: currentUser.email } : undefined,
                    }}
                    customization={{
                      paymentMethods: {
                        creditCard: 'all',
                        debitCard: 'all',
                        ticket: 'all',
                        bankTransfer: 'all',
                        maxInstallments: 12,
                      },
                    }}
                    onSubmit={handleBrickSubmit}
                    onError={(error) => {
                      console.error('Payment Brick error', error);
                      toast.error('Não foi possível carregar o checkout de pagamento.');
                    }}
                  />
                ) : checkoutResult.status === 'paid' ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center mb-6">
                    <CheckCircle2 size={48} className="mx-auto mb-3 text-green-600" />
                    <p className="font-semibold text-green-700">Pagamento aprovado!</p>
                  </div>
                ) : (
                  <div className="space-y-4 mb-6">
                    {checkoutResult.qrCodeBase64 && (
                      <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6">
                        <div className="text-center mb-4">
                          <img
                            src={`data:image/png;base64,${checkoutResult.qrCodeBase64}`}
                            alt="QR Code Pix"
                            className="mx-auto mb-3 w-40 h-40"
                          />
                          <p className="text-sm text-gray-600 mb-2">Código Pix Copia e Cola</p>
                          <div className="bg-gray-100 rounded-lg p-3 font-mono text-xs break-all text-gray-700 mb-3">
                            {checkoutResult.qrCode}
                          </div>
                          <Button variant="outline" size="sm" className="w-full" onClick={handleCopyPixCode}>
                            <Copy size={16} className="mr-2" />
                            Copiar Código Pix
                          </Button>
                        </div>
                      </div>
                    )}

                    {checkoutResult.ticketUrl && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => window.open(checkoutResult.ticketUrl, '_blank', 'noopener,noreferrer')}
                      >
                        <ExternalLink size={16} className="mr-2" />
                        Abrir boleto
                      </Button>
                    )}

                    <Button
                      onClick={handleCheckStatus}
                      disabled={isCheckingStatus}
                      className="w-full bg-black text-white hover:bg-gray-800"
                    >
                      {isCheckingStatus ? 'Verificando...' : 'Verificar status do pagamento'}
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
