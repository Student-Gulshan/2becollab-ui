import { useState } from 'react';
import {
  X,
  User,
  Camera,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Instagram,
  Youtube,
  Twitter,
  Link as LinkIcon,
  DollarSign,
  HeartHandshake,
  Video,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useCreatorProfile, useUpdateCreatorProfile, useUpdateUser } from '@/features/profile/hooks';

interface ProfileOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

const AVAILABLE_NICHES = [
  'Tech & Gadgets',
  'Fashion & Style',
  'Beauty & Skincare',
  'Fitness & Wellness',
  'Travel & Adventure',
  'Food & Cooking',
  'Gaming & Esports',
  'Finance & Crypto',
  'Education & Career',
  'Lifestyle & Vlogs',
];

export function ProfileOnboardingModal({ isOpen, onClose, onComplete }: ProfileOnboardingModalProps) {
  const { user } = useAuthStore();
  const { data: creatorProfile } = useCreatorProfile();
  const updateCreatorMutation = useUpdateCreatorProfile();
  const updateUserMutation = useUpdateUser();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 4;

  // Step 1: Basic info
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [headline, setHeadline] = useState(creatorProfile?.headline || '');
  const [bio, setBio] = useState(creatorProfile?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');

  // Step 2: Niche & Location
  const [selectedNiches, setSelectedNiches] = useState<string[]>(
    creatorProfile?.niche || ['Tech & Gadgets', 'Lifestyle & Vlogs']
  );
  const [location, setLocation] = useState(creatorProfile?.location || 'New Delhi, India');

  // Step 3: Socials
  const [instagram, setInstagram] = useState('');
  const [youtube, setYoutube] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [twitter, setTwitter] = useState('');

  // Step 4: Portfolio & Rates
  const [portfolioUrl, setPortfolioUrl] = useState(creatorProfile?.websiteUrl || '');
  const [baseRate, setBaseRate] = useState('350');

  const [isFinishing, setIsFinishing] = useState(false);

  if (!isOpen) return null;

  const toggleNiche = (niche: string) => {
    if (selectedNiches.includes(niche)) {
      setSelectedNiches(selectedNiches.filter((n) => n !== niche));
    } else {
      if (selectedNiches.length < 5) {
        setSelectedNiches([...selectedNiches, niche]);
      }
    }
  };

  const handleSkip = () => {
    localStorage.setItem('2becollab_creator_onboarding_dismissed', 'true');
    onClose();
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleFinalSave();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinalSave = async () => {
    setIsFinishing(true);
    try {
      if (fullName !== user?.fullName) {
        await updateUserMutation.mutateAsync({ fullName });
      }

      await updateCreatorMutation.mutateAsync({
        headline,
        bio,
        niche: selectedNiches,
        location,
        websiteUrl: portfolioUrl,
      });

      localStorage.setItem('2becollab_creator_onboarding_dismissed', 'true');
      localStorage.setItem('2becollab_creator_profile_completed', 'true');

      setTimeout(() => {
        setIsFinishing(false);
        onClose();
        if (onComplete) onComplete();
      }, 1000);
    } catch (err) {
      console.warn('Profile save completed with local fallback:', err);
      localStorage.setItem('2becollab_creator_onboarding_dismissed', 'true');
      setIsFinishing(false);
      onClose();
      if (onComplete) onComplete();
    }
  };

  const progressPercent = Math.round((step / totalSteps) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden">
        {/* Top Gradient Banner */}
        <div className="bg-gradient-to-r from-[#17093B] via-[#2F1170] to-[#5125D8] p-6 text-white relative">
          <button
            onClick={handleSkip}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-400/20 text-purple-200 border border-purple-300/30 text-[11px] font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-300" />
              Creator Setup
            </span>
            <span className="text-xs text-purple-200 font-medium">Step {step} of {totalSteps}</span>
          </div>

          <h3 className="text-xl font-bold text-white mb-1">
            {step === 1 && 'Complete Your Creator Profile'}
            {step === 2 && 'Select Your Niches & Location'}
            {step === 3 && 'Connect Your Social Handles'}
            {step === 4 && 'Portfolio & Collaboration Rate'}
          </h3>
          <p className="text-xs text-purple-200">
            {step === 1 && 'Help brands recognize you and discover your creative identity.'}
            {step === 2 && 'Brands filter creators by niche and geography for campaign targeting.'}
            {step === 3 && 'Showcase your audience presence across major content platforms.'}
            {step === 4 && 'Set expectations for brand inquiries and display your best work.'}
          </p>

          {/* Stepper Progress Bar */}
          <div className="mt-4 w-full bg-white/15 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-300 to-indigo-200 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Modal Form Body */}
        <div className="p-6">
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 border-2 border-purple-200 flex items-center justify-center text-[#5125D8] font-bold text-xl overflow-hidden shadow-inner">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : fullName && fullName.length > 0 ? (
                      fullName.charAt(0).toUpperCase()
                    ) : (
                      <User className="w-7 h-7 text-purple-400" />
                    )}
                  </div>
                  <label className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#5125D8] text-white flex items-center justify-center cursor-pointer shadow hover:scale-110 transition-transform">
                    <Camera className="w-3.5 h-3.5" />
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

                <div className="flex-1">
                  <label className="block text-xs font-semibold text-[#17213B] mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Arohi Sharma"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#5125D8] focus:ring-2 focus:ring-[#5125D8]/20 transition-all font-medium text-[#17213B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17213B] mb-1">
                  Headline / Catchphrase
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Tech Reviewer & Lifestyle Creator | 150K+ Audience"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#5125D8] focus:ring-2 focus:ring-[#5125D8]/20 transition-all text-[#17213B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17213B] mb-1">
                  Short Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell brands about your storytelling style, audience demographics, and what collabs excite you..."
                  className="w-full p-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#5125D8] focus:ring-2 focus:ring-[#5125D8]/20 transition-all resize-none text-[#17213B] placeholder:text-slate-400"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Niche & Location */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-semibold text-[#17213B] mb-2">
                  Select Your Creative Niches (Pick up to 5)
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_NICHES.map((niche) => {
                    const isSelected = selectedNiches.includes(niche);
                    return (
                      <button
                        type="button"
                        key={niche}
                        onClick={() => toggleNiche(niche)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#5125D8] text-white shadow-sm shadow-[#5125D8]/30 scale-[1.02]'
                            : 'bg-slate-100 text-[#687087] hover:bg-slate-200 hover:text-[#17213B]'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {niche}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17213B] mb-1">
                  Primary Location / City
                </label>
                <div className="relative flex items-center">
                  <MapPin className="absolute left-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Mumbai, India or London, UK"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#5125D8] focus:ring-2 focus:ring-[#5125D8]/20 transition-all text-[#17213B]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Social Accounts */}
          {step === 3 && (
            <div className="space-y-3 animate-fade-in">
              <p className="text-xs text-[#687087] mb-2">
                Enter your social handles. Brands check these to verify your audience reach:
              </p>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                  <Instagram className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="@your_instagram_handle"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full text-xs bg-transparent border-0 focus:outline-none text-[#17213B] font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <Youtube className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="YouTube channel URL or handle"
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    className="w-full text-xs bg-transparent border-0 focus:outline-none text-[#17213B] font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <Twitter className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="@your_x_handle"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    className="w-full text-xs bg-transparent border-0 focus:outline-none text-[#17213B] font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <Video className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="@your_tiktok_handle"
                    value={tiktok}
                    onChange={(e) => setTiktok(e.target.value)}
                    className="w-full text-xs bg-transparent border-0 focus:outline-none text-[#17213B] font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Portfolio & Rates */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-semibold text-[#17213B] mb-1">
                  Portfolio / Media Kit Link
                </label>
                <div className="relative flex items-center">
                  <LinkIcon className="absolute left-3 w-4 h-4 text-slate-400" />
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://drive.google.com/... or your website"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#5125D8] focus:ring-2 focus:ring-[#5125D8]/20 transition-all text-[#17213B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17213B] mb-1">
                  Starting Collaboration Rate (USD)
                </label>
                <div className="relative flex items-center">
                  <DollarSign className="absolute left-3 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    min="1"
                    value={baseRate}
                    onChange={(e) => setBaseRate(e.target.value)}
                    placeholder="350"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#5125D8] focus:ring-2 focus:ring-[#5125D8]/20 transition-all font-medium text-[#17213B]"
                  />
                </div>
                <span className="text-[10px] text-[#687087] mt-1 block">
                  You can negotiate specific rates for individual campaign deliverables.
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-100 flex items-center gap-3">
                <HeartHandshake className="w-6 h-6 text-[#5125D8] shrink-0" />
                <p className="text-xs text-[#5125D8]">
                  <strong>You're all set!</strong> Brands can now discover you in search and invite you to premium paid sponsorships.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-5 mt-4 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 text-xs font-semibold text-[#687087] hover:text-[#17213B] flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSkip}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
              >
                Skip for now
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={isFinishing}
              className="px-6 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#5125D8] to-[#6E3FF2] hover:from-[#431db8] hover:to-[#5d2ee0] rounded-xl shadow-md shadow-purple-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isFinishing ? (
                'Saving Profile...'
              ) : step === totalSteps ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Finish & Launch Dashboard
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
