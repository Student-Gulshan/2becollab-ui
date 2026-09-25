import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  ShieldCheck,
  Send,
  Eye,
  Instagram,
  Youtube,
  Twitter,
  Video,
  Sparkles,
  Building,
} from 'lucide-react';
import { SubmitBidModal, CampaignBidTarget } from './submit-bid-modal';

export interface CreatorCampaignCardProps {
  id: string;
  title: string;
  brandName: string;
  brandLogoUrl?: string;
  brandIndustry?: string;
  budget: string;
  deadline?: string;
  daysRemaining?: number;
  platforms?: string[];
  niches?: string[];
  matchScore?: number;
  isVerified?: boolean;
  onBidSubmitted?: () => void;
}

export function CreatorCampaignCard({
  id,
  title,
  brandName,
  brandLogoUrl,
  brandIndustry,
  budget,
  deadline = 'Oct 15, 2026',
  daysRemaining = 6,
  platforms = ['Instagram', 'YouTube'],
  niches = ['Tech & Lifestyle'],
  matchScore = 96,
  isVerified = true,
  onBidSubmitted,
}: CreatorCampaignCardProps) {
  const navigate = useNavigate();
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);

  const bidTarget: CampaignBidTarget = {
    id,
    title,
    brandName,
    budget,
    deadline,
    platforms,
  };

  const renderPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('instagram')) return <Instagram className="w-3 h-3 text-pink-500" />;
    if (p.includes('youtube')) return <Youtube className="w-3 h-3 text-red-500" />;
    if (p.includes('twitter') || p.includes('x')) return <Twitter className="w-3 h-3 text-slate-800" />;
    if (p.includes('tiktok')) return <Video className="w-3 h-3 text-purple-600" />;
    return <Sparkles className="w-3 h-3 text-[#5125D8]" />;
  };

  return (
    <>
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 flex flex-col justify-between group">
        <div>
          {/* Top Row: Brand & Match Score */}
          <div className="flex items-start justify-between gap-3 mb-3.5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                {brandLogoUrl ? (
                  <img src={brandLogoUrl} alt={brandName} className="w-full h-full object-cover" />
                ) : (
                  <Building className="w-5 h-5 text-[#5125D8]" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-[#17213B] truncate max-w-[130px]">
                    {brandName}
                  </h4>
                  {isVerified && (
                    <ShieldCheck className="w-3.5 h-3.5 text-[#5125D8]" aria-label="Verified Brand" />
                  )}
                </div>
                <span className="text-[11px] text-[#687087] block">
                  {brandIndustry || 'Brand Partner'}
                </span>
              </div>
            </div>

            {/* Match Score Badge */}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
              <Sparkles className="w-2.5 h-2.5 text-emerald-500" />
              {matchScore}% Match
            </span>
          </div>

          {/* Campaign Title */}
          <h3
            onClick={() => navigate(`/campaigns/${id}`)}
            className="text-sm font-bold text-[#17213B] group-hover:text-[#5125D8] transition-colors line-clamp-2 cursor-pointer mb-2.5"
          >
            {title}
          </h3>

          {/* Niches & Platforms */}
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            {platforms.map((plat) => (
              <span
                key={plat}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-medium text-[#17213B]"
              >
                {renderPlatformIcon(plat)}
                {plat}
              </span>
            ))}
            {niches.map((niche) => (
              <span
                key={niche}
                className="px-2 py-0.5 rounded-lg bg-purple-50 text-[11px] font-medium text-[#5125D8]"
              >
                {niche}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Section: Budget & Action */}
        <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] text-[#687087] uppercase tracking-wider block">Budget</span>
              <span className="text-slate-300 text-[10px]">•</span>
              <span className="text-[10px] text-[#687087] flex items-center gap-0.5">
                <Calendar className="w-2.5 h-2.5" />
                {daysRemaining}d left
              </span>
            </div>
            <span className="text-sm font-bold text-[#5125D8]">{budget}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => navigate(`/campaigns/${id}`)}
              title="View full brief"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#687087] hover:text-[#17213B] transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsBidModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#5125D8] hover:bg-[#431db8] text-white text-xs font-semibold shadow-sm shadow-[#5125D8]/20 flex items-center gap-1.5 transition-all hover:scale-[1.02]"
            >
              <Send className="w-3 h-3" />
              Submit Bid
            </button>
          </div>
        </div>
      </div>

      {/* Bid Modal */}
      <SubmitBidModal
        isOpen={isBidModalOpen}
        onClose={() => setIsBidModalOpen(false)}
        campaign={bidTarget}
        onSuccess={onBidSubmitted}
      />
    </>
  );
}
