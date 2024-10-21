import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  icono = "oscuro";
  usuarios = [
    {
      nombre: "Sebastian Negro",
      email: "sebanegro23@gmail.com",
      clave: "sebas123"
    },
    {
      nombre: "RosaGarrido",
      email: "garrido.rosa2004@gmail.com",
      clave: "amigo123"
    }
  ]
  isModalOpen = false;
  email = ""
  clave = ""

  constructor(private anim: AnimationController, private http: HttpClient,private loadingCtrl: LoadingController, private router:Router) {}
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  login(){
    for(let u of this.usuarios){
      if(u.email == this.email && u.clave == this.clave){
        console.log(`Bienvenido ${u.nombre}!`)
        this.router
        return
      }
    }
    console.log("datos incorectos!.")
  }

  cambiarTema(){
    if(this.icono == "oscuro"){
      document.documentElement.style.setProperty("--fondo", "#282829");
      document.documentElement.style.setProperty("--fondo-input", "#263f51");
      document.documentElement.style.setProperty("--texto-input", "#909BAD");
      
      this.icono = "claro"
    }else{
      document.documentElement.style.setProperty("--fondo", "#454E5F");
      document.documentElement.style.setProperty("--fondo-input", "#ffffff");
      document.documentElement.style.setProperty("--texto-input", "#1b1b1b");
      this.icono = "oscuro"
    }
  }

  
 async resetPass(){
  const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
    });
  
      for(let u of this.usuarios){
        if(u.email == this.email){
        let nueva = Math.random().toString(36).slice(-6)
          u.clave = nueva
         let body ={
        "nombre": "Nombre del usuario",
        "app": "Te llevo app",
        "clave": nueva,
        "email": "elemaildelusuario@algo.com"
    }
      this.http.post("https://myths.cl/api/reset_password.php",body)
      .subscribe((data)=>{
        console.log(data)
        loading.dismiss()
      })    
      
      
      return
        }
      }
      console.log("datos incorectos!.")
  
    }
  

  ngOnInit() {
    this.anim.create()
    .addElement(document.querySelector('#logo')!)
    .duration(1500)
    .iterations(Infinity)
    .fromTo("color", "#5BC3EC","#71DB9B")
    .fromTo("transform", "scale(0.5) rotate(0deg)", "scale(0.75) rotate(0deg)")
    .direction("alternate")
    .play();
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
