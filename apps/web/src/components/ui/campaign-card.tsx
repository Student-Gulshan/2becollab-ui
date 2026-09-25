import { useNavigate } from 'react-router-dom';
import { Card } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { Briefcase, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

export interface CampaignCardProps {
  id: string;
  title: string;
  brandName: string;
  brandLogoUrl?: string;
  budget: string;
  niches: string[];
  platforms: string[];
  daysRemaining?: number;
  isVerifiedBrand?: boolean;
  applicantCount?: number;
  className?: string;
}

export function CampaignCard({
  id,
  title,
  brandName,
  brandLogoUrl,
  budget,
  niches = [],
  platforms = [],
  daysRemaining = 7,
  isVerifiedBrand = true,
  applicantCount = 12,
  className = '',
}: CampaignCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      variant="interactive"
      padding="sm"
      className={`group flex flex-col justify-between h-full ${className}`}
    >
      <div>
        {/* Brand header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
              {brandLogoUrl ? (
                <img
                  src={brandLogoUrl}
                  alt={brandName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Briefcase className="w-5 h-5 text-cyan-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-300">
                  {brandName}
                </span>
                {isVerifiedBrand && (
                  <ShieldCheck
                    className="w-3.5 h-3.5 text-cyan-400"
                    aria-label="Verified Brand"
                  />
                )}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <Calendar className="w-3 h-3" />
                <span>{daysRemaining} days left</span>
              </div>
            </div>
          </div>

          <Badge variant="brand" badgeStyle="glow">
            {budget}
          </Badge>
        </div>

        {/* Campaign Title */}
        <h4 className="font-bold text-white text-base mb-3 line-clamp-2 group-hover:text-cyan-300 transition-colors">
          {title}
        </h4>

        {/* Niches & Platforms */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {platforms.map((p, idx) => (
            <Badge key={`p-${idx}`} variant="secondary" badgeStyle="subtle">
              {p}
            </Badge>
          ))}
          {niches.slice(0, 2).map((n, idx) => (
            <Badge key={`n-${idx}`} variant="neutral" badgeStyle="subtle">
              {n}
            </Badge>
          ))}
        </div>
      </div>

      {/* Footer info & CTA */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <span className="text-xs text-slate-400">
          <strong className="text-slate-200">{applicantCount}</strong> creators applied
        </span>

        <Button
          size="xs"
          variant="secondary"
          className="group-hover:bg-cyan-600 group-hover:text-white group-hover:border-cyan-500 transition-all"
          iconRight={<ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />}
          onClick={() => navigate(`/campaigns/${id}`)}
        >
          View Deal
        </Button>
      </div>
    </Card>
  );
}
