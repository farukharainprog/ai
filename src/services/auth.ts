import { UserProfile, SubscriptionPlan } from '../types';

const STORAGE_KEY_USER = 'nexora_current_user';
const STORAGE_KEY_ALL_USERS = 'nexora_registered_users';

const OWNER_EMAIL = 'farukharain962@gmail.com';

// Pre-seeded accounts for instant preview testing
const DEFAULT_ACCOUNTS: UserProfile[] = [
  {
    id: 'usr-owner',
    uid: 'usr-owner',
    displayName: 'Farukh Arain (Owner)',
    email: OWNER_EMAIL,
    photoURL: '/src/assets/images/avatar_nexora_assistant_1793892538427.jpg',
    role: 'admin',
    plan: 'pro',
    status: 'active',
    createdAt: '2026-11-01T00:00:00Z',
  },
  {
    id: 'usr-demo-pk1',
    uid: 'usr-demo-pk1',
    displayName: 'Ali Raza',
    email: 'ali.raza@example.pk',
    role: 'user',
    plan: 'plus',
    status: 'active',
    createdAt: '2026-11-02T00:00:00Z',
  },
];

export function getStoredUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ALL_USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_ACCOUNTS;
  }
}

export function getCurrentUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserProfile | null): void {
  if (user) {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY_USER);
  }
}

export async function loginWithEmail(email: string, _password: string): Promise<UserProfile> {
  // Simulate auth latency
  await new Promise((r) => setTimeout(r, 450));

  const users = getStoredUsers();
  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (existing) {
    if (existing.status === 'suspended') {
      throw new Error('This account has been suspended by administration. Please contact support.');
    }
    setCurrentUser(existing);
    return existing;
  }

  // If registering email matches owner, automatically grant admin
  const isOwner = email.toLowerCase() === OWNER_EMAIL.toLowerCase();
  const newUser: UserProfile = {
    id: 'usr-' + Date.now(),
    uid: 'usr-' + Date.now(),
    displayName: email.split('@')[0],
    email: email.toLowerCase(),
    role: isOwner ? 'admin' : 'user',
    plan: isOwner ? 'pro' : 'free',
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(users));
  setCurrentUser(newUser);
  return newUser;
}

export async function registerWithEmail(
  name: string,
  email: string,
  _password: string,
  photoURL?: string
): Promise<UserProfile> {
  await new Promise((r) => setTimeout(r, 500));

  const users = getStoredUsers();
  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (existing) {
    throw new Error('An account with this email already exists. Please log in.');
  }

  const isOwner = email.toLowerCase() === OWNER_EMAIL.toLowerCase();
  const newUser: UserProfile = {
    id: 'usr-' + Date.now(),
    uid: 'usr-' + Date.now(),
    displayName: name.trim(),
    email: email.toLowerCase(),
    photoURL: photoURL || undefined,
    role: isOwner ? 'admin' : 'user',
    plan: isOwner ? 'pro' : 'free',
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(users));
  setCurrentUser(newUser);
  return newUser;
}

export async function signInWithGoogleMock(): Promise<UserProfile> {
  await new Promise((r) => setTimeout(r, 600));

  // Quick Google Sign-In with owner or student account
  const users = getStoredUsers();
  const ownerUser = users.find((u) => u.email === OWNER_EMAIL);
  if (ownerUser) {
    setCurrentUser(ownerUser);
    return ownerUser;
  }

  const googleUser: UserProfile = {
    id: 'usr-google-owner',
    uid: 'usr-google-owner',
    displayName: 'Farukh Arain',
    email: OWNER_EMAIL,
    photoURL: '/src/assets/images/avatar_nexora_assistant_1793892538427.jpg',
    role: 'admin',
    plan: 'pro',
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  users.push(googleUser);
  localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(users));
  setCurrentUser(googleUser);
  return googleUser;
}

export async function startAsGuest(): Promise<UserProfile> {
  const guestUser: UserProfile = {
    id: 'guest-' + Math.floor(Math.random() * 10000),
    uid: 'guest-' + Math.floor(Math.random() * 10000),
    displayName: 'Guest Explorer',
    email: 'guest@nexora.ai',
    role: 'user',
    plan: 'free',
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  setCurrentUser(guestUser);
  return guestUser;
}

export function logout(): void {
  setCurrentUser(null);
}

export function updateUserProfile(updates: Partial<UserProfile>): UserProfile {
  const current = getCurrentUser();
  if (!current) throw new Error('No user is currently logged in');

  const updated: UserProfile = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const users = getStoredUsers().map((u) => (u.id === current.id ? updated : u));
  localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(users));
  setCurrentUser(updated);
  return updated;
}

export function upgradeUserPlan(plan: SubscriptionPlan): UserProfile {
  return updateUserProfile({ plan });
}
