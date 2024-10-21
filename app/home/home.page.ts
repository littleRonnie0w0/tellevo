import { Component, OnInit } from '@angular/core';
import { AnimationController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {
  icono = "oscuro";
  
  constructor(private anim: AnimationController) {}

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

  animarError(index: number) {
    this.anim.create()
    .addElement(document.querySelectorAll("input")[index])
    .duration(100)
    .iterations(3)
    .keyframes([
      { offset: 0, border: "1px transparent solid", transform: "translateX(0px)" },
      { offset: 0.25, border: "1px red solid", transform: "translateX(-5px)" },
      { offset: 0.50, border: "1px transparent solid", transform: "translateX(0px)" },
      { offset: 0.75, border: "1px red solid", transform: "translateX(5px)" },
      { offset: 1, border: "1px transparent solid", transform: "translateX(0px)" },
    ]).play();
  }
}
  

