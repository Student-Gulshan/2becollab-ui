import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOffers, useRespondOffer } from '@/features/offers/hooks';
import { useAuthStore } from '@/stores/auth-store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CounterOfferModal } from '@/components/offers/counter-offer-modal';
import {
  OfferResponse,
  OfferStatus,
} from '@2becollab/types';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  XCircle,
  ArrowLeftRight,
  FileText,
  Clock,
  Ban,
  Loader2,
  Send,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export function OffersPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [selectedOfferForCounter, setSelectedOfferForCounter] = useState<OfferResponse | null>(null);

  const { data: offers = [], isLoading, error } = useOffers(activeTab);
  const respondOfferMutation = useRespondOffer();

  const handleAction = (offerId: string, action: 'ACCEPT' | 'REJECT' | 'WITHDRAW') => {
    respondOfferMutation.mutate({ offerId, payload: { action } });
  };

  const getStatusBadge = (status: OfferStatus) => {
    switch (status) {
      case OfferStatus.PENDING:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" /> Awaiting Action
          </span>
        );
      case OfferStatus.ACCEPTED:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Accepted & Contract Created
          </span>
        );
      case OfferStatus.COUNTERED:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <ArrowLeftRight className="w-3.5 h-3.5" /> Countered
          </span>
        );
      case OfferStatus.REJECTED:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
            <XCircle className="w-3.5 h-3.5" /> Declined
          </span>
        );
      case OfferStatus.WITHDRAWN:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/10 text-gray-400 border border-gray-500/20">
            <Ban className="w-3.5 h-3.5" /> Withdrawn
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> Deal Negotiation Hub
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Collaboration Offers
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Review formal proposals, negotiate deliverables & rates, and lock in binding contracts.
          </p>
        </div>

        <Link to="/contracts">
          <Button
            variant="secondary"
            className="border-white/10 bg-white/5 hover:bg-white/10 text-white gap-2 font-medium"
          >
            <FileText className="w-4 h-4 text-emerald-400" /> View Signed Contracts
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('received')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'received'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Received Offers
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'sent'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Sent Offers
        </button>
      </div>

      {/* Content List */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto" />
          <p className="text-sm text-gray-400">Loading collaboration offers...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p>Failed to load offers. Please refresh or try again.</p>
        </div>
      ) : offers.length === 0 ? (
        <Card className="p-16 text-center border-white/10 bg-white/5 rounded-2xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 mx-auto">
            <Send className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">No {activeTab} offers yet</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            {activeTab === 'received'
              ? 'When brands or creators send you formal collaboration proposals, they will appear here.'
              : 'Offers you send to creators or brands will be tracked here throughout the negotiation lifecycle.'}
          </p>
          <div className="pt-2">
            <Link to="/creators">
              <Button className="bg-emerald-600 hover:bg-emerald-500 text-white">
                Browse Marketplace Creators
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {offers.map((offer) => {
            const isRecipient = offer.recipientId === user?.id;
            const isPending = offer.status === OfferStatus.PENDING;
            const otherParty = isRecipient ? offer.sender : offer.recipient;

            return (
              <Card
                key={offer.id}
                className="p-6 border border-white/10 rounded-2xl transition-all hover:border-white/20"
                style={{ backgroundColor: 'var(--color-bg-secondary, #18181b)' }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left Info */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      {getStatusBadge(offer.status)}
                      {offer.campaign && (
                        <span className="text-xs px-2.5 py-1 rounded-md bg-white/5 text-gray-300 border border-white/10">
                          Campaign: {offer.campaign.title}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(offer.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white">{offer.title}</h3>
                      {offer.description && (
                        <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                          {offer.description}
                        </p>
                      )}
                    </div>

                    {/* Counter Note if applicable */}
                    {offer.counterReason && (
                      <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300">
                        <strong>Counter-Offer Rationale:</strong> {offer.counterReason}
                      </div>
                    )}

                    {/* Metadata Pill Grid */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Deadline: {new Date(offer.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{offer.revisionLimit} Revisions</span>
                      </div>
                      {offer.usageRights && (
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-blue-400" />
                          <span>Rights: {offer.usageRights}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-400">With:</span>
                        <strong className="text-white">{otherParty?.fullName}</strong>
                      </div>
                    </div>

                    {/* Deliverables summary */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {offer.deliverables.map((del, i) => (
                        <span
                          key={i}
                          className="text-xs px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-gray-300"
                        >
                          {del.count}x {del.title} ({del.platform || 'General'})
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Price & Actions */}
                  <div className="flex flex-col items-start lg:items-end justify-between border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6 space-y-4">
                    <div className="text-left lg:text-right">
                      <span className="text-xs text-gray-400 block uppercase tracking-wider">
                        Agreed Compensation
                      </span>
                      <span className="text-3xl font-extrabold text-emerald-400">
                        ${offer.price.toFixed(2)}{' '}
                        <span className="text-xs text-gray-400 font-normal">{offer.currency}</span>
                      </span>
                    </div>

                    {/* Action Buttons based on status */}
                    <div className="flex flex-wrap items-center gap-2">
                      {offer.status === OfferStatus.ACCEPTED && offer.contract && (
                        <Link to={`/contracts/${offer.contract.id}`}>
                          <Button className="bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5 font-semibold text-xs">
                            <FileText className="w-3.5 h-3.5" /> View Contract ({offer.contract.contractNumber})
                          </Button>
                        </Link>
                      )}

                      {isPending && isRecipient && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleAction(offer.id, 'ACCEPT')}
                            disabled={respondOfferMutation.isPending}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Accept Offer
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setSelectedOfferForCounter(offer)}
                            className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10 text-xs font-semibold"
                          >
                            <ArrowLeftRight className="w-3.5 h-3.5 mr-1" /> Counter
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAction(offer.id, 'REJECT')}
                            disabled={respondOfferMutation.isPending}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs"
                          >
                            Decline
                          </Button>
                        </>
                      )}

                      {isPending && !isRecipient && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleAction(offer.id, 'WITHDRAW')}
                          disabled={respondOfferMutation.isPending}
                          className="border-white/10 text-gray-400 hover:text-red-400 text-xs"
                        >
                          Withdraw Offer
                        </Button>
                      )}

                      <Link to={`/messages`}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-gray-400 hover:text-white p-2"
                          title="Message counterparty"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Counter Offer Modal */}
      {selectedOfferForCounter && (
        <CounterOfferModal
          isOpen={!!selectedOfferForCounter}
          onClose={() => setSelectedOfferForCounter(null)}
          offer={selectedOfferForCounter}
        />
      )}
    </div>
  );
}
