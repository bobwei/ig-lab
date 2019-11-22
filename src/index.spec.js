import 'dotenv/config';
import * as R from 'ramda';

import DataLoader from './index';

jest.setTimeout(2 ** 31 - 1);

test('DataLoader', async () => {
  const { COOKIE: cookie } = R.evolve({ COOKIE: (s) => Buffer.from(s, 'base64') })(process.env);
  const loader = new DataLoader({ cookie });
  const result = await loader.load({ userId: '110379' });
  expect(Array.isArray(result)).toBe(true);
});
