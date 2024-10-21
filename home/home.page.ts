import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  productos: any
  carrito: any[] = []

  constructor(
    private toast: ToastController,
    private http: HttpClient
  ) {
    this.getProductos()
  }

  ionViewWillEnter(){
    if (localStorage.getItem("carrito")) {
      this.carrito = JSON.parse(localStorage.getItem("carrito")!)
    }
  }

  async showToast(texto: string) {
    const toast = await this.toast.create({
      message: texto,
      duration: 3000,
      positionAnchor: 'footer',
      cssClass: 'rounded-toast'
    });
    await toast.present();
  }

  getProductos(){
    this.http.get("https://myths.cl/api/productos.php?grupo=movil")
    .subscribe((data)=>{
      this.productos=data
    })
  }

  addToCart(producto:any){
    this.carrito.push(producto)
    localStorage.setItem("carrito", JSON.stringify(this.carrito))
    this.showToast(`Producto ${producto.nombre} añadido al carrito!.`)
  }

}
