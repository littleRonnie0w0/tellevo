import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-pasajeros',
  templateUrl: './pasajeros.page.html',
  styleUrls: ['./pasajeros.page.scss'],
})
export class PasajerosPage implements OnInit {

  personas = [
    { nombre: 'Juan Pérez', destino: 'Santiago', precio: 2500 },
    { nombre: 'Ana Gómez', destino: 'Maria Pinto', precio: 1800 },
    { nombre: 'Pedro López', destino: 'San Antonio', precio: 3000 },
    { nombre: 'Laura Martínez', destino: 'San Pedro', precio: 2200 },
    { nombre: 'Martin Ulloa', destino: 'Chiñihue', precio: 4300 },
    { nombre: 'Valentina Opazo', destino: 'Alhue', precio: 1550 },
  ];

  mensajeToast: string | null = null;
  colorToast: string = 'success';
  personaSeleccionada: any = null;

  constructor(private toastController: ToastController) {}

  ngOnInit() {}

  async seleccionarPersona(persona: any) {
    this.personaSeleccionada = persona;
    this.mensajeToast = `Has seleccionado a ${persona.nombre}. Presiona "Confirmar Viaje" para continuar.`;
    const toast = await this.toastController.create({
      message: this.mensajeToast,
      duration: 3000,
      color: this.colorToast
    });
    toast.present();
  }

  async confirmarViaje() {
    if (!this.personaSeleccionada) {
      this.mensajeToast = 'Por favor, selecciona una persona antes de confirmar el viaje.';
      const toast = await this.toastController.create({
        message: this.mensajeToast,
        duration: 3000,
        color: 'danger'
      });
      toast.present();
      return;
    }

    this.mensajeToast = `ÑUBER ACEPTADO, ${this.personaSeleccionada.nombre} PASARÁ POR TI PRONTO`;
    const toast = await this.toastController.create({
      message: this.mensajeToast,
      duration: 3000,
      color: this.colorToast
    });
    toast.present();
    
    // Limpiar la selección después de confirmar
    this.personaSeleccionada = null;
  }
}
