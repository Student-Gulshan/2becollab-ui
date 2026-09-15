import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import {
  useCreatorProfile,
  useUpdateCreatorProfile,
  useBusinessProfile,
  useUpdateBusinessProfile,
  useUpdateUser,
} from '@/features/profile/hooks';
import { CREATOR_NICHES } from '@2becollab/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getErrorMessage } from '@/lib/api/error';
import {
  User as UserIcon,
  Sparkles,
  Building2,
  Globe,
  MapPin,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  X,
  Languages,
  Share2,
  Layers,
} from 'lucide-react';
import { SocialAccountsSection } from '@/components/profile/social-accounts-section';
import { PortfolioSection } from '@/components/profile/portfolio-section';

const INDUSTRY_OPTIONS = [
  'E-commerce & Retail',
  'SaaS & Software',
  'D2C Consumer Goods',
  'FinTech & Banking',
  'Health & Fitness',
  'Media & Entertainment',
  'Gaming & Web3',
  'Fashion & Apparel',
  'Food & Beverage',
  'Agency & Marketing',
  'Other',
];

const COMPANY_SIZE_OPTIONS = ['1-10', '11-50', '51-200', '201-500', '500+ employees'];

export function ProfileEditPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const isCreator = user?.role === 'CREATOR';
  const isBusiness = user?.role === 'BUSINESS';

  // Base user mutation
  const updateUserMutation = useUpdateUser();

  // Creator hooks
  const { data: creatorProfile } = useCreatorProfile();
  const updateCreatorMutation = useUpdateCreatorProfile();

  // Business hooks
  const { data: businessProfile } = useBusinessProfile();
  const updateBusinessMutation = useUpdateBusinessProfile();

  // Base user state
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Creator state
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [customNicheInput, setCustomNicheInput] = useState('');
  const [showCustomNicheInput, setShowCustomNicheInput] = useState(false);
  const [location, setLocation] = useState('');
  const [languagesInput, setLanguagesInput] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');

  // Business state
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [description, setDescription] = useState('');
  const [businessLocation, setBusinessLocation] = useState('');
  const [businessWebsite, setBusinessWebsite] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  // UI state
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const activeTab: 'profile' | 'social' | 'portfolio' =
    tabParam === 'social' || tabParam === 'portfolio' ? tabParam : 'profile';

  const setActiveTab = (tab: 'profile' | 'social' | 'portfolio') => {
    setSearchParams(tab === 'profile' ? {} : { tab });
  };

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated && !user) {
      navigate('/auth/choose-role');
    }
  }, [isAuthenticated, user, navigate]);

  // Sync state from server
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  useEffect(() => {
    if (creatorProfile) {
      setHeadline(creatorProfile.headline || '');
      setBio(creatorProfile.bio || '');
      setSelectedNiches(creatorProfile.niche || []);
      setLocation(creatorProfile.location || '');
      setLanguagesInput((creatorProfile.languages || []).join(', '));
      setWebsiteUrl(creatorProfile.websiteUrl || '');
      setCoverImageUrl(creatorProfile.coverImageUrl || '');
    }
  }, [creatorProfile]);

  useEffect(() => {
    if (businessProfile) {
      setCompanyName(businessProfile.companyName || '');
      setIndustry(businessProfile.industry || '');
      setCompanySize(businessProfile.companySize || '');
      setDescription(businessProfile.description || '');
      setBusinessLocation(businessProfile.location || '');
      setBusinessWebsite(businessProfile.websiteUrl || '');
      setLogoUrl(businessProfile.logoUrl || '');
    }
  }, [businessProfile]);

  // Niche toggle helper
  const toggleNiche = (nicheName: string) => {
    if (nicheName === 'Other') {
      setShowCustomNicheInput(!showCustomNicheInput);
      return;
    }

    if (selectedNiches.includes(nicheName)) {
      setSelectedNiches(selectedNiches.filter((n) => n !== nicheName));
    } else {
      if (selectedNiches.length >= 8) {
        setErrorMessage('You can select up to 8 niches');
        return;
      }
      setSelectedNiches([...selectedNiches, nicheName]);
    }
  };

  const addCustomNiche = () => {
    const trimmed = customNicheInput.trim();
    if (!trimmed) return;
    if (selectedNiches.includes(trimmed)) {
      setCustomNicheInput('');
      return;
    }
    if (selectedNiches.length >= 8) {
      setErrorMessage('You can select up to 8 niches');
      return;
    }
    setSelectedNiches([...selectedNiches, trimmed]);
    setCustomNicheInput('');
  };

  const removeNiche = (nicheToRemove: string) => {
    setSelectedNiches(selectedNiches.filter((n) => n !== nicheToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(false);
    setErrorMessage('');

    try {
      // 1. Update user base info if changed
      if (fullName !== user?.fullName || avatarUrl !== (user?.avatarUrl || '')) {
        await updateUserMutation.mutateAsync({
          fullName,
          avatarUrl: avatarUrl || undefined,
        });
      }

      // 2. Update role-specific profile
      if (isCreator) {
        const parsedLanguages = languagesInput
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

        await updateCreatorMutation.mutateAsync({
          headline,
          bio,
          niche: selectedNiches,
          location,
          languages: parsedLanguages,
          websiteUrl: websiteUrl || undefined,
          coverImageUrl: coverImageUrl || undefined,
        });
      } else if (isBusiness) {
        await updateBusinessMutation.mutateAsync({
          companyName,
          industry,
          companySize,
          description,
          location: businessLocation,
          websiteUrl: businessWebsite || undefined,
          logoUrl: logoUrl || undefined,
        });
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      const msg = getErrorMessage(err, 'Failed to save changes. Please check your inputs.');
      setErrorMessage(msg);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isSaving =
    updateUserMutation.isPending ||
    updateCreatorMutation.isPending ||
    updateBusinessMutation.isPending;

  const publicProfilePath = isCreator
    ? `/creators/${user?.id}`
    : `/businesses/${user?.id}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
              style={{
                backgroundColor: isCreator
                  ? 'rgba(16, 185, 129, 0.15)'
                  : 'rgba(99, 102, 241, 0.15)',
                color: isCreator ? '#34d399' : '#818cf8',
              }}
            >
              {user?.role} Profile Settings
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Edit Your Profile</h1>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Manage how your profile appears to other members on 2BeCollab
          </p>
        </div>

        {user?.id && (
          <Link
            to={publicProfilePath}
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10 glass border border-white/10"
            style={{ color: 'var(--color-text-primary)' }}
          >
            <span>View Public Profile</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Creator Navigation Tabs - Sticky */}
      {isCreator && (
        <div className="sticky top-16 z-30 flex items-center gap-2 mb-6 py-3 bg-[#0b0f17]/95 backdrop-blur-md border-b border-white/10 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'profile'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Profile & Bio</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'social'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Social Accounts</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'portfolio'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Portfolio Work</span>
          </button>
        </div>
      )}

      {isCreator && activeTab === 'social' && <SocialAccountsSection />}

      {isCreator && activeTab === 'portfolio' && <PortfolioSection />}

      {(activeTab === 'profile' || !isCreator) && (
        <>
          {/* Notifications */}
          {savedSuccess && (
            <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
              <p className="text-sm font-medium">Your profile has been saved successfully!</p>
            </div>
          )}

          {errorMessage && (
            <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
              <p className="text-sm font-medium">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
        {/* Card 1: Account / Personal Identity */}
        <Card variant="glass" padding="lg">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-indigo-400" />
            General Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Alex Johnson"
              required
            />

            <div>
              <Input
                label="Avatar Image URL"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
              {avatarUrl && (
                <div className="flex items-center gap-3 mt-2">
                  <img
                    src={avatarUrl}
                    alt="Preview"
                    className="w-8 h-8 rounded-full object-cover border border-white/20"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="text-xs text-gray-400">Avatar Preview</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Card 2: Role Specific Profile */}
        {isCreator && (
          <Card variant="glass" padding="lg" className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Creator Details
            </h2>

            {/* Headline */}
            <Input
              label="Professional Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Tech Reviewer & Filmmaker | 150K+ Community on YouTube & TikTok"
              maxLength={120}
            />

            {/* Niches */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Primary Content Niches (Select up to 8)
              </label>

              {/* Selected chips */}
              {selectedNiches.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedNiches.map((niche) => (
                    <span
                      key={niche}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    >
                      {niche}
                      <button
                        type="button"
                        onClick={() => removeNiche(niche)}
                        className="hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Preset buttons */}
              <div className="flex flex-wrap gap-2 mb-3">
                {CREATOR_NICHES.map((niche) => {
                  const isSelected = selectedNiches.includes(niche);
                  const isOther = niche === 'Other';

                  return (
                    <button
                      key={niche}
                      type="button"
                      onClick={() => toggleNiche(niche)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-emerald-500 text-white font-semibold'
                          : isOther && showCustomNicheInput
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                      }`}
                    >
                      {niche}
                    </button>
                  );
                })}
              </div>

              {/* "Other" custom input */}
              {showCustomNicheInput && (
                <div className="flex items-center gap-2 mt-2 max-w-md animate-in fade-in duration-200">
                  <Input
                    placeholder="Enter custom niche (e.g. AI & Robotics)"
                    value={customNicheInput}
                    onChange={(e) => setCustomNicheInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomNiche();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={addCustomNiche}
                    className="flex items-center gap-1 flex-shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </Button>
                </div>
              )}
            </div>

            {/* Bio */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-300">
                  About You / Bio
                </label>
                <span className="text-xs text-gray-500">{bio.length}/2000</span>
              </div>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={5}
                maxLength={2000}
                placeholder="Share your creator journey, audience demographics, engagement highlights, and the types of brand partnerships you love..."
                className="w-full rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-all resize-y"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)',
                }}
              />
            </div>

            {/* Location & Languages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Mumbai, India or Los Angeles, CA"
                icon={<MapPin className="w-4 h-4" />}
              />

              <Input
                label="Languages Spoken (comma separated)"
                value={languagesInput}
                onChange={(e) => setLanguagesInput(e.target.value)}
                placeholder="e.g. English, Hindi, Spanish"
                icon={<Languages className="w-4 h-4" />}
              />
            </div>

            {/* Website & Cover */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Personal Website / Portfolio Link"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://alexcreator.com"
                icon={<Globe className="w-4 h-4" />}
              />

              <div>
                <Input
                  label="Cover Banner Image URL"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  placeholder="https://example.com/cover-banner.jpg"
                  icon={<ImageIcon className="w-4 h-4" />}
                />
                {coverImageUrl && (
                  <div className="mt-2 rounded-lg overflow-hidden h-16 border border-white/20">
                    <img
                      src={coverImageUrl}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {isBusiness && (
          <Card variant="glass" padding="lg" className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-400" />
              Brand & Company Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Company / Brand Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Acme Studio"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Industry
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-all"
                  style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <option value="">Select industry</option>
                  {INDUSTRY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Company Size
                </label>
                <select
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-all"
                  style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <option value="">Select company size</option>
                  {COMPANY_SIZE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Headquarters / Location"
                value={businessLocation}
                onChange={(e) => setBusinessLocation(e.target.value)}
                placeholder="e.g. Bengaluru, India or San Francisco, CA"
                icon={<MapPin className="w-4 h-4" />}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-300">
                  Company Description
                </label>
                <span className="text-xs text-gray-500">{description.length}/2000</span>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                maxLength={2000}
                placeholder="Tell creators about your brand mission, the products you sell, and your typical collaboration goals..."
                className="w-full rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-all resize-y"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)',
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Official Website URL"
                value={businessWebsite}
                onChange={(e) => setBusinessWebsite(e.target.value)}
                placeholder="https://yourbrand.com"
                icon={<Globe className="w-4 h-4" />}
              />

              <div>
                <Input
                  label="Brand Logo URL"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://yourbrand.com/logo.png"
                  icon={<ImageIcon className="w-4 h-4" />}
                />
                {logoUrl && (
                  <div className="flex items-center gap-3 mt-2">
                    <img
                      src={logoUrl}
                      alt="Logo Preview"
                      className="w-8 h-8 rounded-lg object-contain bg-white/10 p-1 border border-white/20"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span className="text-xs text-gray-400">Logo Preview</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Action Button & Bottom Notifications */}
        <div className="pt-4 space-y-4">
          {errorMessage && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
              <p className="text-sm font-medium">{errorMessage}</p>
            </div>
          )}
          {savedSuccess && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
              <p className="text-sm font-medium">Your profile has been saved successfully!</p>
            </div>
          )}
          <div className="flex items-center justify-end gap-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSaving}
              className="min-w-[160px]"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </form>
      </>
      )}
    </div>
  );
}
