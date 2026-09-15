import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePublicCampaigns } from '@/features/campaigns/hooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  SocialPlatform,
  SOCIAL_PLATFORM_LABELS,
  CREATOR_NICHES,
  CampaignStatus,
} from '@2becollab/types';
import {
  Search,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowRight,
  Loader2,
  Clock,
  Instagram,
  Youtube,
  Linkedin,
  Facebook,
  Twitter,
  Globe,
} from 'lucide-react';

const PLATFORM_ICONS: Record<SocialPlatform, React.ReactNode> = {
  [SocialPlatform.INSTAGRAM]: <Instagram className="w-3.5 h-3.5" />,
  [SocialPlatform.YOUTUBE]: <Youtube className="w-3.5 h-3.5" />,
  [SocialPlatform.TIKTOK]: (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.11V9a6.33 6.33 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 0010.86 4.43V13.4a8.16 8.16 0 005.58 2.17V12.1a4.84 4.84 0 01-3.45-1.44 4.84 4.84 0 001.45-3.97z" />
    </svg>
  ),
  [SocialPlatform.TWITTER]: <Twitter className="w-3.5 h-3.5" />,
  [SocialPlatform.LINKEDIN]: <Linkedin className="w-3.5 h-3.5" />,
  [SocialPlatform.FACEBOOK]: <Facebook className="w-3.5 h-3.5" />,
  [SocialPlatform.OTHER]: <Globe className="w-3.5 h-3.5" />,
};

function formatBudget(min: number | null, max: number | null, currency: string = 'USD') {
  const sym = currency === 'INR' ? '₹' : '$';
  if (min !== null && max !== null) {
    return `${sym}${min.toLocaleString()} – ${sym}${max.toLocaleString()}`;
  }
  if (min !== null) return `From ${sym}${min.toLocaleString()}`;
  if (max !== null) return `Up to ${sym}${max.toLocaleString()}`;
  return 'Negotiable';
}

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function CampaignDiscoveryPage() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNiche, setSelectedNiche] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | ''>('');
  const [sortBy, setSortBy] = useState<'newest' | 'budget' | 'deadline'>('newest');
  const [page, setPage] = useState(1);

  const { data, isLoading } = usePublicCampaigns({
    query: searchQuery || undefined,
    niche: selectedNiche || undefined,
    platform: selectedPlatform || undefined,
    status: CampaignStatus.ACTIVE,
    sortBy,
    page,
    limit: 12,
  });

  const campaigns = data?.items || [];
  const pagination = data?.pagination || {
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedNiche('');
    setSelectedPlatform('');
    setSortBy('newest');
    setPage(1);
  };

  const hasActiveFilters = searchQuery || selectedNiche || selectedPlatform;

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Header */}
      <div className="relative overflow-hidden py-14 px-4 bg-gradient-to-b from-emerald-950/40 via-indigo-950/20 to-transparent border-b border-white/5">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-4">
            <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
            Paid Sponsorship Opportunities
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Explore Brand Campaigns
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            Find active collaboration briefs from verified brands looking for sponsored content, UGC, reviews, and ambassadors.
          </p>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto relative flex items-center shadow-2xl">
            <Search className="w-5 h-5 absolute left-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search campaigns by keyword, product, or brand name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-neutral-900/90 border border-white/15 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 text-sm backdrop-blur-md transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 text-gray-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        {/* Niche Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          <button
            type="button"
            onClick={() => {
              setSelectedNiche('');
              setPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
              selectedNiche === ''
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            All Niches
          </button>
          {CREATOR_NICHES.map((niche) => (
            <button
              key={niche}
              type="button"
              onClick={() => {
                setSelectedNiche(selectedNiche === niche ? '' : niche);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                selectedNiche === niche
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {niche}
            </button>
          ))}
        </div>

        {/* Secondary Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-neutral-900/60 border border-white/10 backdrop-blur-md mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedPlatform}
              onChange={(e) => {
                setSelectedPlatform(e.target.value as SocialPlatform | '');
                setPage(1);
              }}
              className="rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none transition-all"
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
              }}
            >
              <option value="">All Platforms</option>
              {Object.values(SocialPlatform).map((p) => (
                <option key={p} value={p}>
                  {SOCIAL_PLATFORM_LABELS[p]}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as any);
                setPage(1);
              }}
              className="rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none transition-all"
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
              }}
            >
              <option value="newest">Newly Posted</option>
              <option value="budget">Highest Budget</option>
              <option value="deadline">Closing Soon</option>
            </select>
          </div>
        </div>

        {/* Campaign List Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-medium text-gray-400">
            Found <span className="text-white font-bold">{pagination.total}</span> active campaigns
          </p>
        </div>

        {/* Grid of Campaign Briefs */}
        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          </div>
        ) : campaigns.length === 0 ? (
          <Card variant="glass" padding="lg" className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No active campaigns found</h3>
            <p className="text-sm max-w-md mx-auto mb-6 text-gray-400">
              There are currently no active brand briefs matching your search criteria. Try removing filters or check back soon!
            </p>
            <Button onClick={clearFilters} variant="primary">
              Clear All Filters
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => {
              const brand = campaign.businessProfile;
              const companyName = brand?.companyName || brand?.user?.fullName || 'Verified Brand';
              const logoUrl = brand?.logoUrl || brand?.user?.avatarUrl;
              const budgetStr = formatBudget(campaign.budgetMin, campaign.budgetMax, campaign.currency);
              const deadlineStr = formatDate(campaign.deadline);
              const deliverables = campaign.deliverables || [];

              return (
                <Card
                  key={campaign.id}
                  variant="glass"
                  padding="none"
                  className="overflow-hidden group border border-white/10 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-emerald-500/5"
                >
                  <div className="p-6">
                    {/* Brand header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10 border border-white/15 flex items-center justify-center text-white font-bold text-sm uppercase flex-shrink-0">
                        {logoUrl ? (
                          <img src={logoUrl} alt={companyName} className="w-full h-full object-cover" />
                        ) : (
                          companyName[0]
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-gray-300 truncate">{companyName}</p>
                        <p className="text-[11px] text-emerald-400 font-medium truncate">
                          {brand?.industry || 'Brand Partner'}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                        {budgetStr}
                      </span>
                    </div>

                    {/* Campaign Title */}
                    <Link
                      to={`/campaigns/${campaign.id}`}
                      className="block text-lg font-bold text-white hover:text-emerald-400 transition-colors leading-snug mb-2 line-clamp-2"
                    >
                      {campaign.title}
                    </Link>

                    {/* Description preview */}
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">
                      {campaign.description}
                    </p>

                    {/* Niches Pills */}
                    {campaign.niches && campaign.niches.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {campaign.niches.slice(0, 3).map((n) => (
                          <span
                            key={n}
                            className="px-2.5 py-0.5 rounded-md text-[10px] font-medium bg-white/5 border border-white/10 text-gray-300"
                          >
                            {n}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Platforms & Deliverables bar */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-1.5">
                        {campaign.platforms && campaign.platforms.map((p) => (
                          <span key={p} className="text-gray-300" title={SOCIAL_PLATFORM_LABELS[p]}>
                            {PLATFORM_ICONS[p]}
                          </span>
                        ))}
                        {deliverables.length > 0 && (
                          <span className="text-[11px] text-gray-400 ml-1">
                            • {deliverables.length} {deliverables.length === 1 ? 'task' : 'tasks'}
                          </span>
                        )}
                      </div>

                      {deadlineStr && (
                        <div className="flex items-center gap-1 text-[11px] text-amber-300/90">
                          <Clock className="w-3 h-3" />
                          <span>Due {deadlineStr}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="px-6 py-4 border-t border-white/5 bg-white/[0.02] flex items-center justify-between gap-3">
                    <Link
                      to={`/campaigns/${campaign.id}`}
                      className="text-xs font-semibold text-gray-300 hover:text-white transition-colors"
                    >
                      View Details
                    </Link>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/campaigns/${campaign.id}`)}
                      className="text-xs flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-12">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!pagination.hasPrevPage}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>
            <span className="text-xs font-medium text-gray-400">
              Page <span className="text-white font-bold">{pagination.page}</span> of{' '}
              <span className="text-white font-bold">{pagination.totalPages}</span>
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={!pagination.hasNextPage}
              className="flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
