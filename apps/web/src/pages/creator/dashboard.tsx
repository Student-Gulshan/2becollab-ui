import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Flame,
  FileText,
  DollarSign,
  Star,
  Clock,
  ArrowRight,
  ChevronRight,
  MessageSquare,
  Wallet,
  User as UserIcon,
  Lightbulb,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { CreatorDashboardLayout } from '@/components/layout/creator-dashboard-layout';
import { ProfileOnboardingModal } from '@/components/creator/profile-onboarding-modal';
import { SubmitBidModal, CampaignBidTarget } from '@/components/creator/submit-bid-modal';

export function CreatorDashboardPage() {
  const { user } = useAuthStore();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [bidTarget, setBidTarget] = useState<CampaignBidTarget | null>(null);

  const creatorName = user?.fullName?.split(' ')[0] || 'Arohi';

  const handleOpenBid = (campaign: CampaignBidTarget) => {
    setBidTarget(campaign);
  };

  return (
    <CreatorDashboardLayout>
      <div className="space-y-6">
        {/* ════════════════════════════════════════════════════════════
            ROW 1: HERO CARDS (Welcome Banner + Complete Profile)
            ════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Welcome Banner Card (approx 65% width) */}
          <div className="lg:col-span-8 bg-gradient-to-r from-purple-50/90 via-purple-50/40 to-indigo-50/60 border border-purple-100 rounded-3xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between shadow-xs">
            <div className="max-w-md z-10 space-y-2">
              <span className="text-xs font-bold text-[#5125D8] tracking-wide flex items-center gap-1.5">
                Good morning, {creatorName} 👋
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17213B] tracking-tight">
                Create. Collaborate. Grow.
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                Discover amazing brand collaborations, manage your campaigns and track your earnings — all in one place.
              </p>
            </div>

            {/* Ambient Illustration Image on Right */}
            <div className="absolute right-4 -bottom-4 hidden sm:block w-48 lg:w-56 h-auto pointer-events-none select-none opacity-95">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-purple-100/50 to-transparent rounded-full filter blur-xl" />
                <img
                  src="/images/creator-hero.jpg"
                  alt="Creator working"
                  className="w-full h-44 object-cover object-top rounded-2xl shadow-lg border-2 border-white/80"
                />
              </div>
            </div>
          </div>

          {/* Complete Your Profile Card (approx 35% width) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between shadow-xs relative">
            <div>
              <div className="flex items-center gap-3 mb-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#5125D8] flex items-center justify-center shrink-0">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#17213B]">Complete Your Profile</h3>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Get better campaign matches and increase your chances of getting selected.
              </p>

              {/* Progress bar */}
              <div className="space-y-1.5 mb-5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Profile completeness</span>
                  <span className="text-xs font-bold text-[#5125D8]">70% Complete</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#5125D8] h-full rounded-full transition-all duration-500"
                    style={{ width: '70%' }}
                  />
                </div>
              </div>
            </div>

            <Link
              to="/creator/profile"
              className="w-fit inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5125D8] hover:bg-[#4520B8] text-white text-xs font-semibold shadow-xs shadow-[#5125D8]/20 transition-all hover:gap-2.5"
            >
              <span>View Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════
            ROW 2: 4 METRIC STAT CARDS
            ════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Active Campaigns */}
          <Link
            to="/creator/active"
            className="bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-purple-200 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500">Active Campaigns</span>
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#5125D8] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#17213B] mb-1">2</div>
            <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1 group-hover:text-[#5125D8] transition-colors">
              <span>You're currently working on</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Submitted Bids */}
          <Link
            to="/creator/bids"
            className="bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-purple-200 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500">Submitted Bids</span>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#17213B] mb-1">5</div>
            <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1 group-hover:text-[#5125D8] transition-colors">
              <span>Out of 12 campaigns</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Total Earnings */}
          <Link
            to="/creator/earnings"
            className="bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-purple-200 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500">Total Earnings</span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#17213B] mb-1">$1,240</div>
            <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1 group-hover:text-[#5125D8] transition-colors">
              <span>This month</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Average Rating */}
          <Link
            to="/creator/analytics"
            className="bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-purple-200 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500">Average Rating</span>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#17213B] mb-1">4.8</div>
            <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1 group-hover:text-[#5125D8] transition-colors">
              <span>Based on 12 reviews</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>

        {/* ════════════════════════════════════════════════════════════
            ROW 3: TWO-COLUMN MAIN CONTENT (Left 65% / Right 35%)
            ════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* ════════════════════════════════════════════════════════
              LEFT COLUMN (lg:col-span-8)
              ════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. CURRENT ACTIVE CAMPAIGNS */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#17213B] flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#5125D8]" />
                    Current Active Campaigns
                  </h3>
                  <p className="text-xs text-slate-500">
                    Track your ongoing collaborations and deliverables.
                  </p>
                </div>
                <Link
                  to="/creator/active"
                  className="text-xs font-bold text-[#5125D8] hover:underline flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Collab 1: LuxeGlow */}
              <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/70 hover:border-purple-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img
                      src="/images/skincare-thumb.jpg"
                      alt="LuxeGlow Skincare"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-[9px] font-bold">
                        L
                      </div>
                      <span className="text-xs font-bold text-[#17213B]">LuxeGlow</span>
                    </div>
                    <h4 className="text-sm font-bold text-[#17213B]">
                      Skincare Product Review & Reel
                    </h4>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[10px] font-semibold text-[#5125D8]">
                        Beauty & Skincare
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-medium text-slate-600">
                        Instagram + YouTube
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="font-bold text-[#17213B]">$600 <span className="font-normal text-slate-400">Budget</span></span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-amber-600 font-medium">
                        <Clock className="w-3 h-3" />
                        5 days left
                      </span>
                      <span>•</span>
                      <span className="text-slate-600 font-medium">3/5 Deliverables</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </span>
                  <Link
                    to="/creator/active"
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-[#5125D8] hover:text-[#5125D8] text-xs font-semibold text-[#17213B] transition-colors flex items-center gap-1"
                  >
                    Manage
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Collab 2: UrbanWear */}
              <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/70 hover:border-purple-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img
                      src="/images/fashion-collab.jpg"
                      alt="UrbanWear Collection"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[9px] font-bold">
                        U
                      </div>
                      <span className="text-xs font-bold text-[#17213B]">UrbanWear</span>
                    </div>
                    <h4 className="text-sm font-bold text-[#17213B]">
                      Fall Collection Lookbook
                    </h4>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[10px] font-semibold text-[#5125D8]">
                        Fashion & Apparel
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-medium text-slate-600">
                        Instagram + TikTok
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="font-bold text-[#17213B]">$400 <span className="font-normal text-slate-400">Budget</span></span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-500 font-medium">
                        <Clock className="w-3 h-3" />
                        8 days left
                      </span>
                      <span>•</span>
                      <span className="text-slate-600 font-medium">2/4 Deliverables</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </span>
                  <Link
                    to="/creator/active"
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-[#5125D8] hover:text-[#5125D8] text-xs font-semibold text-[#17213B] transition-colors flex items-center gap-1"
                  >
                    Manage
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* 2. RECOMMENDED CAMPAIGNS (3 Columns) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#17213B] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#5125D8]" />
                    Recommended Campaigns
                  </h3>
                  <p className="text-xs text-slate-500">
                    Handpicked campaigns based on your niche and profile.
                  </p>
                </div>
                <Link
                  to="/creator/campaigns"
                  className="text-xs font-bold text-[#5125D8] hover:underline flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {/* Campaign 1: The Body Shop */}
                <div className="rounded-2xl border border-slate-200/80 p-4 bg-white flex flex-col justify-between hover:border-purple-200 hover:shadow-md transition-all">
                  <div>
                    <div className="w-full h-32 rounded-xl overflow-hidden mb-3 relative bg-slate-100">
                      <img
                        src="/images/skincare-thumb.jpg"
                        alt="The Body Shop Skincare"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[#5125D8] text-white text-[10px] font-bold shadow-xs">
                        New
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center">
                        B
                      </div>
                      <span className="text-xs font-bold text-[#17213B]">The Body Shop</span>
                    </div>

                    <h4 className="text-xs font-bold text-[#17213B] line-clamp-1 mb-1">
                      Skincare Routine Campaign
                    </h4>

                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="px-1.5 py-0.5 rounded bg-purple-50 text-[10px] text-[#5125D8] font-medium">
                        Beauty & Skincare
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 font-medium">
                        Instagram
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
                      Showcase your daily skincare routine using The Body Shop products.
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 mb-3">
                      <span className="font-bold text-[#17213B]">$300 – $500</span>
                      <span>7 days left</span>
                      <span>4 Creators</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      to="/campaigns"
                      className="py-1.5 text-center rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() =>
                        handleOpenBid({
                          id: 'camp-body-shop',
                          title: 'Skincare Routine Campaign',
                          brandName: 'The Body Shop',
                          budget: '$300 – $500',
                          deadline: '7 days left',
                          platforms: ['Instagram'],
                        })
                      }
                      className="py-1.5 text-center rounded-xl bg-[#5125D8] hover:bg-[#4520B8] text-white text-xs font-semibold transition-colors"
                    >
                      Submit Bid
                    </button>
                  </div>
                </div>

                {/* Campaign 2: Noise */}
                <div className="rounded-2xl border border-slate-200/80 p-4 bg-white flex flex-col justify-between hover:border-purple-200 hover:shadow-md transition-all">
                  <div>
                    <div className="w-full h-32 rounded-xl overflow-hidden mb-3 relative bg-slate-900">
                      <img
                        src="/images/tech-collab.jpg"
                        alt="Noise Smartwatch"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[#5125D8] text-white text-[10px] font-bold shadow-xs">
                        New
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                        N
                      </div>
                      <span className="text-xs font-bold text-[#17213B]">Noise</span>
                    </div>

                    <h4 className="text-xs font-bold text-[#17213B] line-clamp-1 mb-1">
                      Product Review Campaign
                    </h4>

                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="px-1.5 py-0.5 rounded bg-purple-50 text-[10px] text-[#5125D8] font-medium">
                        Tech & Gadgets
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 font-medium">
                        YouTube
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
                      Create a detailed review of Noise smartwatch with real usage experience.
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 mb-3">
                      <span className="font-bold text-[#17213B]">$500 – $800</span>
                      <span>10 days left</span>
                      <span>5 Creators</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      to="/campaigns"
                      className="py-1.5 text-center rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() =>
                        handleOpenBid({
                          id: 'camp-noise',
                          title: 'Product Review Campaign',
                          brandName: 'Noise',
                          budget: '$500 – $800',
                          deadline: '10 days left',
                          platforms: ['YouTube'],
                        })
                      }
                      className="py-1.5 text-center rounded-xl bg-[#5125D8] hover:bg-[#4520B8] text-white text-xs font-semibold transition-colors"
                    >
                      Submit Bid
                    </button>
                  </div>
                </div>

                {/* Campaign 3: Mamaearth */}
                <div className="rounded-2xl border border-slate-200/80 p-4 bg-white flex flex-col justify-between hover:border-purple-200 hover:shadow-md transition-all">
                  <div>
                    <div className="w-full h-32 rounded-xl overflow-hidden mb-3 relative bg-slate-100">
                      <img
                        src="/images/product-showcase.jpg"
                        alt="Mamaearth Products"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold flex items-center justify-center">
                        M
                      </div>
                      <span className="text-xs font-bold text-[#17213B]">Mamaearth</span>
                    </div>

                    <h4 className="text-xs font-bold text-[#17213B] line-clamp-1 mb-1">
                      Lifestyle & Skincare Reel
                    </h4>

                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="px-1.5 py-0.5 rounded bg-purple-50 text-[10px] text-[#5125D8] font-medium">
                        Beauty & Skincare
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 font-medium">
                        Instagram • Reels
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
                      Share your honest experience with Mamaearth daily skincare products.
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 mb-3">
                      <span className="font-bold text-[#17213B]">$200 – $400</span>
                      <span>5 days left</span>
                      <span>6 Creators</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      to="/campaigns"
                      className="py-1.5 text-center rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() =>
                        handleOpenBid({
                          id: 'camp-mamaearth',
                          title: 'Lifestyle & Skincare Reel',
                          brandName: 'Mamaearth',
                          budget: '$200 – $400',
                          deadline: '5 days left',
                          platforms: ['Instagram'],
                        })
                      }
                      className="py-1.5 text-center rounded-xl bg-[#5125D8] hover:bg-[#4520B8] text-white text-xs font-semibold transition-colors"
                    >
                      Submit Bid
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. EARNINGS OVERVIEW (Chart + Recent Payouts) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#17213B] flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-[#5125D8]" />
                    Earnings Overview
                  </h3>
                  <p className="text-xs text-slate-500">Your earnings for the last 7 days</p>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Total Earnings</span>
                    <span className="font-black text-[#17213B] text-sm">$1,240</span>
                  </div>
                  <div className="border-l border-slate-200 pl-4">
                    <span className="text-[10px] text-slate-400 block font-medium">Pending Payments</span>
                    <span className="font-black text-[#17213B] text-sm">$320</span>
                  </div>
                  <div className="border-l border-slate-200 pl-4">
                    <span className="text-[10px] text-slate-400 block font-medium">Available Balance</span>
                    <span className="font-black text-[#5125D8] text-sm">$920</span>
                  </div>
                </div>
              </div>

              {/* Grid: 7-Day Chart on Left, Recent Payouts on Right */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-2">
                {/* SVG Line Graph (7 cols) */}
                <div className="md:col-span-7 bg-[#FAF9FE] rounded-2xl p-4 border border-purple-50 flex flex-col justify-between">
                  <div className="h-40 w-full relative">
                    {/* SVG Chart */}
                    <svg viewBox="0 0 350 140" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="purpleEarningsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#5125D8" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#5125D8" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Grid lines */}
                      <line x1="0" y1="20" x2="350" y2="20" stroke="#E2E8F0" strokeDasharray="3 3" />
                      <line x1="0" y1="60" x2="350" y2="60" stroke="#E2E8F0" strokeDasharray="3 3" />
                      <line x1="0" y1="100" x2="350" y2="100" stroke="#E2E8F0" strokeDasharray="3 3" />

                      {/* Fill area */}
                      <path
                        d="M 10,95 Q 60,110 110,85 T 210,75 T 280,90 T 340,65 L 340,120 L 10,120 Z"
                        fill="url(#purpleEarningsGrad)"
                      />

                      {/* Stroke line */}
                      <path
                        d="M 10,95 Q 60,110 110,85 T 210,75 T 280,90 T 340,65"
                        fill="none"
                        stroke="#5125D8"
                        strokeWidth="2.5"
                      />

                      {/* Data Dots */}
                      <circle cx="10" cy="95" r="3.5" fill="#5125D8" />
                      <circle cx="110" cy="85" r="3.5" fill="#5125D8" />
                      <circle cx="210" cy="75" r="4.5" fill="#5125D8" stroke="#FFFFFF" strokeWidth="2" />
                      <circle cx="280" cy="90" r="3.5" fill="#5125D8" />
                      <circle cx="340" cy="65" r="4" fill="#5125D8" />
                    </svg>
                  </div>

                  {/* Dates Axis */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium px-2 pt-2">
                    <span>Apr 21</span>
                    <span>Apr 22</span>
                    <span>Apr 23</span>
                    <span>Apr 24</span>
                    <span>Apr 25</span>
                    <span>Apr 26</span>
                    <span>Apr 27</span>
                  </div>
                </div>

                {/* Recent Payouts Table (5 cols) */}
                <div className="md:col-span-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#17213B]">Recent Payouts</span>
                    <Link to="/creator/earnings" className="text-[11px] font-semibold text-[#5125D8] hover:underline">
                      View All →
                    </Link>
                  </div>

                  <div className="space-y-2">
                    {/* Payout 1 */}
                    <div className="p-2.5 rounded-xl border border-slate-100 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                          <img src="/images/skincare-thumb.jpg" alt="LuxeGlow" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-[#17213B]">LuxeGlow</h5>
                          <span className="text-[10px] text-slate-400">Apr 25, 2026</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#17213B] block">$250</span>
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-full">
                          Paid
                        </span>
                      </div>
                    </div>

                    {/* Payout 2 */}
                    <div className="p-2.5 rounded-xl border border-slate-100 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                          <img src="/images/fashion-collab.jpg" alt="UrbanWear" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-[#17213B]">UrbanWear</h5>
                          <span className="text-[10px] text-slate-400">Apr 18, 2026</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#17213B] block">$180</span>
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-full">
                          Paid
                        </span>
                      </div>
                    </div>

                    {/* Payout 3 */}
                    <div className="p-2.5 rounded-xl border border-slate-100 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                          <img src="/images/product-showcase.jpg" alt="The Body Shop" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-[#17213B]">The Body Shop</h5>
                          <span className="text-[10px] text-slate-400">Apr 10, 2026</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#17213B] block">$320</span>
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-full">
                          Paid
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════
              RIGHT COLUMN (lg:col-span-4)
              ════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-4 space-y-6">
            {/* 1. FIND YOUR NEXT COLLABORATION PROMO */}
            <div className="bg-gradient-to-br from-[#EDE7FD] via-[#F4EFFE] to-purple-50 border border-purple-200/80 rounded-3xl p-6 relative overflow-hidden shadow-xs">
              <div className="relative z-10 space-y-2 mb-4">
                <h3 className="text-base font-bold text-[#17213B]">
                  Find Your Next Collaboration
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Explore brand campaigns that match your niche and interests.
                </p>
                <Link
                  to="/creator/campaigns"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5125D8] hover:bg-[#431db8] text-white text-xs font-semibold shadow-xs shadow-[#5125D8]/20 transition-all mt-1"
                >
                  <span>Explore Campaigns</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Decorative 3D Illustration Graphic */}
              <div className="absolute -right-2 -bottom-2 w-32 h-32 opacity-90 pointer-events-none select-none">
                <img
                  src="/images/fashion-collab.jpg"
                  alt="Sneakers & Social Collab"
                  className="w-full h-full object-cover rounded-2xl transform rotate-6 border-2 border-white shadow-lg"
                />
              </div>
            </div>

            {/* 2. QUICK ACTIONS */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3.5">
              <h3 className="text-sm font-bold text-[#17213B]">Quick Actions</h3>

              <div className="grid grid-cols-4 gap-2.5">
                {/* Action 1 */}
                <Link
                  to="/creator/campaigns"
                  className="flex flex-col items-center text-center p-3 rounded-2xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#5125D8] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700 leading-tight">
                    View Campaigns
                  </span>
                </Link>

                {/* Action 2 */}
                <Link
                  to="/creator/profile"
                  className="flex flex-col items-center text-center p-3 rounded-2xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700 leading-tight">
                    Update Profile
                  </span>
                </Link>

                {/* Action 3 */}
                <Link
                  to="/creator/messages"
                  className="flex flex-col items-center text-center p-3 rounded-2xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700 leading-tight">
                    Check Messages
                  </span>
                </Link>

                {/* Action 4 */}
                <Link
                  to="/creator/earnings"
                  className="flex flex-col items-center text-center p-3 rounded-2xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700 leading-tight">
                    Track Earnings
                  </span>
                </Link>
              </div>
            </div>

            {/* 3. MY BIDS LIST (With Indian & Global Brands) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#17213B] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#5125D8]" />
                  My Bids
                </h3>
                <Link to="/creator/bids" className="text-xs font-semibold text-[#5125D8] hover:underline">
                  View All →
                </Link>
              </div>

              <div className="space-y-3">
                {/* Bid 1: Nykaa */}
                <div className="flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center text-[10px] font-extrabold uppercase shrink-0">
                      Nykaa
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#17213B]">Nykaa</h4>
                      <p className="text-[11px] text-slate-500 truncate max-w-[130px]">Festive Makeup Look</p>
                      <span className="text-[10px] text-slate-400 font-medium">$450 • 2 days ago</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                    Under Review
                  </span>
                </div>

                {/* Bid 2: boAt */}
                <div className="flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-extrabold uppercase shrink-0">
                      boAt
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#17213B]">boAt</h4>
                      <p className="text-[11px] text-slate-500 truncate max-w-[130px]">New Launch Review</p>
                      <span className="text-[10px] text-slate-400 font-medium">$600 • 5 days ago</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    Accepted
                  </span>
                </div>

                {/* Bid 3: Dabur */}
                <div className="flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-extrabold uppercase shrink-0">
                      Dabur
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#17213B]">Dabur</h4>
                      <p className="text-[11px] text-slate-500 truncate max-w-[130px]">Health & Wellness Video</p>
                      <span className="text-[10px] text-slate-400 font-medium">$300 • 1 week ago</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                    Rejected
                  </span>
                </div>

                {/* Bid 4: Lenskart */}
                <div className="flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-extrabold uppercase shrink-0">
                      Lenskart
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#17213B]">Lenskart</h4>
                      <p className="text-[11px] text-slate-500 truncate max-w-[130px]">Frame Styling Reel</p>
                      <span className="text-[10px] text-slate-400 font-medium">$350 • 1 week ago</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-purple-50 text-[#5125D8] border border-purple-200 text-[10px] font-bold">
                    Pending
                  </span>
                </div>
              </div>
            </div>

            {/* 4. PRO TIP CARD */}
            <div className="bg-[#FAF8FE] border border-purple-200/80 rounded-3xl p-6 relative overflow-hidden shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-purple-700">
                <Lightbulb className="w-4 h-4 text-[#5125D8]" />
                <span className="text-xs font-bold text-[#5125D8] uppercase tracking-wider">Pro Tip</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Keep your profile complete and active to get more campaign invites and higher bids.
              </p>
              <Link
                to="/creator/profile"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5125D8] hover:bg-[#431db8] text-white text-xs font-semibold shadow-xs shadow-[#5125D8]/20 transition-all"
              >
                <span>Complete Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Modal */}
      <ProfileOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      {/* Submit Bid Modal */}
      <SubmitBidModal
        isOpen={Boolean(bidTarget)}
        onClose={() => setBidTarget(null)}
        campaign={bidTarget}
      />
    </CreatorDashboardLayout>
  );
}
