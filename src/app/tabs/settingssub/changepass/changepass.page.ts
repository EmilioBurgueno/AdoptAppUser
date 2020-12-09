import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { User } from 'firebase';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-changepass',
  templateUrl: './changepass.page.html',
  styleUrls: ['./changepass.page.scss'],
})
export class ChangepassPage implements OnInit {

  editUserForm: FormGroup;
  user: any;
  userId: string;

  loadingIndicator;
  loading = false;

  public showCurrentPassword: boolean = false;
  public showPassword: boolean = false;
  public showConfirmedPassword: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private userService: UserService,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.userId = this.activatedRoute.snapshot.paramMap.get('userId');
    this.getUser(this.userId);
    this.initForm();
  }

  getUser(uID: string) {
    this.userService.getUser(uID).subscribe((user) => {
      this.user = user as User;
      this.patchForm();
    })
  }

  patchForm() {
    this.editUserForm.patchValue({
      email: this.user.email
    });
  }

  initForm() {
    this.editUserForm = new FormGroup({
      email: new FormControl(null, [Validators.required]),
      cPassword: new FormControl(null, [Validators.required]),
      nPassword: new FormControl(null),
      ncPassword: new FormControl(null)
    });
  }

  async updateEmail() {
    await this.presentLoading('Haciendo cambios...');
    if (this.editUserForm.valid) {
      if (this.editUserForm.controls.email.value === this.user.email) {

        this.dismissLoading();
        this.presentAlert('¡Error!', 'Este email ya existe. Ingresa uno nuevo.');
      } else {
        const updatedUser = {
          email: this.editUserForm.controls.email.value
        };

        await this.authService.reauthenticate(this.editUserForm.controls.cPassword.value).then(() => {

          this.userService.updateUser(this.user.uid.toString(), updatedUser);
          this.authService.changeEmail(this.editUserForm.controls.cPassword.value, this.editUserForm.controls.email.value);
          this.dismissLoading();
          this.presentAlertConfirm('¡Exito!', 'Tu email ha sido cambiado correctamente.');
          this.goBack();
        }).catch((error) => {
          this.dismissLoading();
          this.presentAlert('¡Error!', 'Tu contraseña no es correcta.');
        });
      }
    } else {
      this.dismissLoading();
      this.presentAlert('¡Error!', 'Tu contraseña actual no es correcta.');
    }
  }

  async updatePassword() {
    await this.presentLoading('Haciendo cambios...');
    if (this.editUserForm.valid) {
      await this.authService.reauthenticate(this.editUserForm.controls.cPassword.value).then(() => {
        if (this.editUserForm.controls.nPassword.value !== this.editUserForm.controls.ncPassword.value) {
          this.dismissLoading();
          this.presentAlert('¡Error!', 'Tus contraseñas no coinciden.');

        } else if (this.editUserForm.controls.nPassword.value == null) {
          this.dismissLoading();
          this.presentAlert('¡Error!', 'Ingresa una nueva contraseña. ');

        } else if (this.editUserForm.controls.nPassword.value.length < 6) {
          this.dismissLoading();
          this.presentAlert('¡Error!', 'Tu contraseña tiene que tener al menos 6 caracteres.');
        } else {
          try {
            console.log(this.editUserForm.controls.email.value);
            if (this.editUserForm.controls.email.value === this.user.email) {
              this.authService.changePassword(this.editUserForm.controls.cPassword.value, this.editUserForm.controls.nPassword.value);
              this.dismissLoading();
              this.presentAlertConfirm('¡Exito!', 'Tu contraseña ha sido cambiada correctamente.');
              this.goBack();
            } else {
              this.authService.changePassword(this.editUserForm.controls.cPassword.value, this.editUserForm.controls.nPassword.value);
              this.dismissLoading();
              this.presentAlertConfirm('¡Exito!', 'Tu contraseña ha sido cambiada correctamente. Sin embargo, tu email no ha sido cambiado. Para cambiar de email haz click en el boton "Cambiar Email".');
              this.goBack();
            }
          } catch (error) {
            console.log('Se ha producido un error. Intente mas tarde!');
            this.dismissLoading();
            this.presentAlert('¡Lo sentimos!', 'Ha ocurrido un error. Intente mas tarde.');
          }
        }
      }).catch((error) => {
        console.log(error);
        this.dismissLoading();
        this.presentAlert('¡Error!', 'Tu actual contraseña no es correcta.');
      });
    } else {
      this.dismissLoading();
      this.presentAlert('¡Error!', 'Tu actual contraseña no es correcta.');
    }
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
            this.goBack();
          }
        }
      ]
    });

    await alert.present();
  }

  goBack() {
    this.navCtrl.navigateRoot(['tabs/settings']);
  }

  public onCurrentPasswordToggle(): void {
    this.showCurrentPassword = !this.showCurrentPassword;
  }
  public onPasswordToggle(): void {
    this.showPassword = !this.showPassword;
  }
  public onConfirmPasswordToggle(): void {
    this.showConfirmedPassword = !this.showConfirmedPassword;
  }
  goToFeed() {
    this.navCtrl.navigateRoot(['tabs/feed']);
  }

}
