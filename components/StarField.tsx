import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'three/examples/jsm/utils/BufferGeometryUtils.js'; // Note: In a real env, we'd generate random numbers manually or use a library, but let's implement a simple generator
import { Vector3 } from 'three';

const StarField: React.FC = () => {
  const ref = useRef<any>();
  
  const sphere = useMemo(() => {
    const temp = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
        const x = (Math.random() - 0.5) * 800;
        const y = (Math.random() - 0.5) * 800;
        const z = (Math.random() - 0.5) * 800;
        temp[i * 3] = x;
        temp[i * 3 + 1] = y;
        temp[i * 3 + 2] = z;
    }
    return temp;
  }, []);

  useFrame((state, delta) => {
    if(ref.current) {
        ref.current.rotation.x -= delta / 15;
        ref.current.rotation.y -= delta / 20;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.5}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

export default StarField;
