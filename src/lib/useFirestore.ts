import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { UserProfile } from '../types';
import { PORTFOLIO_CHECKLIST, INITIAL_INTL_RATES } from '../data';

export function useFirestore<T extends { id: string }>(collectionPath: string) {
  const [user] = useAuthState(auth);
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const fullPath = `users/${user.uid}/${collectionPath}`;
    const q = query(collection(db, fullPath));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const items: T[] = [];
        snapshot.forEach((doc) => {
          items.push({ ...doc.data(), id: doc.id } as T);
        });
        setData(items);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
        handleFirestoreError(err, OperationType.LIST, fullPath);
      }
    );

    return () => unsubscribe();
  }, [user, collectionPath]);

  const add = async (item: T) => {
    if (!user) return;
    const fullPath = `users/${user.uid}/${collectionPath}`;
    try {
      await setDoc(doc(db, fullPath, item.id), {
        ...item,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `${fullPath}/${item.id}`);
    }
  };

  const update = async (id: string, updates: Partial<T>) => {
    if (!user) return;
    const fullPath = `users/${user.uid}/${collectionPath}`;
    try {
      await updateDoc(doc(db, fullPath, id), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `${fullPath}/${id}`);
    }
  };

  const remove = async (id: string) => {
    if (!user) return;
    const fullPath = `users/${user.uid}/${collectionPath}`;
    try {
      await deleteDoc(doc(db, fullPath, id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `${fullPath}/${id}`);
    }
  };

  return { data, loading, error, add, update, remove, setData };
}

// Special hook for the roadmap which is a bit different
export function useProfile() {
  const [user] = useAuthState(auth);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fullPath = `users/${user.uid}`;
    const unsubscribe = onSnapshot(doc(db, fullPath), 
      (docSnap) => {
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          // Initialize profile
          const initialProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            niche: '',
            portfolioLinks: ['', '', ''],
            intlRateCard: INITIAL_INTL_RATES,
            portfolioChecklist: PORTFOLIO_CHECKLIST.map(item => ({ id: item.id, completed: false })),
          };
          setDoc(doc(db, fullPath), {
            ...initialProfile,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          setProfile(initialProfile);
        }
        setLoading(false);
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, fullPath);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const fullPath = `users/${user.uid}`;
    try {
      await updateDoc(doc(db, fullPath), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, fullPath);
    }
  };

  return { profile, loading, updateProfile };
}

export function useRoadmap() {
  const [user] = useAuthState(auth);
  const [roadmap, setRoadmap] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRoadmap([]);
      setLoading(false);
      return;
    }

    const fetchRoadmap = async () => {
      const fullPath = `users/${user.uid}/roadmap`;
      try {
        const querySnapshot = await getDocs(collection(db, fullPath));
        if (querySnapshot.empty) {
          setRoadmap([]);
        } else {
          const days: any[] = [];
          querySnapshot.forEach((doc) => {
            days.push({ ...doc.data(), id: doc.id });
          });
          setRoadmap(days.sort((a, b) => a.day - b.day));
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, fullPath);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [user]);

  const updateDay = async (dayIndex: number, tasks: any[]) => {
    if (!user) return;
    const dayNum = dayIndex + 1;
    const docId = `day${dayNum}`;
    const fullPath = `users/${user.uid}/roadmap/${docId}`;
    try {
      await setDoc(doc(db, fullPath), {
        day: dayNum,
        tasks: tasks.map(t => ({ id: t.id, completed: t.completed })),
        userId: user.uid,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      
      setRoadmap(prev => {
        const next = [...prev];
        const existingDayIdx = next.findIndex(d => d.day === dayNum);
        if (existingDayIdx > -1) {
          next[existingDayIdx] = { ...next[existingDayIdx], tasks };
        } else {
          next.push({ day: dayNum, tasks });
        }
        return next.sort((a, b) => a.day - b.day);
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, fullPath);
    }
  };

  return { roadmap, loading, updateDay };
}

export function useWeek2Roadmap() {
  const [user] = useAuthState(auth);
  const [roadmap, setRoadmap] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRoadmap([]);
      setLoading(false);
      return;
    }

    const fetchRoadmap = async () => {
      const fullPath = `users/${user.uid}/week2roadmap`;
      try {
        const querySnapshot = await getDocs(collection(db, fullPath));
        if (querySnapshot.empty) {
          setRoadmap([]);
        } else {
          const days: any[] = [];
          querySnapshot.forEach((doc) => {
            days.push({ ...doc.data(), id: doc.id });
          });
          setRoadmap(days.sort((a, b) => a.day - b.day));
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, fullPath);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [user]);

  const updateDay = async (dayIndex: number, tasks: any[]) => {
    if (!user) return;
    const dayNum = dayIndex + 8; // Starts from Day 8
    const docId = `day${dayNum}`;
    const fullPath = `users/${user.uid}/week2roadmap/${docId}`;
    try {
      await setDoc(doc(db, fullPath), {
        day: dayNum,
        tasks: tasks.map(t => ({ id: t.id, completed: t.completed })),
        userId: user.uid,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      
      setRoadmap(prev => {
        const next = [...prev];
        const existingDayIdx = next.findIndex(d => d.day === dayNum);
        if (existingDayIdx > -1) {
          next[existingDayIdx] = { ...next[existingDayIdx], tasks };
        } else {
          next.push({ day: dayNum, tasks });
        }
        return next.sort((a, b) => a.day - b.day);
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, fullPath);
    }
  };

  return { roadmap, loading, updateDay };
}
