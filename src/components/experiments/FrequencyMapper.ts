// FrequencyMapper.ts
// Maps audio frequencies to 2D coordinates using sacred geometry and physics formulas

export type PatternType = 'chladni' | 'lissajous' | 'spiral';

export interface ParticleTarget {
    x: number;
    y: number;
    colorIntensity: number; // 0 to 1 based on audio amplitude
}

export class FrequencyMapper {
    private width: number;
    private height: number;
    private centerX: number;
    private centerY: number;

    constructor(canvasWidth: number, canvasHeight: number) {
        this.width = canvasWidth;
        this.height = canvasHeight;
        this.centerX = canvasWidth / 2;
        this.centerY = canvasHeight / 2;
    }

    public updateDimensions(canvasWidth: number, canvasHeight: number) {
        this.width = canvasWidth;
        this.height = canvasHeight;
        this.centerX = canvasWidth / 2;
        this.centerY = canvasHeight / 2;
    }

    /**
     * Map frequency data to a set of target coordinates for particles.
     * @param frequencyData Array of FFT frequency values (0-255)
     * @param pattern Type of geometry algorithm to use
     * @param sensitivity Global multiplier for amplitude responsiveness
     * @param time Continuous time variable for animation evolution
     * @returns Array of ParticleTargets matching the length of the frequency data
     */
    public getTargets(
        frequencyData: Uint8Array,
        pattern: PatternType,
        sensitivity: number,
        time: number
    ): ParticleTarget[] {
        const targets: ParticleTarget[] = [];
        const length = frequencyData.length;
        if (length === 0) return targets;

        // Base radius limits
        const maxRadius = Math.min(this.width, this.height) * 0.45;

        for (let i = 0; i < length; i++) {
            // Normalize Amplitude (0 to 1) and apply sensitivity
            const amplitude = (frequencyData[i] / 255.0) * sensitivity;

            // If amplitude is tiny, pull towards center to avoid static scatter
            const effectiveAmplitude = Math.max(0.05, amplitude);

            // Normalized index (0 to 1) representing frequency pitch
            // Low index = Bass, High index = Treble
            const normIndex = i / length;

            let x = this.centerX;
            let y = this.centerY;

            if (pattern === 'chladni') {
                const result = this.calculateChladni(normIndex, effectiveAmplitude, time, maxRadius);
                x += result.dx;
                y += result.dy;
            } else if (pattern === 'lissajous') {
                const result = this.calculateLissajous(normIndex, effectiveAmplitude, time, maxRadius);
                x += result.dx;
                y += result.dy;
            } else if (pattern === 'spiral') {
                const result = this.calculateSpiral(normIndex, effectiveAmplitude, time, maxRadius);
                x += result.dx;
                y += result.dy;
            }

            targets.push({
                x,
                y,
                colorIntensity: amplitude // Keep pure amplitude for color mapping
            });
        }

        return targets;
    }

    /**
     * Chladni Plate Simulation (Ernst Chladni)
     * Resonant standing wave patterns on a vibrating surface.
     */
    private calculateChladni(normIndex: number, amplitude: number, time: number, maxRadius: number) {
        // n and m dictate the number of nodal lines (the pattern shape)
        // We modulate n and m based on time and frequency pitch to make it dynamic
        const n = 2 + Math.floor(normIndex * 5) + Math.sin(time * 0.5);
        const m = 3 + Math.floor(normIndex * 3) + Math.cos(time * 0.3);

        // Map normIndex to an angle theta (0 to 2PI)
        const theta = normIndex * Math.PI * 4 + time;

        // Approximate Chladni formula: z = A * (cos(n*x)*cos(m*y) - cos(m*x)*cos(n*y))
        // Here we map it to polar coordinates for continuous scattering
        const r = maxRadius * amplitude * 1.5;

        // Chladni perturbation factor
        const chladniFactor = Math.abs(
            Math.cos(n * theta) * Math.cos(m * theta) -
            Math.cos(m * theta) * Math.cos(n * theta)
        );

        // Apply perturbation to radius
        const finalR = r * (0.2 + chladniFactor * 0.8);

        return {
            dx: Math.cos(theta) * finalR,
            dy: Math.sin(theta) * finalR
        };
    }

    /**
     * Lissajous Curves
     * Complex harmonic motion paths formed by intersecting sine waves.
     */
    private calculateLissajous(normIndex: number, amplitude: number, time: number, maxRadius: number) {
        // a and b are the frequencies of the two varying waves
        const a = 3 + (normIndex * 4);
        const b = 2 + (normIndex * 5);

        // Phase shift delta
        const delta = Math.PI / 2 + time;

        const t = normIndex * Math.PI * 10 + (time * 2);

        // Lissajous parametric equations:
        // x = A * sin(a*t + delta)
        // y = B * sin(b*t)

        const A = maxRadius * amplitude;
        const B = maxRadius * amplitude;

        return {
            dx: A * Math.sin(a * t + delta),
            dy: B * Math.sin(b * t)
        };
    }

    /**
     * Fibonacci / Golden Spiral
     * Organic, expanding swirl that reacts sharply to treble frequencies.
     */
    private calculateSpiral(normIndex: number, amplitude: number, time: number, maxRadius: number) {
        // Golden angle in radians
        const phi = 2.4000142079149091; // 137.5 degrees
        // Using index as the "n" in phylotaxis formula
        const n = normIndex * 1000;

        // Base spiral angle
        const theta = n * phi + time;

        // Base spiral radius grows with index, modulated by amplitude
        const rawRadius = Math.sqrt(n) / Math.sqrt(1000); // 0 to 1

        const r = rawRadius * maxRadius * amplitude * 2;

        return {
            dx: Math.cos(theta) * r,
            dy: Math.sin(theta) * r
        };
    }
}
