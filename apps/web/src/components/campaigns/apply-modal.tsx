import React, { useState } from 'react';
import { useApplyCampaign } from '@/features/applications/hooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CampaignResponse } from '@2becollab/types';
import { Sparkles, X, Loader2, CheckCircle2 } from 'lucide-react';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: CampaignResponse;
}

export function ApplyModal({ isOpen, onClose, campaign }: ApplyModalProps) {
  const applyMutation = useApplyCampaign();

  const [pitch, setPitch] = useState('');
  const [proposedRate, setProposedRate] = useState<number | ''>(
    campaign.budgetMax || campaign.budgetMin || '',
  );
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitch.trim()) return;

    try {
      await applyMutation.mutateAsync({
        campaignId: campaign.id,
        payload: {
          pitch: pitch.trim(),
          proposedRate: proposedRate !== '' ? Number(proposedRate) : undefined,
          currency: campaign.currency,
        },
      });
      setSubmittedSuccess(true);
      setTimeout(() => {
        setSubmittedSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit application');
    }
  };

  const sym = campaign.currency === 'INR' ? '₹' : '$';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <Card
        variant="glass"
        padding="lg"
        className="w-full max-w-lg border border-white/15 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold text-white">Apply to Campaign</h3>
        </div>
        <p className="text-xs text-gray-400 mb-5 line-clamp-1">
          {campaign.title}
        </p>

        {submittedSuccess ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Application Submitted!</h4>
            <p className="text-xs text-gray-400">
              The brand has received your pitch and will review your creator profile.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Your Creative Pitch *
              </label>
              <textarea
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                placeholder="Tell the brand why your audience is a great match and how you plan to produce these deliverables..."
                rows={4}
                required
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Proposed Collaboration Fee ({campaign.currency})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">
                  {sym}
                </span>
                <Input
                  type="number"
                  min="1"
                  value={proposedRate}
                  onChange={(e) =>
                    setProposedRate(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  placeholder={
                    campaign.budgetMin && campaign.budgetMax
                      ? `${campaign.budgetMin} - ${campaign.budgetMax}`
                      : 'Enter fee'
                  }
                  className="pl-8 text-xs"
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-1">
                Suggested budget range: {sym}{campaign.budgetMin?.toLocaleString() || 0} – {sym}{campaign.budgetMax?.toLocaleString() || 'Negotiable'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!pitch.trim() || applyMutation.isPending}
                className="flex items-center gap-1.5"
              >
                {applyMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>Submit Application</span>
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
