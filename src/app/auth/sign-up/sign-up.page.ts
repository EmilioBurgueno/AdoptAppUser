import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  signUpForm: FormGroup;
  loadingIndicator;
  loading = false;
  public showPassword: boolean = false;
  public showConfirmedPassword: boolean = false;


  constructor(
    private userService: UserService,
    private navCtrl: NavController,
    private router: Router,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController) {
  }

  async ngOnInit() {
    this.initForm();


    const navigationId = this.router.getCurrentNavigation().id;
    if (navigationId === 1) {
      await this.presentLoading('Cargando...');
      this.authService.user$.pipe(take(1)).subscribe((user) => {
        setTimeout(() => {
          this.dismissLoading();
        }, 200);
        if (user) {
          this.navCtrl.navigateRoot(['']);
        }
      });
    }
  }

  initForm() {
    this.signUpForm = new FormGroup({
      fname: new FormControl(null, [Validators.required]),
      lname: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      birthday: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [Validators.required]),
      username: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  async onSubmit(): Promise<void> {
    await this.presentLoading('Creando tu cuenta...');
    if (this.signUpForm.valid) {

      const fname = this.signUpForm.controls.fname.value;
      const lname = this.signUpForm.controls.lname.value;
      const address = this.signUpForm.controls.address.value;
      const birthdate = this.signUpForm.controls.birthday.value;
      const phone = this.signUpForm.controls.phone.value;
      const username = this.signUpForm.controls.username.value;
      const email = this.signUpForm.controls.email.value;
      const password = this.signUpForm.controls.password.value;
      const cpassword = this.signUpForm.controls.confirmPassword.value;

      if (password === cpassword) {
        try {
          await this.userService.usernameExists(username);
          const credentials = await this.authService.signup(email, password);

          const user = {
            id: credentials.user.uid,
            fname,
            lname,
            birthdate,
            email,
            username,
            address,
            phone,
            favourites: [] as string[],
            actives: [] as string[]
          };

          await this.userService.createUser(user);
          await this.userService.createUsername(user);
          await this.authService.logout();
          this.dismissLoading();
          this.presentAlertConfirm('¡Bienvenido!', 'Tu cuenta ha sido creada exitosamente.');
        } catch (error) {
          this.dismissLoading();
          this.presentAlert('¡El usuario ya existe!', 'Intenta otro usuario porfavor');
        }
      } else {
        this.dismissLoading();
        this.presentAlert('¡Contraseñas no coinciden!', 'El valor de Contraseña y Confirmar Contraseña no coinciden');
      }

    } else {
      this.dismissLoading();
      this.presentAlert('¡Informacion incompleta!', 'Por favor llena todos los campos correctamente.');
    }
  }

  goToLogin(): void {
    this.navCtrl.navigateBack(['']);
  }

  async presentLoading(body: string) {
    this.loadingIndicator = await this.loadingCtrl.create({
      message: body
    });
    this.loading = true;
    await this.loadingIndicator.present();
  }

  async dismissLoading() {
    this.loading = false;
    await this.loadingIndicator.dismiss();
  }

  async presentAlert(title: string, body: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: body,
      buttons: ['Listo']
    });

    await alert.present();
  }

  async presentAlertConfirm(title: string, body: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: body,
      buttons: [
        {
          text: 'Listo',
          handler: () => {
            this.navCtrl.navigateRoot(['']);
          }
        }
      ]
    });

    await alert.present();
  }
  public onPasswordToggle(): void {
    this.showPassword = !this.showPassword;
  }
  public onConfirmPasswordToggle(): void {
    this.showConfirmedPassword = !this.showConfirmedPassword;
  }
}
