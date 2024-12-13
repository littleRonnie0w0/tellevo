import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { ThemeService } from '../services/theme.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface UserProfile {
  nombre: string;
  apellido: string;
  email: string;
  tieneAuto: 'si' | 'no';
  patente?: string;
  numeroContacto?: string;
}

interface Viaje {
  id: number;
  nombre: string;
  destino: string;
  patente: string;
  monto?: number;
  fecha?: string;
  creatorEmail?: string;
  capacidad: number;
  asientosOcupados: number;
  fono?: string;
}

@Component({
  selector: 'app-solicitar',
  templateUrl: './solicitar.page.html',
  styleUrls: ['./solicitar.page.scss'],
})
export class SolicitarPage implements OnInit {
  nombre: string = '';
  apellido: string = '';
  gmail: string = '';
  fono: string = '';
  isDarkMode: boolean = false;
  tienePatente: boolean = false;
  viajes: Viaje[] = [];
  viajesDisponibles: Viaje[] = [];

  constructor(
    private menu: MenuController,
    private themeService: ThemeService,
    private toast: ToastController,
    private http: HttpClient,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.isDarkMode = this.themeService.getTheme();
  }

  ngOnInit() {
    this.loadUserData();
    this.loadViajesFromLocalStorage();
  }

  loadViajesFromLocalStorage() {
    try {
      console.log('Cargando viajes desde localStorage...');
      const storedViajes = localStorage.getItem('viajes');
      if (storedViajes) {
        this.viajes = JSON.parse(storedViajes);
        
        // Asociar teléfono del conductor a cada viaje
        this.viajes = this.viajes.map(viaje => {
          if (viaje.creatorEmail) {
            const conductorData = localStorage.getItem(viaje.creatorEmail);
            if (conductorData) {
              const conductor = JSON.parse(conductorData);
              return { ...viaje, conductorTelefono: conductor.telefono };
            }
          }
          return viaje;
        });

        // Obtener email del usuario para excluir sus viajes
        const userEmail = localStorage.getItem('loggedInUserEmail');
        this.viajesDisponibles = this.viajes.filter(viaje => {
          const asientosDisponibles = (viaje.capacidad || 0) - (viaje.asientosOcupados || 0);
          return viaje.creatorEmail !== userEmail && asientosDisponibles > 0;
        });
      } else {
        this.viajes = [];
        this.viajesDisponibles = [];
      }
    } catch (error) {
      console.error('Error al cargar viajes:', error);
      this.viajes = [];
      this.viajesDisponibles = [];
    }
  }

  async solicitarViaje(viaje: Viaje) {
    try {
      const userEmail = localStorage.getItem('loggedInUserEmail');
      if (!userEmail) return;

      // Verificar si ya ha solicitado este viaje
      const existingRequests = JSON.parse(localStorage.getItem('solicitudesViaje') || '[]');
      const alreadyRequested = existingRequests.some(
        (request: any) => request.viajeId === viaje.id && request.solicitanteEmail === userEmail
      );

      if (alreadyRequested) {
        await this.mostrarToast('Ya has solicitado este viaje', 'warning');
        return;
      }

      // Verificar capacidad disponible
      if (this.getAsientosDisponibles(viaje) <= 0) {
        await this.mostrarToast('No hay asientos disponibles para este viaje', 'warning');
        return;
      }

      // Mostrar alerta de confirmación
      const confirmAlert = await this.alertController.create({
        header: 'Confirmar solicitud',
        message: '¿Estás seguro que deseas solicitar este viaje?',
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Sí, solicitar',
            handler: async () => await this.procesarSolicitud(viaje, userEmail, existingRequests)
          }
        ]
      });
      await confirmAlert.present();

    } catch (error) {
      console.error('Error al solicitar viaje:', error);
      await this.mostrarToast('Error al enviar la solicitud', 'danger');
    }
  }

  private async procesarSolicitud(viaje: Viaje, userEmail: string, existingRequests: any[]) {
    const conductorData = viaje.creatorEmail ? JSON.parse(localStorage.getItem(viaje.creatorEmail) || '{}') : null;

    // Actualizar asientos ocupados
    const viajeIndex = this.viajes.findIndex(v => v.id === viaje.id);
    if (viajeIndex !== -1) {
      this.viajes[viajeIndex].asientosOcupados += 1;
      localStorage.setItem('viajes', JSON.stringify(this.viajes));
    }

    // Guardar nueva solicitud
    const newRequest = {
      viajeId: viaje.id,
      nombreViaje: viaje.nombre,
      destino: viaje.destino,
      solicitanteEmail: userEmail,
      estado: 'pendiente',
      fechaSolicitud: new Date().toISOString(),
      conductorEmail: viaje.creatorEmail,
      conductorTelefono: conductorData?.telefono || viaje.fono
    };
    existingRequests.push(newRequest);
    localStorage.setItem('solicitudesViaje', JSON.stringify(existingRequests));

    // Mostrar datos del conductor
    await this.mostrarAlertaConductor(viaje, conductorData);

    // Mostrar mensaje de éxito
    await this.mostrarToast('Solicitud enviada exitosamente', 'success');
    this.loadViajesFromLocalStorage();
  }

  async mostrarAlertaConductor(viaje: Viaje, conductorData: any) {
    const botones: any[] = [
      {
        text: 'Cerrar',
        role: 'cancel'
      }
    ];
  
    // Si hay un número de teléfono disponible, añade el botón de "Llamar"
    const telefonoConductor = conductorData?.telefono || viaje.fono;
    if (telefonoConductor) {
      botones.push({
        text: 'Llamar',
        handler: () => {
          window.location.href = `tel:${telefonoConductor}`;
        }
      });
    }
  
    // Crear la alerta con los botones configurados
    const conductorAlert = await this.alertController.create({
      header: 'Contacto del Conductor',
      message: `
        Conductor: ${conductorData?.nombre || viaje.nombre} ${conductorData?.apellido || ''}
        Teléfono: ${telefonoConductor || 'No disponible'}
      `,
      buttons: botones
    });
  
    await conductorAlert.present();
  }
  

  async mostrarToast(message: string, color: 'success' | 'warning' | 'danger') {
    const toast = await this.toast.create({
      message,
      duration: 2000,
      color,
      position: 'middle'
    });
    await toast.present();
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

      console.log('Datos de usuario cargados:', userData);
    } catch (error) {
      console.error('Error al cargar datos de usuario:', error);
      this.router.navigate(['/login']);
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.isDarkMode = this.themeService.getTheme();
  }

  async cerrarSesion() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro que deseas cerrar sesión?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sí, cerrar sesión',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Cerrando sesión...',
              duration: 2000
            });
            await loading.present();

            localStorage.removeItem('loggedInUserEmail');
            this.router.navigate(['/login']);
          }
        }
      ]
    });
    await alert.present();
  }

  getAsientosDisponibles(viaje: Viaje): number {
    return (viaje.capacidad || 0) - (viaje.asientosOcupados || 0);
  }

  async mostrarMensajeNoPatente() {
    const alert = await this.alertController.create({
      header: 'Aviso',
      message: 'Debes tener un vehículo registrado para crear un viaje.',
      buttons: ['OK']
    });
    await alert.present();
  }
}
