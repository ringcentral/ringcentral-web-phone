## Audio Devices

By default, this SDK will use the default audio input device and output device
available.

### Change default devices

If you would like to change the default audio input and output devices, you may
create your own `DeviceManager` class:

```ts
import { DefaultDeviceManager } from 'ringcentral-web-phone/device-manager';

class MyDeviceManager extends DefaultDeviceManager {
  public async getInputDeviceId(): Promise<string> {
    return 'my-preferred-input-device-id';
  }

  public async getOutputDeviceId(): Promise<string | undefined> {
    return 'my-preferred-output-device-id';
  }
}

...

const deviceManager = new MyDeviceManager();
const webPhone = new WebPhone({ sipInfo, deviceManager });

// or you can change it afterwards at any time:
// webPhone.deviceManager = deviceManager;
```

To get all the devices available, please refer to
[MediaDevices: enumerateDevices() method](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices).

Please note that, changing `deviceManager` will only affect future calls. It
won't change the device of ongoing calls.

### Change device of ongoing calls

```ts
await callSession.changeInputDevice("my-preferred-input-device-id");
await callSession.changeOutputDevice("my-preferred-output-device-id");
```

### firefox

Firefox doesn't support output device selection. Please use `undefined` as
`outputDeviceId`.
