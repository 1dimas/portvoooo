import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { InstancedStars, FileNode3D } from './InstancedStars';

interface GalaxyCanvasProps {
    data: FileNode3D[];
    enableBloom?: boolean;
}

// Camera control helper to animate zoom to selected star
function CameraRig({ targetStar }: { targetStar: FileNode3D | null }) {
    const { camera, controls } = useThree();
    const vec = new THREE.Vector3();
    const targetVec = new THREE.Vector3();

    useFrame((state, delta) => {
        if (targetStar) {
            // Target the star's position
            targetVec.set(targetStar.x, targetStar.y, targetStar.z);

            // Move camera slightly offset from the star to see it clearly
            vec.copy(targetVec).add(new THREE.Vector3(0, 0, 5));
            camera.position.lerp(vec, delta * 3);

            // If we have OrbitControls active, we also need to update its target
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (controls && (controls as any).target) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (controls as any).target.lerp(targetVec, delta * 3);
            }
        }
    });

    return null;
}

// Floating HUD for selected star information
function InformationHUD({ star, onClose }: { star: FileNode3D; onClose: () => void }) {
    if (!star) return null;

    return (
        <Html position={[star.x, star.y, star.z]} center zIndexRange={[100, 0]}>
            <div className="bg-black/80 backdrop-blur-md border border-white/20 p-4 rounded-lg shadow-2xl min-w-[200px] animate-in slide-in-from-bottom-2 fade-in font-sans text-left">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-bold text-white truncate max-w-[150px]" title={star.name}>
                        {star.name}
                    </h3>
                    <button
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onClick={(e: any) => { e.stopPropagation(); onClose(); }}
                        className="text-white/50 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-1">
                    <div className="flex justify-between">
                        <span className="text-xs text-white/40">Type</span>
                        <span className="text-xs text-cyan-400 font-mono">{star.extension || 'unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-xs text-white/40">Size</span>
                        <span className="text-xs text-white/80 font-mono">{star.sizeKb.toFixed(2)} KB</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-white/10">
                        <span className="text-[10px] text-white/30 block mb-1">Path</span>
                        <span className="text-[10px] text-white/50 font-mono break-all leading-tight">
                            {star.path}
                        </span>
                    </div>
                </div>
            </div>
        </Html>
    );
}

export function GalaxyCanvas({ data, enableBloom = true }: GalaxyCanvasProps) {
    const [selectedStar, setSelectedStar] = useState<FileNode3D | null>(null);
    const [hoveredStarId, setHoveredStarId] = useState<string | null>(null);

    // Filter out huge lists for safety if data somehow breaks
    const safeData = useMemo(() => {
        return data.length > 50000 ? data.slice(0, 50000) : data;
    }, [data]);

    return (
        <div className="w-full h-full relative cursor-crosshair">
            <Canvas
                camera={{ position: [0, 0, 50], fov: 60 }}
                gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
                dpr={[1, 2]} // Limit pixel ratio for performance
            >
                <color attach="background" args={['#020205']} />

                <ambientLight intensity={0.2} />
                <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" distance={100} />

                <InstancedStars
                    data={safeData}
                    onStarClick={setSelectedStar}
                    hoveredStarId={hoveredStarId}
                />

                {selectedStar && (
                    <InformationHUD
                        star={selectedStar}
                        onClose={() => setSelectedStar(null)}
                    />
                )}

                <CameraRig targetStar={selectedStar} />

                <OrbitControls
                    enableDamping
                    dampingFactor={0.05}
                    maxDistance={200}
                    minDistance={2}
                    autoRotate={!selectedStar} // Auto rotate when nothing is selected
                    autoRotateSpeed={0.5}
                />

                {enableBloom && (
                    <EffectComposer enableNormalPass={false} multisampling={0}>
                        <Bloom
                            luminanceThreshold={0.2}
                            luminanceSmoothing={0.9}
                            intensity={1.5}
                            mipmapBlur
                        />
                    </EffectComposer>
                )}
            </Canvas>

            {/* Helper Overlay UI */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none text-center">
                <p className="text-xs text-white/30 font-mono">
                    Drag to rotate • Scroll to zoom • Click star for data
                </p>
                <p className="text-[10px] text-white/20 mt-1">
                    Rendering {safeData.length} files as celestial bodies
                </p>
            </div>
        </div>
    );
}
