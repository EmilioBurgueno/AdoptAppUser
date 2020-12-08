import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
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

  constructor(private dogService: DogService,
    private authService: AuthService,
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

  async closeModal() {
    await this.modalCtrl.dismiss();
  }

  sendApplication() {
    //this.dog.adoptees.push(this.user.name)
    console.log(this.user)
  }

}
