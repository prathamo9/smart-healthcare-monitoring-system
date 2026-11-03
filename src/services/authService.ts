import { User } from '../types';
import { initialUser } from '../data/mockData';

const USER_STORAGE_KEY = 'healthpulse_current_user';
const TOKEN_STORAGE_KEY = 'healthpulse_auth_token';

class AuthService {
  getCurrentUser(): User | null {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // Default to initial demo user if not logged out
      return initialUser;
    } catch {
      return initialUser;
    }
  }

  getAuthToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  /**
   * Simulate Google OAuth 2.0 Flow
   * (Ready for Google Identity Services / `@react-oauth/google` integration)
   */
  async loginWithGoogle(credentialToken?: string): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    // In future FastAPI:
    // const res = await fetch('/api/auth/google', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ token: credentialToken })
    // });
    // const { user, access_token } = await res.json();

    const googleUser: User = {
      ...initialUser,
      name: 'Dr. Pratham, M.D.',
      email: 'pratham.md@gmail.com',
      provider: 'google',
    };

    const mockJwt = 'mock-jwt-token-google-auth-v2-xyz89213';
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(googleUser));
    localStorage.setItem(TOKEN_STORAGE_KEY, mockJwt);

    return googleUser;
  }

  /**
   * Email/password credentials login simulation
   */
  async loginWithEmail(email: string): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const user: User = {
      ...initialUser,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      provider: 'email',
    };

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_STORAGE_KEY, 'mock-jwt-email-session-48194');

    return user;
  }

  /**
   * Guest quick login
   */
  async loginAsGuest(): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const guestUser: User = {
      ...initialUser,
      name: 'Guest Clinician',
      email: 'guest@healthpulse.ai',
      provider: 'guest',
    };

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(guestUser));
    localStorage.setItem(TOKEN_STORAGE_KEY, 'mock-jwt-guest-demo-9921');

    return guestUser;
  }

  /**
   * Update profile info
   */
  async updateProfile(updates: Partial<User>): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const current = this.getCurrentUser() || initialUser;
    const updated = { ...current, ...updates };

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }

  /**
   * Logout
   */
  logout(): void {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export const authService = new AuthService();
