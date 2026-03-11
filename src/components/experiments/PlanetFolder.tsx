import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SatelliteFile } from './SatelliteFile';
import { PlanetNode, SatelliteNode } from './CosmosCanvas';
import { Line } from '@react-three/drei';

interface PlanetFolderProps {
    node: PlanetNode;
    isRoot?: boolean;
    onSelect: (node: PlanetNode | SatelliteNode | null) => void;
    timeScale: number;
}

export function PlanetFolder({ node, isRoot = false, onSelect, timeScale }: PlanetFolderProps) {
    const groupRef = useRef<THREE.Group>(null);
    const planetRef = useRef<THREE.Mesh>(null);

    // Orbit Mechanics
    useFrame((state) => {
        if (!isRoot && groupRef.current) {
            // Revolve around parent
            const time = state.clock.elapsedTime * timeScale;
            // Orbit calculation
            const x = Math.cos(node.orbitAngle + time * node.orbitSpeed) * node.orbitRadius;
            const z = Math.sin(node.orbitAngle + time * node.orbitSpeed) * node.orbitRadius;
            groupRef.current.position.set(x, 0, z);
        }

        if (planetRef.current) {
            // Self rotation
            planetRef.current.rotation.y += 0.005 * timeScale;
        }
    });

    const handlePlanetClick = (e: any) => {
        e.stopPropagation();
        onSelect(node);
    };

    // Calculate dynamic color based on children count or depth
    const planetColor = isRoot ? "#ffaa00" : new THREE.Color().setHSL(Math.random(), 0.8, 0.4);

    return (
        <group ref={groupRef}>
            {/* The Planet itself */}
            <mesh ref={planetRef} onClick={handlePlanetClick}>
                <sphereGeometry args={[node.radius, 32, 32]} />
                <meshStandardMaterial
                    color={planetColor}
                    roughness={0.7}
                    metalness={isRoot ? 0.8 : 0.2}
                    emissive={isRoot ? new THREE.Color("#ffaa00") : new THREE.Color("#000000")}
                    emissiveIntensity={isRoot ? 2 : 0}
                />
            </mesh>

            {/* Orbit Path Visualizer (Optional: hide if too cluttered) */}
            {!isRoot && (
                <Line
                    points={generateCirclePoints(node.orbitRadius)}
                    color="white"
                    lineWidth={0.5}
                    transparent
                    opacity={0.1}
                    rotation-x={Math.PI / 2}
                />
            )}

            {/* Saturn-like rings if the folder is dense */}
            {node.hasRings && (
                <mesh rotation-x={Math.PI / 2 - 0.2}>
                    <ringGeometry args={[node.radius + 1, node.radius + 3, 64]} />
                    <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} transparent opacity={0.3} />
                </mesh>
            )}

            {/* Orbiting File Satellites */}
            {node.satelliteFiles.map((file) => (
                <SatelliteFile
                    key={file.id}
                    file={file}
                    onSelect={onSelect}
                    timeScale={timeScale}
                />
            ))}

            {/* Recursive Sub-folders (Moons/Inner Planets) */}
            {node.children.map((child) => (
                <PlanetFolder
                    key={child.id}
                    node={child}
                    onSelect={onSelect}
                    timeScale={timeScale}
                />
            ))}
        </group>
    );
}

// Helper to draw orbit paths
function generateCirclePoints(radius: number, segments: number = 64) {
    const points = [];
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0));
    }
    return points;
}
