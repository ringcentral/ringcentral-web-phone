export interface DomAudio extends HTMLAudioElement {
    playPromise?: Promise<any>;
}

export interface AudioHelperOptions {
    enabled?: boolean;
    incoming?: string;
    outgoing?: string;
}

export class AudioHelper {
    private readonly _enabled: boolean;
    private _incoming: string;
    private _outgoing: string;
    private _audio: {[key: string]: DomAudio};

    public volume: number;

    public constructor(options: AudioHelperOptions = {}) {
        this._enabled = !!options.enabled;
        this.loadAudio(options);
    }

    private _playSound(url, val, volume): AudioHelper {
        if (!this._enabled || !url) return this;

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
                var audio = this._audio[url];
                if (audio.playPromise !== undefined) {
                    audio.playPromise.then(function() {
                        audio.pause();
                    });
                }
            }
        }

        return this;
    }

    public loadAudio(options): void {
        this._incoming = options.incoming;
        this._outgoing = options.outgoing;
        this._audio = {};
    }

    public setVolume(volume): void {
        if (volume < 0) {
            volume = 0;
        }
        if (volume > 1) {
            volume = 1;
        }
        this.volume = volume;
        for (var url in this._audio) {
            if (this._audio.hasOwnProperty(url)) {
                this._audio[url].volume = volume;
            }
        }
    }

    public playIncoming(val): AudioHelper {
        return this._playSound(this._incoming, val, this.volume || 0.5);
    }

    public playOutgoing(val): AudioHelper {
        return this._playSound(this._outgoing, val, this.volume || 1);
    }
}
