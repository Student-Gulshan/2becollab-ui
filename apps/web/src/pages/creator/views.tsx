import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { CreatorDashboardLayout } from '@/components/layout/creator-dashboard-layout';
import { SubmitBidModal, CampaignBidTarget } from '@/components/creator/submit-bid-modal';
import { useAuthStore } from '@/stores/auth-store';

// ══════════════════════════════════════════════════════════════════
// 1. CAMPAIGNS VIEW (/creator/campaigns)
// ══════════════════════════════════════════════════════════════════
export function CreatorCampaignsView() {
  const [filter, setFilter] = useState<'ALL' | 'INSTAGRAM' | 'YOUTUBE' | 'TIKTOK'>('ALL');
  const [search, setSearch] = useState('');
  const [bidTarget, setBidTarget] = useState<CampaignBidTarget | null>(null);

  const campaigns = [
    {
      id: 'camp-1',
      title: 'Skincare Routine Campaign',
      brandName: 'The Body Shop',
      budget: '$300 – $500',
      deadline: '7 days left',
      platform: 'Instagram',
      category: 'Beauty & Skincare',
      description: 'Showcase your daily skincare routine using The Body Shop products.',
      img: '/images/skincare-thumb.jpg',
    },
    {
      id: 'camp-2',
      title: 'Product Review Campaign',
      brandName: 'Noise',
      budget: '$500 – $800',
      deadline: '10 days left',
      platform: 'YouTube',
      category: 'Tech & Gadgets',
      description: 'Create a detailed review of Noise smartwatch with real usage experience.',
      img: '/images/tech-collab.jpg',
    },
    {
      id: 'camp-3',
      title: 'Lifestyle & Skincare Reel',
      brandName: 'Mamaearth',
      budget: '$200 – $400',
      deadline: '5 days left',
      platform: 'Instagram',
      category: 'Beauty & Skincare',
      description: 'Share your honest experience with Mamaearth daily skincare products.',
      img: '/images/product-showcase.jpg',
    },
    {
      id: 'camp-4',
      title: 'Fall Winter Streetwear Transition',
      brandName: 'Zara Studio',
      budget: '$800 – $1,200',
      deadline: '12 days left',
      platform: 'TikTok',
      category: 'Fashion & Style',
      description: '3 outfit transitions featuring our latest winter outerwear drop.',
      img: '/images/fashion-collab.jpg',
    },
    {
      id: 'camp-5',
      title: 'Healthy Breakfast Oatmeal Series',
      brandName: 'TrueElements',
      budget: '$350 – $600',
      deadline: '6 days left',
      platform: 'Instagram',
      category: 'Food & Nutrition',
      description: 'Quick 60-second recipe reel using high-protein rolled oats.',
      img: '/images/food-story.jpg',
    },
    {
      id: 'camp-6',
      title: 'Wireless Gaming Earbuds Unboxing',
      brandName: 'Razer',
      budget: '$1,000 – $1,500',
      deadline: '15 days left',
      platform: 'YouTube',
      category: 'Gaming & Tech',
      description: 'Dedicated 5-minute unboxing and latency gaming test video.',
      img: '/images/brand-workspace.jpg',
    },
  ];

  const filtered = campaigns.filter((c) => {
    if (filter === 'INSTAGRAM' && c.platform !== 'Instagram') return false;
    if (filter === 'YOUTUBE' && c.platform !== 'YouTube') return false;
    if (filter === 'TIKTOK' && c.platform !== 'TikTok') return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.brandName.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <CreatorDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#17213B] tracking-tight">Browse Brand Campaigns</h1>
            <p className="text-xs text-slate-500 mt-1">Discover verified brand sponsorships matching your creative niche</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Showing {filtered.length} active briefs</span>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by brand or campaign..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#5125D8] focus:bg-white text-[#17213B]"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {(['ALL', 'INSTAGRAM', 'YOUTUBE', 'TIKTOK'] as const).map((plat) => (
              <button
                key={plat}
                onClick={() => setFilter(plat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filter === plat
                    ? 'bg-[#5125D8] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {plat === 'ALL' ? 'All Platforms' : plat}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="rounded-3xl border border-slate-200/80 p-4 bg-white flex flex-col justify-between hover:border-purple-200 hover:shadow-lg transition-all"
            >
              <div>
                <div className="w-full h-36 rounded-2xl overflow-hidden mb-3 relative bg-slate-100">
                  <img src={c.img} alt={c.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-[#5125D8] text-white text-[10px] font-bold">
                    {c.platform}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#5125D8]">{c.brandName}</span>
                  <span className="text-[10px] font-medium text-slate-400">{c.deadline}</span>
                </div>

                <h3 className="text-sm font-bold text-[#17213B] line-clamp-1 mb-1">{c.title}</h3>
                <span className="inline-block px-2 py-0.5 rounded bg-purple-50 text-[10px] text-[#5125D8] font-semibold mb-2">
                  {c.category}
                </span>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">{c.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Budget</span>
                  <span className="text-sm font-bold text-[#17213B]">{c.budget}</span>
                </div>

                <button
                  onClick={() =>
                    setBidTarget({
                      id: c.id,
                      title: c.title,
                      brandName: c.brandName,
                      budget: c.budget,
                      deadline: c.deadline,
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-[#5125D8] hover:bg-[#431db8] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  Submit Bid
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SubmitBidModal
        isOpen={Boolean(bidTarget)}
        onClose={() => setBidTarget(null)}
        campaign={bidTarget}
      />
    </CreatorDashboardLayout>
  );
}

// ══════════════════════════════════════════════════════════════════
// 2. DISCOVER VIEW (/creator/discover)
// ══════════════════════════════════════════════════════════════════
export function CreatorDiscoverView() {
  const brands = [
    { name: 'Nykaa Beauty', industry: 'Cosmetics & Skincare', collabs: 42, minBudget: '$400', logo: 'N', verified: true },
    { name: 'boAt Lifestyle', industry: 'Audio & Wearables', collabs: 85, minBudget: '$600', logo: 'B', verified: true },
    { name: 'Lenskart Vision', industry: 'Eyewear & Fashion', collabs: 28, minBudget: '$350', logo: 'L', verified: true },
    { name: 'Noise Tech', industry: 'Smartwatches', collabs: 54, minBudget: '$500', logo: 'N', verified: true },
    { name: 'Mamaearth', industry: 'Natural Personal Care', collabs: 67, minBudget: '$300', logo: 'M', verified: true },
    { name: 'The Body Shop India', industry: 'Sustainable Beauty', collabs: 31, minBudget: '$450', logo: 'T', verified: true },
  ];

  return (
    <CreatorDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#17213B] tracking-tight">Discover Top Brands</h1>
          <p className="text-xs text-slate-500 mt-1">Connect with verified sponsor brands actively scouting creator partnerships</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {brands.map((b, i) => (
            <div key={i} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:border-purple-200 hover:shadow-md transition-all space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#5125D8] font-bold text-lg flex items-center justify-center">
                    {b.logo}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#17213B] flex items-center gap-1">
                      {b.name}
                      <ShieldCheck className="w-3.5 h-3.5 text-[#5125D8]" />
                    </h3>
                    <p className="text-xs text-slate-500">{b.industry}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                <div className="p-2.5 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-slate-400 block">Completed Deals</span>
                  <span className="font-bold text-[#17213B]">{b.collabs} Collabs</span>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-50/60">
                  <span className="text-[10px] text-slate-400 block">Typical Offer</span>
                  <span className="font-bold text-[#5125D8]">From {b.minBudget}</span>
                </div>
              </div>

              <Link
                to="/creator/campaigns"
                className="w-full block text-center py-2 rounded-xl bg-[#5125D8] hover:bg-[#431db8] text-white text-xs font-semibold transition-colors"
              >
                View Brand Briefs
              </Link>
            </div>
          ))}
        </div>
      </div>
    </CreatorDashboardLayout>
  );
}

// ══════════════════════════════════════════════════════════════════
// 3. MY BIDS VIEW (/creator/bids)
// ══════════════════════════════════════════════════════════════════
export function CreatorBidsView() {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED'>('ALL');

  const bids = [
    { id: 1, brand: 'Nykaa', campaign: 'Festive Makeup Look Reel', rate: '$450', date: '2 days ago', status: 'UNDER_REVIEW', platform: 'Instagram Reels' },
    { id: 2, brand: 'boAt', campaign: 'New Launch Noise ANC Review', rate: '$600', date: '5 days ago', status: 'ACCEPTED', platform: 'YouTube Dedicated' },
    { id: 3, brand: 'Dabur', campaign: 'Health & Wellness Lifestyle Video', rate: '$300', date: '1 week ago', status: 'REJECTED', platform: 'Instagram Video' },
    { id: 4, brand: 'Lenskart', campaign: 'Frame Styling & Haul Reel', rate: '$350', date: '1 week ago', status: 'UNDER_REVIEW', platform: 'Instagram Reels' },
    { id: 5, brand: 'UrbanWear', campaign: 'Autumn Outerwear Lookbook', rate: '$400', date: '2 weeks ago', status: 'ACCEPTED', platform: 'TikTok' },
  ];

  const filtered = bids.filter((b) => (activeFilter === 'ALL' ? true : b.status === activeFilter));

  return (
    <CreatorDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#17213B] tracking-tight">My Proposals & Bids</h1>
            <p className="text-xs text-slate-500 mt-1">Track real-time responses and negotiate campaign compensations</p>
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200/80 shadow-xs">
            {(['ALL', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeFilter === tab
                    ? 'bg-[#5125D8] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab === 'ALL' ? 'All (5)' : tab === 'UNDER_REVIEW' ? 'Under Review (2)' : tab === 'ACCEPTED' ? 'Accepted (2)' : 'Rejected (1)'}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-2xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#5125D8]">{b.brand}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500 font-medium">{b.platform}</span>
                </div>
                <h3 className="text-sm font-bold text-[#17213B]">{b.campaign}</h3>
                <span className="text-[11px] text-slate-400 block">Submitted {b.date}</span>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-5">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 block font-medium">Your Bid Fee</span>
                  <span className="text-base font-bold text-[#17213B]">{b.rate}</span>
                </div>

                <div>
                  {b.status === 'UNDER_REVIEW' && (
                    <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                      Under Review
                    </span>
                  )}
                  {b.status === 'ACCEPTED' && (
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                      Accepted
                    </span>
                  )}
                  {b.status === 'REJECTED' && (
                    <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                      Rejected
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CreatorDashboardLayout>
  );
}

// ══════════════════════════════════════════════════════════════════
// 4. ACTIVE CAMPAIGNS VIEW (/creator/active)
// ══════════════════════════════════════════════════════════════════
export function CreatorActiveView() {
  return (
    <CreatorDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#17213B] tracking-tight">Current Active Collaborations</h1>
          <p className="text-xs text-slate-500 mt-1">Manage running milestones, upload deliverables, and track escrow payouts</p>
        </div>

        <div className="space-y-5">
          {/* Active Collab 1 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  <img src="/images/skincare-thumb.jpg" alt="LuxeGlow" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#5125D8]">LuxeGlow Paris</span>
                  <h3 className="text-base font-bold text-[#17213B]">Skincare Product Review & Reel</h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  $600 Escrow Secured
                </span>
              </div>
            </div>

            {/* Milestones Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#17213B]">Milestone Progress: 3 of 5 Completed</span>
                <span className="text-[#5125D8] font-bold">60%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#5125D8] h-full rounded-full" style={{ width: '60%' }} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-400 block text-[10px]">Current Stage</span>
                <span className="font-bold text-[#17213B]">Final Video Review</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-400 block text-[10px]">Content Deadline</span>
                <span className="font-bold text-amber-600">Oct 16, 2026 (5 days left)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-400 block text-[10px]">Brand Reviewer</span>
                <span className="font-bold text-[#17213B]">Sophie Laurent</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Link
                to="/creator/messages"
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Chat with Brand
              </Link>
              <button className="px-4 py-2 rounded-xl bg-[#5125D8] hover:bg-[#431db8] text-white text-xs font-semibold transition-colors">
                Upload New Draft
              </button>
            </div>
          </div>

          {/* Active Collab 2 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  <img src="/images/fashion-collab.jpg" alt="UrbanWear" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#5125D8]">UrbanWear</span>
                  <h3 className="text-base font-bold text-[#17213B]">Fall Collection Lookbook</h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  $400 Escrow Secured
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#17213B]">Milestone Progress: 2 of 4 Completed</span>
                <span className="text-[#5125D8] font-bold">50%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#5125D8] h-full rounded-full" style={{ width: '50%' }} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-400 block text-[10px]">Current Stage</span>
                <span className="font-bold text-[#17213B]">Video Filming</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-400 block text-[10px]">Content Deadline</span>
                <span className="font-bold text-slate-700">Oct 20, 2026 (8 days left)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-400 block text-[10px]">Platform</span>
                <span className="font-bold text-[#17213B]">Instagram + TikTok</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Link
                to="/creator/messages"
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Chat with Brand
              </Link>
              <button className="px-4 py-2 rounded-xl bg-[#5125D8] hover:bg-[#431db8] text-white text-xs font-semibold transition-colors">
                Submit Deliverable
              </button>
            </div>
          </div>
        </div>
      </div>
    </CreatorDashboardLayout>
  );
}

// ══════════════════════════════════════════════════════════════════
// 5. MESSAGES VIEW (/creator/messages)
// ══════════════════════════════════════════════════════════════════
export function CreatorMessagesView() {
  const [activeChat, setActiveChat] = useState(0);
  const [messageText, setMessageText] = useState('');

  const chats = [
    {
      id: 1,
      name: 'LuxeGlow Paris',
      campaign: 'Skincare Product Review',
      unread: true,
      lastMsg: 'The color grading looks fantastic! Could you add the discount code link in the description?',
      time: '10:45 AM',
      avatar: '/images/skincare-thumb.jpg',
    },
    {
      id: 2,
      name: 'Noise Wearables',
      campaign: 'Smartwatch Review',
      unread: true,
      lastMsg: 'We have approved your bid! Let us know your shipping address for the review sample.',
      time: 'Yesterday',
      avatar: '/images/tech-collab.jpg',
    },
    {
      id: 3,
      name: 'UrbanWear Official',
      campaign: 'Fall Lookbook',
      unread: false,
      lastMsg: 'Thank you for the quick turnaround on the script.',
      time: '3 days ago',
      avatar: '/images/fashion-collab.jpg',
    },
  ];

  return (
    <CreatorDashboardLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#17213B] tracking-tight">Direct Brand Messages</h1>
          <p className="text-xs text-slate-500 mt-1">Communicate with brands, discuss deliverables, and align on revisions</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs grid grid-cols-1 md:grid-cols-12 min-h-[550px] overflow-hidden">
          {/* Chat List (4 cols) */}
          <div className="md:col-span-4 border-r border-slate-200/80 p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              {chats.map((c, i) => (
                <div
                  key={c.id}
                  onClick={() => setActiveChat(i)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3 ${
                    activeChat === i ? 'bg-purple-50/80 border border-purple-200' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="text-xs font-bold text-[#17213B] truncate">{c.name}</h4>
                      <span className="text-[10px] text-slate-400">{c.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{c.lastMsg}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Chat Conversation (8 cols) */}
          <div className="md:col-span-8 flex flex-col justify-between p-6 bg-[#FAFAFC]">
            {(() => {
              const currentChat = chats[activeChat] || chats[0]!;
              return (
                <>
                  {/* Chat Header */}
                  <div className="pb-4 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100">
                        <img src={currentChat.avatar} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#17213B]">{currentChat.name}</h3>
                        <span className="text-xs text-[#5125D8] font-semibold">{currentChat.campaign}</span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                      Active Deal
                    </span>
                  </div>

                  {/* Messages Body */}
                  <div className="py-6 space-y-4 flex-1">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0">
                        <img src={currentChat.avatar} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="max-w-md p-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-[#17213B] shadow-xs">
                        {currentChat.lastMsg}
                      </div>
                    </div>

                    <div className="flex items-start justify-end gap-3">
                      <div className="max-w-md p-3.5 rounded-2xl bg-[#5125D8] text-white text-xs shadow-xs">
                        Hi! Yes, absolutely. I have added the tracking link into the caption and tagged your handle. Publishing scheduled for tomorrow!
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}

            {/* Input Footer */}
            <div className="pt-4 border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1 px-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#5125D8]"
              />
              <button className="px-4 py-2.5 rounded-xl bg-[#5125D8] text-white text-xs font-semibold hover:bg-[#431db8] transition-colors flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </CreatorDashboardLayout>
  );
}

// ══════════════════════════════════════════════════════════════════
// 6. EARNINGS VIEW (/creator/earnings)
// ══════════════════════════════════════════════════════════════════
export function CreatorEarningsView() {
  return (
    <CreatorDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#17213B] tracking-tight">Earnings & Payout Ledger</h1>
          <p className="text-xs text-slate-500 mt-1">Escrow held balances, cleared earnings, and instant bank transfers</p>
        </div>

        {/* 3 Metric Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-400">AVAILABLE TO WITHDRAW</span>
            <div className="text-3xl font-black text-[#5125D8]">$920.00</div>
            <button className="w-full mt-3 py-2 rounded-xl bg-[#5125D8] hover:bg-[#431db8] text-white text-xs font-bold transition-colors">
              Withdraw to Bank
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-400">HELD IN ESCROW</span>
            <div className="text-3xl font-black text-[#17213B]">$320.00</div>
            <p className="text-xs text-slate-500 pt-3">Releases upon brand deliverable review</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-400">LIFETIME EARNINGS</span>
            <div className="text-3xl font-black text-[#17213B]">$1,240.00</div>
            <p className="text-xs text-slate-500 pt-3">From 4 completed collaborations</p>
          </div>
        </div>

        {/* Transaction History Table */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#17213B]">Payout History</h3>
          <div className="space-y-2">
            {[
              { brand: 'LuxeGlow Paris', date: 'Apr 25, 2026', amount: '+$250.00', status: 'Completed', method: 'Direct Bank Transfer' },
              { brand: 'UrbanWear', date: 'Apr 18, 2026', amount: '+$180.00', status: 'Completed', method: 'UPI / Razorpay' },
              { brand: 'The Body Shop', date: 'Apr 10, 2026', amount: '+$320.00', status: 'Completed', method: 'Direct Bank Transfer' },
              { brand: 'Noise Tech', date: 'Mar 28, 2026', amount: '+$490.00', status: 'Completed', method: 'Direct Bank Transfer' },
            ].map((p, i) => (
              <div key={i} className="p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <h4 className="text-xs font-bold text-[#17213B]">{p.brand}</h4>
                  <span className="text-[10px] text-slate-400">{p.date} • {p.method}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600 block">{p.amount}</span>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CreatorDashboardLayout>
  );
}

// ══════════════════════════════════════════════════════════════════
// 7. ANALYTICS VIEW (/creator/analytics)
// ══════════════════════════════════════════════════════════════════
export function CreatorAnalyticsView() {
  return (
    <CreatorDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#17213B] tracking-tight">Creator Analytics & Reach</h1>
          <p className="text-xs text-slate-500 mt-1">Profile views, sponsor conversion rates, and audience match scores</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <span className="text-xs text-slate-500">Brand Profile Visits</span>
            <div className="text-2xl font-extrabold text-[#17213B] mt-1">1,420</div>
            <span className="text-[10px] text-emerald-600 font-bold">+28% vs last month</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <span className="text-xs text-slate-500">Proposal Win Rate</span>
            <div className="text-2xl font-extrabold text-[#5125D8] mt-1">75%</div>
            <span className="text-[10px] text-slate-400 font-medium">3 of 4 bids accepted</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <span className="text-xs text-slate-500">Average Rating</span>
            <div className="text-2xl font-extrabold text-[#17213B] mt-1">4.8 ★</div>
            <span className="text-[10px] text-slate-400 font-medium">12 brand reviews</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <span className="text-xs text-slate-500">On-Time Delivery</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">100%</div>
            <span className="text-[10px] text-slate-400 font-medium">Zero missed deadlines</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-[#17213B]">Audience Demographics</h3>
          <p className="text-xs text-slate-500">Top follower locations: India (68%), US (14%), UK (8%), UAE (5%).</p>
        </div>
      </div>
    </CreatorDashboardLayout>
  );
}

// ══════════════════════════════════════════════════════════════════
// 8. PROFILE VIEW (/creator/profile) - FULL EDITING & PREVIEW
// ══════════════════════════════════════════════════════════════════
const ALL_AVAILABLE_NICHES = [
  'Tech & Gadgets',
  'Beauty & Skincare',
  'Fashion & Style',
  'Fitness & Wellness',
  'Travel & Adventure',
  'Food & Cooking',
  'Gaming & Esports',
  'Finance & Crypto',
  'Lifestyle & Vlogs',
  'Education & Career',
];

export function CreatorProfileView() {
  const { user, setUser } = useAuthStore();
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');

  // Form State
  const [fullName, setFullName] = useState(user?.fullName || 'Arohi Sharma');
  const [headline, setHeadline] = useState(
    'Beauty & Skincare, Tech & Lifestyle Creator | 150K+ Audience'
  );
  const [bio, setBio] = useState(
    'Content creator passionate about authentic product reviews, aesthetic video storytelling, and honest daily routine reels. Working with top consumer, beauty, and tech brands to drive high engagement.'
  );
  const [location, setLocation] = useState('New Delhi, India');
  const [languages, setLanguages] = useState('English, Hindi');
  const [baseRate, setBaseRate] = useState('350');
  const [websiteUrl, setWebsiteUrl] = useState('https://drive.google.com/media-kit/arohi');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '/images/avatar-creator-1.jpg');

  // Social handles
  const [instagram, setInstagram] = useState('@arohi.creates');
  const [youtube, setYoutube] = useState('youtube.com/@arohisharma');
  const [tiktok, setTiktok] = useState('@arohi_vlogs');
  const [twitter, setTwitter] = useState('@arohisharma');

  // Selected niches
  const [selectedNiches, setSelectedNiches] = useState<string[]>([
    'Beauty & Skincare',
    'Tech & Gadgets',
    'Lifestyle & Vlogs',
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleNiche = (niche: string) => {
    if (selectedNiches.includes(niche)) {
      setSelectedNiches(selectedNiches.filter((n) => n !== niche));
    } else {
      if (selectedNiches.length < 5) {
        setSelectedNiches([...selectedNiches, niche]);
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    setTimeout(() => {
      if (user) {
        setUser({
          ...user,
          fullName,
          avatarUrl,
        });
      }
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    }, 600);
  };

  return (
    <CreatorDashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header & Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#17213B] tracking-tight">
              Creator Profile & Media Kit
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage your profile details, creative niches, rates, and connected socials
            </p>
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200/80 shadow-xs">
            <button
              type="button"
              onClick={() => setMode('edit')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mode === 'edit'
                  ? 'bg-[#5125D8] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Edit Profile
            </button>
            <button
              type="button"
              onClick={() => setMode('preview')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mode === 'preview'
                  ? 'bg-[#5125D8] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Brand Preview
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Profile updated successfully! All changes are now live on your media kit.
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            MODE 1: EDIT FORM
            ══════════════════════════════════════════════════════════ */}
        {mode === 'edit' && (
          <form onSubmit={handleSave} className="space-y-6">
            {/* 1. Basic Info & Photo */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
              <h3 className="text-sm font-bold text-[#17213B] flex items-center gap-2">
                <span>Personal Information & Photo</span>
              </h3>

              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="relative group shrink-0">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-purple-100 border-2 border-[#5125D8] shadow-sm">
                    <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                  </div>
                  <label className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#5125D8] text-white flex items-center justify-center cursor-pointer shadow hover:scale-105 transition-transform">
                    <span className="text-xs">📷</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setAvatarUrl(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                  <div>
                    <label className="block text-xs font-bold text-[#17213B] mb-1">
                      Display / Creator Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#5125D8] font-medium text-[#17213B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#17213B] mb-1">
                      Primary Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. New Delhi, India"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#5125D8] text-[#17213B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#17213B] mb-1">
                      Languages Spoken
                    </label>
                    <input
                      type="text"
                      value={languages}
                      onChange={(e) => setLanguages(e.target.value)}
                      placeholder="e.g. English, Hindi"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#5125D8] text-[#17213B]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17213B] mb-1">
                  Professional Headline / Tagline
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Beauty & Skincare Reviewer | 150K+ Audience"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#5125D8] text-[#17213B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17213B] mb-1">
                  About Me / Creator Bio
                </label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell brands about your storytelling style, audience demographics, and what collabs you love..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#5125D8] resize-none text-[#17213B] leading-relaxed"
                />
              </div>
            </div>

            {/* 2. Content Niches */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#17213B]">Content Niches (Pick up to 5)</h3>
                <p className="text-xs text-slate-500">Brands filter creators by niche when creating campaign targets</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {ALL_AVAILABLE_NICHES.map((niche) => {
                  const isSelected = selectedNiches.includes(niche);
                  return (
                    <button
                      type="button"
                      key={niche}
                      onClick={() => toggleNiche(niche)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-[#5125D8] text-white shadow-xs scale-[1.02]'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {niche}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Social Handles & Rates */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#17213B]">Social Channels & Collaboration Rates</h3>
                <p className="text-xs text-slate-500">Connect your platform profiles to verify audience metrics</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#17213B] mb-1">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@yourhandle"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#5125D8] text-[#17213B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17213B] mb-1">
                    YouTube Channel URL
                  </label>
                  <input
                    type="text"
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    placeholder="youtube.com/@yourchannel"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#5125D8] text-[#17213B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17213B] mb-1">
                    TikTok Handle
                  </label>
                  <input
                    type="text"
                    value={tiktok}
                    onChange={(e) => setTiktok(e.target.value)}
                    placeholder="@yourtiktok"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#5125D8] text-[#17213B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17213B] mb-1">
                    Twitter / X Handle
                  </label>
                  <input
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="@your_x_handle"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#5125D8] text-[#17213B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17213B] mb-1">
                    Starting Collab Rate (USD)
                  </label>
                  <input
                    type="number"
                    value={baseRate}
                    onChange={(e) => setBaseRate(e.target.value)}
                    placeholder="350"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#5125D8] font-bold text-[#17213B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17213B] mb-1">
                    Portfolio / Media Kit URL
                  </label>
                  <input
                    type="text"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#5125D8] text-[#17213B]"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMode('preview')}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Preview Profile
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-[#5125D8] hover:bg-[#431db8] text-white text-xs font-bold shadow-md shadow-[#5125D8]/20 transition-all disabled:opacity-50"
              >
                {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        )}

        {/* ══════════════════════════════════════════════════════════
            MODE 2: BRAND PREVIEW
            ══════════════════════════════════════════════════════════ */}
        {mode === 'preview' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-purple-100 border-2 border-[#5125D8] shrink-0">
                  <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#17213B] flex items-center gap-2">
                    {fullName}
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                      Verified Creator
                    </span>
                  </h2>
                  <p className="text-xs text-[#5125D8] font-bold mt-0.5">{headline}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{location} • 150K+ Audience Reach</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-medium">Starting Collab Rate</span>
                <span className="text-xl font-black text-[#5125D8]">${baseRate}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#17213B] uppercase tracking-wider">About the Creator</h4>
              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{bio}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#17213B] uppercase tracking-wider">Categories & Niches</h4>
              <div className="flex flex-wrap gap-2">
                {selectedNiches.map((n) => (
                  <span key={n} className="px-2.5 py-1 rounded-xl bg-purple-50 text-[#5125D8] text-xs font-semibold">
                    {n}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#17213B] uppercase tracking-wider">Connected Channels</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-pink-50/60 border border-pink-100">
                  <span className="text-[10px] text-pink-700 font-bold block">Instagram</span>
                  <span className="text-xs font-bold text-[#17213B]">{instagram}</span>
                </div>
                <div className="p-3 rounded-2xl bg-red-50/60 border border-red-100">
                  <span className="text-[10px] text-red-700 font-bold block">YouTube</span>
                  <span className="text-xs font-bold text-[#17213B]">{youtube}</span>
                </div>
                <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100">
                  <span className="text-[10px] text-purple-700 font-bold block">TikTok</span>
                  <span className="text-xs font-bold text-[#17213B]">{tiktok}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-700 font-bold block">Twitter / X</span>
                  <span className="text-xs font-bold text-[#17213B]">{twitter}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setMode('edit')}
                className="px-5 py-2 rounded-xl bg-[#5125D8] hover:bg-[#431db8] text-white text-xs font-bold transition-colors"
              >
                Edit Details
              </button>
            </div>
          </div>
        )}
      </div>
    </CreatorDashboardLayout>
  );
}

// ══════════════════════════════════════════════════════════════════
// 9. SETTINGS VIEW (/creator/settings)
// ══════════════════════════════════════════════════════════════════
export function CreatorSettingsView() {
  return (
    <CreatorDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#17213B] tracking-tight">Account Settings</h1>
          <p className="text-xs text-slate-500 mt-1">Manage notifications, payouts, security, and preferences</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 max-w-2xl">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#17213B]">Notification Preferences</h3>
            <label className="flex items-center gap-3 text-xs text-slate-700 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#5125D8]" />
              <span>Email me when a brand responds to my bid or offers a collaboration</span>
            </label>
            <label className="flex items-center gap-3 text-xs text-slate-700 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#5125D8]" />
              <span>Notify me of milestone approvals and escrow payment releases</span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button className="px-5 py-2 rounded-xl bg-[#5125D8] text-white text-xs font-semibold hover:bg-[#431db8] transition-colors">
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </CreatorDashboardLayout>
  );
}
