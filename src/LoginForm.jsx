import React, { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import aumlogo from "../src/assets/aumlogo.png";
// import surgical_chair from "../src/assets/surgical_chair.glb"

// Wall Component
function Wall({ position, size }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#87cefa" wireframe />
    </mesh>
  );
}

// Logo Component on the back wall
function LogoOnWall() {
  const texture = useLoader(THREE.TextureLoader, aumlogo);

  return (
    <mesh position={[0, 1.5, -2.89]}>
      <planeGeometry args={[1.5, 1.5]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}

// Surgical Chair Component
function SurgicalChair() {
  const gltf = useGLTF("/models/surgical_chair.glb"); // ✅ CORRECT


  return (
    <primitive object={gltf.scene} position={[0, 0, 0]} scale={0.8} />
  );
}

// Main Room
export default function LoginForm() {
  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* Back, Left & Right Walls */}
      <Wall position={[0, 1, -3]} size={[6, 2, 0.2]} />
      <Wall position={[-3, 1, 0]} size={[0.2, 2, 6]} />
      <Wall position={[3, 1, 0]} size={[0.2, 2, 6]} />

      {/* Aum Logo */}
      <LogoOnWall />

      {/* Surgical Chair Model */}
      <Suspense fallback={null}>
        <SurgicalChair />
      </Suspense>
    </Canvas>
  );
}
