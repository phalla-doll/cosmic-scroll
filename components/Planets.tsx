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
          roughness={0.4}
          metalness={0.3}
          emissive={config.color}
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Orbit Ring visual aid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[config.positionX - 0.15, config.positionX + 0.15, 128]} />
        <meshBasicMaterial color={config.color} opacity={0.3} transparent side={2} />
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
        <meshBasicMaterial color="#FFD700" toneMapped={false} />
      </mesh>
      {/* High intensity point light to reach far planets */}
      <pointLight intensity={1000} distance={2000} decay={2} color="#ffffff" />
      <ambientLight intensity={0.5} />
    </group>
  );
};