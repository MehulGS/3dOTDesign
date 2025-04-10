import React, { Suspense, useEffect } from "react";
import { Canvas, useLoader, extend } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { ErrorBoundary } from "react-error-boundary";
import * as THREE from "three";
import { TextGeometry } from "three-stdlib";
import aumlogo from "../src/assets/aumlogo.png";

extend({ TextGeometry });

// ================= Fallback Component =================
function ModelErrorFallback({ error }) {
  return (
    <mesh position={[0, 0, 0]}>
      <textGeometry args={["Model Error", { size: 0.2, height: 0.1 }]} />
      <meshBasicMaterial color="red" />
    </mesh>
  );
}

// ================= Wall Component =================
function Wall({ position, size }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={size} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <lineSegments>
        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(...size)]} />
        <lineBasicMaterial attach="material" color="black" />
      </lineSegments>
    </group>
  );
}

// ================= Logo Component =================
function LogoOnWall() {
  const texture = useLoader(THREE.TextureLoader, aumlogo);
  texture.colorSpace = THREE.SRGBColorSpace; // Ensures proper color

  return (
    <mesh position={[0, 1.5, -2.89]}>
      <planeGeometry args={[1.5, 1.5]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}

// ================= Chair Component =================
function SurgicalChair({ position }) {
  const { scene } = useGLTF("/models/surgical_chair.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return <primitive object={scene} position={position} scale={0.8} />;
}

// ================= Table Component =================
function Table({ position }) {
  const { scene } = useGLTF("/models/surgical__instrument_table_collection.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return <primitive object={scene} position={position} scale={0.8} />;
}

// ================= Nurse Component =================
function Nurse({ position }) {
  const { scene } = useGLTF("/models/nurse_surgical_rigged.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          // Log to debug
          console.log("Material for:", child.name, child.material);

          // Ensure the material uses correct encoding for texture
          if (child.material.map) {
            child.material.map.encoding = THREE.sRGBEncoding;
            child.material.map.needsUpdate = true;
          }

          // If the color looks washed out or gray, you can force the color:
          // child.material.color = new THREE.Color("#f0c8c8"); // Skin tone example

          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  return <primitive object={scene} position={position} scale={0.8} />;
}

// ================= Main Scene =================
export default function LoginForm() {
  return (
    <Canvas
    shadows
    camera={{ position: [0, 2, 5], fov: 50 }}
    style={{ width: '100%', height: '100%' }}
  >
  
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight
        castShadow
        position={[5, 10, 5]}
        intensity={1.5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <OrbitControls />

      {/* Floor */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[6.4, 0.3, 6]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Walls */}
      <Wall position={[0, 2.5, -3]} size={[6, 5, 0.2]} />
      <Wall position={[-3.1, 2.5, 0]} size={[0.2, 5, 6.2]} />
      <Wall position={[3.1, 2.5, 0]} size={[0.2, 5, 6.2]} />

      {/* Logo */}
      <LogoOnWall />

      {/* 3D Models */}
      <Suspense fallback={null}>
        <ErrorBoundary FallbackComponent={ModelErrorFallback}>
          <SurgicalChair position={[0, 0.9, 0]} />
          <Nurse position={[-0.3, 1.3, -1]} />
          <Table position={[-1.6, 0, 0]} />
        </ErrorBoundary>
      </Suspense>
    </Canvas>
  );
}
