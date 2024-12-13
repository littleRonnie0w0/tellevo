import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { ThemeService } from '../services/theme.service';
import { Router } from '@angular/router';

interface UserProfile {
  nombre: string;
  apellido: string;
  email: string;
  tieneAuto: 'si' | 'no';
  patente?: string;
}

interface ViajeHistorial {
  viajeId: number;
  nombreViaje: string;
  destino: string;
  fechaSolicitud: string;
  estado: string;
  conductorEmail: string;
  solicitanteEmail: string;
}

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
  nombre: string = '';
  apellido: string = '';
  gmail: string = '';
  tienePatente: boolean = false;
  isDarkMode: boolean = false;
  misViajes: ViajeHistorial[] = [];

  constructor(
    private menu: MenuController,
    private themeService: ThemeService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    this.isDarkMode = this.themeService.getTheme();
  }

  ngOnInit() {
    this.loadUserData();
    this.cargarHistorialViajes();
  }

  cargarHistorialViajes() {
    const userEmail = localStorage.getItem('loggedInUserEmail');
    if (!userEmail) return;

    // Obtener todas las solicitudes de viaje
    const solicitudes = JSON.parse(localStorage.getItem('solicitudesViaje') || '[]');
    
    // Filtrar solo las solicitudes del usuario actual
    this.misViajes = solicitudes.filter((solicitud: ViajeHistorial) => 
      solicitud.solicitanteEmail === userEmail
    ).sort((a: ViajeHistorial, b: ViajeHistorial) => 
      new Date(b.fechaSolicitud).getTime() - new Date(a.fechaSolicitud).getTime()
    );
  }

  async eliminarViaje(viajeId: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro que deseas eliminar este viaje de tu historial?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            const solicitudes = JSON.parse(localStorage.getItem('solicitudesViaje') || '[]');
            const nuevasSolicitudes = solicitudes.filter(
              (solicitud: ViajeHistorial) => solicitud.viajeId !== viajeId
            );
            
            localStorage.setItem('solicitudesViaje', JSON.stringify(nuevasSolicitudes));
            this.cargarHistorialViajes();

            const toast = await this.toastController.create({
              message: 'Viaje eliminado del historial',
              duration: 2000,
              color: 'success',
              position: 'bottom'
            });
            await toast.present();
          }
        }
      ]
    });

    await alert.present();
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      
      this.tienePatente = userData.tieneAuto === 'si' && !!userData.patente;
      
      console.log('Datos cargados:', userData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.router.navigate(['/login']);
    }
  }

  openMenu() {
    console.log('Menu abierto');
    this.menu.open('first');
  }
  // Agrega estas funciones en tu HistorialPage class
irAlMapa(destino: string) {
  // Mostrar loading mientras se prepara la navegación
  this.presentLoading().then(() => {
    this.router.navigate(['/mapa'], {
      queryParams: {
        destino: destino
      }
    });
  });
}

async presentLoading() {
  const loading = await this.loadingController.create({
    message: 'Cargando mapa...',
    duration: 1000,
    spinner: 'circles'
  });
  await loading.present();
  return loading;
}

  toggleTheme() {
    this.themeService.toggleTheme();
    this.isDarkMode = this.themeService.getTheme();
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