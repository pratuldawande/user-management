import { SQLiteDatabase } from 'react-native-sqlite-storage';

export const runMigrations = async (db: SQLiteDatabase) => {
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      role TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  await db.executeSql(`
    CREATE INDEX IF NOT EXISTS idx_users_email
    ON users(email);
  `);
};
