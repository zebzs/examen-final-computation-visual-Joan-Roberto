import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Text, Stars } from '@react-three/drei';
import { useRef, useState, useEffect, useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, RepeatWrapping } from 'three';

// ------------------- Rover con jerarquía y linterna -------------------
function Rover({ onMove }) {
  const roverGroupRef = useRef();
  const spotlightRef = useRef();
  const { scene: roverScene } = useGLTF('/models/Rover.glb');
  const { scene: linternaScene } = useGLTF('/models/linterna1.glb');
  const [keyState, setKeyState] = useState({ w: false, s: false, a: false, d: false });
  const speed = 2.5;

  const roverModel = useMemo(() => roverScene.clone(), [roverScene]);
  const linternaModel = useMemo(() => linternaScene.clone(), [linternaScene]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'w') setKeyState(prev => ({ ...prev, w: true }));
      if (key === 's') setKeyState(prev => ({ ...prev, s: true }));
      if (key === 'a') setKeyState(prev => ({ ...prev, a: true }));
      if (key === 'd') setKeyState(prev => ({ ...prev, d: true }));
    };
    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'w') setKeyState(prev => ({ ...prev, w: false }));
      if (key === 's') setKeyState(prev => ({ ...prev, s: false }));
      if (key === 'a') setKeyState(prev => ({ ...prev, a: false }));
      if (key === 'd') setKeyState(prev => ({ ...prev, d: false }));
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    if (!roverGroupRef.current) return;
    let moveX = 0, moveZ = 0;
    if (keyState.w) moveZ -= speed * delta;
    if (keyState.s) moveZ += speed * delta;
    if (keyState.a) moveX -= speed * delta;
    if (keyState.d) moveX += speed * delta;

    if (moveX !== 0 || moveZ !== 0) {
      roverGroupRef.current.position.x += moveX;
      roverGroupRef.current.position.z += moveZ;
      const angle = Math.atan2(moveX, moveZ);
      roverGroupRef.current.rotation.y = angle;
    }

    if (spotlightRef.current) {
      spotlightRef.current.position.set(0, 0, 0.5);
    }
    if (onMove) onMove(roverGroupRef.current.position);
  });

  return (
    <group ref={roverGroupRef} position={[0, 0, 0]}>
      <primitive object={roverModel} scale={0.8} />

      <group position={[0, 0.4, 0.8]}>
        <primitive object={linternaModel} scale={0.25} />

        <spotLight
          ref={spotlightRef}
          intensity={3.0}
          distance={20}
          angle={0.6}
          penumbra={0.4}
          decay={1}
          color="#ffdd99"
          castShadow
          shadow-mapSize={1024}
          position={[0, 0, 0.5]}
        />

        {/* Cono visual apuntando hacia adelante */}
        <mesh position={[0, 0, 1.0]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.35, 1.5, 32]} />
          <meshStandardMaterial
            color="#ffff88"
            emissive="#ffaa44"
            emissiveIntensity={0.9}
            transparent
            opacity={0.5}
          />
        </mesh>

        {/* Halo brillante */}
        <mesh>
          <sphereGeometry args={[0.28]} />
          <meshStandardMaterial color="#ffffaa" emissive="#ffaa44" emissiveIntensity={1.5} />
        </mesh>
      </group>
    </group>
  );
}

// ------------------- Astronauta ENORME (scale=8) -------------------
function Astronauta({ position, roverPosition }) {
  const astroRef = useRef();
  const [isClose, setIsClose] = useState(false);
  const { scene } = useGLTF('/models/Astronauta.glb');
  const model = useMemo(() => scene.clone(), [scene]);

  const saltoTimer = useRef(0);
  const saltoActivo = useRef(false);

  const setMaterialColor = (obj, close) => {
    obj.traverse((child) => {
      if (child.isMesh && child.material) {
        if (close) {
          child.material.emissiveIntensity = 1.2;
          child.material.color.setHex(0xff6600);
        } else {
          child.material.emissiveIntensity = 0;
          child.material.color.setHex(0xffffff);
        }
      }
    });
  };

  useFrame(({ clock }) => {
    if (!astroRef.current || !roverPosition) return;

    const dx = astroRef.current.position.x - roverPosition.x;
    const dz = astroRef.current.position.z - roverPosition.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    const close = distance < 3.5;

    if (close !== isClose) {
      setIsClose(close);
      if (close) {
        saltoActivo.current = true;
        saltoTimer.current = 1.5;
      }
      setMaterialColor(astroRef.current, close);
    }

    if (saltoActivo.current && saltoTimer.current > 0) {
      saltoTimer.current -= 0.016;
      const t = 1 - (saltoTimer.current / 1.5);
      let yOffset;
      if (t < 0.5) {
        yOffset = (t * 2) * 1.2;
      } else {
        yOffset = (1 - t) * 2 * 1.2;
      }
      astroRef.current.position.y = position[1] + yOffset;
    } else {
      const normalY = position[1] + Math.sin(clock.getElapsedTime() * 1.2) * 0.05;
      astroRef.current.position.y = normalY;
      saltoActivo.current = false;
    }
  });

  return (
    <group ref={astroRef} position={position}>
      <primitive object={model} scale={8} />
      {isClose && (
        <Text
          position={[0, 6, 0]}
          fontSize={1.2}
          color="cyan"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="black"
        >
          🚀 ¡HOLA!
        </Text>
      )}
    </group>
  );
}

// ------------------- Escena principal: suelo infinito y cielo envolvente -------------------
function Escena() {
  const [roverPos, setRoverPos] = useState({ x: 0, z: 0 });
  const diffuseMap = useLoader(TextureLoader, '/textures/red/red_laterite_soil_stones_diff_4k.jpg');

  // Crear textura repetida para suelo infinito
  const groundTexture = useMemo(() => {
    const tex = diffuseMap.clone();
    tex.wrapS = RepeatWrapping;
    tex.wrapT = RepeatWrapping;
    tex.repeat.set(30, 30); // Repite la textura 30x30 veces en el plano de 200x200
    return tex;
  }, [diffuseMap]);

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 10, 2]} intensity={1.2} castShadow shadow-mapSize={1024} />
      <pointLight position={[-3, 2, 1]} intensity={0.5} color="#ffaa66" />

      {/* SUELO INFINITO VISUALMENTE: plano de 200x200 con textura repetida */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[200, 200, 128, 128]} />
        <meshStandardMaterial map={groundTexture} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Rocas dispersas en área grande */}
      <group>
        {[...Array(80)].map((_, i) => {
          const angle = Math.random() * Math.PI * 2;
          const radius = 10 + Math.random() * 80;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const scaleRock = 0.2 + Math.random() * 0.5;
          return (
            <mesh
              key={i}
              position={[x, -0.45 + scaleRock * 0.2, z]}
              castShadow
              receiveShadow
              scale={[scaleRock, scaleRock, scaleRock]}
            >
              <dodecahedronGeometry args={[0.5]} />
              <meshStandardMaterial color="#a86c3a" roughness={0.9} metalness={0.05} />
            </mesh>
          );
        })}
      </group>

      {/* Estrellas de fondo */}
      <Stars radius={300} depth={100} count={5000} factor={4} saturation={0} fade speed={0.5} />

      {/* Elementos interactivos */}
      <Rover onMove={(pos) => setRoverPos(pos)} />
      <Astronauta position={[1, 4, 2]} roverPosition={roverPos} />

      <OrbitControls enablePan enableZoom enableRotate makeDefault />

      {/* CIELO ENVOLVENTE: esfera de estrellas que cubre todo el horizonte, sin bordes */}
      <Environment preset="night" background={true} />
    </>
  );
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows camera={{ position: [5, 4, 6], fov: 50 }}>
        <Escena />
      </Canvas>
      <div style={{ position: 'absolute', bottom: 20, left: 20, color: 'white', background: 'rgba(0,0,0,0.6)', padding: 10, borderRadius: 8, fontFamily: 'monospace' }}>
        🎮 Controles: WASD para mover el rover | 🔍 Ratón para girar cámara
      </div>
    </div>
  );
}