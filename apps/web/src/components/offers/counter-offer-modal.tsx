import { useState } from 'react';
import { useCounterOffer } from '@/features/offers/hooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  X,
  DollarSign,
  Calendar,
  ArrowLeftRight,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { OfferResponse } from '@2becollab/types';

interface CounterOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: OfferResponse;
}

export function CounterOfferModal({
  isOpen,
  onClose,
  offer,
}: CounterOfferModalProps) {
  const [price, setPrice] = useState<number>(offer.price);
  const [deadline, setDeadline] = useState(
    offer.deadline ? offer.deadline.split('T')[0] : '',
  );
  const [revisionLimit, setRevisionLimit] = useState(offer.revisionLimit);
  const [counterReason, setCounterReason] = useState('');
  const [usageRights, setUsageRights] = useState(offer.usageRights || '');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const counterOfferMutation = useCounterOffer();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!counterReason.trim()) {
      setError('Please explain why you are proposing this counter-offer');
      return;
    }

    if (!price || price <= 0) {
      setError('Please enter a valid counter price');
      return;
    }

    counterOfferMutation.mutate(
      {
        offerId: offer.id,
        payload: {
          price: Number(price),
          deadline: deadline ? new Date(deadline).toISOString() : undefined,
          revisionLimit: Number(revisionLimit),
          counterReason,
          usageRights,
        },
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          setTimeout(() => {
            setIsSuccess(false);
            onClose();
          }, 1500);
        },
        onError: (err: any) => {
          setError(err.response?.data?.message || 'Failed to submit counter-offer');
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <Card
        className="w-full max-w-lg border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-8"
        style={{ backgroundColor: 'var(--color-bg-secondary, #18181b)' }}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Make a Counter-Offer</h2>
              <p className="text-sm text-gray-400">
                Negotiating terms for <span className="text-white font-medium">{offer.title}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Counter-Offer Submitted!</h3>
            <p className="text-gray-400 text-sm">
              The other party has been notified with your revised terms.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
                {error}
              </div>
            )}

            {/* Original vs Proposed Price */}
            <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 block uppercase tracking-wider">Original Offer</span>
                <span className="text-base font-semibold text-gray-300">${offer.price}</span>
              </div>
              <ArrowLeftRight className="w-4 h-4 text-amber-400" />
              <div className="w-36">
                <span className="text-xs text-amber-400 block uppercase tracking-wider font-semibold">Your Counter ($)</span>
                <div className="relative mt-1">
                  <DollarSign className="w-3.5 h-3.5 text-amber-400 absolute left-2 top-1/2 -translate-y-1/2" />
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="bg-black/40 border-amber-500/30 text-white pl-7 h-8 text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Counter Reason */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Reason for Counter-Offer *
              </label>
              <textarea
                value={counterReason}
                onChange={(e) => setCounterReason(e.target.value)}
                placeholder="Explain why you're proposing these adjusted terms (e.g. extra production time needed, higher scope of deliverables)..."
                rows={3}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                required
              />
            </div>

            {/* Adjusted Deadline */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Proposed Completion Deadline
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="bg-white/5 border-white/10 text-white pl-9"
                  required
                />
              </div>
            </div>

            {/* Revisions & Usage Rights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Revisions Limit
                </label>
                <Input
                  type="number"
                  value={revisionLimit}
                  onChange={(e) => setRevisionLimit(Number(e.target.value))}
                  min={0}
                  max={10}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Usage Rights
                </label>
                <Input
                  value={usageRights}
                  onChange={(e) => setUsageRights(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={counterOfferMutation.isPending}
                className="border-white/10 text-gray-300 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={counterOfferMutation.isPending}
                className="bg-amber-600 hover:bg-amber-500 text-white font-semibold"
              >
                {counterOfferMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...
                  </>
                ) : (
                  'Send Counter-Offer'
                )}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
