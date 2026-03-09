import { User } from '../types/user';
import { client } from './awsClient';

type ListZellerCustomersRes = {
  listZellerCustomers?: {
    items?: any[] | null;
    nextToken?: string | null;
  } | null;
};

const LIST_ZELLER_CUSTOMERS_WITH_LIMIT_QUERY = `
  query ListZellerCustomers($limit: Int, $nextToken: String) {
    listZellerCustomers(limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        email
        role
      }
      nextToken
    }
  }
`;

export const listZellerCustomers = async (): Promise<User[]> => {
  try {
    const users: User[] = [];
    let nextToken: string | null = null;
    do {
      const data: ListZellerCustomersRes = await client({
        query: LIST_ZELLER_CUSTOMERS_WITH_LIMIT_QUERY,
        variables: { limit: 20, nextToken },
      });
      const items = data.listZellerCustomers?.items ?? [];
      users.push(
        ...items.filter(Boolean).map(user => {
          const now = Date.now();
          return {
            id: String(user?.id ?? ''),
            name: String(user?.name ?? ''),
            email: user?.email ? String(user.email) : undefined,
            role:
              user?.role === 'ADMIN' || user?.role === 'MANAGER'
                ? user.role
                : 'MANAGER',
            createdAt:
              typeof user?.createdAt === 'number' ? user.createdAt : now,
            updatedAt:
              typeof user?.updatedAt === 'number' ? user.updatedAt : now,
          };
        }),
      );
      nextToken = data.listZellerCustomers?.nextToken ?? null;
    } while (nextToken);
    return users;
  } catch {
    throw new Error('Unable to fetch customers right now.');
  }
};
