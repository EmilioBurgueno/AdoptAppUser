import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DogProfilePageRoutingModule } from './dog-profile-routing.module';

import { DogProfilePage } from './dog-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DogProfilePageRoutingModule
  ],
  declarations: [DogProfilePage]
})
export class DogProfilePageModule {}
