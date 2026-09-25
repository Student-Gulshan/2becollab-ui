import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePublicBusiness } from '@/features/profile/hooks';
import { useAuthStore } from '@/stores/auth-store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Building2,
  MapPin,
  Globe,
  Users,
  CheckCircle2,
  ArrowLeft,
  Share2,
  Edit3,
  Loader2,
  ExternalLink,
} from 'lucide-react';

export function BusinessPublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data: profile, isLoading, isError } = usePublicBusiness(id || '');

  const isOwner = user?.id === profile?.userId;

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        <p className="text-sm text-gray-400">Loading brand profile...</p>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
          <Building2 className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-white">Brand Profile Not Found</h2>
        <p className="text-sm text-gray-400 max-w-md">
          The brand profile you are looking for might have been moved or is currently private.
        </p>
        <Button variant="secondary" onClick={() => navigate('/')}>
          Return Home
        </Button>
      </div>
    );
  }

  const companyName = profile.companyName || profile.user?.fullName || 'Brand Profile';
  const logoUrl = profile.logoUrl || profile.user?.avatarUrl;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Brand link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top actions */}
        <div className="flex items-center justify-between">
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
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white transition-all shadow-md"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Brand Profile
              </Link>
            )}
          </div>
        </div>

        {/* Brand Header Banner Card */}
        <Card variant="glass" padding="lg" className="border-indigo-500/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 p-2 border border-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={companyName}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Building2 className="w-10 h-10 text-indigo-400" />
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{companyName}</h1>
                {profile.verifiedAt && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    Verified Brand
                  </span>
                )}
              </div>

              {profile.industry && (
                <p className="text-sm font-medium text-indigo-400">
                  {profile.industry}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-5 text-xs text-gray-400 pt-1">
                {profile.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.companySize && (
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>{profile.companySize}</span>
                  </div>
                )}
                {profile.websiteUrl && (
                  <a
                    href={profile.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-indigo-400 hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Content columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card variant="glass" padding="lg">
              <h2 className="text-lg font-bold text-white mb-3">About the Company</h2>
              {profile.description ? (
                <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-line">
                  {profile.description}
                </p>
              ) : (
                <p className="text-sm italic text-gray-500">
                  This brand has not added a description yet.
                </p>
              )}
            </Card>

            <Card variant="glass" padding="lg">
              <h2 className="text-lg font-bold text-white mb-3">Active Campaigns</h2>
              <p className="text-sm text-gray-400">
                Campaign discovery will be unlocked in Chunk 8. Creators can browse, apply, and negotiate directly.
              </p>
            </Card>
          </div>

          <div className="space-y-6">
            <Card variant="glass" padding="lg" className="border-indigo-500/20">
              <h3 className="text-lg font-bold text-white mb-2">Connect with {companyName}</h3>
              <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                Creators can pitch collaborations or inquire about upcoming sponsored campaigns.
              </p>

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => {
                  if (!user) {
                    navigate('/auth/signup');
                  } else {
                    alert('Direct Messaging will be active in Chunk 7!');
                  }
                }}
              >
                Inquire / Message
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
