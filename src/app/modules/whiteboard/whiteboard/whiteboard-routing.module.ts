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

const routes: Routes = [
  {
    path: 'whiteboard',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'templates',
        children: [
          { path: '', component: WhiteboardTemplatesComponent },
          {
            path: ':id',
            component: WhiteboardTemplateComponent,
            canDeactivate: [WhiteboardChangeGuard],
          },
        ],
      },
      {
        path: 'instance',
        children: [
          { path: 'create', component: CreateWhiteboardInstanceComponent },
          {
            path: ':id',
            children: [
              {
                path: 'edit',
                component: EditWhiteboardInstanceComponent,
                canDeactivate: [WhiteboardChangeGuard],
              },
              { path: 'view', component: ViewWhiteboardInstanceComponent },
            ],
          },
        ],
      },
      {
        path: 'artifact/:id/create',
        component: CreateWhiteboardInstanceManuallyComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WhiteboardRoutingModule {}
