export interface Session {
  id: string;
  teacherId: string;
  studentId: string;
  skillId: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  credits: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  videoRoomId?: string;
  reviewId?: string;
  createdAt: any;
}

export interface Review {
  id: string;
  sessionId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number; // 1-5
  comment: string;
  teachingQuality: number;
  communication: number;
  reliability: number;
  createdAt: any;
}
