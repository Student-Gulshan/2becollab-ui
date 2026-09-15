import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCampaign } from '@/features/campaigns/hooks';
import { useAuthStore } from '@/stores/auth-store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  SocialPlatform,
  SOCIAL_PLATFORM_LABELS,
  CampaignStatus,
} from '@2becollab/types';
import {
  Briefcase,
  ArrowLeft,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  Edit3,
  Sparkles,
  Layers,
  Globe,
  Loader2,
  Share2,
  Instagram,
  Youtube,
  Linkedin,
  Facebook,
  Twitter,
} from 'lucide-react';

const PLATFORM_ICONS: Record<SocialPlatform, React.ReactNode> = {
  [SocialPlatform.INSTAGRAM]: <Instagram className="w-4 h-4" />,
  [SocialPlatform.YOUTUBE]: <Youtube className="w-4 h-4" />,
  [SocialPlatform.TIKTOK]: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.11V9a6.33 6.33 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 0010.86 4.43V13.4a8.16 8.16 0 005.58 2.17V12.1a4.84 4.84 0 01-3.45-1.44 4.84 4.84 0 001.45-3.97z" />
    </svg>
  ),
  [SocialPlatform.TWITTER]: <Twitter className="w-4 h-4" />,
  [SocialPlatform.LINKEDIN]: <Linkedin className="w-4 h-4" />,
  [SocialPlatform.FACEBOOK]: <Facebook className="w-4 h-4" />,
  [SocialPlatform.OTHER]: <Globe className="w-4 h-4" />,
};

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

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data: campaign, isLoading, isError } = useCampaign(id || '');

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        <p className="text-sm text-gray-400">Loading campaign brief...</p>
      </div>
    );
  }

  if (isError || !campaign) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
          <Briefcase className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-white">Campaign Not Found</h2>
        <p className="text-sm text-gray-400 max-w-md">
          This campaign brief may have been archived, closed, or removed by the brand.
        </p>
        <Button variant="secondary" onClick={() => navigate('/campaigns')}>
          Back to Campaigns
        </Button>
      </div>
    );
  }

  const brand = campaign.businessProfile;
  const companyName = brand?.companyName || brand?.user?.fullName || 'Brand Partner';
  const logoUrl = brand?.logoUrl || brand?.user?.avatarUrl;
  const isOwner = user?.id === brand?.userId;
  const statusClass = STATUS_COLORS[campaign.status] || STATUS_COLORS[CampaignStatus.ACTIVE];
  const budgetStr = formatBudget(campaign.budgetMin, campaign.budgetMax, campaign.currency);
  const deadlineStr = formatDate(campaign.deadline);
  const deliverables = campaign.deliverables || [];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Campaign link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Top Banner / Cover */}
      <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-gradient-to-r from-emerald-950/40 via-indigo-950/40 to-purple-950/40">
        {campaign.coverImageUrl ? (
          <img
            src={campaign.coverImageUrl}
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background:
                'radial-gradient(ellipse at 30% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 60%)',
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-primary)] via-transparent to-black/30" />

        <div className="absolute top-6 left-4 right-4 max-w-6xl mx-auto flex items-center justify-between z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass text-xs font-medium text-white hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-xs font-medium text-white hover:bg-white/20 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
            {isOwner && (
              <Link
                to={`/campaigns/${campaign.id}/edit`}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-all shadow-md"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Brief
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative -mt-16 z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column (2 spans) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header info card */}
            <Card variant="glass" padding="lg">
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusClass}`}>
                  {campaign.status}
                </span>
                {campaign.currency && (
                  <span className="text-xs font-semibold text-emerald-400">
                    {campaign.currency}
                  </span>
                )}
                {deadlineStr && (
                  <span className="text-xs text-amber-300/90 flex items-center gap-1 ml-auto">
                    <Clock className="w-3.5 h-3.5" />
                    Deadline: {deadlineStr}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-4">
                {campaign.title}
              </h1>

              {/* Brand quick info */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center text-white font-bold uppercase flex-shrink-0">
                  {logoUrl ? (
                    <img src={logoUrl} alt={companyName} className="w-full h-full object-cover" />
                  ) : (
                    companyName[0]
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{companyName}</p>
                  <p className="text-[11px] text-gray-400">
                    {brand?.industry || 'Verified Brand'} {brand?.location ? `• ${brand.location}` : ''}
                  </p>
                </div>
              </div>

              {/* Niches and platforms */}
              <div className="mt-5 pt-4 border-t border-white/10 space-y-3">
                {campaign.niches && campaign.niches.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-400">Target Niches:</span>
                    {campaign.niches.map((n) => (
                      <span
                        key={n}
                        className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-gray-200"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                )}

                {campaign.platforms && campaign.platforms.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-400">Platforms:</span>
                    {campaign.platforms.map((p) => (
                      <span
                        key={p}
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-indigo-950/80 text-indigo-300 border border-indigo-500/30"
                      >
                        {PLATFORM_ICONS[p]}
                        <span>{SOCIAL_PLATFORM_LABELS[p]}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Campaign Description */}
            <Card variant="glass" padding="lg">
              <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                About the Campaign
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                {campaign.description}
              </p>
            </Card>

            {/* Required Deliverables */}
            <Card variant="glass" padding="lg">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                Required Deliverables ({deliverables.length})
              </h2>

              {deliverables.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No specific deliverables listed.</p>
              ) : (
                <div className="space-y-3">
                  {deliverables.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-3"
                    >
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                          <h4 className="text-sm font-bold text-white">
                            {item.quantity > 1 ? `${item.quantity}x ` : ''}
                            {item.title}
                          </h4>
                          {item.platform && (
                            <span className="text-[11px] px-2 py-0.5 rounded bg-white/5 text-indigo-300 border border-white/10">
                              {SOCIAL_PLATFORM_LABELS[item.platform]}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-xs text-gray-400 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Requirements & Guidelines */}
            {(campaign.requirements || campaign.targetAudience) && (
              <Card variant="glass" padding="lg">
                <h2 className="text-lg font-bold text-white mb-3">Creative Guidelines & Audience</h2>
                {campaign.targetAudience && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Target Audience
                    </p>
                    <p className="text-sm text-gray-300">{campaign.targetAudience}</p>
                  </div>
                )}
                {campaign.requirements && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Requirements & Dos/Don'ts
                    </p>
                    <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                      {campaign.requirements}
                    </p>
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Right Column / Sticky Action Card */}
          <div className="space-y-6">
            <Card
              variant="glass"
              padding="lg"
              className="sticky top-24 border-emerald-500/20 shadow-2xl space-y-6"
            >
              <div>
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Compensation Range
                </span>
                <p className="text-2xl font-extrabold text-emerald-400 mt-0.5">
                  {budgetStr}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
                {deadlineStr && (
                  <div className="flex items-center justify-between text-gray-300">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" /> Deadline
                    </span>
                    <span className="font-semibold text-white">{deadlineStr}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-gray-300">
                  <span className="text-gray-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" /> Location
                  </span>
                  <span className="font-semibold text-white">{campaign.location || 'Global / Remote'}</span>
                </div>

                <div className="flex items-center justify-between text-gray-300">
                  <span className="text-gray-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-400" /> Deliverables
                  </span>
                  <span className="font-semibold text-white">{deliverables.length} Tasks</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                {isOwner ? (
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => navigate(`/campaigns/${campaign.id}/edit`)}
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Campaign</span>
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20"
                    onClick={() => {
                      if (!user) {
                        navigate('/auth/choose-role');
                      } else {
                        alert('Applications & Proposals workflow is coming up in Chunk 9!');
                      }
                    }}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Apply to Campaign</span>
                  </Button>
                )}
              </div>

              {/* Brand Summary */}
              {brand && (
                <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
                  <p className="font-semibold text-white">About the Brand</p>
                  <p className="text-gray-400 leading-relaxed">
                    {brand.industry ? `${companyName} operates in ${brand.industry}.` : `${companyName} is collaborating with creators on 2BeCollab.`}
                  </p>
                  {brand.websiteUrl && (
                    <a
                      href={brand.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 hover:underline inline-flex items-center gap-1 pt-1"
                    >
                      <span>Visit Brand Website</span>
                      <Globe className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
