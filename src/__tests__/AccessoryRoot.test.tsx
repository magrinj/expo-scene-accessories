import { act, render } from '@testing-library/react-native';
import { Text } from 'react-native';

import { AccessoryRoot } from '../AccessoryRoot';
import { deleteEntry, setEntry } from '../registry';
import { useSceneAccessory } from '../useSceneAccessory';

jest.mock('../ExpoSceneAccessoriesModule', () => {
  const { View } = jest.requireActual('react-native');
  return { MetricsView: (props: object) => <View testID="metrics" {...props} /> };
});

const metrics = {
  size: { width: 400, height: 300 },
  safeAreaInsets: { top: 10, right: 0, bottom: 0, left: 0 },
  scale: 3,
  activationState: 'active' as const,
};

function Probe() {
  const accessory = useSceneAccessory();
  return (
    <Text>{`${accessory.kind} ${accessory.size.width}x${accessory.size.height} ${accessory.id}`}</Text>
  );
}

it('renders registry children with accessory metrics once known, and follows updates', () => {
  setEntry('g:1', { kind: 'cameraCapture', children: <Probe /> });
  const screen = render(<AccessoryRoot accessoryId="g:1" />);
  expect(screen.queryByText(/cameraCapture/)).toBeNull();

  act(() => screen.getByTestId('metrics').props.onMetricsChange({ nativeEvent: metrics }));
  expect(screen.getByText('cameraCapture 400x300 g:1')).toBeTruthy();

  act(() => setEntry('g:1', { kind: 'cameraCapture', children: <Text>updated</Text> }));
  expect(screen.getByText('updated')).toBeTruthy();

  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  act(() => deleteEntry('g:1'));
  expect(screen.queryByTestId('metrics')).toBeNull();
  // Teardown order (entry removed before UIKit disconnects the scene) is expected, not a misuse.
  expect(warn).not.toHaveBeenCalled();
  warn.mockRestore();
});

it('renders nothing and warns for unknown ids', () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const screen = render(<AccessoryRoot accessoryId="nope" />);
  expect(screen.toJSON()).toBeNull();
  expect(warn).toHaveBeenCalledWith(expect.stringContaining('nope'));
  warn.mockRestore();
});

it('throws when useSceneAccessory is used outside accessory content', () => {
  const error = jest.spyOn(console, 'error').mockImplementation(() => {});
  expect(() => render(<Probe />)).toThrow(/inside accessory content/);
  error.mockRestore();
});
