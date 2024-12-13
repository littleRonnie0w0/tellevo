import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { ThemeService } from '../services/theme.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular'; 

interface UserProfile {
  nombre: string;
  apellido: string;
  email: string;
  tieneAuto: 'si' | 'no';
  patente?: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  nombre: string = '';
  apellido: string = '';
  gmail: string = '';
  isDarkMode: boolean = false;
  tienePatente: boolean = false;

  constructor(
    private menu: MenuController, 
    private themeService: ThemeService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.isDarkMode = this.themeService.getTheme();
  }

  openMenu() {
    console.log('Menu abierto');
    this.menu.open('first');
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.isDarkMode = this.themeService.getTheme();
  }
  
  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    try {
      const email = localStorage.getItem('loggedInUserEmail');
      if (!email) {
        this.router.navigate(['/login']);
        return;
      }
  
      const storedUserData = localStorage.getItem(email);
      if (!storedUserData) {
        console.log('No se encontraron datos para el usuario:', email);
        this.router.navigate(['/login']);
        return;
      }
  
      const userData: UserProfile = JSON.parse(storedUserData);
      this.nombre = userData.nombre;
      this.apellido = userData.apellido;
      this.gmail = email;
      
      // Verificar si el usuario tiene auto y patente
      this.tienePatente = userData.tieneAuto === 'si' && !!userData.patente;
      
      console.log('Datos cargados:', userData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.router.navigate(['/login']);
    }
  }

  async mostrarMensajeNoPatente() {
    const alert = await this.alertController.create({
      header: 'Acceso Denegado',
      message: 'Para crear viajes necesitas tener un vehículo y patente registrada. Por favor, actualiza tu perfil.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Ir a Perfil',
          handler: () => {
            this.router.navigate(['/perfil-usuario']);
          }
        }
      ]
    });

    await alert.present();
  }

  async cerrarSesion() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Sí, cerrar sesión',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Cerrando sesión...',
              duration: 2000
            });
  
            await loading.present();
  
            try {
              localStorage.removeItem('loggedInUserEmail');
              
              this.nombre = '';
              this.apellido = '';
              this.gmail = '';
  
              setTimeout(async () => {
                await loading.dismiss();
                this.router.navigate(['/login'], { replaceUrl: true });
              }, 2000);
  
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
              await loading.dismiss();
              this.router.navigate(['/login'], { replaceUrl: true });
            }
          }
        }
      ]
    });
  
    await alert.present();
  }
}