import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { AlertController, LoadingController, MenuController, Platform } from '@ionic/angular';
import { ThemeService } from '../services/theme.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';


declare var google: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {
  @ViewChild('map', { static: true }) mapElement!: ElementRef;
  
  map: any;
  start: string = "Duoc uc melipilla";
  end: string = "";
  directionsService: any;
  directionsDisplay: any;
  distancia: string = "";
  duracion: string = "";
  destinoViaje: string = "";
  isDarkMode: boolean = false;

  constructor(
    private menu: MenuController,
    private platform: Platform,
    private zone: NgZone,
    private themeService: ThemeService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.isDarkMode = this.themeService.getTheme();
  }

  async ngOnInit() {
    // Wait for the route params and platform to be ready
    await this.platform.ready();
    
    this.route.queryParams.subscribe(async params => {
      if (params['destino']) {
        this.destinoViaje = params['destino'];
        this.end = this.destinoViaje;
        await this.loadMap();
      }
    });
  }

  goBack() {
    this.location.back();
  }

  async loadMap() {
    console.log(this.start+" - "+this.end)
    try {
      // Show loading indicator
      const loading = await this.loadingController.create({
        message: 'Cargando mapa...'
      });
      await loading.present();

      // Initialize Google Maps services
      this.directionsService = new google.maps.DirectionsService();
      this.directionsDisplay = new google.maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#4285F4',
          strokeWeight: 5
        }
      });

      // Create map with initial options
      const mapOptions = {
        zoom: 15,
        center: { lat: -33.6844, lng: -71.2168 }, // Melipilla coordinates
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      // Initialize map
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.directionsDisplay.setMap(this.map);

      // Get current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            // Update start position with current location
            this.start = `${pos.lat},${pos.lng}`;

            // Add marker for current location
            new google.maps.Marker({
              position: pos,
              map: this.map,
              title: 'Tu ubicación actual',
              icon: {
                url: 'assets/icon/current-location.png',
                scaledSize: new google.maps.Size(40, 40)
              }
            });

            // Calculate and display route
            await this.calculateAndDisplayRoute();
            await loading.dismiss();
          },
          async (error) => {
            console.error('Error getting location:', error);
            // Fallback to default start location if geolocation fails
            this.start = "Duoc UC: Sede Melipilla - Serrano, Melipilla, Chile";
            await this.calculateAndDisplayRoute();
            await loading.dismiss();
          }
        );
      } else {
        // Browser doesn't support geolocation
        this.start = "Duoc UC: Sede Melipilla - Serrano, Melipilla, Chile";
        await this.calculateAndDisplayRoute();
        await loading.dismiss();
      }

    } catch (error) {
      console.error('Error loading map:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo cargar el mapa. Por favor, intenta nuevamente.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async calculateAndDisplayRoute() {
    if (!this.start || !this.end) return;

    return new Promise((resolve, reject) => {
      this.directionsService.route({
        origin: this.start,
        destination: this.end,
        travelMode: google.maps.TravelMode.DRIVING
      }, (response: any, status: string) => {
        if (status === 'OK') {
          this.zone.run(() => {
            this.directionsDisplay.setDirections(response);
            const route = response.routes[0];
            const leg = route.legs[0];
            
            // Calculate distance in kilometers
            this.distancia = `${(leg.distance.value / 1000).toFixed(2)} km`;
            
            // Calculate duration in hours and minutes
            const minutes = Math.floor(leg.duration.value / 60);
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            
            this.duracion = hours > 0 
              ? `${hours}h ${remainingMinutes}min`
              : `${minutes} min`;
            
            resolve(true);
          });
        } else {
          console.error('Directions request failed due to ' + status);
          reject(status);
        }
      });
    });
  }
}