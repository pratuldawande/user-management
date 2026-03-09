const mockExecuteSql = jest.fn(() =>
  Promise.resolve([
    {
      rows: {
        length: 0,
        item: jest.fn(),
      },
    },
  ])
);

const mockDb = {
  executeSql: mockExecuteSql,
};

export default {
  enablePromise: jest.fn(),
  openDatabase: jest.fn(() => Promise.resolve(mockDb)),
};