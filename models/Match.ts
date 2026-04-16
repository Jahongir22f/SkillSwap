export interface Match {
  id: string;
  users: string[]; // [user1Id, user2Id]
  compatibilityScore: number;
  matchedSkills: string[];
  createdAt: any;
  status: 'pending' | 'accepted' | 'declined';
}
