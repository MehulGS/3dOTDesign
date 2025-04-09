import React, { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { ErrorBoundary } from "react-error-boundary"; // 👈 Add this
import aumlogo from "../src/assets/aumlogo.png";
import { TextGeometry } from "three-stdlib";
import { extend } from "@react-three/fiber";

extend({ TextGeometry });

// Reusable Fallback UI for ErrorBoundary
function ModelErrorFallback({ error }) {
  return (
    <mesh position={[0, 0, 0]}>
      <textGeometry args={["Model Error", { size: 0.2, height: 0.1 }]} />
      <meshBasicMaterial color="red" />
    </mesh>
  );
}

// Wall Component
function Wall({ position, size }) {
  return (
    <group position={position}>
      {/* Main white wall */}
      <mesh>
        <boxGeometry args={size} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Border outline using edges */}
      <lineSegments>
        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(...size)]} />
        <lineBasicMaterial attach="material" color="black" linewidth={2} />
      </lineSegments>
    </group>
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
function SurgicalChair({ position }) {
  const gltf = useGLTF("/models/surgical_chair.glb");

  React.useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // child.material = new THREE.MeshStandardMaterial({ color: "#00a63e" }); 
      }
    });
  }, [gltf]);

  return <primitive object={gltf.scene} position={position} scale={0.8} />;
}

// Nurse Component
function Nurse({ position }) {
  const gltf = useGLTF("/models/nurse_surgical_rigged.glb");

  React.useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [gltf]);

  return <primitive object={gltf.scene} position={position} scale={0.8} />;
}

// Table Component
function Table({ position }) {
  const gltf = useGLTF("/models/surgical__instrument_table_collection.glb");

  React.useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // child.material = new THREE.MeshStandardMaterial({ color: "#00bcff" }); 
      }
    });
  }, [gltf]);

  return <primitive object={gltf.scene} position={position} scale={0.8} />;
}

function Bottle({ position }) {
  const gltf = useGLTF("/models/Purple_Water_Bottle_o_0409083005_texture.glb");

  React.useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        // child.material = new THREE.MeshStandardMaterial(); 
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [gltf]);

  return <primitive object={gltf.scene} position={position} scale={0.8} />;
}

// Main 3D Scene Component
export default function LoginForm() {
  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />

      {/* Floor */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[6.4, 0.3, 6]} color="#000000"/>{""}
        <meshStandardMaterial />
      </mesh>

      {/* Walls */}
      <Wall position={[0, 2.5, -3]} size={[6, 5, 0.2]} />
      <Wall position={[-3.1, 2.5, 0]} size={[0.2, 5, 6.2]} />
      <Wall position={[3.1, 2.5, 0]} size={[0.2, 5, 6.2]} />

      {/* Logo */}
      <LogoOnWall />

      {/* Suspense + ErrorBoundary around models */}
      <Suspense fallback={null}>
        <ErrorBoundary FallbackComponent={ModelErrorFallback}>
          <SurgicalChair position={[0, 0.9, 0]} />
          <Nurse position={[-0.3, 1.3, -1]} />
          <Table position={[-1.6, 0, -0]} />
          {/* <Bottle position={[-1.6, 0, 5]} /> */}
        </ErrorBoundary>
      </Suspense>
    </Canvas>
  );
}
