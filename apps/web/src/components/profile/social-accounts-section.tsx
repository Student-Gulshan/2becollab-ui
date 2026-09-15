import { useState } from 'react';
import {
  useMySocialAccounts,
  useAddSocialAccount,
  useUpdateSocialAccount,
  useDeleteSocialAccount,
} from '@/features/social-accounts/hooks';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/api/error';
import {
  SocialPlatform,
  SOCIAL_PLATFORM_LABELS,
} from '@2becollab/types';
import type { SocialAccountResponse } from '@2becollab/types';
import {
  Plus,
  Trash2,
  Edit3,
  X,
  Instagram,
  Youtube,
  Linkedin,
  Facebook,
  Twitter,
  Globe,
  Users,
  TrendingUp,
  Loader2,
} from 'lucide-react';

const PLATFORM_ICONS: Record<SocialPlatform, React.ReactNode> = {
  [SocialPlatform.INSTAGRAM]: <Instagram className="w-5 h-5" />,
  [SocialPlatform.YOUTUBE]: <Youtube className="w-5 h-5" />,
  [SocialPlatform.TIKTOK]: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.11V9a6.33 6.33 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 0010.86 4.43V13.4a8.16 8.16 0 005.58 2.17V12.1a4.84 4.84 0 01-3.45-1.44 4.84 4.84 0 001.45-3.97z" />
    </svg>
  ),
  [SocialPlatform.TWITTER]: <Twitter className="w-5 h-5" />,
  [SocialPlatform.LINKEDIN]: <Linkedin className="w-5 h-5" />,
  [SocialPlatform.FACEBOOK]: <Facebook className="w-5 h-5" />,
  [SocialPlatform.OTHER]: <Globe className="w-5 h-5" />,
};

const PLATFORM_COLORS: Record<SocialPlatform, string> = {
  [SocialPlatform.INSTAGRAM]: 'from-pink-500 to-purple-600',
  [SocialPlatform.YOUTUBE]: 'from-red-500 to-red-600',
  [SocialPlatform.TIKTOK]: 'from-gray-800 to-black',
  [SocialPlatform.TWITTER]: 'from-sky-400 to-sky-600',
  [SocialPlatform.LINKEDIN]: 'from-blue-600 to-blue-700',
  [SocialPlatform.FACEBOOK]: 'from-blue-500 to-blue-700',
  [SocialPlatform.OTHER]: 'from-gray-500 to-gray-600',
};

function formatFollowers(count: number | null): string {
  if (count === null || count === undefined) return '—';
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}

export function SocialAccountsSection() {
  const { data: accounts = [], isLoading } = useMySocialAccounts();
  const addMutation = useAddSocialAccount();
  const updateMutation = useUpdateSocialAccount();
  const deleteMutation = useDeleteSocialAccount();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  // Form state
  const [platform, setPlatform] = useState<SocialPlatform>(SocialPlatform.INSTAGRAM);
  const [handle, setHandle] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [followerCount, setFollowerCount] = useState('');
  const [engagementRate, setEngagementRate] = useState('');

  const resetForm = () => {
    setPlatform(SocialPlatform.INSTAGRAM);
    setHandle('');
    setProfileUrl('');
    setFollowerCount('');
    setEngagementRate('');
    setShowForm(false);
    setEditingId(null);
    setFormError('');
  };

  const openEditForm = (account: SocialAccountResponse) => {
    setEditingId(account.id);
    setPlatform(account.platform);
    setHandle(account.handle);
    setProfileUrl(account.profileUrl || '');
    setFollowerCount(account.followerCount?.toString() || '');
    setEngagementRate(account.engagementRate?.toString() || '');
    setShowForm(true);
    setFormError('');
  };

  // Which platforms are already linked
  const linkedPlatforms = new Set(accounts.map((a) => a.platform));
  const availablePlatforms = Object.values(SocialPlatform).filter(
    (p) => !linkedPlatforms.has(p) || (editingId && accounts.find((a) => a.id === editingId)?.platform === p),
  );

  const handleSubmit = async () => {
    setFormError('');
    if (!handle.trim()) {
      setFormError('Handle is required');
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          data: {
            handle: handle.trim(),
            profileUrl: profileUrl.trim() || undefined,
            followerCount: followerCount ? parseInt(followerCount, 10) : undefined,
            engagementRate: engagementRate ? parseFloat(engagementRate) : undefined,
          },
        });
      } else {
        await addMutation.mutateAsync({
          platform,
          handle: handle.trim(),
          profileUrl: profileUrl.trim() || undefined,
          followerCount: followerCount ? parseInt(followerCount, 10) : undefined,
          engagementRate: engagementRate ? parseFloat(engagementRate) : undefined,
        });
      }
      resetForm();
    } catch (err: any) {
      setFormError(getErrorMessage(err, 'Failed to save social account'));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err: any) {
      setFormError(getErrorMessage(err, 'Failed to remove social account'));
    }
  };

  const isMutating = addMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return (
      <Card variant="glass" padding="lg">
        <div className="flex items-center justify-center py-8 gap-3 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading social accounts...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="glass" padding="lg" className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-sky-400" />
          Social Accounts
        </h2>
        {!showForm && availablePlatforms.length > 0 && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => { resetForm(); setShowForm(true); }}
            id="add-social-account-btn"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Platform
          </Button>
        )}
      </div>

      <p className="text-xs text-gray-400 -mt-2">
        Link your social media accounts so brands can see your reach and engagement.
      </p>

      {/* Linked accounts list */}
      {accounts.length > 0 && (
        <div className="grid gap-3">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${PLATFORM_COLORS[account.platform]} flex items-center justify-center text-white`}
                >
                  {PLATFORM_ICONS[account.platform]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">
                      {SOCIAL_PLATFORM_LABELS[account.platform]}
                    </span>
                    <span className="text-xs text-gray-400">@{account.handle}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-0.5">
                    {account.followerCount !== null && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Users className="w-3 h-3" />
                        {formatFollowers(account.followerCount)}
                      </span>
                    )}
                    {account.engagementRate !== null && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <TrendingUp className="w-3 h-3" />
                        {account.engagementRate.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => openEditForm(account)}
                  className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(account.id)}
                  disabled={deleteMutation.isPending}
                  className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {accounts.length === 0 && !showForm && (
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mx-auto mb-3">
            <Globe className="w-6 h-6 text-sky-400" />
          </div>
          <p className="text-sm text-gray-400 mb-3">
            No social accounts linked yet. Add your platforms to showcase your audience.
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setShowForm(true)}
          >
            <Plus className="w-4 h-4 mr-1" /> Add Your First Platform
          </Button>
        </div>
      )}

      {/* Add / Edit Form */}
      {showForm && (
        <div className="p-4 rounded-xl bg-white/5 border border-white/15 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              {editingId ? 'Edit Social Account' : 'Add Social Account'}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {formError && (
            <p className="text-xs text-red-400">{formError}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {!editingId && (
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none transition-all"
                  style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {availablePlatforms.map((p) => (
                    <option key={p} value={p}>{SOCIAL_PLATFORM_LABELS[p]}</option>
                  ))}
                </select>
              </div>
            )}

            <Input
              label="Handle / Username"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="e.g. johndoe"
              required
            />
          </div>

          <Input
            label="Profile URL (optional)"
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
            placeholder="https://instagram.com/johndoe"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Follower Count"
              value={followerCount}
              onChange={(e) => setFollowerCount(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="e.g. 150000"
              type="text"
            />
            <Input
              label="Engagement Rate (%)"
              value={engagementRate}
              onChange={(e) => setEngagementRate(e.target.value)}
              placeholder="e.g. 3.5"
              type="text"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" size="sm" onClick={resetForm}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              isLoading={isMutating}
            >
              {editingId ? 'Update Account' : 'Add Account'}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
