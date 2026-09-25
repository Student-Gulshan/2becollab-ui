import { useState } from 'react';
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  StatCard,
  SectionHeader,
  CreatorCard,
  CampaignCard,
  colors,
  gradients as _gradients,
} from '@/components/ui';
import {
  Sparkles,
  Zap,
  Shield,
  Star,
  Users,
  Briefcase,
  Copy,
  Check,
  Code2,
  Palette,
  Layers,
  Component,
} from 'lucide-react';

export function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'buttons' | 'badges' | 'cards' | 'stats' | 'colors'>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in">
      {/* Page Header */}
      <div className="relative mb-12 p-8 sm:p-12 rounded-3xl overflow-hidden glass border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, #06b6d4 100%)' }}
        />

        <div className="relative z-10 max-w-3xl">
          <Badge variant="primary" badgeStyle="glow" dot className="mb-4">
            UI Kit & Design System
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            Component Guide & <span className="gradient-text">Design Library</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg mb-6 leading-relaxed">
            Centralized, ready-to-use React components and design tokens for 2BeCollab.
            Any teammate or collaborator can inspect, test, and copy these modular components
            directly into their pages.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
            <span className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700">
              import &#123; Button, Badge, Card, StatCard &#125; from '@/components/ui'
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-slate-800">
        {[
          { id: 'all', label: 'All Components', icon: Component },
          { id: 'buttons', label: 'Buttons', icon: Zap },
          { id: 'badges', label: 'Badges & Pills', icon: Sparkles },
          { id: 'cards', label: 'Cards & Containers', icon: Layers },
          { id: 'stats', label: 'KPI & Stat Cards', icon: Star },
          { id: 'colors', label: 'Color Tokens', icon: Palette },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-indigo-500'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION: Buttons */}
      {(activeTab === 'all' || activeTab === 'buttons') && (
        <section className="mb-16">
          <SectionHeader
            title="Buttons"
            gradientText="& Actions"
            description="Interactive button elements supporting multiple visual variants, sizes, icon slots, and animated loading states."
            align="left"
            action={
              <button
                onClick={() =>
                  copyToClipboard(
                    `<Button variant="primary" size="md">Click Me</Button>`,
                    'btn-code'
                  )
                }
                className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20"
              >
                {copiedKey === 'btn-code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Snippet
              </button>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Variants */}
            <Card variant="default" padding="md">
              <CardTitle className="text-base mb-2">Button Variants</CardTitle>
              <CardDescription className="mb-6">
                Tailored gradients, glassy fills, and semantic alerts.
              </CardDescription>
              <div className="flex flex-wrap gap-3 items-center">
                <Button variant="primary">Primary (Glow)</Button>
                <Button variant="cyan">Cyber Cyan</Button>
                <Button variant="accent">Warm Accent</Button>
                <Button variant="secondary">Secondary (Glass)</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
            </Card>

            {/* Sizes & States */}
            <Card variant="default" padding="md">
              <CardTitle className="text-base mb-2">Sizes & States</CardTitle>
              <CardDescription className="mb-6">
                Micro (xs), compact (sm), standard (md), large (lg) + loading spinner.
              </CardDescription>
              <div className="flex flex-wrap gap-3 items-center">
                <Button size="xs" variant="primary">Size XS</Button>
                <Button size="sm" variant="primary">Size SM</Button>
                <Button size="md" variant="primary">Size MD</Button>
                <Button size="lg" variant="primary">Size LG</Button>
                <Button variant="secondary" isLoading>Loading</Button>
                <Button variant="primary" icon={<Sparkles className="w-4 h-4" />}>
                  With Icon
                </Button>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* SECTION: Badges */}
      {(activeTab === 'all' || activeTab === 'badges') && (
        <section className="mb-16">
          <SectionHeader
            title="Badges"
            gradientText="& Status Indicators"
            description="Informative chips for creator tiers, brand verification, workflow steps, and tag classification."
            align="left"
            action={
              <button
                onClick={() =>
                  copyToClipboard(
                    `<Badge variant="creator" badgeStyle="glow" dot>Creator Pro</Badge>`,
                    'badge-code'
                  )
                }
                className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20"
              >
                {copiedKey === 'badge-code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Snippet
              </button>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="default" padding="md">
              <CardTitle className="text-base mb-2">Glow & Highlight</CardTitle>
              <CardDescription className="mb-4">
                Eye-catching badges with animated status dots.
              </CardDescription>
              <div className="flex flex-wrap gap-2.5">
                <Badge variant="creator" badgeStyle="glow" dot>Creator</Badge>
                <Badge variant="brand" badgeStyle="glow" dot>Brand</Badge>
                <Badge variant="success" badgeStyle="glow" dot>Active Contract</Badge>
                <Badge variant="warning" badgeStyle="glow" dot>Pending Review</Badge>
              </div>
            </Card>

            <Card variant="default" padding="md">
              <CardTitle className="text-base mb-2">Subtle Tints</CardTitle>
              <CardDescription className="mb-4">
                Balanced, soft background badges for tags and categories.
              </CardDescription>
              <div className="flex flex-wrap gap-2.5">
                <Badge variant="primary" badgeStyle="subtle">Tech & Gaming</Badge>
                <Badge variant="secondary" badgeStyle="subtle">Fitness</Badge>
                <Badge variant="success" badgeStyle="subtle">Approved</Badge>
                <Badge variant="error" badgeStyle="subtle">Disputed</Badge>
                <Badge variant="neutral" badgeStyle="subtle">Draft</Badge>
              </div>
            </Card>

            <Card variant="default" padding="md">
              <CardTitle className="text-base mb-2">Outlined & Solid</CardTitle>
              <CardDescription className="mb-4">
                Crisp borders and high-contrast solid chips.
              </CardDescription>
              <div className="flex flex-wrap gap-2.5">
                <Badge variant="primary" badgeStyle="outline">Outline Primary</Badge>
                <Badge variant="secondary" badgeStyle="outline">Outline Cyan</Badge>
                <Badge variant="creator" badgeStyle="solid">Solid Creator</Badge>
                <Badge variant="brand" badgeStyle="solid">Solid Brand</Badge>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* SECTION: Cards & Containers */}
      {(activeTab === 'all' || activeTab === 'cards') && (
        <section className="mb-16">
          <SectionHeader
            title="Card Surfaces"
            gradientText="& Containers"
            description="Frosted glass surfaces, neon gradient border highlights, and interactive hover-lift containers."
            align="left"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="glass" padding="md">
              <CardHeader>
                <Badge variant="secondary" badgeStyle="subtle" className="w-fit mb-2">
                  Glass Variant
                </Badge>
                <CardTitle>Glassmorphism Surface</CardTitle>
                <CardDescription>
                  Blurred backdrop with subtle border shine, ideal for overlays and headers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-300">
                  Adds high depth and transparency to dark user interfaces.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="xs" variant="outline" className="w-full">
                  Learn More
                </Button>
              </CardFooter>
            </Card>

            <Card variant="interactive" padding="md">
              <CardHeader>
                <Badge variant="primary" badgeStyle="subtle" className="w-fit mb-2">
                  Interactive Variant
                </Badge>
                <CardTitle>Hover-Lift Card</CardTitle>
                <CardDescription>
                  Micro-animated hover elevation with indigo shadow projection.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-300">
                  Hover over this card to see smooth elevation and border reaction.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="xs" variant="primary" className="w-full">
                  Action Button
                </Button>
              </CardFooter>
            </Card>

            <Card variant="gradient-border" padding="md">
              <CardHeader>
                <Badge variant="brand" badgeStyle="glow" className="w-fit mb-2">
                  Gradient Border
                </Badge>
                <CardTitle>Neon Edge Card</CardTitle>
                <CardDescription>
                  Surrounded by a gradient aura for hero highlights and featured deals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-300">
                  Draws user attention instantly to key monetization features.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="xs" variant="cyan" className="w-full">
                  Featured Deal
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      )}

      {/* SECTION: KPI & Stat Cards */}
      {(activeTab === 'all' || activeTab === 'stats') && (
        <section className="mb-16">
          <SectionHeader
            title="KPI & Stat Cards"
            gradientText="& Metrics"
            description="Designed for dashboards, platform performance counters, and marketing proof."
            align="left"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              value="$4.8M"
              label="Creator Earnings"
              change="+28% YoY"
              isPositive={true}
              variant="primary"
              icon={<Zap className="w-4 h-4" />}
            />
            <StatCard
              value="12,450+"
              label="Active Creators"
              change="+1,200 this mo"
              isPositive={true}
              variant="cyan"
              icon={<Users className="w-4 h-4" />}
            />
            <StatCard
              value="99.4%"
              label="Escrow Payout Rate"
              description="Guaranteed protection"
              variant="accent"
              icon={<Shield className="w-4 h-4" />}
            />
            <StatCard
              value="4.9 / 5.0"
              label="Average Rating"
              change="From 15k reviews"
              isPositive={true}
              variant="default"
              icon={<Star className="w-4 h-4" />}
            />
          </div>
        </section>
      )}

      {/* SECTION: Marketplace Domain Cards */}
      {(activeTab === 'all') && (
        <section className="mb-16">
          <SectionHeader
            title="Marketplace Showcase Cards"
            gradientText="for Collaborations"
            description="Pre-built cards for creators and brand campaigns with built-in metadata, tags, and action buttons."
            align="left"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                Creator Profile Card Component
              </h3>
              <CreatorCard
                id="demo-creator-1"
                name="Aria Vance"
                handle="@aria_creates"
                niches={['Tech & AI', 'Lifestyle', 'Productivity']}
                platforms={[
                  { name: 'youtube', followers: '280K subs' },
                  { name: 'instagram', followers: '145K fans' },
                ]}
                rating={4.95}
                collabsCompleted={38}
                startingRate="$750"
                isVerified={true}
              />
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-cyan-400" />
                Brand Campaign Card Component
              </h3>
              <CampaignCard
                id="demo-campaign-1"
                title="SaaS AI Workspace Launch — TikTok & YouTube Shorts Video Promo"
                brandName="NexusAI Studios"
                budget="$1,500 – $3,000"
                niches={['SaaS', 'Productivity']}
                platforms={['TikTok', 'YouTube Shorts']}
                daysRemaining={6}
                applicantCount={18}
                isVerifiedBrand={true}
              />
            </div>
          </div>
        </section>
      )}

      {/* SECTION: Color Tokens */}
      {(activeTab === 'all' || activeTab === 'colors') && (
        <section className="mb-16">
          <SectionHeader
            title="Design Tokens"
            gradientText="& Color Swatches"
            description="Curated high-contrast HSL/HEX palette optimized for dark mode interfaces."
            align="left"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { name: 'Primary (Indigo)', hex: colors.brand.primary, desc: 'var(--color-primary)' },
              { name: 'Primary Glow', hex: '#818cf8', desc: 'var(--color-primary-light)' },
              { name: 'Secondary (Cyan)', hex: colors.brand.secondary, desc: 'var(--color-secondary)' },
              { name: 'Accent (Amber)', hex: colors.brand.accent, desc: 'var(--color-accent)' },
              { name: 'Success (Green)', hex: colors.semantic.success, desc: 'var(--color-success)' },
              { name: 'Deep Space BG', hex: '#0a0a16', desc: 'var(--color-bg-primary)' },
            ].map((color, idx) => (
              <div
                key={idx}
                onClick={() => copyToClipboard(color.hex, `color-${idx}`)}
                className="group p-3 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-600 transition-all cursor-pointer"
              >
                <div
                  className="w-full h-16 rounded-xl mb-3 border border-white/10 shadow-inner flex items-end justify-end p-1.5"
                  style={{ backgroundColor: color.hex }}
                >
                  <span className="text-[10px] font-mono bg-black/50 text-white px-1.5 py-0.5 rounded backdrop-blur">
                    {copiedKey === `color-${idx}` ? 'COPIED!' : color.hex}
                  </span>
                </div>
                <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {color.name}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {color.desc}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Developer Quick-Start Note */}
      <Card variant="glass" padding="md" className="border-indigo-500/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">
                Ready to use across your components
              </h4>
              <p className="text-xs text-slate-400">
                All components are fully typed with TypeScript and exported in <code>@/components/ui</code>.
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={() => copyToClipboard(`import { Button, Badge, Card, StatCard, CreatorCard, CampaignCard, SectionHeader } from '@/components/ui';`, 'quick-import')}
          >
            {copiedKey === 'quick-import' ? 'Copied Import Statement!' : 'Copy Import Statement'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
