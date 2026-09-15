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

        {/* Profile pages (Chunk 3) */}
        <Route path="/profile/edit" element={<ProfileEditPage />} />
        <Route path="/creators/:id" element={<CreatorPublicProfilePage />} />
        <Route path="/businesses/:id" element={<BusinessPublicProfilePage />} />

        {/* Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
