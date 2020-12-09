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
          },
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
      },
      {
        path: 'settings',
        children: [
          {
            path: '', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsPageModule)
          },
          {
            path: 'editprofile/:userId', loadChildren: () => import('./settingssub/editprofile/editprofile.module').then(m => m.EditprofilePageModule)
          },
          {
            path: 'seeprofile/:userId', loadChildren: () => import('./settingssub/seeprofile/seeprofile.module').then(m => m.SeeprofilePageModule)
          },
          {
            path: 'changepass/:userId', loadChildren: () => import('./settingssub/changepass/changepass.module').then(m => m.ChangepassPageModule)
          },
          {
            path: 'logout/:userId', loadChildren: () => import('./settingssub/logout/logout.module').then(m => m.LogoutPageModule)
          },
          {
            path: 'delete/:userId', loadChildren: () => import('./settingssub/delete/delete.module').then(m => m.DeletePageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/profile',
        pathMatch: 'full'
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
    loadChildren: () => import('./modals/dog-profile/dog-profile.module').then(m => m.DogProfilePageModule)
  },
  {
    path: 'adoption',
    loadChildren: () => import('./modals/adoption/adoption.module').then(m => m.AdoptionPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule { }
