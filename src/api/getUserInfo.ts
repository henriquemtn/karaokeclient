// getUserInfo.ts
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';

interface UserInfo {
  displayName: string;
  avatarUrl: string;
}

export const getUserInfo = async (userId: string): Promise<UserInfo | null> => {
  try {
    console.log('Fetching user info for userId:', userId);
    const userDocRef = doc(firestore, 'users', userId);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const userInfo = userDocSnapshot.data() as UserInfo;
      console.log('User info found:', userInfo);
      return userInfo;
    } else {
      console.error('User not found for userId:', userId);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
};
