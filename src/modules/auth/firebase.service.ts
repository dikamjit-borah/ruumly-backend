import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { envConfig } from '@/config/env.config';

@Injectable()
export class FirebaseService {
  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(envConfig.firebase as admin.ServiceAccount),
      });
    }
  }

  async verifyIdToken(idToken: string) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }

  async getUser(uid: string) {
    try {
      return await admin.auth().getUser(uid);
    } catch (error) {
      throw new UnauthorizedException('User not found in Firebase');
    }
  }

  async getUserByEmail(email: string) {
    try {
      return await admin.auth().getUserByEmail(email);
    } catch (error) {
      // User not found is not an error in this case
      return null;
    }
  }
}
