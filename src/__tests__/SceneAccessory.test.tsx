import { act, render } from '@testing-library/react-native';
import { StrictMode } from 'react';
import { Text } from 'react-native';

import { CameraCaptureAccessory } from '../CameraCaptureAccessory';
import { getEntry } from '../registry';

const mockSupported = { value: true };

jest.mock('../ExpoSceneAccessoriesModule', () => {
  const { View } = jest.requireActual('react-native');
  return {
    isSceneAccessorySupported: () => mockSupported.value,
    AnchorView: (props: object) => <View testID="anchor" {...props} />,
  };
});

beforeEach(() => {
  mockSupported.value = true;
});

it('registers children under the anchor id and removes them on unmount', () => {
  const screen = render(
    <CameraCaptureAccessory>
      <Text>hi</Text>
    </CameraCaptureAccessory>
  );
  const id = screen.getByTestId('anchor').props.accessoryId;
  expect(getEntry(id)?.kind).toBe('cameraCapture');
  screen.unmount();
  expect(getEntry(id)).toBeUndefined();
});

it('survives StrictMode double effects', () => {
  const screen = render(
    <StrictMode>
      <CameraCaptureAccessory>
        <Text>hi</Text>
      </CameraCaptureAccessory>
    </StrictMode>
  );
  const id = screen.getByTestId('anchor').props.accessoryId;
  expect(getEntry(id)).toBeDefined();
});

it('updates the registry when children change', () => {
  const screen = render(
    <CameraCaptureAccessory>
      <Text>a</Text>
    </CameraCaptureAccessory>
  );
  const id = screen.getByTestId('anchor').props.accessoryId;
  const first = getEntry(id);
  screen.rerender(
    <CameraCaptureAccessory>
      <Text>b</Text>
    </CameraCaptureAccessory>
  );
  expect(getEntry(id)).not.toBe(first);
});

it('forwards availability and defaults enabled to true', () => {
  const onAvailabilityChange = jest.fn();
  const screen = render(
    <CameraCaptureAccessory onAvailabilityChange={onAvailabilityChange}>
      {null}
    </CameraCaptureAccessory>
  );
  const anchor = screen.getByTestId('anchor');
  expect(anchor.props.enabled).toBe(true);
  act(() => anchor.props.onAvailabilityChange({ nativeEvent: { available: true } }));
  expect(onAvailabilityChange).toHaveBeenCalledWith(true);
});

it('renders nothing when unsupported and warns once in dev', () => {
  mockSupported.value = false;
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const screen = render(
    <CameraCaptureAccessory>
      <Text>hi</Text>
    </CameraCaptureAccessory>
  );
  expect(screen.queryByTestId('anchor')).toBeNull();
  expect(screen.queryByText('hi')).toBeNull();
  screen.rerender(
    <CameraCaptureAccessory>
      <Text>again</Text>
    </CameraCaptureAccessory>
  );
  expect(warn).toHaveBeenCalledTimes(1);
  expect(warn).toHaveBeenCalledWith(expect.stringContaining('not supported on this iOS version'));
  warn.mockRestore();
});
