import type { DeviceManager } from './types';

export class DefaultDeviceManager implements DeviceManager {
  public async getInputDeviceId(): Promise<string> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const defaultInputDevice = devices.find((device) => device.kind === 'audioinput');
    return defaultInputDevice!.deviceId;
  }

  public async getOutputDeviceId(): Promise<string | undefined> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const defaultOutputDevice = devices.find((device) => device.kind === 'audiooutput');
    return defaultOutputDevice?.deviceId;
  }
}
