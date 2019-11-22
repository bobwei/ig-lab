import createDataLoader from './index';

jest.setTimeout(2 ** 31 - 1);

test('createDataLoader', async () => {
  const result = await createDataLoader({ userId: '', cookie: '' });
  expect(Array.isArray(result)).toBe(true);
});
