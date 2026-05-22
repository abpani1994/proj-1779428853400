// Hero3D — floating bento card stack (Bento Showcase mood)
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox, ContactShadows } from "@react-three/drei";
import { useRef } from "react";

const BRAND = "#f97316";
const ACCENT = "#14b8a6";

function FloatingCard({ position, rotation = [0, 0, 0], color = "#ffffff", size = [2.4, 1.6, 0.16] }) {
  const ref = useRef();
  useFrame((s) => {
    if (ref.current) ref.current.rotation.z = rotation[2] + Math.sin(s.clock.elapsedTime * 0.3) * 0.02;
  });
  return (
    <Float speed={1.0} rotationIntensity={0.15} floatIntensity={0.6}>
      <RoundedBox ref={ref} args={size} radius={0.18} smoothness={6} position={position} rotation={rotation}>
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.05} />
      </RoundedBox>
    </Float>
  );
}

export default function Hero3D() {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      shadows
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 4]} intensity={1.4} castShadow />
      <directionalLight position={[-3, 2, 2]} intensity={0.4} color={BRAND} />
      <FloatingCard position={[0, 0, 0]} color="#ffffff" />
      <FloatingCard position={[-1.5, 0.6, -0.6]} rotation={[0, 0, 0.12]} color={BRAND} size={[1.6, 1, 0.12]} />
      <FloatingCard position={[1.6, -0.5, -0.4]} rotation={[0, 0, -0.08]} color={ACCENT} size={[1.4, 1.6, 0.12]} />
      <FloatingCard position={[2.0, 0.9, -1.2]} rotation={[0, 0, 0.18]} color="#1d1d1f" size={[1, 1, 0.12]} />
      <ContactShadows position={[0, -1.6, 0]} opacity={0.3} scale={10} blur={2.5} />
    </Canvas>
  );
}