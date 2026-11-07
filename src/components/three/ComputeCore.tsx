"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo, useRef } from "react";

type ComputeCoreProps = {
  progressRef: React.MutableRefObject<number>;
  cursorRef: React.MutableRefObject<{ x: number; y: number }>;
  detail: boolean;
  reducedMotion: boolean;
  lowPower: boolean;
};

const vertices = [
  [-1, 1.618, 0], [1, 1.618, 0], [-1, -1.618, 0], [1, -1.618, 0],
  [0, -1, 1.618], [0, 1, 1.618], [0, -1, -1.618], [0, 1, -1.618],
  [1.618, 0, -1], [1.618, 0, 1], [-1.618, 0, -1], [-1.618, 0, 1]
].map(([x, y, z]) => new THREE.Vector3(x, y, z).normalize());

const edges = vertices.flatMap((vertex, index) => vertices.slice(index + 1).map((other, otherIndex) => ({
  a: index,
  b: index + otherIndex + 1,
  distance: vertex.distanceTo(other)
}))).filter((edge) => edge.distance < 1.1);

function CoreGeometry({ progressRef, cursorRef, detail, reducedMotion, lowPower }: ComputeCoreProps) {
  const group = useRef<THREE.Group>(null);
  const lattice = useRef<THREE.Group>(null);
  const nodes = useRef<THREE.InstancedMesh>(null);
  const pulseRefs = useRef<THREE.Mesh[]>([]);
  const target = useMemo(() => new THREE.Object3D(), []);
  const vertexData = useMemo(() => vertices.map((vertex) => vertex.clone().multiplyScalar(1.38)), []);
  const edgeGeometry = useMemo(() => {
    const positions = new Float32Array(edges.length * 6);
    edges.forEach((edge, index) => {
      const start = vertexData[edge.a];
      const end = vertexData[edge.b];
      positions.set([start.x, start.y, start.z, end.x, end.y, end.z], index * 6);
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [vertexData]);

  useFrame(({ clock }) => {
    if (document.visibilityState === "hidden") return;
    const progress = progressRef.current;
    const time = clock.getElapsedTime();
    const cursor = cursorRef.current;
    const about = Math.min(1, Math.max(0, (progress - .18) / .2));
    const projects = Math.min(1, Math.max(0, (progress - .42) / .25));
    const contact = Math.min(1, Math.max(0, (progress - .78) / .22));
    const ease = detail ? 1 : about - projects + contact;
    const cluster = detail ? 0 : projects * (1 - contact);
    const desiredPosition = new THREE.Vector3(
      detail ? 3.2 : -1.45 * about + 2.2 * contact,
      detail ? 1.2 : .15 + projects * .25,
      detail ? -.6 : 0
    );
    const desiredScale = detail ? .55 : 1 - about * .3 + contact * .35;
    if (group.current) {
      group.current.position.lerp(desiredPosition, .045);
      group.current.scale.lerp(new THREE.Vector3(desiredScale, desiredScale, desiredScale), .045);
      group.current.rotation.y += (reducedMotion ? .0002 : .0025) * (detail ? .7 : 1);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, reducedMotion ? .08 : cursor.y * .18 + ease * .15, .035);
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, reducedMotion ? 0 : -cursor.x * .12, .035);
    }
    if (lattice.current) {
      lattice.current.position.x = THREE.MathUtils.lerp(lattice.current.position.x, cluster * 1.5, .04);
      lattice.current.rotation.y += reducedMotion ? 0 : .0012;
    }
    if (nodes.current) {
      vertexData.forEach((vertex, index) => {
        const spread = 1 + cluster * ((index % 2 ? 1 : -1) * .35);
        target.position.set(vertex.x * spread, vertex.y * spread, vertex.z * spread);
        target.updateMatrix();
        nodes.current!.setMatrixAt(index, target.matrix);
      });
      nodes.current.instanceMatrix.needsUpdate = true;
    }
    const pulseSpeed = reducedMotion ? 0 : 0.12 + contact * .22;
    pulseRefs.current.forEach((pulse, index) => {
      const edge = edges[index % edges.length];
      const amount = (time * pulseSpeed + index / 3) % 1;
      pulse.position.lerpVectors(vertexData[edge.a], vertexData[edge.b], amount);
      pulse.visible = !reducedMotion;
    });
  });

  return <group ref={group}>
    <mesh>
      <sphereGeometry args={[1.08, 16, 16]} />
      <meshBasicMaterial color="#C6FF3D" transparent opacity={.075} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1.82, .008, 6, 96]} />
      <meshBasicMaterial color="#3DDCFF" transparent opacity={.23} />
    </mesh>
    <mesh rotation={[Math.PI / 3, .4, 0]}>
      <torusGeometry args={[1.62, .006, 6, 96]} />
      <meshBasicMaterial color="#C6FF3D" transparent opacity={.18} />
    </mesh>
    <mesh rotation={[.4, Math.PI / 3, .8]}>
      <torusGeometry args={[1.45, .005, 6, 96]} />
      <meshBasicMaterial color="#3DDCFF" transparent opacity={.14} />
    </mesh>
    <group ref={lattice}>
      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial color="#C6FF3D" transparent opacity={.22} />
      </lineSegments>
      <instancedMesh ref={nodes} args={[undefined, undefined, vertexData.length]}>
        <sphereGeometry args={[lowPower ? .045 : .055, 6, 6]} />
        <meshBasicMaterial color="#3DDCFF" transparent opacity={.72} />
      </instancedMesh>
      {!reducedMotion && [0, 1, 2].map((index) => <mesh key={index} ref={(mesh) => { if (mesh) pulseRefs.current[index] = mesh; }}>
        <sphereGeometry args={[.028, 5, 5]} />
        <meshBasicMaterial color="#C6FF3D" transparent opacity={.9} blending={THREE.AdditiveBlending} />
      </mesh>)}
    </group>
  </group>;
}

export default CoreGeometry;
