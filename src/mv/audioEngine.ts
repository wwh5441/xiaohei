import { AUDIO_SRC } from './mvData';
import { clamp01, parseId3CoverArt, type AudioBands } from './mvTimeline';

export class MVAudioAnalyzer {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private freqBuffer: Uint8Array<ArrayBuffer> | null = null;
  private connectedElement: HTMLAudioElement | null = null;

  /**
   * Attaches Web Audio FFT analysis to `audioEl` ONLY after confirming `AudioContext`
   * is actively `'running'`, and routes `source -> analyser -> destination` so speaker
   * audio plays at full volume and the media clock never stalls or mutes.
   */
  public async attach(audioEl: HTMLAudioElement): Promise<void> {
    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;

      if (!this.audioContext) {
        this.audioContext = new Ctx();
        this.audioContext.onstatechange = () => {
          if (
            this.audioContext &&
            this.audioContext.state === 'suspended' &&
            this.connectedElement &&
            !this.connectedElement.paused
          ) {
            void this.audioContext.resume().catch(() => {});
          }
        };
      }

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume().catch(() => {});
      }

      // Never reroute `<audio>` into a non-running AudioContext; wait for a live user gesture
      if (this.audioContext.state !== 'running') {
        return;
      }

      if (this.connectedElement === audioEl && this.analyser) {
        return;
      }

      if (!this.sourceNode) {
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 512;
        this.analyser.smoothingTimeConstant = 0.74;
        this.sourceNode = this.audioContext.createMediaElementSource(audioEl);
        this.sourceNode.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        this.freqBuffer = new Uint8Array(new ArrayBuffer(this.analyser.frequencyBinCount));
        this.connectedElement = audioEl;
      }
    } catch {
      // Native `<audio>` continues playing with deterministic 96 BPM beat physics
    }
  }

  public sampleBands(): AudioBands {
    if (!this.analyser || !this.freqBuffer || !this.audioContext) {
      return { bass: 0, mid: 0, high: 0, overall: 0, liveActive: false };
    }

    this.analyser.getByteFrequencyData(this.freqBuffer);

    let bassSum = 0;
    for (let i = 1; i <= 3; i++) bassSum += this.freqBuffer[i];
    const bass = clamp01(bassSum / (3 * 255));

    let midSum = 0;
    for (let i = 4; i <= 24; i++) midSum += this.freqBuffer[i];
    const mid = clamp01(midSum / (21 * 255));

    let highSum = 0;
    for (let i = 25; i <= 80; i++) highSum += this.freqBuffer[i];
    const high = clamp01(highSum / (56 * 255));

    const overall = clamp01(bass * 0.45 + mid * 0.35 + high * 0.2);
    const liveActive = overall > 0.015 && this.audioContext.state === 'running';

    return { bass, mid, high, overall, liveActive };
  }

  public dispose(): void {
    try {
      this.sourceNode?.disconnect();
      this.analyser?.disconnect();
      if (this.audioContext && this.audioContext.state !== 'closed') {
        void this.audioContext.close().catch(() => {});
      }
    } catch {
      // ignore
    }
  }
}

export async function loadEmbeddedCoverUrl(signal?: AbortSignal): Promise<string | null> {
  try {
    const res = await fetch(AUDIO_SRC, {
      headers: { Range: 'bytes=0-327680' },
      signal,
    });
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    const parsed = parseId3CoverArt(buffer);
    if (!parsed) return null;
    const copy = new Uint8Array(parsed.imageBytes.byteLength);
    copy.set(parsed.imageBytes);
    const blob = new Blob([copy.buffer], { type: parsed.mimeType });
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}
