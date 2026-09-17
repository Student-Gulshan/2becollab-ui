import { Routes, Route } from 'react-router-dom';
import { RootLayout } from '@/components/layout/root-layout';
import { HomePage } from '@/pages/home';
import { NotFoundPage } from '@/pages/not-found';
import { ChooseRolePage } from '@/pages/auth/choose-role';
import { LoginPage } from '@/pages/auth/login';
import { SignupPage } from '@/pages/auth/signup';
import { VerifyEmailPage } from '@/pages/auth/verify-email';
import { ForgotPasswordPage } from '@/pages/auth/forgot-password';
import { ResetPasswordPage } from '@/pages/auth/reset-password';
import { AuthCallbackPage } from '@/pages/auth/callback';
import { ProfileEditPage } from '@/pages/profile/edit';
import { CreatorPublicProfilePage } from '@/pages/profile/creator-public';
import { BusinessPublicProfilePage } from '@/pages/profile/business-public';
import { CreatorDiscoveryPage } from '@/pages/creators';
import { CampaignDiscoveryPage } from '@/pages/campaigns';
import { CampaignManagePage } from '@/pages/campaigns/manage';
import { CampaignCreatePage } from '@/pages/campaigns/create';
import { CampaignDetailPage } from '@/pages/campaigns/detail';
import { MessagesPage } from '@/pages/messages';
import { OffersPage } from '@/pages/offers';
import { ContractsPage } from '@/pages/contracts';
import { ContractDetailPage } from '@/pages/contracts/detail';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        {/* Public pages */}
        <Route path="/" element={<HomePage />} />

        {/* Auth pages */}
        <Route path="/auth/choose-role" element={<ChooseRolePage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
        <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* Profile pages (Chunk 3 & 4) */}
        <Route path="/profile/edit" element={<ProfileEditPage />} />
        <Route path="/creators/:id" element={<CreatorPublicProfilePage />} />
        <Route path="/businesses/:id" element={<BusinessPublicProfilePage />} />

        {/* Creator Discovery & Search (Chunk 5) */}
        <Route path="/creators" element={<CreatorDiscoveryPage />} />

        {/* Campaign Management (Chunk 6) */}
        <Route path="/campaigns" element={<CampaignDiscoveryPage />} />
        <Route path="/campaigns/manage" element={<CampaignManagePage />} />
        <Route path="/campaigns/new" element={<CampaignCreatePage />} />
        <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
        <Route path="/campaigns/:id/edit" element={<CampaignCreatePage />} />

        {/* Real-Time Messaging (Chunk 7) */}
        <Route path="/messages" element={<MessagesPage />} />

        {/* Offers & Negotiation (Chunk 10) */}
        <Route path="/offers" element={<OffersPage />} />

        {/* Contracts & Escrow (Chunk 11 & 12) */}
        <Route path="/contracts" element={<ContractsPage />} />
        <Route path="/contracts/:id" element={<ContractDetailPage />} />

        {/* Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
