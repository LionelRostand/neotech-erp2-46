
import { useState, useEffect, createContext, useContext } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { User } from '@/types/user';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { executeWithNetworkRetry } from './firestore/network-handler';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  isAdmin: boolean;
  isOffline: boolean;
}

const AuthContext = createContext<AuthContextType>({ 
  currentUser: null, 
  userData: null, 
  loading: true,
  isAdmin: false,
  isOffline: false
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Try to get user data with network retry and offline handling
          await executeWithNetworkRetry(async () => {
            const userRef = doc(db, COLLECTIONS.USERS, user.uid);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
              setUserData({ id: user.uid, ...userSnap.data() as Omit<User, 'id'> });
            } else {
              console.warn("Document utilisateur non trouvé dans Firestore");
              setUserData(null);
              
              // Try to get from cache
              const cachedUserData = localStorage.getItem(`user_data_${user.uid}`);
              if (cachedUserData) {
                setUserData(JSON.parse(cachedUserData));
                console.log("Using cached user data");
              }
            }
          });
          
        } catch (error) {
          console.error("Erreur lors de la récupération des données utilisateur", error);
          
          // Try to get from cache if we failed to get from network
          const cachedUserData = localStorage.getItem(`user_data_${user.uid}`);
          if (cachedUserData) {
            setUserData(JSON.parse(cachedUserData));
            console.log("Using cached user data due to error");
          } else {
            setUserData(null);
          }
          
          if (!navigator.onLine) {
            toast.warning("Mode hors-ligne. Certaines fonctionnalités peuvent être limitées.");
          } else {
            toast.error("Erreur de connexion à la base de données");
          }
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Cache user data when it changes
  useEffect(() => {
    if (userData && currentUser) {
      localStorage.setItem(`user_data_${currentUser.uid}`, JSON.stringify(userData));
    }
  }, [userData, currentUser]);

  // Determine if the user is an admin based on userData
  const isAdmin = Boolean(
    userData?.role === 'admin' || 
    userData?.email === 'admin@neotech-consulting.com' ||
    (userData?.permissions && userData.permissions['admin'])
  );

  return (
    <AuthContext.Provider value={{ currentUser, userData, loading, isAdmin, isOffline }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
