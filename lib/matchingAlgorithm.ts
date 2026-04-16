import { User } from "@/models/User";

export const calculateCompatibilityScore = (user1: User, user2: User): number => {
  // Check skills compatibility
  // user1.offeredSkills intersects with user2.neededSkills
  // user2.offeredSkills intersects with user1.neededSkills

  const user1Gives = user1.offeredSkills.filter(skill => user2.neededSkills.includes(skill));
  const user2Gives = user2.offeredSkills.filter(skill => user1.neededSkills.includes(skill));

  let score = 0;

  // Each matching skill adds points
  if (user1Gives.length > 0) score += 40;
  if (user2Gives.length > 0) score += 40;

  // Bonus for multiple matching skills
  score += Math.min((user1Gives.length + user2Gives.length) * 5, 20);

  // Location compatibility (same city)
  if (user1.location.city === user2.location.city) {
    score += 10;
  }

  // Rating bonus
  score += (user2.rating / 5) * 10;

  return Math.min(score, 100);
};

export const findMatchedSkills = (user1: User, user2: User) => {
  return {
    user1Gives: user1.offeredSkills.filter(skill => user2.neededSkills.includes(skill)),
    user2Gives: user2.offeredSkills.filter(skill => user1.neededSkills.includes(skill)),
  };
};
