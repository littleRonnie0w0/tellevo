import { Component, OnInit } from '@angular/core';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
  viajes = [
    { destino: 'Maria pinto', fecha: '2024-08-01', duracion: '30 min', precio: 1200 },
    { destino: 'Maria pinto', fecha: '2024-08-05', duracion: '45 min', precio: 1500 },
    { destino: 'Maria pinto', fecha: '2024-08-07', duracion: '1 hr', precio: 2000 },
    { destino: 'Maria pinto', fecha: '2024-08-9', duracion: '1 hr', precio: 5000 },
    { destino: 'Maria pinto', fecha: '2024-08-10', duracion: '30 min', precio: 8000 },
    { destino: 'Maria pinto', fecha: '2024-08-11', duracion: '45 min', precio: 3400 },
  ];
  icono = "oscuro";


  constructor(private anim: AnimationController) {}
  
  cambiarTema() {
    if (this.icono === "oscuro") {
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

  
  ngOnInit() {
    this.anim.create();
  }

  animarTema() {
    this.anim.create()
      .addElement(document.querySelector('#tema')!)
      .duration(500)
      .fromTo("transform", "rotate(0deg)", "rotate(60deg)")
      .onFinish(() => {
        this.cambiarTema();
      }).play();
  }

}
