import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MergeModelViewComponent } from './merge/merge-model-view/merge-model-view.component';
import { ExpertModelsComponent } from './expert-model/expert-models/expert-models.component';
import { ExpertModelComponent } from './expert-model/expert-model/expert-model.component';
import { ExpertModelEditComponent } from './expert-model/expert-model-edit/expert-model-edit.component';
import { PatternComponent } from './instances/pattern/pattern.component';
import { ExampleComponent } from './instances/example/example.component';
import { CompanyModelEditComponent } from './company-model/company-model-edit/company-model-edit.component';
import { CompanyModelsComponent } from './company-model/company-models/company-models.component';
import { CompanyModelComponent } from './company-model/company-model/company-model.component';
import { CreateCanvasComponent } from './api/create-canvas/create-canvas.component';
import { EditCanvasComponent } from './api/edit-canvas/edit-canvas.component';
import { CanvasDefinitionsComponent } from './canvas-definition/canvas-definitions/canvas-definitions.component';
import { CanvasDefinitionComponent } from './canvas-definition/canvas-definition/canvas-definition.component';
import { CompanyModelSelectExpertKnowledgeComponent } from './company-model/company-model-select-expert-knowledge/company-model-select-expert-knowledge.component';
import { CompareComponent } from './api/compare/compare.component';
import { CreateCompetitorCanvasComponent } from './api/create-competitor-canvas/create-competitor-canvas.component';
import { EditCompetitorsComponent } from './api/edit-competitors/edit-competitors.component';
import { EditCompetitorCanvasComponent } from './api/edit-competitor-canvas/edit-competitor-canvas.component';
import { RefineCanvasComponent } from './api/refine-canvas/refine-canvas.component';
import { ViewCanvasComponent } from './api/view-canvas/view-canvas.component';
import { EditModelComponent } from './api/edit-model/edit-model.component';
import { AuthGuard } from '../../../database/auth.guard';
import { CanvasElementsComponent } from './elements/canvas-elements/canvas-elements.component';
import { CreateCanvasManuallyComponent } from './api/create-canvas-manually/create-canvas-manually.component';
import { CanvasDefinitionNavService } from './canvas-definition/canvas-definition/canvas-definition-nav.service';
import { CanvasDefinitionGeneralComponent } from './canvas-definition/canvas-definition-general/canvas-definition-general.component';
import { CanvasDefinitionModelComponent } from './canvas-definition/canvas-definition-model/canvas-definition-model.component';
import { CanvasDefinitionOverviewComponent } from './canvas-definition/canvas-definition-overview/canvas-definition-overview.component';
import { ExpertModelNavService } from './expert-model/expert-model/expert-model-nav.service';
import { ExpertModelInstancesComponent } from './expert-model/expert-model-instances/expert-model-instances.component';
import { ExpertModelGeneralComponent } from './expert-model/expert-model-general/expert-model-general.component';
import { ExpertModelOverviewComponent } from './expert-model/expert-model-overview/expert-model-overview.component';
import { ExampleNavService } from './instances/example/example-nav.service';
import { InstanceOverviewComponent } from './instances/instance-overview/instance-overview.component';
import { InstanceGeneralComponent } from './instances/instance-general/instance-general.component';
import { ExampleEditComponent } from './instances/example-edit/example-edit.component';
import { PatternNavService } from './instances/pattern/pattern-nav.service';
import { PatternEditComponent } from './instances/pattern-edit/pattern-edit.component';
import { CompanyModelNavService } from './company-model/company-model/company-model-nav.service';
import { CompanyModelGeneralComponent } from './company-model/company-model-general/company-model-general.component';
import { CompanyModelOverviewComponent } from './company-model/company-model-overview/company-model-overview.component';
import { CompanyModelMergeComponent } from './company-model/company-model-merge/company-model-merge.component';
import { MergeModelViewNavService } from './merge/merge-model-view/merge-model-view-nav.service';
import { CompanyModelSelectExpertKnowledgeNavService } from './company-model/company-model-select-expert-knowledge/company-model-select-expert-knowledge-nav.service';
import { ApiNavigationService } from '../../../shared/api-navigation.service';
import { EditCompetitorCanvasNavService } from './api/edit-competitor-canvas/edit-competitor-canvas-nav.service';
import { InternalRoles } from '../../../role/user.service';
import { RoleGuard } from '../../../role/role.guard';

const routes: Routes = [
  {
    path: 'canvas',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'definitions',
        component: CanvasDefinitionsComponent,
        data: {
          roles: [InternalRoles.DOMAIN_EXPERT],
        },
        canActivate: [RoleGuard],
      },
      {
        path: 'definitions/:id',
        component: CanvasDefinitionComponent,
        data: {
          roles: [InternalRoles.DOMAIN_EXPERT],
        },
        canActivate: [RoleGuard],
        resolve: {
          nav: CanvasDefinitionNavService,
        },
        children: [
          {
            path: '',
            redirectTo: 'overview',
            pathMatch: 'full',
          },
          {
            path: 'overview',
            component: CanvasDefinitionOverviewComponent,
          },
          {
            path: 'general',
            component: CanvasDefinitionGeneralComponent,
          },
          {
            path: 'model',
            component: CanvasDefinitionModelComponent,
          },
        ],
      },
      {
        path: 'instance/create',
        data: {
          stepName: 'Create Canvas',
        },
        resolve: {
          nav: ApiNavigationService,
        },
        component: CreateCanvasComponent,
      },
      {
        path: 'artifact/:id/create',
        data: {
          stepName: 'Create Canvas',
        },
        resolve: {
          nav: ApiNavigationService,
        },
        component: CreateCanvasManuallyComponent,
      },
      {
        path: ':companyModelId/instance/:instanceId',
        children: [
          {
            path: 'edit',
            data: {
              stepName: 'Edit Canvas',
            },
            resolve: {
              nav: ApiNavigationService,
            },
            component: EditCanvasComponent,
          },
          {
            path: 'refine',
            data: {
              stepName: 'Refine Canvas',
            },
            resolve: {
              nav: ApiNavigationService,
            },
            component: RefineCanvasComponent,
          },
          {
            path: 'view',
            data: {
              stepName: 'View Canvas',
            },
            resolve: {
              nav: ApiNavigationService,
            },
            component: ViewCanvasComponent,
          },
          {
            path: 'model/edit',
            data: {
              stepName: 'Edit Model',
            },
            resolve: {
              nav: ApiNavigationService,
            },
            component: EditModelComponent,
          },
          {
            path: 'competitors',
            children: [
              {
                path: '',
                data: {
                  stepName: 'Create Competitor Canvas',
                },
                resolve: {
                  nav: ApiNavigationService,
                },
                component: CreateCompetitorCanvasComponent,
              },
              {
                path: 'edit',
                data: {
                  stepName: 'Edit Competitors',
                },
                resolve: {
                  nav: ApiNavigationService,
                },
                component: EditCompetitorsComponent,
              },
              {
                path: ':competitorId/edit',
                resolve: {
                  nav: EditCompetitorCanvasNavService,
                },
                component: EditCompetitorCanvasComponent,
              },
            ],
          },
          {
            path: 'compare',
            data: {
              stepName: 'Compare Canvas',
            },
            resolve: {
              nav: ApiNavigationService,
            },
            component: CompareComponent,
          },
        ],
      },
    ],
  },
  {
    path: 'companyModels',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: CompanyModelsComponent,
        data: {
          roles: [InternalRoles.METHOD_ENGINEER],
        },
        canActivate: [RoleGuard],
      },
      {
        path: ':id',
        component: CompanyModelComponent,
        data: {
          roles: [InternalRoles.METHOD_ENGINEER],
        },
        canActivate: [RoleGuard],
        resolve: {
          nav: CompanyModelNavService,
        },
        children: [
          {
            path: '',
            redirectTo: 'overview',
            pathMatch: 'full',
          },
          {
            path: 'overview',
            component: CompanyModelOverviewComponent,
          },
          {
            path: 'general',
            component: CompanyModelGeneralComponent,
          },
          {
            path: 'edit',
            component: CompanyModelEditComponent,
          },
          {
            path: 'merge',
            component: CompanyModelMergeComponent,
          },
        ],
      },
      {
        path: ':id/select',
        data: {
          roles: [
            InternalRoles.METHOD_ENGINEER,
            InternalRoles.BUSINESS_DEVELOPER,
          ],
        },
        canActivate: [RoleGuard],
        resolve: {
          nav: CompanyModelSelectExpertKnowledgeNavService,
        },
        component: CompanyModelSelectExpertKnowledgeComponent,
      },
    ],
  },
  {
    path: 'expertModels',
    data: {
      roles: [InternalRoles.DOMAIN_EXPERT],
    },
    canActivate: [AuthGuard, RoleGuard],
    children: [
      { path: '', component: ExpertModelsComponent },
      {
        path: ':id',
        component: ExpertModelComponent,
        resolve: {
          nav: ExpertModelNavService,
        },
        children: [
          {
            path: '',
            redirectTo: 'overview',
            pathMatch: 'full',
          },
          {
            path: 'overview',
            component: ExpertModelOverviewComponent,
          },
          {
            path: 'general',
            component: ExpertModelGeneralComponent,
          },
          {
            path: 'edit',
            component: ExpertModelEditComponent,
          },
          {
            path: 'instances',
            component: ExpertModelInstancesComponent,
          },
        ],
      },
      {
        path: ':id/examples/:instanceId',
        component: ExampleComponent,
        resolve: {
          nav: ExampleNavService,
        },
        children: [
          {
            path: '',
            redirectTo: 'overview',
            pathMatch: 'full',
          },
          {
            path: 'overview',
            component: InstanceOverviewComponent,
          },
          {
            path: 'general',
            component: InstanceGeneralComponent,
          },
          {
            path: 'edit',
            component: ExampleEditComponent,
          },
        ],
      },
      {
        path: ':id/patterns/:instanceId',
        component: PatternComponent,
        resolve: {
          nav: PatternNavService,
        },
        children: [
          {
            path: '',
            redirectTo: 'overview',
            pathMatch: 'full',
          },
          {
            path: 'overview',
            component: InstanceOverviewComponent,
          },
          {
            path: 'general',
            component: InstanceGeneralComponent,
          },
          {
            path: 'edit',
            component: PatternEditComponent,
          },
        ],
      },
    ],
  },
  {
    path: 'merge',
    data: {
      roles: [InternalRoles.METHOD_ENGINEER, InternalRoles.BUSINESS_DEVELOPER],
    },
    canActivate: [AuthGuard, RoleGuard],
    children: [
      {
        path: ':companyModelId/:expertModelId',
        resolve: {
          nav: MergeModelViewNavService,
        },
        component: MergeModelViewComponent,
      },
    ],
  },
  {
    path: 'canvasElements',
    component: CanvasElementsComponent,
    data: {
      roles: [InternalRoles.DOMAIN_EXPERT],
    },
    canActivate: [AuthGuard, RoleGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CanvasToolRoutingModule {}
