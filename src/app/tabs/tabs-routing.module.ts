import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule)
          }
        ]
      },
      {
        path: 'feed',
        children: [
          {
            path: '',
            loadChildren: () => import('./feed/feed.module').then(m => m.FeedPageModule)
          }
        ]
      }
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/profile',
    pathMatch: 'full'
  },
  {
    path: 'dogprofile',
    loadChildren: () => import('./modals/dog-profile/dog-profile.module').then( m => m.DogProfilePageModule)
  },
  {
    path: 'adoption',
    loadChildren: () => import('./modals/adoption/adoption.module').then( m => m.AdoptionPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule { }
