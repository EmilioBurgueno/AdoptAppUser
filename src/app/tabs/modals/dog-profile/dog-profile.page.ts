import { NavController, ModalController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { DogService } from 'src/app/services/dog.service';
import { Component, OnInit, Input } from '@angular/core';
import { AdoptionPage } from '../adoption/adoption.page';

@Component({
  selector: 'app-dog-profile',
  templateUrl: './dog-profile.page.html',
  styleUrls: ['./dog-profile.page.scss'],
})
export class DogProfilePage implements OnInit {

  @Input() dID: string;
  dog: any;
  user: any;
  dogId: string;
  userId: string;

  constructor(private dogService: DogService,
    private authService: AuthService,
    private userService: UserService,
    private navCtrl: NavController,
    private modalCtrl: ModalController) { }

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

  async openModalAdopt(dog: string) {
    const modal = await this.modalCtrl.create({
      component: AdoptionPage,
      componentProps: {
        dID: dog
      }
    });
    return await modal.present();
  }

  toggleLike() {
    if (this.user.favourites.includes(this.dog.id)) {
      this.user.favourites = this.user.favourites.filter((id: string) => id !== this.dog.id);

      this.userService.unfavDog(this.user, this.dog.id).then(() => {
        console.log('disliked');
      }).catch((error) => {
        console.log(error);
      });
    } else {
      this.user.favourites.push(this.dog.id);

      this.userService.favDog(this.user, this.dog.id).then(() => {
        console.log('liked');
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }

}
