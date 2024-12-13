import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { AlertController, LoadingController, MenuController, Platform } from '@ionic/angular';
import { ThemeService } from '../services/theme.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

declare var google: any;

interface UserProfile {
  nombre: string;
  apellido: string;
  email: string;
  tieneAuto: 'si' | 'no';
  patente?: string;
  numeroContacto: string;
}

interface Viaje {
  id: number;
  nombre: string;
  destino: string;
  patente: string;
  capacidad: number;
  cobro: boolean;
  monto: number;
  fecha: string;
  fono: string;
}

@Component({
  selector: 'app-crear',
  templateUrl: './crear.page.html',
  styleUrls: ['./crear.page.scss'],
})
export class CrearPage implements OnInit {
  // Propiedades originales
  nombre: string = '';
  apellido: string = '';
  gmail: string = '';
  numeroContacto: string = '';
  isDarkMode: boolean = false;
  tienePatente: boolean = false;
  
  // Propiedades del mapa
  @ViewChild('map') mapElement: ElementRef | undefined;
  public map: any;
  public start: any = "Duoc UC: Sede Melipilla - Serrano, Melipilla, Chile";
  public end: any = "melipilla, Chile";
  public directionsService: any;
  public directionsDisplay: any;
  public searchBox: any;
  autocompleteService: any;
  placesService: any;
  autocompleteItems: any[] = [];
  distancia = "";
  duracion = "";

  // Nuevas propiedades para gestión de viajes
  viajes: Viaje[] = [];
  viajeActual: Viaje = {
    id: 0,
    nombre: '',
    destino: '',
    patente: '',
    fono: '',
    capacidad: 4,
    cobro: false,
    monto: 0,
    fecha: new Date().toLocaleDateString()
  };
  editandoViaje: boolean = false;

  constructor(
    private menu: MenuController,
    private platform: Platform,
    private zone: NgZone,
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
    this.cargarViajes();
    this.initAutocompleteServices();
  }

  ionViewDidEnter() {
    this.platform.ready().then(() => {
      this.initMap();
    });
  }

  initAutocompleteServices() {
    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.placesService = new google.maps.places.PlacesService(document.createElement('div'));
  }

  cargarViajes() {
    const viajesGuardados = localStorage.getItem('viajes');
    if (viajesGuardados) {
      this.viajes = JSON.parse(viajesGuardados);
    }
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
      this.numeroContacto = userData.numeroContacto;
      this.tienePatente = userData.tieneAuto === 'si' && !!userData.patente;
      
      // Establecer valores por defecto en el viaje actual
      this.viajeActual.nombre = `${userData.nombre} ${userData.apellido}`;
      this.viajeActual.fono = userData.numeroContacto;
      if (userData.patente) {
        this.viajeActual.patente = userData.patente;
      }
      
      console.log('Datos cargados:', userData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.router.navigate(['/login']);
    }
  }

  async guardarViaje() {
    if (!this.tienePatente) {
      this.mostrarMensajeNoPatente();
      return;
    }

    if (!this.viajeActual.nombre || !this.viajeActual.destino || !this.viajeActual.patente || !this.viajeActual.fono) {
      const alert = await this.alertController.create({
        header: 'Campos incompletos',
        message: 'Por favor complete todos los campos requeridos.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (this.viajeActual.cobro && (!this.viajeActual.monto || this.viajeActual.monto <= 0)) {
      const alert = await this.alertController.create({
        header: 'Monto inválido',
        message: 'Por favor ingrese un monto válido mayor a 0.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (this.editandoViaje) {
      const index = this.viajes.findIndex(v => v.id === this.viajeActual.id);
      if (index !== -1) {
        this.viajes[index] = { ...this.viajeActual };
      }
    } else {
      const nuevoViaje: Viaje = {
        ...this.viajeActual,
        id: Date.now(),
        fecha: new Date().toLocaleDateString(),
        destino: this.end
      };
      this.viajes.push(nuevoViaje);
    }

    localStorage.setItem('viajes', JSON.stringify(this.viajes));
    this.limpiarFormularioViaje();
    this.presentToast('Viaje guardado exitosamente');
  }

  editarViaje(viaje: Viaje) {
    this.viajeActual = { ...viaje };
    this.editandoViaje = true;
    this.end = viaje.destino;
    this.initMap();
  }

  async eliminarViaje(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de eliminar este viaje?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.viajes = this.viajes.filter(v => v.id !== id);
            localStorage.setItem('viajes', JSON.stringify(this.viajes));
            this.presentToast('Viaje eliminado exitosamente');
          }
        }
      ]
    });
    await alert.present();
  }

  limpiarFormularioViaje() {
    const nombreActual = this.viajeActual.nombre;
    const patenteActual = this.viajeActual.patente;
    const fonoActual = this.viajeActual.fono;
    
    this.viajeActual = {
      id: 0,
      nombre: nombreActual,
      destino: '',
      patente: patenteActual,
      fono: fonoActual,
      capacidad: 4,
      cobro: false,
      monto: 0,
      fecha: new Date().toLocaleDateString()
    };
    this.editandoViaje = false;
    this.autocompleteItems = [];
  }

  // Métodos del mapa y búsqueda
  initMap() {
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    
    let mapOptions = {
      zoom: 5,
      zoomControl: false,
      scaleControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    this.map = new google.maps.Map(this.mapElement?.nativeElement, mapOptions);
    let infoWindow = new google.maps.InfoWindow();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          infoWindow.setPosition(pos);
          infoWindow.setContent("Estás aquí.");
          infoWindow.open(this.map);
          this.map.setCenter(pos);
        }
      );
    }

    this.directionsDisplay.setMap(this.map);
    this.calculateAndDisplayRoute();
  }

  updateSearchResults() {
    if (this.viajeActual.destino === '') {
      this.autocompleteItems = [];
      return;
    }

    const request = {
      input: this.viajeActual.destino,
      componentRestrictions: { country: 'CL' },
      types: ['geocode', 'establishment']
    };

    this.autocompleteService.getPlacePredictions(request, (predictions: any, status: any) => {
      this.autocompleteItems = [];
      this.zone.run(() => {
        if (predictions) {
          predictions.forEach((prediction: any) => {
            this.autocompleteItems.push({
              description: prediction.description,
              place_id: prediction.place_id
            });
          });
        }
      });
    });
  }

  selectSearchResult(item: any) {
    this.viajeActual.destino = item.description;
    this.end = item.description;
    this.autocompleteItems = [];
    this.initMap();
  }

  calculateAndDisplayRoute() {
    this.directionsService.route({
      origin: this.start,
      destination: this.end,
      travelMode: 'DRIVING'
    }, (response: any, status: string) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);
        const route = response.routes[0];
        const leg = route.legs[0];
        
        const distanceInKilometers = (leg.distance.value / 1000).toFixed(2);
        this.distancia = `${distanceInKilometers} km`;

        const durationInSeconds = leg.duration.value;
        const minutes = Math.floor(durationInSeconds / 60);
        const seconds = durationInSeconds % 60;
        const formattedDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.duracion = formattedDuration;
      } else {
        window.alert('No se pudo calcular la ruta: ' + status);
      }
    });
  }

  // Métodos de navegación y UI
  actualizarCobro() {
    if (!this.viajeActual.cobro) {
      this.viajeActual.monto = 0;
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

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.isDarkMode = this.themeService.getTheme();
  }

  openMenu() {
    this.menu.open('first');
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
            localStorage.removeItem('loggedInUserEmail');
            setTimeout(() => {
              this.router.navigate(['/login'], { replaceUrl: true });
            }, 2000);
          }
        }
      ]
    });
    await alert.present();
  }

  async irAlMapa(destino: string) {
    const loading = await this.loadingController.create({
      message: 'Cargando mapa...',
      duration: 1000,
      spinner: 'circles'
    });
    await loading.present();
    
    this.router.navigate(['/mapa'], {
      queryParams: { destino: destino }
    });
  }
}