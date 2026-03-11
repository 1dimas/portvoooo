import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface FileNode3D {
    id: string;
    name: string;
    path: string;
    type: 'file';
    extension: string;
    sizeKb: number;
    x: number;
    y: number;
    z: number;
    galaxyIndex: number;
}

interface InstancedStarsProps {
    data: FileNode3D[];
    onStarClick: (star: FileNode3D | null) => void;
    hoveredStarId: string | null;
}

const colorMap: Record<string, string> = {
    '.ts': '#3178C6',    // TypeScript Blue
    '.tsx': '#00D8FF',   // React Blue
    '.js': '#F7DF1E',    // JS Yellow
    '.jsx': '#F7DF1E',   // JS Yellow
    '.css': '#264DE4',   // CSS Blue
    '.md': '#ffffff',    // Markdown White
    '.json': '#000000',  // JSON Black
    '.svg': '#FFB13B',   // SVG Orange
    'default': '#888888' // Unknown Grey
};

// Map file extensions to actual THREE.Color instances
function getStarColor(extension: string): THREE.Color {
    const hex = colorMap[extension.toLowerCase()] || colorMap['default'];
    // Force a purely vibrant color that bypasses tone mapping darkness
    const c = new THREE.Color(hex);
    // Convert to sRGB linear if needed, but for MeshBasicMaterial, 
    // we want bright saturated raw values.
    return c;
}

export function InstancedStars({ data, onStarClick, hoveredStarId }: InstancedStarsProps) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Precalculate matrices and colors
    // useMemo prevents recalculating positions on every re-render (e.g. when HUD changes)
    const { matrices, colors } = useMemo(() => {
        const tempObject = new THREE.Object3D();
        const mats = new Float32Array(data.length * 16);
        const cols = new Float32Array(data.length * 3);

        data.forEach((star, i) => {
            // Position
            tempObject.position.set(star.x, star.y, star.z);

            // Scale based on file size
            // A minimum size of 0.5 makes sure small files are still visible
            const scale = Math.max(0.6, Math.min(4.0, Math.log10(star.sizeKb + 1) * 1.5));
            tempObject.scale.set(scale, scale, scale);

            tempObject.updateMatrix();
            tempObject.matrix.toArray(mats, i * 16);

            // Color
            const color = getStarColor(star.extension);
            color.toArray(cols, i * 3);
        });

        return { matrices: mats, colors: cols };
    }, [data]);

    // Handle Raycaster interactions (Hover and Click)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlePointerOver = (e: any) => {
        e.stopPropagation();
        if (e.instanceId !== undefined) {
            setHoveredIndex(e.instanceId);
            document.body.style.cursor = 'pointer';
        }
    };

    const handlePointerOut = () => {
        setHoveredIndex(null);
        document.body.style.cursor = 'crosshair';
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClick = (e: any) => {
        e.stopPropagation();
        if (e.instanceId !== undefined) {
            onStarClick(data[e.instanceId]);
        }
    };

    // Subtle gentle rotation of the entire galaxy
    useFrame((state) => {
        if (meshRef.current) {
            // Very slow rotation
            meshRef.current.rotation.z = state.clock.elapsedTime * 0.02;
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
        }
    });

    return (
        <instancedMesh
            ref={meshRef}
            args={[undefined, undefined, data.length]}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onClick={handleClick}
        >
            <sphereGeometry args={[0.3, 16, 16]}>
                <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
            </sphereGeometry>
            <meshBasicMaterial
                color="white"
                toneMapped={false}
                vertexColors={true}
            />
            <instancedBufferAttribute attach="instanceMatrix" args={[matrices, 16]} />
        </instancedMesh>
    );
}
