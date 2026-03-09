
import {UserRepository} from '../src/repositories/UserRepository';
jest.mock('react-native-sqlite-storage');
describe('UserRepository', () => {
  const repo = new UserRepository();

  test('creates a user', async () => {
    const user = await repo.create({
      name: 'Test User',
      email: 'test@test.com',
      role: 'ADMIN',
    });

    expect(user.id).toBeDefined();
    expect(user.name).toBe('Test User');
  });

  test('returns users', async () => {
    const users = await repo.getUsers({ searchTerm: 'Test', limit: 15, offset: 0 });

    expect(Array.isArray(users)).toBe(true);
  });
});