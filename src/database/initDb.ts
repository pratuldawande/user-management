import SQLite from 'react-native-sqlite-storage';
import { runMigrations } from './migrations';

SQLite.enablePromise(true);

let dbInstance: SQLite.SQLiteDatabase | null = null;

export const initDb = async () => {
  if (dbInstance) {
    return dbInstance;
  }

  const db = await SQLite.openDatabase({
    name: 'rn-app.db',
    location: 'default',
  });

  await runMigrations(db);

  dbInstance = db;

  return db;
};
