import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AnimationController, LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ThemeService } from '../services/theme.service';

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
      password: "sebas123"
    }
  ];
  
  isModalOpen = false;
  email = "";
  password = ""; 

  passwordType = 'password';
  passwordIcon = 'eye-off-outline';
  isDarkMode = false;

  constructor(
    private anim: AnimationController,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private router: Router,
    private themeService: ThemeService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.isDarkMode = this.themeService.getTheme();
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  async login() {
    if (!this.email || !this.password
    ) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, complete todos los campos',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión...',
      duration: 1500
    });
    await loading.present();

    try {
      const usuarioGuardado = localStorage.getItem(this.email);
      
      if (!usuarioGuardado) {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Usuario no encontrado',
          buttons: ['OK']
        });
        await alert.present();
        return;
      }
    
      const usuario = JSON.parse(usuarioGuardado);
    
      if (usuario.password === this.password
      ) { // Cambiado de password a clave
        // Guardar el email del usuario logueado
        localStorage.setItem('loggedInUserEmail', this.email);
        
        setTimeout(async () => {
          await loading.dismiss();
          this.router.navigate(['/home'], { replaceUrl: true });
        }, 1500);
      } else {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Contraseña incorrecta',
          buttons: ['OK']
        });
        await alert.present();
      }
    } catch (error) {
      console.error('Error en login:', error);
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Ocurrió un error al iniciar sesión',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
  
  async resetPass() {
    if (!this.email) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, ingrese un correo electrónico',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
    });
    await loading.present();
  
    try {
      // First check local storage
      const usuarioGuardado = localStorage.getItem(this.email);
      let usuario;
      
      if (usuarioGuardado) {
        usuario = JSON.parse(usuarioGuardado);
      } else {
        // If not in localStorage, check the usuarios array
        usuario = this.usuarios.find(u => u.email === this.email);
        
        if (!usuario) {
          loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'Usuario no encontrado',
            buttons: ['OK']
          });
          await alert.present();
          return;
        }
      }
  
      // Generate new password
      const nueva = Math.random().toString(36).slice(-6);
      
      let body = {
        "nombre": usuario.nombre,
        "app": "Te llevo app",
        "clave": nueva,
        "email": this.email
      };
  
      this.http.post("https://myths.cl/api/reset_password.php", body)
        .subscribe({
          next: async (data) => {
            // Update password in localStorage if user exists there
            if (usuarioGuardado) {
              usuario.password = nueva;
              localStorage.setItem(this.email, JSON.stringify(usuario));
            }
            
            // Update password in usuarios array if user exists there
            const userIndex = this.usuarios.findIndex(u => u.email === this.email);
            if (userIndex !== -1) {
              this.usuarios[userIndex].password = nueva;
            }
            
            loading.dismiss();
            
            // Show alert with new password
            const alert = await this.alertController.create({
              header: 'Contraseña Restablecida',
              message: `Su nueva contraseña es: ${nueva}\n\nTambién se ha enviado a su correo electrónico.`,
              buttons: ['OK']
            });
            await alert.present();
            this.setOpen(false);
          },
          error: async (err) => {
            console.error(err);
            loading.dismiss();
            const alert = await this.alertController.create({
              header: 'Error',
              message: 'No se pudo resetear la contraseña',
              buttons: ['OK']
            });
            await alert.present();
          }
        });
    } catch (error) {
      console.error('Error in resetPass:', error);
      loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Ha ocurrido un error',
        buttons: ['OK']
      });
      await alert.present();
    }
  }


  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordType === 'text' ? 'eye-outline' : 'eye-off-outline';
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.isDarkMode = this.themeService.getTheme();
  }
}