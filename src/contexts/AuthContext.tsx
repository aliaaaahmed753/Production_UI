import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { userAPI } from '../services/api';

// ─── User Roles ───────────────────────────────────────────────────────────────
export type UserRole =
  | 'po_manager'    // مدير PO — full access
  | 'planner'       // المخطط — marker & consumption
  | 'cutting'       // مشرف القص
  | 'sewing'        // مشرف الخياطة
  | 'ironing'       // مشرف المكوى
  | 'packing';      // مشرف التعبئة

export interface AppUser {
  id: string;
  username: string;
  displayName: string;
  displayNameAr: string;
  role: UserRole;
  avatarInitials: string;
}

// ─── Predefined users (in a real app this would come from a backend) ──────────
const USERS: (AppUser & { password: string; email?: string })[] = [
  {
    id: 'u1',
    username: 'po_manager',
    password: 'Manager@2024',
    email: 'manager@production.com',
    displayName: 'PO Manager',
    displayNameAr: 'مدير الأوردرات',
    role: 'po_manager',
    avatarInitials: 'PM',
  },
  {
    id: 'u2',
    username: 'planner',
    password: 'Planner@2024',
    email: 'planner@production.com',
    displayName: 'Planner',
    displayNameAr: 'المخطط',
    role: 'planner',
    avatarInitials: 'PL',
  },
  {
    id: 'u3',
    username: 'cutting',
    password: 'Cutting@2024',
    email: 'cutting@production.com',
    displayName: 'Cutting Supervisor',
    displayNameAr: 'مشرف القص',
    role: 'cutting',
    avatarInitials: 'CU',
  },
  {
    id: 'u4',
    username: 'sewing',
    password: 'Sewing@2024',
    email: 'sewing@production.com',
    displayName: 'Sewing Supervisor',
    displayNameAr: 'مشرف الخياطة',
    role: 'sewing',
    avatarInitials: 'SW',
  },
  {
    id: 'u5',
    username: 'ironing',
    password: 'Ironing@2024',
    email: 'ironing@production.com',
    displayName: 'Ironing Supervisor',
    displayNameAr: 'مشرف المكوى',
    role: 'ironing',
    avatarInitials: 'IR',
  },
  {
    id: 'u6',
    username: 'packing',
    password: 'Packing@2024',
    email: 'packing@production.com',
    displayName: 'Packing Supervisor',
    displayNameAr: 'مشرف التعبئة',
    role: 'packing',
    avatarInitials: 'PK',
  },
  // Additional custom users - يمكن إضافة مستخدمين جدد هنا
  {
    id: 'u7',
    username: 'admin',
    password: 'Admin@2024#Secure',
    email: 'admin@production.com',
    displayName: 'System Admin',
    displayNameAr: 'مدير النظام',
    role: 'po_manager',
    avatarInitials: 'AD',
  },
];

// ─── Context shape ────────────────────────────────────────────────────────────
interface AuthContextValue {
  user: AppUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (username: string) => Promise<{ success: boolean; message: string }>;
  validatePassword: (password: string) => { isValid: boolean; strength: 'weak' | 'medium' | 'strong'; issues: string[] };
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = 'pms_session';
const REMEMBER_KEY = 'pms_remember';

// ─── Password Validation ──────────────────────────────────────────────────────
function validatePasswordStrength(password: string): { isValid: boolean; strength: 'weak' | 'medium' | 'strong'; issues: string[] } {
  const issues: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';

  if (password.length < 8) {
    issues.push('password_too_short');
  }
  if (!/[A-Z]/.test(password)) {
    issues.push('password_no_uppercase');
  }
  if (!/[a-z]/.test(password)) {
    issues.push('password_no_lowercase');
  }
  if (!/[0-9]/.test(password)) {
    issues.push('password_no_number');
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    issues.push('password_no_special');
  }

  const isValid = issues.length === 0;

  if (isValid) {
    strength = 'strong';
  } else if (issues.length <= 2) {
    strength = 'medium';
  }

  return { isValid, strength, issues };
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(() => {
    try {
      // Check localStorage first (Remember Me)
      const remembered = localStorage.getItem(REMEMBER_KEY);
      if (remembered) {
        return JSON.parse(remembered) as AppUser;
      }
      // Then check sessionStorage
      const saved = sessionStorage.getItem(SESSION_KEY);
      return saved ? (JSON.parse(saved) as AppUser) : null;
    } catch {
      return null;
    }
  });

  // Persist session on change
  useEffect(() => {
    if (user) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(REMEMBER_KEY);
    }
  }, [user]);

  const login = useCallback(async (username: string, password: string, rememberMe: boolean = false) => {
    try {
      // Try to authenticate via API first
      const user = await userAPI.authenticate(username.trim().toLowerCase(), password);
      
      if (!user) {
        // Fallback to hardcoded users for demo
        const found = USERS.find(
          (u) => u.username === username.trim().toLowerCase() && u.password === password
        );
        if (!found) {
          return { success: false, error: 'invalid_credentials' };
        }
        const { password: _pw, email: _email, ...safeUser } = found;
        setUser(safeUser);

        // Remember Me functionality
        if (rememberMe) {
          localStorage.setItem(REMEMBER_KEY, JSON.stringify(safeUser));
        } else {
          localStorage.removeItem(REMEMBER_KEY);
        }

        return { success: true };
      }

      // API authentication successful
      const { password: _pw, email: _email, ...safeUser } = user;
      setUser(safeUser as AppUser);

      if (rememberMe) {
        localStorage.setItem(REMEMBER_KEY, JSON.stringify(safeUser));
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      // Fallback to hardcoded users
      const found = USERS.find(
        (u) => u.username === username.trim().toLowerCase() && u.password === password
      );
      if (!found) {
        return { success: false, error: 'invalid_credentials' };
      }
      const { password: _pw, email: _email, ...safeUser } = found;
      setUser(safeUser);

      if (rememberMe) {
        localStorage.setItem(REMEMBER_KEY, JSON.stringify(safeUser));
      }

      return { success: true };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const resetPassword = useCallback(async (username: string) => {
    try {
      const user = await userAPI.getByUsername(username.trim().toLowerCase());
      if (!user) {
        // Fallback to hardcoded users
        const found = USERS.find((u) => u.username === username.trim().toLowerCase());
        if (!found) {
          return { success: false, message: 'user_not_found' };
        }
        console.log(`Password reset email sent to: ${found.email}`);
        return { success: true, message: 'reset_email_sent' };
      }
      
      console.log(`Password reset email sent to: ${user.email}`);
      return { success: true, message: 'reset_email_sent' };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, message: 'error' };
    }
  }, []);

  const validatePassword = useCallback((password: string) => {
    return validatePasswordStrength(password);
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        login, 
        logout, 
        resetPassword,
        validatePassword 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

// ─── Role labels ──────────────────────────────────────────────────────────────
export const ROLE_LABELS: Record<UserRole, { en: string; ar: string; color: string }> = {
  po_manager: { en: 'PO Manager',         ar: 'مدير الأوردرات',  color: '#1565C0' },
  planner:    { en: 'Planner',            ar: 'المخطط',           color: '#6A1B9A' },
  cutting:    { en: 'Cutting Supervisor', ar: 'مشرف القص',        color: '#BF360C' },
  sewing:     { en: 'Sewing Supervisor',  ar: 'مشرف الخياطة',     color: '#1B5E20' },
  ironing:    { en: 'Ironing Supervisor', ar: 'مشرف المكوى',      color: '#E65100' },
  packing:    { en: 'Packing Supervisor', ar: 'مشرف التعبئة',     color: '#004D40' },
};

