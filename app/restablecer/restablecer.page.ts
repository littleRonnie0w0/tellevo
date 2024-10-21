import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-restablecer',
  templateUrl: './restablecer.page.html',
  styleUrls: ['./restablecer.page.scss'],
})
export class RestablecerPage {
  email: string = '';
  icono = "oscuro";

  constructor(private toastController: ToastController) {}
  
  cambiarTema() {
    if (this.icono == "oscuro") {
      // Tema oscuro
      document.documentElement.style.setProperty("--fondo", "#1A3177");
      document.documentElement.style.setProperty("--fondo-input", "#101E4A");
      document.documentElement.style.setProperty("--texto-input", "#909BAD");
      document.documentElement.style.setProperty("--icono", "#71DB9B");
      document.documentElement.style.setProperty("--textos", "#FFFFFF");
      this.icono = "claro";
    } else {
      // Tema claro
      document.documentElement.style.setProperty("--fondo", "#3C59AC");
      document.documentElement.style.setProperty("--fondo-input", "#ffffff");
      document.documentElement.style.setProperty("--texto-input", "#1b1b1b");
      document.documentElement.style.setProperty("--icono", "#5BC3EC");
      document.documentElement.style.setProperty("--textos", "#000000");
      this.icono = "oscuro";
    }
  }

  async resetPassword() {
    if (this.email) {
      // Aquí agregar la lógica para enviar el correo de restablecimiento de contraseña
      // Por ejemplo, llamar a un servicio que maneje el restablecimiento de contraseña

      // Simulación de envío de correo
      setTimeout(async () => {
        const toast = await this.toastController.create({
          message: 'Correo enviado, por favor revisa tu correo.',
          duration: 2000,
          position: 'top',
          color: 'success'
        });
        toast.present();
      }, 1000); // Simula un retraso en el envío del correo
    } else {
      const toast = await this.toastController.create({
        message: 'Por favor, ingresa tu correo electrónico.',
        duration: 2000,
        position: 'top',
        color: 'danger'
      });
      toast.present();
    }
  }
}

