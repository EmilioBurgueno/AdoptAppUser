import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { DogService } from 'src/app/services/dog.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-adoption',
  templateUrl: './adoption.page.html',
  styleUrls: ['./adoption.page.scss'],
})
export class AdoptionPage implements OnInit {

  @Input() dID: string;
  dog: any;
  user: any;
  dogId: string;
  userId: string;
  test: any[];
  file: any;
  loadingIndicator;
  loading = false;

  constructor(private dogService: DogService,
    private authService: AuthService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.getDog(this.dID);
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  getDog(dogId: string) {
    this.dogService.getDog(dogId).subscribe((dogprofile: any) => {
      if (!dogprofile) {
        this.navCtrl.navigateRoot(['tabs/feed']);
      }
      this.dog = dogprofile;
    });
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
            this.closeModal();
          }
        }
      ]
    });

    await alert.present();
  }

  async sendApplication() {
    await this.presentLoading('Guardando el perfil...');
    this.test = this.dog.adoptees
    this.test.push(this.user.id)
    const updatedDog = {
      adoptees: this.test
    };
    console.log(updatedDog);
    try {
      await this.dogService.updateDog(this.dog.id.toString(), updatedDog, this.file);
      this.dismissLoading();
      this.presentAlertConfirm('¡Exito!', 'El perfil ha sido modificado exitosamente.');
      this.closeModal();
    } catch (error) {
      this.dismissLoading();
      this.presentAlert('Algo malo ha pasado', error.message);
    }
  }

}
