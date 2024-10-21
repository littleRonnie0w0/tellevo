import { Component, OnInit } from '@angular/core';
import { AnimationController } from '@ionic/angular';


@Component({
  selector: 'app-conductor',
  templateUrl: './conductor.page.html',
  styleUrls: ['./conductor.page.scss'],
})
export class ConductorPage implements OnInit {
  conductor: any;
  icono = "oscuro";

  constructor(private anim: AnimationController) {
    // Datos simulados para mostrar
    this.conductor = {
      email: 'conductor@correo.com',
      nombre: 'Juan',
      apellidos: 'Pérez',
      patente: 'ABC-123',
      ciudad: 'Santiago',
      precio: '$10.000',
      fono: "+56954101675"
    };
  }
  

  
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
  ngOnInit() {
    this.anim.create()
    
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
