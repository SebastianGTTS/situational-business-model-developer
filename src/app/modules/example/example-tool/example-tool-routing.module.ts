import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../database/auth.guard';
import { ExampleCreateComponent } from './api/example-create/example-create.component';
import { ExampleEditComponent } from './api/example-edit/example-edit.component';
import { ExampleViewComponent } from './api/example-view/example-view.component';
import { ApiNavigationService } from '../../../shared/api-navigation.service';

const routes: Routes = [
  {
    path: 'example',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'examples',
        children: [
          {
            path: 'create',
            data: {
              stepName: 'Create Example',
            },
            resolve: {
              nav: ApiNavigationService,
            },
            component: ExampleCreateComponent,
          },
          {
            path: ':id/create',
            data: {
              stepName: 'Create Example',
            },
            resolve: {
              nav: ApiNavigationService,
            },
            component: ExampleCreateComponent,
          },
          {
            path: ':id',
            children: [
              {
                path: 'edit',
                data: {
                  stepName: 'Edit Example',
                },
                resolve: {
                  nav: ApiNavigationService,
                },
                component: ExampleEditComponent,
              },
              {
                path: 'view',
                data: {
                  stepName: 'View Example',
                },
                resolve: {
                  nav: ApiNavigationService,
                },
                component: ExampleViewComponent,
              },
            ],
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExampleToolRoutingModule {}
