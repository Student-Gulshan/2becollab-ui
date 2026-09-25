import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Flame,
  FileText,
  Plus,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Eye,
  Play,
  TrendingUp,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { BrandDashboardLayout } from '@/components/layout/brand-dashboard-layout';

export function BrandDashboardPage() {
  const { user } = useAuthStore();
  const [reviewModalData, setReviewModalData] = useState<{
    id: string;
    creator: string;
    campaign: string;
    asset: string;
    type: string;
    amount: string;
  } | null>(null);
  const [approvedList, setApprovedList] = useState<string[]>([]);

  const brandName = user?.fullName || 'LuxeGlow Paris';

  const handleApproveDeliverable = (id: string) => {
    setApprovedList((prev) => [...prev, id]);
    setReviewModalData(null);
  };

  return (
    <BrandDashboardLayout>
      <div className="space-y-6">
        {/* ════════════════════════════════════════════════════════════
            ROW 1: HERO CARDS (Welcome Banner + Escrow Wallet Card)
            ════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Welcome Banner Card (approx 65% width) */}
          <div className="lg:col-span-8 bg-gradient-to-r from-purple-50/90 via-purple-50/40 to-indigo-50/60 border border-purple-100 rounded-3xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between shadow-xs">
            <div className="max-w-md z-10 space-y-2">
              <span className="text-xs font-bold text-[#5125D8] tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#5125D8]" />
                Brand Studio • {brandName}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17213B] tracking-tight">
                Scale Your Brand With Creators
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                Post briefs, review incoming creator proposals, track live deliverables, and release secure escrow milestones — all in one centralized hub.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                <Link
                  to="/brand/campaigns"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5125D8] hover:bg-[#431db8] text-white text-xs font-semibold shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Create Campaign Brief
                </Link>
                <Link
                  to="/brand/creators"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition-all shadow-2xs"
                >
                  Discover Creators
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Ambient Illustration Image on Right */}
            <div className="absolute right-4 -bottom-4 hidden sm:block w-48 lg:w-56 h-auto pointer-events-none select-none opacity-95">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-purple-100/50 to-transparent rounded-full filter blur-xl" />
                <img
                  src="/images/for-brands-hero.jpg"
                  alt="Brand Workspace"
                  className="w-full h-44 object-cover object-top rounded-2xl shadow-lg border-2 border-white/80"
                />
              </div>
            </div>
          </div>

          {/* Escrow Protected Wallet Card (approx 35% width) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between shadow-xs relative">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#5125D8] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#17213B]">Brand Escrow Vault</h3>
                    <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> 100% Protected
                    </p>
                  </div>
                </div>
                <Link
                  to="/brand/escrow"
                  className="text-xs font-bold text-[#5125D8] hover:underline"
                >
                  View Wallet
                </Link>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Funds are held in neutral escrow and only released to creators after you approve the submitted content.
              </p>

              {/* Balance Breakdown */}
              <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100/80 space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Secured In Escrow</span>
                  <span className="text-base font-extrabold text-[#17213B]">$12,450.00</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-purple-100/60">
                  <span className="text-slate-500">Awaiting Your Approval</span>
                  <span className="font-semibold text-amber-600">$3,200.00 (3 deliverables)</span>
                </div>
              </div>
            </div>

            <Link
              to="/brand/escrow"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5"
            >
              Deposit Funds & Invoices
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════
            ROW 2: 4 KEY METRIC CARDS
            ════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Active Campaigns */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-purple-200 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500">Active Campaigns</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5125D8] flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#17213B]">3 Live</span>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                +1 new
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">2 scheduled for next month</p>
          </div>

          {/* Card 2: Proposals & Bids */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-purple-200 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500">Creator Proposals</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#17213B]">18 Proposals</span>
              <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                6 new today
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">From vetted creators</p>
          </div>

          {/* Card 3: Deliverables In Progress */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-purple-200 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500">Milestones Underway</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#17213B]">8 Active</span>
              <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                3 for review
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Content drafts ready</p>
          </div>

          {/* Card 4: Total Audience Reach */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-purple-200 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500">Total Campaign Reach</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#17213B]">1.4M+</span>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                4.8% Eng.
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">3.4x average ROAS</p>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════
            ROW 3: MAIN 2-COLUMN SECTION (65% / 35%)
            ════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ──────────────────────────────────────────────────────────
              LEFT COLUMN (65% width): Deliverables Review, Live Campaigns, Analytics
              ────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. DELIVERABLES AWAITING REVIEW */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <h2 className="text-base font-bold text-[#17213B]">
                    Deliverables Awaiting Review
                  </h2>
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
                    Action Needed
                  </span>
                </div>
                <Link
                  to="/brand/collaborations"
                  className="text-xs font-semibold text-[#5125D8] hover:underline flex items-center gap-1"
                >
                  View All (8)
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <p className="text-xs text-slate-500 mb-4">
                Creators have submitted these final content drafts. Preview each asset and click &quot;Approve &amp; Release Milestone&quot; to transfer the escrow payment.
              </p>

              <div className="space-y-3.5">
                {[
                  {
                    id: 'deliv-1',
                    creator: 'Arohi Patel',
                    handle: '@arohicreates',
                    avatar: '/images/avatar-creator-1.jpg',
                    campaign: 'Hydrating Serum Morning Routine',
                    platform: 'Instagram Reel (60s)',
                    duration: '0:58 min',
                    submitted: '2 hours ago',
                    amount: '$450.00',
                    asset: '/images/skincare-thumb.jpg',
                  },
                  {
                    id: 'deliv-2',
                    creator: 'Elena Rostova',
                    handle: '@elena_glow',
                    avatar: '/images/avatar-creator-1.jpg',
                    campaign: 'Velvet Matte Lipstick Swatches',
                    platform: 'Instagram 4-Slide Carousel',
                    duration: 'High-Res 4K',
                    submitted: '5 hours ago',
                    amount: '$350.00',
                    asset: '/images/skincare-thumb.jpg',
                  },
                  {
                    id: 'deliv-3',
                    creator: 'Marcus Vance',
                    handle: '@techmarcus',
                    avatar: '/images/tech-collab.jpg',
                    campaign: 'ANC Earbuds & Everyday Tech Lifestyle',
                    platform: 'YouTube Dedicated Integration',
                    duration: '8:45 min',
                    submitted: 'Yesterday',
                    amount: '$650.00',
                    asset: '/images/tech-collab.jpg',
                  },
                ].map((item) => {
                  const isApproved = approvedList.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl border border-slate-100 bg-[#FBFBFE] hover:bg-white hover:border-purple-200 transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <img
                          src={item.avatar}
                          alt={item.creator}
                          className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-[#17213B]">{item.creator}</span>
                            <span className="text-xs text-slate-400">{item.handle}</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-50 text-[#5125D8]">
                              {item.platform}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 font-medium">{item.campaign}</p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {item.submitted}
                            </span>
                            <span>•</span>
                            <span className="font-semibold text-slate-600">Milestone: {item.amount}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {isApproved ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Approved &amp; Paid
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={() =>
                                setReviewModalData({
                                  id: item.id,
                                  creator: item.creator,
                                  campaign: item.campaign,
                                  asset: item.asset,
                                  type: item.platform,
                                  amount: item.amount,
                                })
                              }
                              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-700 hover:text-[#5125D8] text-xs font-semibold transition-colors flex items-center gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Preview Asset
                            </button>
                            <button
                              onClick={() => handleApproveDeliverable(item.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-[#5125D8] hover:bg-[#431db8] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Approve &amp; Pay
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. ACTIVE BRAND CAMPAIGNS */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-[#17213B]">
                    Active Campaigns Overview
                  </h2>
                  <p className="text-xs text-slate-400">
                    Live briefs currently accepting bids and tracking creator deliverables
                  </p>
                </div>
                <Link
                  to="/brand/campaigns"
                  className="text-xs font-semibold text-[#5125D8] hover:underline flex items-center gap-1"
                >
                  Manage All (3)
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-4">
                {[
                  {
                    id: 'camp-101',
                    title: 'Hydrating Glow Serum Launch',
                    category: 'Beauty & Skincare',
                    platform: 'Instagram Reels & TikTok',
                    budgetAllocated: '$3,500',
                    creatorsActive: '4 Creators Booked',
                    proposals: '12 Bids',
                    progress: 75,
                    deadline: '9 days left',
                    status: 'Active',
                  },
                  {
                    id: 'camp-102',
                    title: 'Autumn Velvet Matte Lipstick Line',
                    category: 'Cosmetics & Makeup',
                    platform: 'Instagram Carousels',
                    budgetAllocated: '$2,200',
                    creatorsActive: '2 Creators Booked',
                    proposals: '6 Bids',
                    progress: 50,
                    deadline: '14 days left',
                    status: 'Active',
                  },
                  {
                    id: 'camp-103',
                    title: 'Winter Travel Skincare Essentials',
                    category: 'Lifestyle & Wellness',
                    platform: 'YouTube Shorts & Vlogs',
                    budgetAllocated: '$4,000',
                    creatorsActive: 'Scouting Stage',
                    proposals: '15 Bids',
                    progress: 20,
                    deadline: '21 days left',
                    status: 'Reviewing Bids',
                  },
                ].map((camp) => (
                  <div
                    key={camp.id}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-100 bg-[#FBFBFE] hover:border-purple-200 hover:bg-white transition-all shadow-2xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                            {camp.status}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {camp.category} • {camp.platform}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-[#17213B]">{camp.title}</h3>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-sm font-extrabold text-[#5125D8]">{camp.budgetAllocated}</span>
                        <p className="text-[11px] text-slate-400">{camp.deadline}</p>
                      </div>
                    </div>

                    {/* Progress Bar & Details */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{camp.creatorsActive}</span>
                        <span className="font-semibold text-slate-700">{camp.progress}% completed</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#5125D8] h-full rounded-full transition-all duration-500"
                          style={{ width: `${camp.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="text-slate-500 font-medium">
                        Incoming: <strong className="text-slate-800">{camp.proposals}</strong>
                      </span>
                      <div className="flex items-center gap-2">
                        <Link
                          to="/brand/bids"
                          className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-[#5125D8] font-semibold transition-colors"
                        >
                          Review Bids
                        </Link>
                        <Link
                          to="/brand/collaborations"
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-colors"
                        >
                          Open Workspace
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. PERFORMANCE & ROI SNAPSHOT */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#5125D8] flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#17213B]">
                      Campaign Performance &amp; ROI
                    </h2>
                    <p className="text-xs text-slate-400">
                      Aggregated metrics across all creator video integrations this quarter
                    </p>
                  </div>
                </div>
                <Link
                  to="/brand/analytics"
                  className="text-xs font-semibold text-[#5125D8] hover:underline"
                >
                  Full Report
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100/60">
                  <span className="text-[11px] text-slate-500 font-medium block">Total Impressions</span>
                  <span className="text-lg font-extrabold text-[#17213B] mt-0.5 block">1,420,800</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">+18.4% vs last mo.</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100/60">
                  <span className="text-[11px] text-slate-500 font-medium block">Avg Engagement Rate</span>
                  <span className="text-lg font-extrabold text-[#17213B] mt-0.5 block">4.82%</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">2.1x industry avg</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100/60">
                  <span className="text-[11px] text-slate-500 font-medium block">Cost Per View (CPV)</span>
                  <span className="text-lg font-extrabold text-[#17213B] mt-0.5 block">$0.014</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">-22% efficiency</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100/60">
                  <span className="text-[11px] text-slate-500 font-medium block">Estimated ROAS</span>
                  <span className="text-lg font-extrabold text-[#5125D8] mt-0.5 block">3.42x</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Strong conversion</span>
                </div>
              </div>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────
              RIGHT COLUMN (35% width): Incoming Bids, Recommended Creators, Guarantee
              ────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-4 space-y-6">
            {/* 1. INCOMING CREATOR PROPOSALS & BIDS */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#5125D8]" />
                  <h3 className="text-sm font-bold text-[#17213B]">Recent Proposals</h3>
                </div>
                <Link
                  to="/brand/bids"
                  className="text-xs font-semibold text-[#5125D8] hover:underline"
                >
                  View All (18)
                </Link>
              </div>

              <div className="space-y-3.5">
                {[
                  {
                    id: 'bid-1',
                    name: 'Arohi Patel',
                    handle: '@arohicreates',
                    avatar: '/images/avatar-creator-1.jpg',
                    followers: '124K Followers',
                    campaign: 'Hydrating Glow Serum',
                    bidAmount: '$450',
                    pitch: 'I have an 8.2% engagement rate with skincare enthusiasts in India and US.',
                    time: '1h ago',
                  },
                  {
                    id: 'bid-2',
                    name: 'Sophia Chen',
                    handle: '@sophiastyle',
                    avatar: '/images/fashion-collab.jpg',
                    followers: '280K Followers',
                    campaign: 'Velvet Matte Lipstick',
                    bidAmount: '$750',
                    pitch: 'Can create a high aesthetic GRWM reel showing lipstick transition shades.',
                    time: '3h ago',
                  },
                  {
                    id: 'bid-3',
                    name: 'Karan Mehra',
                    handle: '@karanlifestyle',
                    avatar: '/images/fitness-story.jpg',
                    followers: '95K Followers',
                    campaign: 'Winter Travel Skincare',
                    bidAmount: '$380',
                    pitch: 'Traveling to Himalayas next week, perfect setting for cold-weather skincare.',
                    time: '5h ago',
                  },
                ].map((bid) => (
                  <div
                    key={bid.id}
                    className="p-3.5 rounded-2xl border border-slate-100 bg-[#FBFBFE] hover:border-purple-200 hover:bg-white transition-all shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={bid.avatar}
                          alt={bid.name}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <div className="text-xs font-bold text-[#17213B] leading-tight">
                            {bid.name}
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {bid.handle} • {bid.followers}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-[#5125D8]">{bid.bidAmount}</span>
                    </div>

                    <p className="text-[11px] text-slate-600 line-clamp-2 italic bg-white p-2 rounded-xl border border-slate-100">
                      &quot;{bid.pitch}&quot;
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400">{bid.time}</span>
                      <div className="flex items-center gap-1.5">
                        <Link
                          to="/brand/bids"
                          className="px-2.5 py-1 rounded-lg bg-[#5125D8] hover:bg-[#431db8] text-white text-[11px] font-semibold transition-colors"
                        >
                          Review &amp; Accept
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/brand/bids"
                className="mt-4 w-full py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#5125D8] text-xs font-semibold text-center transition-colors block"
              >
                Go to Proposals Inbox →
              </Link>
            </div>

            {/* 2. TOP RECOMMENDED CREATORS (MATCHING YOUR BRAND NICHE) */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#17213B]">Suggested Creators</h3>
                  <p className="text-[11px] text-slate-400">High match for Beauty &amp; D2C</p>
                </div>
                <Link
                  to="/brand/creators"
                  className="text-xs font-semibold text-[#5125D8] hover:underline"
                >
                  Explore All
                </Link>
              </div>

              <div className="space-y-3">
                {[
                  {
                    name: 'Priya Sharma',
                    handle: '@priyaglows',
                    avatar: '/images/avatar-creator-1.jpg',
                    niche: 'Beauty & Skincare',
                    match: '98% Match',
                    rate: '$350 - $600',
                  },
                  {
                    name: 'Vikram Joshi',
                    handle: '@vikram_tech',
                    avatar: '/images/avatar-creator-2.jpg',
                    niche: 'Tech & Gadgets',
                    match: '94% Match',
                    rate: '$500 - $900',
                  },
                  {
                    name: 'Ananya Verma',
                    handle: '@ananya_lifestyle',
                    avatar: '/images/creator-arohi.jpg',
                    niche: 'Fashion & Aesthetic',
                    match: '96% Match',
                    rate: '$400 - $700',
                  },
                ].map((creator, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-[#FBFBFE] hover:bg-white hover:border-purple-200 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#17213B]">{creator.name}</span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {creator.match}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          {creator.niche} • {creator.rate}
                        </p>
                      </div>
                    </div>
                    <Link
                      to="/brand/creators"
                      className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-[#5125D8] text-[11px] font-semibold transition-colors"
                    >
                      Invite
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. 2BECOLLAB BRAND ESCROW GUARANTEE */}
            <div className="bg-gradient-to-br from-purple-900 to-[#17213B] text-white rounded-3xl p-5 sm:p-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-purple-300" />
                <h3 className="text-sm font-bold text-white">Escrow Assurance</h3>
              </div>
              <p className="text-xs text-purple-100/80 leading-relaxed mb-4">
                Your marketing budget is protected by 2BeCollab Escrow. Funds are never released until you verify that deliverable requirements and usage rights are met.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-purple-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Refund guarantee on non-delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          ASSET REVIEW MODAL
          ════════════════════════════════════════════════════════════ */}
      {reviewModalData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#5125D8]" />
                <h3 className="text-base font-bold text-[#17213B]">Review Content Draft</h3>
              </div>
              <button
                onClick={() => setReviewModalData(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Creator: <strong className="text-slate-800">{reviewModalData.creator}</strong></span>
                <span>Milestone: <strong className="text-emerald-600">{reviewModalData.amount}</strong></span>
              </div>
              <p className="text-xs font-semibold text-slate-700">{reviewModalData.campaign}</p>
            </div>

            {/* Asset Preview Window */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center group">
              <img
                src={reviewModalData.asset}
                alt="Asset preview"
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/90 text-[#5125D8] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform cursor-pointer">
                  <Play className="w-6 h-6 ml-1 fill-current" />
                </div>
              </div>
              <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-black/70 text-white text-[11px] font-medium">
                {reviewModalData.type}
              </div>
            </div>

            <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl text-xs text-slate-600">
              💡 <strong>Review Tips:</strong> Check brand mention clarity, promo code display, sound quality, and compliance with the campaign brief before approving.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setReviewModalData(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Request Revisions
              </button>
              <button
                onClick={() => handleApproveDeliverable(reviewModalData.id)}
                className="px-5 py-2 rounded-xl bg-[#5125D8] hover:bg-[#431db8] text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                Approve &amp; Release Milestone ({reviewModalData.amount})
              </button>
            </div>
          </div>
        </div>
      )}
    </BrandDashboardLayout>
  );
}
