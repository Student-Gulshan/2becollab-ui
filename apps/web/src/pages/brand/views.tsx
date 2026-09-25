import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Download,
  Send,
  Save,
  Check,
} from 'lucide-react';
import { BrandDashboardLayout } from '@/components/layout/brand-dashboard-layout';
import { useAuthStore } from '@/stores/auth-store';

// ══════════════════════════════════════════════════════════════════
// 1. CAMPAIGNS VIEW (/brand/campaigns)
// ══════════════════════════════════════════════════════════════════
export function BrandCampaignsView() {
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'REVIEWING' | 'COMPLETED'>('ALL');
  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  // New campaign form state
  const [newTitle, setNewTitle] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [newCategory, setNewCategory] = useState('Beauty & Skincare');
  const [newPlatform, setNewPlatform] = useState('Instagram');
  const [newBrief, setNewBrief] = useState('');

  const initialCampaigns = [
    {
      id: 'camp-101',
      title: 'Hydrating Glow Serum Launch',
      category: 'Beauty & Skincare',
      platform: 'Instagram Reels & TikTok',
      budget: '$3,500',
      status: 'ACTIVE',
      statusLabel: 'Active & Accepting Bids',
      applicantsCount: 12,
      creatorsHired: 4,
      deliverablesTotal: 8,
      deliverablesDone: 5,
      deadline: 'Oct 15, 2026',
      img: '/images/skincare-thumb.jpg',
    },
    {
      id: 'camp-102',
      title: 'Autumn Velvet Matte Lipstick Line',
      category: 'Cosmetics & Makeup',
      platform: 'Instagram Carousels & Reels',
      budget: '$2,200',
      status: 'ACTIVE',
      statusLabel: 'Active & Reviewing Drafts',
      applicantsCount: 6,
      creatorsHired: 2,
      deliverablesTotal: 4,
      deliverablesDone: 2,
      deadline: 'Oct 22, 2026',
      img: '/images/fashion-collab.jpg',
    },
    {
      id: 'camp-103',
      title: 'Winter Travel Skincare Essentials',
      category: 'Travel & Lifestyle',
      platform: 'YouTube Shorts & Dedicated Vlogs',
      budget: '$4,000',
      status: 'REVIEWING',
      statusLabel: 'Reviewing Proposals',
      applicantsCount: 15,
      creatorsHired: 0,
      deliverablesTotal: 6,
      deliverablesDone: 0,
      deadline: 'Nov 05, 2026',
      img: '/images/travel-story.jpg',
    },
    {
      id: 'camp-104',
      title: 'Summer Dew Sunscreen Pre-Launch',
      category: 'Skincare & Sun Protection',
      platform: 'Instagram & TikTok',
      budget: '$5,000',
      status: 'COMPLETED',
      statusLabel: 'Campaign Completed',
      applicantsCount: 24,
      creatorsHired: 6,
      deliverablesTotal: 12,
      deliverablesDone: 12,
      deadline: 'Aug 30, 2026',
      img: '/images/food-story.jpg',
    },
  ];

  const [campaignsList, setCampaignsList] = useState(initialCampaigns);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created = {
      id: `camp-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      platform: newPlatform,
      budget: newBudget || '$1,500 – $3,000',
      status: 'ACTIVE' as const,
      statusLabel: 'Active & Accepting Bids',
      applicantsCount: 0,
      creatorsHired: 0,
      deliverablesTotal: 4,
      deliverablesDone: 0,
      deadline: '30 days left',
      img: '/images/for-brands-hero.jpg',
    };

    setCampaignsList([created, ...campaignsList]);
    setCreateSuccess(true);
    setTimeout(() => {
      setCreateSuccess(false);
      setIsCreateModalOpen(false);
      setNewTitle('');
      setNewBudget('');
      setNewBrief('');
    }, 1200);
  };

  const filteredCampaigns = campaignsList.filter((camp) => {
    const matchesFilter = filter === 'ALL' || camp.status === filter;
    const matchesSearch =
      camp.title.toLowerCase().includes(search.toLowerCase()) ||
      camp.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <BrandDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#17213B]">Brand Campaigns</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Create, manage, and monitor your influencer marketing campaign briefs and deliverables.
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5125D8] hover:bg-[#431db8] text-white text-xs font-semibold shadow-xs transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Create Campaign Brief
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200/80 rounded-2xl w-fit shadow-2xs">
            {(['ALL', 'ACTIVE', 'REVIEWING', 'COMPLETED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filter === tab
                    ? 'bg-[#5125D8] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab === 'ALL'
                  ? 'All Campaigns'
                  : tab === 'ACTIVE'
                  ? 'Active (2)'
                  : tab === 'REVIEWING'
                  ? 'Reviewing Bids (1)'
                  : 'Completed (1)'}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search briefs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:border-[#5125D8]"
            />
          </div>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredCampaigns.map((camp) => (
            <div
              key={camp.id}
              className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:border-purple-200 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={camp.img}
                      alt={camp.title}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shrink-0"
                    />
                    <div>
                      <span className="text-[11px] font-bold text-[#5125D8] bg-purple-50 px-2 py-0.5 rounded-md">
                        {camp.category}
                      </span>
                      <h3 className="text-sm font-bold text-[#17213B] mt-1 line-clamp-1">
                        {camp.title}
                      </h3>
                      <span className="text-xs text-slate-400">{camp.platform}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-extrabold text-[#17213B]">{camp.budget}</span>
                    <p className="text-[11px] text-slate-400">{camp.deadline}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                      Deliverables: <strong>{camp.deliverablesDone}/{camp.deliverablesTotal}</strong> completed
                    </span>
                    <span className="font-semibold text-emerald-600">
                      {camp.deliverablesTotal > 0
                        ? Math.round((camp.deliverablesDone / camp.deliverablesTotal) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#5125D8] h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          camp.deliverablesTotal > 0
                            ? (camp.deliverablesDone / camp.deliverablesTotal) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 text-slate-500">
                  <span>
                    Proposals: <strong className="text-slate-900">{camp.applicantsCount} Bids</strong>
                  </span>
                  <span>
                    Creators Booked: <strong className="text-slate-900">{camp.creatorsHired}</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {camp.statusLabel}
                </span>
                <div className="flex items-center gap-2">
                  <Link
                    to="/brand/bids"
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-[#5125D8] text-xs font-semibold transition-colors"
                  >
                    View Proposals ({camp.applicantsCount})
                  </Link>
                  <Link
                    to="/brand/collaborations"
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                  >
                    Workspace
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Campaign Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#5125D8]" />
                  <h3 className="text-base font-bold text-[#17213B]">Post New Campaign Brief</h3>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>

              {createSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-[#17213B]">Campaign Brief Published!</h4>
                  <p className="text-xs text-slate-500">
                    Vetted creators matching your requirements will begin submitting proposals shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCreateSubmit} className="space-y-3.5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Campaign Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Winter Hydration Serum Product Launch"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5125D8]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Category
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5125D8] bg-white"
                      >
                        <option>Beauty & Skincare</option>
                        <option>Fashion & Apparel</option>
                        <option>Tech & Electronics</option>
                        <option>Health & Fitness</option>
                        <option>Food & Beverage</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Primary Platform
                      </label>
                      <select
                        value={newPlatform}
                        onChange={(e) => setNewPlatform(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5125D8] bg-white"
                      >
                        <option>Instagram Reels</option>
                        <option>TikTok</option>
                        <option>YouTube Integration</option>
                        <option>Multi-Platform</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Allocated Budget
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. $1,500 – $3,000"
                      value={newBudget}
                      onChange={(e) => setNewBudget(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5125D8]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Campaign Instructions &amp; Deliverables
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Specify what creators need to show, promo codes, hashtags, and format requirements..."
                      value={newBrief}
                      onChange={(e) => setNewBrief(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5125D8] resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#5125D8] hover:bg-[#431db8] text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      Publish Campaign Brief
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </BrandDashboardLayout>
  );
}

// ══════════════════════════════════════════════════════════════════
// 2. CREATORS DISCOVERY VIEW (/brand/creators)
// ══════════════════════════════════════════════════════════════════
export function BrandCreatorsView() {
  const [selectedNiche, setSelectedNiche] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [invitedMap, setInvitedMap] = useState<Record<string, boolean>>({});

  const creators = [
    {
      id: 'cr-1',
      name: 'Arohi Patel',
      handle: '@arohicreates',
      avatar: '/images/avatar-creator-1.jpg',
      niche: 'Beauty & Skincare',
      nicheKey: 'BEAUTY',
      platform: 'Instagram',
      followers: '124,000',
      engagement: '8.4%',
      avgViews: '45.2K',
      rates: '$350 – $600',
      bio: 'Clean beauty advocate, dermatologist-approved skincare reviews & daily routines.',
      verified: true,
    },
    {
      id: 'cr-2',
      name: 'Marcus Vance',
      handle: '@techmarcus',
      avatar: '/images/tech-collab.jpg',
      niche: 'Tech & Gadgets',
      nicheKey: 'TECH',
      platform: 'YouTube',
      followers: '310,000',
      engagement: '6.1%',
      avgViews: '98.5K',
      rates: '$700 – $1,200',
      bio: 'Deep-dive tech reviews, productivity desk setups, and premium consumer gadgets.',
      verified: true,
    },
    {
      id: 'cr-3',
      name: 'Elena Rostova',
      handle: '@elena_glow',
      avatar: '/images/avatar-creator-2.jpg',
      niche: 'Fashion & Style',
      nicheKey: 'FASHION',
      platform: 'TikTok',
      followers: '195,000',
      engagement: '9.2%',
      avgViews: '62.0K',
      rates: '$400 – $750',
      bio: 'Parisian aesthetic, capsule wardrobe essentials & sustainable high-fashion.',
      verified: true,
    },
    {
      id: 'cr-4',
      name: 'Karan Mehra',
      handle: '@karanlifestyle',
      avatar: '/images/fitness-story.jpg',
      niche: 'Fitness & Health',
      nicheKey: 'FITNESS',
      platform: 'Instagram',
      followers: '92,000',
      engagement: '7.8%',
      avgViews: '38.0K',
      rates: '$300 – $550',
      bio: 'Strength coach, outdoor marathon runner, sports nutrition & wellness.',
      verified: false,
    },
    {
      id: 'cr-5',
      name: 'Sophia Chen',
      handle: '@sophiastyle',
      avatar: '/images/fashion-collab.jpg',
      niche: 'Fashion & Style',
      nicheKey: 'FASHION',
      platform: 'Instagram',
      followers: '280,000',
      engagement: '5.9%',
      avgViews: '72.4K',
      rates: '$600 – $1,000',
      bio: 'Streetwear transitions, luxury handbag unboxings and styling tips.',
      verified: true,
    },
    {
      id: 'cr-6',
      name: 'Priya Sharma',
      handle: '@priyaglows',
      avatar: '/images/avatar-creator-1.jpg',
      niche: 'Beauty & Skincare',
      nicheKey: 'BEAUTY',
      platform: 'Instagram',
      followers: '150,000',
      engagement: '8.8%',
      avgViews: '54.0K',
      rates: '$450 – $800',
      bio: 'Ayurvedic formulations & clean skincare science simplified for modern routines.',
      verified: true,
    },
  ];

  const handleInvite = (id: string) => {
    setInvitedMap((prev) => ({ ...prev, [id]: true }));
  };

  const filtered = creators.filter((c) => {
    const matchesNiche = selectedNiche === 'ALL' || c.nicheKey === selectedNiche;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.niche.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesNiche && matchesSearch;
  });

  return (
    <BrandDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#17213B]">Find &amp; Scout Creators</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Discover verified creators matching your brand aesthetics, engagement benchmarks, and target demographics.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200/80 rounded-2xl overflow-x-auto shadow-2xs">
            {[
              { label: 'All Niches', key: 'ALL' },
              { label: 'Beauty & Skincare', key: 'BEAUTY' },
              { label: 'Tech & Gadgets', key: 'TECH' },
              { label: 'Fashion & Style', key: 'FASHION' },
              { label: 'Fitness & Health', key: 'FITNESS' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedNiche(tab.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedNiche === tab.key
                    ? 'bg-[#5125D8] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, niche..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:border-[#5125D8]"
            />
          </div>
        </div>

        {/* Creators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((creator) => {
            const isInvited = invitedMap[creator.id];
            return (
              <div
                key={creator.id}
                className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:border-purple-200 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        className="w-13 h-13 rounded-2xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-[#17213B]">{creator.name}</h3>
                          {creator.verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#5125D8]" />
                          )}
                        </div>
                        <span className="text-xs text-slate-400">{creator.handle}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-[#5125D8]">
                      {creator.platform}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">{creator.bio}</p>

                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-purple-50/50 border border-purple-100/60 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Followers</span>
                      <strong className="text-xs text-[#17213B]">{creator.followers}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Engagement</span>
                      <strong className="text-xs text-emerald-600">{creator.engagement}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Avg Views</span>
                      <strong className="text-xs text-[#17213B]">{creator.avgViews}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs font-extrabold text-[#5125D8]">{creator.rates}</span>
                  <div className="flex items-center gap-2">
                    <Link
                      to="/brand/messages"
                      className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-purple-300 text-slate-600 hover:text-[#5125D8] text-xs font-semibold transition-colors"
                    >
                      Message
                    </Link>
                    {isInvited ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                        <Check className="w-3.5 h-3.5" /> Invited
                      </span>
                    ) : (
                      <button
                        onClick={() => handleInvite(creator.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#5125D8] hover:bg-[#431db8] text-white text-xs font-semibold shadow-xs transition-colors"
                      >
                        Invite to Brief
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </BrandDashboardLayout>
  );
}

// ══════════════════════════════════════════════════════════════════
// 3. PROPOSALS & BIDS VIEW (/brand/bids)
// ══════════════════════════════════════════════════════════════════
export function BrandBidsView() {
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'ACCEPTED'>('ALL');
  const [acceptedBids, setAcceptedBids] = useState<string[]>([]);

  const initialBids = [
    {
      id: 'bid-1',
      creator: 'Arohi Patel',
      handle: '@arohicreates',
      avatar: '/images/avatar-creator-1.jpg',
      campaign: 'Hydrating Glow Serum Launch',
      quote: '$450.00',
      timeline: '4 days',
      deliverables: '1x 60s High Energy Reel + 2x Story Slides with swipe up sticker',
      pitch:
        'Hi LuxeGlow team! My audience is 82% women aged 18-32 actively seeking clean morning skincare routines. I will focus on the lightweight texture and glass-skin glow.',
      status: 'PENDING',
    },
    {
      id: 'bid-2',
      creator: 'Sophia Chen',
      handle: '@sophiastyle',
      avatar: '/images/fashion-collab.jpg',
      campaign: 'Autumn Velvet Matte Lipstick Line',
      quote: '$750.00',
      timeline: '6 days',
      deliverables: '1x GRWM Transition Reel + High-res 4-Slide Color Swatch Carousel',
      pitch:
        'I specialize in aesthetic lip swatch transitions with color theory breakdown. Would love to feature your 3 newest shades in my next weekly favorites video.',
      status: 'PENDING',
    },
    {
      id: 'bid-3',
      creator: 'Karan Mehra',
      handle: '@karanlifestyle',
      avatar: '/images/fitness-story.jpg',
      campaign: 'Winter Travel Skincare Essentials',
      quote: '$380.00',
      timeline: '5 days',
      deliverables: '1x Outdoor Vlog Integration (60s) + 1x Feed Post',
      pitch:
        'Im shooting in cold mountain weather next week. Perfect organic integration to test moisture barrier protection in freezing wind conditions.',
      status: 'PENDING',
    },
    {
      id: 'bid-4',
      creator: 'Elena Rostova',
      handle: '@elena_glow',
      avatar: '/images/avatar-creator-2.jpg',
      campaign: 'Autumn Velvet Matte Lipstick Line',
      quote: '$550.00',
      timeline: '3 days',
      deliverables: '1x 30s TikTok Lookbook + 1x Story Q&A',
      pitch:
        'Have worked with French cosmetic brands previously. My followers appreciate non-drying matte formulas with rich pigment.',
      status: 'ACCEPTED',
    },
  ];

  const handleAcceptBid = (id: string) => {
    setAcceptedBids((prev) => [...prev, id]);
  };

  const filteredBids = initialBids.filter((b) => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'ACCEPTED') return acceptedBids.includes(b.id) || b.status === 'ACCEPTED';
    if (statusFilter === 'PENDING') return !acceptedBids.includes(b.id) && b.status === 'PENDING';
    return true;
  });

  return (
    <BrandDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#17213B]">Incoming Creator Proposals</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review incoming bids from verified creators. Accepting a proposal locks funds in neutral Escrow until deliverable approval.
          </p>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200/80 rounded-2xl w-fit shadow-2xs">
          {(['ALL', 'PENDING', 'ACCEPTED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === tab
                  ? 'bg-[#5125D8] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab === 'ALL'
                ? 'All Proposals (4)'
                : tab === 'PENDING'
                ? 'Under Review'
                : 'Accepted & Locked'}
            </button>
          ))}
        </div>

        {/* Proposals List */}
        <div className="space-y-4">
          {filteredBids.map((bid) => {
            const isAccepted = acceptedBids.includes(bid.id) || bid.status === 'ACCEPTED';
            return (
              <div
                key={bid.id}
                className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs hover:border-purple-200 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={bid.avatar}
                      alt={bid.creator}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#17213B]">{bid.creator}</h3>
                        <span className="text-xs text-slate-400">{bid.handle}</span>
                      </div>
                      <p className="text-xs text-slate-600 font-semibold mt-0.5">
                        Campaign: <span className="text-[#5125D8]">{bid.campaign}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-lg font-extrabold text-[#17213B]">{bid.quote}</span>
                    <p className="text-[11px] text-slate-400">Estimated delivery: {bid.timeline}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100/60 text-xs space-y-1.5">
                  <span className="font-bold text-slate-700 block">Deliverables Offered:</span>
                  <p className="text-slate-600">{bid.deliverables}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-700">Pitch Letter:</span>
                  <p className="text-xs text-slate-600 leading-relaxed bg-[#FBFBFE] p-3 rounded-xl border border-slate-100">
                    &quot;{bid.pitch}&quot;
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-[11px] text-slate-500 font-medium">
                      Escrow-protected collaboration
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to="/brand/messages"
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-purple-300 text-slate-600 hover:text-[#5125D8] text-xs font-semibold transition-colors"
                    >
                      Message Creator
                    </Link>

                    {isAccepted ? (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Accepted &amp; Escrow Funded
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAcceptBid(bid.id)}
                        className="px-4 py-1.5 rounded-xl bg-[#5125D8] hover:bg-[#431db8] text-white text-xs font-semibold shadow-xs transition-colors"
                      >
                        Accept &amp; Lock Escrow
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </BrandDashboardLayout>
  );
}

// ══════════════════════════════════════════════════════════════════
// 4. COLLABORATIONS VIEW (/brand/collaborations)
// ══════════════════════════════════════════════════════════════════
export function BrandCollaborationsView() {
  const [completedMilestones, setCompletedMilestones] = useState<string[]>([]);

  const collabs = [
    {
      id: 'collab-1',
      creator: 'Arohi Patel',
      handle: '@arohicreates',
      avatar: '/images/avatar-creator-1.jpg',
      campaign: 'Hydrating Glow Serum Launch',
      milestone: 'Draft Content Submitted — Action Required',
      milestoneIndex: 3,
      amount: '$450.00',
      assetType: 'Instagram 60s Reel Draft',
      preview: '/images/skincare-thumb.jpg',
    },
    {
      id: 'collab-2',
      creator: 'Marcus Vance',
      handle: '@techmarcus',
      avatar: '/images/tech-collab.jpg',
      campaign: 'ANC Headphone Unboxing & Lifestyle',
      milestone: 'Draft Review Completed — Creator Publishing',
      milestoneIndex: 4,
      amount: '$650.00',
      assetType: 'YouTube Dedicated Video',
      preview: '/images/tech-collab.jpg',
    },
    {
      id: 'collab-3',
      creator: 'Elena Rostova',
      handle: '@elena_glow',
      avatar: '/images/avatar-creator-2.jpg',
      campaign: 'Autumn Velvet Matte Lipstick Line',
      milestone: 'Script & Concept Planning',
      milestoneIndex: 2,
      amount: '$350.00',
      assetType: '4K Carousel Swatches',
      preview: '/images/fashion-collab.jpg',
    },
  ];

  const handleApprove = (id: string) => {
    setCompletedMilestones((prev) => [...prev, id]);
  };

  return (
    <BrandDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#17213B]">Active Collaborations</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track milestone progress, review creator drafts, request edits, and release escrow payouts upon approval.
          </p>
        </div>

        <div className="space-y-5">
          {collabs.map((collab) => {
            const isReleased = completedMilestones.includes(collab.id);
            return (
              <div
                key={collab.id}
                className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={collab.avatar}
                      alt={collab.creator}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#17213B]">{collab.creator}</h3>
                        <span className="text-xs text-slate-400">{collab.handle}</span>
                      </div>
                      <p className="text-xs font-semibold text-[#5125D8]">{collab.campaign}</p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-base font-extrabold text-[#17213B]">
                      {collab.amount} Escrow Secured
                    </span>
                    <p className="text-[11px] text-slate-400">{collab.assetType}</p>
                  </div>
                </div>

                {/* Milestone Stepper */}
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100/60 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>Milestone Progress</span>
                    <span className="text-[#5125D8]">{collab.milestone}</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 pt-1">
                    {['Brief Agreed', 'Drafting', 'Brand Review', 'Revisions', 'Released'].map(
                      (stepName, i) => {
                        const stepNum = i + 1;
                        const isDone = isReleased || stepNum < collab.milestoneIndex;
                        const isCurrent = !isReleased && stepNum === collab.milestoneIndex;
                        return (
                          <div key={stepName} className="space-y-1 text-center">
                            <div
                              className={`h-1.5 rounded-full ${
                                isDone
                                  ? 'bg-emerald-500'
                                  : isCurrent
                                  ? 'bg-[#5125D8]'
                                  : 'bg-slate-200'
                              }`}
                            />
                            <span className="text-[10px] text-slate-500 block truncate">
                              {stepName}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-500">
                    Need revisions? Communicate via direct chat before final sign-off.
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      to="/brand/messages"
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-purple-300 text-slate-600 hover:text-[#5125D8] text-xs font-semibold transition-colors"
                    >
                      Open Chat
                    </Link>
                    {isReleased ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Payout Released
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApprove(collab.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#5125D8] hover:bg-[#431db8] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Approve &amp; Release Payout
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </BrandDashboardLayout>
  );
}

// ══════════════════════════════════════════════════════════════════
// 5. MESSAGES VIEW (/brand/messages)
// ══════════════════════════════════════════════════════════════════
export function BrandMessagesView() {
  const [activeChat, setActiveChat] = useState('c1');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Arohi Patel',
      fromBrand: false,
      text: 'Hi LuxeGlow! I uploaded the 60s Reel draft to the workspace. Let me know what you think of the transition at 0:24!',
      time: '10:45 AM',
    },
    {
      id: 2,
      sender: 'LuxeGlow Paris',
      fromBrand: true,
      text: 'Hi Arohi! Just watched it — the lighting and bottle close-up look stunning! Can you just make sure the promo code LUXE20 stays on screen for an extra 2 seconds at the end?',
      time: '11:15 AM',
    },
    {
      id: 3,
      sender: 'Arohi Patel',
      fromBrand: false,
      text: 'Absolutely! Will update that right now and re-upload the revised cut in 30 minutes.',
      time: '11:20 AM',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setMessages([
      ...messages,
      {
        id: Date.now(),
        sender: 'LuxeGlow Paris',
        fromBrand: true,
        text: inputText,
        time: 'Just now',
      },
    ]);
    setInputText('');
  };

  return (
    <BrandDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#17213B]">Brand Messages</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Coordinate revisions, share creative assets, and clarify briefs directly with your creators.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[550px]">
          {/* Conversation List */}
          <div className="md:col-span-4 border-r border-slate-100 p-4 space-y-2">
            <span className="text-xs font-bold text-slate-400 px-2 block">Direct Chats</span>
            {[
              {
                id: 'c1',
                name: 'Arohi Patel',
                handle: '@arohicreates',
                avatar: '/images/avatar-creator-1.jpg',
                lastMsg: 'Will update that right now...',
                time: '11:20 AM',
                unread: 1,
              },
              {
                id: 'c2',
                name: 'Marcus Vance',
                handle: '@techmarcus',
                avatar: '/images/tech-collab.jpg',
                lastMsg: 'Uploaded unlisted YouTube link',
                time: 'Yesterday',
                unread: 0,
              },
              {
                id: 'c3',
                name: 'Elena Rostova',
                handle: '@elena_glow',
                avatar: '/images/avatar-creator-2.jpg',
                lastMsg: 'Color swatches ready for review',
                time: '2d ago',
                unread: 0,
              },
            ].map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition-all ${
                  activeChat === chat.id
                    ? 'bg-purple-50/70 border border-purple-200 text-[#17213B]'
                    : 'hover:bg-slate-50 border border-transparent text-slate-600'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-[#17213B] block truncate">
                      {chat.name}
                    </span>
                    <span className="text-[11px] text-slate-400 block truncate">{chat.lastMsg}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block">{chat.time}</span>
                  {chat.unread > 0 && (
                    <span className="inline-block w-2 h-2 rounded-full bg-[#5125D8] mt-1" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Chat Window */}
          <div className="md:col-span-8 flex flex-col justify-between p-4 sm:p-6 bg-[#FBFBFE]">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src="/images/avatar-creator-1.jpg"
                  alt="Arohi Patel"
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <h3 className="text-sm font-bold text-[#17213B]">Arohi Patel</h3>
                  <span className="text-xs text-emerald-600 font-semibold">Active now • Verified Creator</span>
                </div>
              </div>
              <Link
                to="/brand/collaborations"
                className="text-xs font-semibold text-[#5125D8] hover:underline"
              >
                View Deliverables
              </Link>
            </div>

            {/* Messages Feed */}
            <div className="space-y-4 py-4 overflow-y-auto max-h-[380px]">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.fromBrand ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                      m.fromBrand
                        ? 'bg-[#5125D8] text-white rounded-br-xs'
                        : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-xs shadow-2xs'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">{m.time}</span>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <input
                type="text"
                placeholder="Type your message or revision notes..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-white border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:border-[#5125D8]"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-[#5125D8] hover:bg-[#431db8] text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </BrandDashboardLayout>
  );
}

// ══════════════════════════════════════════════════════════════════
// 6. ESCROW & WALLET VIEW (/brand/escrow)
// ══════════════════════════════════════════════════════════════════
export function BrandEscrowView() {
  const [depositSuccess, setDepositSuccess] = useState(false);

  return (
    <BrandDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#17213B]">Brand Escrow &amp; Wallet</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Deposit funds, track escrow milestones, and download GST/VAT compliant invoices.
          </p>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <span className="text-xs text-slate-500 font-medium">Secured In Escrow Vault</span>
            <span className="text-2xl font-extrabold text-[#17213B] block">$12,450.00</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Protected
            </span>
          </div>
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <span className="text-xs text-slate-500 font-medium">Under Review Milestones</span>
            <span className="text-2xl font-extrabold text-amber-600 block">$3,200.00</span>
            <span className="text-xs text-slate-400">3 deliverables pending sign-off</span>
          </div>
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <span className="text-xs text-slate-500 font-medium">Released This Quarter</span>
            <span className="text-2xl font-extrabold text-[#5125D8] block">$18,900.00</span>
            <span className="text-xs text-slate-400">To 12 verified creators</span>
          </div>
        </div>

        {/* Deposit Funds Quick Action */}
        <div className="p-5 rounded-3xl bg-purple-50/60 border border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#17213B]">Need to top up your campaign budget?</h3>
            <p className="text-xs text-slate-600">
              Deposit balance using Corporate Card, Wire Transfer, or Stripe. Zero deposit fees on 2BeCollab.
            </p>
          </div>
          <button
            onClick={() => {
              setDepositSuccess(true);
              setTimeout(() => setDepositSuccess(false), 2000);
            }}
            className="px-4 py-2 rounded-xl bg-[#5125D8] hover:bg-[#431db8] text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
          >
            {depositSuccess ? '✓ Deposit Successful' : '+ Top Up Balance'}
          </button>
        </div>

        {/* Transaction History Ledger */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#17213B]">Escrow Ledger &amp; Invoices</h3>
            <span className="text-xs text-slate-400">Showing last 4 transactions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-medium">
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Campaign / Beneficiary</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3.5">Sep 22, 2026</td>
                  <td className="py-3.5">
                    <strong>Hydrating Serum Reel</strong> — Arohi Patel
                  </td>
                  <td className="py-3.5">Escrow Locked</td>
                  <td className="py-3.5 font-bold">$450.00</td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">
                      Secured In Escrow
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button className="text-[#5125D8] hover:underline font-semibold flex items-center gap-1 justify-end ml-auto">
                      <Download className="w-3 h-3" /> PDF
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5">Sep 20, 2026</td>
                  <td className="py-3.5">
                    <strong>Velvet Lipstick Swatches</strong> — Elena Rostova
                  </td>
                  <td className="py-3.5">Milestone Release</td>
                  <td className="py-3.5 font-bold">$350.00</td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                      Paid
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button className="text-[#5125D8] hover:underline font-semibold flex items-center gap-1 justify-end ml-auto">
                      <Download className="w-3 h-3" /> PDF
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5">Sep 15, 2026</td>
                  <td className="py-3.5">
                    <strong>Deposit from Corporate Card</strong> (•••• 4022)
                  </td>
                  <td className="py-3.5">Wallet Deposit</td>
                  <td className="py-3.5 font-bold text-emerald-600">+$5,000.00</td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                      Completed
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button className="text-[#5125D8] hover:underline font-semibold flex items-center gap-1 justify-end ml-auto">
                      <Download className="w-3 h-3" /> Receipt
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </BrandDashboardLayout>
  );
}

// ══════════════════════════════════════════════════════════════════
// 7. ANALYTICS & ROI VIEW (/brand/analytics)
// ══════════════════════════════════════════════════════════════════
export function BrandAnalyticsView() {
  return (
    <BrandDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#17213B]">Campaign Analytics &amp; ROI</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time reach, engagement rates, and conversion return on ad spend across all sponsored creator posts.
          </p>
        </div>

        {/* 4 Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Aggregate Impressions</span>
            <span className="text-2xl font-extrabold text-[#17213B] block">1,420,800</span>
            <span className="text-[11px] text-emerald-600 font-semibold">+18.4% month-over-month</span>
          </div>
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Avg Engagement Rate</span>
            <span className="text-2xl font-extrabold text-[#17213B] block">4.82%</span>
            <span className="text-[11px] text-emerald-600 font-semibold">2.1x industry benchmark</span>
          </div>
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Cost Per View (CPV)</span>
            <span className="text-2xl font-extrabold text-[#17213B] block">$0.014</span>
            <span className="text-[11px] text-emerald-600 font-semibold">-22% cost optimization</span>
          </div>
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Overall ROAS</span>
            <span className="text-2xl font-extrabold text-[#5125D8] block">3.42x</span>
            <span className="text-[11px] text-emerald-600 font-semibold">High conversion efficiency</span>
          </div>
        </div>

        {/* Top Performing Creators */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#17213B]">Top Performing Creator Leaderboard</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-medium">
                  <th className="pb-3">Creator</th>
                  <th className="pb-3">Campaign</th>
                  <th className="pb-3">Platform</th>
                  <th className="pb-3">Views Delivered</th>
                  <th className="pb-3">Engagement</th>
                  <th className="pb-3 text-right">Calculated ROAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3.5 flex items-center gap-2.5">
                    <img
                      src="/images/avatar-creator-1.jpg"
                      alt="Arohi"
                      className="w-8 h-8 rounded-xl object-cover"
                    />
                    <div>
                      <strong className="block text-slate-900">Arohi Patel</strong>
                      <span className="text-[10px] text-slate-400">@arohicreates</span>
                    </div>
                  </td>
                  <td className="py-3.5 font-medium">Hydrating Serum</td>
                  <td className="py-3.5">Instagram Reel</td>
                  <td className="py-3.5 font-bold">142,500</td>
                  <td className="py-3.5 text-emerald-600 font-bold">8.4%</td>
                  <td className="py-3.5 text-right font-extrabold text-[#5125D8]">4.1x</td>
                </tr>
                <tr>
                  <td className="py-3.5 flex items-center gap-2.5">
                    <img
                      src="/images/tech-collab.jpg"
                      alt="Marcus"
                      className="w-8 h-8 rounded-xl object-cover"
                    />
                    <div>
                      <strong className="block text-slate-900">Marcus Vance</strong>
                      <span className="text-[10px] text-slate-400">@techmarcus</span>
                    </div>
                  </td>
                  <td className="py-3.5 font-medium">ANC Headphone Feature</td>
                  <td className="py-3.5">YouTube Video</td>
                  <td className="py-3.5 font-bold">88,200</td>
                  <td className="py-3.5 text-emerald-600 font-bold">6.1%</td>
                  <td className="py-3.5 text-right font-extrabold text-[#5125D8]">3.2x</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </BrandDashboardLayout>
  );
}

// ══════════════════════════════════════════════════════════════════
// 8. COMPANY PROFILE VIEW (/brand/profile)
// ══════════════════════════════════════════════════════════════════
export function BrandProfileView() {
  const { user } = useAuthStore();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [companyName, setCompanyName] = useState(user?.fullName || 'LuxeGlow Paris');
  const [industry, setIndustry] = useState('Beauty, Cosmetics & Personal Care');
  const [website, setWebsite] = useState('https://luxeglow.com');
  const [headquarters, setHeadquarters] = useState('Paris, France & New York, USA');
  const [bio, setBio] = useState(
    'LuxeGlow creates clean, dermatologist-backed skincare formulated with bio-active botanical ingredients for everyday radiant skin.'
  );
  const [targetAudience, setTargetAudience] = useState('Women aged 18-35 interested in clean beauty and wellness.');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <BrandDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#17213B]">Company Profile</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Keep your brand identity, aesthetics, and campaign guidelines up to date for creators.
            </p>
          </div>
          {savedSuccess && (
            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 self-start sm:self-auto">
              ✓ Changes Saved Successfully
            </span>
          )}
        </div>

        <form onSubmit={handleSave} className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-5">
            <img
              src="/images/avatar-brand-1.jpg"
              alt="Brand Logo"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-200 shadow-sm"
            />
            <div>
              <h3 className="text-base font-bold text-[#17213B]">{companyName}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{industry}</p>
              <button
                type="button"
                className="mt-2 text-xs font-bold text-[#5125D8] hover:underline"
              >
                Change Company Logo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Brand / Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5125D8]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Industry &amp; Niche
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5125D8]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Official Website
              </label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5125D8]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Headquarters Location
              </label>
              <input
                type="text"
                value={headquarters}
                onChange={(e) => setHeadquarters(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5125D8]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Brand Bio &amp; Story (Visible to Creators)
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5125D8] resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Core Target Audience
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5125D8]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#5125D8] hover:bg-[#431db8] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </BrandDashboardLayout>
  );
}

// ══════════════════════════════════════════════════════════════════
// 9. SETTINGS VIEW (/brand/settings)
// ══════════════════════════════════════════════════════════════════
export function BrandSettingsView() {
  const [autoRelease, setAutoRelease] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  return (
    <BrandDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#17213B]">Brand Studio Settings</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your team access, escrow automation rules, and notification preferences.
          </p>
        </div>

        <div className="space-y-5">
          {/* Escrow Rule */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-[#17213B]">
                Auto-Release Escrow After Review Period
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatically release creator payment 5 days after draft submission if no revision is requested.
              </p>
            </div>
            <button
              onClick={() => setAutoRelease(!autoRelease)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                autoRelease ? 'bg-[#5125D8]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                  autoRelease ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Email notifications */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-[#17213B]">Instant Email &amp; In-App Notifications</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Notify team members immediately when a creator applies or submits content for review.
              </p>
            </div>
            <button
              onClick={() => setEmailAlerts(!emailAlerts)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                emailAlerts ? 'bg-[#5125D8]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                  emailAlerts ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Team Members */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#17213B]">Team Members</h3>
                <p className="text-xs text-slate-500">People with access to manage campaigns and approve payouts</p>
              </div>
              <button className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-purple-300 text-xs font-semibold text-[#5125D8] transition-colors">
                + Invite Teammate
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#17213B] block">Sarah Jenkins (You)</span>
                  <span className="text-[11px] text-slate-400">sarah@luxeglow.com • Brand Owner</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[#5125D8] text-[10px] font-bold">
                  Admin
                </span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#17213B] block">Alexandre Mercier</span>
                  <span className="text-[11px] text-slate-400">alex@luxeglow.com • Campaign Manager</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                  Manager
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BrandDashboardLayout>
  );
}
