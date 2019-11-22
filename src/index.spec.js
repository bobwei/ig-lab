import 'dotenv/config';

import DataLoader from './index';

jest.setTimeout(2 ** 31 - 1);

test('createDataLoader', async () => {
  const loader = new DataLoader({ userId: '110379', cookie: process.env.COOKIE });
  const result = await loader.load();
  expect(Array.isArray(result)).toBe(true);
});
