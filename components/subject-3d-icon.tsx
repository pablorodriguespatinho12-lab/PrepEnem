'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Props {
  materia: string;
  color: string;
  size?: number;
}

/**
 * Mini Three.js icon for each subject. Renders a small canvas with a
 * rotating 3D shape that represents the subject visually.
 * Performance: small canvas (default 48px), low pixel ratio, single rAF loop,
 * pauses when tab is hidden, disposes on unmount.
 */
export default function Subject3DIcon({ materia, color, size = 48 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const colorHex = new THREE.Color(color);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 3);

    /* lights */
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const point = new THREE.PointLight(0xffffff, 0.8);
    point.position.set(2, 2, 3);
    scene.add(point);

    /* geometry */
    const obj = new THREE.Group();
    scene.add(obj);

    const mat = new THREE.MeshPhongMaterial({ color: colorHex, shininess: 80 });
    const matLine = new THREE.LineBasicMaterial({ color: colorHex });
    const matWhite = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 60 });

    const m = materia.toLowerCase();

    if (m.includes('matem')) {
      // wireframe cube
      const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
      const edges = new THREE.EdgesGeometry(cubeGeo);
      const wire = new THREE.LineSegments(edges, matLine);
      obj.add(wire);
      // small solid cube inside for depth
      const innerCube = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 0.45, 0.45),
        new THREE.MeshPhongMaterial({ color: colorHex, transparent: true, opacity: 0.35 })
      );
      obj.add(innerCube);
    } else if (m.includes('biol')) {
      // DNA double helix
      const strand1: THREE.Vector3[] = [];
      const strand2: THREE.Vector3[] = [];
      const points = 18;
      for (let i = 0; i < points; i++) {
        const t = (i / (points - 1)) * Math.PI * 2;
        strand1.push(new THREE.Vector3(Math.cos(t) * 0.45, (i / points) * 1.6 - 0.8, Math.sin(t) * 0.45));
        strand2.push(new THREE.Vector3(Math.cos(t + Math.PI) * 0.45, (i / points) * 1.6 - 0.8, Math.sin(t + Math.PI) * 0.45));
      }
      const curve1 = new THREE.CatmullRomCurve3(strand1);
      const curve2 = new THREE.CatmullRomCurve3(strand2);
      obj.add(new THREE.Mesh(new THREE.TubeGeometry(curve1, 32, 0.04, 6, false), mat));
      obj.add(new THREE.Mesh(new THREE.TubeGeometry(curve2, 32, 0.04, 6, false), mat));
      // rungs
      for (let i = 0; i < points; i += 3) {
        const cyl = new THREE.Mesh(
          new THREE.CylinderGeometry(0.025, 0.025, 0.9, 6),
          new THREE.MeshPhongMaterial({ color: 0xffffff })
        );
        cyl.position.copy(strand1[i].clone().add(strand2[i]).multiplyScalar(0.5));
        cyl.lookAt(strand2[i]);
        cyl.rotateX(Math.PI / 2);
        obj.add(cyl);
      }
    } else if (m.includes('física') || m.includes('fisica')) {
      // atom
      obj.add(new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), mat));
      for (let j = 0; j < 3; j++) {
        const orbit = new THREE.Mesh(
          new THREE.TorusGeometry(0.55, 0.018, 8, 48),
          matLine
        );
        orbit.rotation.set((j * Math.PI) / 3, (j * Math.PI) / 4, 0);
        const electron = new THREE.Mesh(
          new THREE.SphereGeometry(0.07, 8, 8),
          new THREE.MeshPhongMaterial({ color: colorHex, emissive: colorHex, emissiveIntensity: 0.5 })
        );
        electron.position.x = 0.55;
        orbit.add(electron);
        obj.add(orbit);
      }
    } else if (m.includes('quím') || m.includes('quim')) {
      // molecule: 3 atoms in triangle connected
      const positions = [
        new THREE.Vector3(0, 0.45, 0),
        new THREE.Vector3(-0.55, -0.35, 0),
        new THREE.Vector3(0.55, -0.35, 0),
      ];
      const atomColors = [color, '#f87171', '#60a5fa'];
      positions.forEach((p, i) => {
        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(0.22, 12, 12),
          new THREE.MeshPhongMaterial({ color: atomColors[i], shininess: 80 })
        );
        sphere.position.copy(p);
        obj.add(sphere);
      });
      // bonds
      [[0,1],[0,2],[1,2]].forEach(([a,b]) => {
        const start = positions[a];
        const end = positions[b];
        const dist = start.distanceTo(end);
        const bond = new THREE.Mesh(
          new THREE.CylinderGeometry(0.045, 0.045, dist, 6),
          new THREE.MeshPhongMaterial({ color: 0xcccccc })
        );
        bond.position.copy(start.clone().add(end).multiplyScalar(0.5));
        bond.lookAt(end);
        bond.rotateX(Math.PI / 2);
        obj.add(bond);
      });
    } else if (m.includes('hist')) {
      // scroll: horizontal cylinder with two thicker end caps
      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.32, 1.2, 16),
        new THREE.MeshPhongMaterial({ color: '#f5e8c5' })
      );
      body.rotation.z = Math.PI / 2;
      obj.add(body);
      [-0.65, 0.65].forEach(x => {
        const cap = new THREE.Mesh(
          new THREE.CylinderGeometry(0.38, 0.38, 0.15, 16),
          mat
        );
        cap.rotation.z = Math.PI / 2;
        cap.position.x = x;
        obj.add(cap);
      });
      // text lines
      for (let i = 0; i < 3; i++) {
        const line = new THREE.Mesh(
          new THREE.BoxGeometry(0.7, 0.02, 0.01),
          new THREE.MeshPhongMaterial({ color: 0x6b4423 })
        );
        line.position.set(0, (i - 1) * 0.12, 0.33);
        obj.add(line);
      }
    } else if (m.includes('geog')) {
      // globe
      const globe = new THREE.Mesh(
        new THREE.SphereGeometry(0.6, 16, 12),
        new THREE.MeshPhongMaterial({ color: colorHex, shininess: 60 })
      );
      obj.add(globe);
      // longitude/latitude lines
      const wireGlobe = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.SphereGeometry(0.61, 10, 6)),
        new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 })
      );
      obj.add(wireGlobe);
    } else if (m.includes('filos')) {
      // torus knot (philosopher's knot)
      const knot = new THREE.Mesh(
        new THREE.TorusKnotGeometry(0.4, 0.13, 64, 8),
        mat
      );
      obj.add(knot);
    } else if (m.includes('soci')) {
      // network of connected people (spheres + connecting lines)
      const nodes = [
        new THREE.Vector3(0, 0.5, 0),
        new THREE.Vector3(-0.55, -0.1, 0.2),
        new THREE.Vector3(0.55, -0.1, 0.2),
        new THREE.Vector3(0, -0.55, -0.3),
      ];
      nodes.forEach(p => {
        const node = new THREE.Mesh(
          new THREE.SphereGeometry(0.18, 10, 10),
          mat
        );
        node.position.copy(p);
        obj.add(node);
      });
      const connections = [[0,1],[0,2],[1,3],[2,3],[1,2]];
      connections.forEach(([a,b]) => {
        const start = nodes[a];
        const end = nodes[b];
        const dist = start.distanceTo(end);
        const bond = new THREE.Mesh(
          new THREE.CylinderGeometry(0.025, 0.025, dist, 6),
          new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 })
        );
        bond.position.copy(start.clone().add(end).multiplyScalar(0.5));
        bond.lookAt(end);
        bond.rotateX(Math.PI / 2);
        obj.add(bond);
      });
    } else if (m.includes('liter')) {
      // open book
      const leftPage = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.04, 0.85),
        matWhite
      );
      leftPage.position.x = -0.32;
      leftPage.rotation.z = -0.18;
      obj.add(leftPage);
      const rightPage = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.04, 0.85),
        matWhite
      );
      rightPage.position.x = 0.32;
      rightPage.rotation.z = 0.18;
      obj.add(rightPage);
      // spine
      const spine = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.12, 0.85),
        mat
      );
      obj.add(spine);
    } else {
      // default: book (Português etc)
      const cover = new THREE.Mesh(
        new THREE.BoxGeometry(0.95, 0.15, 1.2),
        mat
      );
      obj.add(cover);
      const pages = new THREE.Mesh(
        new THREE.BoxGeometry(0.88, 0.18, 1.1),
        new THREE.MeshPhongMaterial({ color: 0xf8f4ea })
      );
      pages.position.y = 0.005;
      obj.add(pages);
    }

    /* visibility pause */
    let active = true;
    const onVis = () => { active = !document.hidden; };
    document.addEventListener('visibilitychange', onVis);

    /* animate */
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!active) return;
      obj.rotation.y += 0.012;
      obj.rotation.x += 0.005;
      renderer.render(scene, camera);
    };
    tick();

    /* cleanup */
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVis);
      scene.traverse(o => {
        if (o instanceof THREE.Mesh || o instanceof THREE.LineSegments) {
          (o.geometry as THREE.BufferGeometry).dispose();
          if (Array.isArray(o.material)) o.material.forEach(mm => mm.dispose());
          else if (o.material) (o.material as THREE.Material).dispose();
        }
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [materia, color, size]);

  return <div ref={containerRef} style={{ width: size, height: size, pointerEvents: 'none' }} />;
}
