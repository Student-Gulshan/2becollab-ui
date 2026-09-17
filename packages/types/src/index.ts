// ============================================
// Shared Types — 2BeCollab Platform
// ============================================

// User roles
export enum UserRole {
  CREATOR = 'CREATOR',
  BUSINESS = 'BUSINESS',
  ADMIN = 'ADMIN',
  SUPPORT = 'SUPPORT',
}

// User account status
export enum UserStatus {
  REGISTERED = 'REGISTERED',
  EMAIL_PENDING = 'EMAIL_PENDING',
  ACTIVE = 'ACTIVE',
  RESTRICTED = 'RESTRICTED',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}

// Standard API response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode: number;
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    cursor?: string;
    hasMore: boolean;
  };
}

// Health check response
export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  database: 'connected' | 'disconnected';
  redis: 'connected' | 'disconnected';
}

// ============================================
// Auth Types
// ============================================

// Token types for verification tokens
export enum TokenType {
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

// User returned from API (never includes password hash)
export interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  emailVerifiedAt: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
  creatorProfile?: CreatorProfileResponse | null;
  businessProfile?: BusinessProfileResponse | null;
}

// Auth response from login/register
export interface AuthResponse {
  user: UserResponse;
  accessToken: string;
}

// JWT payload embedded in tokens
export interface JwtPayload {
  sub: string; // user ID
  email: string;
  role: UserRole;
}

// ============================================
// Profile Types (Chunk 3)
// ============================================

export const CREATOR_NICHES = [
  'Tech & Gadgets',
  'Fashion & Beauty',
  'Fitness & Health',
  'Gaming & Esports',
  'Lifestyle & Travel',
  'Food & Cooking',
  'Business & Finance',
  'Education & DIY',
  'Entertainment & Comedy',
  'Art & Design',
  'Parenting & Family',
  'Other',
] as const;

export type CreatorNiche = (typeof CREATOR_NICHES)[number] | string;

export interface CreatorProfileResponse {
  id: string;
  userId: string;
  headline: string | null;
  bio: string | null;
  niche: string[];
  location: string | null;
  languages: string[];
  websiteUrl: string | null;
  coverImageUrl: string | null;
  isVerified: boolean;
  ratingAverage: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    fullName: string;
    email?: string;
    avatarUrl: string | null;
  };
  socialAccounts?: SocialAccountResponse[];
  portfolioItems?: PortfolioItemResponse[];
}

export interface BusinessProfileResponse {
  id: string;
  userId: string;
  companyName: string | null;
  websiteUrl: string | null;
  industry: string | null;
  description: string | null;
  companySize: string | null;
  location: string | null;
  logoUrl: string | null;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    fullName: string;
    email?: string;
    avatarUrl: string | null;
  };
}

export interface UpdateCreatorProfilePayload {
  headline?: string;
  bio?: string;
  niche?: string[];
  location?: string;
  languages?: string[];
  websiteUrl?: string;
  coverImageUrl?: string;
}

export interface UpdateBusinessProfilePayload {
  companyName?: string;
  websiteUrl?: string;
  industry?: string;
  description?: string;
  companySize?: string;
  location?: string;
  logoUrl?: string;
}

export interface UpdateUserPayload {
  fullName?: string;
  avatarUrl?: string;
}

// ============================================
// Social Accounts & Portfolio Types (Chunk 4)
// ============================================

export enum SocialPlatform {
  INSTAGRAM = 'INSTAGRAM',
  YOUTUBE = 'YOUTUBE',
  TIKTOK = 'TIKTOK',
  TWITTER = 'TWITTER',
  LINKEDIN = 'LINKEDIN',
  FACEBOOK = 'FACEBOOK',
  OTHER = 'OTHER',
}

export const SOCIAL_PLATFORM_LABELS: Record<SocialPlatform, string> = {
  [SocialPlatform.INSTAGRAM]: 'Instagram',
  [SocialPlatform.YOUTUBE]: 'YouTube',
  [SocialPlatform.TIKTOK]: 'TikTok',
  [SocialPlatform.TWITTER]: 'X (Twitter)',
  [SocialPlatform.LINKEDIN]: 'LinkedIn',
  [SocialPlatform.FACEBOOK]: 'Facebook',
  [SocialPlatform.OTHER]: 'Other',
};

export const PORTFOLIO_CATEGORIES = [
  'Instagram Reel',
  'Instagram Post',
  'Instagram Story',
  'YouTube Video',
  'YouTube Short',
  'TikTok Video',
  'Blog Post',
  'Photo Campaign',
  'Unboxing',
  'Review',
  'Tutorial',
  'Other',
] as const;

export type PortfolioCategory = (typeof PORTFOLIO_CATEGORIES)[number] | string;

// Social Account
export interface SocialAccountResponse {
  id: string;
  creatorProfileId: string;
  platform: SocialPlatform;
  handle: string;
  profileUrl: string | null;
  followerCount: number | null;
  engagementRate: number | null;
  isVerified: boolean;
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSocialAccountPayload {
  platform: SocialPlatform;
  handle: string;
  profileUrl?: string;
  followerCount?: number;
  engagementRate?: number;
}

export interface UpdateSocialAccountPayload {
  handle?: string;
  profileUrl?: string;
  followerCount?: number;
  engagementRate?: number;
}

// Portfolio Item
export interface PortfolioItemResponse {
  id: string;
  creatorProfileId: string;
  title: string;
  description: string | null;
  mediaUrl: string;
  thumbnailUrl: string | null;
  externalUrl: string | null;
  category: string | null;
  platform: SocialPlatform | null;
  brandName: string | null;
  metrics: Record<string, number> | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePortfolioItemPayload {
  title: string;
  description?: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  externalUrl?: string;
  category?: string;
  platform?: SocialPlatform;
  brandName?: string;
  metrics?: Record<string, number>;
}

export interface UpdatePortfolioItemPayload {
  title?: string;
  description?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  externalUrl?: string;
  category?: string;
  platform?: SocialPlatform;
  brandName?: string;
  metrics?: Record<string, number>;
  sortOrder?: number;
}

export interface ReorderPortfolioPayload {
  itemIds: string[];
}

// ============================================
// Creator Discovery & Search (Chunk 5)
// ============================================

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface CreatorSearchQuery {
  query?: string;
  niches?: string[];
  platforms?: SocialPlatform[];
  minFollowers?: number;
  maxFollowers?: number;
  minRating?: number;
  location?: string;
  sortBy?: 'followers' | 'rating' | 'reviews' | 'newest';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CreatorSearchResult {
  id: string; // creatorProfileId
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  headline: string | null;
  bio: string | null;
  niche: string[];
  location: string | null;
  languages: string[];
  ratingAverage: number;
  reviewCount: number;
  isVerified: boolean;
  totalFollowers: number;
  avgEngagementRate: number | null;
  socialAccounts: SocialAccountResponse[];
  portfolioPreview: Array<{
    id: string;
    title: string;
    mediaUrl: string;
    thumbnailUrl: string | null;
    category: string | null;
    platform: SocialPlatform | null;
    brandName: string | null;
  }>;
}

export interface CreatorSearchResponse {
  items: CreatorSearchResult[];
  pagination: PaginationMeta;
}

// ============================================
// Campaign Management (Chunk 6)
// ============================================

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface CampaignDeliverable {
  id?: string;
  title: string;
  platform?: SocialPlatform;
  format?: string;
  quantity: number;
  description?: string;
}

export interface CampaignResponse {
  id: string;
  businessProfileId: string;
  businessProfile?: {
    id: string;
    userId: string;
    companyName: string | null;
    industry: string | null;
    logoUrl: string | null;
    location: string | null;
    websiteUrl: string | null;
    user?: {
      id: string;
      fullName: string;
      avatarUrl: string | null;
    };
  };
  title: string;
  description: string;
  coverImageUrl: string | null;
  niches: string[];
  platforms: SocialPlatform[];
  budgetMin: number | null;
  budgetMax: number | null;
  currency: string;
  deliverables: CampaignDeliverable[] | null;
  targetAudience: string | null;
  requirements: string | null;
  location: string | null;
  deadline: string | null;
  status: CampaignStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignPayload {
  title: string;
  description: string;
  coverImageUrl?: string;
  niches?: string[];
  platforms?: SocialPlatform[];
  budgetMin?: number;
  budgetMax?: number;
  currency?: string;
  deliverables?: CampaignDeliverable[];
  targetAudience?: string;
  requirements?: string;
  location?: string;
  deadline?: string;
  status?: CampaignStatus;
}

export interface UpdateCampaignPayload {
  title?: string;
  description?: string;
  coverImageUrl?: string;
  niches?: string[];
  platforms?: SocialPlatform[];
  budgetMin?: number;
  budgetMax?: number;
  currency?: string;
  deliverables?: CampaignDeliverable[];
  targetAudience?: string;
  requirements?: string;
  location?: string;
  deadline?: string;
  status?: CampaignStatus;
}

export interface CampaignSearchQuery {
  query?: string;
  niche?: string;
  platform?: SocialPlatform;
  status?: CampaignStatus;
  minBudget?: number;
  maxBudget?: number;
  currency?: string;
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'budget' | 'deadline';
  sortOrder?: 'asc' | 'desc';
}

export interface CampaignSearchResponse {
  items: CampaignResponse[];
  pagination: PaginationMeta;
}

// ============================================
// Messaging & Real-Time Chat (Chunk 7)
// ============================================

export interface MessageResponse {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  attachments?: any;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  sender?: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    role: UserRole;
  };
}

export interface ConversationParticipantSummary {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  role: UserRole;
  headline?: string | null;
  companyName?: string | null;
}

export interface ConversationResponse {
  id: string;
  participant1Id: string;
  participant2Id: string;
  campaignId: string | null;
  lastMessageAt: string;
  lastMessageText: string | null;
  createdAt: string;
  updatedAt: string;
  otherParticipant: ConversationParticipantSummary;
  unreadCount: number;
  campaign?: {
    id: string;
    title: string;
    status: CampaignStatus;
  } | null;
}

export interface SendMessagePayload {
  content: string;
  attachments?: any;
}

export interface StartConversationPayload {
  recipientId: string;
  campaignId?: string;
  initialMessage?: string;
}

export interface UnreadCountResponse {
  unreadCount: number;
}

// ============================================
// Creator Services & Pricing Packages (Chunk 8)
// ============================================

export interface ServicePackageResponse {
  id: string;
  creatorProfileId: string;
  title: string;
  description: string;
  platform: SocialPlatform;
  format: string;
  price: number;
  currency: string;
  deliveryDays: number;
  revisions: number;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServicePackagePayload {
  title: string;
  description: string;
  platform: SocialPlatform;
  format: string;
  price: number;
  currency?: string;
  deliveryDays?: number;
  revisions?: number;
  features?: string[];
  isActive?: boolean;
}

export interface UpdateServicePackagePayload {
  title?: string;
  description?: string;
  platform?: SocialPlatform;
  format?: string;
  price?: number;
  currency?: string;
  deliveryDays?: number;
  revisions?: number;
  features?: string[];
  isActive?: boolean;
}

// ============================================
// Campaign Applications & Invitations (Chunk 9)
// ============================================

export enum ApplicationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  CANCELLED = 'CANCELLED',
}

export interface CampaignApplicationResponse {
  id: string;
  campaignId: string;
  creatorProfileId: string;
  pitch: string;
  proposedRate: number | null;
  currency: string;
  status: ApplicationStatus;
  reviewNotes: string | null;
  createdAt: string;
  updatedAt: string;
  creator?: {
    id: string;
    userId: string;
    fullName: string;
    avatarUrl: string | null;
    headline: string | null;
    bio: string | null;
    location: string | null;
    niches: string[];
    ratingAverage: number;
    reviewCount: number;
    socialAccounts?: SocialAccountResponse[];
  };
  campaign?: {
    id: string;
    title: string;
    budgetMin: number | null;
    budgetMax: number | null;
    currency: string;
    deadline: string | null;
    status: CampaignStatus;
  };
}

export interface CampaignInvitationResponse {
  id: string;
  campaignId: string;
  creatorProfileId: string;
  message: string | null;
  status: InvitationStatus;
  createdAt: string;
  updatedAt: string;
  campaign?: {
    id: string;
    title: string;
    budgetMin: number | null;
    budgetMax: number | null;
    currency: string;
    deadline: string | null;
    status: CampaignStatus;
    business?: {
      companyName: string | null;
      logoUrl: string | null;
    };
  };
  creator?: {
    id: string;
    userId: string;
    fullName: string;
    avatarUrl: string | null;
  };
}

export interface ApplyCampaignPayload {
  pitch: string;
  proposedRate?: number;
  currency?: string;
}

export interface InviteCreatorPayload {
  campaignId: string;
  creatorProfileId: string;
  message?: string;
}

export interface UpdateApplicationStatusPayload {
  status: ApplicationStatus.ACCEPTED | ApplicationStatus.REJECTED;
  reviewNotes?: string;
}

export interface RespondInvitationPayload {
  status: InvitationStatus.ACCEPTED | InvitationStatus.DECLINED;
}

// ============================================
// Offers & Negotiation (Chunk 10)
// ============================================

export enum OfferStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  COUNTERED = 'COUNTERED',
  WITHDRAWN = 'WITHDRAWN',
  EXPIRED = 'EXPIRED',
}

export interface OfferDeliverableItem {
  id?: string;
  title: string;
  platform?: SocialPlatform;
  format?: string;
  count?: number;
  requirements?: string;
}

export interface OfferResponse {
  id: string;
  senderId: string;
  recipientId: string;
  creatorProfileId: string;
  campaignId: string | null;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  deliverables: OfferDeliverableItem[];
  revisionLimit: number;
  deadline: string;
  usageRights: string | null;
  exclusivityDays: number | null;
  parentOfferId: string | null;
  counterReason: string | null;
  status: OfferStatus;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  sender?: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    role: UserRole;
  };
  recipient?: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    role: UserRole;
  };
  creatorProfile?: {
    id: string;
    userId: string;
    headline: string | null;
    ratingAverage: number;
    reviewCount: number;
    user?: {
      fullName: string;
      avatarUrl: string | null;
    };
  };
  campaign?: {
    id: string;
    title: string;
  } | null;
  contract?: {
    id: string;
    contractNumber: string;
    status: ContractStatus;
  } | null;
  parentOffer?: {
    id: string;
    price: number;
    status: OfferStatus;
    title: string;
  } | null;
}

export interface CreateOfferPayload {
  recipientId: string;
  creatorProfileId: string;
  campaignId?: string;
  title: string;
  description?: string;
  price: number;
  currency?: string;
  deliverables: OfferDeliverableItem[];
  revisionLimit?: number;
  deadline: string;
  usageRights?: string;
  exclusivityDays?: number;
  expiresAt?: string;
}

export interface CounterOfferPayload {
  price?: number;
  deadline?: string;
  revisionLimit?: number;
  deliverables?: OfferDeliverableItem[];
  counterReason: string;
  usageRights?: string;
  exclusivityDays?: number;
}

export interface RespondOfferPayload {
  action: 'ACCEPT' | 'REJECT' | 'WITHDRAW';
}

// ============================================
// Contracts (Chunk 11)
// ============================================

export enum ContractStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  ACTIVE = 'ACTIVE',
  IN_REVIEW = 'IN_REVIEW',
  COMPLETED = 'COMPLETED',
  DISPUTED = 'DISPUTED',
  CANCELLED = 'CANCELLED',
}

export interface ContractTermsSnapshot {
  title: string;
  agreedPrice: number;
  platformFee: number;
  creatorEarnings: number;
  currency: string;
  deadline: string;
  revisionLimit: number;
  usageRights?: string | null;
  exclusivityDays?: number | null;
  deliverables: OfferDeliverableItem[];
  business: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    companyName?: string | null;
  };
  creator: {
    id: string;
    profileId: string;
    fullName: string;
    avatarUrl: string | null;
    headline?: string | null;
  };
  campaign?: {
    id: string;
    title: string;
  } | null;
  acceptedAt: string;
}

export interface ContractResponse {
  id: string;
  contractNumber: string;
  offerId: string;
  businessId: string;
  creatorId: string;
  creatorProfileId: string;
  campaignId: string | null;
  title: string;
  totalAmount: number;
  platformFee: number;
  creatorEarnings: number;
  currency: string;
  termsSnapshot: ContractTermsSnapshot;
  status: ContractStatus;
  startDate: string | null;
  dueDate: string;
  completedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  business?: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };
  creator?: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };
  campaign?: {
    id: string;
    title: string;
  } | null;
  escrowTransactions?: EscrowTransactionResponse[];
}

// ============================================
// Payments & Escrow (Chunk 12)
// ============================================

export enum EscrowStatus {
  PENDING = 'PENDING',
  HELD = 'HELD',
  RELEASED = 'RELEASED',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED',
}

export interface EscrowTransactionResponse {
  id: string;
  contractId: string;
  payerId: string;
  recipientId: string;
  amount: number;
  platformFee: number;
  creatorAmount: number;
  currency: string;
  status: EscrowStatus;
  paymentProvider: string;
  providerTransactionId: string | null;
  idempotencyKey: string;
  paidAt: string | null;
  releasedAt: string | null;
  refundedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  contractId: string;
  amount: number;
  platformFee: number;
  totalDue: number;
  currency: string;
  clientSecret?: string;
  paymentUrl?: string;
}

export interface ConfirmPaymentPayload {
  sessionId: string;
  providerPaymentId?: string;
}

