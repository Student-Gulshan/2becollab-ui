import { useState } from 'react';
import {
  useMyPortfolio,
  useAddPortfolioItem,
  useUpdatePortfolioItem,
  useDeletePortfolioItem,
  useReorderPortfolio,
} from '@/features/portfolio/hooks';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/api/error';
import {
  SocialPlatform,
  SOCIAL_PLATFORM_LABELS,
} from '@2becollab/types';
import type { PortfolioItemResponse } from '@2becollab/types';
import {
  Plus,
  Trash2,
  Edit3,
  X,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Layers,
  Sparkles,
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
  Loader2,
  Building,
  Image as ImageIcon,
} from 'lucide-react';

const CATEGORY_PRESETS = [
  'Reel / Short',
  'YouTube Video',
  'Sponsored Post',
  'Photo Campaign',
  'Product Review',
  'UGC Video',
  'Story Series',
  'TikTok Trend',
  'Podcast Feature',
  'Blog Article',
  'Other',
];

function formatMetricNumber(val: number | undefined | null): string {
  if (val === null || val === undefined) return '0';
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
  return val.toString();
}

export function PortfolioSection() {
  const { data: items = [], isLoading } = useMyPortfolio();
  const addMutation = useAddPortfolioItem();
  const updateMutation = useUpdatePortfolioItem();
  const deleteMutation = useDeletePortfolioItem();
  const reorderMutation = useReorderPortfolio();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [category, setCategory] = useState('');
  const [platform, setPlatform] = useState<SocialPlatform | ''>('');
  const [brandName, setBrandName] = useState('');
  // Metrics form states
  const [views, setViews] = useState('');
  const [likes, setLikes] = useState('');
  const [comments, setComments] = useState('');
  const [reach, setReach] = useState('');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setMediaUrl('');
    setThumbnailUrl('');
    setExternalUrl('');
    setCategory('');
    setPlatform('');
    setBrandName('');
    setViews('');
    setLikes('');
    setComments('');
    setReach('');
    setEditingId(null);
    setShowModal(false);
    setFormError('');
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (item: PortfolioItemResponse) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description || '');
    setMediaUrl(item.mediaUrl);
    setThumbnailUrl(item.thumbnailUrl || '');
    setExternalUrl(item.externalUrl || '');
    setCategory(item.category || '');
    setPlatform(item.platform || '');
    setBrandName(item.brandName || '');
    const m = (item.metrics as Record<string, number>) || {};
    setViews(m.views !== undefined ? String(m.views) : '');
    setLikes(m.likes !== undefined ? String(m.likes) : '');
    setComments(m.comments !== undefined ? String(m.comments) : '');
    setReach(m.reach !== undefined ? String(m.reach) : '');
    setShowModal(true);
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Title is required');
      return;
    }
    if (!mediaUrl.trim()) {
      setFormError('Media URL is required');
      return;
    }

    const metricsObj: Record<string, number> = {};
    if (views) metricsObj.views = parseInt(views, 10) || 0;
    if (likes) metricsObj.likes = parseInt(likes, 10) || 0;
    if (comments) metricsObj.comments = parseInt(comments, 10) || 0;
    if (reach) metricsObj.reach = parseInt(reach, 10) || 0;

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      mediaUrl: mediaUrl.trim(),
      thumbnailUrl: thumbnailUrl.trim() || undefined,
      externalUrl: externalUrl.trim() || undefined,
      category: category.trim() || undefined,
      platform: platform ? (platform as SocialPlatform) : undefined,
      brandName: brandName.trim() || undefined,
      metrics: Object.keys(metricsObj).length > 0 ? metricsObj : undefined,
    };

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: payload });
      } else {
        await addMutation.mutateAsync(payload);
      }
      resetForm();
    } catch (err: any) {
      setFormError(getErrorMessage(err, 'Failed to save portfolio item'));
    }
  };

  const handleDelete = async (id: string, titleStr: string) => {
    if (window.confirm(`Are you sure you want to delete "${titleStr}"?`)) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err: any) {
        alert(getErrorMessage(err, 'Failed to delete portfolio item'));
      }
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const itemA = items[index];
    const itemB = items[targetIndex];
    if (!itemA || !itemB) return;

    const newItems = [...items];
    newItems[index] = itemB;
    newItems[targetIndex] = itemA;

    const ids = newItems.map((item) => item.id);
    try {
      await reorderMutation.mutateAsync(ids);
    } catch (err: any) {
      console.error('Failed to reorder items', err);
    }
  };

  const isSaving = addMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header card */}
      <Card variant="glass" padding="lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Creator Portfolio
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              Showcase your best campaigns, sponsored collaborations, UGC work, and top videos to potential brands.
            </p>
          </div>

          <Button
            onClick={openAddModal}
            variant="primary"
            className="flex items-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Work Sample</span>
          </Button>
        </div>
      </Card>

      {/* Portfolio Items Grid */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        </div>
      ) : items.length === 0 ? (
        <Card variant="glass" padding="lg" className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
            <Layers className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No work samples added yet</h3>
          <p className="text-sm max-w-md mx-auto mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            Adding past work samples and campaigns dramatically boosts brand inquiries by demonstrating your content quality and real engagement metrics.
          </p>
          <Button onClick={openAddModal} variant="primary" className="inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Your First Work Sample
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, index) => {
            const m = (item.metrics as Record<string, number>) || {};
            const displayImage = item.thumbnailUrl || item.mediaUrl;

            return (
              <Card
                key={item.id}
                variant="glass"
                padding="none"
                className="overflow-hidden group border border-white/10 hover:border-indigo-500/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Media / Thumbnail preview */}
                  <div className="relative aspect-video w-full bg-black/40 overflow-hidden">
                    <img
                      src={displayImage}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                    {/* Top badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-auto">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.category && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20">
                            {item.category}
                          </span>
                        )}
                        {item.platform && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 backdrop-blur-md">
                            {SOCIAL_PLATFORM_LABELS[item.platform]}
                          </span>
                        )}
                      </div>

                      {/* Reorder buttons */}
                      <div className="flex items-center bg-black/60 backdrop-blur-md rounded-lg border border-white/20 p-0.5 opacity-90 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleMove(index, 'up')}
                          disabled={index === 0 || reorderMutation.isPending}
                          className="p-1 hover:text-indigo-400 disabled:opacity-30 disabled:hover:text-current transition-colors text-white"
                          title="Move Up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMove(index, 'down')}
                          disabled={index === items.length - 1 || reorderMutation.isPending}
                          className="p-1 hover:text-indigo-400 disabled:opacity-30 disabled:hover:text-current transition-colors text-white"
                          title="Move Down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Bottom brand pill if present */}
                    {item.brandName && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/20 text-xs font-medium text-emerald-300">
                        <Building className="w-3 h-3" />
                        <span>Collab with {item.brandName}</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="text-base font-bold text-white leading-snug line-clamp-1">
                        {item.title}
                      </h4>
                      {item.externalUrl && (
                        <a
                          href={item.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                          title="Open Campaign Link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    {item.description && (
                      <p
                        className="text-xs line-clamp-2 mb-4 leading-relaxed"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {item.description}
                      </p>
                    )}

                    {/* Metrics grid */}
                    {(m.views || m.likes || m.comments || m.reach) && (
                      <div className="grid grid-cols-4 gap-2 pt-3 pb-1 border-t border-white/10 text-center">
                        {m.views !== undefined && (
                          <div className="flex flex-col items-center">
                            <span className="text-[10px] uppercase font-semibold text-gray-400 flex items-center gap-1 mb-0.5">
                              <Eye className="w-3 h-3 text-indigo-400" /> Views
                            </span>
                            <span className="text-xs font-bold text-white">
                              {formatMetricNumber(m.views)}
                            </span>
                          </div>
                        )}
                        {m.likes !== undefined && (
                          <div className="flex flex-col items-center">
                            <span className="text-[10px] uppercase font-semibold text-gray-400 flex items-center gap-1 mb-0.5">
                              <Heart className="w-3 h-3 text-pink-400" /> Likes
                            </span>
                            <span className="text-xs font-bold text-white">
                              {formatMetricNumber(m.likes)}
                            </span>
                          </div>
                        )}
                        {m.comments !== undefined && (
                          <div className="flex flex-col items-center">
                            <span className="text-[10px] uppercase font-semibold text-gray-400 flex items-center gap-1 mb-0.5">
                              <MessageCircle className="w-3 h-3 text-blue-400" /> Comments
                            </span>
                            <span className="text-xs font-bold text-white">
                              {formatMetricNumber(m.comments)}
                            </span>
                          </div>
                        )}
                        {m.reach !== undefined && (
                          <div className="flex flex-col items-center">
                            <span className="text-[10px] uppercase font-semibold text-gray-400 flex items-center gap-1 mb-0.5">
                              <TrendingUp className="w-3 h-3 text-emerald-400" /> Reach
                            </span>
                            <span className="text-xs font-bold text-white">
                              {formatMetricNumber(m.reach)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-5 py-3 border-t border-white/5 bg-white/[0.02] flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(item)}
                    className="text-xs flex items-center gap-1 text-gray-300 hover:text-white"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id, item.title)}
                    disabled={deleteMutation.isPending}
                    className="text-xs flex items-center gap-1 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal Dialog for Add / Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-2xl p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                {editingId ? 'Edit Work Sample' : 'Add New Work Sample'}
              </h3>
              <button
                type="button"
                onClick={resetForm}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 mb-5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Title / Campaign Name"
                  placeholder="e.g. Nike Summer Running Campaign"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <Input
                  label="Brand Name (Optional)"
                  placeholder="e.g. Nike, Gymshark, Spotify"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  icon={<Building className="w-4 h-4" />}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-all"
                    style={{
                      backgroundColor: 'var(--color-bg-secondary)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <option value="">Select Category...</option>
                    {CATEGORY_PRESETS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Platform (Optional)
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
                    className="w-full rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-all"
                    style={{
                      backgroundColor: 'var(--color-bg-secondary)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <option value="">None / Cross-Platform</option>
                    {Object.values(SocialPlatform).map((p) => (
                      <option key={p} value={p}>
                        {SOCIAL_PLATFORM_LABELS[p]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Input
                  label="Media URL (Image or Video Thumbnail)"
                  placeholder="https://images.unsplash.com/..."
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  icon={<ImageIcon className="w-4 h-4" />}
                  required
                />
                {mediaUrl && (
                  <div className="mt-2 relative w-full h-32 rounded-lg bg-black/40 overflow-hidden border border-white/10">
                    <img
                      src={mediaUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span className="absolute bottom-2 left-2 text-[10px] px-2 py-0.5 rounded bg-black/70 text-white border border-white/10">
                      Media Preview
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Thumbnail URL (Optional)"
                  placeholder="Leave blank to use Media URL"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                />
                <Input
                  label="External Campaign URL (Optional)"
                  placeholder="https://instagram.com/p/... or youtube.com/watch?v=..."
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  icon={<ExternalLink className="w-4 h-4" />}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Description / Results
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your role, creative concept, deliverable requirements, and engagement outcomes..."
                  className="w-full rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-all resize-y"
                  style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                  }}
                />
              </div>

              {/* Performance Metrics Inputs */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> Performance Metrics (Optional)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Input
                    label="Views"
                    type="number"
                    min="0"
                    placeholder="e.g. 150000"
                    value={views}
                    onChange={(e) => setViews(e.target.value)}
                  />
                  <Input
                    label="Likes"
                    type="number"
                    min="0"
                    placeholder="e.g. 12000"
                    value={likes}
                    onChange={(e) => setLikes(e.target.value)}
                  />
                  <Input
                    label="Comments"
                    type="number"
                    min="0"
                    placeholder="e.g. 850"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  />
                  <Input
                    label="Reach / Impressions"
                    type="number"
                    min="0"
                    placeholder="e.g. 250000"
                    value={reach}
                    onChange={(e) => setReach(e.target.value)}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <Button type="button" variant="ghost" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={isSaving}>
                  {editingId ? 'Save Changes' : 'Add to Portfolio'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
