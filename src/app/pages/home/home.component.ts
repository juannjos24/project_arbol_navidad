import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

interface Snowflake {
  size: number;
  left: number;
  duration: number;
  rotation: number;
  delay: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  snowflakes: Snowflake[] = [];
  username: string = '';

  githubNames = ['torvalds', 'gaearon', 'yyx990803', 'sindresorhus', 'fabpot'];
  animatedPlaceholder = '';

  private placeholderIndex = 0;
  private charIndex = 0;
  private typingSpeed = 120;
  private deletingSpeed = 50;
  private waitingTime = 1100;

  constructor(private router: Router) {}

  ngOnInit() {
    this.generateSnow();
    this.typeWriterEffect();
  }

  crearArbol() {
    if (!this.username.trim()) return;
    this.router.navigate(['/arbol', this.username]);
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

  typeWriterEffect() {
    const current = this.githubNames[this.placeholderIndex];

    if (this.charIndex < current.length) {
      this.animatedPlaceholder += current[this.charIndex];
      this.charIndex++;
      setTimeout(() => this.typeWriterEffect(), this.typingSpeed);
    } else {
      setTimeout(() => this.deleteEffect(), this.waitingTime);
    }
  }

  deleteEffect() {
    if (this.charIndex > 0) {
      this.animatedPlaceholder = this.animatedPlaceholder.slice(0, this.charIndex - 1);
      this.charIndex--;
      setTimeout(() => this.deleteEffect(), this.deletingSpeed);
    } else {
      this.placeholderIndex = (this.placeholderIndex + 1) % this.githubNames.length;
      setTimeout(() => this.typeWriterEffect(), 300);
    }
  }
}
