import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ArbolComponent } from './pages/arbol/arbol.component';
import { PruebaComponent } from './pages/prueba/prueba.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'arbol/:username', component: ArbolComponent },
  { path: 'prueba', component: PruebaComponent }
];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};
