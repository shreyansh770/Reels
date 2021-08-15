import { createContext, useState, useEffect } from "react";
import { auth, firestore } from "./firebase";

export const AuthContext = createContext();


// ye login vale page se hata ke humne alg se ek component me islea dala hai
// kyuki agr hum login vale page se unsub krte to uska mtlb hai ki vo component unmount ho chuka hai
// to jab hum logout krne ki koshish krte to already unsub hone ki wjha se
// onAuthStatetChange event listener trigger he nhi hota
// to islea humne ek component bnaya authProvider jo ki in sbka parent hoga ha
// and usse tbhi unsub honge hum jab humne apna react app close kr diya hoga


let AuthProvider = ({ children }) => {
   // props me hume Us component ke niche ke components as 'children' milte hai
  let [currentUser, setCurrentUser] = useState(null);
  let [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        let { displayName, email, uid, photoURL } = user;
        let likedPosts = [];
        let docRef = firestore.collection("users").doc(uid);
        let document = await docRef.get();
        if (!document.exists) {
          docRef.set({
            displayName,
            email,
            photoURL,
            likedPosts
          });
        }

        setCurrentUser({ displayName, email, uid, photoURL ,likedPosts});
      } else {
        setCurrentUser(user);
      }

      setLoading(false); // user login ya logout hojaye to Loading false kardo
    });

    return () => {
      unsub();
    };
  }, []);

  // jb user login ya logout pura krlega tab loading false hojaigi

  return (
    <AuthContext.Provider value={currentUser}>
    {/* /* yaha pe bas ye ho raha hai ki Provider ke niche uske children dikha rahe hai */ }
      {!loading && children}
      
    </AuthContext.Provider>
  );
};

export default AuthProvider;