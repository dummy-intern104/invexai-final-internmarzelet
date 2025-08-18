
import { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';

export type UserRole = 'admin' | 'manager' | 'user';

interface RolePermissions {
  canManageUsers: boolean;
  canViewReports: boolean;
  canManageProducts: boolean;
  canManagePayments: boolean;
  canExportData: boolean;
}

const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  admin: {
    canManageUsers: true,
    canViewReports: true,
    canManageProducts: true,
    canManagePayments: true,
    canExportData: true,
  },
  manager: {
    canManageUsers: false,
    canViewReports: true,
    canManageProducts: true,
    canManagePayments: true,
    canExportData: true,
  },
  user: {
    canManageUsers: false,
    canViewReports: false,
    canManageProducts: false,
    canManagePayments: false,
    canExportData: false,
  },
};

export const useRoleAccess = () => {
  const { user } = useAuthContext();
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [permissions, setPermissions] = useState<RolePermissions>(ROLE_PERMISSIONS.user);

  useEffect(() => {
    // For now, default to 'admin' for all authenticated users
    // In a real implementation, this would come from user metadata or a separate roles table
    if (user) {
      const role: UserRole = 'admin'; // TODO: Get from user metadata or database
      setUserRole(role);
      setPermissions(ROLE_PERMISSIONS[role]);
    }
  }, [user]);

  const hasPermission = (permission: keyof RolePermissions): boolean => {
    return permissions[permission];
  };

  return {
    userRole,
    permissions,
    hasPermission,
  };
};
