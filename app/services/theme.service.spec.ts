import { Injectable } from '@angular/core';
import { ThemeService } from '../services/theme.service'; // Ajusta la ruta si es necesario


@Injectable({
  providedIn: 'root',
})
export class themeService {
  private isDarkMode: boolean = false;

  constructor() {
    const savedTheme = localStorage.getItem('isDarkMode');
    this.isDarkMode = savedTheme ? JSON.parse(savedTheme) : false;
    this.applyTheme();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    
    localStorage.setItem('isDarkMode', JSON.stringify(this.isDarkMode));
  }

  private applyTheme() {
    document.body.classList.toggle('dark-theme', this.isDarkMode);
  }

  isDark() {
    return this.isDarkMode;
  }
}
