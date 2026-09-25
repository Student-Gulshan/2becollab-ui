import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  ChevronDown,
  Sparkles,
  Search,
  Clock,
  Handshake,
  TrendingUp,
  User,
  MessageSquare,
  ShieldCheck,
  Layers,
  Headphones,
  CheckCircle2,
  ExternalLink,
  Star,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';

export function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // FAQ state: default first item open, clicking toggles open/close
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Marquee scroll container ref for manual arrow controls
  const marqueeRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = (role?: 'CREATOR' | 'BUSINESS') => {
    if (isAuthenticated) {
      navigate('/campaigns');
    } else if (role) {
      navigate(`/auth/signup?role=${role}`);
    } else {
      navigate('/auth/signup');
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(prev => (prev === index ? null : index));
  };

  const scrollMarquee = (direction: 'left' | 'right') => {
    if (marqueeRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      marqueeRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const creatorStories = [
    {
      id: 1,
      name: 'Maya Lin',
      handle: '@wanderwithmaya',
      avatar: '/images/avatar-creator-1.jpg',
      category: 'Travel & Lifestyle',
      headline: 'Capturing Sunrise Escapes & Hidden Stays',
      subtext: '420K+ Views • Alpine Stays Campaign',
      image: '/images/travel-story.jpg',
      verified: true,
    },
    {
      id: 2,
      name: 'Marcus Vance',
      handle: '@fitwithmarcus',
      avatar: '/images/avatar-creator-2.jpg',
      category: 'Fitness & Health',
      headline: 'High-Impact Workouts & Nutrition Regimens',
      subtext: '185K+ Views • Apex Athletics Brand',
      image: '/images/fitness-story.jpg',
      verified: true,
    },
    {
      id: 3,
      name: 'Elena Rostova',
      handle: '@theculinarystory',
      avatar: '/images/avatar-creator-1.jpg',
      category: 'Food & Culinary',
      headline: 'Artisanal Sourdough & Gourmet Flavors',
      subtext: '310K+ Views • Gusto Kitchenware',
      image: '/images/food-story.jpg',
      verified: true,
    },
    {
      id: 4,
      name: 'Chloe Monet',
      handle: '@chloestylediary',
      avatar: '/images/avatar-creator-2.jpg',
      category: 'Fashion & Streetwear',
      headline: 'Minimalist Wardrobe & Seasonal Lookbooks',
      subtext: '540K+ Views • Velvet & Oak Collab',
      image: '/images/fashion-collab.jpg',
      verified: true,
    },
    {
      id: 5,
      name: 'David Chen',
      handle: '@davidtechtalk',
      avatar: '/images/avatar-creator-1.jpg',
      category: 'Consumer Tech',
      headline: 'Unboxing Pro Gear & Workspace Setups',
      subtext: '620K+ Views • Quantum Audio Tech',
      image: '/images/tech-collab.jpg',
      verified: true,
    },
    {
      id: 6,
      name: 'Sarah Jenkins',
      handle: '@glowwithsarah',
      avatar: '/images/avatar-creator-2.jpg',
      category: 'Beauty & Skincare',
      headline: 'Clean Dermatology & Evening Routine Glow',
      subtext: '290K+ Views • PureEssence Brand',
      image: '/images/creator-preview.jpg',
      verified: true,
    },
  ];

  const faqItems = [
    {
      q: 'What is a creator marketplace?',
      a: 'A creator marketplace is a collaborative ecosystem where brands and independent creators connect directly. Brands can find verified creators matching their niche, while creators can discover active paid briefs, agree on clear deliverables, and collaborate with secure escrow protection.',
    },
    {
      q: 'Is 2BeCollab free to join?',
      a: 'Yes, signing up as either a brand or creator is 100% free. There are no monthly subscription fees, paywalls, or upfront listing costs. We only apply a transparent platform fee when a milestone contract is successfully approved and completed.',
    },
    {
      q: 'How does escrow protection work?',
      a: 'When an offer is accepted, the brand funds the agreed milestone budget into secure escrow. Creators begin work with peace of mind knowing payment is guaranteed. Once deliverables are reviewed and approved, the funds release automatically.',
    },
    {
      q: 'What kind of creators and niches can join?',
      a: 'We welcome creators across all major verticals—including Tech, Beauty, Fashion, Fitness, Lifestyle, Gaming, and Education across Instagram, YouTube, and TikTok. Whether you focus on UGC reels or dedicated reviews, 2BeCollab is built for you.',
    },
    {
      q: 'How do I get content rights and clear deliverables?',
      a: 'Every partnership on 2BeCollab comes with standardized digital agreements that explicitly define content usage rights, organic vs ad rights, turnaround deadlines, and revision rounds so both parties are fully protected.',
    },
    {
      q: 'Can I collaborate with multiple brands at once?',
      a: 'Absolutely. Creators can negotiate and manage multiple campaign deliverables concurrently through our intuitive dashboard and real-time messaging hub.',
    },
  ];

  return (
    <div className="bg-white text-[#17213B] overflow-hidden selection:bg-purple-100 selection:text-[#5125D8]">
      {/* ════════════════════════════════════════════════════════════
          1. HERO SECTION
          Fuller container (max-w-[1360px]), organic purple backdrop,
          hero creator photo, floating cards, cursive script accent
          ════════════════════════════════════════════════════════════ */}
      <section className="relative pt-10 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
        {/* Ambient background glow */}
        <div
          className="absolute -top-28 right-0 w-[640px] h-[640px] rounded-full pointer-events-none opacity-40 blur-3xl -z-10"
          style={{
            background: 'radial-gradient(circle, rgba(232, 224, 254, 0.8) 0%, rgba(245, 241, 255, 0.3) 60%, transparent 100%)',
          }}
        />

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Column — Content (6 cols) */}
            <div className="lg:col-span-6 text-center lg:text-left">
              {/* Badge Pill — Uniform across site */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F1FF] border border-[#E8E0FE] text-[#5125D8] text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#5125D8]" />
                <span>A New Space for Brands & Creators</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-black tracking-tight text-[#17213B] leading-[1.08] mb-6">
                Where Brands <br />
                <span className="text-[#5125D8]">Meet Creators.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-[#687087] mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Discover the right creators, build meaningful collaborations, and bring your brand's ideas to life.
              </p>

              {/* Action Buttons with Theme Glow Hover */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 mb-8">
                <button
                  id="btn-hero-brand"
                  onClick={() => handleGetStarted('BUSINESS')}
                  className="btn-cosmic-purple w-full sm:w-auto px-7 py-3.5 font-semibold text-sm gap-2"
                >
                  <span>I'm a Brand</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="btn-hero-creator"
                  onClick={() => handleGetStarted('CREATOR')}
                  className="btn-cosmic-white w-full sm:w-auto px-7 py-3.5 font-semibold text-sm gap-2"
                >
                  <span>I'm a Creator</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Trust statement */}
              <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-medium text-[#687087]">
                <Sparkles className="w-3.5 h-3.5 text-[#5125D8]" />
                <span>Be among the first to join 2BeCollab</span>
              </div>
            </div>

            {/* Right Column — Visual Composition (6 cols) */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[520px]">
                {/* Purple organic blob backdrop */}
                <div
                  className="absolute inset-0 rounded-[44px] transform rotate-1 scale-105 -z-10"
                  style={{
                    background: 'linear-gradient(135deg, #E8E0FE 0%, #D8CBFD 50%, #ECE4FF 100%)',
                  }}
                />

                {/* Main Hero Photo */}
                <div className="relative rounded-[32px] overflow-hidden shadow-2xl shadow-[#5125D8]/15 border-4 border-white">
                  <img
                    src="/images/hero-creator.jpg"
                    alt="Creator recording skincare review"
                    className="w-full h-[420px] sm:h-[480px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating Card 1 — Top Right (Beauty Creator) */}
                <div className="absolute -top-4 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-purple-200">
                    <img
                      src="/images/avatar-creator-1.jpg"
                      alt="Beauty Creator"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#17213B]">Beauty Creator</h4>
                    <p className="text-[10px] text-[#687087]">Skincare | Lifestyle | Fashion</p>
                  </div>
                  <button className="px-2.5 py-1 rounded-full bg-[#5125D8] text-white text-[10px] font-semibold hover:bg-[#4520B8] transition-colors ml-1">
                    + Follow
                  </button>
                </div>

                {/* Floating Card 2 — Bottom Left (Brand Collaboration) */}
                <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-100 bg-[#FAF9FF]">
                    <img
                      src="/images/skincare-thumb.jpg"
                      alt="Skincare Serum"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#17213B]">Brand Collaboration</h4>
                    <p className="text-[10px] text-[#687087]">Skincare & Beauty</p>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#5125D8] text-white flex items-center justify-center shrink-0 ml-1">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Cursive Handwriting Accent */}
                <div className="absolute -right-8 bottom-12 hidden sm:block pointer-events-none transform rotate-12">
                  <span className="font-handwriting text-xl text-[#5125D8] font-bold tracking-wide drop-shadow-sm">
                    Real Creators, Real Impact ~
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          2. VALUE PROPOSITIONS STRIP (4 Pillars)
          Balanced width, soft borders, and clean layout
          ════════════════════════════════════════════════════════════ */}
      <section className="py-7 bg-white border-y border-[#F0ECFC]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Search,
                title: 'Find the right match',
                desc: 'Connect with creators and brands that align with your goals.',
              },
              {
                icon: Clock,
                title: 'Save time',
                desc: 'Streamline your collaboration process, all in one place.',
              },
              {
                icon: Handshake,
                title: 'Build authentic partnerships',
                desc: 'Work with creators who share your values.',
              },
              {
                icon: TrendingUp,
                title: 'Grow together',
                desc: 'Create campaigns that make a real impact.',
              },
            ].map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="p-5 rounded-2xl bg-[#FAF9FF] border border-[#E8E0FE]/80 hover:border-[#5125D8]/50 hover:shadow-md hover:shadow-[#5125D8]/5 transition-all flex items-start gap-3.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F5F1FF] border border-[#E8E0FE] flex items-center justify-center text-[#5125D8] shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#17213B] mb-1 group-hover:text-[#5125D8] transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-[#687087] leading-relaxed font-normal">{pillar.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          3. FOR BRANDS SECTION
          Matches Reference Design: Text on left, workspace image on right
          with floating 'Next Campaign' checkmark card
          ════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column — Text (5 cols) */}
            <div className="lg:col-span-5">
              {/* Uniform Top Heading Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F1FF] border border-[#E8E0FE] text-[#5125D8] text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#5125D8]" />
                <span>FOR BRANDS</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-[#17213B] mb-4 leading-tight">
                Find Creators Who Fit <br />
                Your <span className="text-[#5125D8]">Brand.</span>
              </h2>
              <p className="text-sm sm:text-base text-[#687087] mb-8 leading-relaxed font-normal">
                Discover relevant creators, communicate your campaign needs, and build authentic partnerships that get results.
              </p>

              {/* Checkmarks list */}
              <div className="space-y-3.5 mb-8">
                {[
                  'Access a diverse pool of verified creators',
                  'Manage milestones & deliverables with ease',
                  'Track engagement & real conversion results',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#F5F1FF] text-[#5125D8] flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-sm font-medium text-[#17213B]">{item}</span>
                  </div>
                ))}
              </div>

              <button
                id="btn-join-brand"
                onClick={() => handleGetStarted('BUSINESS')}
                className="btn-cosmic-purple inline-flex px-7 py-3.5 font-semibold text-sm gap-2"
              >
                <span>Join as a Brand</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right Column — Workspace Composition with Floating Tag Card (7 cols) */}
            <div className="lg:col-span-7 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-100">
                <img
                  src="/images/brand-workspace.jpg"
                  alt="Workspace with campaign dashboard"
                  className="w-full h-[380px] sm:h-[440px] object-cover"
                />
              </div>

              {/* Floating Card: Your Brand Next Campaign */}
              <div className="absolute top-6 right-6 sm:top-8 sm:right-8 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-slate-100 w-56">
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                  <div>
                    <p className="text-[10px] text-[#687087] uppercase font-semibold">Your Brand</p>
                    <h5 className="text-xs font-bold text-[#17213B]">Next Campaign</h5>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#5125D8] text-white flex items-center justify-center">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  {['Skincare', 'Fashion', 'Lifestyle', 'Fitness'].map((tag) => (
                    <div key={tag} className="flex items-center gap-2 text-xs text-[#17213B]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#5125D8]" />
                      <span>{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          4. FOR CREATORS SECTION
          Matches Reference Design: Creator desk image on left, text on right
          with floating creator profile badge
          ════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-[#FAF9FF] border-y border-[#F0ECFC]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column — Image with Floating Card (7 cols) */}
            <div className="lg:col-span-7 relative order-2 lg:order-1">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-100">
                <img
                  src="/images/creator-filming-desk.jpg"
                  alt="Creator at desk recording content"
                  className="w-full h-[380px] sm:h-[440px] object-cover"
                />
              </div>

              {/* Floating Creator Profile Badge */}
              <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-purple-200">
                  <img
                    src="/images/avatar-creator-2.jpg"
                    alt="Creator"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#17213B]">Creator</h4>
                  <p className="text-[10px] text-[#687087]">Skincare | Lifestyle</p>
                </div>
                <button className="px-3 py-1 rounded-full bg-[#5125D8] text-white text-[11px] font-semibold hover:bg-[#4520B8] transition-colors ml-2">
                  + Follow
                </button>
              </div>
            </div>

            {/* Right Column — Text (5 cols) */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              {/* Uniform Top Heading Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F1FF] border border-[#E8E0FE] text-[#5125D8] text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#5125D8]" />
                <span>FOR CREATORS</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-[#17213B] mb-4 leading-tight">
                Turn Your Creativity <br />
                Into <span className="text-[#5125D8]">Opportunity.</span>
              </h2>
              <p className="text-sm sm:text-base text-[#687087] mb-8 leading-relaxed font-normal">
                Showcase your content, discover brand opportunities, and collaborate with businesses that value your work.
              </p>

              {/* Checkmarks list */}
              <div className="space-y-3.5 mb-8">
                {[
                  'Find relevant brand campaigns in your niche',
                  'Showcase your authentic portfolio & metrics',
                  'Get paid safely with escrow protection',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#F5F1FF] text-[#5125D8] flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-sm font-medium text-[#17213B]">{item}</span>
                  </div>
                ))}
              </div>

              <button
                id="btn-join-creator"
                onClick={() => handleGetStarted('CREATOR')}
                className="btn-cosmic-purple inline-flex px-7 py-3.5 font-semibold text-sm gap-2"
              >
                <span>Join as a Creator</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          5. INFINITE SMOOTH SCROLLING CREATOR STORIES SHOWCASE
          (Reference Screenshot 2 Implementation)
          Full-width marquee with rich creator story cards,
          uniform top heading, pause-on-hover, arrow controls
          ════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-white overflow-hidden">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
          {/* Uniform Section Top Heading */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F1FF] border border-[#E8E0FE] text-[#5125D8] text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#5125D8]" />
              <span>MEANINGFUL PARTNERSHIPS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight text-[#17213B] leading-[1.12] mb-4">
              Real People. Real Content. <span className="text-[#5125D8]">Real Opportunities.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#687087] leading-relaxed max-w-2xl mx-auto font-normal">
              Whether you're a brand with a story to share or a creator with a fresh perspective, 2BeCollab gives you a new space to connect, explore opportunities, and build meaningful partnerships.
            </p>
          </div>
        </div>

        {/* Full-width Infinite Marquee Container */}
        <div className="relative w-full">
          {/* Edge Fade Gradients for Seamless Look */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

          {/* Marquee Track with Duplicate Array for Seamless Loop */}
          <div
            ref={marqueeRef}
            className="flex overflow-x-auto no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="animate-marquee flex gap-6 px-4">
              {[...creatorStories, ...creatorStories].map((story, index) => (
                <div
                  key={`${story.id}-${index}`}
                  className="w-[300px] sm:w-[340px] h-[460px] sm:h-[490px] rounded-[28px] overflow-hidden relative shadow-lg shadow-purple-950/5 group border border-slate-200/80 shrink-0 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#5125D8]/15"
                >
                  {/* Background Full-Bleed Photograph */}
                  <img
                    src={story.image}
                    alt={story.headline}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient Scrim Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85 pointer-events-none" />

                  {/* Top Bar: Creator Info & Niche Badge */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-2.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                      <img
                        src={story.avatar}
                        alt={story.name}
                        className="w-7 h-7 rounded-full object-cover border border-white/60"
                      />
                      <div className="text-left">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-white leading-none">{story.name}</span>
                          {story.verified && (
                            <span className="w-3.5 h-3.5 rounded-full bg-[#5125D8] text-white flex items-center justify-center text-[9px] font-bold">
                              ✓
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-purple-200 font-medium">{story.handle}</span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-[#5125D8] shadow-sm">
                      {(story.category.split('&')[0] || story.category).trim()}
                    </span>
                  </div>

                  {/* Bottom Bar: Headline, Metrics & Round Purple Arrow Button */}
                  <div className="absolute bottom-5 left-5 right-5 z-10 flex items-end justify-between gap-3">
                    <div className="flex-1 text-left">
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#5125D8]/80 backdrop-blur-sm text-[10px] font-semibold text-white uppercase tracking-wider mb-2">
                        {story.category}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white leading-snug drop-shadow-md mb-1.5">
                        {story.headline}
                      </h3>
                      <p className="text-xs text-purple-100/90 font-medium">
                        {story.subtext}
                      </p>
                    </div>

                    {/* Circular Purple Button */}
                    <button
                      onClick={() => handleGetStarted('CREATOR')}
                      className="w-11 h-11 rounded-full bg-[#5125D8] hover:bg-[#683BF5] text-white flex items-center justify-center shrink-0 shadow-lg shadow-black/40 border border-white/30 group-hover:scale-110 transition-all cursor-pointer"
                      title="View Details"
                    >
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Marquee Navigation & Indicator Strip */}
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#687087]">
              <span className="w-2 h-2 rounded-full bg-[#5125D8] animate-pulse" />
              <span>Hover anywhere to pause • Showing trending collaborations</span>
            </div>

            {/* Prev / Next controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollMarquee('left')}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:border-[#5125D8] hover:bg-[#F5F1FF] text-[#17213B] hover:text-[#5125D8] flex items-center justify-center transition-all cursor-pointer shadow-sm"
                aria-label="Scroll left"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollMarquee('right')}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:border-[#5125D8] hover:bg-[#F5F1FF] text-[#17213B] hover:text-[#5125D8] flex items-center justify-center transition-all cursor-pointer shadow-sm"
                aria-label="Scroll right"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          6. HOW IT WORKS SECTION
          01 -> 02 -> 03 -> 04 connected flow
          ════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-[#FAF9FF] border-y border-[#F0ECFC]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Uniform Section Top Heading */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F1FF] border border-[#E8E0FE] text-[#5125D8] text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#5125D8]" />
              <span>HOW IT WORKS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight text-[#17213B] leading-[1.12] mb-4">
              Simple Steps. <span className="text-[#5125D8]">Big Opportunities.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#687087] leading-relaxed max-w-2xl mx-auto font-normal">
              Get started in just a few easy steps and be part of something amazing.
            </p>
          </div>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {/* Connecting line (desktop only) */}
            <div className="hidden lg:block absolute top-7 left-[14%] right-[14%] h-0.5 border-t border-dashed border-[#E8E0FE] -z-0" />

            {[
              {
                number: '01',
                icon: User,
                title: 'Create Your Profile',
                desc: 'Tell us a little about yourself, your social handles, and your goals.',
              },
              {
                number: '02',
                icon: Search,
                title: 'Discover & Connect',
                desc: 'Browse creators or brands that match your niche, style, and budget.',
              },
              {
                number: '03',
                icon: MessageSquare,
                title: 'Start Collaborating',
                desc: 'Chat directly, agree on deliverables, and fund milestones in escrow.',
              },
              {
                number: '04',
                icon: TrendingUp,
                title: 'Create & Grow',
                desc: 'Approve content, release payments safely, and build long-term partnerships.',
              },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative z-10 flex flex-col items-center text-center px-4">
                  <div className="relative mb-6">
                    <div className="w-14 h-14 rounded-full bg-white border-2 border-[#E8E0FE] flex items-center justify-center text-[#5125D8] shadow-sm hover:border-[#5125D8] transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#5125D8] text-white text-[10px] font-bold flex items-center justify-center">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#17213B] mb-2">{step.title}</h3>
                  <p className="text-xs text-[#687087] leading-relaxed max-w-[220px] font-normal">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          7. COLLABORATION PREVIEW SECTION
          Lavender Container, Real Campaigns, Real Opportunities
          ════════════════════════════════════════════════════════════ */}
      <section id="collaboration-preview" className="py-16 lg:py-24 bg-white">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-[36px] p-8 sm:p-12 lg:p-16 border border-[#E8E0FE]/80 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #F9F7FF 0%, #F5F1FF 60%, #ECE6FD 100%)',
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column (5 cols) */}
              <div className="lg:col-span-5 text-center lg:text-left">
                {/* Uniform Top Heading Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E0FE] text-[#5125D8] text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-[#5125D8]" />
                  <span>COLLABORATION PREVIEW</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight text-[#17213B] mb-4 leading-tight">
                  Real Campaigns. <br />
                  Real <span className="text-[#5125D8]">Opportunities.</span>
                </h2>

                <p className="text-sm sm:text-base text-[#687087] mb-8 leading-relaxed font-normal">
                  See how brands and creators come together for authentic and impactful collaborations with clear deliverables.
                </p>

                <button
                  onClick={() => navigate('/campaigns')}
                  className="btn-cosmic-purple inline-flex px-7 py-3.5 font-semibold text-sm gap-2"
                >
                  <span>Explore Campaigns</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Right Column — Composition (7 cols) */}
              <div className="lg:col-span-7 relative flex justify-center">
                <div className="relative w-full max-w-[480px]">
                  {/* Creator Photo */}
                  <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                    <img
                      src="/images/creator-preview.jpg"
                      alt="Creator holding serum product"
                      className="w-full h-[360px] sm:h-[420px] object-cover"
                    />
                  </div>

                  {/* Floating Creator Tag (Bottom Left) */}
                  <div className="absolute -bottom-4 -left-3 sm:-left-5 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-slate-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-purple-200">
                      <img
                        src="/images/avatar-creator-1.jpg"
                        alt="Creator avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-[#17213B]">Creator</h5>
                      <p className="text-[10px] text-[#687087]">Beauty | Lifestyle</p>
                    </div>
                  </div>

                  {/* Floating Brand Request Card (Right side) */}
                  <div className="absolute -top-3 -right-3 sm:-right-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-slate-100 w-56 sm:w-60">
                    <div className="flex items-center gap-2.5 mb-3 border-b border-slate-100 pb-2.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-purple-100">
                        <img
                          src="/images/avatar-brand-1.jpg"
                          alt="Brand avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-[#17213B]">Brand Request</h5>
                        <p className="text-[10px] text-[#687087]">Skincare Campaign</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-[#17213B] mb-4">
                      <div className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-[#5125D8]" />
                        <span>Product: Glow Serum</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-[#5125D8]" />
                        <span>Budget: $800 - $1,500</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-[#5125D8]" />
                        <span>Timeline: 2 Weeks</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('/campaigns')}
                      className="w-full py-2 rounded-xl bg-[#5125D8] hover:bg-[#4520B8] text-white text-xs font-semibold transition-colors cursor-pointer text-center"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          8. WHY 2BECOLLAB SECTION
          Built for Better Collaborations
          ════════════════════════════════════════════════════════════ */}
      <section id="why-us" className="py-20 lg:py-28 bg-white">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Uniform Section Top Heading */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F1FF] border border-[#E8E0FE] text-[#5125D8] text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#5125D8]" />
              <span>WHY 2BECOLLAB</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight text-[#17213B] leading-[1.12] mb-4">
              Built for Better <span className="text-[#5125D8]">Collaborations</span>
            </h2>
            <p className="text-sm sm:text-base text-[#687087] leading-relaxed max-w-2xl mx-auto font-normal">
              Designed to eliminate contract confusion, payment friction, and lost communication.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Handshake,
                title: 'Authentic Partnerships',
                desc: 'Connect with real creators and genuine brands aligned with your values.',
              },
              {
                icon: ShieldCheck,
                title: 'Secure & Escrow-Protected',
                desc: 'Milestone escrow guarantees payment on delivery and safeguards brand capital.',
              },
              {
                icon: Layers,
                title: 'All-in-One Workspace',
                desc: 'Briefs, contracts, file submissions, and approvals in a single streamlined hub.',
              },
              {
                icon: Headphones,
                title: 'Dedicated Support',
                desc: 'Our team is here 24/7 to resolve queries and ensure smooth collaborations.',
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="p-7 rounded-2xl bg-white border border-[#E8E0FE]/80 hover:border-[#5125D8]/50 hover:shadow-lg hover:shadow-[#5125D8]/8 transition-all flex flex-col items-center text-center group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#F5F1FF] border border-[#E8E0FE] flex items-center justify-center text-[#5125D8] mb-5 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#17213B] mb-2 group-hover:text-[#5125D8] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#687087] leading-relaxed font-normal">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          9. CTA BANNER (Upgraded Visual Appeal)
          Deep gradient, cosmic purple glow, dual mobile mockups,
          trust stats, and high-end glowing buttons
          ════════════════════════════════════════════════════════════ */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-[36px] p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden shadow-2xl shadow-[#5125D8]/25 border border-white/10"
            style={{
              background: 'linear-gradient(135deg, #160838 0%, #260B54 45%, #42169B 80%, #5125D8 100%)',
            }}
          >
            {/* Ambient Background Accents */}
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#7C4DFF]/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#5125D8]/30 blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              {/* Left Column: Overlapping Mobile Mockup Cards (4 cols) */}
              <div className="lg:col-span-4 flex items-center justify-center lg:justify-start gap-4">
                <div className="relative">
                  <div className="w-32 sm:w-40 h-52 sm:h-64 rounded-3xl overflow-hidden border-2 border-white/25 shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                    <img
                      src="/images/avatar-creator-1.jpg"
                      alt="Creator mobile preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-left">
                      <div className="flex items-center gap-1 text-[10px] text-purple-200 font-bold mb-0.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Brief Accepted</span>
                      </div>
                      <p className="text-xs font-bold text-white leading-tight">Summer Glow UGC</p>
                    </div>
                  </div>

                  {/* Floating Metric Pill */}
                  <div className="absolute -bottom-3 -left-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-purple-100 flex items-center gap-1.5 text-[11px] font-bold text-[#17213B]">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>4.9 / 5.0 Rating</span>
                  </div>
                </div>

                <div className="relative -ml-8 sm:-ml-10">
                  <div className="w-32 sm:w-40 h-52 sm:h-64 rounded-3xl overflow-hidden border-2 border-white/25 shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-300">
                    <img
                      src="/images/avatar-creator-2.jpg"
                      alt="Creator profile preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-left">
                      <div className="flex items-center gap-1 text-[10px] text-purple-200 font-bold mb-0.5">
                        <ShieldCheck className="w-3 h-3 text-[#5125D8]" />
                        <span>Escrow Funded</span>
                      </div>
                      <p className="text-xs font-bold text-white leading-tight">$1,200 Secured</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Column: Text (5 cols) */}
              <div className="lg:col-span-5 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-purple-200 text-xs font-semibold uppercase tracking-wider mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                  <span>READY TO GET STARTED?</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4 leading-[1.1]">
                  Your Next Collaboration <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-white">
                    Starts Here.
                  </span>
                </h2>

                <p className="text-sm sm:text-base text-purple-100/90 font-normal leading-relaxed max-w-md mx-auto lg:mx-0">
                  Join 2BeCollab and be part of a new space built for forward-thinking brands and authentic creators.
                </p>
              </div>

              {/* Right Column: CTA Buttons (3 cols) */}
              <div className="lg:col-span-3 flex flex-col gap-3.5 justify-center">
                <button
                  onClick={() => handleGetStarted('BUSINESS')}
                  className="btn-cosmic-white w-full py-3.5 px-6 font-bold text-sm gap-2"
                >
                  <span>Join as a Brand</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleGetStarted('CREATOR')}
                  className="w-full py-3.5 px-6 rounded-full font-bold text-sm text-white bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-md transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:shadow-white/10"
                >
                  <span>Join as a Creator</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          10. FAQ SECTION (Reference Screenshot 2 Layout)
          - Left Column: Uniform badge pill + Title + Contact
          - Right Column: Clean horizontal divider rows with rotating chevron
          - Expand/collapse toggle functionality verified
          ════════════════════════════════════════════════════════════ */}
      <section id="faq" className="py-20 lg:py-28 bg-white border-t border-slate-100">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column — Heading (5 cols) */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              {/* Uniform Top Heading Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F1FF] border border-[#E8E0FE] text-[#5125D8] text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#5125D8]" />
                <span>FREQUENTLY ASKED QUESTIONS</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#17213B] leading-[1.1] mb-6">
                Got questions? <br />
                We've got <span className="text-[#5125D8]">answers.</span>
              </h2>

              <p className="text-sm sm:text-base text-[#687087] leading-relaxed max-w-md font-normal mb-8">
                Everything you need to know about our marketplace, payments, and how brands and creators connect.
              </p>

              <div className="hidden lg:flex items-center gap-2 text-xs text-[#5125D8] font-semibold">
                <span>Still have questions?</span>
                <a
                  href="mailto:2becollab@gmail.com"
                  className="underline hover:text-[#4520B8] transition-colors flex items-center gap-1"
                >
                  Contact our support team <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Right Column — Accordion List (7 cols) */}
            <div className="lg:col-span-7 divide-y divide-slate-200/80">
              {faqItems.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={item.q} className="py-5 sm:py-6 first:pt-0">
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full text-left flex items-center justify-between gap-4 cursor-pointer group"
                      aria-expanded={isOpen}
                    >
                      <span className="text-base sm:text-lg font-semibold text-[#17213B] group-hover:text-[#5125D8] transition-colors leading-snug">
                        {item.q}
                      </span>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-[#5125D8] bg-[#F5F1FF]' : 'text-slate-400 group-hover:text-[#5125D8]'
                        }`}
                      >
                        <ChevronDown className="w-5 h-5 stroke-[2.5]" />
                      </div>
                    </button>

                    {/* Expandable answer */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'
                      }`}
                    >
                      <p className="text-sm text-[#687087] leading-relaxed font-normal pr-8">
                        {item.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
