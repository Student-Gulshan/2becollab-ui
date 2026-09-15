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
