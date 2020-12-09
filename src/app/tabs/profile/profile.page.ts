import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NavController, ModalController, ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
//import { EditProfilePage } from '../modals/edit-profile/edit-profile.page';
import { Dog } from 'models/dog.model';
import { DogService } from 'src/app/services/dog.service';
//import { DogProfilePage } from '../modals/dog-profile/dog-profile.page';
import { UserService } from 'src/app/services/user.service';
//import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: any;
  favourites: Dog[] = [];

  loadingIndicator: any;
  loading = false

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController) { }

  async ngOnInit() {
    await this.authService.user$.subscribe((user) => {
      this.user = user;
      this.getFavourites();
    });
  }

  getFavourites() {
    this.favourites = this.userService.getFavourites(this.user)
  }

  goToActive() {
    this.navCtrl.navigateForward(['tabs', 'profile', 'active'])
  }

  // async openModalDogProfile(dog: string) {
  //   const modal = await this.modalCtrl.create({
  //   component: DogProfilePage,
  //   componentProps: {
  //   dID: dog
  //   }
  //   });
  //   return await modal.present();
  // }

  logout(): void {
    this.authService.logout().then(() => {
      this.navCtrl.navigateRoot(['']);
    });
  }

  // async openModalEdit(user: string) {
  //   const modal = await this.modalCtrl.create({
  //     component: EditProfilePage,
  //     componentProps: {
  //       uID: user
  //     }
  //   });
  //   return await modal.present();
  // }



  // async getPicture(source: CameraSource): Promise<boolean> {
  //   const image = await Plugins.Camera.getPhoto({
  //     quality: 100,
  //     allowEditing: false,
  //     resultType: CameraResultType.Base64,
  //     source
  //   });

  //   const imageBlob = this.base64toBlob(image.base64String);
  //   const file = new File([imageBlob], 'test.jpeg', { type: 'image/jpeg' });

  //   await this.presentLoading('Cambiando tu Foto de Perfil...');

  //   this.userService.uploadProfilePicture(this.user.id, file).then(() => {
  //     this.dismissLoading();
  //     this.presentAlert('Hecho!', 'Tu foto de perfil ha sido cambiada con exito.');
  //   }).catch((error) => {
  //     this.dismissLoading();
  //     this.presentAlert('Error', error.message);
  //   });

  //   return;
  // }

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

  // async presentActionSheet() {
  //   const actionSheet = await this.actionSheetCtrl.create({
  //     header: 'Cambiar Foto de Perfil',
  //     buttons: [
  //       {
  //         text: 'Remover Foto Actual',
  //         handler: () => this.removePicture()
  //       },
  //       {
  //         text: 'Tomar Foto',
  //         handler: () => this.getPicture(CameraSource.Camera)
  //       },
  //       {
  //         text: 'Elegir de Galeria',
  //         handler: () => this.getPicture(CameraSource.Photos)
  //       },
  //       {
  //         text: 'Cancelar',
  //         role: 'cancel'
  //       }
  //     ]
  //   });
  //   await actionSheet.present();
  // }

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
}
