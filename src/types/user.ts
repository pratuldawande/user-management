export type UserRole = 'ADMIN' | 'MANAGER';

export type UserTab = 'ALL' | UserRole;

export interface User {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  createdAt: number;
  updatedAt: number;
}
