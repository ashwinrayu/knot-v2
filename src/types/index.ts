export interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
  description: string;
  department: string;
  prerequisites: string[];
}

export interface AIConfig {
  minGrade: string; // e.g., 'C' or '2.0'
  creditDifference: number; // e.g., maximum allowed difference
  similarityThreshold: number; // e.g., 75%
  confidenceThreshold: number; // e.g., 80%
  autoPublishThreshold: number; // e.g., 90% (if matching confidence is high, auto-publish)
  reviewThreshold: number; // e.g., below 80% requires review
}

export interface Institution {
  id: string;
  name: string;
  logo: string;
  email: string;
  website: string;
  address: string;
  primaryContact: {
    name: string;
    email: string;
    phone: string;
  };
  onboarded: boolean;
  aiConfig: AIConfig;
}

export interface ExtractedCourse {
  id: string;
  code: string;
  title: string;
  credits: number;
  grade: string;
  matchedCourseId: string | null; // Receiving college course ID
  matchedCourseCode: string | null; // Receiving college course code
  matchedCourseTitle: string | null; // Receiving college course title
  receivingCredits: number | null;
  confidence: number; // 0 to 100
  status: 'approved' | 'rejected' | 'pending';
  reason: string;
  alternativeSuggestions: Array<{
    courseId: string;
    code: string;
    title: string;
    similarity: number;
    reason: string;
  }>;
}

export interface Comment {
  id: string;
  author: string;
  role: 'admin' | 'admissions' | 'reviewer' | 'system';
  text: string;
  createdAt: string;
}

export interface TranscriptEvaluation {
  id: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  studentProgram: string;
  sendingInstitution: string;
  uploadedAt: string;
  status: 'processing' | 'pending_review' | 'published' | 'rejected';
  courses: ExtractedCourse[];
  confidenceScore: number; // Average confidence of matches
  processingTime: string; // e.g., '1.8s'
  notes?: string;
  comments: Comment[];
  history: Array<{
    id: string;
    action: string;
    user: string;
    timestamp: string;
    details?: string;
  }>;
}

export interface Lead {
  id: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  studentProgram: string;
  sendingInstitution: string;
  evaluationDate: string;
  leadScore: number; // Calculated based on number of transferrable credits
  status: 'new' | 'contacted' | 'evaluating' | 'won' | 'lost';
  notes: string[];
  evaluationId?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  role: string;
  action: string;
  timestamp: string;
  details: string;
}

export interface ScraperLog {
  id: string;
  url: string;
  timestamp: string;
  status: 'success' | 'failed';
  coursesExtractedCount: number;
  logs: string[];
  previewCourses?: Partial<Course>[];
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'admissions' | 'reviewer';
  avatar: string;
  permissions: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'staff' | 'sysadmin';
  avatar?: string;
  program?: string;
}

export interface Message {
  id: string;
  sender: string;
  senderRole: 'student' | 'staff' | 'system';
  text: string;
  timestamp: string;
  attachments?: Array<{ name: string; url: string }>;
}
