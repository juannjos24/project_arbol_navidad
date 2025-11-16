import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ArbolService } from '../../services/arbol.service';
import { HttpClientModule } from '@angular/common/http';

interface Snowflake {
  size: number;
  left: number;
  duration: number;
  rotation: number;
  delay: number;
}

@Component({
  standalone: true,
  selector: 'app-arbol',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './arbol.component.html',
  styleUrls: ['./arbol.component.css']
})
export class ArbolComponent implements OnInit {

  username = '';
  githubInfo: any = null;
  svgData: string | null = null;
  totalCommits = 0;

  snowflakes: Snowflake[] = [];

  private route = inject(ActivatedRoute);
  private arbolService = inject(ArbolService);

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username') ?? '';
    this.generateSnow();
    this.generarArbolDesdeOdoo();
  }

  generarArbolDesdeOdoo() {
    const payload = {
      nickname: this.username,
      svg: null
    };

    this.arbolService.generarArbol(payload).subscribe({
      next: (res) => {
        console.log("🔥 Respuesta Odoo:", res);

        this.githubInfo = res.github_info;
        this.totalCommits = res.github_total_commits;

        const svg = this.crearArbolSVG();

        const container = document.getElementById('arbol-container');
        if (container) {
          container.innerHTML = svg;
        }
      },
      error: (err) => {
        console.error("❌ Error al generar el árbol:", err);
      }
    });
  }

  // ============================================================
  // 🎄 DIBUJAR EL ÁRBOL CON ESFERAS SEGÚN COMMITS
  // ============================================================
  crearArbolSVG(): string {
    const name = this.githubInfo?.name ?? this.username;

    const repos = this.githubInfo?.public_repos ?? 0;
    const followers = this.githubInfo?.followers ?? 0;
    const commits = this.totalCommits ?? 0;

    // Máximo para no saturar
    const bolasCount = Math.min(commits, 20);

    const bolas = [];
    for (let i = 0; i < bolasCount; i++) {
      const { x, y } = this.randomPositionOnTree();
      const radius = this.random(6, 12);

      bolas.push(`
        <circle
          cx="${x}"
          cy="${y}"
          r="${radius}"
          fill="#${this.randomColor()}CC"
          stroke="white"
          stroke-width="1.5"
        />
      `);
    }

    return `
    <svg width="320" height="440" viewBox="0 0 320 440" xmlns="http://www.w3.org/2000/svg">

        <!-- Estrella -->
        <polygon points="160,20 170,50 200,50 175,70 185,100 160,80 135,100 145,70 120,50 150,50"
          fill="#FFD700" stroke="#fff" stroke-width="2"/>

        <!-- Árbol (3 capas) -->
        <polygon points="160,80 60,200 260,200" fill="#0f5132"/>
        <polygon points="160,130 80,260 240,260" fill="#145a32"/>
        <polygon points="160,180 100,310 220,310" fill="#196f3d"/>

        <!-- 🔴 ESFERAS DINÁMICAS -->
        ${bolas.join('')}

        <!-- Tronco -->
        <rect x="145" y="310" width="30" height="60" fill="#8d6e63"/>

        <!-- Nombre -->
        <text x="160" y="390" text-anchor="middle"
          fill="white" font-size="22" font-family="Arial" font-weight="bold">
          ${name}
        </text>

        <!-- Stats -->
        <text x="160" y="415" text-anchor="middle"
          fill="#ccc" font-size="14" font-family="Arial">
          commits: ${commits} | repos: ${repos} | followers: ${followers}
        </text>

    </svg>
    `;
  }

  // ============================================================
  // 📍 POSICIONES ALEATORIAS DENTRO DEL ÁRBOL
  // ============================================================
  randomPositionOnTree(): { x: number; y: number } {
    const sections = [
      { minY: 90, maxY: 180, minX: 90, maxX: 230 },
      { minY: 150, maxY: 240, minX: 110, maxX: 210 },
      { minY: 210, maxY: 300, minX: 120, maxX: 200 },
    ];

    const s = sections[Math.floor(Math.random() * sections.length)];

    return {
      x: this.random(s.minX, s.maxX),
      y: this.random(s.minY, s.maxY)
    };
  }

  // Colores navideños
  randomColor(): string {
    const colors = [
      "FF3B3B", // rojo
      "FFD93D", // amarillo
      "00C2FF", // azul
      "FF6F91", // rosa
      "9D4EDD"  // morado
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Número aleatorio
  random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  // ============================================================
  // ❄ COPOS
  // ============================================================
  generateSnow() {
    for (let i = 0; i < 80; i++) {
      this.snowflakes.push({
        size: this.random(5, 15),
        left: this.random(0, 100),
        duration: this.random(4, 12),
        rotation: this.random(-180, 180),
        delay: this.random(0, 5),
      });
    }
  }

}
