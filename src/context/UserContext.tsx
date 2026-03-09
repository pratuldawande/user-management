import React, { createContext, useContext, useState, useCallback } from 'react';
import { userRepository } from '../repositories';
import { User } from '../types/user';
import { listZellerCustomers } from '../api';
import Toast from 'react-native-toast-message';

interface UserContextType {
  users: User[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  getUsers: (options?: {
    searchTerm?: string;
    limit?: number;
    offset?: number;
    role?: string;
  }) => Promise<void>;
  createUser: (
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ) => Promise<void>;
  createMany: (
    users: Omit<User, 'createdAt' | 'updatedAt'>[],
  ) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  getUsersFromAWS: () => Promise<User[]>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const getUsersFromAWS = async (): Promise<User[]> => {
  const users = await listZellerCustomers();
  await userRepository.createMany(users);
  return users;
};

  const getUsers = useCallback(
    async (options?: {
      searchTerm?: string;
      limit?: number;
      offset?: number;
      role?: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const data = await userRepository.getUsers(options || {});
        setUsers(prev =>
          options?.offset && options.offset > 0 ? [...prev, ...data] : data,
        );
        setHasMore(data.length >= (options?.limit || 15));
      } catch {
        Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch users',
        position: 'bottom',
      });
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const createUser = useCallback(
    async (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
      setLoading(true);
      setError(null);
      try {
        const newUser = await userRepository.create(user);
        setUsers(prev => [newUser, ...prev]);
         Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'User created successfully',
        position: 'bottom',
      });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create user');
        Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to create user',
        position: 'bottom',
      });
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const createMany = useCallback(
    async (users: Omit<User, 'createdAt' | 'updatedAt'>[]) => {
      setLoading(true);
      setError(null);
      try {
        const newUsers = await userRepository.createMany(users);
        setUsers(prev => [...newUsers, ...prev]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create users');
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const deleteUser = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await userRepository.delete(id);
      setUsers(prev => prev.filter(user => user.id !== id));
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'User deleted successfully',
        position: 'bottom',
      });
    } catch  {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to delete user',
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (user: User) => {
    setLoading(true);
    setError(null);
    try {
      await userRepository.update(user);
      setUsers(prev => prev.map(u => (u.id === user.id ? user : u)));
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'User updated successfully',
        position: 'bottom',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update user',
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        error,
        hasMore,
        getUsers,
        createUser,
        createMany,
        deleteUser,
        updateUser,
        getUsersFromAWS
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within UserProvider');
  }
  return context;
};
