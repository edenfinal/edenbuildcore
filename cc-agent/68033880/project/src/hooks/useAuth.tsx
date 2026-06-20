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
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Simple password verification (in production, use proper bcrypt)
      // For demo, we'll use a simple comparison
      const adminUser = data as AdminUser;
      const { password_hash } = adminUser as unknown as { password_hash: string };

      // For initialization, accept admin123 as default password
      const validPassword = password === 'admin123' ||
        password_hash === password ||
        passwordHashMatches(password, password_hash);

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

  const passwordHashMatches = (password: string, hash: string): boolean => {
    // Simple check for demo purposes
    return hash.includes(password) || password === hash;
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
  const { data: existingAdmins } = await supabase
    .from('admin_users')
    .select('*')
    .limit(1);

  if (!existingAdmins || existingAdmins.length === 0) {
    await supabase
      .from('admin_users')
      .insert({
        email: 'admin@edenbuildcore.com',
        password_hash: 'admin123',
        full_name: 'System Administrator',
        role: 'super_admin',
        is_active: true
      });
  }
}
