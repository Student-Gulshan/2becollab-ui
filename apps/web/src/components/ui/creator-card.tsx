import { useNavigate } from 'react-router-dom';
import { Card } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { Star, CheckCircle2, ArrowRight } from 'lucide-react';

export interface CreatorCardProps {
  id: string;
  name: string;
  handle: string;
  avatarUrl?: string;
  niches: string[];
  platforms: Array<{
    name: 'youtube' | 'instagram' | 'tiktok' | 'twitter' | 'twitch';
    followers: string;
  }>;
  rating?: number;
  collabsCompleted?: number;
  startingRate?: string;
  isVerified?: boolean;
  className?: string;
}

export function CreatorCard({
  id,
  name,
  handle,
  avatarUrl,
  niches = [],
  platforms = [],
  rating = 4.9,
  collabsCompleted = 24,
  startingRate = '$500',
  isVerified = true,
  className = '',
}: CreatorCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      variant="interactive"
      padding="sm"
      className={`group flex flex-col justify-between h-full ${className}`}
    >
      <div>
        {/* Top Header: Avatar + Verification + Starting Rate */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 p-[2px] shadow-md group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full rounded-[14px] overflow-hidden bg-slate-900 flex items-center justify-center">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-bold text-indigo-200">
                      {name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              {isVerified && (
                <div
                  className="absolute -bottom-1 -right-1 bg-indigo-500 text-white rounded-full p-0.5 shadow-sm"
                  title="Verified Creator"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 fill-indigo-500 text-white" />
                </div>
              )}
            </div>

            <div>
              <h4 className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                {name}
              </h4>
              <p className="text-xs text-slate-400 font-medium">{handle}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              From
            </span>
            <span className="text-sm font-bold text-emerald-400">
              {startingRate}
            </span>
          </div>
        </div>

        {/* Niche Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {niches.slice(0, 3).map((niche, idx) => (
            <Badge key={idx} variant="creator" badgeStyle="subtle">
              {niche}
            </Badge>
          ))}
          {niches.length > 3 && (
            <Badge variant="neutral" badgeStyle="subtle">
              +{niches.length - 3}
            </Badge>
          )}
        </div>

        {/* Platforms Summary */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 mb-4">
          {platforms.slice(0, 2).map((p, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-medium">
                {p.name}
              </span>
              <span className="text-xs font-bold text-slate-200">
                {p.followers}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer: Rating & Collab Button */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-xs">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="font-bold text-white">{rating}</span>
          <span className="text-slate-500">({collabsCompleted} deals)</span>
        </div>

        <Button
          size="xs"
          variant="secondary"
          className="group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500 transition-all"
          iconRight={<ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />}
          onClick={() => navigate(`/creators/${id}`)}
        >
          Collab
        </Button>
      </div>
    </Card>
  );
}
