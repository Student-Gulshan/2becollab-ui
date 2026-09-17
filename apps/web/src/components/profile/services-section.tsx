import React, { useState } from 'react';
import {
  useMyServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
} from '@/features/services/hooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  SocialPlatform,
  SOCIAL_PLATFORM_LABELS,
  ServicePackageResponse,
  CreateServicePackagePayload,
} from '@2becollab/types';
import {
  Package,
  Plus,
  Edit3,
  Trash2,
  Check,
  Clock,
  RotateCcw,
  Sparkles,
  Loader2,
  X,
} from 'lucide-react';

const COMMON_PRESETS = [
  {
    title: 'Instagram Reel + Story',
    platform: SocialPlatform.INSTAGRAM,
    format: 'Reel + Story',
    price: 350,
    deliveryDays: 5,
    revisions: 1,
    features: ['High-res 9:16 Reel', '24hr Story with Link Sticker', 'Sound & Music Rights'],
  },
  {
    title: 'Dedicated YouTube Video',
    platform: SocialPlatform.YOUTUBE,
    format: 'Dedicated Video',
    price: 800,
    deliveryDays: 10,
    revisions: 2,
    features: ['Full 5-8 min video', 'Pinned Comment link', 'Description link', 'Raw footage available'],
  },
  {
    title: 'TikTok Product Showcase',
    platform: SocialPlatform.TIKTOK,
    format: 'Short Video',
    price: 300,
    deliveryDays: 4,
    revisions: 1,
    features: ['Trending Sound Integration', 'Product Demonstration', 'Hashtag Optimization'],
  },
];

export function ServicesSection() {
  const { data: services = [], isLoading } = useMyServices();
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServicePackageResponse | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [platform, setPlatform] = useState<SocialPlatform>(SocialPlatform.INSTAGRAM);
  const [format, setFormat] = useState('Reel');
  const [price, setPrice] = useState<number>(250);
  const [currency, setCurrency] = useState('USD');
  const [deliveryDays, setDeliveryDays] = useState<number>(5);
  const [revisions, setRevisions] = useState<number>(1);
  const [featureInput, setFeatureInput] = useState('');
  const [features, setFeatures] = useState<string[]>([]);

  const handleOpenCreate = (preset?: typeof COMMON_PRESETS[0]) => {
    setEditingService(null);
    if (preset) {
      setTitle(preset.title);
      setDescription(`High-impact brand collaboration package for ${SOCIAL_PLATFORM_LABELS[preset.platform]}.`);
      setPlatform(preset.platform);
      setFormat(preset.format);
      setPrice(preset.price);
      setDeliveryDays(preset.deliveryDays);
      setRevisions(preset.revisions);
      setFeatures(preset.features);
    } else {
      setTitle('');
      setDescription('');
      setPlatform(SocialPlatform.INSTAGRAM);
      setFormat('Reel');
      setPrice(250);
      setDeliveryDays(5);
      setRevisions(1);
      setFeatures(['1 Revision Included', 'Full Commercial Rights']);
    }
    setCurrency('USD');
    setFeatureInput('');
    setModalOpen(true);
  };

  const handleOpenEdit = (pkg: ServicePackageResponse) => {
    setEditingService(pkg);
    setTitle(pkg.title);
    setDescription(pkg.description);
    setPlatform(pkg.platform);
    setFormat(pkg.format);
    setPrice(pkg.price);
    setCurrency(pkg.currency);
    setDeliveryDays(pkg.deliveryDays);
    setRevisions(pkg.revisions);
    setFeatures(pkg.features || []);
    setFeatureInput('');
    setModalOpen(true);
  };

  const handleAddFeature = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!featureInput.trim()) return;
    if (!features.includes(featureInput.trim())) {
      setFeatures([...features, featureInput.trim()]);
    }
    setFeatureInput('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || price <= 0) return;

    try {
      if (editingService) {
        await updateMutation.mutateAsync({
          id: editingService.id,
          payload: {
            title: title.trim(),
            description: description.trim(),
            platform,
            format: format.trim(),
            price,
            currency,
            deliveryDays,
            revisions,
            features,
          },
        });
      } else {
        const payload: CreateServicePackagePayload = {
          title: title.trim(),
          description: description.trim(),
          platform,
          format: format.trim(),
          price,
          currency,
          deliveryDays,
          revisions,
          features,
        };
        await createMutation.mutateAsync(payload);
      }
      setModalOpen(false);
    } catch (err: any) {
      alert('Failed to save service package');
    }
  };

  const handleDelete = async (pkg: ServicePackageResponse) => {
    if (window.confirm(`Are you sure you want to delete "${pkg.title}"?`)) {
      try {
        await deleteMutation.mutateAsync(pkg.id);
      } catch (err: any) {
        alert('Failed to delete package');
      }
    }
  };

  const handleToggleActive = async (pkg: ServicePackageResponse) => {
    try {
      await updateMutation.mutateAsync({
        id: pkg.id,
        payload: { isActive: !pkg.isActive },
      });
    } catch (err: any) {
      alert('Failed to toggle status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-400" />
            <span>Services & Pricing Packages</span>
          </h2>
          <p className="text-xs text-gray-400">
            Set fixed-rate packages so brands can discover your rates and book your services directly.
          </p>
        </div>

        <Button
          onClick={() => handleOpenCreate()}
          variant="primary"
          size="sm"
          className="flex items-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Package</span>
        </Button>
      </div>

      {/* Quick Presets Strip */}
      {services.length === 0 && (
        <Card variant="glass" padding="md" className="border border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Get Started Fast with Popular Presets</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {COMMON_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleOpenCreate(preset)}
                className="text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:border-emerald-500/40"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-white">{preset.title}</span>
                  <span className="text-xs font-bold text-emerald-400">${preset.price}</span>
                </div>
                <p className="text-[10px] text-gray-400 mb-2">{preset.features.join(' • ')}</p>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <Plus className="w-3 h-3" />
                  <span>Use Template</span>
                </span>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Services List */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        </div>
      ) : services.length === 0 ? (
        <Card variant="glass" padding="lg" className="text-center py-12">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3">
            <Package className="w-7 h-7 text-emerald-400" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No services created yet</h3>
          <p className="text-xs max-w-sm mx-auto mb-4 text-gray-400">
            Create standard packages for your Instagram Reels, YouTube videos, or TikToks to attract brand bookings.
          </p>
          <Button onClick={() => handleOpenCreate()} variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Create First Package</span>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((pkg) => {
            const sym = pkg.currency === 'INR' ? '₹' : '$';

            return (
              <Card
                key={pkg.id}
                variant="glass"
                padding="md"
                className={`relative flex flex-col justify-between border transition-all ${
                  pkg.isActive
                    ? 'border-white/10 hover:border-emerald-500/30'
                    : 'border-white/5 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {SOCIAL_PLATFORM_LABELS[pkg.platform] || pkg.platform} • {pkg.format}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleActive(pkg)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                        pkg.isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      }`}
                    >
                      {pkg.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">{pkg.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                    {pkg.description}
                  </p>

                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-2xl font-black text-white">{sym}{pkg.price.toLocaleString()}</span>
                    <span className="text-xs text-gray-400">/ package</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-300 mb-4 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{pkg.deliveryDays}d delivery</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{pkg.revisions} {pkg.revisions === 1 ? 'revision' : 'revisions'}</span>
                    </div>
                  </div>

                  {pkg.features && pkg.features.length > 0 && (
                    <ul className="space-y-1.5 mb-6">
                      {pkg.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-gray-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEdit(pkg)}
                    className="text-xs text-gray-300 hover:text-white"
                  >
                    <Edit3 className="w-3.5 h-3.5 mr-1" />
                    <span>Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(pkg)}
                    className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    <span>Delete</span>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <Card
            variant="glass"
            padding="lg"
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto border border-white/15 relative"
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">
              {editingService ? 'Edit Service Package' : 'Create Service Package'}
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Describe what deliverables brands receive and set your fixed price.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Package Title *</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 1 Instagram Reel + 1 Story Mention"
                  required
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Platform *</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
                    className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  >
                    {Object.values(SocialPlatform).map((p) => (
                      <option key={p} value={p} className="bg-gray-900 text-white">
                        {SOCIAL_PLATFORM_LABELS[p] || p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Format *</label>
                  <Input
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    placeholder="e.g. Reel, Short, Video"
                    required
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Price *</label>
                  <Input
                    type="number"
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                    className="text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  >
                    <option value="USD" className="bg-gray-900">USD ($)</option>
                    <option value="INR" className="bg-gray-900">INR (₹)</option>
                    <option value="EUR" className="bg-gray-900">EUR (€)</option>
                    <option value="GBP" className="bg-gray-900">GBP (£)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Delivery (Days)</label>
                  <Input
                    type="number"
                    min="1"
                    max="90"
                    value={deliveryDays}
                    onChange={(e) => setDeliveryDays(Number(e.target.value))}
                    required
                    className="text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your process, what the brand gets, and creative expectations..."
                  rows={3}
                  required
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Included Features</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={handleAddFeature}
                    placeholder="e.g. 1080p Full HD video"
                    className="text-xs"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleAddFeature}
                    className="text-xs px-3"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full text-[11px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5"
                    >
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  ) : null}
                  <span>{editingService ? 'Update Package' : 'Publish Package'}</span>
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
