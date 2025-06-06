
"use client";

import type { UserRole } from '@/types';
import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

const USER_ROLES_AVAILABLE: UserRole[] = ['Administrador', 'Gerente', 'Empleado'];

interface RoleContextType {
  currentRole: UserRole;
  setCurrentRole: Dispatch<SetStateAction<UserRole>>;
  availableRoles: UserRole[];
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(USER_ROLES_AVAILABLE[0]);

  return (
    <RoleContext.Provider value={{ currentRole, setCurrentRole, availableRoles: USER_ROLES_AVAILABLE }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
