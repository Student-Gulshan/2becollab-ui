import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContracts } from '@/features/contracts/hooks';
import { useAuthStore } from '@/stores/auth-store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ContractStatus,
} from '@2becollab/types';
import {
  FileText,
  Calendar,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export function ContractsPage() {
  const { user } = useAuthStore();
  const [selectedStatus, setSelectedStatus] = useState<ContractStatus | 'ALL'>('ALL');

  const { data: contracts = [], isLoading, error } = useContracts(
    selectedStatus === 'ALL' ? undefined : selectedStatus,
  );

  const getStatusBadge = (status: ContractStatus) => {
    switch (status) {
      case ContractStatus.PENDING_PAYMENT:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Lock className="w-3.5 h-3.5" /> Pending Escrow Deposit
          </span>
        );
      case ContractStatus.ACTIVE:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> Active (Escrow Secured)
          </span>
        );
      case ContractStatus.IN_REVIEW:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Clock className="w-3.5 h-3.5" /> Deliverables In Review
          </span>
        );
      case ContractStatus.COMPLETED:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed & Paid
          </span>
        );
      case ContractStatus.DISPUTED:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
            <AlertTriangle className="w-3.5 h-3.5" /> In Dispute
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
            <Sparkles className="w-4 h-4" /> Binding Agreements
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Collaboration Contracts
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Official agreements backed by 2BeCollab Escrow. Review terms, fund deposits, and track deliverable milestones.
          </p>
        </div>

        <Link to="/offers">
          <Button
            variant="secondary"
            className="border-white/10 bg-white/5 hover:bg-white/10 text-white gap-2 font-medium"
          >
            Review Active Offers &rarr;
          </Button>
        </Link>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {(['ALL', ...Object.values(ContractStatus)] as const).map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedStatus === status
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {status === 'ALL'
              ? 'All Contracts'
              : status.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Contract Cards */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto" />
          <p className="text-sm text-gray-400">Loading contracts...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p>Failed to load contracts. Please refresh or try again.</p>
        </div>
      ) : contracts.length === 0 ? (
        <Card className="p-16 text-center border-white/10 bg-white/5 rounded-2xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 mx-auto">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">No contracts found</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Contracts are generated automatically whenever an offer or proposal is accepted by both parties.
          </p>
          <div className="pt-2">
            <Link to="/offers">
              <Button className="bg-emerald-600 hover:bg-emerald-500 text-white">
                View Negotiation Offers
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contracts.map((contract) => {
            const isBusiness = contract.businessId === user?.id;
            const counterparty = isBusiness ? contract.creator : contract.business;

            return (
              <Card
                key={contract.id}
                className="p-6 border border-white/10 rounded-2xl flex flex-col justify-between transition-all hover:border-white/20 hover:shadow-xl group"
                style={{ backgroundColor: 'var(--color-bg-secondary, #18181b)' }}
              >
                <div className="space-y-4">
                  {/* Top Reference & Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-black/40 border border-white/10 text-emerald-400">
                      {contract.contractNumber}
                    </span>
                    {getStatusBadge(contract.status)}
                  </div>

                  {/* Title & Campaign */}
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {contract.title}
                    </h3>
                    {contract.campaign && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        Campaign: {contract.campaign.title}
                      </p>
                    )}
                  </div>

                  {/* Counterparty info */}
                  <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl text-xs">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      {counterparty?.fullName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="text-gray-400 text-[10px] uppercase tracking-wider">
                        {isBusiness ? 'Creator' : 'Hiring Brand'}
                      </div>
                      <div className="font-semibold text-white">{counterparty?.fullName}</div>
                    </div>
                  </div>

                  {/* Terms Snapshot Preview */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Due {new Date(contract.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{contract.termsSnapshot?.revisionLimit ?? 2} Revisions</span>
                    </div>
                  </div>
                </div>

                {/* Footer Price & View CTA */}
                <div className="pt-5 mt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase tracking-wider">
                      Contract Value
                    </span>
                    <span className="text-xl font-bold text-emerald-400">
                      ${contract.totalAmount.toFixed(2)}{' '}
                      <span className="text-xs font-normal text-gray-400">{contract.currency}</span>
                    </span>
                  </div>

                  <Link to={`/contracts/${contract.id}`}>
                    <Button
                      size="sm"
                      className="bg-white/5 hover:bg-emerald-600 border border-white/10 hover:border-emerald-500 text-white gap-1.5 text-xs transition-all font-semibold"
                    >
                      View Terms <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
