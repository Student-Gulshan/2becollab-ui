import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Users, Shield, ArrowRight, UserCheck } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { useAuthStore } from '@/stores/auth-store';

export function HomePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [healthStatus, setHealthStatus] = useState<string>('checking...');

  useEffect(() => {
    apiClient
      .get('/health')
      .then((res) => {
        setHealthStatus(res.data?.data?.status === 'ok' ? '✅ All systems operational' : '⚠️ Degraded');
      })
      .catch(() => {
        setHealthStatus('❌ API offline');
      });
  }, []);

  const isCreator = user?.role === 'CREATOR';
  const isBusiness = user?.role === 'BUSINESS';

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        {/* Background decoration */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 60%)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-slide-up">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                color: 'var(--color-primary-light)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Platform Status: {healthStatus}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
            <span style={{ color: 'var(--color-text-primary)' }}>Where Creators</span>
            <br />
            <span className="gradient-text">Meet Brands</span>
          </h1>

          <p
            className="max-w-2xl mx-auto text-lg sm:text-xl mb-10"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            The marketplace that makes creator-brand collaborations as easy as
            hiring a freelancer. Discover, communicate, agree, deliver, get paid.
          </p>

          {isAuthenticated && user ? (
            <div className="flex flex-col items-center justify-center gap-4 animate-slide-up">
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: isBusiness ? 'rgba(6, 182, 212, 0.12)' : 'rgba(99, 102, 241, 0.12)',
                  border: `1px solid ${isBusiness ? 'rgba(6, 182, 212, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
                  color: isBusiness ? '#22d3ee' : '#a5b4fc',
                }}
              >
                <UserCheck className="w-3.5 h-3.5" />
                {isBusiness ? '🏢 Brand Member' : isCreator ? '🎨 Creator Member' : 'Member'} • {user.fullName}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  id="btn-hero-profile-edit"
                  onClick={() => navigate('/profile/edit')}
                  className="group flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105"
                  style={{
                    background: isBusiness
                      ? 'linear-gradient(135deg, #06b6d4, #0891b2)'
                      : 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                    boxShadow: isBusiness
                      ? '0 0 25px rgba(6, 182, 212, 0.35)'
                      : 'var(--shadow-glow)',
                  }}
                >
                  {isBusiness ? 'Manage Brand Profile' : 'Edit Creator Profile'}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  id="btn-hero-profile-public"
                  onClick={() => navigate(isBusiness ? `/businesses/${user.id}` : `/creators/${user.id}`)}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: 'var(--color-bg-card)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  View Public Profile
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                id="btn-hero-creator"
                onClick={() => navigate('/auth/signup?role=CREATOR')}
                className="group flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                  boxShadow: 'var(--shadow-glow)',
                }}
              >
                Join as Creator
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                id="btn-hero-business"
                onClick={() => navigate('/auth/signup?role=BUSINESS')}
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
              >
                Join as Brand
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-20"
        style={{ backgroundColor: 'var(--color-bg-secondary)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              How It Works
            </h2>
            <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
              Simple, structured, and safe collaborations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Discover & Connect',
                description:
                  'Find the perfect creator or brand match using smart filters — niche, platform, audience, budget, and more.',
                color: 'var(--color-primary)',
              },
              {
                icon: Zap,
                title: 'Negotiate & Contract',
                description:
                  'Send offers, negotiate terms, and lock in contracts with clear deliverables, deadlines, and pricing.',
                color: 'var(--color-secondary)',
              },
              {
                icon: Shield,
                title: 'Deliver & Get Paid',
                description:
                  'Submit content, get approvals, and receive guaranteed payouts. Disputes are resolved fairly by our team.',
                color: 'var(--color-accent)',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border-light)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${feature.color} 15%, transparent)`,
                  }}
                >
                  <feature.icon
                    className="w-6 h-6"
                    style={{ color: feature.color }}
                  />
                </div>
                <h3
                  className="text-xl font-semibold mb-3"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {feature.title}
                </h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10%', label: 'Platform Commission' },
              { value: '90%', label: 'Creator Earnings' },
              { value: '100%', label: 'Payment Protection' },
              { value: '24/7', label: 'Dispute Support' },
            ].map((stat, index) => (
              <div key={index}>
                <div
                  className="text-3xl sm:text-4xl font-bold mb-1 gradient-text"
                >
                  {stat.value}
                </div>
                <div
                  className="text-sm"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
