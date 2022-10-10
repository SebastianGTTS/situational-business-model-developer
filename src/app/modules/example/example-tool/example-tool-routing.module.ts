import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../database/auth.guard';
import { ExampleCreateComponent } from './api/example-create/example-create.component';
import { ExampleEditComponent } from './api/example-edit/example-edit.component';
import { ExampleViewComponent } from './api/example-view/example-view.component';

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
            component: ExampleCreateComponent,
          },
          {
            path: ':id/create',
            component: ExampleCreateComponent,
          },
          {
            path: ':id',
            children: [
              {
                path: 'edit',
                component: ExampleEditComponent,
              },
              {
                path: 'view',
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
