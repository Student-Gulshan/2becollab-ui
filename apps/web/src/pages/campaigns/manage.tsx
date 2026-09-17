import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMyCampaigns, useUpdateCampaign, useDeleteCampaign } from '@/features/campaigns/hooks';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CampaignStatus } from '@2becollab/types';
import type { CampaignResponse } from '@2becollab/types';
import {
  Briefcase,
  Plus,
  Play,
  Pause,
  Trash2,
  Edit3,
  ExternalLink,
  Loader2,
  Clock,
  Users,
} from 'lucide-react';
import { ApplicationsDrawer } from '@/components/campaigns/applications-drawer';

const STATUS_TABS: Array<{ label: string; value: CampaignStatus | 'ALL' }> = [
  { label: 'All Campaigns', value: 'ALL' },
  { label: 'Active', value: CampaignStatus.ACTIVE },
  { label: 'Draft', value: CampaignStatus.DRAFT },
  { label: 'Paused', value: CampaignStatus.PAUSED },
  { label: 'Completed', value: CampaignStatus.COMPLETED },
];

const STATUS_COLORS: Record<CampaignStatus, string> = {
  [CampaignStatus.ACTIVE]: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  [CampaignStatus.DRAFT]: 'bg-gray-500/15 text-gray-300 border-gray-500/30',
  [CampaignStatus.PAUSED]: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  [CampaignStatus.COMPLETED]: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  [CampaignStatus.CANCELLED]: 'bg-red-500/15 text-red-300 border-red-500/30',
};

function formatBudget(min: number | null, max: number | null, currency: string = 'USD') {
  const sym = currency === 'INR' ? '₹' : '$';
  if (min !== null && max !== null) return `${sym}${min.toLocaleString()} – ${sym}${max.toLocaleString()}`;
  if (min !== null) return `From ${sym}${min.toLocaleString()}`;
  if (max !== null) return `Up to ${sym}${max.toLocaleString()}`;
  return 'Negotiable';
}

export function CampaignManagePage() {
  const navigate = useNavigate();


  const [activeStatusTab, setActiveStatusTab] = useState<CampaignStatus | 'ALL'>('ALL');
  const [selectedCampaignForApps, setSelectedCampaignForApps] = useState<CampaignResponse | null>(null);

  const { data: campaigns = [], isLoading } = useMyCampaigns(
    activeStatusTab === 'ALL' ? undefined : activeStatusTab,
  );

  const updateMutation = useUpdateCampaign();
  const deleteMutation = useDeleteCampaign();

  const toggleStatus = async (campaign: CampaignResponse) => {
    const newStatus =
      campaign.status === CampaignStatus.ACTIVE
        ? CampaignStatus.PAUSED
        : CampaignStatus.ACTIVE;
    try {
      await updateMutation.mutateAsync({
        id: campaign.id,
        data: { status: newStatus },
      });
    } catch (err: any) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (campaign: CampaignResponse) => {
    if (window.confirm(`Are you sure you want to delete campaign "${campaign.title}"?`)) {
      try {
        await deleteMutation.mutateAsync(campaign.id);
      } catch (err: any) {
        alert('Failed to delete campaign');
      }
    }
  };

  // Metric counts
  const totalCount = campaigns.length;
  const activeCount = campaigns.filter((c) => c.status === CampaignStatus.ACTIVE).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              Brand Workspace
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Campaign Management</h1>
          <p className="text-sm text-gray-400">
            Create, track, and manage your brand collaboration briefs and creator applications.
          </p>
        </div>

        <Button
          onClick={() => navigate('/campaigns/new')}
          variant="primary"
          className="flex items-center gap-2 shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Campaign</span>
        </Button>
      </div>

      {/* Stats Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card variant="glass" padding="md" className="text-center">
          <p className="text-2xl font-bold text-white mb-0.5">{totalCount}</p>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Campaigns</p>
        </Card>
        <Card variant="glass" padding="md" className="text-center">
          <p className="text-2xl font-bold text-emerald-400 mb-0.5">{activeCount}</p>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Active Briefs</p>
        </Card>
        <Card variant="glass" padding="md" className="text-center">
          <p className="text-2xl font-bold text-indigo-400 mb-0.5">0</p>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Applications (Chunk 9)</p>
        </Card>
        <Card variant="glass" padding="md" className="text-center">
          <p className="text-2xl font-bold text-purple-400 mb-0.5">0</p>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Hired Creators</p>
        </Card>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-6 overflow-x-auto">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveStatusTab(tab.value)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeStatusTab === tab.value
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Campaign List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        </div>
      ) : campaigns.length === 0 ? (
        <Card variant="glass" padding="lg" className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No campaigns found</h3>
          <p className="text-sm max-w-md mx-auto mb-6 text-gray-400">
            {activeStatusTab === 'ALL'
              ? 'You have not created any campaign briefs yet. Start finding the perfect creators by posting your first brief!'
              : `You have no campaigns in "${activeStatusTab}" status.`}
          </p>
          <Button onClick={() => navigate('/campaigns/new')} variant="primary" className="inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Create Your First Campaign</span>
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => {
            const statusClass = STATUS_COLORS[campaign.status] || STATUS_COLORS[CampaignStatus.ACTIVE];
            const budget = formatBudget(campaign.budgetMin, campaign.budgetMax, campaign.currency);
            const deliverables = campaign.deliverables || [];

            return (
              <Card
                key={campaign.id}
                variant="glass"
                padding="md"
                className="border border-white/10 hover:border-indigo-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusClass}`}>
                      {campaign.status}
                    </span>
                    <span className="text-xs font-semibold text-emerald-400">
                      {budget}
                    </span>
                    {campaign.deadline && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        Due {new Date(campaign.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/campaigns/${campaign.id}`}
                    className="text-base font-bold text-white hover:text-indigo-400 transition-colors block truncate"
                  >
                    {campaign.title}
                  </Link>

                  <p className="text-xs text-gray-400 line-clamp-1 mt-0.5 mb-2">
                    {campaign.description}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap text-xs text-gray-400">
                    <span>{deliverables.length} required {deliverables.length === 1 ? 'task' : 'tasks'}</span>
                    {campaign.niches.length > 0 && (
                      <span>• Niches: {campaign.niches.join(', ')}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCampaignForApps(campaign)}
                    className="text-xs flex items-center gap-1 text-indigo-300 hover:text-white"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Applicants</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleStatus(campaign)}
                    disabled={updateMutation.isPending}
                    className="text-xs flex items-center gap-1 text-gray-300 hover:text-white"
                  >
                    {campaign.status === CampaignStatus.ACTIVE ? (
                      <>
                        <Pause className="w-3.5 h-3.5 text-amber-400" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Activate</span>
                      </>
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/campaigns/${campaign.id}/edit`)}
                    className="text-xs flex items-center gap-1 text-indigo-300 hover:text-white"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(campaign)}
                    disabled={deleteMutation.isPending}
                    className="text-xs flex items-center gap-1 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </Button>

                  <Link
                    to={`/campaigns/${campaign.id}`}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    title="View public brief"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Applications Drawer Modal */}
      {selectedCampaignForApps && (
        <ApplicationsDrawer
          isOpen={!!selectedCampaignForApps}
          onClose={() => setSelectedCampaignForApps(null)}
          campaignId={selectedCampaignForApps.id}
          campaignTitle={selectedCampaignForApps.title}
        />
      )}
    </div>
  );
}
