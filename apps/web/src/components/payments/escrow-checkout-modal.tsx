import { useState } from 'react';
import { useCreateCheckout, useConfirmPayment } from '@/features/payments/hooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  X,
  ShieldCheck,
  CreditCard,
  Lock,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { ContractResponse } from '@2becollab/types';

interface EscrowCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: ContractResponse;
  onPaymentSuccess?: () => void;
}

export function EscrowCheckoutModal({
  isOpen,
  onClose,
  contract,
  onPaymentSuccess,
}: EscrowCheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'MOCK_TEST' | 'CARD'>('MOCK_TEST');
  const [step, setStep] = useState<'REVIEW' | 'PROCESSING' | 'SUCCESS'>('REVIEW');
  const [error, setError] = useState<string | null>(null);

  const createCheckoutMutation = useCreateCheckout();
  const confirmPaymentMutation = useConfirmPayment();

  if (!isOpen) return null;

  const handleFundEscrow = async () => {
    setError(null);
    setStep('PROCESSING');

    try {
      // 1. Create checkout session
      const session = await createCheckoutMutation.mutateAsync({
        contractId: contract.id,
        paymentMethod,
      });

      // 2. Confirm escrow deposit
      await confirmPaymentMutation.mutateAsync({
        contractId: contract.id,
        payload: {
          sessionId: session.sessionId,
          providerPaymentId: `ch_mock_${Date.now()}`,
        },
      });

      setStep('SUCCESS');
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setStep('REVIEW');
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <Card
        className="w-full max-w-lg border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: 'var(--color-bg-secondary, #18181b)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Fund Escrow Deposit</h2>
              <p className="text-xs text-gray-400 font-mono">
                {contract.contractNumber} — {contract.title}
              </p>
            </div>
          </div>
          {step !== 'PROCESSING' && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {step === 'SUCCESS' ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Escrow Funded & Contract Activated!</h3>
            <p className="text-sm text-gray-400">
              ${contract.totalAmount.toFixed(2)} is now securely held in escrow. The creator has been notified to commence deliverable production.
            </p>
          </div>
        ) : step === 'PROCESSING' ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h3 className="text-lg font-bold text-white">Processing Escrow Transfer...</h3>
            <p className="text-xs text-gray-400">
              Connecting with payment gateway and locking funds in secure escrow hold...
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {error && (
              <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Financial Breakdown */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-300">
                <span>Agreed Creator Compensation</span>
                <span className="font-semibold text-white">
                  ${(contract.totalAmount - contract.platformFee).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>Platform Service & Escrow Fee (10%)</span>
                <span>${contract.platformFee.toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-base font-bold text-white">
                <span>Total Escrow Deposit</span>
                <span className="text-emerald-400 text-lg">
                  ${contract.totalAmount.toFixed(2)} {contract.currency}
                </span>
              </div>
            </div>

            {/* Escrow Guarantee Banner */}
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1 text-xs text-emerald-300">
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Escrow Protection</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Funds remain safely locked in escrow and will <strong>only</strong> be released to the creator after you inspect and approve their submitted deliverables.
              </p>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Payment Channel
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('MOCK_TEST')}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 text-left text-sm transition-all ${
                    paymentMethod === 'MOCK_TEST'
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-white'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-semibold text-xs text-white">Instant Escrow</div>
                    <div className="text-[10px] text-gray-400">Test mode settlement</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 text-left text-sm transition-all ${
                    paymentMethod === 'CARD'
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-white'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-semibold text-xs text-white">Credit / Debit Card</div>
                    <div className="text-[10px] text-gray-400">Stripe Gateway</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="border-white/10 text-gray-300 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleFundEscrow}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold px-6 shadow-lg shadow-emerald-900/30"
              >
                <Lock className="w-4 h-4 mr-2" />
                Fund ${contract.totalAmount.toFixed(2)} to Escrow
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
