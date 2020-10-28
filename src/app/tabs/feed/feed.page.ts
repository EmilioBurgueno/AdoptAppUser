import { DogProfilePage } from './../modals/dog-profile/dog-profile.page';
import { NavController, ModalController } from '@ionic/angular';
import { DogService } from 'src/app/services/dog.service';
import { Dog } from 'src/models/dog.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  Dogs: Dog[] = [];

  constructor(
    private dogService: DogService,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.getDogs();
  }

  getDogs() {
    this.dogService.getDogs().subscribe(dogs => {
      this.Dogs = dogs;
    });
  }

  async openModalDogProfile(dog: string) {
    const modal = await this.modalCtrl.create({
      component: DogProfilePage,
      componentProps: {
        dID: dog
      }
    });
    return await modal.present();
  }

  goToDesc(dogId: string) {
    this.navCtrl.navigateForward(['tabs', 'feed', 'dogprofile', dogId]);
  }

}
