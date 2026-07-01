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

function canUseLocalAdminFallback() {
  return import.meta.env.DEV || ['localhost', '127.0.0.1'].includes(window.location.hostname);
}

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
        const { adminId, token, localFallback } = JSON.parse(sessionData);
        if (token) {
          const edgeSession = await validateEdgeSession(token);
          if (edgeSession.handled) {
            if (edgeSession.success && edgeSession.admin) {
              setAdmin(edgeSession.admin);
            } else {
              sessionStorage.removeItem(ADMIN_SESSION_KEY);
            }
            return;
          }
        }

        if (adminId && localFallback && canUseLocalAdminFallback()) {
          const { data, error } = await supabase
            .from('admin_users')
            .select('id, email, name, role, avatar_url, is_active, last_login, created_at, updated_at')
            .eq('id', adminId)
            .eq('is_active', true)
            .single();

          if (!error && data) {
            setAdmin(data as AdminUser);
            return;
          }
        }

        if (!adminId || !token) {
          sessionStorage.removeItem(ADMIN_SESSION_KEY);
          return;
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
        if (!edgeLogin.success || !edgeLogin.admin || !edgeLogin.token) {
          return { success: false, error: edgeLogin.error || 'Invalid credentials' };
        }

        setAdmin(edgeLogin.admin);
        sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ adminId: edgeLogin.admin.id, token: edgeLogin.token }));
        return { success: true };
      }

      if (canUseLocalAdminFallback()) {
        return await loginWithLocalFallback(email, password);
      }

      return {
        success: false,
        error: 'Secure admin login requires the Supabase admin-login Edge Function to be deployed.'
      };
    } catch (e) {
      console.error('Login error:', e);
      return { success: false, error: 'An error occurred' };
    }
  };

  const loginWithEdgeFunction = async (
    email: string,
    password: string
  ): Promise<{ handled: boolean; success: boolean; admin?: AdminUser; token?: string; error?: string }> => {
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

      return { handled: true, success: true, admin: result.admin as AdminUser, token: result.token as string };
    } catch (e) {
      console.warn('Admin login edge function unavailable:', e);
      return { handled: false, success: false };
    }
  };

  const loginWithLocalFallback = async (email: string, password: string) => {
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
    const passwordHash = (data as { password_hash?: string }).password_hash || '';

    if (passwordHash === 'admin123') {
      return {
        success: false,
        error: 'Default admin password is disabled. Reset this admin password in Supabase before signing in.'
      };
    }

    if (!passwordHash.startsWith(PASSWORD_HASH_PREFIX)) {
      return {
        success: false,
        error: 'This admin password must be reset to the secure hashed format.'
      };
    }

    const hashedPassword = await hashAdminPassword(password);
    if (passwordHash !== hashedPassword) {
      return { success: false, error: 'Invalid credentials' };
    }

    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', adminUser.id);

    setAdmin(adminUser);
    sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ adminId: adminUser.id, localFallback: true }));
    return { success: true };
  };

  const validateEdgeSession = async (
    token: string
  ): Promise<{ handled: boolean; success: boolean; admin?: AdminUser; error?: string }> => {
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!anonKey || !supabaseUrl) {
      return { handled: false, success: false };
    }

    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/admin-session`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${anonKey}`,
          'apikey': anonKey,
          'X-Admin-Session': token,
        },
      });

      if (response.status === 404) {
        return { handled: false, success: false };
      }

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        return { handled: true, success: false, error: result.error || 'Session expired' };
      }

      return { handled: true, success: true, admin: result.admin as AdminUser };
    } catch (e) {
      console.warn('Admin session edge function unavailable:', e);
      return { handled: false, success: false };
    }
  };

  const logout = async () => {
    const sessionData = sessionStorage.getItem(ADMIN_SESSION_KEY);
    const token = sessionData ? JSON.parse(sessionData).token : null;
    if (token) {
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (anonKey && supabaseUrl) {
        fetch(`${supabaseUrl}/functions/v1/admin-logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${anonKey}`,
            'apikey': anonKey,
            'X-Admin-Session': token,
          },
        }).catch(() => undefined);
      }
    }
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
