import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CameraSource, Plugins, CameraResultType } from '@capacitor/core';
import { ActionSheetController, AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { User } from 'firebase';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-seeprofile',
  templateUrl: './seeprofile.page.html',
  styleUrls: ['./seeprofile.page.scss'],
})
export class SeeprofilePage implements OnInit {

  user: any;
  userId: string;

  loadingIndicator: any;
  loading = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private activatedRoute: ActivatedRoute,

  ) { }

  ngOnInit() {
    this.userId = this.activatedRoute.snapshot.paramMap.get('userId');
    this.getUser(this.userId);
  }

  getUser(uID: string) {
    this.userService.getUser(uID).subscribe((user) => {
      this.user = user as User;
    });
  }

  async getPicture(source: CameraSource): Promise<boolean> {
    const image = await Plugins.Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source
    });

    const imageBlob = this.base64toBlob(image.base64String);
    const file = new File([imageBlob], 'test.jpeg', { type: 'image/jpeg' });

    await this.presentLoading('Cambiando tu Foto de Perfil...');

    this.userService.uploadProfilePicture(this.user.id, file).then(() => {
      this.dismissLoading();
      this.presentAlert('Hecho!', 'Tu foto de perfil ha sido cambiada con exito.');
    }).catch((error) => {
      this.dismissLoading();
      this.presentAlert('Error', error.message);
    });

    return;
  }

  base64toBlob(dataURI: string) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });

    return blob;
  }

  async removePicture(): Promise<boolean> {
    await this.presentLoading('Removiendo tu Foto de Perfil...');

    if (this.user.pictureUrl) {
      this.userService.removeProfilePicture(this.user.id).then(() => {
        this.dismissLoading();
        this.presentAlert('Hecho!', 'Tu foto de perfil ha sido removida con exito!');
      }).catch((error) => {
        this.dismissLoading();
        this.presentAlert('Error', error.message);
      });
    } else {
      this.dismissLoading();
      this.presentAlert('Error', `No tienes foto de perfil.`);
    }

    return;
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Cambiar Foto de Perfil',
      buttons: [
        {
          text: 'Remover Foto Actual',
          handler: () => this.removePicture()
        },
        {
          text: 'Tomar Foto',
          handler: () => this.getPicture(CameraSource.Camera)
        },
        {
          text: 'Elegir de Galeria',
          handler: () => this.getPicture(CameraSource.Photos)
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
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
      buttons: ['Listo!']
    });

    await alert.present();
  }

  logout(): void {
    this.authService.logout().then(() => {
      this.navCtrl.navigateRoot(['']);
    });
  }

}
