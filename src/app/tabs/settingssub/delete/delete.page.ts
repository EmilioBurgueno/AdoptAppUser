import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, ModalController, NavController, NavParams } from '@ionic/angular';
import { User } from 'firebase';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.page.html',
  styleUrls: ['./delete.page.scss'],
})
export class DeletePage implements OnInit {

  user: any;
  userId: string;

  loadingIndicator;
  loading = false;

  public password: string = "";
  public showPassword: boolean = false;

  constructor(private afa: AuthService,
    private navCtrl: NavController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private userService: UserService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.userId = this.activatedRoute.snapshot.paramMap.get('userId');
    this.getUser(this.userId);
  }

  getUser(uID: string) {
    this.userService.getUser(uID).subscribe((user) => {
      this.user = user as User;
    })
  }

  async deleteAccount(): Promise<void> {
    await this.presentLoading('Procesando petición...')

    if (this.password != "") {
      try {
        await this.userService.deleteUsername(this.user.username.toString());
        await this.userService.deleteUser(this.user.id.toString());
        await this.afa.deleteUser(this.password);
        this.dismissLoading();
        this.presentAlertConfirm('La cuenta ha sido eliminada', 'Regresaras a la pagina de inicio de sesión');
      } catch (error) {
        this.dismissLoading();
        this.presentAlert('Contraseña incorrecta', 'La contraseña ingresada no es correcta, favor de intentar otra vez');
      }
    }
    else {
      this.dismissLoading();
      this.presentAlert('Información incompleta', 'Por favor llena la informacion correctamente.');
    }
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
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
            this.navCtrl.navigateRoot(['auth/login']);
            this.closeModal();
          }
        }
      ]
    });

    await alert.present();
  }

  public onPasswordToggle(): void {
    this.showPassword = !this.showPassword;
  }

  goBack() {
    this.navCtrl.navigateRoot(['tabs/settings']);
  }

  goToFeed() {
    this.navCtrl.navigateRoot(['tabs/feed']);
  }

}
