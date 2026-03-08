/**
 * SkillSphereCanvas — Three.js canvas for rotating skill nodes.
 * Only loaded via dynamic import when the sphere is enabled.
 */
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { Skill } from "@/lib/firestore";

const SkillNode = ({ position, name, color }: { position: [number, number, number]; name: string; color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      <Text
        position={[0, 0.2, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        {name}
      </Text>
    </group>
  );
};

const RotatingGroup = ({ skills }: { skills: Skill[] }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Distribute skills on a sphere using fibonacci
  const positions = useMemo(() => {
    const n = Math.min(skills.length, 20);
    const pts: [number, number, number][] = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2; // -1 to 1
      const radius = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      pts.push([Math.cos(theta) * radius * 1.5, y * 1.5, Math.sin(theta) * radius * 1.5]);
    }
    return pts;
  }, [skills.length]);

  const colors = ["#00e5ff", "#7c4dff", "#ff4081", "#00e5ff", "#7c4dff"];

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {skills.slice(0, 20).map((skill, i) => (
        <SkillNode
          key={i}
          position={positions[i] || [0, 0, 0]}
          name={skill.name}
          color={colors[i % colors.length]}
        />
      ))}
    </group>
  );
};

const SkillSphereCanvas = ({ skills }: { skills: Skill[] }) => (
  <div className="mx-auto h-72 w-72 sm:h-80 sm:w-80">
    <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#00e5ff" />
      <pointLight position={[-5, -5, 5]} intensity={0.5} color="#7c4dff" />
      <RotatingGroup skills={skills} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  </div>
);

export default SkillSphereCanvas;
