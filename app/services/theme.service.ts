import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor() {
    this.applyTheme();
  }

  toggleTheme() {
    const isDarkMode = this.isDark();
    localStorage.setItem('isDarkMode', JSON.stringify(!isDarkMode));
    this.applyTheme();
  }

  public getTheme(): boolean {
    return this.isDark();
  }

  private isDark(): boolean {
    return JSON.parse(localStorage.getItem('isDarkMode') || 'false');
  }

  private applyTheme() {
    const isDarkMode = this.isDark();
    document.body.classList.toggle('dark-theme', isDarkMode);
  }
}
