import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || "demo-project",
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n') || "-----BEGIN PRIVATE KEY-----\ndemo-key\n-----END PRIVATE KEY-----\n",
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || "demo@demo-project.iam.gserviceaccount.com",
};

const app = getApps().length === 0
  ? initializeApp({ credential: cert(serviceAccount) })
  : getApps()[0];

export const adminDb = getFirestore(app);
export default app;

