import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExperimentsComponent } from './experiment/experiments/experiments.component';
import { ExperimentDefinitionComponent } from './experiment/experiment-definition/experiment-definition.component';
import { AuthGuard } from '../../../database/auth.guard';
import { CreateHypoMoMapComponent } from './api/create-hypo-mo-map/create-hypo-mo-map.component';
import { AddHypothesesComponent } from './api/add-hypotheses/add-hypotheses.component';
import { AddExperimentsComponent } from './api/add-experiments/add-experiments.component';
import { ExecuteExperimentsComponent } from './api/execute-experiments/execute-experiments.component';
import { EditHypoMoMapComponent } from './api/edit-hypo-mo-map/edit-hypo-mo-map.component';
import { ViewHypoMoMapComponent } from './api/view-hypo-mo-map/view-hypo-mo-map.component';
import { ExperimentDefinitionNavService } from './experiment/experiment-definition/experiment-definition-nav.service';
import { ExperimentDefinitionOverviewComponent } from './experiment/experiment-definition-overview/experiment-definition-overview.component';
import { ExperimentDefinitionGeneralComponent } from './experiment/experiment-definition-general/experiment-definition-general.component';
import { ExperimentDefinitionEditComponent } from './experiment/experiment-definition-edit/experiment-definition-edit.component';
import { ApiNavigationService } from '../../../shared/api-navigation.service';
import { InternalRoles } from '../../../role/user.service';
import { RoleGuard } from '../../../role/role.guard';

const routes: Routes = [
  {
    path: 'hypomomaps',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'artifact/:id/create',
        data: {
          stepName: 'Create HypoMoMap',
        },
        resolve: {
          nav: ApiNavigationService,
        },
        component: CreateHypoMoMapComponent,
      },
      {
        path: 'experiments',
        data: {
          roles: [InternalRoles.DOMAIN_EXPERT],
        },
        canActivate: [RoleGuard],
        children: [
          { path: '', component: ExperimentsComponent },
          {
            path: ':id',
            resolve: {
              nav: ExperimentDefinitionNavService,
            },
            component: ExperimentDefinitionComponent,
            children: [
              {
                path: '',
                redirectTo: 'overview',
                pathMatch: 'full',
              },
              {
                path: 'overview',
                component: ExperimentDefinitionOverviewComponent,
              },
              {
                path: 'general',
                component: ExperimentDefinitionGeneralComponent,
              },
              {
                path: 'edit',
                component: ExperimentDefinitionEditComponent,
              },
            ],
          },
        ],
      },
      {
        path: 'hypomomaps',
        children: [
          {
            path: 'create',
            data: {
              stepName: 'Create HypoMoMap',
            },
            resolve: {
              nav: ApiNavigationService,
            },
            component: CreateHypoMoMapComponent,
          },
          {
            path: ':id',
            children: [
              {
                path: 'version/:versionId',
                children: [
                  {
                    path: 'hypotheses',
                    data: {
                      stepName: 'Add Hypotheses',
                    },
                    resolve: {
                      nav: ApiNavigationService,
                    },
                    component: AddHypothesesComponent,
                  },
                  {
                    path: 'experiments',
                    data: {
                      stepName: 'Add Experiments',
                    },
                    resolve: {
                      nav: ApiNavigationService,
                    },
                    component: AddExperimentsComponent,
                  },
                  {
                    path: 'execute',
                    data: {
                      stepName: 'Execute Experiments',
                    },
                    resolve: {
                      nav: ApiNavigationService,
                    },
                    component: ExecuteExperimentsComponent,
                  },
                  {
                    path: 'edit',
                    data: {
                      stepName: 'Edit HypoMoMap',
                    },
                    resolve: {
                      nav: ApiNavigationService,
                    },
                    component: EditHypoMoMapComponent,
                  },
                  {
                    path: 'view',
                    data: {
                      stepName: 'View HypoMoMap',
                    },
                    resolve: {
                      nav: ApiNavigationService,
                    },
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
export class HypoMoMapToolRoutingModule {}
