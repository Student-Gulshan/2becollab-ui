import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Palette, Building2, ArrowLeft, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';

export function ChooseRolePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // If already logged in, redirect to home/dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const roles = [
    {
      id: 'creator',
      role: 'CREATOR',
      title: "I'm a Creator",
      description: 'Showcase your work, receive offers from brands, and get paid for collaborations.',
      icon: Palette,
      gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      glowColor: 'rgba(99, 102, 241, 0.2)',
      borderColor: 'rgba(99, 102, 241, 0.3)',
      features: ['Build your portfolio', 'Set your own rates', 'Receive brand offers'],
    },
    {
      id: 'brand',
      role: 'BUSINESS',
      title: "I'm a Brand",
      description: 'Find talented creators, run campaigns, and grow your brand through authentic content.',
      icon: Building2,
      gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
      glowColor: 'rgba(6, 182, 212, 0.2)',
      borderColor: 'rgba(6, 182, 212, 0.3)',
      features: ['Discover creators', 'Run campaigns', 'Track performance'],
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-12 animate-fade-in">
      {/* Background glow effects */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(6, 182, 212, 0.08) 0%, transparent 50%)
          `,
        }}
      />

      <div className="relative z-10 w-full max-w-3xl">
        {/* Back button */}
        <button
          id="btn-back-home"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mb-8 text-sm transition-colors duration-200 hover:text-white group"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to home
        </button>

        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5" style={{ color: 'var(--color-primary-light)' }} />
            <span
              className="text-sm font-medium"
              style={{ color: 'var(--color-primary-light)' }}
            >
              Join 2BeCollab
            </span>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ color: 'var(--color-text-primary)' }}
          >
            How do you want to{' '}
            <span className="gradient-text">get started?</span>
          </h1>
          <p
            className="text-lg"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Choose your role to create your account
          </p>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {roles.map((role, index) => (
            <button
              key={role.id}
              id={`btn-role-${role.id}`}
              onClick={() => navigate(`/auth/signup?role=${role.role}`)}
              className="group text-left p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 animate-slide-up"
              style={{
                backgroundColor: 'var(--color-bg-card)',
                border: `1px solid var(--color-border-light)`,
                boxShadow: 'var(--shadow-card)',
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'both',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = role.borderColor;
                e.currentTarget.style.boxShadow = `0 20px 40px -15px ${role.glowColor}, 0 0 30px ${role.glowColor}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border-light)';
                e.currentTarget.style.boxShadow = 'var(--shadow-card)';
              }}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                style={{ background: role.gradient }}
              >
                <role.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h2
                className="text-xl font-bold mb-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {role.title}
              </h2>
              <p
                className="text-sm mb-6 leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {role.description}
              </p>

              {/* Features */}
              <div className="space-y-2">
                {role.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 text-sm"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: role.gradient }}
                    />
                    {feature}
                  </div>
                ))}
              </div>

              {/* Arrow indicator */}
              <div
                className="mt-6 flex items-center gap-2 text-sm font-medium transition-all duration-300 group-hover:gap-3"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <span className="group-hover:text-white transition-colors">Join as {role.role === 'CREATOR' ? 'Creator' : 'Brand'}</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </button>
          ))}
        </div>

        {/* Existing account prompt */}
        <div className="text-center mt-10 animate-fade-in">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link
              to="/auth/login"
              className="text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-4 transition-colors"
            >
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
