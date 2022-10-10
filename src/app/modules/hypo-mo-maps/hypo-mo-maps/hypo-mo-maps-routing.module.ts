import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExperimentsComponent } from './experiments/experiments.component';
import { ExperimentDefinitionComponent } from './experiment-definition/experiment-definition.component';
import { AuthGuard } from '../../../database/auth.guard';
import { CreateHypoMoMapComponent } from './api/create-hypo-mo-map/create-hypo-mo-map.component';
import { AddHypothesesComponent } from './api/add-hypotheses/add-hypotheses.component';
import { AddExperimentsComponent } from './api/add-experiments/add-experiments.component';
import { ExecuteExperimentsComponent } from './api/execute-experiments/execute-experiments.component';
import { EditHypoMoMapComponent } from './api/edit-hypo-mo-map/edit-hypo-mo-map.component';
import { ViewHypoMoMapComponent } from './api/view-hypo-mo-map/view-hypo-mo-map.component';

const routes: Routes = [
  {
    path: 'hypomomaps',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'artifact/:id/create',
        component: CreateHypoMoMapComponent,
      },
      {
        path: 'experiments',
        children: [
          { path: '', component: ExperimentsComponent },
          {
            path: ':id',
            component: ExperimentDefinitionComponent,
          },
        ],
      },
      {
        path: 'hypomomaps',
        children: [
          { path: 'create', component: CreateHypoMoMapComponent },
          {
            path: ':id',
            children: [
              {
                path: 'version/:versionId',
                children: [
                  {
                    path: 'hypotheses',
                    component: AddHypothesesComponent,
                  },
                  {
                    path: 'experiments',
                    component: AddExperimentsComponent,
                  },
                  {
                    path: 'execute',
                    component: ExecuteExperimentsComponent,
                  },
                  {
                    path: 'edit',
                    component: EditHypoMoMapComponent,
                  },
                  {
                    path: 'view',
                    component: ViewHypoMoMapComponent,
                  },
                ],
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
export class HypoMoMapsRoutingModule {}
