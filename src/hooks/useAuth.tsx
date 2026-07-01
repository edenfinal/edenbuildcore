import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { AdminUser } from '../lib/supabase';

interface AuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateAdmin: (admin: AdminUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_SESSION_KEY = 'eden_buildcore_admin_session';
const PASSWORD_HASH_PREFIX = 'sha256:';

export async function hashAdminPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`eden_admin_v1:${password}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return `${PASSWORD_HASH_PREFIX}${hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('')}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const sessionData = sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (sessionData) {
        const { adminId } = JSON.parse(sessionData);
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', adminId)
          .eq('is_active', true)
          .single();

        if (!error && data) {
          setAdmin(data as AdminUser);
        } else {
          sessionStorage.removeItem(ADMIN_SESSION_KEY);
        }
      }
    } catch (e) {
      console.error('Session check error:', e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const edgeLogin = await loginWithEdgeFunction(email, password);
      if (edgeLogin.handled) {
        if (!edgeLogin.success || !edgeLogin.admin) {
          return { success: false, error: edgeLogin.error || 'Invalid credentials' };
        }

        setAdmin(edgeLogin.admin);
        sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ adminId: edgeLogin.admin.id }));
        return { success: true };
      }

      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        return { success: false, error: 'Invalid credentials' };
      }

      const adminUser = data as AdminUser;
      const { password_hash } = adminUser as unknown as { password_hash: string };

      if (password_hash === 'admin123') {
        return {
          success: false,
          error: 'Default admin password is disabled. Reset this admin password in Supabase before signing in.'
        };
      }

      const hashedPassword = await hashAdminPassword(password);
      const legacyExactMatch = !password_hash.startsWith(PASSWORD_HASH_PREFIX) && password_hash === password;
      const validPassword = password_hash === hashedPassword || legacyExactMatch;

      if (!validPassword) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Update last login
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', adminUser.id);

      setAdmin(adminUser);
      sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ adminId: adminUser.id }));

      return { success: true };
    } catch (e) {
      console.error('Login error:', e);
      return { success: false, error: 'An error occurred' };
    }
  };

  const loginWithEdgeFunction = async (
    email: string,
    password: string
  ): Promise<{ handled: boolean; success: boolean; admin?: AdminUser; error?: string }> => {
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!anonKey || !supabaseUrl) {
      return { handled: false, success: false };
    }

    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/admin-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`,
          'apikey': anonKey,
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 404) {
        return { handled: false, success: false };
      }

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        return { handled: true, success: false, error: result.error || 'Invalid credentials' };
      }

      return { handled: true, success: true, admin: result.admin as AdminUser };
    } catch (e) {
      console.warn('Admin login edge function unavailable, falling back to direct login:', e);
      return { handled: false, success: false };
    }
  };

  const logout = async () => {
    setAdmin(null);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  };

  const updateAdmin = (updatedAdmin: AdminUser) => {
    setAdmin(updatedAdmin);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, updateAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Create default admin on first load
export async function initializeDefaultAdmin() {
  // Default admin creation with a hardcoded password is intentionally disabled.
  // Create the first admin in Supabase with a hashed password from Admin Users.
}
