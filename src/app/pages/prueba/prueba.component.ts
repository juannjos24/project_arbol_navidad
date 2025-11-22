// prueba.component.ts

import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as THREE from 'three';

@Component({
  standalone: true,
  selector: 'app-prueba',
  imports: [CommonModule],
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.css'],
})
export class PruebaComponent implements AfterViewInit, OnDestroy {

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private animationId: any;

  private snowParticles!: THREE.Points;
  private treeGroup = new THREE.Group();

  ngAfterViewInit(): void {
    this.initScene();
    this.animate();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener("resize", this.onWindowResize.bind(this));
  }

  // ============================================
  // INIT SCENE
  // ============================================
  initScene() {
    const canvas = document.getElementById("tree-canvas") as HTMLCanvasElement;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(devicePixelRatio);

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 4, 12);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambient);

    const pointLight = new THREE.PointLight(0xfff4d1, 1.2);
    pointLight.position.set(0, 5, 4);
    this.scene.add(pointLight);

    // Add the Christmas Tree
    this.createTree();

    // Add Snow
    this.createSnow();

    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  // ============================================
  // CREATE TREE
  // ============================================
  createTree() {
    const greenMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f7a34,
      roughness: 0.7
    });

    // Tree Layers (3 cones)
    const cone1 = new THREE.Mesh(
      new THREE.ConeGeometry(2, 3, 32),
      greenMaterial
    );
    cone1.position.y = 1.5;

    const cone2 = new THREE.Mesh(
      new THREE.ConeGeometry(2.5, 3, 32),
      greenMaterial
    );
    cone2.position.y = 3.5;

    const cone3 = new THREE.Mesh(
      new THREE.ConeGeometry(3, 3, 32),
      greenMaterial
    );
    cone3.position.y = 5.5;

    // Trunk
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.6, 1.5, 16),
      new THREE.MeshStandardMaterial({ color: 0x7a4f1a })
    );
    trunk.position.y = 0.5;

    // Star (top)
    const starGeometry = new THREE.OctahedronGeometry(0.6);
    const starMaterial = new THREE.MeshStandardMaterial({
      color: 0xffdd55,
      emissive: 0xffcc33,
      emissiveIntensity: 1
    });
    const star = new THREE.Mesh(starGeometry, starMaterial);
    star.position.y = 7.2;

    // Add ornaments (small spheres)
    for (let i = 0; i < 30; i++) {
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.17, 16, 16),
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(
            Math.random(),
            Math.random(),
            Math.random()
          ),
          emissive: 0x220000,
          emissiveIntensity: 0.4
        })
      );
      const radius = 1 + Math.random() * 2;
      const height = 1.5 + Math.random() * 4;

      const angle = Math.random() * Math.PI * 2;

      sphere.position.set(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      );

      this.treeGroup.add(sphere);
    }

    this.treeGroup.add(cone1, cone2, cone3, trunk, star);
    this.scene.add(this.treeGroup);
  }

  // ============================================
  // CREATE SNOW PARTICLES
  // ============================================
  createSnow() {
    const snowCount = 500;

    const positions = new Float32Array(snowCount * 3);

    for (let i = 0; i < snowCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = Math.random() * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.12
    });

    this.snowParticles = new THREE.Points(geometry, material);

    this.scene.add(this.snowParticles);
  }

  // ============================================
  // ANIMATION LOOP
  // ============================================
  animate = () => {
    this.animationId = requestAnimationFrame(this.animate);

    // Rotate camera slowly
    const t = performance.now() * 0.0002;
    this.camera.position.x = Math.cos(t) * 12;
    this.camera.position.z = Math.sin(t) * 12;
    this.camera.lookAt(0, 3, 0);

    // Snow animation
    const positions = this.snowParticles.geometry.attributes['position'];
    for (let i = 0; i < positions.count; i++) {
      positions.array[i * 3 + 1] -= 0.03;
      if (positions.array[i * 3 + 1] < -2) {
        positions.array[i * 3 + 1] = 20;
      }
    }
    positions.needsUpdate = true;

    this.renderer.render(this.scene, this.camera);
  };

  // ============================================
  // RESIZE HANDLER
  // ============================================
  onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }
}
