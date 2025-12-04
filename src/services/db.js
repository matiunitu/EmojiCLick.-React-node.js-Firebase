import { db } from '../firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

export async function saveUserProfile(userId, data) {
    try {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, data, { merge: true });
    } catch (error) {
        console.error("Error saving profile:", error);
    }
}

export async function getUserProfile(userId) {
    try {
        const userRef = doc(db, 'users', userId);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return null;
    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
}

import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

export async function getLeaderboard(metric, limitCount = 10) {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy(metric, metric === 'speedrunTime' ? 'asc' : 'desc'), limit(limitCount));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return [];
    }
}
