"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function BoombapHeroScene() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 120);
    camera.position.set(0, 0.5, 13);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    const startTime = performance.now();
    const pointer = new THREE.Vector2(0, 0);
    const targetPointer = new THREE.Vector2(0, 0);
    const burst = { value: 0 };

    const root = new THREE.Group();
    const record = new THREE.Group();
    const equalizer = new THREE.Group();
    scene.add(root);
    root.add(record, equalizer);

    scene.add(new THREE.AmbientLight(0xffffff, 0.38));

    const keyLight = new THREE.PointLight(0xa0ef46, 24, 35);
    keyLight.position.set(-5, 5, 7);
    scene.add(keyLight);

    const violetLight = new THREE.PointLight(0x7246c1, 28, 34);
    violetLight.position.set(5, -4, 8);
    scene.add(violetLight);

    const vinylMaterial = new THREE.MeshStandardMaterial({
      color: 0x060606,
      roughness: 0.46,
      metalness: 0.55,
      emissive: 0x050505,
    });
    const grooveMaterial = new THREE.MeshStandardMaterial({
      color: 0x161616,
      roughness: 0.3,
      metalness: 0.75,
      emissive: 0x080808,
    });
    const greenMaterial = new THREE.MeshStandardMaterial({
      color: 0xa0ef46,
      roughness: 0.24,
      metalness: 0.22,
      emissive: 0x375b13,
      emissiveIntensity: 0.65,
    });
    const violetMaterial = new THREE.MeshStandardMaterial({
      color: 0x7246c1,
      roughness: 0.28,
      metalness: 0.35,
      emissive: 0x26114f,
      emissiveIntensity: 0.72,
    });
    const darkAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0x101010,
      roughness: 0.36,
      metalness: 0.42,
      emissive: 0x050505,
    });

    const platter = new THREE.Mesh(
      new THREE.CylinderGeometry(4.25, 4.25, 0.22, 128),
      vinylMaterial,
    );
    platter.rotation.x = Math.PI / 2;
    record.add(platter);

    const label = new THREE.Mesh(
      new THREE.CylinderGeometry(1.05, 1.05, 0.26, 96),
      greenMaterial,
    );
    label.rotation.x = Math.PI / 2;
    label.position.z = 0.04;
    record.add(label);

    const spindle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 0.6, 32),
      greenMaterial,
    );
    spindle.rotation.x = Math.PI / 2;
    spindle.position.z = 0.22;
    record.add(spindle);

    for (let i = 0; i < 16; i += 1) {
      const radius = 1.32 + i * 0.17;
      const groove = new THREE.Mesh(
        new THREE.TorusGeometry(radius, i % 3 === 0 ? 0.014 : 0.008, 10, 128),
        i % 4 === 0 ? violetMaterial : grooveMaterial,
      );
      groove.position.z = 0.18 + i * 0.003;
      record.add(groove);
    }

    for (let i = 0; i < 22; i += 1) {
      const angle = (i / 22) * Math.PI * 2;
      const radius = 5.15 + (i % 2) * 0.34;
      const height = 0.9 + Math.sin(i * 0.82) * 0.35;
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(0.13, height, 0.22),
        i % 3 === 0 ? greenMaterial : violetMaterial,
      );
      bar.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, -0.2);
      bar.rotation.z = angle;
      equalizer.add(bar);
    }

    const slashGroup = new THREE.Group();
    for (let i = 0; i < 7; i += 1) {
      const slash = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 1.9 + i * 0.1, 0.08),
        i % 2 === 0 ? greenMaterial : darkAccentMaterial,
      );
      slash.position.set(-3.2 + i * 0.58, 0.2 - i * 0.04, 0.42);
      slash.rotation.z = -0.78;
      slashGroup.add(slash);
    }
    record.add(slashGroup);

    const particleCount = 420;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      const radius = 5 + Math.random() * 10;
      const angle = Math.random() * Math.PI * 2;
      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = Math.sin(angle) * radius * 0.7;
      particlePositions[i * 3 + 2] = -7 + Math.random() * 8;
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3),
    );
    const particles = new THREE.Points(
      particlesGeometry,
      new THREE.PointsMaterial({
        color: 0xa0ef46,
        size: 0.035,
        transparent: true,
        opacity: 0.68,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    scene.add(particles);

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      root.scale.setScalar(width < 720 ? 0.62 : 1);
      root.position.set(width < 720 ? 1.25 : 2.55, width < 720 ? -0.45 : 0, 0);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      targetPointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      targetPointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const onPointerDown = () => {
      burst.value = 1;
    };

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId = 0;

    const animate = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      pointer.lerp(targetPointer, 0.055);
      burst.value *= 0.92;

      record.rotation.z = elapsed * (media.matches ? 0.08 : 0.52);
      record.rotation.x = -0.72 + pointer.y * 0.14;
      record.rotation.y = pointer.x * 0.2;
      equalizer.rotation.z = -elapsed * 0.18;
      particles.rotation.z = elapsed * 0.018;
      particles.rotation.y = pointer.x * 0.04;

      equalizer.children.forEach((child, index) => {
        const bar = child as THREE.Mesh;
        const pulse = Math.sin(elapsed * 3.2 + index * 0.62) * 0.5 + 0.5;
        bar.scale.y = 0.62 + pulse * 1.2 + burst.value * 1.4;
        bar.scale.x = 1 + burst.value * 0.75;
      });

      label.scale.setScalar(1 + Math.sin(elapsed * 2.4) * 0.025 + burst.value * 0.11);
      root.rotation.z = pointer.x * -0.045;
      root.rotation.x = pointer.y * 0.05;
      keyLight.intensity = 20 + Math.sin(elapsed * 2) * 5 + burst.value * 26;
      violetLight.intensity = 24 + Math.cos(elapsed * 2.6) * 6 + burst.value * 22;

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    resize();
    animate();

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerdown", onPointerDown);

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerdown", onPointerDown);
      host.removeChild(renderer.domElement);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) {
            material.forEach((item) => item.dispose());
          } else {
            material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="boombap-hero-scene absolute inset-0 z-[1] bg-black"
      aria-hidden="true"
    />
  );
}
