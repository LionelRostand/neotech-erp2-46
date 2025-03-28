
import { useState, useEffect, createContext, useContext } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { User } from '@/types/user';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({ 
  currentUser: null, 
  userData: null, 
  loading: true,
  isAdmin: false
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const userRef = doc(db, COLLECTIONS.USERS, user.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            setUserData({ id: user.uid, ...userSnap.data() as Omit<User, 'id'> });
          } else {
            console.warn("Document utilisateur non trouvé dans Firestore");
            setUserData(null);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des données utilisateur", error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const isAdmin = userData?.role === 'admin';

  return (
    <AuthContext.Provider value={{ currentUser, userData, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
