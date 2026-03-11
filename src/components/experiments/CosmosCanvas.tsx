import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { PlanetFolder } from './PlanetFolder';

// Types for Cosmos Data
export interface SatelliteNode {
    id: string;
    name: string;
    path: string;
    type: 'file';
    extension: string;
    sizeKb: number;
    orbitRadius: number;
    orbitAngle: number;
    orbitSpeed: number;
}

export interface PlanetNode {
    id: string;
    name: string;
    type: 'folder';
    path: string;
    children: PlanetNode[];
    satelliteFiles: SatelliteNode[];
    radius: number;
    hasRings: boolean;
    orbitRadius: number;
    orbitAngle: number;
    orbitSpeed: number;
    totalSizeKb: number;
}

interface CosmosCanvasProps {
    data: PlanetNode;
    bloomEnabled: boolean;
    onNodeSelect: (node: PlanetNode | SatelliteNode | null) => void;
    viewMode: 'solar-system' | 'planet';
    timeScale: number;
}

export default function CosmosCanvas({ data, bloomEnabled, onNodeSelect, viewMode, timeScale }: CosmosCanvasProps) {
    // Generate star field locally so we don't re-render it unnecessarily
    const bgStars = useMemo(() => {
        return <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />;
    }, []);

    return (
        <div className="w-full h-full bg-black">
            <Canvas
                camera={{ position: [0, 50, 100], fov: 60 }}
                gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
                dpr={[1, 2]}
            >
                <color attach="background" args={['#000000']} />

                {/* Thin atmospheric ambient light */}
                <ambientLight intensity={0.1} />

                {/* Primary Sun / Root Source Light */}
                <pointLight position={[0, 0, 0]} intensity={500} color="#ffffff" distance={500} decay={2} />

                <Suspense fallback={null}>
                    {bgStars}

                    {/* Render the Root Node and recurse through children */}
                    <PlanetFolder
                        node={data}
                        isRoot={true}
                        onSelect={onNodeSelect}
                        timeScale={timeScale}
                    />

                    {/* Environment for natural materials */}
                    <Environment preset="city" />

                    {bloomEnabled && (
                        <EffectComposer enableNormalPass={false}>
                            <Bloom
                                luminanceThreshold={0.5} // High threshold so only brightly colored objects bloom
                                mipmapBlur
                                intensity={1.5}
                            />
                        </EffectComposer>
                    )}
                </Suspense>

                <OrbitControls
                    enableDamping
                    dampingFactor={0.05}
                    maxDistance={300}
                    minDistance={5}
                />
            </Canvas>
        </div>
    );
}
