import { initDb } from '../database/initDb';
import { User } from '../types/user';

const generateId = () => {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export class UserRepository {
  private mapRowToUser(row: any): User {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async getUsers({
    searchTerm,
    limit,
    offset,
    role,
  }: {
    searchTerm?: string;
    limit?: number;
    offset?: number;
    role?: string;
  }): Promise<User[]> {
    const db = await initDb();

    let query = 'SELECT * FROM users';
    const params: any[] = [];
    const conditions: string[] = [];

    if (searchTerm) {
      conditions.push('(name LIKE ? OR email LIKE ?)');
      const likeTerm = `%${searchTerm}%`;
      params.push(likeTerm, likeTerm);
    }

    if (role) {
      conditions.push('role = ?');
      params.push(role);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY updated_at DESC';

    if (limit !== undefined) {
      query += ' LIMIT ?';
      params.push(limit);
    }

    if (offset !== undefined) {
      query += ' OFFSET ?';
      params.push(offset);
    }

    const [result] = await db.executeSql(query, params);

    const users: User[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      users.push(this.mapRowToUser(result.rows.item(i)));
    }

    return users;
  }

  async create(
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<User> {
    const db = await initDb();

    const timestamp = Date.now();

    const newUser: User = {
      id: generateId(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await db.executeSql(
      `INSERT INTO users
       (id, name, email, role, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        newUser.id,
        newUser.name,
        newUser.email,
        newUser.role,
        newUser.createdAt,
        newUser.updatedAt,
      ],
    );

    return newUser;
  }

  async createMany(
    users: Omit<User, 'createdAt' | 'updatedAt'>[],
  ): Promise<User[]> {
    const db = await initDb();
    const timestamp = Date.now();

    // look up any existing rows so we know which to update
    const ids = users.map(u => u.id).filter(Boolean) as string[];
    const existingMap: Record<string, { created_at: number }> = {};

    if (ids.length > 0) {
      const placeholders = ids.map(() => '?').join(',');
      const [res] = await db.executeSql(
        `SELECT id, created_at FROM users WHERE id IN (${placeholders})`,
        ids,
      );
      for (let i = 0; i < res.rows.length; i++) {
        const row = res.rows.item(i);
        existingMap[row.id] = row;
      }
    }

    const result: User[] = [];

    await db.transaction(tx => {
      users.forEach(u => {
        const exists = u.id && existingMap[u.id];
        if (exists) {
          // update existing record
          tx.executeSql(
            `UPDATE users
             SET name = ?, email = ?, role = ?, updated_at = ?
             WHERE id = ?`,
            [u.name, u.email, u.role, timestamp, u.id],
          );
          result.push({
            id: u.id!,
            name: u.name,
            email: u.email,
            role: u.role,
            createdAt: exists.created_at,
            updatedAt: timestamp,
          });
        } else {
          const id = u.id || generateId();
          tx.executeSql(
            `INSERT INTO users
               (id, name, email, role, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?)`,
            [id, u.name, u.email, u.role, timestamp, timestamp],
          );
          result.push({
            id,
            name: u.name,
            email: u.email,
            role: u.role,
            createdAt: timestamp,
            updatedAt: timestamp,
          });
        }
      });
    });

    return result;
  }

  async update(user: User) {
    const db = await initDb();

    const updatedAt = Date.now();

    await db.executeSql(
      `UPDATE users
       SET name = ?, email = ?, role = ?, updated_at = ?
       WHERE id = ?`,
      [user.name, user.email, user.role, updatedAt, user.id],
    );
  }

  async delete(id: string) {
    const db = await initDb();

    await db.executeSql('DELETE FROM users WHERE id = ?', [id]);
  }
}
