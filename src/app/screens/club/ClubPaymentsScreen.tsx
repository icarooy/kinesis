import { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, DollarSign, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppData } from '../../contexts/AppDataContext';
import { useClubStore } from '../../stores/clubStore';
import { CreateChargeModal } from '../../components/payments/CreateChargeModal';
import { PaymentCard } from '../../components/payments/PaymentCard';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import type { Payment } from '../../types';
import { listPayments, createChargeForClub } from '../../services/payments';
import type { ApiError } from '../../services/api';

export default function ClubPaymentsScreen() {
  // `teams` continua vindo do mock local: o backend ainda não modela "turma",
  // então o seletor de turma do CreateChargeModal é só cosmético por enquanto
  // (toda cobrança criada é individual, para cada membro ativo do clube).
  const { teams } = useAppData();
  const clubId = useClubStore((state) => state.clubId);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateCharge, setShowCreateCharge] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'paid'>('all');

  useEffect(() => {
    if (!clubId) {
      setPayments([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    listPayments(clubId)
      .then((data) => {
        if (!cancelled) setPayments(data);
      })
      .catch((err) => {
        if (!cancelled) {
          toast.error((err as ApiError).message ?? 'Não foi possível carregar as cobranças.');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [clubId]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = payments.reduce((sum, p) => sum + p.amount, 0);
    const paid = payments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);
    const pending = payments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);
    const overdue = payments
      .filter(p => p.status === 'overdue')
      .reduce((sum, p) => sum + p.amount, 0);

    return { total, paid, pending, overdue };
  }, [payments]);

  // Filter payments
  const filteredPayments = useMemo(() => {
    if (filterStatus === 'all') return payments;
    return payments.filter(p => p.status === filterStatus);
  }, [payments, filterStatus]);

  const handleCreateCharge = async (charge: {
    title: string;
    description: string;
    amount: number;
    dueDate: Date;
    teamId?: string;
  }) => {
    if (!clubId) return;

    try {
      const created = await createChargeForClub(clubId, {
        title: charge.title,
        description: charge.description,
        amount: charge.amount,
        dueDate: charge.dueDate,
      });
      setPayments((prev) => [...created, ...prev]);
      toast.success(
        `Cobrança criada para ${created.length} atleta${created.length !== 1 ? 's' : ''}.`,
      );
    } catch (err) {
      toast.error((err as ApiError).message ?? 'Não foi possível criar a cobrança.');
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-black text-white p-6 pb-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign size={32} />
              <h1 className="text-2xl font-bold">Pagamentos</h1>
            </div>
            <p className="text-gray-300">
              Gerencie cobranças e acompanhe pagamentos
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
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <CheckCircle2 size={18} />
                <span className="text-sm font-medium">Recebido</span>
              </div>
              <p className="text-2xl font-bold">R$ {stats.paid.toFixed(2)}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded-xl p-4 border border-gray-200"
            >
              <div className="flex items-center gap-2 text-yellow-600 mb-2">
                <AlertCircle size={18} />
                <span className="text-sm font-medium">Pendente</span>
              </div>
              <p className="text-2xl font-bold">R$ {stats.pending.toFixed(2)}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-4 border border-gray-200 col-span-2"
            >
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <TrendingUp size={18} />
                <span className="text-sm font-medium">Total Cobrado</span>
              </div>
              <p className="text-3xl font-bold">R$ {stats.total.toFixed(2)}</p>
            </motion.div>
          </div>
        </div>

        {/* New Charge Button */}
        <div className="max-w-2xl mx-auto px-4 mb-4">
          <Button
            onClick={() => setShowCreateCharge(true)}
            className="w-full bg-black text-white hover:bg-gray-800 h-12 text-base font-medium"
          >
            <Plus size={20} className="mr-2" />
            Nova Cobrança
          </Button>
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
                  <p className="text-gray-500 mb-4">Nenhuma cobrança criada</p>
                  <Button
                    onClick={() => setShowCreateCharge(true)}
                    className="bg-black text-white hover:bg-gray-800"
                  >
                    <Plus size={18} className="mr-2" />
                    Criar Primeira Cobrança
                  </Button>
                </div>
              ) : (
                filteredPayments.map(payment => (
                  <PaymentCard key={payment.id} payment={payment} />
                ))
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-3">
              {filteredPayments.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center">
                  <CheckCircle2 size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">Nenhuma cobrança pendente</p>
                </div>
              ) : (
                filteredPayments.map(payment => (
                  <PaymentCard key={payment.id} payment={payment} />
                ))
              )}
            </TabsContent>

            <TabsContent value="paid" className="space-y-3">
              {filteredPayments.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center">
                  <AlertCircle size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">Nenhum pagamento recebido ainda</p>
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

      <CreateChargeModal
        isOpen={showCreateCharge}
        onClose={() => setShowCreateCharge(false)}
        onSubmit={handleCreateCharge}
        teams={teams}
      />
    </>
  );
}