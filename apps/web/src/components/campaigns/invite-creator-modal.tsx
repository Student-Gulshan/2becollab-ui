import React, { useState } from 'react';
import { useMyCampaigns } from '@/features/campaigns/hooks';
import { useInviteCreator } from '@/features/applications/hooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CampaignStatus } from '@2becollab/types';
import { Send, X, Briefcase, Loader2, CheckCircle2 } from 'lucide-react';

interface InviteCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorProfileId: string;
  creatorName: string;
}

export function InviteCreatorModal({
  isOpen,
  onClose,
  creatorProfileId,
  creatorName,
}: InviteCreatorModalProps) {
  const { data: campaigns = [], isLoading } = useMyCampaigns(CampaignStatus.ACTIVE);
  const inviteMutation = useInviteCreator();

  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaignId) return;

    try {
      await inviteMutation.mutateAsync({
        campaignId: selectedCampaignId,
        creatorProfileId,
        message: message.trim() || undefined,
      });
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to send invitation');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <Card
        variant="glass"
        padding="lg"
        className="w-full max-w-md border border-white/15 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Briefcase className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold text-white">Invite to Campaign</h3>
        </div>
        <p className="text-xs text-gray-400 mb-5">
          Invite <span className="text-indigo-300 font-semibold">{creatorName}</span> to collaborate on one of your active campaign briefs.
        </p>

        {sentSuccess ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Invitation Sent!</h4>
            <p className="text-xs text-gray-400">
              {creatorName} will be notified and can review your brief.
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="py-6 text-center space-y-3">
            <p className="text-xs text-gray-400">
              You do not have any active campaigns right now. Create an active campaign brief first to send invitations.
            </p>
            <Button
              onClick={onClose}
              variant="secondary"
              size="sm"
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Select Active Campaign *
              </label>
              <select
                value={selectedCampaignId}
                onChange={(e) => setSelectedCampaignId(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="" disabled className="bg-gray-900">
                  -- Choose a campaign --
                </option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id} className="bg-gray-900">
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Personal Note / Pitch to Creator (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Hi ${creatorName}, we love your content style and think you'd be a perfect fit for this campaign!`}
                rows={3}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
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
                disabled={!selectedCampaignId || inviteMutation.isPending}
                className="flex items-center gap-1.5"
              >
                {inviteMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Send Invitation</span>
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
