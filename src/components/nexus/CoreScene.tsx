import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Stars, Line, Html } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

const DOMAINS = [
  { label: "HR", color: "#8b5cf6", angle: 0 },
  { label: "IT", color: "#38bdf8", angle: (Math.PI * 2) / 3 },
  { label: "Finance", color: "#22d3ee", angle: (Math.PI * 4) / 3 },
];

function Core() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = t * 0.12;
      const s = 1 + Math.sin(t * 0.9) * 0.025;
      ref.current.scale.setScalar(s);
    }
  });
  return (
    <group>
      <mesh ref={ref}>
        <icosahedronGeometry args={[0.85, 12]} />
        <MeshDistortMaterial
          color="#1d3a9e"
          emissive="#3b6bff"
          emissiveIntensity={0.55}
          roughness={0.18}
          metalness={0.6}
          distort={0.32}
          speed={1.1}
        />
      </mesh>
      <mesh scale={1.55}>
        <sphereGeometry args={[1.15, 48, 48]} />
        <meshBasicMaterial color="#4c7dff" transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>
      <pointLight color="#5b8cff" intensity={14} distance={14} />
    </group>
  );
}

function OrbitRing({ radius, tilt }: { radius: number; tilt: number }) {
  const points = useMemo(() => {
    const p: [number, number, number][] = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      p.push([Math.cos(a) * radius, 0, Math.sin(a) * radius]);
    }
    return p;
  }, [radius]);
  return (
    <group rotation={[tilt, 0, tilt * 0.6]}>
      <Line points={points} color="#5b8cff" transparent opacity={0.16} lineWidth={1} />
    </group>
  );
}

function DomainNode({
  label,
  color,
  angle,
  radius,
}: {
  label: string;
  color: string;
  angle: number;
  radius: number;
}) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.16 + angle;
    if (group.current) {
      group.current.position.set(Math.cos(t) * radius, Math.sin(t * 1.4) * 0.5, Math.sin(t) * radius);
    }
  });

  const linkPoints = useMemo<[number, number, number][]>(() => [[0, 0, 0], [0, 0, 0]], []);
  const lineRef = useRef<any>(null);
  useFrame(() => {
    if (group.current && lineRef.current) {
      const p = group.current.position;
      lineRef.current.geometry.setPositions([0, 0, 0, p.x, p.y, p.z]);
    }
  });

  return (
    <>
      <Line
        ref={lineRef}
        points={linkPoints}
        color={color}
        transparent
        opacity={hovered ? 0.85 : 0.35}
        lineWidth={hovered ? 2 : 1}
      />
      <group ref={group}>
        <Float speed={1.4} floatIntensity={0.5} rotationIntensity={0.3}>
          <mesh
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            scale={hovered ? 1.25 : 1}
          >
            <octahedronGeometry args={[0.26, 0]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={hovered ? 2.6 : 1.4}
              roughness={0.2}
              metalness={0.4}
            />
          </mesh>
          <Html center distanceFactor={9} zIndexRange={[5, 0]}>
            <span className="pointer-events-none select-none font-mono text-[10px] tracking-[0.3em] text-foreground/70">
              {label.toUpperCase()}
            </span>
          </Html>
        </Float>
      </group>
    </>
  );
}

function DataParticles({ count = 900 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.2 + Math.random() * 5.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = (Math.random() - 0.5) * 4;
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.028} color="#9ec5ff" transparent opacity={0.65} sizeAttenuation />
    </points>
  );
}

function Rig() {
  const { camera, pointer } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime() * 0.08;
    const radius = 7.2;
    const desiredX = Math.sin(t) * radius + pointer.x * 0.8;
    const desiredZ = Math.cos(t) * radius;
    const desiredY = 1.2 + pointer.y * -0.6;
    camera.position.x += (desiredX - camera.position.x) * Math.min(1, delta * 1.4);
    camera.position.y += (desiredY - camera.position.y) * Math.min(1, delta * 1.4);
    camera.position.z += (desiredZ - camera.position.z) * Math.min(1, delta * 1.4);
    camera.lookAt(target);
  });
  return null;
}

export default function CoreScene() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 1.2, 7.2], fov: 46 }}
    >
      <color attach="background" args={["#080c18"]} />
      <fog attach="fog" args={["#080c18", 9, 20]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 3]} intensity={1.1} color="#9db8ff" />
      <Stars radius={60} depth={40} count={2200} factor={3} saturation={0} fade speed={0.4} />
      <Core />
      <OrbitRing radius={3.2} tilt={0.35} />
      <OrbitRing radius={4.4} tilt={-0.22} />
      {DOMAINS.map((d) => (
        <DomainNode key={d.label} {...d} radius={3.4} />
      ))}
      <DataParticles />
      <Rig />
      <EffectComposer>
        <Bloom intensity={0.8} luminanceThreshold={0.45} luminanceSmoothing={0.35} mipmapBlur />
        <Vignette eskil={false} offset={0.25} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}
