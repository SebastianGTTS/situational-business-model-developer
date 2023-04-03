import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../database/auth.guard';
import { WhiteboardTemplatesComponent } from './whiteboard-templates/whiteboard-templates.component';
import { WhiteboardTemplateComponent } from './whiteboard-template/whiteboard-template.component';
import { CreateWhiteboardInstanceComponent } from './api/create-whiteboard-instance/create-whiteboard-instance.component';
import { EditWhiteboardInstanceComponent } from './api/edit-whiteboard-instance/edit-whiteboard-instance.component';
import { ViewWhiteboardInstanceComponent } from './api/view-whiteboard-instance/view-whiteboard-instance.component';
import { WhiteboardChangeGuard } from './shared/whiteboard-change.guard';
import { CreateWhiteboardInstanceManuallyComponent } from './api/create-whiteboard-instance-manually/create-whiteboard-instance-manually.component';
import { WhiteboardTemplateNavService } from './whiteboard-template/whiteboard-template-nav.service';
import { WhiteboardTemplateOverviewComponent } from './whiteboard-template-overview/whiteboard-template-overview.component';
import { WhiteboardTemplateGeneralComponent } from './whiteboard-template-general/whiteboard-template-general.component';
import { WhiteboardTemplateEditComponent } from './whiteboard-template-edit/whiteboard-template-edit.component';
import { ApiNavigationService } from '../../../shared/api-navigation.service';
import { InternalRoles } from '../../../role/user.service';
import { RoleGuard } from '../../../role/role.guard';

const routes: Routes = [
  {
    path: 'whiteboard',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'templates',
        data: {
          roles: [InternalRoles.DOMAIN_EXPERT],
        },
        canActivate: [RoleGuard],
        children: [
          { path: '', component: WhiteboardTemplatesComponent },
          {
            path: ':id',
            resolve: {
              nav: WhiteboardTemplateNavService,
            },
            component: WhiteboardTemplateComponent,
            children: [
              {
                path: '',
                redirectTo: 'overview',
                pathMatch: 'full',
              },
              {
                path: 'overview',
                component: WhiteboardTemplateOverviewComponent,
              },
              {
                path: 'general',
                component: WhiteboardTemplateGeneralComponent,
              },
              {
                path: 'edit',
                canDeactivate: [WhiteboardChangeGuard],
                component: WhiteboardTemplateEditComponent,
              },
            ],
          },
        ],
      },
      {
        path: 'instance',
        children: [
          {
            path: 'create',
            data: {
              stepName: 'Create Whiteboard',
            },
            resolve: {
              nav: ApiNavigationService,
            },
            component: CreateWhiteboardInstanceComponent,
          },
          {
            path: ':id',
            children: [
              {
                path: 'edit',
                data: {
                  stepName: 'Edit Whiteboard',
                },
                resolve: {
                  nav: ApiNavigationService,
                },
                component: EditWhiteboardInstanceComponent,
                canDeactivate: [WhiteboardChangeGuard],
              },
              {
                path: 'view',
                data: {
                  stepName: 'View Whiteboard',
                },
                resolve: {
                  nav: ApiNavigationService,
                },
                component: ViewWhiteboardInstanceComponent,
              },
            ],
          },
        ],
      },
      {
        path: 'artifact/:id/create',
        data: {
          stepName: 'Create Whiteboard',
        },
        resolve: {
          nav: ApiNavigationService,
        },
        component: CreateWhiteboardInstanceManuallyComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WhiteboardToolRoutingModule {}
