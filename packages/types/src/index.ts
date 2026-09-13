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
