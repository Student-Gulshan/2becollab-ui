import { useNavigate, Link } from 'react-router-dom';
import {
  useCampaignApplications,
  useUpdateApplicationStatus,
} from '@/features/applications/hooks';
import { useStartConversation } from '@/features/messages/hooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ApplicationStatus,
  CampaignApplicationResponse,
} from '@2becollab/types';
import {
  Users,
  X,
  Check,
  Ban,
  MessageSquare,
  ExternalLink,
  Loader2,
  Star,
  MapPin,
} from 'lucide-react';

interface ApplicationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
  campaignTitle: string;
}

export function ApplicationsDrawer({
  isOpen,
  onClose,
  campaignId,
  campaignTitle,
}: ApplicationsDrawerProps) {
  const navigate = useNavigate();
  const { data: applications = [], isLoading } = useCampaignApplications(
    isOpen ? campaignId : null,
  );
  const updateStatusMutation = useUpdateApplicationStatus();
  const startConversationMutation = useStartConversation();

  if (!isOpen) return null;

  const handleUpdateStatus = async (
    applicationId: string,
    status: ApplicationStatus.ACCEPTED | ApplicationStatus.REJECTED,
  ) => {
    try {
      await updateStatusMutation.mutateAsync({
        campaignId,
        applicationId,
        payload: { status },
      });
    } catch (err: any) {
      alert('Failed to update application status');
    }
  };

  const handleMessage = async (app: CampaignApplicationResponse) => {
    if (!app.creator?.userId) return;
    try {
      const conv = await startConversationMutation.mutateAsync({
        recipientId: app.creator.userId,
        campaignId,
        initialMessage: `Hi ${app.creator.fullName}, we're reviewing your application for "${campaignTitle}"!`,
      });
      navigate(`/messages?id=${conv.id}`);
    } catch (err: any) {
      alert('Failed to open chat');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <Card
        variant="glass"
        padding="lg"
        className="w-full max-w-3xl max-h-[85vh] flex flex-col border border-white/15 relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white">Campaign Applications</h3>
            </div>
            <p className="text-xs text-gray-400 line-clamp-1">
              Review pitches and proposals for <span className="text-indigo-300 font-semibold">{campaignTitle}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
            </div>
          ) : applications.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-xs">
              No creators have applied to this campaign yet.
            </div>
          ) : (
            applications.map((app: CampaignApplicationResponse) => {
              const creator = app.creator;
              const sym = app.currency === 'INR' ? '₹' : '$';

              return (
                <Card
                  key={app.id}
                  variant="glass"
                  padding="md"
                  className="border border-white/10 hover:border-indigo-500/30 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    {/* Creator Identity */}
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {creator?.avatarUrl ? (
                        <img
                          src={creator.avatarUrl}
                          alt={creator.fullName}
                          className="w-12 h-12 rounded-xl object-cover border border-white/10 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center text-base border border-indigo-500/30 flex-shrink-0">
                          {creator?.fullName?.charAt(0) || 'C'}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="text-sm font-bold text-white truncate">
                            {creator?.fullName}
                          </h4>
                          {creator?.ratingAverage ? (
                            <span className="flex items-center gap-0.5 text-[11px] text-amber-400 font-semibold">
                              <Star className="w-3 h-3 fill-amber-400" />
                              {creator.ratingAverage.toFixed(1)}
                            </span>
                          ) : null}
                          <span
                            className={`px-2 py-0.2 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              app.status === ApplicationStatus.ACCEPTED
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : app.status === ApplicationStatus.REJECTED
                                ? 'bg-red-500/20 text-red-300 border-red-500/40'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            }`}
                          >
                            {app.status}
                          </span>
                        </div>

                        {creator?.headline && (
                          <p className="text-xs text-gray-400 line-clamp-1 mb-2">
                            {creator.headline}
                          </p>
                        )}

                        {creator?.location && (
                          <div className="flex items-center gap-1 text-[11px] text-gray-400 mb-2">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span>{creator.location}</span>
                          </div>
                        )}

                        {/* Pitch Box */}
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200 mt-2">
                          <p className="font-semibold text-gray-400 text-[10px] uppercase tracking-wider mb-1">
                            Pitch
                          </p>
                          <p className="whitespace-pre-wrap leading-relaxed">{app.pitch}</p>
                        </div>
                      </div>
                    </div>

                    {/* Fee & Actions */}
                    <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-3 flex-shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-gray-400 block uppercase font-semibold">
                          Proposed Rate
                        </span>
                        <span className="text-base font-extrabold text-emerald-400">
                          {app.proposedRate !== null
                            ? `${sym}${app.proposedRate.toLocaleString()}`
                            : 'Standard Budget'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {app.status === ApplicationStatus.PENDING && (
                          <>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() =>
                                handleUpdateStatus(app.id, ApplicationStatus.ACCEPTED)
                              }
                              disabled={updateStatusMutation.isPending}
                              className="text-xs flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 px-3"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Accept</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleUpdateStatus(app.id, ApplicationStatus.REJECTED)
                              }
                              disabled={updateStatusMutation.isPending}
                              className="text-xs flex items-center gap-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2.5"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </Button>
                          </>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMessage(app)}
                          className="text-xs flex items-center gap-1 text-indigo-300 hover:text-white"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat</span>
                        </Button>

                        {creator?.id && (
                          <Link
                            to={`/creators/${creator.id}`}
                            target="_blank"
                            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                            title="View Creator Profile"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}
