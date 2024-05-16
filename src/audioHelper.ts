export interface DomAudio extends HTMLAudioElement {
  playPromise?: Promise<void>;
}

export interface AudioHelperOptions {
  /** Enable audio feedback for incoming and outgoing calls */
  enabled?: boolean;
  /** Path to audio file for incoming call */
  incoming?: string;
  /** Path to audio file for outgoing call */
  outgoing?: string;
}

export class AudioHelper {
  /** Current volume */
  public volume?: number;

  private readonly _enabled: boolean;
  private _incoming?: string;
  private _outgoing?: string;
  private _audio?: { [key: string]: DomAudio };

  public constructor(options: AudioHelperOptions = {}) {
    this._enabled = !!options.enabled;
    this.loadAudio(options);
  }

  /** Load incoming and outgoing audio files for feedback */
  public loadAudio(options: AudioHelperOptions): void {
    this._incoming = options.incoming;
    this._outgoing = options.outgoing;
    this._audio = {};
  }

  /** Set volume for incoming and outgoing feedback */
  public setVolume(_volume: number): void {
    let volume = _volume;
    if (volume < 0) {
      volume = 0;
    }
    if (volume > 1) {
      volume = 1;
    }
    this.volume = volume;
    for (const url in this._audio) {
      if (Object.hasOwn(this._audio, url)) {
        this._audio[url].volume = volume;
      }
    }
  }

  /**
   * Play or pause incoming feedback
   * @param value `true` to play audio and `false` to pause
   * @returns
   */
  public playIncoming(value: boolean): AudioHelper {
    return this._playSound(this._incoming!, value, this.volume ?? 0.5);
  }

  /**
   * Play or pause outgoing feedback
   * @param value `true` to play audio and `false` to pause
   * @returns
   */
  public playOutgoing(value: boolean): AudioHelper {
    return this._playSound(this._outgoing!, value, this.volume ?? 1);
  }

  private _playSound(url: string, val: boolean, volume: number): AudioHelper {
    if (!this._enabled || !url || !this._audio) {
      return this;
    }

    if (!this._audio[url]) {
      if (val) {
        this._audio[url] = new Audio();
        this._audio[url].src = url;
        this._audio[url].loop = true;
        this._audio[url].volume = volume;
        this._audio[url].playPromise = this._audio[url].play();
      }
    } else {
      if (val) {
        this._audio[url].currentTime = 0;
        this._audio[url].playPromise = this._audio[url].play();
      } else {
        const audio = this._audio[url];
        if (audio.playPromise !== undefined) {
          audio.playPromise.then(() => {
            audio.pause();
          });
        }
      }
    }
    return this;
  }
}
