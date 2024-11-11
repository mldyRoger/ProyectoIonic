import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SplitPanePage } from './split-pane.page';

const routes: Routes = [
  {
    path: '',
    component: SplitPanePage,
    children: [
      {
        path: '',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SplitPanePageRoutingModule {}
