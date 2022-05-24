export interface DomAudio extends HTMLAudioElement {
    playPromise?: Promise<any>;
}
export interface AudioHelperOptions {
    enabled?: boolean;
    incoming?: string;
    outgoing?: string;
}
export declare class AudioHelper {
    private readonly _enabled;
    private _incoming;
    private _outgoing;
    private _audio;
    volume: number;
    constructor(options?: AudioHelperOptions);
    private _playSound;
    loadAudio(options: any): void;
    setVolume(volume: any): void;
    playIncoming(val: any): AudioHelper;
    playOutgoing(val: any): AudioHelper;
}
