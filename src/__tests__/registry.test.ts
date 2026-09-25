import { deleteEntry, getEntry, setEntry, subscribe } from '../registry';

it('stores entries and notifies subscribers until they unsubscribe', () => {
  const listener = jest.fn();
  const unsubscribe = subscribe(listener);
  const entry = { kind: 'cameraCapture' as const, children: 'x' };
  setEntry('a', entry);
  expect(getEntry('a')).toBe(entry);
  expect(listener).toHaveBeenCalledTimes(1);
  unsubscribe();
  setEntry('a', { ...entry });
  expect(listener).toHaveBeenCalledTimes(1);
});

it('keeps a stable snapshot until the entry changes', () => {
  setEntry('s', { kind: 'cameraCapture', children: null });
  expect(getEntry('s')).toBe(getEntry('s'));
});

it('deletes idempotently and notifies once', () => {
  const listener = jest.fn();
  subscribe(listener);
  setEntry('d', { kind: 'externalNonInteractive', children: null });
  deleteEntry('d');
  deleteEntry('d');
  expect(getEntry('d')).toBeUndefined();
  expect(listener).toHaveBeenCalledTimes(2);
});
