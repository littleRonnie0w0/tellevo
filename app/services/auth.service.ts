import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  // Método para iniciar sesión
  login(username: string, email: string) {
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);
  }

  // Método para cerrar sesión
  logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('email');
  }

  // Método para verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    return localStorage.getItem('username') !== null;
  }
}
