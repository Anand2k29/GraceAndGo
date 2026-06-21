import { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  Float,
  Html,
  PerspectiveCamera,
  MeshReflectorMaterial,
} from "@react-three/drei";
import * as THREE from "three";

export type HotspotId = "hair" | "nails" | "facial" | "product";

interface SalonSceneProps {
  scroll: number; // 0..1
  activeRoom: HotspotId | null;
  onHotspot: (id: HotspotId) => void;
}

const HOTSPOTS: {
  id: HotspotId;
  pos: [number, number, number];
  label: string;
}[] = [
  { id: "hair", pos: [-2.2, 1.6, 6.5], label: "Hair Atelier" },
  { id: "nails", pos: [2.2, 1.6, 6.5], label: "Nails Bar" },
  { id: "facial", pos: [-2.2, 1.6, 0.5], label: "Facial Suite" },
  { id: "product", pos: [2.2, 1.6, 0.5], label: "Apothecary Showcase" },
];

const ROOM_SERVICES: Record<HotspotId, { name: string; price: string }[]> = {
  hair: [
    { name: "Signature Cut", price: "₹4,500" },
    { name: "Balayage", price: "₹9,500" },
  ],
  nails: [
    { name: "Manicure", price: "₹2,200" },
    { name: "Gel Sculpture", price: "₹3,500" },
  ],
  facial: [
    { name: "Glow Facial", price: "₹6,500" },
    { name: "24K Gold", price: "₹16,500" },
  ],
  product: [
    { name: "Radiance Serum", price: "₹5,500" },
    { name: "Velours Hair Oil", price: "₹3,800" },
  ],
};

function MarbleFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={40}
        roughness={0.7}
        depthScale={1.1}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#e8e4dd"
        metalness={0.4}
        mirror={0.6}
      />
    </mesh>
  );
}

function Sconce({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Sconce base/metal bracket */}
      <mesh castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
        <meshStandardMaterial color="#b76e79" metalness={1} roughness={0.2} />
      </mesh>
      {/* Sconce glass/light bulb */}
      <mesh position={[0, 0.15, 0.05]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffd1dc"
          emissiveIntensity={2}
        />
      </mesh>
      <pointLight
        position={[0, 0.15, 0.05]}
        intensity={1.2}
        color="#ffeef0"
        distance={4}
        decay={2}
      />
    </group>
  );
}

function CeilingRingLight({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.8, 0.04, 16, 64]} />
        <meshStandardMaterial
          color="#ffeef0"
          emissive="#ffd1dc"
          emissiveIntensity={2.5}
        />
      </mesh>
      <pointLight
        position={[0, -0.2, 0]}
        intensity={2.2}
        color="#ffeef0"
        distance={8}
        decay={2}
      />
    </group>
  );
}

function Door({ left, angle }: { left: boolean; angle: number }) {
  const xPos = left ? -1.25 : 1.25;
  const pivotOffset = left ? 0.625 : -0.625;
  return (
    <group position={[xPos, 0, 9.8]} rotation={[0, angle, 0]}>
      {/* Door Frame/Wood Pane */}
      <mesh position={[pivotOffset, 1.8, 0]} castShadow>
        <boxGeometry args={[1.25, 3.6, 0.08]} />
        <meshStandardMaterial color="#f4c2c2" roughness={0.8} />
      </mesh>
      {/* Glass Panel Insert */}
      <mesh position={[pivotOffset, 2.2, 0.01]}>
        <planeGeometry args={[0.95, 2.2]} />
        <meshPhysicalMaterial
          color="#f4c2c2"
          transmission={0.85}
          opacity={0.3}
          transparent
          roughness={0.1}
        />
      </mesh>
      {/* Lower decorative panel */}
      <mesh position={[pivotOffset, 0.6, 0.05]} castShadow>
        <boxGeometry args={[0.95, 0.8, 0.02]} />
        <meshStandardMaterial color="#f4c2c2" roughness={0.8} />
      </mesh>
      <mesh position={[pivotOffset, 0.6, 0.061]}>
        <boxGeometry args={[0.8, 0.6, 0.01]} />
        <meshStandardMaterial color="#b76e79" metalness={1} roughness={0.25} />
      </mesh>
      {/* Door Handle */}
      <mesh position={[left ? 1.1 : -1.1, 1.8, 0.06]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
        <meshStandardMaterial color="#b76e79" metalness={1} roughness={0.2} />
      </mesh>
    </group>
  );
}

function CorridorArch({
  position,
  left,
  label,
  id,
  active,
  onSelect,
}: {
  position: [number, number, number];
  left: boolean;
  label: string;
  id?: HotspotId;
  active?: boolean;
  onSelect?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [autoOpen, setAutoOpen] = useState(false);
  const [showSignage, setShowSignage] = useState(false);
  const rotationY = left ? Math.PI / 2 : -Math.PI / 2;
  const doorRef = useRef<THREE.Group>(null);

  // Set mouse cursor to pointer on hover
  useEffect(() => {
    if (id) {
      document.body.style.cursor = hovered ? "pointer" : "auto";
    }
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered, id]);

  useFrame((state, dt) => {
    // 1. Calculate distance on X-Z plane from camera to this archway
    const dx = state.camera.position.x - position[0];
    const dz = state.camera.position.z - position[2];
    const distXZ = Math.sqrt(dx * dx + dz * dz);

    // Auto open door and show card if camera is within 3.3 units and inside the corridor (Z < 9.5)
    const isNear = distXZ < 3.3 && state.camera.position.z < 9.5;
    const shouldOpen = hovered || active || isNear;

    if (doorRef.current) {
      const targetAngle = shouldOpen
        ? left
          ? -Math.PI * 0.55
          : Math.PI * 0.55
        : 0;
      doorRef.current.rotation.y = THREE.MathUtils.lerp(
        doorRef.current.rotation.y,
        targetAngle,
        0.1,
      );
    }

    if (autoOpen !== shouldOpen) {
      setAutoOpen(shouldOpen);
    }

    // Hide labels if camera is still outside front doors to prevent visual leakage
    const enteredCorridor = state.camera.position.z < 9.5;
    if (showSignage !== enteredCorridor) {
      setShowSignage(enteredCorridor);
    }
  });

  const previewServices = id ? ROOM_SERVICES[id] : null;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Side Pillars */}
      <mesh position={[-1.1, 1.8, 0]} castShadow>
        <boxGeometry args={[0.15, 3.6, 0.15]} />
        <meshStandardMaterial color="#f4c2c2" roughness={0.8} />
      </mesh>
      <mesh position={[1.1, 1.8, 0]} castShadow>
        <boxGeometry args={[0.15, 3.6, 0.15]} />
        <meshStandardMaterial color="#f4c2c2" roughness={0.8} />
      </mesh>
      {/* Arch Top Lintel */}
      <mesh position={[0, 3.6, 0]} castShadow>
        <boxGeometry args={[2.35, 0.15, 0.15]} />
        <meshStandardMaterial color="#f4c2c2" roughness={0.8} />
      </mesh>
      {/* Arch Rose Gold Accent Trim */}
      <mesh position={[0, 1.8, 0.08]}>
        <boxGeometry args={[2.2, 3.6, 0.02]} />
        <meshStandardMaterial
          color="#b76e79"
          metalness={0.6}
          roughness={0.3}
          wireframe
        />
      </mesh>

      {/* Interactive Swing Door Hinge (pivot at x = -1.0, rotates into the room) */}
      <group
        ref={doorRef}
        position={[-1.0, 0, 0]}
        onPointerOver={(e) => {
          if (id) {
            e.stopPropagation();
            setHovered(true);
          }
        }}
        onPointerOut={(e) => {
          if (id) {
            e.stopPropagation();
            setHovered(false);
          }
        }}
        onClick={(e) => {
          if (id && onSelect) {
            e.stopPropagation();
            onSelect();
          }
        }}
      >
        {/* Glass door mesh offset from hinge pivot */}
        <mesh position={[1.0, 1.8, 0]}>
          <planeGeometry args={[2.0, 3.4]} />
          <meshPhysicalMaterial
            color="#f4c2c2"
            transmission={0.8}
            opacity={0.35}
            transparent
            roughness={0.15}
          />
        </mesh>
      </group>

      {/* Room signage above Arch */}
      {showSignage && (
        <Html position={[0, 3.9, 0.1]} center distanceFactor={7}>
          <div className="whitespace-nowrap px-2 py-0.5 font-[Cormorant_Garamond] text-[0.65rem] tracking-[0.3em] uppercase text-blush text-shadow-luxe">
            {label}
          </div>
        </Html>
      )}

      {/* Floating 3D Price/Service Card (shows up on door hover/active state or proximity autoOpen) */}
      {id && previewServices && (autoOpen || hovered || active) && (
        <Html
          position={[0.2, 1.8, 0.25]}
          center
          distanceFactor={6}
          zIndexRange={[20, 10]}
        >
          <div className="w-52 bg-black/90 backdrop-blur-md rounded-sm border border-blush-pink/40 p-4 shadow-luxe animate-[fade-in_0.3s_ease-out] text-left space-y-2">
            <p className="text-[0.55rem] tracking-[0.25em] text-blush uppercase font-bold">
              GraceAndGo
            </p>
            <h4 className="font-display text-sm text-foreground">{label}</h4>
            <div className="h-px bg-blush-pink/20 my-1" />
            <div className="space-y-1 pt-1">
              {previewServices.map((s) => (
                <div
                  key={s.name}
                  className="flex justify-between items-baseline text-[0.6rem] gap-2"
                >
                  <span className="text-muted-foreground truncate max-w-[120px]">
                    {s.name}
                  </span>
                  <span className="text-blush font-semibold flex-shrink-0">
                    {s.price}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onSelect) onSelect();
              }}
              className="w-full mt-3 bg-blush-gold-gradient py-2 rounded-sm text-[0.55rem] font-semibold tracking-[0.25em] text-[oklch(0.14_0.005_60)] uppercase hover:brightness-110 shadow-soft transition-all duration-300"
            >
              Book Atelier
            </button>
          </div>
        </Html>
      )}
    </group>
  );
}

function RoomChamber({
  position,
  left,
}: {
  position: [number, number, number];
  left: boolean;
}) {
  const [rx, ry, rz] = position;
  const centerOffset = left ? -1.75 : 1.75;
  const backWallX = left ? rx - 3.5 : rx + 3.5;
  const wallMat = <meshStandardMaterial color="#f4c2c2" roughness={0.8} />;
  const carpetMat = <meshStandardMaterial color="#ebdcd8" roughness={0.9} />;

  return (
    <group>
      {/* Room back wall */}
      <mesh position={[backWallX, ry + 1.8, rz]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 3.6, 3.0]} />
        {wallMat}
      </mesh>
      {/* Room side partition wall 1 (z - 1.5) */}
      <mesh
        position={[rx + centerOffset, ry + 1.8, rz - 1.5]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[3.5, 3.6, 0.1]} />
        {wallMat}
      </mesh>
      {/* Room side partition wall 2 (z + 1.5) */}
      <mesh
        position={[rx + centerOffset, ry + 1.8, rz + 1.5]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[3.5, 3.6, 0.1]} />
        {wallMat}
      </mesh>
      {/* Room Carpet floor */}
      <mesh position={[rx + centerOffset, ry + 0.015, rz]} receiveShadow>
        <boxGeometry args={[3.5, 0.01, 3.0]} />
        {carpetMat}
      </mesh>
      {/* Room ceiling */}
      <mesh position={[rx + centerOffset, ry + 3.6, rz]}>
        <boxGeometry args={[3.5, 0.1, 3.0]} />
        <meshStandardMaterial color="#0e0c0b" roughness={1} />
      </mesh>
      {/* Room local spotlight */}
      <pointLight
        position={[left ? rx - 2.0 : rx + 2.0, ry + 3.2, rz]}
        intensity={2.8}
        color="#ffeef0"
        distance={6}
        decay={2}
      />
    </group>
  );
}

function LoungeSofa({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Seat base cushion */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[2.4, 0.35, 0.9]} />
        <meshStandardMaterial color="#f4c2c2" roughness={0.9} />
      </mesh>
      {/* Backrest panel */}
      <mesh position={[0, 1.15, -0.38]} castShadow>
        <boxGeometry args={[2.4, 1.05, 0.18]} />
        <meshStandardMaterial color="#f4c2c2" roughness={0.9} />
      </mesh>
      {/* Side armrests */}
      <mesh position={[-1.25, 0.7, 0]} castShadow>
        <boxGeometry args={[0.12, 0.7, 0.9]} />
        <meshStandardMaterial color="#b76e79" metalness={1} roughness={0.25} />
      </mesh>
      <mesh position={[1.25, 0.7, 0]} castShadow>
        <boxGeometry args={[0.12, 0.7, 0.9]} />
        <meshStandardMaterial color="#b76e79" metalness={1} roughness={0.25} />
      </mesh>
    </group>
  );
}

function VelvetChair({
  position,
  rotation = 0,
  color = "#3a1a22",
}: {
  position: [number, number, number];
  rotation?: number;
  color?: string;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Base */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.45, 0.55, 0.3, 32]} />
        <meshStandardMaterial color="#b76e79" metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
        <meshStandardMaterial color="#1a1715" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Seat */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[0.9, 0.25, 0.9]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      {/* Back */}
      <mesh position={[0, 1.55, -0.4]} castShadow>
        <boxGeometry args={[0.9, 1.4, 0.18]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.5, 1.05, 0]} castShadow>
        <boxGeometry args={[0.12, 0.18, 0.7]} />
        <meshStandardMaterial color="#b76e79" metalness={1} roughness={0.25} />
      </mesh>
      <mesh position={[0.5, 1.05, 0]} castShadow>
        <boxGeometry args={[0.12, 0.18, 0.7]} />
        <meshStandardMaterial color="#b76e79" metalness={1} roughness={0.25} />
      </mesh>
    </group>
  );
}

function Vanity({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.4, 1, 0.5]} />
        <meshStandardMaterial color="#0b0a09" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Mirror */}
      <mesh position={[0, 2.2, -0.25]}>
        <ringGeometry args={[0.55, 0.7, 64]} />
        <meshStandardMaterial color="#b76e79" metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[0, 2.2, -0.26]}>
        <circleGeometry args={[0.55, 64]} />
        <meshPhysicalMaterial
          color="#101010"
          metalness={1}
          roughness={0.05}
          envMapIntensity={1.4}
        />
      </mesh>
    </group>
  );
}

function ReceptionDesk({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[3, 1.2, 1.0]} />
        <meshStandardMaterial
          color="#0f0d0c"
          roughness={0.35}
          metalness={0.3}
        />
      </mesh>
      <mesh position={[0, 1.22, 0]}>
        <boxGeometry args={[3.05, 0.05, 1.05]} />
        <meshStandardMaterial color="#b76e79" metalness={1} roughness={0.25} />
      </mesh>
    </group>
  );
}

function HoloProduct({ position }: { position: [number, number, number] }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (g.current) g.current.rotation.y += dt * 0.4;
  });
  return (
    <Float
      speed={1.4}
      rotationIntensity={0.2}
      floatIntensity={0.6}
      position={position}
    >
      <group ref={g}>
        {/* Serum bottle */}
        <mesh castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.55, 32]} />
          <meshPhysicalMaterial
            color="#f3d1c8"
            roughness={0.05}
            metalness={0}
            transmission={0.85}
            thickness={0.5}
            ior={1.4}
            attenuationColor="#f4c2c2"
            attenuationDistance={0.6}
          />
        </mesh>
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 0.18, 32]} />
          <meshStandardMaterial color="#b76e79" metalness={1} roughness={0.2} />
        </mesh>
        {/* Halo ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.32, 0]}>
          <ringGeometry args={[0.35, 0.4, 64]} />
          <meshBasicMaterial
            color="#ffd1dc"
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </Float>
  );
}

function Hotspot({
  pos,
  label,
  onClick,
}: {
  pos: [number, number, number];
  label: string;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <group position={pos}>
      <Html center distanceFactor={8} zIndexRange={[10, 0]}>
        <button
          onClick={onClick}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="group relative flex items-center gap-2"
        >
          <span className="relative flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blush-pink opacity-60" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-blush-pink ring-2 ring-[oklch(0.96_0.01_80)]/40" />
          </span>
          <span
            className={`whitespace-nowrap rounded-sm border border-blush-pink/40 bg-black/70 px-3 py-1 font-[Cormorant_Garamond] text-sm tracking-[0.2em] uppercase text-[oklch(0.96_0.01_80)] backdrop-blur transition-all ${
              hover ? "opacity-100 translate-x-0" : "opacity-80 -translate-x-1"
            }`}
          >
            {label}
          </span>
        </button>
      </Html>
    </group>
  );
}

function CameraRig({
  scroll,
  activeRoom,
}: {
  scroll: number;
  activeRoom: HotspotId | null;
}) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 1.5, 0));

  // Path: Street outside -> gliding straight through corridor -> looking at ateliers -> arriving at Lounge at end
  const waypoints = useMemo<{ p: THREE.Vector3; l: THREE.Vector3 }[]>(
    () => [
      { p: new THREE.Vector3(0, 2.0, 13.0), l: new THREE.Vector3(0, 1.9, 8.0) }, // 0: Street outside doors
      { p: new THREE.Vector3(0, 1.9, 10.5), l: new THREE.Vector3(0, 1.8, 6.0) }, // 1: Approaching doors
      { p: new THREE.Vector3(0, 1.8, 8.5), l: new THREE.Vector3(0, 1.7, 4.0) }, // 2: Passing doors
      {
        p: new THREE.Vector3(-0.4, 1.75, 6.5),
        l: new THREE.Vector3(-4.0, 1.5, 6.5),
      }, // 3: Hair arch
      {
        p: new THREE.Vector3(0.4, 1.75, 4.5),
        l: new THREE.Vector3(4.0, 1.5, 4.5),
      }, // 4: Nails arch
      {
        p: new THREE.Vector3(-0.4, 1.75, 0.5),
        l: new THREE.Vector3(-4.0, 1.5, 0.5),
      }, // 5: Facial arch
      {
        p: new THREE.Vector3(0.4, 1.75, -1.5),
        l: new THREE.Vector3(4.0, 1.5, -1.5),
      }, // 6: Apothecary arch
      {
        p: new THREE.Vector3(0, 1.7, -4.5),
        l: new THREE.Vector3(0, 1.6, -8.0),
      }, // 7: Lounge end
    ],
    [],
  );

  // Room view coordinates for interactive entry
  const roomViews = useMemo<
    Record<HotspotId, { p: THREE.Vector3; l: THREE.Vector3 }>
  >(
    () => ({
      hair: {
        p: new THREE.Vector3(-3.4, 1.6, 6.5),
        l: new THREE.Vector3(-5.2, 1.5, 6.5),
      },
      nails: {
        p: new THREE.Vector3(3.4, 1.6, 6.5),
        l: new THREE.Vector3(5.2, 1.5, 6.5),
      },
      facial: {
        p: new THREE.Vector3(-3.4, 1.6, 0.5),
        l: new THREE.Vector3(-4.8, 1.2, 0.5),
      },
      product: {
        p: new THREE.Vector3(3.4, 1.6, 0.5),
        l: new THREE.Vector3(4.8, 1.5, 0.5),
      },
    }),
    [],
  );

  useFrame((state) => {
    let pos = new THREE.Vector3();
    let look = new THREE.Vector3();

    if (activeRoom && roomViews[activeRoom]) {
      // Fly directly into the selected room chamber
      pos.copy(roomViews[activeRoom].p);
      look.copy(roomViews[activeRoom].l);
    } else {
      // Normal scroll-based camera waypoints tracking
      const t = Math.min(0.9999, Math.max(0, scroll)) * (waypoints.length - 1);
      const i = Math.floor(t);
      const f = t - i;
      const a = waypoints[i];
      const b = waypoints[Math.min(i + 1, waypoints.length - 1)];
      const ease = f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;
      pos = a.p.clone().lerp(b.p, ease);
      look = a.l.clone().lerp(b.l, ease);
    }

    // Interactive pointer look-around (parallax mouse-sway look)
    const mouseX = state.pointer.x * 0.7;
    const mouseY = state.pointer.y * 0.35;
    look.x += mouseX;
    look.y += mouseY;

    // Transition speed (slower for active room entries, faster for scroll)
    const lerpRate = activeRoom ? 0.04 : 0.07;
    camera.position.lerp(pos, lerpRate);
    target.current.lerp(look, lerpRate);
    camera.lookAt(target.current);
  });

  return null;
}

export default function SalonScene({
  scroll,
  activeRoom,
  onHotspot,
}: SalonSceneProps) {
  // Door opening logic as camera moves past street segment (scroll 0..0.25, t = 0..1.8)
  const doorOpenProgress = Math.min(1, Math.max(0, (scroll * 7) / 1.8));
  const doorEase = doorOpenProgress * doorOpenProgress; // quadratic ease
  const leftDoorAngle = -doorEase * Math.PI * 0.55;
  const rightDoorAngle = doorEase * Math.PI * 0.55;

  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <PerspectiveCamera makeDefault fov={45} position={[0, 2.0, 13.0]} />
      <CameraRig scroll={scroll} activeRoom={activeRoom} />

      <Suspense fallback={null}>
        <color attach="background" args={["#0e0c0b"]} />
        <fog attach="fog" args={["#0e0c0b", 10, 24]} />

        <ambientLight intensity={0.45} color="#ffeef0" />
        <directionalLight
          position={[5, 10, 5]}
          intensity={0.5}
          color="#ffeef0"
          castShadow
        />
        {/* Front-facing facade light to illuminate the pink storefront and doors */}
        <directionalLight
          position={[0, 5, 15]}
          intensity={1.8}
          color="#ffeef0"
          castShadow
        />

        <MarbleFloor />

        {/* --- FRONT ENTRANCE FACADE (scroll = 0 viewport) --- */}
        {/* Left white marble wall */}
        <mesh position={[-6.25, 2.0, 9.8]} castShadow receiveShadow>
          <boxGeometry args={[10, 4.0, 0.2]} />
          <meshStandardMaterial
            color="#fcfaf8"
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>
        {/* Right white marble wall */}
        <mesh position={[6.25, 2.0, 9.8]} castShadow receiveShadow>
          <boxGeometry args={[10, 4.0, 0.2]} />
          <meshStandardMaterial
            color="#fcfaf8"
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>
        {/* Archway headers above doors */}
        <mesh position={[0, 4.0, 9.8]} castShadow receiveShadow>
          <boxGeometry args={[2.7, 0.8, 0.3]} />
          <meshStandardMaterial color="#f4c2c2" roughness={0.8} />
        </mesh>
        {/* 3D Storefront Branding */}
        <Html position={[0, 4.0, 9.96]} center distanceFactor={6}>
          <div className="text-center select-none pointer-events-none whitespace-nowrap">
            <h2 className="font-display text-[0.62rem] tracking-[0.35em] uppercase text-blush text-shadow-luxe">
              GraceAndGo
            </h2>
            <p className="font-[Cormorant_Garamond] text-[0.4rem] tracking-[0.2em] uppercase text-muted-foreground text-shadow-luxe">
              Salon
            </p>
          </div>
        </Html>
        <mesh position={[0, 4.45, 9.85]} castShadow>
          <boxGeometry args={[2.2, 0.04, 0.04]} />
          <meshStandardMaterial
            color="#b76e79"
            metalness={1}
            roughness={0.25}
          />
        </mesh>
        {/* Entrance lighting sconces on facade walls */}
        <Sconce position={[-2.2, 2.2, 10.0]} />
        <Sconce position={[2.2, 2.2, 10.0]} />

        {/* 3D Double Doors hinge groups */}
        <Door left={true} angle={leftDoorAngle} />
        <Door left={false} angle={rightDoorAngle} />

        {/* --- THE GRAND PASSAGE CORRIDOR --- */}
        {/* Left Side corridor panels */}
        <mesh position={[-2.55, 2.0, 1.0]} receiveShadow>
          <boxGeometry args={[0.1, 4.0, 18.0]} />
          <meshStandardMaterial color="#0e0c0b" roughness={0.9} />
        </mesh>
        {/* Right Side corridor panels */}
        <mesh position={[2.55, 2.0, 1.0]} receiveShadow>
          <boxGeometry args={[0.1, 4.0, 18.0]} />
          <meshStandardMaterial color="#0e0c0b" roughness={0.9} />
        </mesh>
        {/* Ceiling */}
        <mesh position={[0, 4.0, 1.0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[5.2, 18.0]} />
          <meshStandardMaterial color="#0e0c0b" roughness={1} />
        </mesh>

        {/* Corridor Arches (Left/Right) leading to rooms */}
        <CorridorArch
          position={[-2.5, 0, 6.5]}
          left={true}
          label="Hair Atelier"
          id="hair"
          active={activeRoom === "hair"}
          onSelect={() => onHotspot("hair")}
        />
        <CorridorArch
          position={[2.5, 0, 6.5]}
          left={false}
          label="Nails Bar"
          id="nails"
          active={activeRoom === "nails"}
          onSelect={() => onHotspot("nails")}
        />

        <CorridorArch
          position={[-2.5, 0, 0.5]}
          left={true}
          label="Facial Suite"
          id="facial"
          active={activeRoom === "facial"}
          onSelect={() => onHotspot("facial")}
        />
        <CorridorArch
          position={[2.5, 0, 0.5]}
          left={false}
          label="Apothecary Showcase"
          id="product"
          active={activeRoom === "product"}
          onSelect={() => onHotspot("product")}
        />

        <CorridorArch
          position={[-2.5, 0, -5.5]}
          left={true}
          label="Treatment Room"
        />
        <CorridorArch
          position={[2.5, 0, -5.5]}
          left={false}
          label="VIP Cabin"
        />

        {/* Circular LED lighting rings suspended along the corridor */}
        <CeilingRingLight position={[0, 3.8, 7.5]} />
        <CeilingRingLight position={[0, 3.8, 3.5]} />
        <CeilingRingLight position={[0, 3.8, -0.5]} />
        <CeilingRingLight position={[0, 3.8, -4.5]} />

        {/* Enclosed Room Chambers behind each archway */}
        <RoomChamber position={[-2.5, 0, 6.5]} left={true} />
        <RoomChamber position={[2.5, 0, 6.5]} left={false} />
        <RoomChamber position={[-2.5, 0, 0.5]} left={true} />
        <RoomChamber position={[2.5, 0, 0.5]} left={false} />

        {/* --- ATELIER PREVIEW ROOM DETAILS --- */}
        {/* Hair Atelier Room Details (Left side Arch 1) */}
        <Vanity position={[-5.0, 0, 6.5]} rotation={Math.PI / 2} />
        <VelvetChair
          position={[-3.8, 0, 6.5]}
          rotation={Math.PI / 2}
          color="#3a1722"
        />

        {/* Nails Bar Room Details (Right side Arch 1) */}
        <mesh position={[5.2, 0.45, 6.5]} castShadow>
          <boxGeometry args={[0.7, 0.9, 1.8]} />
          <meshStandardMaterial
            color="#0f0d0c"
            roughness={0.35}
            metalness={0.3}
          />
        </mesh>
        <mesh position={[5.2, 0.92, 6.5]}>
          <boxGeometry args={[0.75, 0.04, 1.85]} />
          <meshStandardMaterial
            color="#b76e79"
            metalness={1}
            roughness={0.25}
          />
        </mesh>
        <VelvetChair
          position={[4.0, 0, 6.5]}
          rotation={-Math.PI / 2}
          color="#f4c2c2"
        />

        {/* Facial Suite Room Details (Left side Arch 2) */}
        <mesh position={[-4.8, 0.5, 0.5]} castShadow>
          <boxGeometry args={[1.0, 0.5, 2.2]} />
          <meshStandardMaterial color="#1a0f12" roughness={0.9} />
        </mesh>
        <mesh position={[-4.8, 0.85, 0.5]} castShadow>
          <boxGeometry args={[1.0, 0.2, 2.2]} />
          <meshStandardMaterial color="#f4c2c2" roughness={0.9} />
        </mesh>
        <mesh position={[-4.8, 0.97, 0.2]} castShadow>
          <boxGeometry args={[0.7, 0.05, 0.2]} />
          <meshStandardMaterial color="#f3d1c8" roughness={0.5} />
        </mesh>

        {/* Apothecary Showcase Room Details (Right side Arch 2) */}
        <ReceptionDesk position={[4.8, 0, 0.5]} rotation={-Math.PI / 2} />
        <HoloProduct position={[4.8, 1.8, 0.5]} />

        {/* --- LOUNGE AREA (Corridor end, z = -7.5) --- */}
        <LoungeSofa position={[0, 0, -7.5]} rotation={0} />
        <LoungeSofa position={[-6.0, 0, -5.5]} rotation={Math.PI / 2} />

        {/* Interactive Hotspots (Only visible when user scrolled past entrance facade) */}
        {scroll > 0.2 &&
          HOTSPOTS.map((h) => (
            <Hotspot
              key={h.id}
              pos={h.pos}
              label={h.label}
              onClick={() => onHotspot(h.id)}
            />
          ))}

        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.5}
          blur={2.0}
          far={10}
        />
        <Environment preset="apartment" />
      </Suspense>
    </Canvas>
  );
}

export function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? h.scrollTop / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return p;
}
