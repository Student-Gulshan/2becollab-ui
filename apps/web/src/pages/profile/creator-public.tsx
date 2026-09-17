import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePublicCreator } from '@/features/profile/hooks';
import { useAuthStore } from '@/stores/auth-store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  SocialPlatform,
  SOCIAL_PLATFORM_LABELS,
} from '@2becollab/types';
import type { SocialAccountResponse, PortfolioItemResponse } from '@2becollab/types';
import {
  MapPin,
  Globe,
  Languages,
  CheckCircle2,
  Star,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  Share2,
  ShieldCheck,
  Edit3,
  Loader2,
  Instagram,
  Youtube,
  Linkedin,
  Facebook,
  Twitter,
  ExternalLink,
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
  Building,
  Layers,
  Users,
  Package,
  RotateCcw,
  Clock,
  Check,
  Briefcase,
} from 'lucide-react';
import { useStartConversation } from '@/features/messages/hooks';
import { InviteCreatorModal } from '@/components/campaigns/invite-creator-modal';

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

const PLATFORM_COLORS: Record<SocialPlatform, string> = {
  [SocialPlatform.INSTAGRAM]: 'from-pink-500/20 to-purple-600/20 text-pink-300 border-pink-500/30',
  [SocialPlatform.YOUTUBE]: 'from-red-500/20 to-red-600/20 text-red-300 border-red-500/30',
  [SocialPlatform.TIKTOK]: 'from-gray-800/40 to-black text-gray-200 border-gray-600/30',
  [SocialPlatform.TWITTER]: 'from-sky-400/20 to-sky-600/20 text-sky-300 border-sky-500/30',
  [SocialPlatform.LINKEDIN]: 'from-blue-600/20 to-blue-700/20 text-blue-300 border-blue-500/30',
  [SocialPlatform.FACEBOOK]: 'from-blue-500/20 to-blue-700/20 text-blue-300 border-blue-500/30',
  [SocialPlatform.OTHER]: 'from-gray-500/20 to-gray-600/20 text-gray-300 border-gray-500/30',
};

function formatNumber(count: number | null | undefined): string {
  if (count === null || count === undefined) return '0';
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}

export function CreatorPublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const startConversationMutation = useStartConversation();

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const isBusiness = user?.role === 'BUSINESS';

  const { data: profile, isLoading, isError } = usePublicCreator(id || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const isOwner = user?.id === profile?.userId;

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        <p className="text-sm text-gray-400">Loading creator profile...</p>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
          <Sparkles className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-white">Creator Profile Not Found</h2>
        <p className="text-sm text-gray-400 max-w-md">
          The creator profile you are looking for might have been moved or is currently private.
        </p>
        <Button variant="secondary" onClick={() => navigate('/')}>
          Return Home
        </Button>
      </div>
    );
  }

  const creatorName = profile.user?.fullName || 'Creator Profile';
  const avatarUrl = profile.user?.avatarUrl;

  const socialAccounts = profile.socialAccounts || [];
  const portfolioItems = profile.portfolioItems || [];
  const servicePackages = (profile as any).servicePackages || [];

  // Metrics rollups
  const totalFollowers = socialAccounts.reduce(
    (acc: number, a: SocialAccountResponse) => acc + (a.followerCount || 0),
    0,
  );
  const accountsWithEr = socialAccounts.filter(
    (a: SocialAccountResponse) => a.engagementRate !== null && a.engagementRate !== undefined,
  );
  const avgEngagementRate =
    accountsWithEr.length > 0
      ? (
          accountsWithEr.reduce(
            (acc: number, a: SocialAccountResponse) => acc + (a.engagementRate || 0),
            0,
          ) / accountsWithEr.length
        ).toFixed(1)
      : null;

  // Filter categories
  const categories = Array.from(
    new Set(
      portfolioItems
        .map((item: PortfolioItemResponse) => item.category)
        .filter(Boolean) as string[],
    ),
  );

  const filteredPortfolio =
    selectedCategory === 'ALL'
      ? portfolioItems
      : portfolioItems.filter((i: PortfolioItemResponse) => i.category === selectedCategory);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Profile link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Cover Banner */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-gradient-to-r from-emerald-950/40 via-indigo-950/40 to-purple-950/40">
        {profile.coverImageUrl ? (
          <img
            src={profile.coverImageUrl}
            alt="Cover"
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

        {/* Top actions */}
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
              title="Share profile"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
            {isOwner && (
              <Link
                to="/profile/edit"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-xs font-semibold text-white transition-all shadow-md"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Profile
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Profile Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative -mt-20 z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left / Main Column (2 spans) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header info card */}
            <Card variant="glass" padding="lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-4 border-[var(--color-bg-primary)] shadow-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-extrabold uppercase">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={creatorName} className="w-full h-full object-cover" />
                    ) : (
                      creatorName[0]
                    )}
                  </div>
                  {profile.isVerified && (
                    <div
                      className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-emerald-500 text-white shadow-lg"
                      title="Verified Creator"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Names & Headline */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">{creatorName}</h1>
                    {profile.isVerified && (
                      <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <ShieldCheck className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>

                  {profile.headline && (
                    <p className="text-sm font-medium text-emerald-400/90 mb-3 leading-snug">
                      {profile.headline}
                    </p>
                  )}

                  {/* Metadata pills */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                    {profile.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    {profile.websiteUrl && (
                      <a
                        href={profile.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-indigo-400 hover:underline"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Website</span>
                      </a>
                    )}
                    {profile.languages && profile.languages.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Languages className="w-3.5 h-3.5 text-gray-400" />
                        <span>{profile.languages.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Niches / Categories */}
              {profile.niche && profile.niche.length > 0 && (
                <div className="mt-6 pt-5 border-t border-white/10">
                  <div className="flex flex-wrap gap-2">
                    {profile.niche.map((n) => (
                      <span
                        key={n}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-gray-200"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Social Accounts Channel Row */}
            {socialAccounts.length > 0 && (
              <Card variant="glass" padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400" />
                    Connected Social Channels
                  </h2>
                  <span className="text-xs text-gray-400">
                    {socialAccounts.length} {socialAccounts.length === 1 ? 'channel' : 'channels'} linked
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {socialAccounts.map((account: SocialAccountResponse) => {
                    const colorClass =
                      PLATFORM_COLORS[account.platform] ||
                      'from-gray-500/20 to-gray-600/20 text-gray-300 border-gray-500/30';
                    const icon = PLATFORM_ICONS[account.platform];

                    return (
                      <a
                        key={account.id}
                        href={account.profileUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-between p-3.5 rounded-xl border bg-gradient-to-r transition-all duration-200 hover:scale-[1.02] ${colorClass}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-black/40 backdrop-blur-sm">
                            {icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold text-white">
                                {account.handle}
                              </span>
                              {account.isVerified && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                              )}
                            </div>
                            <span className="text-[11px] opacity-80 uppercase tracking-wider font-medium">
                              {SOCIAL_PLATFORM_LABELS[account.platform]}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          {account.followerCount !== null && (
                            <p className="text-sm font-extrabold text-white">
                              {formatNumber(account.followerCount)}
                            </p>
                          )}
                          {account.engagementRate !== null && (
                            <p className="text-[11px] opacity-80 flex items-center justify-end gap-0.5">
                              <TrendingUp className="w-3 h-3" />
                              {account.engagementRate}% ER
                            </p>
                          )}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* About / Bio */}
            <Card variant="glass" padding="lg">
              <h2 className="text-lg font-bold text-white mb-3">About the Creator</h2>
              {profile.bio ? (
                <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-line">
                  {profile.bio}
                </p>
              ) : (
                <p className="text-sm italic text-gray-500">
                  This creator has not added a biography yet.
                </p>
              )}
            </Card>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card variant="glass" padding="md" className="text-center">
                <p className="font-bold text-base text-white mb-1">
                  {totalFollowers > 0 ? formatNumber(totalFollowers) : '—'}
                </p>
                <p className="text-[11px] text-gray-400 uppercase tracking-wider">Total Reach</p>
              </Card>

              <Card variant="glass" padding="md" className="text-center">
                <p className="font-bold text-base text-emerald-400 mb-1">
                  {avgEngagementRate ? `${avgEngagementRate}%` : '—'}
                </p>
                <p className="text-[11px] text-gray-400 uppercase tracking-wider">Avg Engagement</p>
              </Card>

              <Card variant="glass" padding="md" className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold text-base">
                    {profile.ratingAverage > 0 ? profile.ratingAverage.toFixed(1) : 'New'}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 uppercase tracking-wider">
                  {profile.reviewCount} {profile.reviewCount === 1 ? 'Review' : 'Reviews'}
                </p>
              </Card>

              <Card variant="glass" padding="md" className="text-center">
                <p className="font-bold text-base text-indigo-400 mb-1">
                  {portfolioItems.length}
                </p>
                <p className="text-[11px] text-gray-400 uppercase tracking-wider">Works Shown</p>
              </Card>
            </div>

            {/* Portfolio Gallery Section */}
            {portfolioItems.length > 0 && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-400" />
                    Featured Work & Past Campaigns
                  </h2>

                  {/* Category filter pills */}
                  {categories.length > 1 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                      <button
                        type="button"
                        onClick={() => setSelectedCategory('ALL')}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          selectedCategory === 'ALL'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        All ({portfolioItems.length})
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                            selectedCategory === cat
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white/5 text-gray-400 hover:text-white'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPortfolio.map((item: PortfolioItemResponse) => {
                    const m = (item.metrics as Record<string, number>) || {};
                    const displayImage = item.thumbnailUrl || item.mediaUrl;

                    return (
                      <Card
                        key={item.id}
                        variant="glass"
                        padding="none"
                        className="overflow-hidden group border border-white/10 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between"
                      >
                        <div>
                          {/* Media preview */}
                          <div className="relative aspect-video w-full bg-black/40 overflow-hidden">
                            <img
                              src={displayImage}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = 'none';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                              {item.category && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-black/70 backdrop-blur-md text-white border border-white/20">
                                  {item.category}
                                </span>
                              )}
                              {item.platform && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 backdrop-blur-md">
                                  {SOCIAL_PLATFORM_LABELS[item.platform]}
                                </span>
                              )}
                            </div>

                            {item.brandName && (
                              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/20 text-xs font-medium text-emerald-300">
                                <Building className="w-3 h-3" />
                                <span>{item.brandName}</span>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-5">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <h3 className="text-base font-bold text-white leading-snug">
                                {item.title}
                              </h3>
                              {item.externalUrl && (
                                <a
                                  href={item.externalUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-400 hover:text-indigo-400 transition-colors flex-shrink-0"
                                  title="View original link"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                            </div>

                            {item.description && (
                              <p
                                className="text-xs line-clamp-3 leading-relaxed mb-4"
                                style={{ color: 'var(--color-text-secondary)' }}
                              >
                                {item.description}
                              </p>
                            )}

                            {/* Metrics */}
                            {(m.views || m.likes || m.comments || m.reach) && (
                              <div className="grid grid-cols-4 gap-2 pt-3 border-t border-white/10 text-center">
                                {m.views !== undefined && (
                                  <div>
                                    <span className="text-[10px] uppercase font-semibold text-gray-400 flex items-center justify-center gap-1 mb-0.5">
                                      <Eye className="w-3 h-3 text-indigo-400" /> Views
                                    </span>
                                    <span className="text-xs font-bold text-white">
                                      {formatNumber(m.views)}
                                    </span>
                                  </div>
                                )}
                                {m.likes !== undefined && (
                                  <div>
                                    <span className="text-[10px] uppercase font-semibold text-gray-400 flex items-center justify-center gap-1 mb-0.5">
                                      <Heart className="w-3 h-3 text-pink-400" /> Likes
                                    </span>
                                    <span className="text-xs font-bold text-white">
                                      {formatNumber(m.likes)}
                                    </span>
                                  </div>
                                )}
                                {m.comments !== undefined && (
                                  <div>
                                    <span className="text-[10px] uppercase font-semibold text-gray-400 flex items-center justify-center gap-1 mb-0.5">
                                      <MessageCircle className="w-3 h-3 text-blue-400" /> Comments
                                    </span>
                                    <span className="text-xs font-bold text-white">
                                      {formatNumber(m.comments)}
                                    </span>
                                  </div>
                                )}
                                {m.reach !== undefined && (
                                  <div>
                                    <span className="text-[10px] uppercase font-semibold text-gray-400 flex items-center justify-center gap-1 mb-0.5">
                                      <TrendingUp className="w-3 h-3 text-emerald-400" /> Reach
                                    </span>
                                    <span className="text-xs font-bold text-white">
                                      {formatNumber(m.reach)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {item.externalUrl && (
                          <div className="px-5 py-3 border-t border-white/5 bg-white/[0.02]">
                            <a
                              href={item.externalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1"
                            >
                              <span>View Live Deliverable</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Services & Pricing Packages Section */}
            {servicePackages.length > 0 && (
              <Card variant="glass" padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Package className="w-4 h-4 text-emerald-400" />
                    Standard Service Packages
                  </h2>
                  <span className="text-xs text-gray-400">
                    {servicePackages.length} {servicePackages.length === 1 ? 'package' : 'packages'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {servicePackages.map((pkg: any) => {
                    const sym = pkg.currency === 'INR' ? '₹' : '$';
                    return (
                      <div
                        key={pkg.id}
                        className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              {SOCIAL_PLATFORM_LABELS[pkg.platform as SocialPlatform] || pkg.platform} • {pkg.format}
                            </span>
                            <span className="text-sm font-black text-white">
                              {sym}{pkg.price.toLocaleString()}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-white mb-1">{pkg.title}</h4>
                          <p className="text-xs text-gray-400 line-clamp-2 mb-3">{pkg.description}</p>

                          <div className="flex items-center gap-3 text-[11px] text-gray-300 mb-3">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-400" /> {pkg.deliveryDays}d delivery
                            </span>
                            <span className="flex items-center gap-1">
                              <RotateCcw className="w-3 h-3 text-indigo-400" /> {pkg.revisions} rev
                            </span>
                          </div>

                          {pkg.features && pkg.features.length > 0 && (
                            <ul className="space-y-1 mb-4 text-[11px] text-gray-300">
                              {pkg.features.slice(0, 3).map((f: string, i: number) => (
                                <li key={i} className="flex items-center gap-1.5">
                                  <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                                  <span className="truncate">{f}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full text-xs flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500"
                          onClick={async () => {
                            if (!user) {
                              navigate('/auth/choose-role');
                              return;
                            }
                            try {
                              const conv = await startConversationMutation.mutateAsync({
                                recipientId: profile.userId,
                                initialMessage: `Hi ${creatorName}, I am interested in booking your "${pkg.title}" package (${sym}${pkg.price}).`,
                              });
                              navigate(`/messages?id=${conv.id}`);
                            } catch (err) {
                              alert('Failed to start conversation');
                            }
                          }}
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Inquire About Package</span>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column / Sticky Collaboration Card (1 span) */}
          <div className="space-y-6">
            <Card
              variant="glass"
              padding="lg"
              className="sticky top-24 border-emerald-500/20 shadow-xl"
            >
              <h3 className="text-lg font-bold text-white mb-2">Hire {creatorName}</h3>
              <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                Connect directly for sponsored posts, product placements, and dedicated brand campaigns.
              </p>

              <div className="space-y-3">
                {isBusiness && (
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20"
                    onClick={() => setInviteModalOpen(true)}
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Invite to Campaign</span>
                  </Button>
                )}

                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={async () => {
                    if (!user) {
                      navigate('/auth/choose-role');
                      return;
                    }
                    try {
                      const conv = await startConversationMutation.mutateAsync({
                        recipientId: profile.userId,
                        initialMessage: `Hi ${creatorName}, let's connect for collaboration opportunities!`,
                      });
                      navigate(`/messages?id=${conv.id}`);
                    } catch (err) {
                      alert('Failed to start chat');
                    }
                  }}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Message</span>
                </Button>
              </div>

              <div className="mt-6 pt-5 border-t border-white/10 space-y-2 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Escrow payment protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Contract-backed deliverables</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {inviteModalOpen && profile && (
        <InviteCreatorModal
          isOpen={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          creatorProfileId={profile.id}
          creatorName={creatorName}
        />
      )}
    </div>
  );
}
