import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SatelliteNode, PlanetNode } from './CosmosCanvas';

interface SatelliteFileProps {
    file: SatelliteNode;
    onSelect: (node: PlanetNode | SatelliteNode | null) => void;
    timeScale: number;
}

const fileColorMap: Record<string, string> = {
    '.ts': '#3178C6',    // TypeScript Blue
    '.tsx': '#00D8FF',   // React Blue
    '.js': '#F7DF1E',    // JS Yellow
    '.jsx': '#F7DF1E',   // JS Yellow
    '.css': '#264DE4',   // CSS Blue
    '.md': '#ffffff',    // Markdown White
    '.json': '#ac00e6',  // JSON Purple
    '.svg': '#FFB13B',   // SVG Orange
    'default': '#888888' // Unknown Grey
};

function getSatelliteColor(extension: string): string {
    return fileColorMap[extension.toLowerCase()] || fileColorMap['default'];
}

export function SatelliteFile({ file, onSelect, timeScale }: SatelliteFileProps) {
    const moonRef = useRef<THREE.Mesh>(null);

    // Orbit Mechanics calculations
    useFrame((state) => {
        if (moonRef.current) {
            const time = state.clock.elapsedTime * timeScale;

            // Revolve around parent planet using local coordinates
            const x = Math.cos(file.orbitAngle + time * file.orbitSpeed) * file.orbitRadius;
            const z = Math.sin(file.orbitAngle + time * file.orbitSpeed) * file.orbitRadius;

            moonRef.current.position.set(x, 0, z);

            // Subtle self-rotation for moons
            moonRef.current.rotation.y += 0.02 * timeScale;
        }
    });

    const handleFileClick = (e: any) => {
        e.stopPropagation();
        onSelect(file);
    };

    const color = getSatelliteColor(file.extension);

    // Make the scale representative of file size, minimum visual size 0.2
    const size = Math.max(0.2, Math.min(1.0, Math.log10(file.sizeKb + 1) * 0.3));

    return (
        <mesh ref={moonRef} onClick={handleFileClick}>
            <sphereGeometry args={[size, 16, 16]} />
            <meshStandardMaterial
                color={color}
                emissive={new THREE.Color(color).multiplyScalar(1.5)} // Make files glow slightly
                emissiveIntensity={1}
                toneMapped={false}
            />
        </mesh>
    ); // Small glowing dots for files
}
