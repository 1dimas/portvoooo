export class AudioEngine {
    private audioContext: AudioContext | null = null;
    private analyser: AnalyserNode | null = null;
    private mediaStreamSource: MediaStreamAudioSourceNode | null = null;
    private stream: MediaStream | null = null;
    private dataArray: Uint8Array | null = null;

    private initialized: boolean = false;

    public async initialize(): Promise<void> {
        if (this.initialized) return;

        try {
            // Request microphone access
            this.stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false,
                    autoGainControl: false,
                    noiseSuppression: false
                }
            });

            // Standardize AudioContext across browsers
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            this.audioContext = new AudioContextClass();

            this.analyser = this.audioContext.createAnalyser();

            // FFT Size determines the frequency resolution. 
            // 2048 gives 1024 data points (bins)
            this.analyser.fftSize = 2048;
            this.analyser.smoothingTimeConstant = 0.8; // Smooths out the visual response

            this.mediaStreamSource = this.audioContext.createMediaStreamSource(this.stream);
            this.mediaStreamSource.connect(this.analyser);

            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);

            this.initialized = true;
        } catch (error) {
            console.error("AudioEngine: Microphone access denied or not available", error);
            throw new Error("Microphone access is required for this experiment.");
        }
    }

    public getFrequencyData(): Uint8Array {
        if (!this.initialized || !this.analyser || !this.dataArray) {
            return new Uint8Array(0);
        }

        // Typecast needed due to strict TypeScript DOM types for ArrayBufferLike vs ArrayBuffer
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.analyser.getByteFrequencyData(this.dataArray as any);
        return this.dataArray;
    }

    public getAverageVolume(): number {
        const data = this.getFrequencyData();
        if (data.length === 0) return 0;

        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            sum += data[i];
        }

        // Return a normalized value between 0 and 1
        return (sum / data.length) / 255;
    }

    // Split frequencies into Low (Bass), Mid, and High (Treble) bands
    public getFrequencyBands() {
        const data = this.getFrequencyData();
        if (data.length === 0) return { bass: 0, mid: 0, treble: 0 };

        const length = data.length;

        // Define ranges (approximate indices for a 1024 bin array)
        // Bass: 0 - 64 (~0-1.4kHz)
        // Mid: 65 - 512 (~1.4kHz-11kHz)
        // Treble: 513 - 1023 (~11kHz-22kHz)

        const bassEnd = Math.floor(length * 0.05) || 1;
        const midEnd = Math.floor(length * 0.5) || 2;

        let bassSum = 0;
        let midSum = 0;
        let trebleSum = 0;

        for (let i = 0; i < length; i++) {
            const val = data[i] / 255.0; // Normalize 0-1
            if (i < bassEnd) {
                bassSum += val;
            } else if (i < midEnd) {
                midSum += val;
            } else {
                trebleSum += val;
            }
        }

        return {
            bass: bassSum / bassEnd,
            mid: midSum / (midEnd - bassEnd),
            treble: trebleSum / (length - midEnd)
        };
    }

    public isInitialized(): boolean {
        return this.initialized;
    }

    public stop(): void {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }

        if (this.mediaStreamSource) {
            this.mediaStreamSource.disconnect();
            this.mediaStreamSource = null;
        }

        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
            this.audioContext = null;
        }

        this.analyser = null;
        this.dataArray = null;
        this.initialized = false;
    }
}
