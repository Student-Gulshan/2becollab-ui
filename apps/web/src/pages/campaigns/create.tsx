import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCampaign, useCreateCampaign, useUpdateCampaign } from '@/features/campaigns/hooks';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/api/error';
import {
  SocialPlatform,
  SOCIAL_PLATFORM_LABELS,
  CREATOR_NICHES,
  CampaignStatus,
} from '@2becollab/types';
import type { CampaignDeliverable } from '@2becollab/types';
import {
  Briefcase,
  ArrowLeft,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  AlertCircle,
  Sparkles,
  Layers,
  MapPin,
} from 'lucide-react';

export function CampaignCreatePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);

  const { data: existingCampaign } = useCampaign(id || '');
  const createMutation = useCreateCampaign();
  const updateMutation = useUpdateCampaign();

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [targetAudience, setTargetAudience] = useState('');
  const [requirements, setRequirements] = useState('');
  const [location, setLocation] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<CampaignStatus>(CampaignStatus.ACTIVE);

  // Deliverables state
  const [deliverables, setDeliverables] = useState<CampaignDeliverable[]>([
    { title: '1x Dedicated Promotion Video', quantity: 1, format: 'Video' },
  ]);

  const [errorMessage, setErrorMessage] = useState('');

  // Populate edit form
  useEffect(() => {
    if (existingCampaign) {
      setTitle(existingCampaign.title || '');
      setDescription(existingCampaign.description || '');
      setCoverImageUrl(existingCampaign.coverImageUrl || '');
      setSelectedNiches(existingCampaign.niches || []);
      setSelectedPlatforms(existingCampaign.platforms || []);
      setBudgetMin(existingCampaign.budgetMin ? String(existingCampaign.budgetMin) : '');
      setBudgetMax(existingCampaign.budgetMax ? String(existingCampaign.budgetMax) : '');
      setCurrency(existingCampaign.currency || 'USD');
      setTargetAudience(existingCampaign.targetAudience || '');
      setRequirements(existingCampaign.requirements || '');
      setLocation(existingCampaign.location || '');
      setDeadline(
        existingCampaign.deadline
          ? new Date(existingCampaign.deadline).toISOString().split('T')[0] ?? ''
          : '',
      );
      setStatus(existingCampaign.status || CampaignStatus.ACTIVE);
      if (existingCampaign.deliverables && existingCampaign.deliverables.length > 0) {
        setDeliverables(existingCampaign.deliverables);
      }
    }
  }, [existingCampaign]);

  const toggleNiche = (niche: string) => {
    if (selectedNiches.includes(niche)) {
      setSelectedNiches(selectedNiches.filter((n) => n !== niche));
    } else {
      setSelectedNiches([...selectedNiches, niche]);
    }
  };

  const togglePlatform = (p: SocialPlatform) => {
    if (selectedPlatforms.includes(p)) {
      setSelectedPlatforms(selectedPlatforms.filter((item) => item !== p));
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const addDeliverable = () => {
    setDeliverables([
      ...deliverables,
      { title: '', quantity: 1, format: 'Post' },
    ]);
  };

  const updateDeliverable = (index: number, field: keyof CampaignDeliverable, value: any) => {
    const updated = [...deliverables];
    const item = updated[index];
    if (!item) return;
    updated[index] = { ...item, [field]: value };
    setDeliverables(updated);
  };

  const removeDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Campaign title is required');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Campaign description is required');
      return;
    }

    const validDeliverables = deliverables
      .filter((d) => d.title.trim() !== '')
      .map((d) => ({
        ...d,
        quantity: Math.max(1, Number(d.quantity) || 1),
      }));

    const payload = {
      title: title.trim(),
      description: description.trim(),
      coverImageUrl: coverImageUrl.trim() || undefined,
      niches: selectedNiches,
      platforms: selectedPlatforms,
      budgetMin: budgetMin ? Number(budgetMin) : undefined,
      budgetMax: budgetMax ? Number(budgetMax) : undefined,
      currency,
      deliverables: validDeliverables.length > 0 ? validDeliverables : undefined,
      targetAudience: targetAudience.trim() || undefined,
      requirements: requirements.trim() || undefined,
      location: location.trim() || undefined,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
      status,
    };

    try {
      if (isEditMode && id) {
        await updateMutation.mutateAsync({ id, data: payload });
        navigate(`/campaigns/${id}`);
      } else {
        const res = await createMutation.mutateAsync(payload);
        navigate(`/campaigns/${res.data?.campaign.id || ''}`);
      }
    } catch (err: any) {
      setErrorMessage(getErrorMessage(err, 'Failed to save campaign'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {isEditMode ? 'Edit Campaign Brief' : 'Post a New Campaign'}
          </h1>
          <p className="text-sm text-gray-400">
            Define your project deliverables, budget, guidelines, and desired creator profile.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
          <p className="text-sm font-medium">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Card 1: Core Details */}
        <Card variant="glass" padding="lg">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            Basic Brief Details
          </h2>

          <div className="space-y-5">
            <Input
              label="Campaign Title"
              placeholder="e.g. Summer Fitness App Launch — Dedicated Reels & Reviews"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-300">
                  Campaign Description & Objective
                </label>
                <span className="text-xs text-gray-500">{description.length}/5000</span>
              </div>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the brand goal, key product features to highlight, campaign message, and call-to-action..."
                className="w-full rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-all resize-y"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)',
                }}
                required
              />
            </div>

            <Input
              label="Cover / Banner Image URL (Optional)"
              placeholder="https://images.unsplash.com/..."
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
            />
          </div>
        </Card>

        {/* Card 2: Niches & Platforms */}
        <Card variant="glass" padding="lg">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Target Niches & Social Platforms
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Creator Niches
              </label>
              <div className="flex flex-wrap gap-2">
                {CREATOR_NICHES.map((niche) => {
                  const isSelected = selectedNiches.includes(niche);
                  return (
                    <button
                      key={niche}
                      type="button"
                      onClick={() => toggleNiche(niche)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {niche}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Platforms
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.values(SocialPlatform).map((p) => {
                  const isSelected = selectedPlatforms.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePlatform(p)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                          : 'bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {SOCIAL_PLATFORM_LABELS[p]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>

        {/* Card 3: Deliverables Builder */}
        <Card variant="glass" padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              Required Deliverables
            </h2>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addDeliverable}
              className="flex items-center gap-1 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Deliverable</span>
            </Button>
          </div>

          <div className="space-y-4">
            {deliverables.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3 relative group"
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                  <div className="sm:col-span-6">
                    <Input
                      label={`Task #${idx + 1} Deliverable Title`}
                      placeholder="e.g. 1x 60s Reel with product unboxing"
                      value={item.title}
                      onChange={(e) => updateDeliverable(idx, 'title', e.target.value)}
                      required
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Platform
                    </label>
                    <select
                      value={item.platform || ''}
                      onChange={(e) =>
                        updateDeliverable(idx, 'platform', e.target.value ? (e.target.value as SocialPlatform) : undefined)
                      }
                      className="w-full rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none transition-all"
                      style={{
                        backgroundColor: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <option value="">Any</option>
                      {Object.values(SocialPlatform).map((p) => (
                        <option key={p} value={p}>
                          {SOCIAL_PLATFORM_LABELS[p]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      label="Qty"
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateDeliverable(idx, 'quantity', Number(e.target.value))}
                    />
                  </div>
                  <div className="sm:col-span-1 pt-7 flex justify-end">
                    {deliverables.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDeliverable(idx)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        title="Remove deliverable"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Specific requirements for this task (e.g. Include discount code in caption, tag @brand)"
                    value={item.description || ''}
                    onChange={(e) => updateDeliverable(idx, 'description', e.target.value)}
                    className="w-full rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-all"
                    style={{
                      backgroundColor: 'var(--color-bg-secondary)',
                      border: '1px solid var(--color-border)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Card 4: Budget & Schedule */}
        <Card variant="glass" padding="lg">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Compensation, Location & Timeline
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              label="Minimum Budget"
              type="number"
              min="0"
              placeholder="e.g. 500"
              value={budgetMin}
              onChange={(e) => setBudgetMin(e.target.value)}
            />
            <Input
              label="Maximum Budget"
              type="number"
              min="0"
              placeholder="e.g. 1500"
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-all"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              label="Application / Deliverable Deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              icon={<Calendar className="w-4 h-4" />}
            />
            <Input
              label="Creator Location / Geo Targeting"
              placeholder="e.g. Global / Remote or United States"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              icon={<MapPin className="w-4 h-4" />}
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Target Audience Demographics (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Men & Women 18-35 interested in tech and active lifestyle"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-all"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)',
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Creative Guidelines & Requirements (Dos and Don'ts)
              </label>
              <textarea
                rows={3}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Describe brand safety rules, prohibited words, mandatory mentions, or hashtag requirements..."
                className="w-full rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-all resize-y"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)',
                }}
              />
            </div>
          </div>
        </Card>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/10">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="secondary"
            onClick={() => setStatus(CampaignStatus.DRAFT)}
            isLoading={isSaving}
          >
            Save as Draft
          </Button>

          <Button
            type="submit"
            variant="primary"
            onClick={() => setStatus(CampaignStatus.ACTIVE)}
            isLoading={isSaving}
            className="min-w-[160px]"
          >
            {isEditMode ? 'Update Campaign' : 'Publish Campaign'}
          </Button>
        </div>
      </form>
    </div>
  );
}
