import { initializeApp } from 'firebase/app';
import {
  // FacebookAuthProvider,
  // GoogleAuthProvider,
  // sendEmailVerification as _sendEmailVerification,
  // browserLocalPersistence,
  // browserSessionPersistence,
  // createUserWithEmailAndPassword,
  // fetchSignInMethodsForEmail,
  getAuth,
  onAuthStateChanged,
} from 'firebase/auth';

export * from 'firebase/auth';
// import {
//   getMessaging as getFirebaseMessaging,
//   getToken as getFirebaseToken,
//   onMessage,
// } from 'firebase/messaging';
// import type { ObjectType } from '@/utils/types';
/* cSpell:disable */

const firebaseConfig = process.env.NEXT_PUBLIC_FIRE_BASE_CONFIG
  ? JSON.parse(process.env.NEXT_PUBLIC_FIRE_BASE_CONFIG)
  : {
      apiKey: 'AIzaSyC_D0hZ952wqlB7__5Ni54CjeYkfqZjvHM',
      authDomain: 'shirleysfoods-8a4cc.firebaseapp.com',
      projectId: 'shirleysfoods-8a4cc',
      storageBucket: 'shirleysfoods-8a4cc.firebasestorage.app',
      messagingSenderId: '704710995807',
      appId: '1:704710995807:web:3453e01e6fe05a04be10ea',
    };

/* cSpell:enable */
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// export function getMessaging() {
//   return getFirebaseMessaging(app);
// }

// export async function getMessagingToken() {
//   let deviceToken = null;
//   try {
//     const status = await Notification.requestPermission();
//     if (status && status === 'granted') {
//       const messaging = getMessaging();
//       deviceToken = await getFirebaseToken(messaging, {
//         vapidKey: firebaseConfig?.vapid,
//       });
//     }
//   } catch {
//     deviceToken = null;
//   }

//   return deviceToken;
// }

// export const listenForMessages = (
//   handleMessage: (payload: ObjectType) => void
// ) => {
//   onMessage(getMessaging(), payload => {
//     if (handleMessage) {
//       handleMessage(payload);
//     }
//   });
// };

// export async function getToken() {
//   console.log(JSON.stringify(auth), 'auth +++++++++++++');
//   if (!auth?.currentUser) {
//     return;
//   }
//   return await auth?.currentUser.getIdToken();
// }

export async function getToken(): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async user => {
        unsubscribe();
        if (user) {
          try {
            const token = await user.getIdToken();
            resolve(token);
          } catch (error) {
            reject(error);
          }
        } else {
          resolve(null);
        }
      },
      error => {
        unsubscribe();
        reject(error);
      }
    );
  });
}

// export function checkLogin() {
//   return !!auth.currentUser;
// }

// export function getUser() {
//   return auth.currentUser;
// }

// export async function signInWithGoogle() {
//   const provider = new GoogleAuthProvider();
//   provider.setCustomParameters({
//     prompt: 'select_account',
//   });
//   const result = await signInWithPopup(auth, provider);
//   // This gives you a Google Access Token. You can use it to access the Google API.
//   const credential = GoogleAuthProvider.credentialFromResult(result);
//   if (!credential) {
//     throw new Error('No credential');
//   }
//   // The signed-in user info.
//   const user = result.user;
//   // IdP data available using getAdditionalUserInfo(result)

//   return user;
// }

// export async function signInWithFacebook() {
//   const provider = new FacebookAuthProvider();
//   provider.setCustomParameters({
//     prompt: 'select_account',
//   });
//   const result = await signInWithPopup(auth, provider);
//   const credential = GoogleAuthProvider.credentialFromResult(result);
//   if (!credential) {
//     throw new Error('No credential');
//   }
//   // The signed-in user info.
//   const user = result.user;
//   // IdP data available using getAdditionalUserInfo(result)
//   return user;
// }

// export async function signInWithEmailPassword(
//   email: string,
//   password: string,
//   rememberMe = true
// ) {
//   const persistence = rememberMe
//     ? browserLocalPersistence
//     : browserSessionPersistence;

//   await setPersistence(auth, persistence);
//   const result = await signInWithEmailAndPassword(auth, email, password);

//   return result.user;
// }

// export async function signUpWithEmailPassword(email: string, password: string) {
//   await setPersistence(auth, browserLocalPersistence);
//   // const signInMethod = await fetchSignInMethodsForEmail(auth, email);

//   const result = await createUserWithEmailAndPassword(auth, email, password);

//   await _sendEmailVerification(result.user);
//   return result.user;
// }

// export async function sendEmailVerification() {
//   if (!auth.currentUser) {
//     throw new Error('No current user');
//   }
//   await _sendEmailVerification(auth.currentUser);
// }

// export async function sendEmailPasswordReset(email: string) {
//   await sendPasswordResetEmail(auth, email);
// }

// export async function signOut() {
//   await auth.signOut();
// }
