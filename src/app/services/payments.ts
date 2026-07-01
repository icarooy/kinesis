import { api } from './api';
import type { Payment } from '../types';

/**
 * Camada de serviço para o módulo de pagamentos (Mercado Pago), seguindo o
 * mesmo padrão de `api()` + DTOs locais + mapeador já usado em outras telas
 * (ex.: EventResponse/mapEventResponse em CalendarScreen.tsx).
 */

type PaymentStatusDTO = 'PENDING' | 'IN_PROCESS' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'REFUNDED';

// Resposta de com.ifma.kinesis.payment.dto.response.PaymentResponse
interface PaymentResponseDTO {
  id: string;
  clubId: string;
  payerId: string;
  payerName: string;
  createdById: string;
  title: string;
  description?: string;
  amount: number;
  dueDate?: string;
  status: PaymentStatusDTO;
  paymentMethodId?: string;
  paymentTypeId?: string;
  qrCode?: string;
  qrCodeBase64?: string;
  ticketUrl?: string;
  paidAt?: string;
  createdAt: string;
}

// Resposta de com.ifma.kinesis.clubmember.dto.response.ClubMemberResponse
interface ClubMemberResponseDTO {
  id: string;
  clubId: string;
  userId: string;
  userName: string;
  role: string;
  joinedAt?: string;
  active: boolean;
}

// Resposta de GET /api/auth/me (com.ifma.kinesis.user.dto.response.UserResponse)
interface AuthMeResponseDTO {
  id: string;
  name: string;
  email: string;
}

function mapStatus(status: PaymentStatusDTO): Payment['status'] {
  // PaymentCard só sabe exibir 'paid' | 'pending' | 'overdue' (overdue é calculado
  // localmente a partir de dueDate). Estados terminais negativos (REJECTED,
  // CANCELLED, REFUNDED) caem em 'pending' para não quebrar o componente visual
  // existente — o status bruto continua disponível via refreshPaymentStatus().
  return status === 'APPROVED' ? 'paid' : 'pending';
}

function mapPaymentMethod(paymentMethodId?: string, paymentTypeId?: string): Payment['paymentMethod'] {
  if (paymentMethodId === 'pix') return 'pix';
  if (paymentTypeId === 'ticket') return 'boleto';
  if (paymentTypeId === 'credit_card' || paymentTypeId === 'debit_card') return 'card';
  return undefined;
}

export function mapPaymentResponse(dto: PaymentResponseDTO): Payment {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    amount: dto.amount,
    dueDate: dto.dueDate ? new Date(dto.dueDate) : new Date(dto.createdAt),
    status: mapStatus(dto.status),
    athleteId: dto.payerId,
    paidAt: dto.paidAt ? new Date(dto.paidAt) : undefined,
    paymentMethod: mapPaymentMethod(dto.paymentMethodId, dto.paymentTypeId),
    createdAt: new Date(dto.createdAt),
    clubId: dto.clubId,
    paymentMethodId: dto.paymentMethodId,
    paymentTypeId: dto.paymentTypeId,
    qrCode: dto.qrCode,
    qrCodeBase64: dto.qrCodeBase64,
    ticketUrl: dto.ticketUrl,
  };
}

/** Resolve o UUID do usuário logado na Kinesis API (diferente do UID do Supabase). */
export async function getMyUserId(): Promise<string> {
  const me = await api<AuthMeResponseDTO>('GET', '/api/auth/me');
  return me.id;
}

export async function listPayments(clubId: string): Promise<Payment[]> {
  const data = await api<PaymentResponseDTO[]>('GET', `/api/clubs/${clubId}/payments`);
  return Array.isArray(data) ? data.map(mapPaymentResponse) : [];
}

export async function getPayment(clubId: string, paymentId: string): Promise<Payment> {
  const data = await api<PaymentResponseDTO>('GET', `/api/clubs/${clubId}/payments/${paymentId}`);
  return mapPaymentResponse(data);
}

export interface NewCharge {
  title: string;
  description?: string;
  amount: number;
  dueDate: Date;
}

/**
 * Cria uma cobrança individual (um Payment por atleta) para todos os membros
 * ativos do clube. O backend não modela "turma" — por isso qualquer cobrança é
 * sempre individual por atleta, mesmo quando a tela de origem tem um seletor
 * de turma (o filtro por turma ainda não tem correspondência no backend).
 */
export async function createChargeForClub(clubId: string, charge: NewCharge): Promise<Payment[]> {
  const [members, myUserId] = await Promise.all([
    api<ClubMemberResponseDTO[]>('GET', `/api/clubs/${clubId}/members`),
    getMyUserId(),
  ]);

  const activeMembers = Array.isArray(members) ? members.filter((member) => member.active) : [];

  const created = await Promise.all(
    activeMembers.map((member) =>
      api<PaymentResponseDTO>('POST', `/api/clubs/${clubId}/payments`, {
        payerId: member.userId,
        createdBy: myUserId,
        title: charge.title,
        description: charge.description,
        amount: charge.amount,
        dueDate: charge.dueDate.toISOString().slice(0, 10),
      }),
    ),
  );

  return created.map(mapPaymentResponse);
}

export interface CheckoutAddress {
  zipCode?: string;
  streetName?: string;
  streetNumber?: string;
  neighborhood?: string;
  city?: string;
  federalUnit?: string;
}

/** Espelha o formData retornado pelo Payment Brick do Mercado Pago no onSubmit. */
export interface CheckoutData {
  paymentMethodId: string;
  paymentTypeId?: string;
  token?: string;
  issuerId?: string;
  installments?: number;
  payerEmail: string;
  payerFirstName?: string;
  payerLastName?: string;
  identificationType?: string;
  identificationNumber?: string;
  address?: CheckoutAddress;
}

export async function checkoutPayment(clubId: string, paymentId: string, checkout: CheckoutData): Promise<Payment> {
  const data = await api<PaymentResponseDTO>('POST', `/api/clubs/${clubId}/payments/${paymentId}/checkout`, {
    paymentMethodId: checkout.paymentMethodId,
    paymentTypeId: checkout.paymentTypeId,
    token: checkout.token,
    issuerId: checkout.issuerId,
    installments: checkout.installments,
    payerEmail: checkout.payerEmail,
    payerFirstName: checkout.payerFirstName,
    payerLastName: checkout.payerLastName,
    identificationType: checkout.identificationType,
    identificationNumber: checkout.identificationNumber,
    zipCode: checkout.address?.zipCode,
    streetName: checkout.address?.streetName,
    streetNumber: checkout.address?.streetNumber,
    neighborhood: checkout.address?.neighborhood,
    city: checkout.address?.city,
    federalUnit: checkout.address?.federalUnit,
  });
  return mapPaymentResponse(data);
}

export async function refreshPaymentStatus(clubId: string, paymentId: string): Promise<Payment> {
  const data = await api<PaymentResponseDTO>('GET', `/api/clubs/${clubId}/payments/${paymentId}/status`);
  return mapPaymentResponse(data);
}

export async function cancelPayment(clubId: string, paymentId: string): Promise<void> {
  await api<void>('DELETE', `/api/clubs/${clubId}/payments/${paymentId}`);
}

export async function refundPayment(clubId: string, paymentId: string): Promise<Payment> {
  const data = await api<PaymentResponseDTO>('POST', `/api/clubs/${clubId}/payments/${paymentId}/refund`);
  return mapPaymentResponse(data);
}
