import React, { useRef, useState, useEffect } from 'react';
import { useGLTF, Text, Circle } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group, Shape, ShapeGeometry, DoubleSide } from 'three';
import { useTransition, animated } from '@react-spring/three';

// El componente ahora recibe ambas props
function SpeechBubble({ isSoundEnabled, hasInteracted }: { isSoundEnabled: boolean; hasInteracted: boolean }) {
  const [visible, setVisible] = useState(false);
  const audioRef = useRef(new Audio('https://www.myinstants.com/media/sounds/quack_5.mp3'));

  useEffect(() => {
    let appearanceTimeout: NodeJS.Timeout;
    let disappearanceTimeout: NodeJS.Timeout;

    const getRandomTime = (minSec: number, maxSec: number) => (Math.random() * (maxSec - minSec) + minSec) * 1000;

    const scheduleAppearance = () => {
      const delay = getRandomTime(3, 30);
      appearanceTimeout = setTimeout(() => {
        setVisible(true);
        // Solo reproducir si el sonido está habilitado Y el usuario ha interactuado
        if (isSoundEnabled && hasInteracted) {
          audioRef.current.play();
        }

        const duration = getRandomTime(1, 5);
        disappearanceTimeout = setTimeout(() => {
          setVisible(false);
          scheduleAppearance();
        }, duration);
      }, delay);
    };

    scheduleAppearance();

    return () => {
      clearTimeout(appearanceTimeout);
      clearTimeout(disappearanceTimeout);
    };
  // Añadimos hasInteracted a las dependencias
  }, [isSoundEnabled, hasInteracted]);

  const transitions = useTransition(visible, {
    from: { scale: 0 },
    enter: { scale: 1 },
    leave: { scale: 0 },
    config: { mass: 1, tension: 170, friction: 26 },
  });

  const tailShape = new Shape();
  const tailWidth = 0.4;
  const tailHeight = 0.5;
  tailShape.moveTo(0, 0);
  tailShape.lineTo(tailWidth / 2, -tailHeight);
  tailShape.lineTo(-tailWidth / 2, -tailHeight);
  tailShape.closePath();
  const tailGeometry = new ShapeGeometry(tailShape);

  return transitions(
    (styles, item) =>
      item && (
        <animated.group position={[0, 1.2, -1]} scale={styles.scale}>
          <Circle args={[1, 64]} scale={[1.4, 0.8, 1]}>
            <meshStandardMaterial color="white" side={DoubleSide} />
          </Circle>
          <mesh geometry={tailGeometry} position={[0.4, -0.6, 0]} rotation={[0, 0, -0.5]}>
            <meshStandardMaterial color="white" side={DoubleSide} />
          </mesh>
          <Text
            position={[0, 0, 0.01]}
            fontSize={0.4}
            color="black"
            anchorX="center"
            anchorY="middle"
          >
            Cuack!
          </Text>
        </animated.group>
      )
  );
}

// El componente principal del Pato ahora acepta ambas props
export function Duck(props: any) {
  const { scene } = useGLTF('/Duck.gltf');
  const groupRef = useRef<Group>(null!);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const elapsedTime = clock.getElapsedTime();
      groupRef.current.rotation.y = Math.cos(elapsedTime * 0.2) * 0.5;
      groupRef.current.position.y = Math.sin(elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef} {...props}>
      <primitive
        object={scene}
        rotation={[Math.PI, Math.PI * 1.2, Math.PI]}
        position={[0, -1.2, -1]}
      />
      {/* Pasamos ambas props al componente hijo */}
      <SpeechBubble isSoundEnabled={props.isSoundEnabled} hasInteracted={props.hasInteracted} />
    </group>
  );
}

useGLTF.preload('/Duck.gltf');
