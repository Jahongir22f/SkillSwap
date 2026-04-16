import { db } from "./firebase";
import { doc, getDoc, updateDoc, increment, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Transaction } from "@/models/Wallet";

/**
 * Rules:
 * 60 minutes teaching = 1 credit
 */
export const calculateCredits = (durationMinutes: number): number => {
  return Number((durationMinutes / 60).toFixed(2));
};

export const updateWalletAfterSession = async (
  teacherId: string,
  studentId: string,
  durationMinutes: number,
  sessionId: string
) => {
  const credits = calculateCredits(durationMinutes);

  // Update teacher wallet (earn)
  const teacherWalletRef = doc(db, 'wallets', teacherId);
  await updateDoc(teacherWalletRef, {
    balance: increment(credits),
    updatedAt: serverTimestamp(),
  });

  // Record teacher transaction
  await addDoc(collection(db, 'wallets', teacherId, 'transactions'), {
    amount: credits,
    type: 'earn',
    sessionId,
    description: `Earned ${credits} credits for teaching session`,
    createdAt: serverTimestamp(),
  } as Transaction);

  // Update student wallet (spend)
  const studentWalletRef = doc(db, 'wallets', studentId);
  await updateDoc(studentWalletRef, {
    balance: increment(-credits),
    updatedAt: serverTimestamp(),
  });

  // Record student transaction
  await addDoc(collection(db, 'wallets', studentId, 'transactions'), {
    amount: -credits,
    type: 'spend',
    sessionId,
    description: `Spent ${credits} credits for learning session`,
    createdAt: serverTimestamp(),
  } as Transaction);
};

export const getWalletBalance = async (uid: string): Promise<number> => {
  const walletDoc = await getDoc(doc(db, 'wallets', uid));
  if (walletDoc.exists()) {
    return walletDoc.data().balance;
  }
  return 0;
};
