'use client';
import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';

interface Results3DSceneProps {
  percentage: number; // 0-100
  width?: number;
  height?: number;
}

export default function Results3DScene({ percentage, width = 400, height = 400 }: Results3DSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  // Determine tier: gold >=80, silver >=60, bronze <60
  const tier = useMemo(() => {
    if (percentage >= 80) return 'gold';
    if (percentage >= 60) return 'silver';
    return 'bronze';
  }, [percentage]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 7);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Colors by tier
    const tierColors = {
      gold:   { primary: 0xffd700, secondary: 0xffaa00, ribbon: 0xdc2626, glow: 0xffd700, podium: 0x2563eb, confetti: [0xffd700, 0xff6b6b, 0x22c55e, 0x60a5fa, 0xf472b6, 0xfbbf24] },
      silver: { primary: 0xc0c0c0, secondary: 0x909090, ribbon: 0x3b82f6, glow: 0xc0c0c0, podium: 0x6366f1, confetti: [0xc0c0c0, 0x60a5fa, 0x22c55e, 0xfbbf24, 0xa78bfa] },
      bronze: { primary: 0xcd7f32, secondary: 0x8b5e3c, ribbon: 0x16a34a, glow: 0xcd7f32, podium: 0x7c3aed, confetti: [0xcd7f32, 0xf59e0b, 0x22c55e, 0x60a5fa] },
    };
    const colors = tierColors[tier];

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(3, 8, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 512;
    dirLight.shadow.mapSize.height = 512;
    scene.add(dirLight);

    const spotLight = new THREE.SpotLight(colors.glow, 1.5, 15, Math.PI / 4, 0.5);
    spotLight.position.set(0, 6, 3);
    spotLight.target.position.set(0, 1.5, 0);
    scene.add(spotLight);
    scene.add(spotLight.target);

    const rimLight = new THREE.PointLight(0x8b5cf6, 0.8, 10);
    rimLight.position.set(-3, 3, -2);
    scene.add(rimLight);

    // ============= PODIUM =============
    const podiumGroup = new THREE.Group();

    // Base cylinder
    const baseGeo = new THREE.CylinderGeometry(1.8, 2.0, 0.3, 32);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, metalness: 0.6, roughness: 0.3 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.15;
    base.receiveShadow = true;
    podiumGroup.add(base);

    // Main podium column
    const colGeo = new THREE.CylinderGeometry(1.2, 1.4, 1.2, 32);
    const colMat = new THREE.MeshStandardMaterial({ color: colors.podium, metalness: 0.7, roughness: 0.2 });
    const column = new THREE.Mesh(colGeo, colMat);
    column.position.y = 0.9;
    column.castShadow = true;
    podiumGroup.add(column);

    // Top disc
    const topGeo = new THREE.CylinderGeometry(1.3, 1.2, 0.15, 32);
    const topMat = new THREE.MeshStandardMaterial({ color: colors.podium, metalness: 0.8, roughness: 0.15, emissive: colors.podium, emissiveIntensity: 0.1 });
    const topDisc = new THREE.Mesh(topGeo, topMat);
    topDisc.position.y = 1.575;
    podiumGroup.add(topDisc);

    // Podium ring detail
    const ringGeo = new THREE.TorusGeometry(1.25, 0.04, 8, 48);
    const ringMat = new THREE.MeshStandardMaterial({ color: colors.primary, metalness: 0.9, roughness: 0.1, emissive: colors.primary, emissiveIntensity: 0.3 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 1.55;
    podiumGroup.add(ring);

    scene.add(podiumGroup);

    // ============= MEDAL =============
    const medalGroup = new THREE.Group();

    // Medal disc
    const medalGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.08, 48);
    const medalMat = new THREE.MeshStandardMaterial({
      color: colors.primary,
      metalness: 0.95,
      roughness: 0.05,
      emissive: colors.primary,
      emissiveIntensity: 0.15,
    });
    const medal = new THREE.Mesh(medalGeo, medalMat);
    medal.rotation.x = Math.PI / 2;
    medal.castShadow = true;
    medalGroup.add(medal);

    // Medal outer ring
    const medalRingGeo = new THREE.TorusGeometry(0.65, 0.06, 16, 48);
    const medalRingMat = new THREE.MeshStandardMaterial({ color: colors.secondary, metalness: 0.9, roughness: 0.1 });
    const medalRing = new THREE.Mesh(medalRingGeo, medalRingMat);
    medalGroup.add(medalRing);

    // Star on medal
    const starShape = new THREE.Shape();
    const starPoints = 5;
    const outerR = 0.35, innerR = 0.15;
    for (let i = 0; i < starPoints * 2; i++) {
      const angle = (i * Math.PI) / starPoints - Math.PI / 2;
      const r = i % 2 === 0 ? outerR : innerR;
      if (i === 0) starShape.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
      else starShape.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
    }
    starShape.closePath();
    const starGeo = new THREE.ExtrudeGeometry(starShape, { depth: 0.05, bevelEnabled: false });
    const starMat = new THREE.MeshStandardMaterial({ color: colors.secondary, metalness: 0.85, roughness: 0.15 });
    const star = new THREE.Mesh(starGeo, starMat);
    star.position.z = 0.03;
    medalGroup.add(star);

    // Ribbon (two strips hanging from medal)
    const ribbonMat = new THREE.MeshStandardMaterial({ color: colors.ribbon, roughness: 0.6, metalness: 0.1, side: THREE.DoubleSide });
    for (let side = -1; side <= 1; side += 2) {
      const ribbonShape = new THREE.Shape();
      const rw = 0.12;
      ribbonShape.moveTo(-rw, 0);
      ribbonShape.lineTo(-rw, 1.0);
      ribbonShape.quadraticCurveTo(-rw * 0.5, 1.05, 0, 1.0);
      ribbonShape.lineTo(rw, 1.0);
      ribbonShape.lineTo(rw, 0);
      ribbonShape.closePath();
      const ribbonGeo = new THREE.ShapeGeometry(ribbonShape);
      const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
      ribbonMesh.position.set(side * 0.25, 0.5, -0.02);
      ribbonMesh.rotation.z = side * 0.15;
      medalGroup.add(ribbonMesh);
    }

    medalGroup.position.set(0, 3.0, 0);
    scene.add(medalGroup);

    // ============= 3D CONFETTI PARTICLES =============
    const confettiCount = 80;
    const confettiGroup = new THREE.Group();
    const confettiPieces: { mesh: THREE.Mesh; vel: THREE.Vector3; rotVel: THREE.Vector3; }[] = [];

    for (let i = 0; i < confettiCount; i++) {
      const geoType = Math.random();
      let geo: THREE.BufferGeometry;
      if (geoType < 0.4) {
        geo = new THREE.PlaneGeometry(0.12 + Math.random() * 0.1, 0.06 + Math.random() * 0.06);
      } else if (geoType < 0.7) {
        geo = new THREE.BoxGeometry(0.06, 0.06, 0.06);
      } else {
        geo = new THREE.CircleGeometry(0.04 + Math.random() * 0.03, 6);
      }
      const color = colors.confetti[Math.floor(Math.random() * colors.confetti.length)];
      const mat = new THREE.MeshStandardMaterial({ color, metalness: 0.3, roughness: 0.5, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(geo, mat);

      const angle = Math.random() * Math.PI * 2;
      const dist = 0.5 + Math.random() * 1.5;
      mesh.position.set(
        Math.cos(angle) * dist,
        5 + Math.random() * 4,
        Math.sin(angle) * dist - 0.5
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

      confettiGroup.add(mesh);
      confettiPieces.push({
        mesh,
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          -(0.01 + Math.random() * 0.02),
          (Math.random() - 0.5) * 0.02
        ),
        rotVel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.08,
          (Math.random() - 0.5) * 0.08,
          (Math.random() - 0.5) * 0.08
        ),
      });
    }
    scene.add(confettiGroup);

    // ============= PERCENTAGE TEXT (3D ring gauge) =============
    // Ring gauge behind medal showing percentage
    const gaugeRadius = 1.0;
    const gaugeTube = 0.08;
    const gaugeAngle = (percentage / 100) * Math.PI * 2;
    const gaugeBgGeo = new THREE.TorusGeometry(gaugeRadius, gaugeTube, 8, 64);
    const gaugeBgMat = new THREE.MeshStandardMaterial({ color: 0x333333, transparent: true, opacity: 0.3 });
    const gaugeBg = new THREE.Mesh(gaugeBgGeo, gaugeBgMat);
    gaugeBg.position.set(0, 3.0, -0.3);
    scene.add(gaugeBg);

    const gaugeFillGeo = new THREE.TorusGeometry(gaugeRadius, gaugeTube + 0.02, 8, 64, gaugeAngle);
    const gaugeColor = percentage >= 80 ? 0x22c55e : percentage >= 60 ? 0x3b82f6 : 0xf59e0b;
    const gaugeFillMat = new THREE.MeshStandardMaterial({ color: gaugeColor, emissive: gaugeColor, emissiveIntensity: 0.5, metalness: 0.5, roughness: 0.3 });
    const gaugeFill = new THREE.Mesh(gaugeFillGeo, gaugeFillMat);
    gaugeFill.position.set(0, 3.0, -0.25);
    gaugeFill.rotation.z = Math.PI / 2; // start from top
    scene.add(gaugeFill);

    // ============= GLOWING PARTICLES AROUND MEDAL =============
    const sparkCount = 30;
    const sparkGeo = new THREE.SphereGeometry(0.03, 8, 8);
    const sparkMat = new THREE.MeshStandardMaterial({ color: colors.primary, emissive: colors.primary, emissiveIntensity: 1.0 });
    const sparks: THREE.Mesh[] = [];
    for (let i = 0; i < sparkCount; i++) {
      const spark = new THREE.Mesh(sparkGeo, sparkMat);
      const a = (i / sparkCount) * Math.PI * 2;
      const r = 1.2 + Math.random() * 0.5;
      spark.position.set(Math.cos(a) * r, 3.0 + (Math.random() - 0.5) * 1.5, Math.sin(a) * r * 0.5);
      scene.add(spark);
      sparks.push(spark);
    }

    // ============= ANIMATION =============
    let time = 0;
    let animId: number;
    const medalStartY = 6;
    const medalEndY = 3.0;
    const dropDuration = 1.5; // seconds for medal drop

    function animate() {
      animId = requestAnimationFrame(animate);
      time += 0.016; // ~60fps

      // Medal drop + bounce
      if (time < dropDuration) {
        const t = time / dropDuration;
        // Ease out bounce
        const bounce = 1 - Math.pow(1 - t, 3);
        medalGroup.position.y = medalStartY + (medalEndY - medalStartY) * bounce;
      } else {
        // Gentle float
        const floatT = time - dropDuration;
        medalGroup.position.y = medalEndY + Math.sin(floatT * 1.5) * 0.08;
      }

      // Medal slow rotation
      medalGroup.rotation.y = Math.sin(time * 0.5) * 0.3;

      // Podium gentle pulse
      const podiumScale = 1 + Math.sin(time * 2) * 0.01;
      podiumGroup.scale.set(podiumScale, podiumScale, podiumScale);

      // Confetti fall
      for (const piece of confettiPieces) {
        piece.mesh.position.add(piece.vel);
        piece.mesh.rotation.x += piece.rotVel.x;
        piece.mesh.rotation.y += piece.rotVel.y;
        piece.mesh.rotation.z += piece.rotVel.z;
        // Sway
        piece.mesh.position.x += Math.sin(time * 3 + piece.mesh.position.y) * 0.002;
        // Reset when below floor
        if (piece.mesh.position.y < -1) {
          piece.mesh.position.y = 5 + Math.random() * 3;
          piece.mesh.position.x = (Math.random() - 0.5) * 4;
          piece.mesh.position.z = (Math.random() - 0.5) * 3;
        }
      }

      // Sparks orbit
      for (let i = 0; i < sparks.length; i++) {
        const a = (i / sparkCount) * Math.PI * 2 + time * 0.8;
        const r = 1.2 + Math.sin(time * 2 + i) * 0.2;
        sparks[i].position.x = Math.cos(a) * r;
        sparks[i].position.z = Math.sin(a) * r * 0.5;
        sparks[i].position.y = medalGroup.position.y + Math.sin(time * 3 + i * 0.5) * 0.4;
        const sc = 0.5 + Math.sin(time * 4 + i) * 0.5;
        sparks[i].scale.setScalar(sc);
      }

      // Spotlight follows medal
      spotLight.target.position.y = medalGroup.position.y;

      // Gauge fill animate in
      if (time < 2) {
        const gaugeT = Math.min(time / 2, 1);
        const animAngle = gaugeAngle * gaugeT;
        gaugeFill.geometry.dispose();
        gaugeFill.geometry = new THREE.TorusGeometry(gaugeRadius, gaugeTube + 0.02, 8, 64, Math.max(animAngle, 0.01));
      }

      renderer.render(scene, camera);
    }

    animate();

    // Visibility handling
    const handleVisibility = () => {
      if (document.hidden) { cancelAnimationFrame(animId); }
      else { animate(); }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animId);
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
      });
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [percentage, tier, width, height]);

  return <div ref={mountRef} className="mx-auto" style={{ width, height }} />;
}
