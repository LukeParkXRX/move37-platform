export type UserRole = "startup" | "enabler" | "org_admin" | "super_admin";

export type EnablerBadge = "verified" | "top_rated" | "rising_star";

export type EnablerStatus = "pending" | "approved" | "suspended";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export type CreditTransactionType =
  | "purchase"
  | "allocate"
  | "use"
  | "refund"
  | "expire";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  orgId?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface EnablerProfile {
  userId: string;
  university: string;
  degreeType: string;
  specialties: string[];
  location: string;
  bio: string;
  creditRate: number;
  enablerScore: number;
  badgeLevel: EnablerBadge;
  status: EnablerStatus;
  sessionCount: number;
  rating: number;
  reRequestRate: number;
  availability: Record<string, string[]>;
}

export interface StartupProfile {
  userId: string;
  companyName: string;
  industry: string[];
  stage: string;
  usGoal: string;
  creditBalance: number;
  orgId?: string;
}

export interface Booking {
  id: string;
  startupId: string;
  enablerId: string;
  type: "chemistry" | "standard" | "project";
  status: BookingStatus;
  scheduledAt: string;
  creditsAmount: number;
  brief: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  programName: string;
  logoUrl?: string;
  inviteCode: string;
  totalCredits: number;
}

export interface Review {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  targetId: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Insight {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  tags: string[];
  publishedAt: string;
}
