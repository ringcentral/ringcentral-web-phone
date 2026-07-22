import type {
  DefaultMediaObjects,
  MediaProvider,
  MediaProviderContext,
  MediaSession,
} from "./types.js";

export class DefaultMediaProvider
  implements MediaProvider<DefaultMediaObjects>
{
  public async create(
    context: MediaProviderContext,
  ): Promise<MediaSession<DefaultMediaObjects>> {
    const session = new DefaultMediaSession(context);
    try {
      await session.init();
      return session;
    } catch (error) {
      try {
        await session.dispose();
      } catch {}
      throw error;
    }
  }
}

class DefaultMediaSession implements MediaSession<DefaultMediaObjects> {
  public media = {} as DefaultMediaObjects;

  public constructor(private context: MediaProviderContext) {}

  public async init() {
    if (this.media.rtcPeerConnection) {
      return;
    }
    this.media.rtcPeerConnection = new RTCPeerConnection({
      iceServers: this.context.iceServers.map((urls) => ({
        urls: `stun:${urls}`,
      })),
    });

    const tempStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    for (const track of tempStream.getTracks()) track.stop();

    const inputDeviceId = await this.context.deviceManager.getInputDeviceId();
    const stream = await this.getInputStream(inputDeviceId);
    this.commitInputStream(inputDeviceId, stream);
    this.addInputTracks(stream);
    this.media.rtcPeerConnection.ontrack = async (event) => {
      const audioElement = document.createElement("audio");
      audioElement.hidden = true;
      audioElement.autoplay = true;
      audioElement.srcObject = event.streams[0];
      this.media.audioElement = audioElement;
      this.media.outputDeviceId =
        await this.context.deviceManager.getOutputDeviceId();
      if (this.media.outputDeviceId) {
        await audioElement.setSinkId(this.media.outputDeviceId);
      }
    };
  }

  public async createOffer({
    iceRestart = false,
  }: {
    iceRestart?: boolean;
  } = {}) {
    const rtcPeerConnection = this.media.rtcPeerConnection;
    if (iceRestart || !rtcPeerConnection.localDescription) {
      const offer = await rtcPeerConnection.createOffer({ iceRestart });
      await rtcPeerConnection.setLocalDescription(offer);
      await this.waitForIceGatheringComplete();
    }
    return rtcPeerConnection.localDescription!.sdp!;
  }

  public async answerOffer(sdp: string) {
    const rtcPeerConnection = this.media.rtcPeerConnection;
    await rtcPeerConnection.setRemoteDescription({ type: "offer", sdp });
    const answer = await rtcPeerConnection.createAnswer();
    await rtcPeerConnection.setLocalDescription(answer);
    await this.waitForIceGatheringComplete();
    return rtcPeerConnection.localDescription!.sdp!;
  }

  public async applyAnswer(sdp: string) {
    await this.media.rtcPeerConnection.setRemoteDescription({
      type: "answer",
      sdp,
    });
  }

  public async changeInputDevice(deviceId: string) {
    const previousStream = this.media.mediaStream;
    const stream = await this.getInputStream(deviceId);
    const newAudioTrack = stream.getAudioTracks()[0];
    const sender = this.media.rtcPeerConnection
      .getSenders()
      .find((candidate) => candidate.track?.kind === "audio");
    try {
      if (sender) {
        await sender.replaceTrack(newAudioTrack);
      } else {
        this.addInputTracks(stream);
      }
    } catch (error) {
      for (const track of stream.getTracks()) track.stop();
      throw error;
    }
    this.commitInputStream(deviceId, stream);
    for (const track of previousStream?.getAudioTracks() ?? []) {
      track.stop();
    }
  }

  public async changeOutputDevice(deviceId: string) {
    this.media.outputDeviceId = deviceId;
    if (deviceId) {
      await this.media.audioElement.setSinkId(deviceId);
    }
  }

  public async setMuted(muted: boolean) {
    this.media.rtcPeerConnection.getSenders().forEach((sender) => {
      if (sender.track) {
        sender.track.enabled = !muted;
      }
    });
  }

  public async sendDtmf(
    tones: string,
    duration?: number,
    interToneGap?: number,
  ) {
    for (const sender of this.media.rtcPeerConnection.getSenders()) {
      if (sender.dtmf?.canInsertDTMF) {
        sender.dtmf.insertDTMF(tones, duration, interToneGap);
      }
    }
  }

  public async dispose() {
    this.media.rtcPeerConnection?.close();
    for (const track of this.media.mediaStream?.getTracks() ?? []) track.stop();
    if (this.media.audioElement) {
      this.media.audioElement.srcObject = null;
    }
  }

  private async getInputStream(deviceId: string) {
    return await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: { deviceId: { exact: deviceId } },
    });
  }

  private commitInputStream(deviceId: string, stream: MediaStream) {
    this.media.inputDeviceId = deviceId;
    this.media.mediaStream = stream;
    this.context.onMediaStream?.(stream);
  }

  private addInputTracks(stream: MediaStream) {
    stream.getAudioTracks().forEach((track) => {
      const sender = this.media.rtcPeerConnection.addTrack(track);
      const params = sender.getParameters();
      if (!params.encodings || params.encodings.length === 0) {
        params.encodings = [{}];
      }
      params.encodings.forEach((encoding) => {
        encoding.priority = "high";
      });
      sender.setParameters(params);
    });
  }

  private async waitForIceGatheringComplete(timeoutMs = 2000) {
    const rtcPeerConnection = this.media.rtcPeerConnection;
    if (rtcPeerConnection.iceGatheringState === "complete") {
      return;
    }
    await new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        cleanup();
        resolve();
      }, timeoutMs);
      const onIceCandidate = (event: RTCPeerConnectionIceEvent) => {
        if (event.candidate === null) {
          cleanup();
          resolve();
        }
      };
      const cleanup = () => {
        clearTimeout(timeout);
        rtcPeerConnection.removeEventListener("icecandidate", onIceCandidate);
      };
      rtcPeerConnection.addEventListener("icecandidate", onIceCandidate);
    });
  }
}
