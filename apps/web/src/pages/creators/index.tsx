import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCreatorSearch } from '@/features/creators/hooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  SocialPlatform,
  SOCIAL_PLATFORM_LABELS,
  CREATOR_NICHES,
} from '@2becollab/types';
import {
  Search,
  Star,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Users,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
  Instagram,
  Youtube,
  Linkedin,
  Facebook,
  Twitter,
  Globe,
  Loader2,
  ArrowRight,
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

const FOLLOWER_TIERS = [
  { label: 'All Audience Sizes', min: undefined, max: undefined },
  { label: 'Nano (< 10K)', min: 0, max: 10_000 },
  { label: 'Micro (10K - 50K)', min: 10_000, max: 50_000 },
  { label: 'Mid-Tier (50K - 500K)', min: 50_000, max: 500_000 },
  { label: 'Macro (500K+)', min: 500_000, max: undefined },
];

function formatFollowers(num: number | undefined | null): string {
  if (num === null || num === undefined) return '0';
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function CreatorDiscoveryPage() {
  const navigate = useNavigate();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNiche, setSelectedNiche] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | ''>('');
  const [selectedFollowerTier, setSelectedFollowerTier] = useState<number>(0);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [locationInput, setLocationInput] = useState('');
  const [sortBy, setSortBy] = useState<'followers' | 'rating' | 'reviews' | 'newest'>('followers');
  const [page, setPage] = useState(1);

  const activeTier = FOLLOWER_TIERS[selectedFollowerTier] ?? FOLLOWER_TIERS[0];
  const minFollowers = activeTier ? activeTier.min : undefined;
  const maxFollowers = activeTier ? activeTier.max : undefined;

  const { data, isLoading } = useCreatorSearch({
    query: searchQuery || undefined,
    niches: selectedNiche ? [selectedNiche] : undefined,
    platforms: selectedPlatform ? [selectedPlatform] : undefined,
    minFollowers,
    maxFollowers,
    minRating,
    location: locationInput || undefined,
    sortBy,
    page,
    limit: 12,
  });

  const creators = data?.items || [];
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
    setSelectedFollowerTier(0);
    setMinRating(undefined);
    setLocationInput('');
    setSortBy('followers');
    setPage(1);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedNiche ||
    selectedPlatform ||
    selectedFollowerTier !== 0 ||
    minRating !== undefined ||
    locationInput;

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Search Header */}
      <div className="relative overflow-hidden py-14 px-4 bg-gradient-to-b from-indigo-950/40 via-purple-950/20 to-transparent border-b border-white/5">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Vetted Creator Marketplace
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Discover & Hire Top Creators
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            Connect with creators across Instagram, YouTube, TikTok, and more with verified follower metrics and past work samples.
          </p>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto relative flex items-center shadow-2xl">
            <Search className="w-5 h-5 absolute left-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search creators by name, keywords, bio, or location..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-neutral-900/90 border border-white/15 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 text-sm backdrop-blur-md transition-all shadow-inner"
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
        {/* Filter bar */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Top Row: Niche Horizontal Scrolling Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => {
                setSelectedNiche('');
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                selectedNiche === ''
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
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
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {niche}
              </button>
            ))}
          </div>

          {/* Secondary Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-neutral-900/60 border border-white/10 backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-3">
              {/* Platform selector */}
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

              {/* Follower tier selector */}
              <select
                value={selectedFollowerTier}
                onChange={(e) => {
                  setSelectedFollowerTier(Number(e.target.value));
                  setPage(1);
                }}
                className="rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none transition-all"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)',
                }}
              >
                {FOLLOWER_TIERS.map((tier, idx) => (
                  <option key={tier.label} value={idx}>
                    {tier.label}
                  </option>
                ))}
              </select>

              {/* Rating filter */}
              <select
                value={minRating ?? ''}
                onChange={(e) => {
                  setMinRating(e.target.value ? Number(e.target.value) : undefined);
                  setPage(1);
                }}
                className="rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none transition-all"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <option value="">Any Rating</option>
                <option value="4.5">★ 4.5 & Above</option>
                <option value="4.0">★ 4.0 & Above</option>
                <option value="3.5">★ 3.5 & Above</option>
              </select>

              {/* Clear filters button */}
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

            {/* Sort Dropdown */}
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
                <option value="followers">Most Followers</option>
                <option value="rating">Top Rated</option>
                <option value="reviews">Most Reviews</option>
                <option value="newest">Newly Joined</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-medium text-gray-400">
            Found <span className="text-white font-bold">{pagination.total}</span> creators
          </p>
        </div>

        {/* Grid of Creators */}
        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          </div>
        ) : creators.length === 0 ? (
          <Card variant="glass" padding="lg" className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No creators found</h3>
            <p className="text-sm max-w-md mx-auto mb-6 text-gray-400">
              We couldn't find any creators matching your search filters. Try broadening your keywords or clearing applied filters.
            </p>
            <Button onClick={clearFilters} variant="primary">
              Clear All Filters
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creators.map((creator) => {
              const profileUrl = `/creators/${creator.userId}`;

              return (
                <Card
                  key={creator.id}
                  variant="glass"
                  padding="none"
                  className="overflow-hidden group border border-white/10 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-500/5"
                >
                  <div className="p-6">
                    {/* Header: Avatar, Name, Rating */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/15 bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold uppercase">
                          {creator.avatarUrl ? (
                            <img
                              src={creator.avatarUrl}
                              alt={creator.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            creator.fullName[0]
                          )}
                        </div>
                        {creator.isVerified && (
                          <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-white">
                            <ShieldCheck className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <Link
                            to={profileUrl}
                            className="text-base font-bold text-white hover:text-indigo-400 transition-colors truncate"
                          >
                            {creator.fullName}
                          </Link>
                          <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold flex-shrink-0">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{creator.ratingAverage > 0 ? creator.ratingAverage.toFixed(1) : 'New'}</span>
                          </div>
                        </div>

                        {creator.headline ? (
                          <p className="text-xs text-indigo-300 line-clamp-1 mb-1 font-medium">
                            {creator.headline}
                          </p>
                        ) : null}

                        {creator.location && (
                          <p className="text-[11px] text-gray-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gray-500" />
                            <span className="truncate">{creator.location}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Niches Pills */}
                    {creator.niche && creator.niche.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {creator.niche.slice(0, 3).map((n) => (
                          <span
                            key={n}
                            className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-white/5 border border-white/10 text-gray-300"
                          >
                            {n}
                          </span>
                        ))}
                        {creator.niche.length > 3 && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium text-gray-500">
                            +{creator.niche.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Social Accounts Row */}
                    {creator.socialAccounts && creator.socialAccounts.length > 0 ? (
                      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
                        {creator.socialAccounts.map((acc) => (
                          <div
                            key={acc.id}
                            className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/40 border border-white/10 text-[11px] text-gray-300 flex-shrink-0"
                          >
                            <span className="text-indigo-400">{PLATFORM_ICONS[acc.platform]}</span>
                            <span className="font-semibold text-white">
                              {formatFollowers(acc.followerCount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {/* Metric Highlight strip */}
                    <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center mb-4">
                      <div>
                        <p className="text-[10px] uppercase font-semibold text-gray-400 flex items-center justify-center gap-1 mb-0.5">
                          <Users className="w-3 h-3 text-indigo-400" /> Total Reach
                        </p>
                        <p className="text-xs font-bold text-white">
                          {creator.totalFollowers > 0 ? formatFollowers(creator.totalFollowers) : '—'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-semibold text-gray-400 flex items-center justify-center gap-1 mb-0.5">
                          <TrendingUp className="w-3 h-3 text-emerald-400" /> Avg ER
                        </p>
                        <p className="text-xs font-bold text-emerald-400">
                          {creator.avgEngagementRate ? `${creator.avgEngagementRate}%` : '—'}
                        </p>
                      </div>
                    </div>

                    {/* Portfolio Preview Thumbnail strip */}
                    {creator.portfolioPreview && creator.portfolioPreview.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-semibold text-gray-400">
                          Work Samples
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          {creator.portfolioPreview.map((item) => (
                            <div
                              key={item.id}
                              className="relative aspect-video rounded-lg overflow-hidden bg-black/50 border border-white/10 group-hover:border-white/20 transition-all"
                            >
                              <img
                                src={item.thumbnailUrl || item.mediaUrl}
                                alt={item.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.currentTarget as HTMLElement).style.display = 'none';
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="px-6 py-4 border-t border-white/5 bg-white/[0.02] flex items-center justify-between gap-3">
                    <Link
                      to={profileUrl}
                      className="text-xs font-semibold text-gray-300 hover:text-white transition-colors"
                    >
                      View Profile
                    </Link>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(profileUrl)}
                      className="text-xs flex items-center gap-1 shadow-md shadow-indigo-500/20"
                    >
                      <span>Connect</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
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
