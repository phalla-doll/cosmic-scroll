import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { PlanetConfig } from '../types';

interface PlanetProps {
  config: PlanetConfig;
  innerRef?: React.RefObject<Mesh>; // Ref for the mesh itself
  pivotRef?: React.RefObject<any>;  // Ref for the orbit pivot
}

export const Planet: React.FC<PlanetProps> = ({ config, innerRef, pivotRef }) => {
  const meshRef = useRef<Mesh>(null);
  
  // Use the passed ref or the local one
  const finalRef = (innerRef || meshRef) as React.MutableRefObject<Mesh>;

  useFrame((state, delta) => {
    if (finalRef.current) {
      // Self rotation
      finalRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={pivotRef}>
      <mesh 
        ref={finalRef} 
        position={[config.positionX, 0, 0]} 
        scale={[config.scale, config.scale, config.scale]}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial 
          color={config.color} 
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
      {/* Orbit Ring visual aid (optional) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[config.positionX - 0.1, config.positionX + 0.1, 128]} />
        <meshBasicMaterial color="#ffffff" opacity={0.1} transparent side={2} />
      </mesh>
    </group>
  );
};

export const Sun: React.FC = () => {
  const ref = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={ref} scale={[5, 5, 5]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color="#FFD700" />
      </mesh>
      <pointLight intensity={2} distance={300} decay={1} color="#ffffff" />
      <ambientLight intensity={0.2} />
    </group>
  );
};
