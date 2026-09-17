import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useContract, useUpdateContractStatus } from '@/features/contracts/hooks';
import { useAuthStore } from '@/stores/auth-store';
import { EscrowCheckoutModal } from '@/components/payments/escrow-checkout-modal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ContractStatus,
} from '@2becollab/types';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Lock,
  MessageSquare,
  Loader2,
  AlertCircle,
  Building,
  User as UserIcon,
} from 'lucide-react';

export function ContractDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  const { data: contract, isLoading, error, refetch } = useContract(id);
  const updateStatusMutation = useUpdateContractStatus();

  if (isLoading) {
    return (
      <div className="min-h-screen py-24 text-center space-y-3">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-400 mx-auto" />
        <p className="text-gray-400 text-sm">Loading legal agreement snapshot...</p>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="min-h-screen py-24 px-4 max-w-xl mx-auto text-center space-y-4">
        <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400">
          <AlertCircle className="w-10 h-10 mx-auto mb-3" />
          <h2 className="text-lg font-bold">Contract Not Found</h2>
          <p className="text-sm text-gray-400 mt-1">
            Unable to load contract. You may not have permission or it may have been deleted.
          </p>
        </div>
        <Link to="/contracts">
          <Button variant="secondary" className="border-white/10 text-white">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Contracts
          </Button>
        </Link>
      </div>
    );
  }

  const isBusiness = contract.businessId === user?.id;
  const isCreator = contract.creatorId === user?.id;
  const terms = contract.termsSnapshot;

  const handleMarkInReview = () => {
    updateStatusMutation.mutate({
      id: contract.id,
      status: ContractStatus.IN_REVIEW,
      reason: 'All deliverables submitted for brand review',
    });
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Top Nav & Reference */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <Link
            to="/contracts"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Contracts
          </Link>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
              {contract.contractNumber}
            </span>
            <span className="text-xs text-gray-400">
              Accepted: {new Date(terms?.acceptedAt || contract.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {contract.title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link to={`/messages`}>
            <Button
              variant="secondary"
              className="border-white/10 bg-white/5 hover:bg-white/10 text-white gap-2 text-xs font-semibold"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" /> Message Counterparty
            </Button>
          </Link>
        </div>
      </div>

      {/* Escrow Status & Action Banner */}
      {contract.status === ContractStatus.PENDING_PAYMENT && (
        <Card className="p-6 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border-amber-500/30 rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Lock className="w-4 h-4" /> Escrow Deposit Required
              </div>
              <p className="text-xs text-gray-300 max-w-xl">
                {isBusiness
                  ? `To activate this contract, please deposit $${contract.totalAmount.toFixed(2)} into 2BeCollab Escrow. Funds are safely locked until you approve the completed deliverables.`
                  : `Waiting for the hiring business to fund the escrow deposit ($${contract.totalAmount.toFixed(2)}). Production should begin once escrow is confirmed.`}
              </p>
            </div>

            {isBusiness && (
              <Button
                onClick={() => setCheckoutModalOpen(true)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm px-6 shadow-lg shadow-emerald-900/40"
              >
                <Lock className="w-4 h-4 mr-2" />
                Fund Escrow (${contract.totalAmount.toFixed(2)})
              </Button>
            )}
          </div>
        </Card>
      )}

      {contract.status === ContractStatus.ACTIVE && (
        <Card className="p-6 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border-emerald-500/30 rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" /> Contract Active — Escrow Secured
              </div>
              <p className="text-xs text-gray-300 max-w-xl">
                ${contract.totalAmount.toFixed(2)} is currently held safely in 2BeCollab Escrow. Deliverables are due by{' '}
                <strong>{new Date(contract.dueDate).toLocaleDateString()}</strong>.
              </p>
            </div>

            {isCreator && (
              <Button
                onClick={handleMarkInReview}
                disabled={updateStatusMutation.isPending}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-5"
              >
                <Clock className="w-4 h-4 mr-1.5" /> Submit for Brand Review
              </Button>
            )}
          </div>
        </Card>
      )}

      {contract.status === ContractStatus.IN_REVIEW && (
        <Card className="p-6 bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-transparent border-blue-500/30 rounded-2xl">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <div>
              <div className="text-sm font-bold text-blue-400">Deliverables In Review</div>
              <p className="text-xs text-gray-300">
                The creator has submitted deliverables. The brand is inspecting files against agreed specifications.
              </p>
            </div>
          </div>
        </Card>
      )}

      {contract.status === ContractStatus.COMPLETED && (
        <Card className="p-6 bg-gradient-to-r from-purple-500/15 via-emerald-500/10 to-transparent border-purple-500/30 rounded-2xl">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <div className="text-sm font-bold text-white">Contract Completed & Escrow Released</div>
              <p className="text-xs text-gray-300">
                All agreed deliverables were approved on{' '}
                {new Date(contract.completedAt || contract.updatedAt).toLocaleDateString()}. Funds have been released to the creator.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Contract Document Body */}
      <div
        className="p-8 sm:p-12 border border-white/10 rounded-2xl space-y-10 shadow-2xl relative"
        style={{ backgroundColor: 'var(--color-bg-secondary, #18181b)' }}
      >
        {/* Document Watermark / Stamp */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Creator Collaboration Agreement</h2>
              <p className="text-xs text-gray-400">Official Immutable Terms Snapshot</p>
            </div>
          </div>

          <div className="text-right font-mono text-xs text-gray-400">
            <div>Ref: {contract.contractNumber}</div>
            <div className="text-emerald-400 font-semibold uppercase">{contract.status}</div>
          </div>
        </div>

        {/* Contracting Parties Snapshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Party A: Business */}
          <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <Building className="w-4 h-4 text-emerald-400" /> Party A: Hiring Business
            </div>
            <div className="text-lg font-bold text-white">
              {terms?.business?.companyName || terms?.business?.fullName || contract.business?.fullName}
            </div>
            <div className="text-xs text-gray-400">
              User ID: {contract.businessId}
            </div>
          </div>

          {/* Party B: Creator */}
          <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <UserIcon className="w-4 h-4 text-emerald-400" /> Party B: Creator
            </div>
            <div className="text-lg font-bold text-white">
              {terms?.creator?.fullName || contract.creator?.fullName}
            </div>
            <div className="text-xs text-gray-400">
              Headline: {terms?.creator?.headline || 'Content Creator'}
            </div>
          </div>
        </div>

        {/* Agreed Deliverables Schedule */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
            1. Deliverables & Specifications
          </h3>
          <div className="space-y-3">
            {terms?.deliverables?.map((del, i) => (
              <div
                key={i}
                className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="font-semibold text-white text-sm">
                    {del.count}x {del.title}
                  </div>
                  {del.requirements && (
                    <div className="text-xs text-gray-400 mt-0.5">{del.requirements}</div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <span className="px-2.5 py-1 rounded bg-black/40 border border-white/10">
                    Platform: {del.platform || 'Cross-Platform'}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-black/40 border border-white/10">
                    Format: {del.format || 'Standard'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Consideration & Escrow Schedule */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
            2. Financial Consideration & Escrow Schedule
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1">
              <span className="text-xs text-gray-400 block uppercase tracking-wider">Total Contract Value</span>
              <span className="text-2xl font-extrabold text-white">
                ${contract.totalAmount.toFixed(2)}
              </span>
              <span className="text-[10px] text-gray-400 block">{contract.currency}</span>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1">
              <span className="text-xs text-gray-400 block uppercase tracking-wider">Platform & Escrow Fee (10%)</span>
              <span className="text-2xl font-extrabold text-gray-300">
                ${contract.platformFee.toFixed(2)}
              </span>
              <span className="text-[10px] text-gray-400 block">Insures transaction & escrow</span>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1">
              <span className="text-xs text-emerald-400 block uppercase tracking-wider font-semibold">Net Creator Earnings</span>
              <span className="text-2xl font-extrabold text-emerald-400">
                ${contract.creatorEarnings.toFixed(2)}
              </span>
              <span className="text-[10px] text-emerald-300/70 block">Disbursed on approval</span>
            </div>
          </div>
        </div>

        {/* Term Specifications & Rights */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
            3. Operational Terms & Usage Rights
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-300">
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1">
              <span className="text-gray-400 block uppercase tracking-wider">Completion Due Date</span>
              <strong className="text-white text-sm">
                {new Date(contract.dueDate).toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </strong>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1">
              <span className="text-gray-400 block uppercase tracking-wider">Revision Limits</span>
              <strong className="text-white text-sm">
                {terms?.revisionLimit ?? 2} Revisions Included
              </strong>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1 sm:col-span-2">
              <span className="text-gray-400 block uppercase tracking-wider">Content Usage Rights</span>
              <strong className="text-white text-sm">
                {terms?.usageRights || 'Standard digital organic and commercial promotional license.'}
              </strong>
            </div>
          </div>
        </div>

        {/* Immutable Audit Seal */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Digital Agreement signed and verified via 2BeCollab Platform.</span>
          </div>
          <div>Contract ID: {contract.id}</div>
        </div>
      </div>

      {/* Escrow Checkout Modal */}
      {checkoutModalOpen && (
        <EscrowCheckoutModal
          isOpen={checkoutModalOpen}
          onClose={() => setCheckoutModalOpen(false)}
          contract={contract}
          onPaymentSuccess={() => refetch()}
        />
      )}
    </div>
  );
}
