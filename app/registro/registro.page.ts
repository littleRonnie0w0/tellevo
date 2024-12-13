import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../services/theme.service'; 
import { AlertController } from '@ionic/angular'; // Importamos AlertController

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  nombre = "";
  apellido = "";
  email = "";
  numeroContacto = "";
  tieneAuto: string = "";
  patente = "";
  password = "";
  passwordConfirm = "";
  passwordType = 'password';
  passwordIcon = 'eye-off-outline';
  passwordTypeConfirm = 'password'; 
  passwordIconConfirm = 'eye-off-outline'; 
  isDarkMode = false; 

  constructor(
    private router: Router, 
    private themeService: ThemeService,
    private alertController: AlertController // Añadimos AlertController
  ) {}

  ngOnInit() {
    this.isDarkMode = this.themeService.getTheme(); 
  }

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordType === 'text' ? 'eye-outline' : 'eye-off-outline';
  }

  togglePasswordConfirmVisibility() {
    this.passwordTypeConfirm = this.passwordTypeConfirm === 'password' ? 'text' : 'password';
    this.passwordIconConfirm = this.passwordTypeConfirm === 'text' ? 'eye-outline' : 'eye-off-outline';
  }

  toggleTheme() {
    this.themeService.toggleTheme(); 
    this.isDarkMode = this.themeService.getTheme(); 
  }
  
  onAutoChange(event: CustomEvent) {
    this.tieneAuto = event.detail.value;
  }

  // Función para mostrar alertas
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Validaciones de campos
  isValidName(name: string): boolean {
    return /^[A-Za-z]{2,}$/.test(name); // Debe contener al menos dos letras
  }

  isValidPhoneNumber(phoneNumber: string): boolean {
    return /^[0-9]+$/.test(phoneNumber); // Solo números
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Valida que el correo tenga un @ y un dominio
  }

  isValidPassword(password: string): boolean {
    return /[0-9]/.test(password); // Debe contener al menos un número
  }

  // Función de registro con validaciones
  async registrarse() {
    // Validación de campos vacíos
    if (!this.nombre || !this.apellido || !this.email || !this.numeroContacto || !this.password || !this.passwordConfirm) {
      await this.showAlert('Campos incompletos', 'Por favor, completa todos los campos obligatorios.');
      return;
    }

    // Validación de nombre
    if (!this.isValidName(this.nombre)) {
      await this.showAlert('Nombre inválido', 'El nombre debe tener al menos dos letras.');
      return;
    }

    // Validación de apellido
    if (!this.isValidName(this.apellido)) {
      await this.showAlert('Apellido inválido', 'El apellido debe tener al menos dos letras.');
      return;
    }

    // Validación de correo electrónico
    if (!this.isValidEmail(this.email)) {
      await this.showAlert('Correo inválido', 'El correo electrónico debe tener un formato válido.');
      return;
    }

    // Validación de número de teléfono
    if (!this.isValidPhoneNumber(this.numeroContacto)) {
      await this.showAlert('Número de Teléfono inválido', 'El número de teléfono solo puede contener números.');
      return;
    }

    // Validación si tiene auto está vacío
    if (!this.tieneAuto) {
      await this.showAlert('Campo requerido', 'Por favor, responde si tienes auto.');
      return;
    }

    // Validación de la patente si selecciona "Sí" en "¿Tiene Auto?"
    if (this.tieneAuto === 'si' && !this.patente) {
      await this.showAlert('Patente requerida', 'Por favor, ingresa la patente del auto.');
      return;
    }

    // Validación de contraseña (al menos un número)
    if (!this.isValidPassword(this.password)) {
      await this.showAlert('Contraseña inválida', 'La contraseña debe contener al menos un número.');
      return;
    }

    // Validación de contraseñas coincidentes
    if (this.password !== this.passwordConfirm) {
      await this.showAlert('Error de Contraseña', 'Las contraseñas no coinciden.');
      return;
    }

    const usuario = {
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      numeroContacto: this.numeroContacto,
      tieneAuto: this.tieneAuto,
      patente: this.tieneAuto === 'si' ? this.patente : null,
      password: this.password,
    };

    // Guardar los datos en localStorage
    localStorage.setItem(this.email, JSON.stringify(usuario));
    console.log("Usuario registrado:", usuario);
    this.router.navigate(['/login']);
  }
}
