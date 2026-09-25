import { createAccessoryId } from '../ids';

it('creates unique generation-qualified ids', () => {
  const a = createAccessoryId();
  const b = createAccessoryId();
  expect(a).not.toBe(b);
  expect(a.split(':')[0]).toBe(b.split(':')[0]);
  expect(a).toMatch(/^[a-z0-9]+:\d+$/);
});
