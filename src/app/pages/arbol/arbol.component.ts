import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ArbolService } from '../../services/arbol.service';

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
  imports: [CommonModule],
  templateUrl: './arbol.component.html',
  styleUrls: ['./arbol.component.css']
})
export class ArbolComponent implements OnInit {

  username = '';
  snowflakes: Snowflake[] = [];

  private route = inject(ActivatedRoute);
  private arbolService = inject(ArbolService);

  githubInfo: any = null;
  svgData: string | null = null;

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username') ?? '';
    this.generateSnow();

    // 🟢 Consumir Odoo
    this.generarArbolDesdeOdoo();
  }

  generarArbolDesdeOdoo() {
    const payload = {
      nickname: this.username,
      svg: null  // en futuro enviaremos el SVG generado
    };

    this.arbolService.generarArbol(payload).subscribe({
      next: (res) => {
        console.log('🔥 Respuesta Odoo:', res);

        this.githubInfo = res.github_info;
        this.svgData = res.svg_data;

        // Inyectar el SVG en el contenedor
        const container = document.getElementById('arbol-container');
        if (container && this.svgData) {
          container.innerHTML = this.svgData;
        }
      },
      error: (err) => {
        console.error('❌ Error al generar el árbol:', err);
      }
    });
  }

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

  random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}
