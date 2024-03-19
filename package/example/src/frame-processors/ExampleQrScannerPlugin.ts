import { VisionCameraProxy, Frame } from 'react-native-vision-camera'

const plugin = VisionCameraProxy.initFrameProcessorPlugin('example_qr_scanner_plugin')

export function exampleQrScannerPlugin(frame: Frame) {
  'worklet'

  if (plugin == null) throw new Error('Failed to load Frame Processor Plugin "example_plugin"!');

  console.log('ExampleQRScannerPlugin result', plugin.call(frame));
}
