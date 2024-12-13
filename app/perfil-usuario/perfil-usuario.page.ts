import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';
import { ThemeService } from '../services/theme.service';
import { Router } from '@angular/router';

interface UserProfile {
  nombre: string;
  apellido: string;
  email: string;
  numeroContacto: string;
  tieneAuto: 'si' | 'no';
  patente?: string;
  password: string; // Añadido campo de contraseña
}
interface UserProfile {
  nombre: string;
  apellido: string;
  email: string;
  tieneAuto: 'si' | 'no';
  patente?: string;
}

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.page.html',
  styleUrls: ['./perfil-usuario.page.scss'],
})
export class PerfilUsuarioPage implements OnInit {
  // Profile data
  username: string = '';
  email: string = '';
  numeroContacto: string = '';
  tieneAuto: 'si' | 'no' = 'no';
  patente: string = '';
  nombre: string = '';
  apellido: string = '';
  gmail: string = '';
  password: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  isDarkMode: boolean = false;
  isEditing: boolean = false;
  showPassword: boolean = false;
  isChangingPassword: boolean = false;
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

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    try {
      const loggedInEmail = localStorage.getItem('loggedInUserEmail');
      if (!loggedInEmail) {
        this.router.navigate(['/login']);
        return;
      }

      const storedUserData = localStorage.getItem(loggedInEmail);
      if (!storedUserData) {
        console.log('No se encontraron datos para el usuario:', loggedInEmail);
        this.router.navigate(['/login']);
        return;
      }

      const userData: UserProfile = JSON.parse(storedUserData);
      
      this.nombre = userData.nombre;
      this.apellido = userData.apellido;
      this.username = `${userData.nombre} ${userData.apellido}`;
      this.email = userData.email;
      this.gmail = userData.email;
      this.numeroContacto = userData.numeroContacto;
      this.tieneAuto = userData.tieneAuto;
      this.patente = userData.patente || '';
      this.password = userData.password;

    //preguntar mas tarde??
     
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


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async cambiarPassword() {
    if (!this.isChangingPassword) {
      this.isChangingPassword = true;
      return;
    }

    if (!this.newPassword || !this.confirmPassword) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor complete todos los campos',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Las contraseñas no coinciden',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Actualizando contraseña...',
      duration: 2000
    });

    await loading.present();

    try {
      const loggedInEmail = localStorage.getItem('loggedInUserEmail');
      if (!loggedInEmail) {
        throw new Error('No se encontró el email del usuario');
      }

      const storedUserData = localStorage.getItem(loggedInEmail);
      if (!storedUserData) {
        throw new Error('No se encontraron datos del usuario');
      }

      const userData: UserProfile = JSON.parse(storedUserData);
      userData.password = this.newPassword;

      localStorage.setItem(loggedInEmail, JSON.stringify(userData));
      
      this.password = this.newPassword;
      this.newPassword = '';
      this.confirmPassword = '';
      this.isChangingPassword = false;

      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'La contraseña ha sido actualizada correctamente',
        buttons: ['OK']
      });

      await loading.dismiss();
      await alert.present();

    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo actualizar la contraseña',
        buttons: ['OK']
      });

      await loading.dismiss();
      await alert.present();
    }
  }

  cancelarCambioPassword() {
    this.isChangingPassword = false;
    this.newPassword = '';
    this.confirmPassword = '';
  }

  async guardarCambios() {
    const loading = await this.loadingController.create({
      message: 'Guardando cambios...',
      duration: 2000
    });

    await loading.present();

    try {
      const loggedInEmail = localStorage.getItem('loggedInUserEmail');
      if (!loggedInEmail) {
        throw new Error('No se encontró el email del usuario');
      }

      const updatedProfile: UserProfile = {
        nombre: this.nombre,
        apellido: this.apellido,
        email: this.email,
        numeroContacto: this.numeroContacto,
        tieneAuto: this.tieneAuto,
        patente: this.tieneAuto === 'si' ? this.patente : undefined,
        password: this.password
      };

      localStorage.setItem(loggedInEmail, JSON.stringify(updatedProfile));
      
      this.username = `${this.nombre} ${this.apellido}`;
      this.isEditing = false;

      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Los cambios han sido guardados correctamente',
        buttons: ['OK']
      });

      await loading.dismiss();
      await alert.present();

    } catch (error) {
      console.error('Error al guardar cambios:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudieron guardar los cambios',
        buttons: ['OK']
      });

      await loading.dismiss();
      await alert.present();
    }
  }

  async cancelarEdicion() {
    const alert = await this.alertController.create({
      header: 'Cancelar edición',
      message: '¿Estás seguro que deseas cancelar los cambios?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí',
          handler: () => {
            this.loadUserData();
            this.isEditing = false;
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
              
              // Clear all profile data
              this.nombre = '';
              this.apellido = '';
              this.gmail = '';
              this.username = '';
              this.email = '';
              this.numeroContacto = '';
              this.tieneAuto = 'no';
              this.patente = '';

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
  toggleTheme() {
    this.themeService.toggleTheme(); // Cambia el estado en el servicio
    this.isDarkMode = this.themeService.getTheme(); // Actualiza el estado en el componente
  }
  async editarPerfil() {
    this.isEditing = true;
  }
 
  
}