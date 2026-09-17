import { useState } from 'react';
import { useCreateOffer } from '@/features/offers/hooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  X,
  DollarSign,
  Calendar,
  Plus,
  Trash2,
  ShieldCheck,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { SocialPlatform, OfferDeliverableItem } from '@2becollab/types';

interface CreateOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
  creatorProfileId: string;
  campaignId?: string;
  campaignTitle?: string;
  defaultPrice?: number;
}

export function CreateOfferModal({
  isOpen,
  onClose,
  recipientId,
  recipientName,
  creatorProfileId,
  campaignId,
  campaignTitle,
  defaultPrice,
}: CreateOfferModalProps) {
  const [title, setTitle] = useState(
    campaignTitle ? `Collaboration Offer: ${campaignTitle}` : 'Custom Collaboration Offer',
  );
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(defaultPrice || 500);
  const [currency] = useState('USD');
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  );
  const [revisionLimit, setRevisionLimit] = useState(2);
  const [usageRights, setUsageRights] = useState('Full commercial digital rights for 6 months');
  const [exclusivityDays, setExclusivityDays] = useState(0);

  const [deliverables, setDeliverables] = useState<OfferDeliverableItem[]>([
    {
      id: '1',
      title: 'Sponsored Reel / Short',
      platform: SocialPlatform.INSTAGRAM,
      format: 'Reel',
      count: 1,
      requirements: '4K video with brand tag and link in bio',
    },
  ]);

  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const createOfferMutation = useCreateOffer();

  if (!isOpen) return null;

  const handleAddDeliverable = () => {
    setDeliverables([
      ...deliverables,
      {
        id: String(Date.now()),
        title: 'New Deliverable',
        platform: SocialPlatform.INSTAGRAM,
        format: 'Video',
        count: 1,
      },
    ]);
  };

  const handleRemoveDeliverable = (index: number) => {
    if (deliverables.length <= 1) return;
    setDeliverables(deliverables.filter((_, i) => i !== index));
  };

  const handleUpdateDeliverable = (
    index: number,
    field: keyof OfferDeliverableItem,
    value: any,
  ) => {
    const updated = [...deliverables];
    updated[index] = { ...updated[index], [field]: value } as OfferDeliverableItem;
    setDeliverables(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Offer title is required');
      return;
    }
    if (!price || price <= 0) {
      setError('Please enter a valid offer price');
      return;
    }
    if (deliverables.length === 0) {
      setError('At least one deliverable is required');
      return;
    }

    createOfferMutation.mutate(
      {
        recipientId,
        creatorProfileId,
        campaignId,
        title,
        description,
        price: Number(price),
        currency,
        deliverables,
        revisionLimit: Number(revisionLimit),
        deadline: new Date(deadline || Date.now()).toISOString(),
        usageRights,
        exclusivityDays: Number(exclusivityDays),
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
          setError(err.response?.data?.message || 'Failed to send offer');
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <Card
        className="w-full max-w-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-8"
        style={{ backgroundColor: 'var(--color-bg-secondary, #18181b)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Send Formal Offer</h2>
              <p className="text-sm text-gray-400">
                To <span className="text-emerald-400 font-medium">{recipientName}</span>
                {campaignTitle ? ` for ${campaignTitle}` : ''}
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
            <h3 className="text-xl font-bold text-white mb-2">Offer Sent Successfully!</h3>
            <p className="text-gray-400 text-sm">
              The formal offer has been sent. Once accepted, a binding contract will be created automatically.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {error && (
              <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
                {error}
              </div>
            )}

            {/* Offer Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Offer Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Neon Headphones Launch Sponsorship"
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Scope & Overview (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Key goals, aesthetic guidelines, talking points..."
                rows={3}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Price & Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Total Compensation ($ USD)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    min={10}
                    className="bg-white/5 border-white/10 text-white pl-9"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Completion Deadline
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
            </div>

            {/* Deliverables Builder */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Deliverables & Outputs
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAddDeliverable}
                  className="text-xs text-emerald-400 hover:text-emerald-300"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Deliverable
                </Button>
              </div>

              <div className="space-y-3">
                {deliverables.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <Input
                        value={item.title}
                        onChange={(e) =>
                          handleUpdateDeliverable(index, 'title', e.target.value)
                        }
                        placeholder="Deliverable title"
                        className="bg-black/20 border-white/10 text-white text-sm h-8 flex-1"
                        required
                      />
                      <select
                        value={item.platform || SocialPlatform.INSTAGRAM}
                        onChange={(e) =>
                          handleUpdateDeliverable(
                            index,
                            'platform',
                            e.target.value as SocialPlatform,
                          )
                        }
                        className="bg-black/40 border border-white/10 rounded-lg text-white text-xs px-2 py-1.5 focus:outline-none"
                      >
                        {Object.values(SocialPlatform).map((p) => (
                          <option key={p} value={p} className="bg-zinc-900">
                            {p}
                          </option>
                        ))}
                      </select>
                      {deliverables.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDeliverable(index)}
                          className="text-gray-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <Input
                      value={item.requirements || ''}
                      onChange={(e) =>
                        handleUpdateDeliverable(index, 'requirements', e.target.value)
                      }
                      placeholder="Specific requirements (e.g. 60-90s, include promo code XYZ)"
                      className="bg-black/20 border-white/10 text-gray-300 text-xs h-7"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Legal / Revisions / Rights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Revisions Included
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
                  Exclusivity (Days)
                </label>
                <Input
                  type="number"
                  value={exclusivityDays}
                  onChange={(e) => setExclusivityDays(Number(e.target.value))}
                  min={0}
                  placeholder="0 (no exclusivity)"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Content Usage Rights
              </label>
              <Input
                value={usageRights}
                onChange={(e) => setUsageRights(e.target.value)}
                placeholder="e.g. Digital organic + paid ads for 6 months"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            {/* Escrow note */}
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-2 text-xs text-emerald-300">
              <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
              <span>
                <strong>2BeCollab Escrow Guarantee:</strong> When the offer is accepted, funds will be placed in secure escrow before work starts and paid upon approval.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={createOfferMutation.isPending}
                className="border-white/10 text-gray-300 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createOfferMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6"
              >
                {createOfferMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending Offer...
                  </>
                ) : (
                  'Send Official Offer'
                )}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
