/* eslint-disable react/no-unknown-property */
import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

const QUALITY_PRESETS = {
  high: {
    points: 180,
    spread: 7,
    coreDetail: 4,
    ring1Radial: 18,
    ring1Tubular: 112,
    ring2Radial: 16,
    ring2Tubular: 96,
    dpr: [1, 1.6],
    antialias: true,
    frameDivisor: 1,
  },
  balanced: {
    points: 120,
    spread: 6.6,
    coreDetail: 3,
    ring1Radial: 14,
    ring1Tubular: 88,
    ring2Radial: 12,
    ring2Tubular: 72,
    dpr: [1, 1.35],
    antialias: false,
    frameDivisor: 2,
  },
  low: {
    points: 80,
    spread: 6,
    coreDetail: 2,
    ring1Radial: 10,
    ring1Tubular: 64,
    ring2Radial: 8,
    ring2Tubular: 52,
    dpr: [1, 1.15],
    antialias: false,
    frameDivisor: 3,
  },
}

function HeroNebula({ quality }) {
  const pointsRef = useRef(null)
  const frameCounter = useRef(0)
  const { points: pointCount, spread, frameDivisor } = quality

  const points = useMemo(() => {
    const count = pointCount
    const vertices = new Float32Array(count * 3)

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3
      vertices[i3] = (Math.random() - 0.5) * spread
      vertices[i3 + 1] = (Math.random() - 0.5) * spread
      vertices[i3 + 2] = (Math.random() - 0.5) * spread
    }

    return vertices
  }, [pointCount, spread])

  useFrame((state, delta) => {
    if (!pointsRef.current) {
      return
    }

    frameCounter.current += 1
    if (frameCounter.current % frameDivisor !== 0) {
      return
    }

    pointsRef.current.rotation.y += delta * 0.05
    pointsRef.current.rotation.x += delta * 0.015
    pointsRef.current.material.opacity = 0.52 + Math.sin(state.clock.elapsedTime * 0.7) * 0.08
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={points.length / 3} array={points} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#9fdfff" size={0.03} transparent opacity={0.56} depthWrite={false} />
    </points>
  )
}

function HeroCoreMesh({ quality }) {
  const coreRef = useRef(null)
  const ringARef = useRef(null)
  const ringBRef = useRef(null)
  const frameCounter = useRef(0)
  const { coreDetail, ring1Radial, ring1Tubular, ring2Radial, ring2Tubular, frameDivisor } = quality

  useFrame((state, delta) => {
    frameCounter.current += 1
    if (frameCounter.current % frameDivisor !== 0) {
      return
    }

    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.42
      coreRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.35) * 0.18
    }

    if (ringARef.current) {
      ringARef.current.rotation.z += delta * 0.58
      ringARef.current.rotation.y += delta * 0.12
    }

    if (ringBRef.current) {
      ringBRef.current.rotation.z -= delta * 0.46
      ringBRef.current.rotation.x += delta * 0.1
    }
  })

  return (
    <group>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.95, coreDetail]} />
        <meshStandardMaterial
          color="#8f7eff"
          metalness={0.62}
          roughness={0.24}
          emissive="#241a58"
          emissiveIntensity={0.95}
        />
      </mesh>

      <mesh ref={ringARef} rotation={[Math.PI / 2.8, 0, 0]}>
        <torusGeometry args={[1.55, 0.042, ring1Radial, ring1Tubular]} />
        <meshStandardMaterial color="#3dd8ff" emissive="#3dd8ff" emissiveIntensity={1.05} metalness={0.45} roughness={0.2} />
      </mesh>

      <mesh ref={ringBRef} rotation={[0.45, 0, Math.PI / 3]}>
        <torusGeometry args={[1.9, 0.03, ring2Radial, ring2Tubular]} />
        <meshStandardMaterial color="#ffffff" emissive="#9d8eff" emissiveIntensity={0.72} metalness={0.32} roughness={0.18} />
      </mesh>
    </group>
  )
}

export default function WebglHeroScene({ quality = 'balanced' }) {
  const preset = QUALITY_PRESETS[quality] || QUALITY_PRESETS.balanced

  return (
    <div className="hero-webgl" aria-hidden="true">
      <Canvas
        dpr={preset.dpr}
        camera={{ position: [0, 0, 4.6], fov: 46 }}
        gl={{ antialias: preset.antialias, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.58} />
        <directionalLight position={[2.4, 2.2, 2.8]} intensity={1.18} color="#a6c9ff" />
        <pointLight position={[-2.4, -1.8, 1.8]} intensity={0.9} color="#32d6ff" />
        <pointLight position={[1.6, 2.3, -1.2]} intensity={0.64} color="#8f7eff" />
        <HeroNebula quality={preset} />
        <HeroCoreMesh quality={preset} />
      </Canvas>
    </div>
  )
}
