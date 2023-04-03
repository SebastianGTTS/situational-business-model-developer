import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../database/auth.guard';
import { TutorialOverviewComponent } from './tutorial-overview/tutorial-overview.component';

const routes: Routes = [
  {
    path: 'tutorial',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'overview',
        component: TutorialOverviewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TutorialRoutingModule {}
