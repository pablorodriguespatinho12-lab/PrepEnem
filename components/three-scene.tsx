'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const isMobile = window.innerWidth < 768;

    /* ── renderer ── */
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isMobile;
    container.appendChild(renderer.domElement);

    /* ── scene & camera ── */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60, container.clientWidth / container.clientHeight, 0.1, 100
    );
    camera.position.set(0, 0, 8);

    /* ── lighting ── */
    scene.add(new THREE.AmbientLight(0x404040, 0.6));
    const purpleLight = new THREE.PointLight(0x7c3aed, 1.5, 25);
    purpleLight.position.set(3, 2, 4);
    scene.add(purpleLight);
    const goldLight = new THREE.PointLight(0xfbbf24, 0.8, 20);
    goldLight.position.set(-4, -1, 3);
    scene.add(goldLight);

    /* ── helpers ── */
    const spread = () => (Math.random() - 0.5);
    const objects: THREE.Object3D[] = [];
    const pushObj = (obj: THREE.Object3D, rangeX = 12, rangeY = 7, rangeZ = 5) => {
      obj.position.set(spread() * rangeX, spread() * rangeY, spread() * rangeZ - 3);
      obj.userData.offset = Math.random() * Math.PI * 2;
      obj.userData.speed = 0.3 + Math.random() * 0.35;
      obj.userData.baseY = obj.position.y;
      scene.add(obj);
      objects.push(obj);
    };

    /* ── books ── */
    const bookColors = [0x7c3aed, 0x2563eb, 0xdc2626, 0x059669, 0xf59e0b];
    const bookCount = isMobile ? 2 : 4;
    for (let i = 0; i < bookCount; i++) {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.12, 0.85),
        new THREE.MeshPhongMaterial({ color: 0xf5f0e0 })
      ));
      g.add(new THREE.Mesh(
        new THREE.BoxGeometry(1.3, 0.18, 0.9),
        new THREE.MeshPhongMaterial({ color: bookColors[i % bookColors.length], shininess: 50 })
      ));
      g.rotation.set(spread() * 0.5, spread() * 0.5, spread() * 0.3);
      pushObj(g);
    }

    /* ── atoms ── */
    const atomCount = isMobile ? 1 : 3;
    for (let i = 0; i < atomCount; i++) {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 12, 12),
        new THREE.MeshPhongMaterial({ color: 0x7c3aed, emissive: 0x4c1d95, emissiveIntensity: 0.3 })
      ));
      for (let j = 0; j < 3; j++) {
        const orbit = new THREE.Mesh(
          new THREE.TorusGeometry(0.45 + j * 0.14, 0.008, 8, 48),
          new THREE.MeshPhongMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.55 })
        );
        orbit.rotation.set((j * Math.PI) / 3, (j * Math.PI) / 4, 0);
        const electron = new THREE.Mesh(
          new THREE.SphereGeometry(0.04, 8, 8),
          new THREE.MeshPhongMaterial({ color: 0x60a5fa, emissive: 0x3b82f6, emissiveIntensity: 0.5 })
        );
        electron.position.x = 0.45 + j * 0.14;
        orbit.add(electron);
        g.add(orbit);
      }
      pushObj(g);
    }

    /* ── pencils ── */
    const pencilCount = isMobile ? 1 : 3;
    for (let i = 0; i < pencilCount; i++) {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 1.4, 6),
        new THREE.MeshPhongMaterial({ color: 0xfbbf24 })
      ));
      const tip = new THREE.Mesh(
        new THREE.ConeGeometry(0.045, 0.22, 6),
        new THREE.MeshPhongMaterial({ color: 0x1f2937 })
      );
      tip.position.y = -0.81;
      g.add(tip);
      const eraser = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.1, 6),
        new THREE.MeshPhongMaterial({ color: 0xf472b6 })
      );
      eraser.position.y = 0.75;
      g.add(eraser);
      g.rotation.z = spread() * Math.PI;
      pushObj(g);
    }

    /* ── formula particles ── */
    const pCount = isMobile ? 60 : 120;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = spread() * 18;
      pPos[i * 3 + 1] = spread() * 12;
      pPos[i * 3 + 2] = spread() * 10 - 4;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x7c3aed, size: 0.04, transparent: true, opacity: 0.45,
    });
    const pts = new THREE.Points(pGeo, pMat);
    scene.add(pts);

    /* ── mouse parallax ── */
    const mouse = { x: 0, y: 0 };
    const onMouse = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse);

    /* ── visibility pause ── */
    let active = true;
    const onVis = () => { active = !document.hidden; };
    document.addEventListener('visibilitychange', onVis);

    /* ── animation loop ── */
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!active) return;

      const t = performance.now() * 0.001;

      camera.position.x += (mouse.x * 1.5 - camera.position.x) * 0.04;
      camera.position.y += (-mouse.y * 0.8 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      objects.forEach(o => {
        o.position.y = o.userData.baseY + Math.sin(t * o.userData.speed + o.userData.offset) * 0.4;
        o.rotation.x += 0.003;
        o.rotation.y += 0.005;
      });

      purpleLight.position.x = Math.cos(t * 0.5) * 5;
      purpleLight.position.z = Math.sin(t * 0.5) * 5 + 2;

      pts.rotation.y += 0.0002;

      renderer.render(scene, camera);
    };
    tick();

    /* ── resize ── */
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    /* ── cleanup ── */
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
      scene.traverse(o => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          if (Array.isArray(o.material)) o.material.forEach(m => m.dispose());
          else if (o.material) (o.material as THREE.Material).dispose();
        }
      });
      pGeo.dispose();
      pMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
