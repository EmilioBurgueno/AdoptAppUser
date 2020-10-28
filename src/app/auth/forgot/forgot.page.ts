import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NavController, AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage implements OnInit {

  loadingIndicator;
  loading = false;
  public email: string = "";

  constructor(private afa: AuthService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  async sendLink(): Promise<void> {
    await this.presentLoading('Procesando petición...');

    if (this.email != "") {
      try {
        await this.afa.resetPassword(this.email);
        this.dismissLoading();
        this.presentAlertConfirm('Correo enviado!', 'Se ha enviado con éxito la informacion para restaurar tu contraseña');
      } catch (error) {
        this.dismissLoading();
        this.presentAlert('Usuario no registrado', 'El usuario no se encuentra registrado o puede que haya sido eliminado');
      }

    }
    else {
      this.dismissLoading();
      this.presentAlert('Información incompleta', 'Por favor llena la información correctamente.');
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
            this.navCtrl.navigateRoot(['']);
          }
        }
      ]
    });

    await alert.present();
  }

  goToSignUp(): void {
    this.navCtrl.navigateForward(['auth/sign-up']);
  }
}
