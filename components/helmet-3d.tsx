"use client"

import * as React from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { ContactShadows, OrbitControls } from "@react-three/drei"
import * as THREE from "three"

/**
 * Procedural HaloRide helmet built from primitives — no GLB download.
 * Front of the helmet faces +z; the camera orbits, the model stays still
 * so the contact shadow can render once.
 */

const SHELL_COLOR = "#262a31"
const TRIM_COLOR = "#17191d"
const GLOW_CYAN = "#22d3ee"
const HUD_CYAN = "#a5f3fc"

function Shell() {
  return (
    // Non-uniform scale gives the dome an aero, front-back elongated profile
    <group scale={[1, 0.95, 1.18]}>
      {/* Main dome */}
      <mesh>
        <sphereGeometry args={[1, 64, 48, 0, Math.PI * 2, 0, 1.95]} />
        <meshPhysicalMaterial
          color={SHELL_COLOR}
          metalness={0.55}
          roughness={0.32}
          clearcoat={1}
          clearcoatRoughness={0.22}
        />
      </mesh>

      {/* Center light strip running front-to-back over the crown */}
      <mesh rotation={[0, -Math.PI / 2, 0]}>
        <torusGeometry args={[1.004, 0.018, 16, 96, Math.PI]} />
        <meshStandardMaterial
          color={GLOW_CYAN}
          emissive={GLOW_CYAN}
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>

      {/* Top vents */}
      {[-0.3, 0.3].map((x) => (
        <mesh key={x} position={[x, 0.94, 0.1]} rotation={[0, 0, x * 0.45]}>
          <boxGeometry args={[0.09, 0.06, 0.42]} />
          <meshStandardMaterial color="#0b0c0e" roughness={0.9} />
        </mesh>
      ))}

      {/* Bottom rim */}
      <mesh position={[0, -0.36, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.925, 0.05, 24, 96]} />
        <meshStandardMaterial color={TRIM_COLOR} metalness={0.1} roughness={0.7} />
      </mesh>

      {/* Rear LED safety strip */}
      <mesh position={[0, -0.08, -1.0]}>
        <boxGeometry args={[0.34, 0.045, 0.03]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#ef4444"
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

function Visor() {
  // Front slice of a sphere, sitting just proud of the shell
  const phiWidth = 1.7
  return (
    <group scale={[1, 0.95, 1.18]}>
      <mesh>
        <sphereGeometry
          args={[
            1.015,
            64,
            32,
            Math.PI / 2 - phiWidth / 2,
            phiWidth,
            1.05,
            0.95,
          ]}
        />
        <meshPhysicalMaterial
          color="#164e63"
          metalness={0}
          roughness={0.08}
          transmission={0.7}
          thickness={0.4}
          ior={1.5}
          side={THREE.DoubleSide}
          emissive={GLOW_CYAN}
          emissiveIntensity={0.06}
        />
      </mesh>
    </group>
  )
}

function HudOverlay() {
  // Faint AR readout floating inside the visor glass
  const speedBar = React.useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (speedBar.current) {
      const material = speedBar.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.75 + Math.sin(clock.elapsedTime * 1.6) * 0.2
    }
  })
  return (
    <group position={[0, -0.02, 0.88]}>
      <mesh ref={speedBar} position={[0.16, 0.06, 0]}>
        <planeGeometry args={[0.26, 0.045]} />
        <meshBasicMaterial color={HUD_CYAN} transparent toneMapped={false} />
      </mesh>
      {/* Navigation chevron */}
      <mesh position={[-0.2, 0.05, 0]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[0.12, 0.035]} />
        <meshBasicMaterial
          color={HUD_CYAN}
          transparent
          opacity={0.85}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[-0.14, 0.11, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <planeGeometry args={[0.12, 0.035]} />
        <meshBasicMaterial
          color={HUD_CYAN}
          transparent
          opacity={0.85}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, -0.08, 0]}>
        <planeGeometry args={[0.4, 0.012]} />
        <meshBasicMaterial
          color={HUD_CYAN}
          transparent
          opacity={0.4}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

export default function Helmet3D({ autoRotate }: { autoRotate: boolean }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [2.1, 0.8, 2.9], fov: 32 }}
      aria-label="Interactive 3D model of the HaloRide AR smart helmet"
      role="img"
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 4]} intensity={1.7} />
      <directionalLight position={[-5, 2, -4]} intensity={0.8} color="#7dd3fc" />
      <group position={[0, 0.1, 0]}>
        <Shell />
        <Visor />
        <HudOverlay />
      </group>
      <ContactShadows
        position={[0, -0.75, 0]}
        opacity={0.45}
        scale={5}
        blur={2.4}
        far={1.8}
        frames={1}
      />
      <OrbitControls
        autoRotate={autoRotate}
        autoRotateSpeed={1.5}
        enableZoom={false}
        enablePan={false}
        enableDamping
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.7}
      />
    </Canvas>
  )
}
